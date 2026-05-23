import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// drizzle-kit (unlike Next.js) does not auto-load .env.local, so DATABASE_URL
// would be undefined for db:generate / db:migrate / db:studio. Load it here.
config({ path: '.env.local' });

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
