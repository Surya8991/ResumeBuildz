# Supabase Edge Functions

Server-side enforcement for GDPR-compliant account deletion and
bypass-proof rate limiting.

**For one-time schema setup (profile columns, RLS, avatars bucket)
run the SQL in [`docs/SUPABASE_ACCOUNT_SCHEMA.md`](../docs/SUPABASE_ACCOUNT_SCHEMA.md) first.** This doc covers the Edge Functions only.

## Prerequisites

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
```

## Required SQL (run once in Supabase SQL editor)

```sql
-- Server-side usage counters (supersedes localStorage)
alter table profiles add column if not exists ai_rewrites_used int default 0;
alter table profiles add column if not exists ai_rewrites_reset_date date default current_date;
alter table profiles add column if not exists pdf_exports_used int default 0;
alter table profiles add column if not exists pdf_exports_reset_date date default current_date;
```

## Required env vars (set on the Supabase project, not the app)

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

(`SUPABASE_URL` and `SUPABASE_ANON_KEY` are auto-set by the CLI.)

## Deploy

```bash
# Account deletion (GDPR)
supabase functions deploy delete-user --no-verify-jwt

# Rate-limit enforcement
supabase functions deploy increment-usage --no-verify-jwt
```

`--no-verify-jwt` is intentional — each function verifies the caller's
JWT manually using the anon-key client before escalating to the service
role for the write.

## Client-side wiring

```ts
// Account deletion (hooks/useAuth.ts → deleteAccount)
await supabase.functions.invoke('delete-user');

// Rate-limit check (lib/usage.ts → canUseServer)
const { data } = await supabase.functions.invoke('increment-usage', {
  body: { feature: 'ai', dryRun: true },
});
if (!data.allowed) openUpgradeModal();
```

## Status

| Function | Status | Purpose |
| --- | --- | --- |
| `delete-user` | Code complete, not deployed | Deletes `profiles` row + `auth.users` row atomically |
| `increment-usage` | Code complete, not deployed | Enforces daily AI/PDF limits server-side |

Until these are deployed, the client-side fallback remains active
(localStorage counter + client-only profile delete).
