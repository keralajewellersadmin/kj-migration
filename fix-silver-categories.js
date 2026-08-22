const { Pool } = require('pg');

async function fix() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL_UNPOOLED,
    ssl: { rejectUnauthorized: false },
  });

  // Fix silver bracelet products: category_id 2 (bracelets-gold) -> 7 (bracelets-silver)
  const r1 = await pool.query(
    `UPDATE products SET category_id = 7 WHERE metal = 'silver' AND category_id = 2`
  );
  console.log(`Fixed ${r1.rowCount} silver bracelet products (2 -> 7)`);

  // Fix silver fancy anklets products: category_id 4 (necklace-gold) -> 10 (anklets-silver)
  const r2 = await pool.query(
    `UPDATE products SET category_id = 10 WHERE metal = 'silver' AND category_id = 4 AND title ILIKE '%anklet%'`
  );
  console.log(`Fixed ${r2.rowCount} silver anklet products (4 -> 10)`);

  // Fix silver mens chain: category_id 4 (necklace-gold) -> 8 (necklace-silver)
  const r3 = await pool.query(
    `UPDATE products SET category_id = 8 WHERE metal = 'silver' AND category_id = 4 AND title ILIKE '%chain%'`
  );
  console.log(`Fixed ${r3.rowCount} silver chain products (4 -> 8)`);

  // Check remaining: silver product with gold category_id
  const remaining = await pool.query(
    `SELECT p.id, p.title, p.category_id, c.name as cat_name, c.slug as cat_slug
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.metal = 'silver' AND c.metal = 'gold'`
  );
  console.log(`\nRemaining silver products with gold categories: ${remaining.rows.length}`);
  remaining.rows.forEach(r => console.log(`  id=${r.id} title=${r.title} cat_id=${r.category_id} cat=${r.cat_slug}`));

  // Verify filters work
  const bangles = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM products WHERE metal = 'silver' AND category_id = 7`
  );
  const anklets = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM products WHERE metal = 'silver' AND category_id = 10`
  );
  const necklaces = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM products WHERE metal = 'silver' AND category_id = 8`
  );
  console.log(`\nVerification:`);
  console.log(`  Bracelets (id=7): ${bangles.rows[0].cnt}`);
  console.log(`  Anklets (id=10): ${anklets.rows[0].cnt}`);
  console.log(`  Necklace (id=8): ${necklaces.rows[0].cnt}`);

  await pool.end();
}

fix().catch(e => { console.error(e); process.exit(1); });
