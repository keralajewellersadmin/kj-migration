import { NextResponse } from "next/server";
import { jwtVerify, decodeJwt } from "jose";

const DIAG_KEY = "c4a9f3b2-81d7-4a2e-9c1d-8e6f5a4b3c2d";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const k = new URL(request.url).searchParams.get("k");
  if (k !== DIAG_KEY) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  let token: string | null = null;
  for (const part of cookieHeader.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === "payload-token") {
      token = decodeURIComponent(valueParts.join("="));
      break;
    }
  }

  const out: Record<string, unknown> = {
    nodeEnv: process.env.NODE_ENV,
    hasSecret: Boolean(process.env.PAYLOAD_SECRET),
    secretLen: process.env.PAYLOAD_SECRET?.length ?? 0,
    hasCookie: Boolean(token),
    tokenLen: token?.length ?? 0,
    cookieHeaderLen: cookieHeader.length,
  };

  if (!token) {
    out.error = "NO PAYLOAD-TOKEN COOKIE IN REQUEST";
    return NextResponse.json(out);
  }

  try {
    const decoded = decodeJwt(token);
    out.decoded = {
      id: decoded.id,
      idType: typeof decoded.id,
      collection: decoded.collection,
      email: decoded.email,
      role: decoded.role,
      sid: typeof decoded.sid === "string" ? decoded.sid.slice(0, 8) : undefined,
      exp: decoded.exp,
      iat: decoded.iat,
      now: Math.floor(Date.now() / 1000),
      expired: decoded.exp ? decoded.exp < Math.floor(Date.now() / 1000) : "unknown",
    };
  } catch (e) {
    out.decodeError = String((e as Error).message);
  }

  try {
    const secret = process.env.PAYLOAD_SECRET || "";
    const { payload: claims } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    out.verify = { ok: true, id: claims.id, collection: claims.collection };
  } catch (e) {
    out.verify = { ok: false, err: String((e as Error).message) };
  }

  return NextResponse.json(out);
}