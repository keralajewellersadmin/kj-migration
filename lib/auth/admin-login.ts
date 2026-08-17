import crypto from "crypto";
import { neon } from "@neondatabase/serverless";
import { jwtSign } from "payload";

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

import Database from "better-sqlite3";
import { resolve } from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlExecutor = { query: (text: string, params?: unknown[]) => Promise<any> };
let loginSql: SqlExecutor | null = null;

export function getLoginSql() {
  if (loginSql) return loginSql;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    const dbUri = process.env.DATABASE_URI || "file:./dev.db";
    const dbPath = dbUri.replace(/^file:/, "").replace(/^\/\//, "");
    const absolutePath = resolve(process.cwd(), dbPath);
    const db = new Database(absolutePath);

    loginSql = {
      async query(text: string, params: unknown[] = []) {
        // Map Postgres numbered parameters ($1, $2, etc.) to positional SQLite params
        const matches = text.match(/\$\d+/g) || [];
        const sqliteParams = matches.map((m) => {
          const index = parseInt(m.slice(1)) - 1;
          return params[index];
        });

        const sql = text
          .replace(/\$\d+/g, "?")
          .replace(/now\(\)/gi, "datetime('now')")
          .replace(/::text/gi, "")
          .replace(/coalesce\((max\(_order\)), -1\)/gi, "ifnull($1, -1)");

        const stmt = db.prepare(sql);
        if (sql.trim().toLowerCase().startsWith("select")) {
          const rows = stmt.all(...sqliteParams);
          return rows.map((row) => {
            const mapped = { ...(row as Record<string, unknown>) };
            if ("is_active" in mapped) {
              mapped.is_active = mapped.is_active === 1 || mapped.is_active === true;
            }
            return mapped;
          });
        } else {
          const info = stmt.run(...sqliteParams);
          return { rowCount: info.changes };
        }
      },
    };
    return loginSql;
  }

  // The neon() HTTP driver does not work with the PgBouncer -pooler endpoint.
  // Strip -pooler so queries go to the direct compute endpoint over HTTP.
  const parsed = new URL(connectionString);
  if (parsed.hostname.includes("-pooler")) {
    parsed.hostname = parsed.hostname.replace("-pooler", "");
  }

  loginSql = neon(parsed.toString());
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

/**
 * Create a session row directly via raw SQL (neon HTTP driver).
 *
 * We cannot use Payload's ORM here because the postgresAdapter's TCP-based
 * pg.Pool cannot reliably connect to Neon from Vercel's serverless functions
 * (15s timeout). The neon() HTTP driver bypasses this entirely.
 */
export async function createPayloadAdminSession(userId: number): Promise<string> {
  const sid = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE * 1000);
  const sql = getLoginSql();

  // Clean up expired sessions
  await sql.query(
    `delete from admin_users_sessions
     where _parent_id = $1 and expires_at <= now()`,
    [userId],
  );

  // Get next _order value
  const orderRows = (await sql.query(
    `select coalesce(max(_order), -1) + 1 as next_order
     from admin_users_sessions
     where _parent_id = $1`,
    [userId],
  )) as Array<{ next_order: number | string | null }>;

  const nextOrder = Number(orderRows[0]?.next_order ?? 0);

  // Insert the session row
  await sql.query(
    `insert into admin_users_sessions
       (_parent_id, _order, id, created_at, expires_at)
     values ($1, $2, $3, $4, $5)`,
    [
      userId,
      nextOrder,
      sid,
      now.toISOString(),
      expiresAt.toISOString(),
    ],
  );

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
