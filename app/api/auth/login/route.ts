import { NextResponse } from "next/server";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";
import { getCachedPayload } from "@/lib/payload-singleton";
import { ADMIN_PATH } from "@/lib/admin-path";
import {
  findUserByIdentifier,
  generateOtp,
  hashValue,
  sendOtpEmail,
} from "@/lib/auth/email";
import { hashIp } from "@/lib/payload/security";

const RATE_LIMIT_COLLECTION = "rate-limits" as never;
const MAX_LOGIN_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_MAX_AGE = 60 * 60 * 8;
const ROUTE_TIMEOUT_MS = 30000;
const STEP_TIMEOUT_MS = 15000;
const RATE_LIMIT_TIMEOUT_MS = 3000;
const PAYLOAD_INIT_TIMEOUT_MS = 8000;
const DIRECT_DB_TIMEOUT_MS = 8000;

type AdminLoginResult = {
  token: string;
  user: {
    id: string | number;
    email?: string;
    name?: string;
    role?: string;
  };
};

type DirectAdminUser = {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
  role: string;
  is_active: boolean | null;
  salt: string | null;
  hash: string | null;
};

type LoginPayload = {
  find: (args: unknown) => Promise<{ docs: unknown[] }>;
  update: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  login: (args: unknown) => Promise<AdminLoginResult>;
};

let loginSql: ReturnType<typeof neon> | null = null;

function isOtpEnabled() {
  return (
    process.env.ADMIN_OTP_ENABLED === "true" &&
    Boolean(
      process.env.GMAIL_OTP_SENDER_EMAIL &&
        process.env.GMAIL_OTP_SENDER_APP_PASSWORD,
    )
  );
}

function getLoginSql() {
  if (loginSql) return loginSql;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required for login");
  loginSql = neon(connectionString);
  return loginSql;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signPayloadToken(user: DirectAdminUser) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const exp = issuedAt + SESSION_MAX_AGE;
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      id: user.id,
      collection: "admin-users",
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.is_active,
      iat: issuedAt,
      exp,
    }),
  );
  const signature = base64url(
    crypto
      .createHmac("sha256", process.env.PAYLOAD_SECRET || "")
      .update(`${header}.${payload}`)
      .digest(),
  );
  return `${header}.${payload}.${signature}`;
}

async function verifyPayloadPassword(
  password: string,
  user: DirectAdminUser,
) {
  if (!user.salt || !user.hash) return false;
  const hashBuffer = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, user.salt || "", 25000, 512, "sha256", (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
  const stored = Buffer.from(user.hash, "hex");
  return (
    hashBuffer.length === stored.length &&
    crypto.timingSafeEqual(hashBuffer, stored)
  );
}

async function findDirectAdminUser(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  const rows = await getLoginSql().query(
    `select id, email, username, name, role::text as role, is_active, salt, hash
     from admin_users
     where lower(email) = $1 or lower(username) = $1
     limit 1`,
    [normalized],
  ) as DirectAdminUser[];
  return rows[0] || null;
}

async function directLoginFallback(identifier: string, password: string) {
  const user = await withTimeout(
    "direct admin user lookup",
    findDirectAdminUser(identifier),
    DIRECT_DB_TIMEOUT_MS,
  );
  if (!user || !user.is_active) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const validPassword = await withTimeout(
    "direct password verify",
    verifyPayloadPassword(password, user),
    DIRECT_DB_TIMEOUT_MS,
  );
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signPayloadToken(user);
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
  payload: LoginPayload,
  key: string,
  limit: number,
  windowMs: number,
) {
  const resetAt = new Date(Date.now() + windowMs).toISOString();
  const now = new Date().toISOString();
  const { docs } = await payload.find({
    collection: RATE_LIMIT_COLLECTION,
    where: { key: { equals: key } },
    limit: 1,
  });

  const current = docs[0] as
    { id: string | number; count?: number; resetAt?: string } | undefined;
  if (!current || String(current.resetAt) < now) {
    if (current) {
      await payload.update({
        collection: RATE_LIMIT_COLLECTION,
        id: current.id,
        data: { count: 1, resetAt } as never,
      });
    } else {
      await payload.create({
        collection: RATE_LIMIT_COLLECTION,
        data: { key, count: 1, resetAt } as never,
      });
    }
    return true;
  }

  if ((Number(current.count) || 0) >= limit) return false;
  await payload.update({
    collection: RATE_LIMIT_COLLECTION,
    id: current.id,
    data: { count: (Number(current.count) || 0) + 1 } as never,
  });
  return true;
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

  if (!isOtpEnabled()) {
    console.log("[Login] OTP disabled; using direct login path");
    return directLoginFallback(identifier, password);
  }

  let payload: LoginPayload;
  try {
    console.log("0. Before Payload init");
    payload = await withTimeout(
      "Payload init",
      getCachedPayload(),
      PAYLOAD_INIT_TIMEOUT_MS,
    ) as LoginPayload;
    console.log("0. After Payload init");
  } catch (err) {
    console.warn("[Login] Payload init unavailable; using direct login:", err);
    return directLoginFallback(identifier, password);
  }

  // Rate limit: max 5 login attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  let allowed = true;
  try {
    allowed = await withTimeout(
      "login rate limit",
      consumeRateLimit(
        payload,
        `login:ip:${ipHash}`,
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

  const { user, matchedVia } = await withTimeout(
    "admin user lookup",
    findUserByIdentifier(payload, identifier.trim()),
  );
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const userRole = user.role as string;
  const userEmail = user.email as string;

  // Role-based login method enforcement
  if (userRole === "super-admin" && matchedVia !== "email") {
    return NextResponse.json(
      { error: "Please log in with your email address" },
      { status: 400 },
    );
  }
  if (
    (userRole === "admin" || userRole === "enquiry-manager") &&
    matchedVia !== "username"
  ) {
    return NextResponse.json(
      { error: "Please log in with your username" },
      { status: 400 },
    );
  }

  // Verify password using Payload's local auth
  try {
    const loginResult = await withTimeout<AdminLoginResult>(
      "password verify",
      payload.login({
        collection: "admin-users",
        data: { email: userEmail, password },
      }) as Promise<AdminLoginResult>,
    );
    if (!loginResult?.user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (!isOtpEnabled()) {
      return withPayloadSession(
        {
          success: true,
          requiresOtp: false,
          redirectTo: ADMIN_PATH,
          user: {
            id: loginResult.user.id,
            email: loginResult.user.email,
            name: loginResult.user.name,
            role: loginResult.user.role,
          },
        },
        loginResult.token,
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const codeHash = hashValue(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP + session token in login-otps collection
    await withTimeout(
      "OTP DB write",
      payload.create({
        collection: "login-otps",
        overrideAccess: true,
        data: {
          userId: loginResult.user.id,
          codeHash,
          expiresAt,
          attempts: 0,
          sessionToken: loginResult.token,
        },
      }),
    );
    // Send OTP to user's on-file email
    try {
      await withTimeout("sendOtpEmail", sendOtpEmail(userEmail, otp), 12000);
    } catch (emailErr) {
      console.error("[Login] Failed to send OTP email:", emailErr);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 },
      );
    }

    // Mask email for display (e.g. "u***@gmail.com")
    const [localPart, domain] = userEmail.split("@");
    const maskedEmail = localPart.length > 0
      ? `${localPart[0]}***@${domain}`
      : `***@${domain}`;

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      maskedEmail,
      userId: loginResult.user.id,
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
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
