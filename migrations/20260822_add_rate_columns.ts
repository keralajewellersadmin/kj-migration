import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "rate_updated" timestamp(3) with time zone;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "rate_gold22" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "rate_gold18" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "rate_silver" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "rate_platinum" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "rate_updated";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "rate_gold22";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "rate_gold18";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "rate_silver";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "rate_platinum";
  `)
}
