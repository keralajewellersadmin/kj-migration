import crypto from "crypto";
import { sendEmail } from "./gmail.ts";

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function sendOtpEmail(toEmail: string, code: string) {
  // In development, log OTP to console as well
  if (process.env.NODE_ENV !== "production" && process.env.AUTH_DEBUG === "true") {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║       DEV MODE — OTP CODE           ║");
    console.log(`║  To: ${toEmail}`);
    console.log(`║  Code: ${code}`);
    console.log("╚══════════════════════════════════════╝\n");
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: `Your login code: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #991f23;">Kerala Jewellers CMS</h2>
          <p>Your login verification code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #991f23;">
            ${code}
          </p>
          <p style="color: #6b7280; font-size: 13px;">
            This code expires in 10 minutes. If you didn't request this,
            you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw err;
    }
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetUrl: string,
) {
  // In development, log reset URL to console — skip email entirely
  if (process.env.NODE_ENV !== "production" && process.env.AUTH_DEBUG === "true") {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║    DEV MODE — PASSWORD RESET URL    ║");
    console.log(`║  To: ${toEmail}`);
    console.log(`║  URL: ${resetUrl}`);
    console.log("╚══════════════════════════════════════╝\n");
    return;
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: "Reset your Kerala Jewellers CMS password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #991f23;">Kerala Jewellers CMS</h2>
          <p>Click the button below to reset your password. This link
          expires in 30 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#991f23;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">
            Reset Password
          </a>
          <p style="color: #6b7280; font-size: 13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw err;
    }
  }
}

export async function sendWelcomeEmail(
  toEmail: string,
  name: string,
  resetUrl: string,
) {
  if (process.env.NODE_ENV !== "production" && process.env.AUTH_DEBUG === "true") {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║    DEV MODE — WELCOME SET PASSWORD   ║");
    console.log(`║  To: ${toEmail}`);
    console.log(`║  URL: ${resetUrl}`);
    console.log("╚══════════════════════════════════════╝\n");
    return;
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: "Welcome to Kerala Jewellers CMS - Set your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #991f23;">Welcome, ${name}!</h2>
          <p>An administrator has created an account for you on the Kerala Jewellers CMS.</p>
          <p>Click the button below to set your secure password. This link expires in 7 days.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#991f23;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">
            Set My Password
          </a>
          <p style="color: #6b7280; font-size: 13px;">
            If you believe you received this in error, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw err;
    }
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function findUserByIdentifier(payload: any, identifier: string) {
  const findOpts = { limit: 1, overrideAccess: true } as { limit: number; overrideAccess: boolean };

  let result = await payload.find({
    ...findOpts,
    collection: "admin-users",
    where: { email: { equals: identifier } },
  });
  if (result.docs.length) return { user: result.docs[0], matchedVia: "email" };

  result = await payload.find({
    ...findOpts,
    collection: "admin-users",
    where: { username: { equals: identifier } },
  });
  if (result.docs.length)
    return { user: result.docs[0], matchedVia: "username" };

  return { user: null, matchedVia: null };
}

export async function sendSetupSuccessEmail(
  toEmail: string,
  name: string,
  loginUrl: string,
) {
  if (process.env.NODE_ENV !== "production" && process.env.AUTH_DEBUG === "true") {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║    DEV MODE — ACCOUNT SETUP SUCCESS  ║");
    console.log(`║  To: ${toEmail}`);
    console.log(`║  URL: ${loginUrl}`);
    console.log("╚══════════════════════════════════════╝\n");
    return;
  }

  try {
    await sendEmail({
      to: toEmail,
      subject: "Account Setup Successful - Kerala Jewellers CMS",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Account Ready, ${name}!</h2>
          <p>Your password has been successfully set and your account is now active.</p>
          <p>You can now access the Kerala Jewellers Admin Portal by clicking the link below:</p>
          <a href="${loginUrl}" style="display:inline-block;background:#991f23;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">
            Go to Admin Portal
          </a>
          <p style="color: #6b7280; font-size: 13px;">
            If you did not perform this action, please contact your administrator immediately.
          </p>
        </div>
      `,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "production") {
      throw err;
    }
  }
}
