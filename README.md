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
| AI | Groq (user-supplied key, client-side only) |

## Environment variables

Copy `.env.example` and fill in:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Session signing secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth |
| `NEXT_PUBLIC_SITE_URL` | No | Defaults to `https://resumebuildz.tech` |
| `R2_*` | No | Cloudflare R2 for avatar uploads |
| `STRIPE_*` | No | Billing |
| `RESEND_API_KEY` | No | Password reset + share invite emails |

Full list in [`.env.example`](.env.example).

## Database setup

1. Create a project at [neon.tech](https://neon.tech), copy the connection string into `DATABASE_URL`.
2. Run `npx drizzle-kit migrate`.
3. Add `https://yourdomain.com/api/auth/callback/google` as a redirect URI in Google Cloud Console.

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
app/            Pages + API routes (auth, profile, sync, usage, billing)
components/     Templates (20), forms, account panels, ATS tools, UI primitives
hooks/          Auth, cloud sync, toast
lib/            Auth config, DB client, export helpers, Zod schemas
store/          Zustand store with undo history
drizzle/        Generated DB migrations
```

## Contributing

Issues and PRs welcome at [Surya8991/ResumeBuildz](https://github.com/Surya8991/ResumeBuildz/issues). All PRs must pass `npm run lint` and `npm run build`.

## License

Source-available. See [LICENSE](LICENSE).
