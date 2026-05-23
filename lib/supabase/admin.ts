// Supabase removed. Use lib/db/index.ts (Drizzle) for direct DB access in Route Handlers.
export function createAdminClient() {
  throw new Error(
    'Supabase has been removed. Import `db` from lib/db/index.ts for direct DB access.',
  );
}
