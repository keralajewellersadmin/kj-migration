import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCachedPayload } from "@/lib/payload-singleton";
import { hashValue } from "@/lib/auth/email";
import { validateAdminPassword } from "@/lib/payload/security";
import { getLoginSql } from "@/lib/auth/admin-login";

const IP_RATE_LIMIT = 10; // max 10 reset attempts per hour per IP
const IP_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
    .split(",")[0]
    .trim();
}

export async function POST(request: Request) {
  const body = await request.json();
  const { token, password } = body as { token?: string; password?: string };

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and new password are required" },
      { status: 400 },
    );
  }

  // IP-based rate limiting
  const ip = getClientIp(request);
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
  const rateLimitKey = `reset:ip:${ipHash}`;

  try {
    const sql = getLoginSql();
    const now = new Date().toISOString();
    const resetAt = new Date(Date.now() + IP_WINDOW_MS).toISOString();

    const docs = (await sql.query(
      `select id, count, reset_at from rate_limits where key = $1 limit 1`,
      [rateLimitKey],
    )) as Array<{ id: number; count?: number; reset_at?: string }>;

    const current = docs[0];
    if (!current || String(current.reset_at) < now) {
      if (current) {
        await sql.query(
          `update rate_limits set count = 1, reset_at = $2, updated_at = now() where id = $1`,
          [current.id, resetAt],
        );
      } else {
        await sql.query(
          `insert into rate_limits (key, count, reset_at, updated_at, created_at)
           values ($1, 1, $2, now(), now())`,
          [rateLimitKey, resetAt],
        );
      }
    } else if ((Number(current.count) || 0) >= IP_RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    } else {
      await sql.query(
        `update rate_limits set count = count + 1, updated_at = now() where id = $1`,
        [current.id],
      );
    }
  } catch {
    // Fail closed
    return NextResponse.json(
      { error: "Service is temporarily unavailable." },
      { status: 503 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getCachedPayload();
  const tokenHash = hashValue(token);

  // Find the reset record
  const result = await payload.find({
    collection: "password-resets",
    where: {
      and: [{ tokenHash: { equals: tokenHash } }, { used: { equals: false } }],
    },
    limit: 1,
    overrideAccess: true,
  });

  if (!result.docs.length) {
    return NextResponse.json(
      { error: "Invalid or already used reset link" },
      { status: 400 },
    );
  }

  const resetRecord = result.docs[0];
  const expiresAt = new Date(resetRecord.expiresAt as string);

  if (new Date() > expiresAt) {
    return NextResponse.json(
      { error: "Reset link has expired. Please request a new one." },
      { status: 400 },
    );
  }

  // Get the user to validate password against their data
  const userId =
    (resetRecord.userId as { id: string | number })?.id || resetRecord.userId;
  const user = await payload.findByID({
    collection: "admin-users",
    id: userId as string | number,
    overrideAccess: true,
  });

  // Validate password
  const validation = validateAdminPassword(password, {
    email: user.email,
    name: user.name,
    username: user.username,
  });
  if (validation !== true) {
    return NextResponse.json(
      { error: `Password: ${validation}` },
      { status: 400 },
    );
  }

  // Update password
  await payload.update({
    collection: "admin-users",
    id: userId as string | number,
    data: { password },
    overrideAccess: true,
  });

  // Invalidate all existing sessions for this user
  try {
    const sql = getLoginSql();
    await sql.query(
      `delete from admin_users_sessions where _parent_id = $1`,
      [userId],
    );
  } catch {
    // Non-critical
  }

  // Mark token as used
  await payload.update({
    collection: "password-resets",
    id: resetRecord.id,
    data: { used: true },
    overrideAccess: true,
  });

  return NextResponse.json({
    success: true,
    message: "Password reset successful. Please log in with your new password.",
  });
}
