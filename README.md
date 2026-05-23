# ResumeBuildz

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Source--Available-orange)

A production resume builder aimed at the 75% of resumes that get filtered by ATS before a human sees them. 20 ATS-friendly templates, live bullet scoring, AI rewrite assist, multi-format export. Free to start, no sign-up required.

Live site: [resumebuildz.tech](https://resumebuildz.tech)

---

## About

Most resume tools optimise for looking pretty in PDF viewers. ATS software doesn't parse pretty — it parses structured text, keywords, and conventional section headings. ResumeBuildz is built around that reality: every template is ATS-safe, every bullet is scored against the rules real screeners apply, and every export renders predictable, keyword-rich output.

Privacy-first: resume data lives in your browser by default. Cloud sync is opt-in for signed-in users. Groq API keys are stored in `sessionStorage` (cleared when the tab closes) and sent directly to Groq — the ResumeBuildz server never sees them.

## Features

### Builder
- 20 ATS-friendly templates (Classic, Modern, Tech, Executive, Nordic, Federal, Infographic, and more), lazy-loaded on demand
- Live preview with zoom, dark mode, and full-screen toggle
- 9 built-in sections plus unlimited custom sections, drag-reorder at section and entry level
- Import resume from JSON, DOCX, or paste
- Export as PDF, DOCX, HTML, Markdown, or ATS plain text — all auto-named `{lastName}_{firstName}_{role}_{date}.{ext}`
- Undo / redo with 50-snapshot history, auto-save to localStorage every 1s, Ctrl+K command palette

### ATS scoring
- 12-point check (contact completeness, summary length, action verbs, quantified results, keyword coverage, and more)
- Section-level score breakdown with jump-to-fix deep links
- Per-bullet traffic-light scorer with weak-opener suggestions ("responsible for" → Led / Owned / Managed)
- Duplicate-verb detector within a role
- Overused-keyword chips across the whole resume
- Job description matcher with keyword-gap analysis

### AI assist (user-supplied Groq API key)
- Per-bullet rewrite with accept/discard preview
- Cover letter generation conditioned on job title + company
- AI gap analysis on JD mismatch

### Account (optional sign-in)
- Google OAuth + email/password via Better Auth
- Cloud sync so resumes follow you across devices
- `/account` settings: avatar, headline, job-search prefs, builder defaults, notification prefs, connected accounts
- Profile values auto-fill into new resumes

### Standard industry stuff
- Full TypeScript, strict mode
- ESLint + React 19 purity rules enforced
- JSON-LD structured data across all marketing pages (Article, FAQ, Breadcrumb, HowTo)
- CSP, HSTS, X-Frame-Options, Referrer-Policy via Next proxy
- Database security via Drizzle ORM + Neon PostgreSQL
- GDPR: export-my-data + delete-account via API routes

## Quick start

Prerequisites: Node 20+ and npm.

```bash
git clone https://github.com/Surya8991/ResumeBuildz.git
cd ResumeBuildz
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open http://localhost:3000. Without any env vars the app runs in guest-stub mode with everything in localStorage.

## Environment variables

All `NEXT_PUBLIC_*` values are inlined at build time. Restart the dev server after changes.

| Variable | Required | Used for |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string. |
| `BETTER_AUTH_SECRET` | Yes | Session signing secret for Better Auth. |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical site URL / OAuth redirect base. Defaults to `https://resumebuildz.tech`. |
| `R2_ENDPOINT` | Optional | Cloudflare R2 S3-compatible endpoint for avatar uploads. |
| `R2_ACCESS_KEY_ID` | Optional | R2 access key. |
| `R2_SECRET_ACCESS_KEY` | Optional | R2 secret key. |
| `R2_BUCKET_NAME` | Optional | R2 bucket name. |
| `R2_PUBLIC_URL` | Optional | Public URL prefix for R2-hosted assets. |
| `STRIPE_SECRET_KEY` | Optional | Stripe checkout session creation. |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhook signature verification. |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER` | Optional | Stripe price ID for the Starter plan. |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` | Optional | Stripe price ID for the Pro plan. |
| `NEXT_PUBLIC_STRIPE_PRICE_TEAM` | Optional | Stripe price ID for the Team plan. |
| `NEXT_PUBLIC_STRIPE_PRICE_LIFETIME` | Optional | Stripe price ID for the Lifetime plan. |
| `RESEND_API_KEY` | Optional | Password reset and share-invite emails. Omit to disable email; UI falls back to copy-link mode. |
| `SHARE_INVITE_FROM` | Optional | From address for emails (e.g. `ResumeBuildz <noreply@yourdomain.com>`). |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry error monitoring. Omit to disable. |
| Groq API key (per-user, client-side) | — | Users enter their own key in the builder. Stored in `sessionStorage` (cleared on tab close); the server never sees it. |

## Database setup

The app uses **Neon PostgreSQL** with **Drizzle ORM**. The schema is defined in [`lib/db/schema.ts`](lib/db/schema.ts).

1. Create a Neon project at [neon.tech](https://neon.tech) and copy the connection string into `DATABASE_URL`.
2. Run the migration:
   ```bash
   npx drizzle-kit migrate
   ```
3. Set up Google OAuth in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — add `https://yourdomain.com/api/auth/callback/google` as an authorized redirect URI.

Avatar uploads require a Cloudflare R2 bucket with CORS configured. Omit the `R2_*` vars to disable avatar uploads.

## Scripts

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build (also runs on pre-push)
npm run start        # serve production build
npm run lint         # ESLint (also runs on pre-push)
npx tsc --noEmit     # TypeScript type-check (also runs on pre-push)
npm run db:generate  # generate Drizzle migrations from schema changes
npm run db:migrate   # apply pending migrations to Neon
npm run db:studio    # open Drizzle Studio (DB browser)
```

### Git hooks

Husky is wired so commits stay fast and the full quality gate runs on push.

On every `git commit`:

1. No-op by design

On every `git push`:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`

Hooks auto-install on `npm install` via the `prepare` script. To
bypass in a genuine emergency use `git push --no-verify`, but this
should be rare and followed by a manual fix on the next commit.

## Project structure

```
app/                Next.js App Router pages
  builder/          The main resume builder
  account/          Tabbed user settings (post-login)
  blog/             Blog hub + dynamic company guides
  resume/[role]/    10 role-based SEO guides (software-engineer, PM, etc.)
  login/            Auth flow with Better Auth OAuth/email
  pricing/          4-tier pricing page
  global-error.tsx  Top-level error boundary, forwards to Sentry
  api/              API routes (auth, profile, cloud sync, usage, billing, etc.)
components/
  templates/        20 resume templates, lazy-loaded via next/dynamic
  forms/            Section forms with live validation + bullet scorer
  account/          Profile, JobSearch, Defaults, Links, Notifications, Security, Billing panels
  ats/              ATS score, keyword match, AI gap analysis
  ui/               shadcn/ui primitives
hooks/              Auth, cloud sync, toast
lib/                Export helpers (PDF/DOCX/HTML/MD/ATS), Zod schemas, bullet evaluator, auth, DB client
store/              Zustand store for resume data with undo history
types/              TypeScript types + TEMPLATES registry
docs/               Database schema reference, blog post template, other reference docs
drizzle/            Database migrations (generated by drizzle-kit)
instrumentation*.ts Sentry entry points (dormant until DSN is set)
.husky/             Git hooks (pre-commit no-op, pre-push runs lint + tsc + build)
```

## Architecture notes

- **Client-heavy by design.** The builder, account page, and share-link preview are all `"use client"`. Server-side auth is handled by Better Auth; all data access goes through Next.js API routes backed by Drizzle ORM.
- **Better Auth + Drizzle + Neon.** Authentication uses [Better Auth](https://www.better-auth.com/) with Google OAuth and email/password. Database is Neon PostgreSQL accessed via Drizzle ORM (`@neondatabase/serverless` neon-http driver). Avatar uploads go to Cloudflare R2.
- **Zustand persistence.** The resume store persists to `localStorage` with a custom serialiser that omits `history[]` and `historyIndex` to keep the persisted payload small.
- **Zod at every write boundary.** `/account` forms + cover-letter generation validate input with Zod before hitting the API; the client cannot smuggle extra columns through `lib/accountUpdate.ts`.
- **Next 16 + Turbopack specifics.** Some APIs differ from older Next versions — see `AGENTS.md`. `useSearchParams()` always wraps in `<Suspense>`, `NEXT_PUBLIC_*` reads must be literal `process.env.NEXT_PUBLIC_X` (not destructured) to be inlined.
- **React 19 strict purity.** No `Math.random()` / `Date.now()` in render, no `setState` inside `useEffect` bodies without a trigger. Use module-level constants or lazy initialisers.

## Deployment

Designed for Vercel. Any platform supporting Next.js 16 works. Set the `NEXT_PUBLIC_*` vars in your host's environment panel; Vercel auto-detects Next and needs no extra config.

The `resumebuildz.tech` production deployment uses Vercel + Neon PostgreSQL + Cloudflare R2. Build is ~45s on Vercel's default runners.

## Contributing

Issues and PRs welcome at [Surya8991/ResumeBuildz](https://github.com/Surya8991/ResumeBuildz/issues). For feature discussion, open an issue before a PR. All PRs need to pass `npm run lint` and `npm run build`.

## License

Source-available. See [LICENSE](LICENSE).
