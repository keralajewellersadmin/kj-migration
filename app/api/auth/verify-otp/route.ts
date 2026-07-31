import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { hashValue } from "@/lib/auth/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, code } = body as { userId?: string | number; code?: string };

  if (!userId || !code) {
    return NextResponse.json(
      { error: "User ID and code are required" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config });

  // Find the latest OTP for this user
  const result = await payload.find({
    collection: "login-otps",
    where: {
      and: [{ userId: { equals: userId } }],
    },
    limit: 1,
    overrideAccess: true,
    sort: "-createdAt",
  });

  if (!result.docs.length) {
    return NextResponse.json(
      { error: "No verification code found. Please request a new one." },
      { status: 400 },
    );
  }

  const otpRecord = result.docs[0];
  const codeHash = otpRecord.codeHash as string;
  const expiresAt = new Date(otpRecord.expiresAt as string);
  const attempts = (otpRecord.attempts as number) || 0;
  const sessionToken = otpRecord.sessionToken as string | undefined;

  // Check attempts
  if (attempts >= 5) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please request a new code." },
      { status: 429 },
    );
  }

  // Check expiry
  if (new Date() > expiresAt) {
    return NextResponse.json(
      { error: "Verification code has expired. Please request a new one." },
      { status: 400 },
    );
  }

  // Verify hash
  const inputHash = hashValue(code);
  if (inputHash !== codeHash) {
    // Increment attempts
    await payload.update({
      collection: "login-otps",
      id: otpRecord.id,
      data: { attempts: attempts + 1 },
      overrideAccess: true,
    });
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 },
    );
  }

  // Delete used OTP
  await payload.delete({
    collection: "login-otps",
    id: otpRecord.id,
    overrideAccess: true,
  });

  // Get user data for response
  const user = await payload.findByID({
    collection: "admin-users",
    id: userId,
    overrideAccess: true,
  });

  // Use the session token from payload.login() (step 1) — Payload-compatible JWT
  if (!sessionToken) {
    return NextResponse.json(
      { error: "Session expired. Please log in again." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    token: sessionToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
