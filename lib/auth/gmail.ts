import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_OTP_SENDER_EMAIL,
    pass: process.env.GMAIL_OTP_SENDER_APP_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  const from = process.env.GMAIL_OTP_SENDER_EMAIL || "keralajewellersadmin@gmail.com";

  // In development, log to console so devs don't need working email
  if (process.env.NODE_ENV !== "production") {
    console.log("\n╔══════════════════════════════════════╗");
    console.log("║       DEV MODE — EMAIL              ║");
    console.log(`║  To: ${to}`);
    console.log(`║  Subject: ${subject}`);
    console.log("╚══════════════════════════════════════╝\n");
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
