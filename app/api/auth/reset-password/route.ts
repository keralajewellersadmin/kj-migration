import { NextResponse } from "next/server";
import { getCachedPayload } from "@/lib/payload-singleton";
import { hashValue } from "@/lib/auth/email";
import { validateAdminPassword } from "@/lib/payload/security";

export async function POST(request: Request) {
  const body = await request.json();
  const { token, password } = body as { token?: string; password?: string };

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and new password are required" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getCachedPayload();
  const tokenHash = hashValue(token);

  // Find the reset record
  const result = await payload.find({
    collection: "password-resets",
    where: {
      and: [{ tokenHash: { equals: tokenHash } }, { used: { equals: false } }],
    },
    limit: 1,
    overrideAccess: true,
  });

  if (!result.docs.length) {
    return NextResponse.json(
      { error: "Invalid or already used reset link" },
      { status: 400 },
    );
  }

  const resetRecord = result.docs[0];
  const expiresAt = new Date(resetRecord.expiresAt as string);

  if (new Date() > expiresAt) {
    return NextResponse.json(
      { error: "Reset link has expired. Please request a new one." },
      { status: 400 },
    );
  }

  // Get the user to validate password against their data
  const userId =
    (resetRecord.userId as { id: string | number })?.id || resetRecord.userId;
  const user = await payload.findByID({
    collection: "admin-users",
    id: userId as string | number,
    overrideAccess: true,
  });

  // Validate password
  const validation = validateAdminPassword(password, {
    email: user.email,
    name: user.name,
    username: user.username,
  });
  if (validation !== true) {
    return NextResponse.json(
      { error: `Password: ${validation}` },
      { status: 400 },
    );
  }

  // Update password
  await payload.update({
    collection: "admin-users",
    id: userId as string | number,
    data: { password },
    overrideAccess: true,
  });

  // Mark token as used
  await payload.update({
    collection: "password-resets",
    id: resetRecord.id,
    data: { used: true },
    overrideAccess: true,
  });

  return NextResponse.json({
    success: true,
    message: "Password reset successful. Please log in with your new password.",
  });
}
