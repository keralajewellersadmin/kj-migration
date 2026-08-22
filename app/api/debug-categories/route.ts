import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    const cats = await pool.query("SELECT id, name, slug, metal FROM categories ORDER BY metal, id");
    const silverProds = await pool.query(
      `SELECT p.id, p.title, p.category_id, c.name as cat_name, c.slug as cat_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.metal = 'silver' ORDER BY p.id`
    );
    const goldProds = await pool.query(
      `SELECT p.category_id, c.name as cat_name, c.slug as cat_slug, COUNT(*)::int as cnt
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.metal = 'gold'
       GROUP BY p.category_id, c.name, c.slug`
    );
    await pool.end();
    return NextResponse.json({ categories: cats.rows, silverProducts: silverProds.rows, goldByCat: goldProds.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
