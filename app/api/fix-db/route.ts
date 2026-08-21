import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.DATABASE_URI || process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: 'No database URL found in environment variables.' });
  }

  // Only run this if we're on a Postgres connection (i.e. Vercel)
  if (url.startsWith('file:')) {
    return NextResponse.json({ message: 'Local SQLite detected. Skipping manual Postgres patch.' });
  }

  const pool = new Pool({ connectionString: url });

  try {
    const client = await pool.connect();
    
    // Create the missing relation table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "site_settings_rels" (
        "id" serial PRIMARY KEY NOT NULL,
        "order" integer,
        "parent_id" integer NOT NULL,
        "path" varchar NOT NULL,
        "products_id" integer
      );
    `);
    
    // Add foreign key for the parent (site_settings)
    try {
      await client.query(`
        ALTER TABLE "site_settings_rels" 
        ADD CONSTRAINT "site_settings_rels_parent_fk" 
        FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") 
        ON DELETE cascade ON UPDATE no action;
      `);
    } catch(e) {
      // Ignore if constraint already exists
    }
    
    // Add foreign key for the relationship to products
    try {
      await client.query(`
        ALTER TABLE "site_settings_rels" 
        ADD CONSTRAINT "site_settings_rels_products_fk" 
        FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") 
        ON DELETE cascade ON UPDATE no action;
      `);
    } catch(e) {
      // Ignore if constraint already exists
    }
    
    // Create indexes for performance
    await client.query(`CREATE INDEX IF NOT EXISTS "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "site_settings_rels_products_id_idx" ON "site_settings_rels" USING btree ("products_id");`);

    client.release();
    return NextResponse.json({ 
      success: true, 
      message: 'CRITICAL FIX APPLIED: Table site_settings_rels was created successfully in Neon Postgres.' 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
