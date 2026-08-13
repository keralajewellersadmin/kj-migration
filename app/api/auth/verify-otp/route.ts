import { NextResponse } from "next/server";
import { ADMIN_PATH } from "@/lib/admin-path";
import { hashValue } from "@/lib/auth/email";
import {
  createPayloadAdminSession,
  findDirectAdminUser,
  getLoginSql,
  SESSION_MAX_AGE,
  signPayloadTokenWithSession,
} from "@/lib/auth/admin-login";

const MAX_ATTEMPTS = 5;

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
      `select id, user_id, code_hash, expires_at, attempts
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

    if (hashValue(code) !== otpRecord.code_hash) {
      await sql.query(
        `update login_otps set attempts = attempts + 1, updated_at = now() where id = $1`,
        [otpRecord.id],
      );
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 },
      );
    }

    await sql.query(`delete from login_otps where id = $1`, [otpRecord.id]);

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

    const sessionId = await createPayloadAdminSession(user.id);
    const token = await signPayloadTokenWithSession(user, sessionId);
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
      token,
    );
  } catch (err) {
    console.error("[OTP] Verification failed:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
