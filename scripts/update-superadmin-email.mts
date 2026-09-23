/* One-off: point superadmin login email at the deliverable Gmail inbox. */
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
        try { out.default = out; } catch { /* frozen */ }
      }
      return out;
    };
  }
}

const { getPayload } = await import("payload");
const { default: config } = await import("../payload.config.ts");

const NEW_EMAIL = "keralajewellersadmin@gmail.com";
const payload = await getPayload({ config });

const found = await payload.find({
  collection: "admin-users",
  where: { username: { equals: "superadmin" } },
  limit: 1,
  overrideAccess: true,
});

if (!found.docs[0]) {
  console.error("superadmin not found");
  process.exit(1);
}

const doc = found.docs[0];
console.log("before:", doc.username, doc.email);
if (doc.email !== NEW_EMAIL) {
  await payload.update({
    collection: "admin-users",
    id: doc.id,
    data: { email: NEW_EMAIL },
    overrideAccess: true,
  });
  console.log("updated email ->", NEW_EMAIL);
} else {
  console.log("already set");
}

const all = await payload.find({
  collection: "admin-users",
  limit: 10,
  overrideAccess: true,
  sort: "id",
});
for (const u of all.docs) {
  console.log(`  ${u.username} <${u.email}> role=${u.role}`);
}
process.exit(0);