// Supabase removed. Use lib/auth.ts for server-side session: auth.api.getSession({ headers })
export async function createClient() {
  throw new Error(
    'Supabase has been removed. Use `auth.api.getSession({ headers })` from lib/auth.ts.',
  );
}
