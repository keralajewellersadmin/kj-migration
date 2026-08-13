import { NextResponse } from "next/server";
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

type AdminLoginResult = {
  token: string;
  user: {
    id: string | number;
    email?: string;
    name?: string;
    role?: string;
  };
};

function isOtpEnabled() {
  return (
    process.env.ADMIN_OTP_ENABLED === "true" &&
    Boolean(
      process.env.GMAIL_OTP_SENDER_EMAIL &&
        process.env.GMAIL_OTP_SENDER_APP_PASSWORD,
    )
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getCachedPayload();

  // Rate limit: max 5 login attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const allowed = await withTimeout(
    "login rate limit",
    consumeRateLimit(
      payload,
      `login:ip:${ipHash}`,
      MAX_LOGIN_ATTEMPTS,
      WINDOW_MS,
    ),
  );
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
