// One-off production admin bootstrap.
// Credentials come from environment variables only. Do not hardcode passwords.

import crypto from "crypto";
import fs from "fs";
import { neon } from "@neondatabase/serverless";

function loadEnvFile(path: string) {
  if (!fs.existsSync(path)) return;
  const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] ||= value;
  }
}

loadEnvFile(".env.production.local");
loadEnvFile(".env.local");

const EMAIL = process.env.PROD_ADMIN_EMAIL || "keralajewellersadmin@gmail.com";
const PASSWORD = process.env.PROD_ADMIN_PASSWORD;
const NAME = process.env.PROD_ADMIN_NAME || "Kerala Jewellers Admin";
const USERNAME = process.env.PROD_ADMIN_USERNAME || EMAIL.split("@")[0];

const DUMMY_ACCOUNTS: Array<{ email?: string; username?: string }> = [
  { email: "superadmin@keralajewellers.in" },
  { username: "admin" },
  { username: "enquiry" },
];

function validatePassword(password: string) {
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/\d/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include a special character.";
  }
  return null;
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 25000, 512, "sha256")
    .toString("hex");
  return { salt, hash };
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }
  const parsed = new URL(connectionString);
  parsed.searchParams.delete("channel_binding");
  const sslMode = parsed.searchParams.get("sslmode");
  if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
    parsed.searchParams.set("sslmode", "verify-full");
  }
  if (parsed.hostname.includes("-pooler")) {
    parsed.hostname = parsed.hostname.replace("-pooler", "");
  }
  return neon(parsed.toString());
}

async function main() {
  if (!PASSWORD) {
    throw new Error("PROD_ADMIN_PASSWORD is required.");
  }

  const passwordError = validatePassword(PASSWORD);
  if (passwordError) {
    throw new Error(passwordError);
  }

  const sql = getSql();
  const normalizedEmail = EMAIL.trim().toLowerCase();
  const normalizedUsername = USERNAME.trim().toLowerCase();
  const now = new Date();
  const { salt, hash } = hashPassword(PASSWORD);

  for (const account of DUMMY_ACCOUNTS) {
    if (account.email?.toLowerCase() === normalizedEmail) continue;
    const rows = account.email
      ? await sql.query(
        `select id from admin_users where lower(email) = $1`,
        [account.email.toLowerCase()],
      ) as Array<{ id: number }>
      : await sql.query(
        `select id from admin_users where lower(username) = $1`,
        [String(account.username).toLowerCase()],
      ) as Array<{ id: number }>;

    for (const row of rows) {
      await sql.query(`delete from admin_users_sessions where _parent_id = $1`, [
        row.id,
      ]);
      await sql.query(`delete from admin_users where id = $1`, [row.id]);
      console.log(
        `Deleted dummy account: ${account.email ?? account.username} (id ${row.id})`,
      );
    }
  }

  const existing = await sql.query(
    `select id from admin_users where lower(email) = $1 limit 1`,
    [normalizedEmail],
  ) as Array<{ id: number }>;

  if (existing[0]) {
    await sql.query(
      `update admin_users
       set username = $2,
           name = $3,
           role = 'super-admin',
           is_active = true,
           salt = $4,
           hash = $5,
           login_attempts = 0,
           lock_until = null,
           updated_at = $6
       where id = $1`,
      [existing[0].id, normalizedUsername, NAME, salt, hash, now],
    );
    await sql.query(`delete from admin_users_sessions where _parent_id = $1`, [
      existing[0].id,
    ]);
    console.log(`Updated production super-admin: ${normalizedEmail}`);
  } else {
    await sql.query(
      `insert into admin_users
       (email, username, name, role, is_active, salt, hash, login_attempts, updated_at, created_at)
       values ($1, $2, $3, 'super-admin', true, $4, $5, 0, $6, $6)`,
      [normalizedEmail, normalizedUsername, NAME, salt, hash, now],
    );
    console.log(`Created production super-admin: ${normalizedEmail}`);
  }

  console.log("Production admin setup complete.");
}

main().catch((err) => {
  console.error("Setup failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
