/* Fresh-DB bootstrap for the new Neon project.
 *
 * 1. Pushes the full schema from the live Payload config (PAYLOAD_DB_PUSH=true
 *    on init) — the checked-in drizzle snapshot is stale, so the live config
 *    is the only trustworthy schema source.
 * 2. Records all registered migrations in payload_migrations as already applied.
 *    They are idempotent ALTERs against the pushed schema, but one contains a
 *    plain CREATE TABLE that would fail on every Vercel build otherwise.
 *
 * Usage:  npx tsx scripts/bootstrap-db.mts
 * Pre:    DATABASE_URL in .env points at the NEW project and is empty of data.
 */
process.env.PAYLOAD_DB_PUSH = "true";

const { getPayload } = await import("payload");
const { default: config } = await import("../payload.config.ts");

const dbUri = process.env.DATABASE_URL || "";
if (!dbUri.startsWith("postgres")) {
  console.error("DATABASE_URL is missing or not a postgres URL");
  process.exit(1);
}

console.log("[bootstrap] initializing Payload (schema push)…");
await getPayload({ config });

const pg = (await import("pg")).default;
const client = new pg.Client({ connectionString: dbUri, ssl: { rejectUnauthorized: false } });
await client.connect();

const tablesRes = await client.query(
  `SELECT COUNT(*)::int AS c FROM information_schema.tables
   WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
);
const tables = tablesRes.rows[0].c;
console.log(`[bootstrap] public base tables: ${tables}`);
if (tables < 20) {
  console.error("[bootstrap] schema looks incomplete — push did not run?");
  await client.end();
  process.exit(1);
}

const registered = [
  "20260822_add_category_image",
  "20260822_add_rate_columns",
  "20260823_192410_issues_2_3_4_permanent",
  "20260824_073731_add_schemes_and_banners",
  "20260824_fix_password_resets",
];

const colsRes = await client.query(
  `SELECT column_name, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_name = 'payload_migrations'
   ORDER BY ordinal_position`,
);
if (!colsRes.rows.length) {
  console.error("[bootstrap] payload_migrations table missing after push");
  await client.end();
  process.exit(1);
}
console.log(
  "[bootstrap] payload_migrations columns:",
  colsRes.rows.map((r: { column_name: string }) => r.column_name).join(", "),
);

const already = await client.query(`SELECT name FROM payload_migrations`);
const applied = new Set(already.rows.map((r: { name: string }) => r.name));

for (const name of registered) {
  if (applied.has(name)) {
    console.log(`[bootstrap] already recorded: ${name}`);
    continue;
  }
  const insertCols: string[] = [];
  const insertVals: unknown[] = [];
  for (const c of colsRes.rows as Array<{
    column_name: string;
    is_nullable: string;
    column_default: string | null;
  }>) {
    if (c.column_name === "id") continue; // serial/identity — skip, default fills it
    const requiredNoDefault = c.is_nullable === "NO" && !c.column_default;
    if (c.column_name === "name") {
      insertCols.push("name");
      insertVals.push(name);
      continue;
    }
    if (requiredNoDefault) {
      if (/_?at$/.test(c.column_name)) {
        insertCols.push(c.column_name);
        insertVals.push(new Date().toISOString());
      } else if (/batch|count|attempt/.test(c.column_name)) {
        insertCols.push(c.column_name);
        insertVals.push(1);
      } else {
        console.error(
          `[bootstrap] cannot fill required column payload_migrations.${c.column_name}`,
        );
        await client.end();
        process.exit(1);
      }
    }
    // nullable columns and columns with defaults are omitted on purpose
  }
  const placeholders = insertVals.map((_, i) => `$${i + 1}`).join(", ");
  await client.query(
    `INSERT INTO payload_migrations (${insertCols.join(", ")}) VALUES (${placeholders})`,
    insertVals,
  );
  console.log(`[bootstrap] recorded: ${name}`);
}

const finalCount = await client.query(`SELECT COUNT(*)::int AS c FROM payload_migrations`);
console.log(`[bootstrap] payload_migrations rows: ${finalCount.rows[0].c}`);
await client.end();
console.log("[bootstrap] done — schema pushed, migrations recorded.");
process.exit(0);
