// Supabase removed. This stub keeps any leftover import from crashing.
// All auth is now handled by Better Auth (lib/auth-client.ts).
// All DB access is now via API routes or Drizzle (lib/db).

export function createClient() {
  throw new Error(
    'Supabase has been removed. Use lib/auth-client.ts for auth and API routes for data.',
  );
}
