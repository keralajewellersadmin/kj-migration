import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

const ADMINS = [
  {
    email: "keralajewellersadmin@gmail.com",
    password: "SuperAdmin@12345",
    name: "Super Admin",
    role: "super-admin" as const,
    username: "superadmin",
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
      // Delete existing account with same username
      const existing = await payload.find({
        collection: "admin-users",
        where: { username: { equals: admin.username } },
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
          username: admin.username,
          isActive: true,
        } as never,
      });

      results.push({
        username: admin.username,
        role: admin.role,
        id: created.id,
        created: true,
      });
    } catch (err) {
      results.push({
        username: admin.username,
        role: admin.role,
        error: String(err),
      });
    }
  }

  return NextResponse.json({ message: "Admin seed complete", results });
}
