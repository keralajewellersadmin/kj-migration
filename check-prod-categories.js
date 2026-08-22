const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_KJmzV98fLTpR@ep-broad-frost-awkb8sl3-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require' });
(async () => {
  const cats = await pool.query('SELECT id, name, slug, metal FROM categories ORDER BY id');
  console.log('=== PROD CATEGORIES ===');
  cats.rows.forEach(r => console.log(`  id=${r.id} slug=${r.slug} name=${r.name} metal=${r.metal}`));
  const silverProds = await pool.query(`SELECT p.id, p.title, p.category_id, c.name as cat_name, c.slug as cat_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.metal = 'silver' ORDER BY p.id`);
  console.log('=== SILVER PRODUCTS WITH CATEGORY ===');
  silverProds.rows.forEach(r => console.log(`  id=${r.id} title=${r.title} category_id=${r.category_id} cat_name=${r.cat_name} cat_slug=${r.cat_slug}`));
  await pool.end();
})();
