/* Reseeds the new Neon project from scripts/phase1-db-dump.json:
 * 12 categories, product-image media rows, 127 products.
 *
 * Original IDs are preserved so products.category_id and products.image_id
 * stay valid without remapping. Fields not captured by the phase1 dump
 * (weight, purity, code, status, best_seller, seo_*, sort_order) stay NULL
 * until the Oct-1 pg_dump merge from the old suspended project.
 *
 * Usage: node scripts/reseed.mjs
 * Pre:   schema bootstrapped (scripts/bootstrap-db.mts), DATABASE_URL = new project.
 */
import pg from "pg";
import fs from "fs";
import { fileURLToPath } from "url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL || "";
if (!url.startsWith("postgres")) {
  console.error("DATABASE_URL missing or not postgres");
  process.exit(1);
}

const dumpPath = fileURLToPath(new URL("./phase1-db-dump.json", import.meta.url));
const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const existing = await client.query("SELECT COUNT(*)::int AS c FROM products");
if (existing.rows[0].c > 0) {
  console.error(
    `[reseed] products already has ${existing.rows[0].c} rows — aborting (idempotency guard).`,
  );
  await client.end();
  process.exit(1);
}

// ── 1. categories (original IDs) ───────────────────────────────────────────
for (const c of dump.categories) {
  await client.query(
    `INSERT INTO categories
       (id, metal, name, slug, display_order, updated_at, created_at,
        seo_title, seo_description, description, image_id, banner_id, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [
      c.id,
      c.metal,
      c.name,
      c.slug,
      Number(c.display_order) || 0,
      c.updated_at,
      c.created_at,
      c.seo_title,
      c.seo_description,
      c.description,
      c.image_id,
      c.banner_id,
      c.active == null ? null : Boolean(c.active),
    ],
  );
}
console.log(`[reseed] categories: ${dump.categories.length}`);

// ── 2. media rows referenced by products (original IDs) ────────────────────
const mimeFor = (f = "") => {
  const x = f.toLowerCase();
  if (x.endsWith(".png")) return "image/png";
  if (x.endsWith(".webp")) return "image/webp";
  if (x.endsWith(".gif")) return "image/gif";
  if (x.endsWith(".svg")) return "image/svg+xml";
  if (x.endsWith(".avif")) return "image/avif";
  return "image/jpeg";
};

const mediaIds = new Set();
let mediaCount = 0;
for (const p of dump.products) {
  if (!p.image_id) continue;
  if (!p.url && !p.cloudinary_public_id) continue;
  if (mediaIds.has(p.image_id)) continue;
  mediaIds.add(p.image_id);
  await client.query(
    `INSERT INTO media
       (id, alt, caption, media_type, updated_at, created_at, url, filename, mime_type,
        cloudinary_public_id)
     VALUES ($1,$2,$3,$4,now(),now(),$5,$6,$7,$8)`,
    [
      p.image_id,
      p.title || null,
      null,
      "product",
      p.url || null,
      p.filename || null,
      mimeFor(p.filename || ""),
      p.cloudinary_public_id || null,
    ],
  );
  mediaCount++;
}
console.log(`[reseed] media: ${mediaCount}`);

// ── 3. products (original IDs; image_id nulled if its media row is absent) ─
let nulledImages = 0;
for (const p of dump.products) {
  const imageId = p.image_id && mediaIds.has(p.image_id) ? p.image_id : null;
  if (p.image_id && !imageId) nulledImages++;
  await client.query(
    `INSERT INTO products
       (id, title, slug, metal, category_id, description, image_id, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,now(),now())`,
    [p.id, p.title, p.slug, p.metal, p.category_id, p.description, imageId],
  );
}
console.log(
  `[reseed] products: ${dump.products.length}` +
    (nulledImages ? ` (${nulledImages} image_id nulled — media row missing)` : ""),
);

// ── 4. reset sequences so future inserts don't collide ─────────────────────
for (const table of ["categories", "media", "products"]) {
  try {
    await client.query(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'),
                      (SELECT COALESCE(MAX(id), 1) FROM ${table}))`,
    );
    console.log(`[reseed] sequence reset: ${table}`);
  } catch (e) {
    console.warn(`[reseed] sequence reset failed for ${table}:`, e.message);
  }
}

const counts = {};
for (const t of ["categories", "media", "products"]) {
  counts[t] = (await client.query(`SELECT COUNT(*)::int AS c FROM ${t}`)).rows[0].c;
}
console.log("[reseed] final counts:", counts);
await client.end();
console.log("[reseed] done.");
