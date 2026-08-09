import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { Resend } from "resend";
import { z } from "zod";
import { hashIp } from "../../../lib/payload/security";

const MAX_REQUESTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const SUCCESS_MESSAGE = "Your inquiry has been received successfully.";
const RATE_LIMITS_COLLECTION = "rate-limits" as never;

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
  productId: z.string().trim().max(80).optional(),
  sourcePage: z.string().trim().max(300).optional().default("/contact"),
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
  payload: Awaited<ReturnType<typeof getPayload>>,
  key: string,
  limit: number,
  windowMs: number,
) {
  const resetAt = new Date(Date.now() + windowMs).toISOString();
  const now = new Date().toISOString();
  const { docs } = await payload.find({
    collection: RATE_LIMITS_COLLECTION,
    where: { key: { equals: key } },
    limit: 1,
  });

  const current = docs[0] as
    { id: string | number; count?: number; resetAt?: string } | undefined;
  if (!current || String(current.resetAt) < now) {
    if (current) {
      await payload.update({
        collection: RATE_LIMITS_COLLECTION,
        id: current.id,
        data: { count: 1, resetAt } as never,
      });
    } else {
      await payload.create({
        collection: RATE_LIMITS_COLLECTION,
        data: { key, count: 1, resetAt } as never,
      });
    }
    return true;
  }

  if ((Number(current.count) || 0) >= limit) return false;
  await payload.update({
    collection: RATE_LIMITS_COLLECTION,
    id: current.id,
    data: { count: (Number(current.count) || 0) + 1 } as never,
  });
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
    const payload = await getPayload({ config });

    if (
      parsed.honeypot ||
      (parsed.startedAt && Date.now() - parsed.startedAt < 2500)
    ) {
      return NextResponse.json({ message: SUCCESS_MESSAGE });
    }

    const ipAllowed = await consumeRateLimit(
      payload,
      `inquiry:ip:${ipHash}`,
      MAX_REQUESTS,
      WINDOW_MS,
    );
    const emailAllowed = await consumeRateLimit(
      payload,
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

    const inquiry = await payload.create({
      collection: "inquiries",
      data: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        message: parsed.message,
        product: parsed.productId,
        sourcePage: parsed.sourcePage,
        submittedIp: ipHash,
        submittedAt: new Date().toISOString(),
        status: "new",
        emailNotificationStatus: "not-sent",
      } as never,
    });

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
          subject: `Kerala Jewellers inquiry from ${parsed.name}`,
          replyTo: parsed.email,
          html: [
            `<p><strong>Name:</strong> ${escapeHtml(parsed.name)}</p>`,
            `<p><strong>Email:</strong> ${escapeHtml(parsed.email)}</p>`,
            `<p><strong>Phone:</strong> ${escapeHtml(parsed.phone || "-")}</p>`,
            `<p><strong>Source:</strong> ${escapeHtml(parsed.sourcePage || "")}</p>`,
            `<p><strong>Message:</strong></p><p>${escapeHtml(parsed.message || "-")}</p>`,
          ].join(""),
        });
        await payload.update({
          collection: "inquiries",
          id: inquiry.id,
          data: { emailNotificationStatus: "sent" } as never,
        });
      } catch (emailErr) {
        console.error("[Inquiry] Failed to send notification email:", emailErr);
        await payload.update({
          collection: "inquiries",
          id: inquiry.id,
          data: { emailNotificationStatus: "failed" } as never,
        });
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
