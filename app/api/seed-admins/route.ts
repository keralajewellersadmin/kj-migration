import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

const ADMINS = [
  {
    email: "superadmin@keralajewellers.in",
    password: "SuperAdmin@12345",
    name: "Super Admin",
    role: "super-admin" as const,
  },
  {
    email: "admin@keralajewellers.in",
    password: "AdminMgr@12345",
    name: "Admin Manager",
    role: "admin" as const,
    username: "admin",
  },
  {
    email: "enquiry@keralajewellers.in",
    password: "EnquiryMgr@12345",
    name: "Enquiry Manager",
    role: "enquiry-manager" as const,
    username: "enquiry",
  },
];

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const validSecret =
      process.env.PAYLOAD_SECRET?.trim() || process.env.SEED_SECRET?.trim();
    if (!secret || secret.trim() !== validSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const payload = await getPayload({ config });
  const results: Array<Record<string, unknown>> = [];

  for (const admin of ADMINS) {
    try {
      const existing = await payload.find({
        collection: "admin-users",
        where: { email: { equals: admin.email } },
        limit: 1,
        overrideAccess: true,
      });

      if (existing.totalDocs > 0) {
        await payload.delete({
          collection: "admin-users",
          id: existing.docs[0].id,
          overrideAccess: true,
        });
      }

      const created = await payload.create({
        collection: "admin-users",
        overrideAccess: true,
        data: {
          email: admin.email,
          password: admin.password,
          name: admin.name,
          role: admin.role,
          isActive: true,
          ...("username" in admin ? { username: admin.username } : {}),
        } as never,
      });

      results.push({
        email: admin.email,
        role: admin.role,
        id: created.id,
        created: true,
      });
    } catch (err) {
      results.push({
        email: admin.email,
        role: admin.role,
        error: String(err),
      });
    }
  }

  return NextResponse.json({ message: "Admin seed complete", results });
}
