import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './payload-generated-schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_KJmzV98fLTpR@ep-broad-frost-awkb8sl3-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require',
  },
});
