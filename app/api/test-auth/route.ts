import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

const CREDS: Record<string, { email: string; password: string }> = {
  "super-admin": { email: "keralajewellersadmin@gmail.com", password: "SuperAdmin@12345" },
  admin: { email: "admin@keralajewellers.in", password: "AdminMgr@12345" },
  "enquiry-manager": { email: "enquiry@keralajewellers.in", password: "EnquiryMgr@12345" },
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "super-admin";
  const cred = CREDS[role];
  if (!cred) return NextResponse.json({ error: `Unknown role: ${role}` }, { status: 400 });

  const payload: any = await getPayload({ config });
  try {
    const result = await payload.login({
      collection: "admin-users",
      data: { email: cred.email, password: cred.password },
    });
    if (!result?.token) return NextResponse.json({ error: "Login failed" }, { status: 401 });
    return NextResponse.json({
      token: result.token,
      user: { id: result.user.id, email: result.user.email, role: result.user.role, name: result.user.name },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
