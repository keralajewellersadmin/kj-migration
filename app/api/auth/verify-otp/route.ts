import crypto from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_PATH } from "@/lib/admin-path";
import {
  findDirectAdminUser,
  getLoginSql,
  SESSION_MAX_AGE,
  createPayloadAdminSession,
  signPayloadTokenWithSession,
} from "@/lib/auth/admin-login";

const MAX_ATTEMPTS = 5;
const IP_RATE_LIMIT = 20; // max 20 OTP verify attempts per hour per IP
const IP_WINDOW_MS = 60 * 60 * 1000;

function withPayloadSession(
  body: Record<string, unknown>,
  token: string,
  status = 200,
) {
  const response = NextResponse.json(body, { status });
  response.cookies.set("payload-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    expires: new Date(Date.now() + SESSION_MAX_AGE * 1000),
  });
  return response;
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
    .split(",")[0]
    .trim();
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, userId, code } = body as {
      identifier?: string;
      userId?: string | number;
      code?: string;
    };

    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Enter the 6-digit verification code" },
        { status: 400 },
      );
    }

    // IP-based rate limiting
    const ip = getClientIp(request);
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
    const rateLimitKey = `otp:ip:${ipHash}`;

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
          { error: "Too many verification attempts. Please try again later." },
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
        { error: "Verification service is temporarily unavailable." },
        { status: 503 },
      );
    }

    const sql = getLoginSql();
    let resolvedUserId = Number(userId || 0);
    if (!resolvedUserId && identifier?.trim()) {
      const resolvedUser = await findDirectAdminUser(identifier.trim());
      resolvedUserId = Number(resolvedUser?.id || 0);
    }

    if (!resolvedUserId) {
      return NextResponse.json(
        { error: "Verification session is missing. Please log in again." },
        { status: 400 },
      );
    }

    const records = (await sql.query(
      `select id, user_id, code_hash, expires_at, attempts, session_token
       from login_otps
       where user_id = $1
       order by created_at desc
       limit 1`,
      [resolvedUserId],
    )) as Array<{
      id: number;
      user_id: number;
      code_hash: string;
      expires_at: string;
      attempts: number | null;
      session_token: string | null;
    }>;

    const otpRecord = records[0];
    if (!otpRecord) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 },
      );
    }

    const attempts = Number(otpRecord.attempts || 0);
    if (attempts >= MAX_ATTEMPTS) {
      // Delete exhausted OTP record
      await sql.query(`delete from login_otps where id = $1`, [otpRecord.id]);
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 429 },
      );
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 },
      );
    }

    const isLocalBypass = process.env.NODE_ENV !== "production" && process.env.OTP_DEV_BYPASS && code === process.env.OTP_DEV_BYPASS;
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (!isLocalBypass && !timingSafeCompare(codeHash, otpRecord.code_hash)) {
      await sql.query(
        `update login_otps set attempts = attempts + 1, updated_at = now() where id = $1`,
        [otpRecord.id],
      );
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 },
      );
    }

    const userRows = (await sql.query(
      `select email from admin_users where id = $1 limit 1`,
      [otpRecord.user_id],
    )) as Array<{ email: string }>;
    const user = userRows[0]
      ? await findDirectAdminUser(userRows[0].email)
      : null;

    if (!user || !user.is_active) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    if (!otpRecord.session_token) {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 400 },
      );
    }

    await sql.query(`delete from login_otps where id = $1`, [otpRecord.id]);

    // Generate a Payload-compatible session row directly to avoid Vercel TCP DB timeouts.
    const sessionId = await createPayloadAdminSession(user.id);
    const payloadToken = await signPayloadTokenWithSession(user, sessionId);

    return withPayloadSession(
      {
        success: true,
        redirectTo: ADMIN_PATH,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      payloadToken,
    );
  } catch (err) {
    console.error("[OTP] Verification failed:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
