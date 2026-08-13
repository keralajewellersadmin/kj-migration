import { NextResponse } from "next/server";
import {
  findDirectAdminUser,
  getLoginSql,
} from "@/lib/auth/admin-login";
import { generateOtp, hashValue, sendOtpEmail } from "@/lib/auth/email";

const RESEND_COOLDOWN_MS = 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body as { userId?: string | number };

    if (!userId) {
      return NextResponse.json(
        { error: "Verification session is missing" },
        { status: 400 },
      );
    }

    const sql = getLoginSql();
    const users = (await sql.query(
      `select email from admin_users where id = $1 and is_active = true limit 1`,
      [Number(userId)],
    )) as Array<{ email: string }>;
    const user = users[0] ? await findDirectAdminUser(users[0].email) : null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recent = (await sql.query(
      `select created_at, session_token from login_otps where user_id = $1 order by created_at desc limit 1`,
      [user.id],
    )) as Array<{ created_at: string; session_token: string | null }>;

    if (recent[0]) {
      const diffMs = Date.now() - new Date(recent[0].created_at).getTime();
      if (diffMs < RESEND_COOLDOWN_MS) {
        return NextResponse.json(
          { error: "Please wait before requesting a new code" },
          { status: 429 },
        );
      }
    }

    await sql.query(`delete from login_otps where user_id = $1`, [user.id]);

    const otp = generateOtp();
    await sql.query(
      `insert into login_otps (user_id, code_hash, expires_at, attempts, session_token, updated_at, created_at)
       values ($1, $2, $3, 0, $4, now(), now())`,
      [
        user.id,
        hashValue(otp),
        new Date(Date.now() + 10 * 60 * 1000),
        recent[0]?.session_token ?? null,
      ],
    );

    await sendOtpEmail(user.email, otp);
    return NextResponse.json({ success: true, message: "New code sent" });
  } catch (err) {
    console.error("[OTP] Resend failed:", err);
    return NextResponse.json(
      { error: "Failed to resend code" },
      { status: 500 },
    );
  }
}
