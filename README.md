# ResumeBuildz

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Source--Available-orange)

ATS-friendly resume builder. 20 templates, live preview, AI writing help, multi-format export, optional Supabase auth. Free to start, no sign-up required.

Live site: [resumebuildz.tech](https://resumebuildz.tech)

---

## Quick start

Prerequisites: Node 20+ and npm.

```bash
git clone https://github.com/Surya8991/ResumeBuildz.git
cd ResumeBuildz
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open http://localhost:3000.

## Environment variables

All `NEXT_PUBLIC_*` values are inlined at build time. Restart the dev server after changes.

| Variable | Required | Used for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Auth + cloud sync + /account. Omit for guest-only mode. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Same as above. |
| `NEXT_PUBLIC_SITE_URL` | Optional | OAuth redirect base. Defaults to the request host. |
| `GROQ_API_KEY` (per-user) | Optional | AI rewrites. Stored client-side in `localStorage` under `groq-api-key`; the server never sees it. |

Without Supabase the app runs in guest-stub mode — resume data lives in `localStorage` only.

## Supabase setup

Run the SQL in [`docs/SUPABASE_ACCOUNT_SCHEMA.md`](docs/SUPABASE_ACCOUNT_SCHEMA.md) once in the Supabase SQL editor. It creates the profile columns, RLS policies, and the `avatars` storage bucket.

Then in the Supabase dashboard:
- **Authentication → Providers → Google** — enable + paste client ID/secret.
- **Authentication → Providers → MFA** — enable TOTP (for 2FA on `/account`).

## Scripts

```bash
npm run dev       # dev server (Turbopack)
npm run build     # production build
npm run start     # serve production build
npm run lint      # ESLint
```

## Project structure

```
app/                Next.js App Router pages (builder, account, login, blog, pricing, etc.)
components/         React components (UI, forms, templates, auth, account panels)
  templates/        20 resume templates, lazy-loaded via next/dynamic
  account/          /account tabs (Profile, Job Search, Defaults, Links, Notifications, Security, Billing)
  ats/              ATS score + keyword analysis
hooks/              Auth, cloud sync, etc.
lib/                Export helpers (PDF/DOCX/HTML/MD), Zod schemas, Supabase client
store/              Zustand store for resume data
types/              TypeScript types + TEMPLATES registry
docs/               Supabase migration, blog template, other docs
```

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19 with strict purity rules
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Zustand (client state)
- Supabase (auth + Postgres + Storage)
- Groq API (AI rewrites, user-supplied key)
- lucide-react, dnd-kit, react-to-print, docx, file-saver

## Deployment

Designed for Vercel. Any platform supporting Next.js 16 works. Set the `NEXT_PUBLIC_*` vars in your host's environment panel; Vercel auto-detects Next and needs no extra config.

## Contributing

Issues and PRs welcome at [Surya8991/ResumeBuildz](https://github.com/Surya8991/ResumeBuildz/issues). For feature discussion, open an issue before a PR.

## License

Source-available. See [LICENSE](LICENSE).
