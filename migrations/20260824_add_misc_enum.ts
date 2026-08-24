import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'product';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'category';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'banner';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'hero';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'gallery';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'blog';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'page';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'heritage';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'timeline';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'collection';
    ALTER TYPE "enum_media_media_type" ADD VALUE IF NOT EXISTS 'misc';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
}
