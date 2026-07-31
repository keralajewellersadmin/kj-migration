import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { Resend } from "resend";
import crypto from "crypto";

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

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(request: Request) {
  const payload = await getPayload({ config });

  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const decoded = decodeJwtPayload(token);
  if (!decoded?.id || !decoded?.email) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.id as string | number;
  const email = decoded.email as string;

  const otp = generateOtp();
  const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

  await payload.update({
    collection: "admin-users",
    id: userId,
    data: {
      emailOtp: otp,
      emailOtpExpires: expires,
    } as never,
    overrideAccess: true,
  });

  // Send OTP via email
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: "Kerala Jewellers Admin — Login Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 2rem;">
            <h2 style="color: #9f1b1f; margin-bottom: 1rem;">Verification Code</h2>
            <p>Your one-time verification code is:</p>
            <div style="font-size: 2rem; font-weight: bold; letter-spacing: 0.5rem; text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px; margin: 1rem 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 0.9rem;">This code expires in 5 minutes. If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: "Verification code sent to your email",
  });
}
