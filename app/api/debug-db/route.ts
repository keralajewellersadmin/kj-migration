import { NextResponse } from 'next/server';
import { getPool } from '@/lib/data/cms';

export async function GET(request: Request) {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT p.title as product_title, p.category_id, c.name as cat_name, c.slug as cat_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.metal = 'silver'
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
