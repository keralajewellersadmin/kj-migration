import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_admin_users_role" AS ENUM('super-admin', 'admin', 'enquiry-manager');
  CREATE TYPE "public"."enum_media_media_type" AS ENUM('product', 'category', 'banner', 'hero', 'gallery', 'blog', 'page', 'heritage', 'timeline', 'collection', 'misc');
  CREATE TYPE "public"."enum_products_metal" AS ENUM('gold', 'silver', 'diamond', 'platinum');
  CREATE TYPE "public"."enum_categories_metal" AS ENUM('gold', 'silver', 'diamond', 'platinum');
  CREATE TYPE "public"."enum_blog_posts_body_type" AS ENUM('h2', 'p', 'ul');
  CREATE TYPE "public"."enum_legal_pages_sections_blocks_type" AS ENUM('p', 'ul');
  CREATE TYPE "public"."enum_inquiries_source" AS ENUM('contact', 'enquiry');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'in-progress', 'resolved', 'closed', 'spam');
  CREATE TYPE "public"."enum_inquiries_email_notification_status" AS ENUM('not-sent', 'sent', 'failed');
  CREATE TYPE "public"."enum_audit_logs_outcome" AS ENUM('success', 'failure');
  CREATE TABLE "admin_users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admin_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"username" varchar,
  	"role" "enum_admin_users_role" DEFAULT 'enquiry-manager' NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"salt" varchar,
  	"hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"media_type" "enum_media_media_type" DEFAULT 'misc',
  	"cloudinary_public_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"code" varchar,
  	"metal" "enum_products_metal",
  	"category_id" integer,
  	"weight" varchar,
  	"purity" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"metal" "enum_categories_metal" NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"display_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_body_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "blog_posts_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_blog_posts_body_type" NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"date" varchar,
  	"thumbnail_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legal_pages_sections_blocks_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "legal_pages_sections_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_legal_pages_sections_blocks_type" NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "legal_pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar,
  	"city" varchar,
  	"preferred_time" varchar,
  	"product_name" varchar,
  	"product_id" varchar,
  	"source" "enum_inquiries_source" DEFAULT 'contact',
  	"read" boolean DEFAULT false,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"email_notification_status" "enum_inquiries_email_notification_status" DEFAULT 'not-sent',
  	"submitted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rate_limits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"count" numeric DEFAULT 1 NOT NULL,
  	"reset_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"actor_id" integer,
  	"action" varchar NOT NULL,
  	"resource_type" varchar,
  	"resource_id" varchar,
  	"metadata" jsonb,
  	"ip_hash" varchar,
  	"user_agent" varchar,
  	"outcome" "enum_audit_logs_outcome" DEFAULT 'success' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "login_otps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" numeric NOT NULL,
  	"code_hash" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"attempts" numeric DEFAULT 0,
  	"session_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "password_resets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"token_hash" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"used" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"location" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admin_users_id" integer,
  	"media_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"blog_posts_id" integer,
  	"legal_pages_id" integer,
  	"inquiries_id" integer,
  	"rate_limits_id" integer,
  	"audit_logs_id" integer,
  	"login_otps_id" integer,
  	"password_resets_id" integer,
  	"reviews_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admin_users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"description" varchar,
  	"cta_text" varchar DEFAULT 'EXPLORE',
  	"cta_href" varchar DEFAULT '/products',
  	"image_id" integer
  );
  
  CREATE TABLE "site_settings_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"cta_text" varchar,
  	"cta_href" varchar,
  	"variant" varchar
  );
  
  CREATE TABLE "site_settings_blocks_circle_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"alt" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_image_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"title" varchar,
  	"cta_text" varchar,
  	"href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_heritage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "site_settings_about_page_golden_occasions_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_about_page_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "site_settings_about_page_ventures_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings_branches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"phone_full" varchar,
  	"email" varchar,
  	"hours" varchar,
  	"map_q" varchar,
  	"map_embed_url" varchar
  );
  
  CREATE TABLE "site_settings_contact_page_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"about_page_golden_occasions_heading" varchar DEFAULT 'Golden Occasions & Gleaming Beginnings',
  	"about_page_golden_occasions_image_id" integer,
  	"about_page_golden_occasions_alt" varchar DEFAULT 'About Kerala Jewellers',
  	"about_page_taste_meets_tradition_heading" varchar DEFAULT 'Taste Meets Tradition',
  	"about_page_taste_meets_tradition_text" varchar,
  	"about_page_origins_heading" varchar DEFAULT 'The Origins',
  	"about_page_origins_intro" varchar,
  	"about_page_ventures_heading" varchar DEFAULT 'Our Ventures',
  	"about_page_ventures_subheading" varchar DEFAULT 'Our Dedicated Wedding Hall',
  	"about_page_ventures_image_id" integer,
  	"about_page_ventures_alt" varchar,
  	"about_page_ventures_cta1_text" varchar DEFAULT 'Know More About Us',
  	"about_page_ventures_cta1_href" varchar DEFAULT 'https://www.ayswariyamahal.com/',
  	"about_page_ventures_cta2_text" varchar DEFAULT 'Find Us',
  	"about_page_ventures_cta2_href" varchar DEFAULT 'https://maps.app.goo.gl/vP759GxjSJLK4oU88',
  	"phone" varchar,
  	"whatsapp" varchar,
  	"email" varchar,
  	"store_timing" varchar,
  	"footer_about" varchar,
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"youtube_url" varchar,
  	"homepage_sections_bestsellers_title" varchar DEFAULT 'Our Bestsellers',
  	"homepage_sections_bestsellers_subtitle" varchar DEFAULT 'Choose from among trendy designs and timeless pieces. There''s something for everyone and every occasion.',
  	"homepage_sections_latest_title" varchar DEFAULT 'Our Latest',
  	"homepage_sections_latest_subtitle" varchar DEFAULT 'Check out some of the latest designs in our ever-expanding collection.',
  	"homepage_sections_reviews_title" varchar DEFAULT 'Customer Reviews',
  	"homepage_sections_reviews_subtitle" varchar DEFAULT 'Our Jewelry Isn''t Just Worn. It''s Cherished. Each Piece Tells A Story, And You Can Hear It From Our Customers Who Wear Theirs With Pride.',
  	"blog_page_promo_heading" varchar DEFAULT 'Wedding Season is here',
  	"blog_page_promo_description" varchar DEFAULT 'Embrace the magic of the wedding season with our exquisite jewellery collection. Elevate your bridal ensemble or find the perfect gift for the happy couple with our stunning array of wedding-ready pieces.',
  	"blog_page_promo_cta_text" varchar DEFAULT 'Shop Now',
  	"blog_page_promo_cta_href" varchar DEFAULT '/products',
  	"blog_page_promo_image_id" integer,
  	"blog_page_header_title" varchar DEFAULT 'Our Blog',
  	"blog_page_header_subtitle" varchar DEFAULT 'From Shopping Guides To Lifestyle Recommendations, Explore Our Blog And Learn Everything You Need To Know About Jewellery.',
  	"blog_page_empty_text" varchar DEFAULT 'Blog posts coming soon. Stay tuned for shopping guides, lifestyle tips, and everything about jewellery.',
  	"contact_page_hero_title" varchar DEFAULT 'Contact Kerala Jewellers',
  	"contact_page_hero_subtitle" varchar DEFAULT 'We''re here to help you with store visits, jewellery enquiries, custom designs, and service support.',
  	"contact_page_card_title" varchar DEFAULT 'Get In Touch',
  	"contact_page_card_description" varchar DEFAULT 'Looking for a specific jewellery design, bridal collection, custom order, or gold/silver rate update? Our team will guide you with product availability, store visit support, and purchase assistance.',
  	"contact_page_card_quote" varchar DEFAULT 'Send us a message and our team will get back to you shortly.',
  	"contact_page_branches_title" varchar DEFAULT 'Our Branches',
  	"products_page_gold_hero_title" varchar DEFAULT 'Elegant & Timeless Gold Jewellery',
  	"products_page_gold_hero_subtitle" varchar DEFAULT 'Discover our exclusive collection of gold jewellery that stands the test of time. Perfect for every occasion.',
  	"products_page_silver_hero_title" varchar DEFAULT 'Classic Elegance in Silver',
  	"products_page_silver_hero_subtitle" varchar DEFAULT 'Explore our collection of timeless silver jewellery. Perfectly crafted for every moment.',
  	"products_page_diamond_hero_title" varchar DEFAULT 'Timeless Brilliance in Diamonds',
  	"products_page_diamond_hero_subtitle" varchar DEFAULT 'Discover our exquisite collection of diamond jewellery, crafted to perfection for every occasion.',
  	"products_page_platinum_hero_title" varchar DEFAULT 'Exquisite Platinum Jewellery',
  	"products_page_platinum_hero_subtitle" varchar DEFAULT 'Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury.',
  	"rate_updated" timestamp(3) with time zone,
  	"rate_gold22" varchar,
  	"rate_gold18" varchar,
  	"rate_silver" varchar,
  	"rate_platinum" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  ALTER TABLE "admin_users_sessions" ADD CONSTRAINT "admin_users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_body_items" ADD CONSTRAINT "blog_posts_body_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_body" ADD CONSTRAINT "blog_posts_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_pages_sections_blocks_items" ADD CONSTRAINT "legal_pages_sections_blocks_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages_sections_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_sections_blocks" ADD CONSTRAINT "legal_pages_sections_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages_sections" ADD CONSTRAINT "legal_pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_pages" ADD CONSTRAINT "legal_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_admin_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rate_limits_fk" FOREIGN KEY ("rate_limits_id") REFERENCES "public"."rate_limits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_login_otps_fk" FOREIGN KEY ("login_otps_id") REFERENCES "public"."login_otps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_password_resets_fk" FOREIGN KEY ("password_resets_id") REFERENCES "public"."password_resets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admin_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_hero_slides" ADD CONSTRAINT "site_settings_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_hero_slides" ADD CONSTRAINT "site_settings_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_categories" ADD CONSTRAINT "site_settings_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_categories" ADD CONSTRAINT "site_settings_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_circle_banner" ADD CONSTRAINT "site_settings_blocks_circle_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_circle_banner" ADD CONSTRAINT "site_settings_blocks_circle_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_image_banner" ADD CONSTRAINT "site_settings_blocks_image_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_image_banner" ADD CONSTRAINT "site_settings_blocks_image_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_heritage" ADD CONSTRAINT "site_settings_heritage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_heritage" ADD CONSTRAINT "site_settings_heritage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_page_golden_occasions_paragraphs" ADD CONSTRAINT "site_settings_about_page_golden_occasions_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_page_timeline" ADD CONSTRAINT "site_settings_about_page_timeline_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_about_page_timeline" ADD CONSTRAINT "site_settings_about_page_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_page_ventures_bullets" ADD CONSTRAINT "site_settings_about_page_ventures_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_branches" ADD CONSTRAINT "site_settings_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contact_page_card_items" ADD CONSTRAINT "site_settings_contact_page_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_about_page_golden_occasions_image_id_media_id_fk" FOREIGN KEY ("about_page_golden_occasions_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_about_page_ventures_image_id_media_id_fk" FOREIGN KEY ("about_page_ventures_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_blog_page_promo_image_id_media_id_fk" FOREIGN KEY ("blog_page_promo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admin_users_sessions_order_idx" ON "admin_users_sessions" USING btree ("_order");
  CREATE INDEX "admin_users_sessions_parent_id_idx" ON "admin_users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");
  CREATE UNIQUE INDEX "admin_users_username_idx" ON "admin_users" USING btree ("username");
  CREATE INDEX "admin_users_updated_at_idx" ON "admin_users" USING btree ("updated_at");
  CREATE INDEX "admin_users_created_at_idx" ON "admin_users" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_seo_seo_og_image_idx" ON "products" USING btree ("seo_og_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "blog_posts_body_items_order_idx" ON "blog_posts_body_items" USING btree ("_order");
  CREATE INDEX "blog_posts_body_items_parent_id_idx" ON "blog_posts_body_items" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_body_order_idx" ON "blog_posts_body" USING btree ("_order");
  CREATE INDEX "blog_posts_body_parent_id_idx" ON "blog_posts_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_thumbnail_idx" ON "blog_posts" USING btree ("thumbnail_id");
  CREATE INDEX "blog_posts_seo_seo_og_image_idx" ON "blog_posts" USING btree ("seo_og_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX "legal_pages_sections_blocks_items_order_idx" ON "legal_pages_sections_blocks_items" USING btree ("_order");
  CREATE INDEX "legal_pages_sections_blocks_items_parent_id_idx" ON "legal_pages_sections_blocks_items" USING btree ("_parent_id");
  CREATE INDEX "legal_pages_sections_blocks_order_idx" ON "legal_pages_sections_blocks" USING btree ("_order");
  CREATE INDEX "legal_pages_sections_blocks_parent_id_idx" ON "legal_pages_sections_blocks" USING btree ("_parent_id");
  CREATE INDEX "legal_pages_sections_order_idx" ON "legal_pages_sections" USING btree ("_order");
  CREATE INDEX "legal_pages_sections_parent_id_idx" ON "legal_pages_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_pages_slug_idx" ON "legal_pages" USING btree ("slug");
  CREATE INDEX "legal_pages_seo_seo_og_image_idx" ON "legal_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "rate_limits_key_idx" ON "rate_limits" USING btree ("key");
  CREATE INDEX "rate_limits_updated_at_idx" ON "rate_limits" USING btree ("updated_at");
  CREATE INDEX "rate_limits_created_at_idx" ON "rate_limits" USING btree ("created_at");
  CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "login_otps_updated_at_idx" ON "login_otps" USING btree ("updated_at");
  CREATE INDEX "login_otps_created_at_idx" ON "login_otps" USING btree ("created_at");
  CREATE INDEX "password_resets_updated_at_idx" ON "password_resets" USING btree ("updated_at");
  CREATE INDEX "password_resets_created_at_idx" ON "password_resets" USING btree ("created_at");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admin_users_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_rate_limits_id_idx" ON "payload_locked_documents_rels" USING btree ("rate_limits_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_login_otps_id_idx" ON "payload_locked_documents_rels" USING btree ("login_otps_id");
  CREATE INDEX "payload_locked_documents_rels_password_resets_id_idx" ON "payload_locked_documents_rels" USING btree ("password_resets_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admin_users_id_idx" ON "payload_preferences_rels" USING btree ("admin_users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_hero_slides_order_idx" ON "site_settings_hero_slides" USING btree ("_order");
  CREATE INDEX "site_settings_hero_slides_parent_id_idx" ON "site_settings_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hero_slides_image_idx" ON "site_settings_hero_slides" USING btree ("image_id");
  CREATE INDEX "site_settings_categories_order_idx" ON "site_settings_categories" USING btree ("_order");
  CREATE INDEX "site_settings_categories_parent_id_idx" ON "site_settings_categories" USING btree ("_parent_id");
  CREATE INDEX "site_settings_categories_image_idx" ON "site_settings_categories" USING btree ("image_id");
  CREATE INDEX "site_settings_blocks_circle_banner_order_idx" ON "site_settings_blocks_circle_banner" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_circle_banner_parent_id_idx" ON "site_settings_blocks_circle_banner" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_circle_banner_path_idx" ON "site_settings_blocks_circle_banner" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_circle_banner_image_idx" ON "site_settings_blocks_circle_banner" USING btree ("image_id");
  CREATE INDEX "site_settings_blocks_image_banner_order_idx" ON "site_settings_blocks_image_banner" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_image_banner_parent_id_idx" ON "site_settings_blocks_image_banner" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_image_banner_path_idx" ON "site_settings_blocks_image_banner" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_image_banner_image_idx" ON "site_settings_blocks_image_banner" USING btree ("image_id");
  CREATE INDEX "site_settings_heritage_order_idx" ON "site_settings_heritage" USING btree ("_order");
  CREATE INDEX "site_settings_heritage_parent_id_idx" ON "site_settings_heritage" USING btree ("_parent_id");
  CREATE INDEX "site_settings_heritage_image_idx" ON "site_settings_heritage" USING btree ("image_id");
  CREATE INDEX "site_settings_about_page_golden_occasions_paragraphs_order_idx" ON "site_settings_about_page_golden_occasions_paragraphs" USING btree ("_order");
  CREATE INDEX "site_settings_about_page_golden_occasions_paragraphs_parent_id_idx" ON "site_settings_about_page_golden_occasions_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_page_timeline_order_idx" ON "site_settings_about_page_timeline" USING btree ("_order");
  CREATE INDEX "site_settings_about_page_timeline_parent_id_idx" ON "site_settings_about_page_timeline" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_page_timeline_image_idx" ON "site_settings_about_page_timeline" USING btree ("image_id");
  CREATE INDEX "site_settings_about_page_ventures_bullets_order_idx" ON "site_settings_about_page_ventures_bullets" USING btree ("_order");
  CREATE INDEX "site_settings_about_page_ventures_bullets_parent_id_idx" ON "site_settings_about_page_ventures_bullets" USING btree ("_parent_id");
  CREATE INDEX "site_settings_branches_order_idx" ON "site_settings_branches" USING btree ("_order");
  CREATE INDEX "site_settings_branches_parent_id_idx" ON "site_settings_branches" USING btree ("_parent_id");
  CREATE INDEX "site_settings_contact_page_card_items_order_idx" ON "site_settings_contact_page_card_items" USING btree ("_order");
  CREATE INDEX "site_settings_contact_page_card_items_parent_id_idx" ON "site_settings_contact_page_card_items" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_page_golden_occasions_about_page_gol_idx" ON "site_settings" USING btree ("about_page_golden_occasions_image_id");
  CREATE INDEX "site_settings_about_page_ventures_about_page_ventures_im_idx" ON "site_settings" USING btree ("about_page_ventures_image_id");
  CREATE INDEX "site_settings_blog_page_blog_page_promo_image_idx" ON "site_settings" USING btree ("blog_page_promo_image_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_products_id_idx" ON "site_settings_rels" USING btree ("products_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admin_users_sessions" CASCADE;
  DROP TABLE "admin_users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "blog_posts_body_items" CASCADE;
  DROP TABLE "blog_posts_body" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "legal_pages_sections_blocks_items" CASCADE;
  DROP TABLE "legal_pages_sections_blocks" CASCADE;
  DROP TABLE "legal_pages_sections" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "rate_limits" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "login_otps" CASCADE;
  DROP TABLE "password_resets" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_hero_slides" CASCADE;
  DROP TABLE "site_settings_categories" CASCADE;
  DROP TABLE "site_settings_blocks_circle_banner" CASCADE;
  DROP TABLE "site_settings_blocks_image_banner" CASCADE;
  DROP TABLE "site_settings_heritage" CASCADE;
  DROP TABLE "site_settings_about_page_golden_occasions_paragraphs" CASCADE;
  DROP TABLE "site_settings_about_page_timeline" CASCADE;
  DROP TABLE "site_settings_about_page_ventures_bullets" CASCADE;
  DROP TABLE "site_settings_branches" CASCADE;
  DROP TABLE "site_settings_contact_page_card_items" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TYPE "public"."enum_admin_users_role";
  DROP TYPE "public"."enum_media_media_type";
  DROP TYPE "public"."enum_products_metal";
  DROP TYPE "public"."enum_categories_metal";
  DROP TYPE "public"."enum_blog_posts_body_type";
  DROP TYPE "public"."enum_legal_pages_sections_blocks_type";
  DROP TYPE "public"."enum_inquiries_source";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_email_notification_status";
  DROP TYPE "public"."enum_audit_logs_outcome";`)
}
