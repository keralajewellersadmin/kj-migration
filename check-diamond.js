const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_e6fuYvdpwE5c@ep-broad-frost-awkb8sl3.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require',
  });

  try {
    // Check if diamond-choker-kjd005 exists
    const res = await pool.query("SELECT id, title, slug, image_id FROM products WHERE slug = $1", ['diamond-choker-kjd005']);
    console.log('=== diamond-choker-kjd005 search ===');
    console.log('Found:', res.rows.length, 'rows');
    if (res.rows.length) console.log(JSON.stringify(res.rows[0]));

    // Search for any diamond choker products
    const res2 = await pool.query("SELECT id, title, slug, image_id FROM products WHERE slug ILIKE '%diamond%' OR title ILIKE '%diamond%'");
    console.log('\n=== All diamond products ===');
    console.log('Found:', res2.rows.length, 'rows');
    res2.rows.forEach(r => console.log(`  ${r.id}: "${r.title}" (slug: ${r.slug}) image_id: ${r.image_id}`));

    // Search for choker products
    const res3 = await pool.query("SELECT id, title, slug, image_id FROM products WHERE slug ILIKE '%choker%' OR title ILIKE '%choker%'");
    console.log('\n=== All choker products ===');
    console.log('Found:', res3.rows.length, 'rows');
    res3.rows.forEach(r => console.log(`  ${r.id}: "${r.title}" (slug: ${r.slug}) image_id: ${r.image_id}`));

  } finally {
    await pool.end();
  }
}

main().catch(console.error);
