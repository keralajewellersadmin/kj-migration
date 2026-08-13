import crypto from "crypto";
import { neon } from "@neondatabase/serverless";
import { getPayload, jwtSign } from "payload";
import configPromise from "@/payload.config";

export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

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

export async function createPayloadAdminSession(userId: number): Promise<string> {
  const payload = await getPayload({ config: configPromise });
  const sid = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE * 1000);

  const session = {
    id: sid,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const user = await payload.findByID({
    collection: "admin-users",
    id: userId,
  });

  const activeSessions = (user.sessions || []).filter(
    (s: { expiresAt: string | Date }) => new Date(s.expiresAt) > now
  );
  activeSessions.push(session);

  await payload.update({
    collection: "admin-users",
    id: userId,
    data: { sessions: activeSessions },
    overrideAccess: true,
  });

  return sid;
}

export async function signPayloadTokenWithSession(
  user: DirectAdminUser,
  sessionId: string,
) {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error("PAYLOAD_SECRET is required");

  const fieldsToSign = {
    id: user.id,
    collection: "admin-users",
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    isActive: user.is_active,
    sid: sessionId,
  };

  const { token } = await jwtSign({
    fieldsToSign,
    secret,
    tokenExpiration: SESSION_MAX_AGE,
  });

  return token;
}
