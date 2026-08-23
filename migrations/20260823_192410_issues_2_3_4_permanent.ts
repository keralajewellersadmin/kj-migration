import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "account_activated" boolean DEFAULT false;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "slider_paused" boolean DEFAULT false;
    ALTER TABLE "site_settings_hero_slides" ADD COLUMN IF NOT EXISTS "is_pinned" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "admin_users" DROP COLUMN IF EXISTS "account_activated";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "slider_paused";
    ALTER TABLE "site_settings_hero_slides" DROP COLUMN IF EXISTS "is_pinned";
  `)
}
