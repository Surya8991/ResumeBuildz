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

Privacy-first: resume data lives in your browser by default. Supabase sync is opt-in for signed-in users. Groq API keys are stored client-side; the server never sees them.

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
- Google OAuth + email/password + TOTP 2FA
- Supabase cloud sync so resumes follow you across devices
- `/account` settings: avatar, headline, job-search prefs, builder defaults, notification prefs, connected accounts
- Profile values auto-fill into new resumes

### Standard industry stuff
- Full TypeScript, strict mode
- ESLint + React 19 purity rules enforced
- JSON-LD structured data across all marketing pages (Article, FAQ, Breadcrumb, HowTo)
- CSP, HSTS, X-Frame-Options, Referrer-Policy via Next middleware
- Row-Level Security on every Supabase table (`auth.uid() = id`)
- GDPR: export-my-data + delete-account via Supabase Edge Function

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
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Auth, cloud sync, `/account`. Omit for guest-only mode. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Same as above. |
| `NEXT_PUBLIC_SITE_URL` | Optional | OAuth redirect base. Defaults to the request host. |
| `GROQ_API_KEY` (per-user, client-side) | Optional | AI rewrites. Stored in `localStorage` under `groq-api-key`; the server never sees it. |

## Supabase setup

Run the SQL in [`docs/SUPABASE_ACCOUNT_SCHEMA.md`](docs/SUPABASE_ACCOUNT_SCHEMA.md) once in the Supabase SQL editor. It creates the profile columns, RLS policies, and the `avatars` storage bucket.

Then in the Supabase dashboard:
- **Authentication → Providers → Google** — enable + paste client ID/secret.
- **Authentication → Providers → MFA** — enable TOTP (for 2FA on `/account`).

For the optional Edge Functions (GDPR-compliant delete-account + server-side rate limiting), see [`supabase/README.md`](supabase/README.md).

## Scripts

```bash
npm run dev       # dev server (Turbopack)
npm run build     # production build (also runs on pre-push)
npm run start     # serve production build
npm run lint      # ESLint (also runs on pre-commit)
npx tsc --noEmit  # TypeScript type-check (also runs on pre-commit)
```

### Pre-commit + pre-push checks

Husky is wired so the mandatory pre-commit checklist cannot be
skipped. On every `git commit`:

1. `npm run lint`
2. `npx tsc --noEmit`

On every `git push`:

1. `npm run build`

Hooks auto-install on `npm install` via the `prepare` script. To
bypass in a genuine emergency use `git commit --no-verify`, but
this should be rare and followed by a manual fix on the next
commit.

## Project structure

```
app/                Next.js App Router pages
  builder/          The main resume builder
  account/          Tabbed user settings (post-login)
  blog/             Blog hub + dynamic company guides
  resume/[role]/    10 role-based SEO guides (software-engineer, PM, etc.)
  login/            Auth flow with Supabase OAuth/email
  pricing/          4-tier pricing page
  global-error.tsx  Top-level error boundary, forwards to Sentry
  api/              Edge routes (share links, etc.)
components/
  templates/        20 resume templates, lazy-loaded via next/dynamic
  forms/            Section forms with live validation + bullet scorer
  account/          Profile, JobSearch, Defaults, Links, Notifications, Security, Billing panels
  ats/              ATS score, keyword match, AI gap analysis
  ui/               shadcn/ui primitives
hooks/              Auth, cloud sync, toast
lib/                Export helpers (PDF/DOCX/HTML/MD/ATS), Zod schemas, bullet evaluator, Supabase client
store/              Zustand store for resume data with undo history
types/              TypeScript types + TEMPLATES registry
docs/               Supabase migration doc, blog post template, other reference docs
supabase/           Edge function source + deploy notes
instrumentation*.ts Sentry entry points (dormant until DSN is set)
.husky/             Pre-commit (lint + tsc) + pre-push (build) hooks
```

## Architecture notes

- **Client-heavy by design.** The builder, account page, and share-link preview are all `"use client"`. Supabase RLS does the heavy lifting server-side; no API routes sit between the client and Postgres except Edge Functions for destructive operations.
- **Guest-stub pattern.** `lib/supabase/client.ts` returns a no-op client when env vars are absent so the app never hard-crashes when running locally without Supabase credentials.
- **Zustand persistence.** The resume store persists to `localStorage` with a custom serialiser that omits `history[]` and `historyIndex` to keep the persisted payload small.
- **Zod at every write boundary.** `/account` forms + cover-letter generation validate input with Zod before hitting Supabase; the client cannot smuggle extra columns through `lib/accountUpdate.ts`.
- **Next 16 + Turbopack specifics.** Some APIs differ from older Next versions — see `AGENTS.md`. `useSearchParams()` always wraps in `<Suspense>`, `NEXT_PUBLIC_*` reads must be literal `process.env.NEXT_PUBLIC_X` (not destructured) to be inlined.
- **React 19 strict purity.** No `Math.random()` / `Date.now()` in render, no `setState` inside `useEffect` bodies without a trigger. Use module-level constants or lazy initialisers.

## Deployment

Designed for Vercel. Any platform supporting Next.js 16 works. Set the `NEXT_PUBLIC_*` vars in your host's environment panel; Vercel auto-detects Next and needs no extra config.

The `resumebuildz.tech` production deployment uses Vercel + the Supabase project configured in env. Build is ~45s on Vercel's default runners.

## Contributing

Issues and PRs welcome at [Surya8991/ResumeBuildz](https://github.com/Surya8991/ResumeBuildz/issues). For feature discussion, open an issue before a PR. All PRs need to pass `npm run lint` and `npm run build`.

## License

Source-available. See [LICENSE](LICENSE).
