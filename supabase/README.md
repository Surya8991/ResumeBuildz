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
# Welcome email (Resend)
supabase secrets set RESEND_API_KEY=<your-resend-api-key>
supabase secrets set WELCOME_HOOK_SECRET=<long-random-string>
supabase secrets set WELCOME_FROM='ResumeBuildz <noreply@resumebuildz.tech>'
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
auto-injected into every deployed function by Supabase. Setting them
manually with `supabase secrets set` is blocked (reserved prefix) and
unnecessary.

## Deploy

```bash
# Account deletion (GDPR)
supabase functions deploy delete-user --no-verify-jwt

# Rate-limit enforcement
supabase functions deploy increment-usage --no-verify-jwt

# Post-confirmation welcome email
supabase functions deploy send-welcome --no-verify-jwt
```

### Wire up the welcome trigger (one-time)

After `send-welcome` is deployed and its secrets are set, open
`supabase/sql/welcome_email_trigger.sql`, replace `<project-ref>` and
`<same-secret-as-function>` (use the same value as `WELCOME_HOOK_SECRET`),
then run the whole file in the Supabase SQL editor. The trigger then
fires once per user when `email_confirmed_at` transitions from NULL.

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
| `delete-user` | **Deployed + ACTIVE** | Deletes `profiles` row + `auth.users` row atomically |
| `increment-usage` | **Deployed + ACTIVE** | Enforces daily AI/PDF limits server-side |
| `send-welcome` | **Deployed + ACTIVE** | Sends welcome email via Resend after email confirmation (triggered by Postgres on `auth.users`). Dormant until `RESEND_API_KEY` + `WELCOME_HOOK_SECRET` secrets set and trigger SQL run. |

Until these are deployed, the client-side fallback remains active
(localStorage counter + client-only profile delete).

## Secret rotation schedule

Secrets age. A leaked token eight months old can still be an
attacker's foothold. Rotate on a calendar, not only on incidents.

| Secret | Rotation cadence | Why |
| --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yearly** (or on staff turnover) | Auto-injected into Edge Functions. Regenerate in Supabase dashboard → Settings → API → service_role → regenerate. Then re-deploy Edge Functions. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Only on RLS policy change | Anon key is public by design. Rotation mainly needed if leaked alongside weak RLS. |
| `RESEND_API_KEY` | **Quarterly** | Controls outbound email from your domain. Regenerate at resend.com → API Keys → rotate. Update `supabase secrets set RESEND_API_KEY=...`. |
| `WELCOME_HOOK_SECRET` | **Quarterly** (aligned with Resend) | Shared secret between Postgres trigger and the send-welcome Edge Function. Generate via `openssl rand -hex 32`. Update BOTH the `supabase secrets set` value AND the `app.welcome_hook_secret` DB setting (see `welcome_email_trigger.sql`). |
| `STRIPE_SECRET_KEY` | On staff turnover or incident | Regenerate in Stripe dashboard → Developers → API keys. Never rotate during an active checkout flow without warning. |
| `STRIPE_WEBHOOK_SECRET` | On webhook-URL change | Regenerate in Stripe dashboard → Developers → Webhooks → your endpoint → "roll signing secret". |

### How to rotate safely

1. Generate new secret (UI or `openssl rand`).
2. Add new secret under a temp env var name alongside the old one.
3. Deploy code that accepts EITHER old or new for 24 hrs.
4. Swap env var to the new value.
5. Remove the old value + temp fallback.

For non-critical secrets (Resend, WELCOME_HOOK_SECRET) you can skip
the dual-accept window and do a direct swap during a quiet hour —
worst case, a few welcome emails fail for < 60 seconds until the new
secret propagates.
