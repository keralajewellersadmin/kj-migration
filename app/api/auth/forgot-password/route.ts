import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import {
  findUserByIdentifier,
  generateResetToken,
  hashValue,
  sendPasswordResetEmail,
} from "@/lib/auth/email";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kj-migration.vercel.app";

export async function POST(request: Request) {
  const body = await request.json();
  const { identifier } = body as { identifier?: string };

  // Always return generic message (no account enumeration)
  if (!identifier) {
    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = await getPayload({ config });
  const { user } = await findUserByIdentifier(payload, identifier.trim());

  if (!user) {
    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  }

  const userId = user.id as string | number;

  // Rate limit: max 3 per hour
  const recentResets = await payload.find({
    collection: "password-resets",
    where: {
      and: [{ userId: { equals: userId } }],
    },
    limit: 10,
    overrideAccess: true,
    sort: "-createdAt",
  });

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = recentResets.docs.filter(
    (doc: Record<string, unknown>) =>
      new Date(doc.createdAt as string) > oneHourAgo,
  ).length;
  if (recentCount >= 3) {
    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  }

  // Generate token
  const rawToken = generateResetToken();
  const tokenHash = hashValue(rawToken);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  await payload.create({
    collection: "password-resets",
    overrideAccess: true,
    data: {
      userId,
      tokenHash,
      expiresAt,
      used: false,
    },
  });

  // Send reset email
  const resetUrl = `${SITE_URL}/admin/reset-password?token=${rawToken}`;
  try {
    await sendPasswordResetEmail(user.email as string, resetUrl);
  } catch (err) {
    console.error("Failed to send reset email:", err);
  }

  return NextResponse.json({
    success: true,
    message: "If an account exists, a reset link has been sent.",
  });
}
