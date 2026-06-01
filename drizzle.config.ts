import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// drizzle-kit (unlike Next.js) does not auto-load .env.local, so DATABASE_URL
// would be undefined for db:generate / db:migrate / db:studio. Load it here.
config({ path: '.env.local' });

// Migrations require a direct (non-pooled) PostgreSQL connection.
// On Vercel the app uses the pooled URL (-pooler host) for queries, but DDL
// statements hang over PgBouncer. Set MIGRATE_DATABASE_URL to the Neon direct
// URL (no -pooler in the hostname) in Vercel env vars.
// Locally DATABASE_URL is the direct URL so the fallback works fine.
const migrateUrl = process.env.MIGRATE_DATABASE_URL ?? process.env.DATABASE_URL!;

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrateUrl,
  },
});
