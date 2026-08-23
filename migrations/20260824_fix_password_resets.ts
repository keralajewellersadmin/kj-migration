import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "password_resets" ALTER COLUMN "used" DROP DEFAULT;
    ALTER TABLE "password_resets" ALTER COLUMN "used" TYPE boolean USING CASE WHEN "used"::text = '1' THEN true ELSE false END;
    ALTER TABLE "password_resets" ALTER COLUMN "used" SET DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "password_resets" ALTER COLUMN "used" TYPE integer USING CASE WHEN "used" = true THEN 1 ELSE 0 END;
  `)
}
