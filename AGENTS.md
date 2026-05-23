<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ResumeBuildz — agent guide

ATS-friendly resume builder. Guest mode works with zero config (localStorage only); auth, sync, and billing light up as their env vars are set.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Auth | **Better Auth** (`lib/auth.ts`) — Google OAuth + email/password |
| DB | **Neon PostgreSQL** + **Drizzle ORM** (`@neondatabase/serverless` neon-http driver) |
| Storage | Cloudflare R2 (avatars) via `@aws-sdk/client-s3` — optional |
| Email | **Resend**, all routed through `lib/email.ts` |
| Billing | Stripe — optional |
| AI | Groq, **user supplies their own key in the browser** (no server key) |
| Host | Vercel (serverless functions + Cron) |

This is a post-Supabase codebase. Anything referencing Supabase (Edge Functions, `auth.users` triggers, RLS, `pg_net`) is **stale history** — do not reintroduce it. The current equivalents are Next.js API routes under `app/api/`.

## Before you ship: the mandatory gate

Husky runs **lint + `tsc --noEmit` + `next build`** on pre-push (pre-commit is a no-op). Run these yourself before declaring done:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Never `--no-verify`. If a hook fails, fix the cause.

## Environment & deploy gotchas (these have bitten us)

- **`DATABASE_URL` must be the Neon POOLED string on Vercel.** Use the `-pooler` host (`ep-xxx-pooler.<region>.aws.neon.tech`). The direct host works locally but throws `NeonDbError: fetch failed` under serverless concurrency — it surfaces as a 500 on auth (e.g. the `verification` insert during the OAuth callback). Paste with no quotes/trailing whitespace.
- **`NEXT_PUBLIC_*` vars are baked in at BUILD time.** Changing `NEXT_PUBLIC_SITE_URL` requires a **redeploy**, not just an env edit. Never leave it as `http://localhost:3000` in production.
- **Env var changes on Vercel only apply to NEW builds.** After editing env vars, redeploy.
- Required for auth to work in prod: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_SITE_URL`. Full list + comments in `.env.example`.
- Google Cloud Console must list `https://<domain>/api/auth/callback/google` as a redirect URI and `https://<domain>` as a JS origin.
- **Never commit `.env.local`** (gitignored via `.env*` with a `!.env.example` exception).

## Conventions

- **Lazy singletons via Proxy.** `lib/db/index.ts` and `lib/auth.ts` defer init until first use so the module imports cleanly during CI builds without secrets. Don't eagerly read `process.env` at module top level for DB/auth. The auth Proxy's `has` trap is load-bearing (`toNextJsHandler` does `"handler" in auth`) — don't remove it.
- **Email is always optional and must degrade gracefully.** Send via `sendEmail()` in `lib/email.ts`, which **no-ops without `RESEND_API_KEY` and never throws**. Templates live in `lib/emails/templates.ts` (pure `{ subject, html }` builders) wrapping the shared layout in `lib/emails/layout.ts`. Escape user input with `escapeHtml` before embedding. A failed/slow email must never break the request that triggered it.
- **Better Auth email hooks** are wired in `lib/auth.ts`: `sendResetPassword`, `onPasswordReset`, `emailVerification.sendVerificationEmail`, `user.changeEmail.sendChangeEmailConfirmation`, `user.deleteUser.afterDelete`, and the welcome email in `databaseHooks.user.create.after`. **Read the compiled types in `node_modules/better-auth/dist/` to confirm option/callback names before adding hooks** — don't trust training data for exact shapes.
- **Public write endpoints must validate server-side + rate-limit.** Don't trust client trimming. Use `rateLimit()` + `clientId()` from `lib/rateLimit.ts`, cap string lengths, validate email format, and parse JSON in a try/catch. `app/api/share/invite/route.ts` is the reference (same-origin check, auth, rate limit, HTML escaping).
- **Cron & operator endpoints** are gated by a `CRON_SECRET` bearer, fail-closed (503 if unset, 401 on mismatch). Use the shared **`requireCronAuth(req)`** from `lib/apiAuth.ts` (constant-time compare) — don't hand-roll the bearer check. See `app/api/cron/*` and `app/api/admin/broadcast`. Vercel injects `Authorization: Bearer $CRON_SECRET` for crons in `vercel.json`.
- **Marketing email needs consent + unsubscribe.** Bulk product-update broadcasts are strict opt-in (`profiles.notifyProduct = true`); lifecycle nudges (e.g. resume reminders) are opt-out (`notifyProduct` is not `false`). Every marketing/lifecycle email must carry an unsubscribe link via `lib/emailTokens.ts` (stateless HMAC) **and** `List-Unsubscribe`/`List-Unsubscribe-Post` headers. Transactional email (auth, receipts) gets no unsubscribe.
- **State-changing links in email must be POST, not GET.** Email scanners/prefetchers auto-follow GET links. `/api/email/unsubscribe` GET renders a confirm page; POST performs the change (RFC 8058 one-click). Follow this pattern for any future email action links.
- **Never return raw DB/exception strings to clients.** Catch, `console.error` server-side, return a generic message (see the lead routes). Raw `e.message` can leak schema/driver internals.
- **DB schema** is `lib/db/schema.ts`. After changing it: `npm run db:generate` then `npm run db:migrate`. Better Auth core table column names must match exactly.
- **`SITE_URL`** comes from `lib/siteConfig.ts` — use it (or `absoluteUrl()`) for any canonical/absolute URL; don't hardcode the domain.

## Docs to keep in sync

When you change behavior, update: `README.md`, `.env.example` (new env vars), `CHANGELOG.md` **and** `lib/changelogData.ts` (the rendered changelog + RSS read from the latter — keep both in step and use a version higher than both files' current top entry).
