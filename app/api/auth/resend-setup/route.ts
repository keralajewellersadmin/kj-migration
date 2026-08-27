/* eslint-disable */
import { NextResponse } from "next/server";
import { getCachedPayload } from "@/lib/payload-singleton";
import {
  findUserByIdentifier,
  generateResetToken,
  hashValue,
  sendWelcomeEmail,
} from "@/lib/auth/email";
import { getLoginSql } from "@/lib/auth/admin-login";

const MAX_RESETS_PER_IP = 5;
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour

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
  const { identifier } = body as { identifier?: string };
  const requestOrigin = new URL(request.url).origin;

  // IP-based rate limit: max 5 resets per hour per IP
  const ip = getClientIp(request);
  const ipHash = hashValue(ip);
  const rateLimitKey = `resend-setup:ip:${ipHash}`;

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
    } else if ((Number(current.count) || 0) >= MAX_RESETS_PER_IP) {
      return NextResponse.json({
        success: true,
        message: "A setup link has been sent.",
      });
    } else {
      await sql.query(
        `update rate_limits set count = count + 1, updated_at = now() where id = $1`,
        [current.id],
      );
    }
  } catch {
    // If rate limit DB is unavailable, deny the request (fail closed)
    return NextResponse.json({
      success: true,
      message: "A setup link has been sent.",
    });
  }

  if (!identifier) {
    return NextResponse.json({
      success: true,
      message: "A setup link has been sent.",
    });
  }

  const payload: any = await getCachedPayload();
  const { user } = await findUserByIdentifier(payload, identifier.trim());

  if (!user) {
    return NextResponse.json({
      success: true,
      message: "A setup link has been sent.",
    });
  }

  if (user.accountActivated === true) {
    return NextResponse.json({
      success: false,
      message: "This account is already activated. Use the Forgot Password flow instead.",
    }, { status: 400 });
  }

  const userId = user.id as string | number;

  // Per-user rate limit: max 3 per hour
  const recentResets = await payload.find({
    collection: "password-resets",
    where: {
      and: [{ userId: { equals: userId } }],
    },
    limit: 10,
    overrideAccess: true,
    sort: "-createdAt",
  });

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = recentResets.docs.filter(
    (doc: Record<string, unknown>) =>
      new Date(doc.createdAt as string) > oneHourAgo,
  ).length;
  if (recentCount >= 3) {
    return NextResponse.json({
      success: true,
      message: "A setup link has been sent.",
    });
  }

  // Generate token
  const rawToken = generateResetToken();
  const tokenHash = hashValue(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  await payload.create({
    collection: "password-resets",
    overrideAccess: true,
    data: {
      userId,
      tokenHash,
      expiresAt,
      used: false,
    },
  });

  // Send setup email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestOrigin;
  const resetUrl = `${siteUrl}/setup-account?token=${rawToken}`;
  try {
    await sendWelcomeEmail(user.email as string, user.name || user.username, resetUrl);
  } catch {
    // Silently fail
  }

  return NextResponse.json({
    success: true,
    message: "A setup link has been sent.",
  });
}
