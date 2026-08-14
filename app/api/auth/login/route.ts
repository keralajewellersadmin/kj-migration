import { NextResponse } from "next/server";
import { ADMIN_PATH } from "@/lib/admin-path";
import {
  generateOtp,
  hashValue,
  sendOtpEmail,
} from "@/lib/auth/email";
import {
  createPayloadAdminSession,
  DirectAdminUser,
  findDirectAdminUser,
  getLoginSql,
  SESSION_MAX_AGE,
  signPayloadTokenWithSession,
  verifyPayloadPassword,
} from "@/lib/auth/admin-login";

const MAX_LOGIN_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const ROUTE_TIMEOUT_MS = 30000;
const STEP_TIMEOUT_MS = 8000;
const RATE_LIMIT_TIMEOUT_MS = 3000;
const DIRECT_DB_TIMEOUT_MS = 8000;

function isOtpEnabled() {
  if (process.env.ADMIN_OTP_ENABLED === "false") return false;
  return (
    Boolean(process.env.GMAIL_OTP_SENDER_EMAIL) &&
    Boolean(process.env.GMAIL_OTP_SENDER_APP_PASSWORD)
  );
}

function getOtpConfigError() {
  if (process.env.ADMIN_OTP_ENABLED === "false") return null;
  const missing = [
    !process.env.GMAIL_OTP_SENDER_EMAIL && "GMAIL_OTP_SENDER_EMAIL",
    !process.env.GMAIL_OTP_SENDER_APP_PASSWORD &&
      "GMAIL_OTP_SENDER_APP_PASSWORD",
  ].filter(Boolean);

  return missing.length
    ? `OTP email is not configured. Missing: ${missing.join(", ")}`
    : null;
}

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

function timeoutResponse() {
  return NextResponse.json(
    {
      error:
        "Login service timed out. Please try again or contact support if it continues.",
    },
    { status: 504 },
  );
}

function isTimeoutError(error: unknown) {
  return error instanceof Error && error.message.includes("timed out after");
}

async function withTimeout<T>(
  label: string,
  promise: Promise<T>,
  timeoutMs = STEP_TIMEOUT_MS,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
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

async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const sql = getLoginSql();
  const resetAt = new Date(Date.now() + windowMs).toISOString();
  const now = new Date().toISOString();
  const docs = await sql.query(
    `select id, count, reset_at from rate_limits where key = $1 limit 1`,
    [key],
  ) as Array<{ id: number; count?: number; reset_at?: string }>;

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
        [key, resetAt],
      );
    }
    return true;
  }

  if ((Number(current.count) || 0) >= limit) return false;
  await sql.query(
    `update rate_limits set count = count + 1, updated_at = now() where id = $1`,
    [current.id],
  );
  return true;
}

async function resetRateLimit(key: string) {
  await getLoginSql().query(`delete from rate_limits where key = $1`, [key]);
}

async function handleLogin(request: Request) {
  const body = await request.json();
  const { identifier, password } = body as {
    identifier?: string;
    password?: string;
  };

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email or username and password are required" },
      { status: 400 },
    );
  }

  // --- LOCAL FALLBACK ---
  // If no Neon Postgres URL is provided, fallback to SQLite directly.
  if (!process.env.DATABASE_URL) {
    try {
      const Database = (await import("better-sqlite3")).default;
      const db = new Database("C:/Users/mdsar/AppData/Local/Temp/kerala-cms/dev-local-cms.db");
      const normalized = identifier.trim().toLowerCase();
      const user = db
        .prepare(
          "SELECT id, email, username, name, role, is_active, salt, hash FROM admin_users WHERE lower(email) = ? OR lower(username) = ? LIMIT 1"
        )
        .get(normalized, normalized) as DirectAdminUser | undefined;

      if (user && user.is_active) {
        const validPassword = await verifyPayloadPassword(password, user);
        if (validPassword) {
          const crypto = await import("crypto");
          if (!isOtpEnabled()) {
            const sid = crypto.randomUUID();
            const now = new Date();
            const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE * 1000);
            
            db.prepare("DELETE FROM admin_users_sessions WHERE _parent_id = ? AND expires_at <= ?").run(user.id, now.toISOString());
            const orderRow = db.prepare("SELECT coalesce(max(_order), -1) + 1 as next_order FROM admin_users_sessions WHERE _parent_id = ?").get(user.id) as { next_order: number } | undefined;
            const nextOrder = orderRow ? orderRow.next_order : 0;
            
            db.prepare("INSERT INTO admin_users_sessions (_parent_id, _order, id, created_at, expires_at) VALUES (?, ?, ?, ?, ?)")
              .run(user.id, nextOrder, sid, now.toISOString(), expiresAt.toISOString());

            const token = await signPayloadTokenWithSession(user, sid);
            return withPayloadSession(
              {
                success: true,
                requiresOtp: false,
                redirectTo: ADMIN_PATH,
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                },
              },
              token
            );
          }

          // OTP Logic
          const otp = generateOtp();
          const codeHash = hashValue(otp);
          const now = new Date();
          const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
          const pendingAuthToken = crypto.randomUUID();

          db.prepare("DELETE FROM login_otps WHERE user_id = ?").run(user.id);
          db.prepare("INSERT INTO login_otps (user_id, code_hash, expires_at, attempts, session_token, updated_at, created_at) VALUES (?, ?, ?, 0, ?, ?, ?)")
            .run(user.id, codeHash, expiresAt, pendingAuthToken, now.toISOString(), now.toISOString());

          try {
            await sendOtpEmail(user.email, otp);
          } catch (emailErr) {
            console.error("[Local Login Fallback] Failed to send OTP email:", emailErr);
            return NextResponse.json(
              { error: "Failed to send verification email" },
              { status: 500 }
            );
          }

          const [localPart, domain] = user.email.split("@");
          const maskedEmail = localPart.length > 0
            ? `${localPart[0]}***@${domain}`
            : `***@${domain}`;

          return NextResponse.json({
            success: true,
            requiresOtp: true,
            maskedEmail,
            userId: user.id,
          });
        }
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (err) {
      console.error("[Local Login Fallback] Authentication error:", err);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  }
  // --- END LOCAL FALLBACK ---


  // Rate limit: max 5 login attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const ipHash = hashValue(ip);
  const rateLimitKey = `login:ip:${ipHash}`;
  let allowed = true;
  try {
    allowed = await withTimeout(
      "login rate limit",
      consumeRateLimit(
        rateLimitKey,
        MAX_LOGIN_ATTEMPTS,
        WINDOW_MS,
      ),
      RATE_LIMIT_TIMEOUT_MS,
    );
  } catch (err) {
    console.warn("[Login] Rate limit unavailable; continuing login:", err);
  }
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  const user = await withTimeout(
    "admin user lookup",
    findDirectAdminUser(identifier.trim()),
    DIRECT_DB_TIMEOUT_MS,
  );
  if (!user || !user.is_active) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  try {
    const validPassword = await withTimeout(
      "password verify",
      verifyPayloadPassword(password, user),
      DIRECT_DB_TIMEOUT_MS,
    );
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    try {
      await withTimeout(
        "login rate limit reset",
        resetRateLimit(rateLimitKey),
        RATE_LIMIT_TIMEOUT_MS,
      );
    } catch (err) {
      console.warn("[Login] Rate limit reset unavailable:", err);
    }

    const otpConfigError = getOtpConfigError();
    if (otpConfigError) {
      console.error("[Login] OTP configuration missing:", otpConfigError);
      return NextResponse.json(
        { error: "OTP email is not configured in production." },
        { status: 500 },
      );
    }

    if (!isOtpEnabled()) {
      const sessionId = await withTimeout(
        "Payload session create",
        createPayloadAdminSession(user.id),
        DIRECT_DB_TIMEOUT_MS,
      );
      const token = await signPayloadTokenWithSession(user, sessionId);
      return withPayloadSession(
        {
          success: true,
          requiresOtp: false,
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
    }

    // Generate OTP
    const otp = generateOtp();
    const codeHash = hashValue(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    // We use a pending-auth token rather than creating the session before OTP success
    // This token is verified in the next step before creating the actual Payload session
    const pendingAuthToken = crypto.randomUUID();

    const sql = getLoginSql();
    await withTimeout(
      "old OTP cleanup",
      sql.query(`delete from login_otps where user_id = $1`, [user.id]),
    );
    await withTimeout(
      "OTP DB write",
      sql.query(
        `insert into login_otps (user_id, code_hash, expires_at, attempts, session_token, updated_at, created_at)
         values ($1, $2, $3, 0, $4, now(), now())`,
        [user.id, codeHash, expiresAt, pendingAuthToken],
      ),
    );
    // Send OTP to user's on-file email
    try {
      await withTimeout("sendOtpEmail", sendOtpEmail(user.email, otp), 12000);
    } catch (emailErr) {
      console.error("[Login] Failed to send OTP email:", emailErr);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 },
      );
    }

    // Mask email for display (e.g. "u***@gmail.com")
    const [localPart, domain] = user.email.split("@");
    const maskedEmail = localPart.length > 0
      ? `${localPart[0]}***@${domain}`
      : `***@${domain}`;

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      maskedEmail,
      userId: user.id,
    });
  } catch (err) {
    console.error("[Login] Authentication error:", err);
    if (isTimeoutError(err)) {
      return NextResponse.json(
        {
          error:
            "Login service timed out while checking your account. Please try again.",
        },
        { status: 504 },
      );
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    return await Promise.race([
      handleLogin(request),
      new Promise<NextResponse>((resolve) => {
        setTimeout(() => resolve(timeoutResponse()), ROUTE_TIMEOUT_MS);
      }),
    ]);
  } catch (err) {
    console.error("[Login] Request failed:", err);
    if (isTimeoutError(err)) return timeoutResponse();
    return NextResponse.json(
      { error: "Login service failed. Please try again." },
      { status: 500 },
    );
  }
}
