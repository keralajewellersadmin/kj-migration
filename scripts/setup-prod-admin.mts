/* Creates (or resets passwords of) the three seeded admin accounts.
 * Passwords come from env — never hardcode credentials in the repo.
 *
 * Usage (PowerShell):
 *   $env:SEED_SUPERADMIN_PASSWORD="..."; $env:SEED_ADMIN_PASSWORD="...";
 *   $env:SEED_ENQUIRY_PASSWORD="..."; npx tsx scripts/setup-prod-admin.mts
 * Pre: schema bootstrapped, DATABASE_URL = new project.
 */
import crypto from "crypto";

// tsx interop: payload's loadEnv default-imports CJS @next/env (nested copy);
// wrap Module._load so `.default` exists on whichever instance is required.
{
  const { createRequire } = await import("node:module");
  const req = createRequire(import.meta.url);
  const Mod = req("module") as unknown as {
    _load: (request: string, ...rest: unknown[]) => unknown;
    __kjNextEnvPatched?: boolean;
  };
  if (!Mod.__kjNextEnvPatched) {
    Mod.__kjNextEnvPatched = true;
    const orig = Mod._load;
    Mod._load = function (request: string, ...rest: unknown[]) {
      const out = orig.call(this, request, ...rest) as Record<string, unknown>;
      if (
        typeof request === "string" &&
        request.includes("@next/env") &&
        out &&
        typeof out === "object" &&
        !("default" in out)
      ) {
        try {
          out.default = out;
        } catch {
          /* frozen — leave */
        }
      }
      return out;
    };
  }
}

const { getPayload } = await import("payload");
const { default: config } = await import("../payload.config.ts");
const { validateAdminPassword } = await import("../lib/payload/security.ts");

const passwordEnv = {
  superadmin: process.env.SEED_SUPERADMIN_PASSWORD,
  admin: process.env.SEED_ADMIN_PASSWORD,
  enquiry: process.env.SEED_ENQUIRY_PASSWORD,
} as const;

if (!passwordEnv.superadmin || !passwordEnv.admin || !passwordEnv.enquiry) {
  console.error(
    "Missing SEED_SUPERADMIN_PASSWORD / SEED_ADMIN_PASSWORD / SEED_ENQUIRY_PASSWORD env vars.",
  );
  process.exit(1);
}

const accounts = [
  {
    email: "keralajewellersadmin@gmail.com",
    username: "superadmin",
    name: "Super Admin",
    role: "super-admin",
    password: passwordEnv.superadmin,
  },
  {
    email: "admin@keralajewellers.in",
    username: "admin",
    name: "Store Admin",
    role: "admin",
    password: passwordEnv.admin,
  },
  {
    email: "enquiry@keralajewellers.in",
    username: "enquiry",
    name: "Enquiry Desk",
    role: "enquiry-manager",
    password: passwordEnv.enquiry,
  },
] as const;

for (const acc of accounts) {
  const check = validateAdminPassword(acc.password, {
    email: acc.email,
    name: acc.name,
  });
  if (check !== true) {
    console.error(`[admin] password policy failed for ${acc.username}: ${check}`);
    process.exit(1);
  }
}

const payload = await getPayload({ config });

async function hashPassword(password: string, salt: string): Promise<string> {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 25000, 512, "sha256", (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
  return buf.toString("hex");
}

for (const acc of accounts) {
  const found = await payload.find({
    collection: "admin-users",
    where: {
      or: [{ username: { equals: acc.username } }, { email: { equals: acc.email } }],
    },
    limit: 1,
    overrideAccess: true,
  });

  const salt = crypto.randomBytes(32).toString("hex");
  const hash = await hashPassword(acc.password, salt);

  if (found.docs[0]) {
    await payload.update({
      collection: "admin-users",
      id: found.docs[0].id,
      data: {
        salt,
        hash,
        accountActivated: true,
        isActive: true,
        role: acc.role,
      },
      overrideAccess: true,
    });
    console.log(`[admin] updated: ${acc.username} (${acc.role})`);
  } else {
    const doc = await payload.create({
      collection: "admin-users",
      data: {
        email: acc.email,
        username: acc.username,
        name: acc.name,
        role: acc.role,
        isActive: true,
      },
      overrideAccess: true,
    });
    await payload.update({
      collection: "admin-users",
      id: doc.id,
      data: { salt, hash, accountActivated: true },
      overrideAccess: true,
    });
    console.log(`[admin] created: ${acc.username} (${acc.role})`);
  }
}

const total = await payload.count({ collection: "admin-users", overrideAccess: true });
console.log(`[admin] total admin accounts: ${total.totalDocs} (limit 3)`);
console.log("[admin] done.");
process.exit(0);
