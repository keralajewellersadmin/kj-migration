import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import {
  findUserByIdentifier,
  generateOtp,
  hashValue,
  sendOtpEmail,
} from "@/lib/auth/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { identifier, password } = body as {
    identifier?: string;
    password?: string;
  };

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email/username and password are required" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config });
  const { user, matchedVia } = await findUserByIdentifier(
    payload,
    identifier.trim(),
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const userRole = user.role as string;
  const userEmail = user.email as string;

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
    const loginResult = await payload.login({
      collection: "admin-users",
      data: { email: userEmail, password },
    });

    if (!loginResult?.user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const codeHash = hashValue(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP + session token in login-otps collection
    await payload.create({
      collection: "login-otps",
      overrideAccess: true,
      data: {
        userId: loginResult.user.id,
        codeHash,
        expiresAt,
        attempts: 0,
        sessionToken: loginResult.token,
      },
    });

    // Send OTP via email
    try {
      await sendOtpEmail(userEmail, otp);
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 },
      );
    }

    // Mask email for display
    const [local, domain] = userEmail.split("@");
    const masked = `${local[0]}***@${domain}`;

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      maskedEmail: masked,
      userId: loginResult.user.id,
    });
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
