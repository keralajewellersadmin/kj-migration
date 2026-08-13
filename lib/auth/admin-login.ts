import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

export const SESSION_MAX_AGE = 60 * 60 * 8;

export type DirectAdminUser = {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
  role: string;
  is_active: boolean | null;
  salt: string | null;
  hash: string | null;
};

let loginSql: ReturnType<typeof neon> | null = null;

export function getLoginSql() {
  if (loginSql) return loginSql;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");
  loginSql = neon(connectionString);
  return loginSql;
}

export function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signPayloadTokenWithSession(
  user: DirectAdminUser,
  sessionId?: string,
) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const exp = issuedAt + SESSION_MAX_AGE;
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      id: user.id,
      collection: "admin-users",
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.is_active,
      ...(sessionId ? { sid: sessionId } : {}),
      iat: issuedAt,
      exp,
    }),
  );
  const signature = base64url(
    crypto
      .createHmac("sha256", process.env.PAYLOAD_SECRET || "")
      .update(`${header}.${payload}`)
      .digest(),
  );
  return `${header}.${payload}.${signature}`;
}

export async function verifyPayloadPassword(
  password: string,
  user: DirectAdminUser,
) {
  if (!user.salt || !user.hash) return false;
  const hashBuffer = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, user.salt || "", 25000, 512, "sha256", (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
  const stored = Buffer.from(user.hash, "hex");
  return (
    hashBuffer.length === stored.length &&
    crypto.timingSafeEqual(hashBuffer, stored)
  );
}

export async function findDirectAdminUser(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  const rows = (await getLoginSql().query(
    `select id, email, username, name, role::text as role, is_active, salt, hash
     from admin_users
     where lower(email) = $1 or lower(username) = $1
     limit 1`,
    [normalized],
  )) as DirectAdminUser[];
  return rows[0] || null;
}

export async function createPayloadAdminSession(userId: number) {
  const sql = getLoginSql();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
  const orderRows = (await sql.query(
    `select coalesce(max(_order) + 1, 0) as next_order
     from admin_users_sessions
     where _parent_id = $1`,
    [userId],
  )) as Array<{ next_order: number | string | null }>;
  const nextOrder = Number(orderRows[0]?.next_order || 0);

  await sql.query(
    `delete from admin_users_sessions
     where _parent_id = $1 and expires_at <= now()`,
    [userId],
  );
  await sql.query(
    `insert into admin_users_sessions (_parent_id, _order, id, created_at, expires_at)
     values ($1, $2, $3, now(), $4)`,
    [userId, nextOrder, sessionId, expiresAt],
  );

  return sessionId;
}
