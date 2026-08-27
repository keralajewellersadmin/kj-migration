import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { hashIp } from "../../../lib/payload/security";
import { getLoginSql } from "@/lib/auth/admin-login";

const MAX_REQUESTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const SUCCESS_MESSAGE = "Your inquiry has been received successfully.";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
  phone: z.string().trim().max(30).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  source: z.enum(["contact", "enquiry"]).optional().default("contact"),
  city: z.string().trim().max(120).optional().default(""),
  preferredTime: z.string().trim().max(120).optional().default(""),
  productName: z.string().trim().max(200).optional().default(""),
  productId: z.string().trim().max(80).optional().default(""),
  honeypot: z.string().optional().default(""),
  startedAt: z.number().optional(),
});

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
    .split(",")[0]
    .trim();
}

async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const sql = getLoginSql();
  const resetAt = new Date(Date.now() + windowMs).toISOString();
  const now = new Date().toISOString();
  const docs = (await sql.query(
    `select id, count, reset_at from rate_limits where key = $1 limit 1`,
    [key],
  )) as Array<{ id: number; count?: number; reset_at?: string }>;

  const current = docs[0] as
    { id: string | number; count?: number; reset_at?: string } | undefined;
  if (!current || String(current.reset_at) < now) {
    if (current) {
      await sql.query(
        `update rate_limits
         set count = 1, reset_at = $2, updated_at = now()
         where id = $1`,
        [current.id, resetAt],
      );
    } else {
      await sql.query(
        `insert into rate_limits (key, count, reset_at, updated_at, created_at)
         values ($1, 1, $2, now(), now())`,
        [key, resetAt],
      );
    }
    return true;
  }

  if ((Number(current.count) || 0) >= limit) return false;
  await sql.query(
    `update rate_limits
     set count = count + 1, updated_at = now()
     where id = $1`,
    [current.id],
  );
  return true;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 415 });
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  let parsed: z.infer<typeof inquirySchema>;
  try {
    parsed = inquirySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const sql = getLoginSql();

    if (
      parsed.honeypot ||
      (parsed.startedAt && Date.now() - parsed.startedAt < 2500)
    ) {
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    const ipAllowed = await consumeRateLimit(
      `inquiry:ip:${ipHash}`,
      MAX_REQUESTS,
      WINDOW_MS,
    );
    const emailAllowed = await consumeRateLimit(
      `inquiry:email:${parsed.email}`,
      3,
      60 * 60 * 1000,
    );
    if (!ipAllowed || !emailAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const inquiryRows = (await sql.query(
      `insert into inquiries
         (name, email, phone, message, source, city, preferred_time,
          product_name, product_id, submitted_at, status, read,
          email_notification_status, updated_at, created_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'new', false, 'not-sent', now(), now())
       returning id`,
      [
        parsed.name,
        parsed.email,
        parsed.phone,
        parsed.message,
        parsed.source,
        parsed.city,
        parsed.preferredTime,
        parsed.productName,
        parsed.productId,
        new Date().toISOString(),
      ],
    )) as Array<{ id: number }>;
    const inquiryId = inquiryRows[0]?.id;

    if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.INQUIRY_NOTIFICATION_EMAIL
    ) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.INQUIRY_NOTIFICATION_EMAIL,
          subject: `Kerala Jewellers inquiry from ${parsed.name.replace(/[\r\n]/g, "")}`,
          replyTo: parsed.email,
          html: [
            `<p><strong>Name:</strong> ${escapeHtml(parsed.name)}</p>`,
            `<p><strong>Email:</strong> ${escapeHtml(parsed.email)}</p>`,
            `<p><strong>Phone:</strong> ${escapeHtml(parsed.phone || "-")}</p>`,
            `<p><strong>Message:</strong></p><p>${escapeHtml(parsed.message || "-")}</p>`,
          ].join(""),
        });
        if (inquiryId) {
          await sql.query(
            `update inquiries
             set email_notification_status = 'sent', updated_at = now()
             where id = $1`,
            [inquiryId],
          );
        }
      } catch (emailErr) {
        console.error("[Inquiry] Failed to send notification email:", emailErr);
        if (inquiryId) {
          await sql.query(
            `update inquiries
             set email_notification_status = 'failed', updated_at = now()
             where id = $1`,
            [inquiryId],
          );
        }
      }
    }

    return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  } catch (err) {
    console.error("[Inquiry] Submission error:", err);
    return NextResponse.json(
      { error: "Unable to submit inquiry right now." },
      { status: 500 },
    );
  }
}
