import { NextResponse } from "next/server";
import { getCachedPayload } from "@/lib/payload-singleton";
import { generateOtp, hashValue, sendOtpEmail } from "@/lib/auth/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId } = body as { userId?: string | number };

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getCachedPayload();

  // Get user
  const user = await payload.findByID({
    collection: "admin-users",
    id: userId,
    overrideAccess: true,
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check rate limit: only 1 resend per 60 seconds
  const recentOtps = await payload.find({
    collection: "login-otps",
    where: {
      and: [{ userId: { equals: userId } }],
    },
    limit: 1,
    overrideAccess: true,
    sort: "-createdAt",
  });

  if (recentOtps.docs.length) {
    const lastOtp = recentOtps.docs[0];
    const createdAt = new Date(lastOtp.createdAt as string);
    const diffMs = Date.now() - createdAt.getTime();
    if (diffMs < 60 * 1000) {
      return NextResponse.json(
        { error: "Please wait before requesting a new code" },
        { status: 429 },
      );
    }
  }

  // Delete old OTPs for this user, but preserve the sessionToken from the original login
  const oldOtps = await payload.find({
    collection: "login-otps",
    where: {
      and: [{ userId: { equals: userId } }],
    },
    limit: 10,
    overrideAccess: true,
  });

  // Extract sessionToken from the most recent OTP (set during initial login)
  let sessionToken: string | undefined;
  if (oldOtps.docs.length > 0) {
    sessionToken = (oldOtps.docs[0].sessionToken as string) || undefined;
  }

  for (const oldOtp of oldOtps.docs) {
    await payload.delete({
      collection: "login-otps",
      id: oldOtp.id,
      overrideAccess: true,
    });
  }

  // Generate new OTP
  const otp = generateOtp();
  const codeHash = hashValue(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await payload.create({
    collection: "login-otps",
    overrideAccess: true,
    data: {
      userId,
      codeHash,
      expiresAt,
      attempts: 0,
      ...(sessionToken ? { sessionToken } : {}),
    },
  });

  // Send OTP
  try {
    await sendOtpEmail(user.email as string, otp);
  } catch {
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "New code sent" });
}
