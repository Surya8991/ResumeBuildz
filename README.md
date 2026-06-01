# ResumeBuildz

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Source--Available-orange)

ATS resume builder. 20 templates, live bullet scoring, AI rewrite, multi-format export. Free, no sign-up required.

Live: [resumebuildz.tech](https://resumebuildz.tech)

## Quick start

```bash
git clone https://github.com/Surya8991/ResumeBuildz.git
cd ResumeBuildz
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Works at http://localhost:3000 without env vars (guest mode, everything in localStorage).

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Auth | [Better Auth](https://www.better-auth.com/) — Google OAuth + email/password |
| Database | Neon PostgreSQL + Drizzle ORM |
| Storage | Cloudflare R2 (avatars) |
| Billing | Stripe |
| Email | Resend |
| Rate limiting | Upstash Redis (optional — falls back to in-memory) |
| AI | Groq (user-supplied key, client-side only) |

## Environment variables

Copy `.env.example` and fill in:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string (use the **pooled** `-pooler` string for serverless/Vercel) |
| `BETTER_AUTH_SECRET` | Yes | Session signing secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin for OAuth redirects. Defaults to `https://resumebuildz.tech`. **Baked in at build time** — set it in your host (e.g. Vercel) and redeploy if you change it. |
| `R2_*` | No | Cloudflare R2 for avatar uploads |
| `STRIPE_*` | No | Billing |
| `RESEND_API_KEY` | No | Password reset + share invite emails |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | No | Real per-IP rate limiting on public write endpoints. Without these, the limiter is a per-process in-memory burst guard (fine for dev/self-host; trivial to bypass on Vercel). |
| `SUPERADMIN_EMAIL` | No | Auto-promotes this email to superadmin on first signup. For existing accounts run `UPDATE profiles SET role = 'superadmin' WHERE id = '<id>';`. Additional admins can be promoted from `/admin/users`. |

Full list in [`.env.example`](.env.example).

## Admin system

ResumeBuildz ships a two-tier internal admin system (`admin` < `superadmin`), accessible at `/admin`. It is not a public plan tier.

| Role | What they can do |
|---|---|
| **admin** | View and search their assigned users, change plans, impersonate users |
| **superadmin** | Everything an admin can do, plus: promote/demote roles, assign users to admins, act on any user |

Admins and superadmins get unlimited AI rewrites and PDF exports regardless of plan.

**Bootstrap the first superadmin:** set `SUPERADMIN_EMAIL` to your email and create a new account, or run the SQL above for an existing account. Subsequent superadmins/admins are promoted from the dashboard.

## Database setup

1. Create a project at [neon.tech](https://neon.tech), copy the connection string into `DATABASE_URL`.
   - For **serverless deployments (Vercel)**, enable **Connection pooling** in Neon and use the `-pooler` connection string (e.g. `...-pooler.c-2.<region>.aws.neon.tech...`). The direct (non-pooled) host works locally but can intermittently `fetch failed` under serverless concurrency.
   - Paste the value with no wrapping quotes or trailing whitespace, and keep the `?sslmode=require` suffix.
2. Run `npx drizzle-kit migrate`.
3. Add `https://yourdomain.com/api/auth/callback/google` as a redirect URI in Google Cloud Console.

## Deploying to production (Vercel)

Set these in **Settings → Environment Variables** (Production + Preview), then **redeploy** — Vercel only applies env changes to new builds:

- `DATABASE_URL` — the Neon **pooled** (`-pooler`) connection string
- `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` (build-time; not `localhost`)

In Google Cloud Console, the OAuth client must list both the production redirect URI (`https://yourdomain.com/api/auth/callback/google`) and `https://yourdomain.com` as an authorized JavaScript origin.

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # ESLint
npm run db:generate  # Drizzle migration from schema changes
npm run db:migrate   # apply migrations
npm run db:studio    # Drizzle Studio (DB browser)
```

Pre-push hook runs lint + tsc + build automatically.

## Project structure

```
app/            Pages + API routes (auth, profile, usage, billing, email)
components/     Templates (20), forms, account panels, ATS tools, UI primitives
hooks/          Auth, toast
lib/            Auth config, DB client, export helpers, Zod schemas
store/          Zustand store with undo history
drizzle/        Generated DB migrations
```

## Contributing

Issues and PRs welcome at [Surya8991/ResumeBuildz](https://github.com/Surya8991/ResumeBuildz/issues). All PRs must pass `npm run lint` and `npm run build`.

## License

Source-available. See [LICENSE](LICENSE).
