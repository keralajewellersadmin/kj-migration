import { NextResponse } from "next/server";
import { ADMIN_PATH } from "@/lib/admin-path";
import { hashValue } from "@/lib/auth/email";
import {
  findDirectAdminUser,
  getLoginSql,
  SESSION_MAX_AGE,
  createPayloadAdminSession,
  signPayloadTokenWithSession,
  DirectAdminUser,
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

    // --- LOCAL FALLBACK ---
    if (!process.env.DATABASE_URL) {
      try {
        const Database = (await import("better-sqlite3")).default;
        const db = new Database("C:/Users/mdsar/AppData/Local/Temp/kerala-cms/dev-local-cms.db");
        
        let resolvedUserId = Number(userId || 0);
        if (!resolvedUserId && identifier?.trim()) {
          const normalized = identifier.trim().toLowerCase();
          const userRow = db.prepare("SELECT id FROM admin_users WHERE lower(email) = ? OR lower(username) = ? LIMIT 1").get(normalized, normalized) as { id: number } | undefined;
          resolvedUserId = userRow ? userRow.id : 0;
        }

        if (!resolvedUserId) return NextResponse.json({ error: "Verification session is missing. Please log in again." }, { status: 400 });

        const otpRecord = db.prepare("SELECT id, user_id, code_hash, expires_at, attempts, session_token FROM login_otps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(resolvedUserId) as { id: number; attempts: number; expires_at: string; code_hash: string; session_token: string; user_id: number } | undefined;
        
        if (!otpRecord) return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 });
        if ((otpRecord.attempts || 0) >= MAX_ATTEMPTS) return NextResponse.json({ error: "Too many failed attempts. Please request a new code." }, { status: 429 });
        if (new Date() > new Date(otpRecord.expires_at)) return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });

        if (hashValue(code) !== otpRecord.code_hash) {
          db.prepare("UPDATE login_otps SET attempts = coalesce(attempts, 0) + 1, updated_at = ? WHERE id = ?").run(new Date().toISOString(), otpRecord.id);
          return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        const user = db.prepare("SELECT id, email, username, name, role, is_active, salt, hash FROM admin_users WHERE id = ? LIMIT 1").get(otpRecord.user_id) as DirectAdminUser | undefined;
        if (!user || !user.is_active) return NextResponse.json({ error: "Invalid user" }, { status: 401 });
        if (!otpRecord.session_token) return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 400 });

        db.prepare("DELETE FROM login_otps WHERE id = ?").run(otpRecord.id);

        const crypto = await import("crypto");
        const sid = crypto.randomUUID();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE * 1000);
        
        db.prepare("DELETE FROM admin_users_sessions WHERE _parent_id = ? AND expires_at <= ?").run(user.id, now.toISOString());
        const orderRow = db.prepare("SELECT coalesce(max(_order), -1) + 1 as next_order FROM admin_users_sessions WHERE _parent_id = ?").get(user.id) as { next_order: number } | undefined;
        const nextOrder = orderRow ? orderRow.next_order : 0;
        db.prepare("INSERT INTO admin_users_sessions (_parent_id, _order, id, created_at, expires_at) VALUES (?, ?, ?, ?, ?)")
          .run(user.id, nextOrder, sid, now.toISOString(), expiresAt.toISOString());

        const payloadToken = await signPayloadTokenWithSession(user, sid);

        return withPayloadSession(
          {
            success: true,
            redirectTo: ADMIN_PATH,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
          },
          payloadToken
        );
      } catch (err) {
        console.error("[Local OTP Fallback] Verification error:", err);
        return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
      }
    }
    // --- END LOCAL FALLBACK ---

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

    console.log("[AUTH] OTP verified = true");
    console.log("[AUTH] Direct Payload session creation started = true");

    // Generate a Payload-compatible session row directly to avoid Vercel TCP DB timeouts.
    const sessionId = await createPayloadAdminSession(user.id);
    const payloadToken = await signPayloadTokenWithSession(user, sessionId);

    console.log("[AUTH] Direct Payload session creation succeeded = true");
    console.log(`[AUTH] user ID = ${user.id}`);
    console.log("[AUTH] Payload session created = true");
    console.log(`[AUTH] redirect = ${ADMIN_PATH}`);

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
