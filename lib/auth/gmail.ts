import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_OTP_SENDER_EMAIL,
        pass: process.env.GMAIL_OTP_SENDER_APP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }
  return _transporter;
}

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

  // In development, skip sending email entirely
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  await getTransporter().sendMail({
    from,
    to,
    subject,
    html,
  });
}
