import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings_thanga_mazhai_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_thanga_mazhai_why_choose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_swarnavarsha_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "site_settings_hero_slides" ADD COLUMN IF NOT EXISTS "is_pinned" boolean;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "slider_paused" boolean;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "products_page_gold_hero_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "products_page_silver_hero_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "products_page_diamond_hero_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "products_page_platinum_hero_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "thanga_mazhai_banner_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "thanga_mazhai_title" varchar DEFAULT 'Thanga Mazhai Scheme';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "thanga_mazhai_heading" varchar DEFAULT 'THANGA MAZHAI IS A ONE TIME INVESTMENT SCHEME WHERE YOU CAN DEPOSIT';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "thanga_mazhai_description" varchar DEFAULT 'Old gold ornaments of 916 purity or equivalent cash value (via card, UPI, etc.)';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "swarnavarsha_title" varchar DEFAULT 'Swarnavarsha Scheme';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "swarnavarsha_tc_heading" varchar DEFAULT 'TERMS & CONDITIONS:';
  ALTER TABLE "site_settings_thanga_mazhai_benefits" ADD CONSTRAINT "site_settings_thanga_mazhai_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_thanga_mazhai_why_choose" ADD CONSTRAINT "site_settings_thanga_mazhai_why_choose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_swarnavarsha_bullets" ADD CONSTRAINT "site_settings_swarnavarsha_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_thanga_mazhai_benefits_order_idx" ON "site_settings_thanga_mazhai_benefits" USING btree ("_order");
  CREATE INDEX "site_settings_thanga_mazhai_benefits_parent_id_idx" ON "site_settings_thanga_mazhai_benefits" USING btree ("_parent_id");
  CREATE INDEX "site_settings_thanga_mazhai_why_choose_order_idx" ON "site_settings_thanga_mazhai_why_choose" USING btree ("_order");
  CREATE INDEX "site_settings_thanga_mazhai_why_choose_parent_id_idx" ON "site_settings_thanga_mazhai_why_choose" USING btree ("_parent_id");
  CREATE INDEX "site_settings_swarnavarsha_bullets_order_idx" ON "site_settings_swarnavarsha_bullets" USING btree ("_order");
  CREATE INDEX "site_settings_swarnavarsha_bullets_parent_id_idx" ON "site_settings_swarnavarsha_bullets" USING btree ("_parent_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_products_page_gold_hero_image_id_media_id_fk" FOREIGN KEY ("products_page_gold_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_products_page_silver_hero_image_id_media_id_fk" FOREIGN KEY ("products_page_silver_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_products_page_diamond_hero_image_id_media_id_fk" FOREIGN KEY ("products_page_diamond_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_products_page_platinum_hero_image_id_media_id_fk" FOREIGN KEY ("products_page_platinum_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_thanga_mazhai_banner_id_media_id_fk" FOREIGN KEY ("thanga_mazhai_banner_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_products_page_gold_hero_products_page_gold_idx" ON "site_settings" USING btree ("products_page_gold_hero_image_id");
  CREATE INDEX "site_settings_products_page_silver_hero_products_page_si_idx" ON "site_settings" USING btree ("products_page_silver_hero_image_id");
  CREATE INDEX "site_settings_products_page_diamond_hero_products_page_d_idx" ON "site_settings" USING btree ("products_page_diamond_hero_image_id");
  CREATE INDEX "site_settings_products_page_platinum_hero_products_page__idx" ON "site_settings" USING btree ("products_page_platinum_hero_image_id");
  CREATE INDEX "site_settings_thanga_mazhai_thanga_mazhai_banner_idx" ON "site_settings" USING btree ("thanga_mazhai_banner_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_thanga_mazhai_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_thanga_mazhai_why_choose" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_swarnavarsha_bullets" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_thanga_mazhai_benefits" CASCADE;
  DROP TABLE "site_settings_thanga_mazhai_why_choose" CASCADE;
  DROP TABLE "site_settings_swarnavarsha_bullets" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_products_page_gold_hero_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_products_page_silver_hero_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_products_page_diamond_hero_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_products_page_platinum_hero_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_thanga_mazhai_banner_id_media_id_fk";
  
  DROP INDEX "site_settings_products_page_gold_hero_products_page_gold_idx";
  DROP INDEX "site_settings_products_page_silver_hero_products_page_si_idx";
  DROP INDEX "site_settings_products_page_diamond_hero_products_page_d_idx";
  DROP INDEX "site_settings_products_page_platinum_hero_products_page__idx";
  DROP INDEX "site_settings_thanga_mazhai_thanga_mazhai_banner_idx";
  ALTER TABLE "site_settings_hero_slides" DROP COLUMN "is_pinned";
  ALTER TABLE "site_settings" DROP COLUMN "slider_paused";
  ALTER TABLE "site_settings" DROP COLUMN "products_page_gold_hero_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "products_page_silver_hero_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "products_page_diamond_hero_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "products_page_platinum_hero_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "thanga_mazhai_banner_id";
  ALTER TABLE "site_settings" DROP COLUMN "thanga_mazhai_title";
  ALTER TABLE "site_settings" DROP COLUMN "thanga_mazhai_heading";
  ALTER TABLE "site_settings" DROP COLUMN "thanga_mazhai_description";
  ALTER TABLE "site_settings" DROP COLUMN "swarnavarsha_title";
  ALTER TABLE "site_settings" DROP COLUMN "swarnavarsha_tc_heading";`)
}
