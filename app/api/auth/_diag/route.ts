import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { getLoginSql } from "@/lib/auth/admin-login";
import { jwtVerify, decodeJwt } from "jose";

const DIAG_KEY = "c4a9f3b2-81d7-4a2e-9c1d-8e6f5a4b3c2d";

export async function GET(request: Request) {
  const k = new URL(request.url).searchParams.get("k");
  if (k !== DIAG_KEY) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const out: Record<string, unknown> = {
    nodeEnv: process.env.NODE_ENV,
    hasSecret: Boolean(process.env.PAYLOAD_SECRET),
    secretLen: process.env.PAYLOAD_SECRET?.length ?? 0,
  };

  try {
    const sql = getLoginSql();
    const users = (await sql.query(
      `select id, email, username, role::text as role, is_active from admin_users order by id`,
    )) as Array<Record<string, unknown>>;
    out.users = users;

    const otps = (await sql.query(
      `select id, user_id, expires_at, attempts,
              length(session_token) as token_len,
              left(coalesce(session_token, ''), 40) as token_head
       from login_otps order by created_at desc limit 5`,
    )) as Array<Record<string, unknown>>;
    out.loginOtps = otps;
  } catch (e) {
    out.sqlError = String((e as Error).message);
  }

  try {
    const payload = await getPayload({ config });

    const sql = getLoginSql();
    const latest = (await sql.query(
      `select user_id, session_token from login_otps where session_token is not null order by created_at desc limit 1`,
    )) as Array<{ user_id: number; session_token: string }>;

    if (latest[0]) {
      const { user_id, session_token: token } = latest[0];
      const diag: Record<string, unknown> = {
        userId: user_id,
        tokenLen: token.length,
      };

      try {
        const decoded = decodeJwt(token);
        diag.decoded = {
          keys: Object.keys(decoded),
          id: decoded.id,
          collection: decoded.collection,
          sid:
            typeof decoded.sid === "string"
              ? decoded.sid.slice(0, 12)
              : undefined,
          exp: decoded.exp,
          iat: decoded.iat,
        };
      } catch (e) {
        diag.decodeError = String((e as Error).message);
      }

      try {
        const { payload: v } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.PAYLOAD_SECRET || ""),
        );
        diag.verify = {
          ok: true,
          id: v.id,
          collection: v.collection,
          sid: typeof v.sid === "string",
        };
      } catch (e) {
        diag.verify = { ok: false, err: String((e as Error).message) };
      }

      try {
        const u = (await payload.findByID({
          collection: "admin-users" as never,
          id: user_id,
          overrideAccess: true,
          depth: 0,
        })) as {
          id?: unknown;
          email?: unknown;
          isActive?: unknown;
        };
        diag.findByIDOverride = { ok: true, found: Boolean(u), id: u?.id, email: u?.email, isActive: u?.isActive };
      } catch (e) {
        diag.findByIDOverride = { ok: false, err: String((e as Error).message) };
      }

      try {
        const u = (await payload.findByID({
          collection: "admin-users" as never,
          id: user_id,
        })) as { id?: unknown } | undefined;
        diag.findByIDAccess = { ok: true, found: Boolean(u), id: u?.id };
      } catch (e) {
        diag.findByIDAccess = { ok: false, err: String((e as Error).message) };
      }

      try {
        const authRes = await payload.auth({
          headers: new Headers({ cookie: `payload-token=${token}` }),
        });
        diag.authWithToken = {
          user: Boolean(authRes.user),
          id: (authRes.user as { id?: unknown })?.id,
          strategy: (authRes.user as { _strategy?: unknown })?._strategy,
        };
      } catch (e) {
        diag.authWithToken = { err: String((e as Error).message) };
      }

      out.tokenDiag = diag;
    } else {
      out.tokenDiag = { none: "no login_otps row with session_token" };
    }
  } catch (e) {
    out.payloadError = String((e as Error).message);
  }

  return NextResponse.json(out);
}