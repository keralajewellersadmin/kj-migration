import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`admin_users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`admin_users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`admin_users_sessions_order_idx\` ON \`admin_users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`admin_users_sessions_parent_id_idx\` ON \`admin_users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`admin_users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`username\` text,
  	\`role\` text DEFAULT 'enquiry-manager' NOT NULL,
  	\`is_active\` integer DEFAULT true,
  	\`salt\` text,
  	\`hash\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`admin_users_email_idx\` ON \`admin_users\` (\`email\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`admin_users_username_idx\` ON \`admin_users\` (\`username\`);`)
  await db.run(sql`CREATE INDEX \`admin_users_updated_at_idx\` ON \`admin_users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`admin_users_created_at_idx\` ON \`admin_users\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`media_type\` text DEFAULT 'misc',
  	\`cloudinary_public_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`code\` text,
  	\`metal\` text,
  	\`category_id\` integer,
  	\`weight\` text,
  	\`purity\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_category_idx\` ON \`products\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`products_image_idx\` ON \`products\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_seo_seo_og_image_idx\` ON \`products\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`metal\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`display_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts_body_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog_posts_body\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_posts_body_items_order_idx\` ON \`blog_posts_body_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_body_items_parent_id_idx\` ON \`blog_posts_body_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts_body\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_posts_body_order_idx\` ON \`blog_posts_body\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_body_parent_id_idx\` ON \`blog_posts_body\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`excerpt\` text,
  	\`date\` text,
  	\`thumbnail_id\` integer,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blog_posts_slug_idx\` ON \`blog_posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_thumbnail_idx\` ON \`blog_posts\` (\`thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_seo_seo_og_image_idx\` ON \`blog_posts\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_updated_at_idx\` ON \`blog_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blog_posts_created_at_idx\` ON \`blog_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections_blocks_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages_sections_blocks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_blocks_items_order_idx\` ON \`legal_pages_sections_blocks_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_blocks_items_parent_id_idx\` ON \`legal_pages_sections_blocks_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections_blocks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_blocks_order_idx\` ON \`legal_pages_sections_blocks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_blocks_parent_id_idx\` ON \`legal_pages_sections_blocks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_order_idx\` ON \`legal_pages_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_parent_id_idx\` ON \`legal_pages_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_og_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`legal_pages_slug_idx\` ON \`legal_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_seo_seo_og_image_idx\` ON \`legal_pages\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_updated_at_idx\` ON \`legal_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_created_at_idx\` ON \`legal_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`inquiries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`message\` text,
  	\`city\` text,
  	\`preferred_time\` text,
  	\`product_name\` text,
  	\`product_id\` text,
  	\`source\` text DEFAULT 'contact',
  	\`read\` integer DEFAULT false,
  	\`status\` text DEFAULT 'new',
  	\`email_notification_status\` text DEFAULT 'not-sent',
  	\`submitted_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_updated_at_idx\` ON \`inquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_created_at_idx\` ON \`inquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`rate_limits\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`count\` numeric DEFAULT 1 NOT NULL,
  	\`reset_at\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`rate_limits_key_idx\` ON \`rate_limits\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`rate_limits_updated_at_idx\` ON \`rate_limits\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`rate_limits_created_at_idx\` ON \`rate_limits\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`audit_logs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`actor_id\` integer,
  	\`action\` text NOT NULL,
  	\`resource_type\` text,
  	\`resource_id\` text,
  	\`metadata\` text,
  	\`ip_hash\` text,
  	\`user_agent\` text,
  	\`outcome\` text DEFAULT 'success' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`actor_id\`) REFERENCES \`admin_users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`audit_logs_actor_idx\` ON \`audit_logs\` (\`actor_id\`);`)
  await db.run(sql`CREATE INDEX \`audit_logs_updated_at_idx\` ON \`audit_logs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`audit_logs_created_at_idx\` ON \`audit_logs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`login_otps\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` numeric NOT NULL,
  	\`code_hash\` text NOT NULL,
  	\`expires_at\` text NOT NULL,
  	\`attempts\` numeric DEFAULT 0,
  	\`session_token\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`login_otps_updated_at_idx\` ON \`login_otps\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`login_otps_created_at_idx\` ON \`login_otps\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`password_resets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` text NOT NULL,
  	\`token_hash\` text NOT NULL,
  	\`expires_at\` text NOT NULL,
  	\`used\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`password_resets_updated_at_idx\` ON \`password_resets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`password_resets_created_at_idx\` ON \`password_resets\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`author\` text NOT NULL,
  	\`location\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admin_users_id\` integer,
  	\`media_id\` integer,
  	\`products_id\` integer,
  	\`categories_id\` integer,
  	\`blog_posts_id\` integer,
  	\`legal_pages_id\` integer,
  	\`inquiries_id\` integer,
  	\`rate_limits_id\` integer,
  	\`audit_logs_id\` integer,
  	\`login_otps_id\` integer,
  	\`password_resets_id\` integer,
  	\`reviews_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admin_users_id\`) REFERENCES \`admin_users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_posts_id\`) REFERENCES \`blog_posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`legal_pages_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`rate_limits_id\`) REFERENCES \`rate_limits\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`audit_logs_id\`) REFERENCES \`audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`login_otps_id\`) REFERENCES \`login_otps\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`password_resets_id\`) REFERENCES \`password_resets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_admin_users_id_idx\` ON \`payload_locked_documents_rels\` (\`admin_users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blog_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_legal_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`legal_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_rate_limits_id_idx\` ON \`payload_locked_documents_rels\` (\`rate_limits_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_audit_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`audit_logs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_login_otps_id_idx\` ON \`payload_locked_documents_rels\` (\`login_otps_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_password_resets_id_idx\` ON \`payload_locked_documents_rels\` (\`password_resets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admin_users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admin_users_id\`) REFERENCES \`admin_users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_admin_users_id_idx\` ON \`payload_preferences_rels\` (\`admin_users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_hero_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	\`description\` text,
  	\`cta_text\` text DEFAULT 'EXPLORE',
  	\`cta_href\` text DEFAULT '/products',
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_hero_slides_order_idx\` ON \`site_settings_hero_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_slides_parent_id_idx\` ON \`site_settings_hero_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_slides_image_idx\` ON \`site_settings_hero_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`image_id\` integer,
  	\`cta_text\` text,
  	\`cta_href\` text,
  	\`variant\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_categories_order_idx\` ON \`site_settings_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_categories_parent_id_idx\` ON \`site_settings_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_categories_image_idx\` ON \`site_settings_categories\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_blocks_circle_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_circle_banner_order_idx\` ON \`site_settings_blocks_circle_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_circle_banner_parent_id_idx\` ON \`site_settings_blocks_circle_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_circle_banner_path_idx\` ON \`site_settings_blocks_circle_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_circle_banner_image_idx\` ON \`site_settings_blocks_circle_banner\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_blocks_image_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`title\` text,
  	\`cta_text\` text,
  	\`href\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_image_banner_order_idx\` ON \`site_settings_blocks_image_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_image_banner_parent_id_idx\` ON \`site_settings_blocks_image_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_image_banner_path_idx\` ON \`site_settings_blocks_image_banner\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_blocks_image_banner_image_idx\` ON \`site_settings_blocks_image_banner\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_heritage\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`description\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_heritage_order_idx\` ON \`site_settings_heritage\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_heritage_parent_id_idx\` ON \`site_settings_heritage\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_heritage_image_idx\` ON \`site_settings_heritage\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_about_page_golden_occasions_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_golden_occasions_paragraphs_order_idx\` ON \`site_settings_about_page_golden_occasions_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_golden_occasions_paragraphs_parent_id_idx\` ON \`site_settings_about_page_golden_occasions_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_about_page_timeline\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`year\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_timeline_order_idx\` ON \`site_settings_about_page_timeline\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_timeline_parent_id_idx\` ON \`site_settings_about_page_timeline\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_timeline_image_idx\` ON \`site_settings_about_page_timeline\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_about_page_ventures_bullets\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_ventures_bullets_order_idx\` ON \`site_settings_about_page_ventures_bullets\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_ventures_bullets_parent_id_idx\` ON \`site_settings_about_page_ventures_bullets\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_branches\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`address\` text,
  	\`phone\` text,
  	\`phone_full\` text,
  	\`email\` text,
  	\`hours\` text,
  	\`map_q\` text,
  	\`map_embed_url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_branches_order_idx\` ON \`site_settings_branches\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_branches_parent_id_idx\` ON \`site_settings_branches\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_contact_page_card_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_contact_page_card_items_order_idx\` ON \`site_settings_contact_page_card_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_contact_page_card_items_parent_id_idx\` ON \`site_settings_contact_page_card_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`about_page_golden_occasions_heading\` text DEFAULT 'Golden Occasions & Gleaming Beginnings',
  	\`about_page_golden_occasions_image_id\` integer,
  	\`about_page_golden_occasions_alt\` text DEFAULT 'About Kerala Jewellers',
  	\`about_page_taste_meets_tradition_heading\` text DEFAULT 'Taste Meets Tradition',
  	\`about_page_taste_meets_tradition_text\` text,
  	\`about_page_origins_heading\` text DEFAULT 'The Origins',
  	\`about_page_origins_intro\` text,
  	\`about_page_ventures_heading\` text DEFAULT 'Our Ventures',
  	\`about_page_ventures_subheading\` text DEFAULT 'Our Dedicated Wedding Hall',
  	\`about_page_ventures_image_id\` integer,
  	\`about_page_ventures_alt\` text,
  	\`about_page_ventures_cta1_text\` text DEFAULT 'Know More About Us',
  	\`about_page_ventures_cta1_href\` text DEFAULT 'https://www.ayswariyamahal.com/',
  	\`about_page_ventures_cta2_text\` text DEFAULT 'Find Us',
  	\`about_page_ventures_cta2_href\` text DEFAULT 'https://maps.app.goo.gl/vP759GxjSJLK4oU88',
  	\`phone\` text,
  	\`whatsapp\` text,
  	\`email\` text,
  	\`store_timing\` text,
  	\`footer_about\` text,
  	\`instagram_url\` text,
  	\`facebook_url\` text,
  	\`youtube_url\` text,
  	\`homepage_sections_bestsellers_title\` text DEFAULT 'Our Bestsellers',
  	\`homepage_sections_bestsellers_subtitle\` text DEFAULT 'Choose from among trendy designs and timeless pieces. There''s something for everyone and every occasion.',
  	\`homepage_sections_latest_title\` text DEFAULT 'Our Latest',
  	\`homepage_sections_latest_subtitle\` text DEFAULT 'Check out some of the latest designs in our ever-expanding collection.',
  	\`homepage_sections_reviews_title\` text DEFAULT 'Customer Reviews',
  	\`homepage_sections_reviews_subtitle\` text DEFAULT 'Our Jewelry Isn''t Just Worn. It''s Cherished. Each Piece Tells A Story, And You Can Hear It From Our Customers Who Wear Theirs With Pride.',
  	\`blog_page_promo_heading\` text DEFAULT 'Wedding Season is here',
  	\`blog_page_promo_description\` text DEFAULT 'Embrace the magic of the wedding season with our exquisite jewellery collection. Elevate your bridal ensemble or find the perfect gift for the happy couple with our stunning array of wedding-ready pieces.',
  	\`blog_page_promo_cta_text\` text DEFAULT 'Shop Now',
  	\`blog_page_promo_cta_href\` text DEFAULT '/products',
  	\`blog_page_promo_image_id\` integer,
  	\`blog_page_header_title\` text DEFAULT 'Our Blog',
  	\`blog_page_header_subtitle\` text DEFAULT 'From Shopping Guides To Lifestyle Recommendations, Explore Our Blog And Learn Everything You Need To Know About Jewellery.',
  	\`blog_page_empty_text\` text DEFAULT 'Blog posts coming soon. Stay tuned for shopping guides, lifestyle tips, and everything about jewellery.',
  	\`contact_page_hero_title\` text DEFAULT 'Contact Kerala Jewellers',
  	\`contact_page_hero_subtitle\` text DEFAULT 'We''re here to help you with store visits, jewellery enquiries, custom designs, and service support.',
  	\`contact_page_card_title\` text DEFAULT 'Get In Touch',
  	\`contact_page_card_description\` text DEFAULT 'Looking for a specific jewellery design, bridal collection, custom order, or gold/silver rate update? Our team will guide you with product availability, store visit support, and purchase assistance.',
  	\`contact_page_card_quote\` text DEFAULT 'Send us a message and our team will get back to you shortly.',
  	\`contact_page_branches_title\` text DEFAULT 'Our Branches',
  	\`products_page_gold_hero_title\` text DEFAULT 'Elegant & Timeless Gold Jewellery',
  	\`products_page_gold_hero_subtitle\` text DEFAULT 'Discover our exclusive collection of gold jewellery that stands the test of time. Perfect for every occasion.',
  	\`products_page_silver_hero_title\` text DEFAULT 'Classic Elegance in Silver',
  	\`products_page_silver_hero_subtitle\` text DEFAULT 'Explore our collection of timeless silver jewellery. Perfectly crafted for every moment.',
  	\`products_page_diamond_hero_title\` text DEFAULT 'Timeless Brilliance in Diamonds',
  	\`products_page_diamond_hero_subtitle\` text DEFAULT 'Discover our exquisite collection of diamond jewellery, crafted to perfection for every occasion.',
  	\`products_page_platinum_hero_title\` text DEFAULT 'Exquisite Platinum Jewellery',
  	\`products_page_platinum_hero_subtitle\` text DEFAULT 'Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury.',
  	\`rate_updated\` text,
  	\`rate_gold22\` text,
  	\`rate_gold18\` text,
  	\`rate_silver\` text,
  	\`rate_platinum\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`about_page_golden_occasions_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`about_page_ventures_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`blog_page_promo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_golden_occasions_about_page_gol_idx\` ON \`site_settings\` (\`about_page_golden_occasions_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_about_page_ventures_about_page_ventures_im_idx\` ON \`site_settings\` (\`about_page_ventures_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_blog_page_blog_page_promo_image_idx\` ON \`site_settings\` (\`blog_page_promo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_rels_order_idx\` ON \`site_settings_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_rels_parent_idx\` ON \`site_settings_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_rels_path_idx\` ON \`site_settings_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_rels_products_id_idx\` ON \`site_settings_rels\` (\`products_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`admin_users_sessions\`;`)
  await db.run(sql`DROP TABLE \`admin_users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_body_items\`;`)
  await db.run(sql`DROP TABLE \`blog_posts_body\`;`)
  await db.run(sql`DROP TABLE \`blog_posts\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections_blocks_items\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections_blocks\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections\`;`)
  await db.run(sql`DROP TABLE \`legal_pages\`;`)
  await db.run(sql`DROP TABLE \`inquiries\`;`)
  await db.run(sql`DROP TABLE \`rate_limits\`;`)
  await db.run(sql`DROP TABLE \`audit_logs\`;`)
  await db.run(sql`DROP TABLE \`login_otps\`;`)
  await db.run(sql`DROP TABLE \`password_resets\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_settings_hero_slides\`;`)
  await db.run(sql`DROP TABLE \`site_settings_categories\`;`)
  await db.run(sql`DROP TABLE \`site_settings_blocks_circle_banner\`;`)
  await db.run(sql`DROP TABLE \`site_settings_blocks_image_banner\`;`)
  await db.run(sql`DROP TABLE \`site_settings_heritage\`;`)
  await db.run(sql`DROP TABLE \`site_settings_about_page_golden_occasions_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`site_settings_about_page_timeline\`;`)
  await db.run(sql`DROP TABLE \`site_settings_about_page_ventures_bullets\`;`)
  await db.run(sql`DROP TABLE \`site_settings_branches\`;`)
  await db.run(sql`DROP TABLE \`site_settings_contact_page_card_items\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings_rels\`;`)
}
