import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.execute({ raw: `
    ALTER TABLE "site_settings_categories" ADD COLUMN IF NOT EXISTS "image_id" integer;
    ALTER TABLE "site_settings_hero_slides" ADD COLUMN IF NOT EXISTS "image_id" integer;
    ALTER TABLE "site_settings_blocks_circle_banner" ADD COLUMN IF NOT EXISTS "image_id" integer;
    ALTER TABLE "site_settings_blocks_image_banner" ADD COLUMN IF NOT EXISTS "image_id" integer;
    ALTER TABLE "site_settings_heritage" ADD COLUMN IF NOT EXISTS "image_id" integer;
    ALTER TABLE "site_settings_about_page_timeline" ADD COLUMN IF NOT EXISTS "image_id" integer;
  `})
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.execute({ raw: `
    ALTER TABLE "site_settings_categories" DROP COLUMN IF EXISTS "image_id";
    ALTER TABLE "site_settings_hero_slides" DROP COLUMN IF EXISTS "image_id";
    ALTER TABLE "site_settings_blocks_circle_banner" DROP COLUMN IF EXISTS "image_id";
    ALTER TABLE "site_settings_blocks_image_banner" DROP COLUMN IF EXISTS "image_id";
    ALTER TABLE "site_settings_heritage" DROP COLUMN IF EXISTS "image_id";
    ALTER TABLE "site_settings_about_page_timeline" DROP COLUMN IF EXISTS "image_id";
  `})
}
