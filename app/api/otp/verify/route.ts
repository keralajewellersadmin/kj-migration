import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString());
  } catch {
    return null;
  }
}

function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/payload-token=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(request: Request) {
  const payload = await getPayload({ config });

  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const decoded = decodeJwtPayload(token);
  if (!decoded?.id) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.id as string | number;

  const body = await request.json();
  const { code } = body as { code?: string };

  if (!code || code.length !== 6) {
    return NextResponse.json(
      { error: "Please enter a 6-digit code" },
      { status: 400 },
    );
  }

  const userData = await payload.findByID({
    collection: "admin-users",
    id: userId,
    overrideAccess: true,
  });

  const fields = userData as unknown as Record<string, unknown>;
  const storedOtp = fields.emailOtp as string | undefined;
  const otpExpires = fields.emailOtpExpires as string | undefined;

  if (!storedOtp || !otpExpires) {
    return NextResponse.json(
      { error: "No verification code found. Please request a new one." },
      { status: 400 },
    );
  }

  if (new Date(otpExpires) < new Date()) {
    return NextResponse.json(
      { error: "Verification code has expired. Please request a new one." },
      { status: 400 },
    );
  }

  if (storedOtp !== code) {
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 },
    );
  }

  // Clear the OTP after successful verification
  await payload.update({
    collection: "admin-users",
    id: userId,
    data: {
      emailOtp: null,
      emailOtpExpires: null,
    } as never,
    overrideAccess: true,
  });

  return NextResponse.json({
    success: true,
    message: "Verification successful",
  });
}
