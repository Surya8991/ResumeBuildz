# Changelog

All notable changes to ResumeBuildz are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.33.0] - 2026-06-01

### Added

- **Admin role system.** Two-tier internal admin (`admin` < `superadmin`) stored in `profiles.role`. Admins are scoped to users they manage (`profiles.managed_by`); superadmins act on all users. Access at `/admin` — server-side role gate with no public exposure of the superadmin tier.
- **Admin dashboard** at `/admin/users` — paginated, debounce-searched user table with role/plan badges. User detail page (`/admin/users/[userId]`) supports plan override via dropdown (any role ≥ admin) and role change via dropdown (superadmin only).
- **Admin API routes** — `GET /api/admin/users`, `GET/PATCH /api/admin/users/[userId]`. All require admin session; superadmin-only fields (role, managedBy) enforce rank in the PATCH handler.
- **User impersonation** — `POST /api/admin/impersonate` sets two signed cookies (`x-impersonate` + `x-imp-email`). Amber sticky banner visible on every page while active; `DELETE /api/admin/impersonate` clears cookies and returns admin to `/admin/users`. Admins cannot impersonate other admins/superadmins. **Export My Data is hidden during impersonation** so no user data can be extracted.
- **`lib/adminAuth.ts`** — `requireAdminSession(minRole)` shared guard with rank-based access control.
- **`lib/impersonation.ts`** — HMAC-SHA256 (using `BETTER_AUTH_SECRET`) signed httpOnly cookie, 2-hour expiry, base64url payload.
- **`proxy.ts`** — fast session-cookie gate for `/admin/*` (Next.js 16 `proxy` convention, replaces deprecated `middleware.ts`).
- **Admin email notifications** — `rolePromotedEmail` sent on promotion to admin; `planChangedEmail` sent on any admin-triggered plan change. Both are best-effort and never block the response.
- **Superadmin bootstrap** via `SUPERADMIN_EMAIL` env var. Set it to auto-promote on first signup; use the SQL escape hatch for existing accounts. Documented in `.env.example` and `README.md`.
- **Unlimited quota** for admin/superadmin — AI rewrites and PDF exports bypass daily counters server-side (`/api/usage` GET + POST).
- **Navbar role badge** — indigo `ADMIN` chip visible in the profile dropdown for admin/superadmin accounts; avatar ring changes to indigo. "Admin dashboard" link added below Account settings.
- **Pricing FAQ entry** — "Do you offer admin accounts for organizations?" clarifies managed admin access without exposing internal role hierarchy.

### Changed

- `hooks/useAuth.ts` — `role` added to `Profile` type; `isPro()` returns `true` for admin/superadmin regardless of billing plan.
- `app/api/profile/route.ts` — `role` field added to GET response.
- DB migration `0003` — adds `role text NOT NULL DEFAULT 'user'` and `managed_by text` columns + `profiles_managed_by_idx` index.

---

## [1.32.0] - 2026-05-29

### Added

- **Real rate limiting via Upstash Redis.** When `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set, every public write endpoint (share invite, waitlist, contact, checkout) now gets a *real* per-IP/per-route limit shared across every Lambda instance and region. Without those env vars the limiter degrades to the existing per-process in-memory burst guard — fine for local dev and self-hosted single-node deploys; trivial to bypass on Vercel where each Lambda instance has its own counter. Atomic via Redis `INCR` + first-write `EXPIRE`; falls through to in-memory on Upstash request failure so a Redis blip doesn't lock everyone out.
- **`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`** env vars (optional). Get them from `console.upstash.com → Create Database → REST API tab`. Documented in `.env.example`.
- **`@upstash/redis`** added as a dependency.

### Changed

- `rateLimit()` is now async (returns `Promise<RateLimitResult>`). All four callers (`/api/share/invite`, `/api/leads/waitlist`, `/api/leads/contact`, `/api/checkout`) updated to `await` it.

---

## [1.31.0] - 2026-05-29

### Added

- **R2 cleanup on account delete + avatar re-upload.** Avatars are now removed from Cloudflare R2 when the user deletes their account (`deletePrefixFromR2('avatars/${userId}/')` before `auth.api.deleteUser`) and when they upload a replacement (`deleteFromR2(oldKey)` before writing the new key). Closes the GDPR "right to be forgotten" gap and stops the storage drift where every re-upload doubled the user's R2 footprint.
- **Stripe webhook idempotency table.** New `webhook_events` table (`event_id` primary key, `event_type`, `processed_at`). The handler now does `INSERT ... ON CONFLICT DO NOTHING` on `event.id` before mutating state — a replay short-circuits to a `{ received: true, replay: true }` ack. Defends against the next non-idempotent handler we add.
- **Database indexes for cron query paths.** Added btree indexes on `profiles.last_seen_at`, `profiles.inactive_warned_at`, `profiles.notify_product`, `profiles.stripe_customer_id`, and `user.created_at` — every column the daily crons or the Stripe webhook filter on. Migration `0002_supreme_leper_queen.sql`.
- **`deleteFromR2()` + `deletePrefixFromR2()` helpers** in `lib/storage.ts`. Both no-op when R2 isn't configured and swallow errors so a storage failure can't break the calling request.

### Removed

- **Dead `proxy.ts` at repo root.** Named/exported incorrectly so Next.js never picked it up — nothing in this file was running. Grep confirmed no references in the source. Deleted.
- **Stale planning HTML in the repo root** (~225 KB): `BLOG_PLAN_V3.html`, `MARKETING_STRATEGY.html`, `TODO.html`, `TodoWeek.html`, `code-review-report.html`. None were referenced anywhere. `RESEND_SETUP.html` kept (still has real DNS-walkthrough content not duplicated elsewhere).

### Changed

- **Landing page `app/page.tsx`** no longer mutates `document.title` and meta tags from `useEffect` — those overrides were a no-op for crawlers (HTML is already shipped by then) and a redundant overwrite of the root-layout metadata. Dropped.
- **`app/account/page.tsx`** drops its `document.title` `useEffect` — `app/account/layout.tsx` already exports the correct `metadata`. Pure cleanup.
- **`lib/rateLimit.ts`** docstring rewritten to be honest about its serverless limitations. The implementation hasn't changed, but the comment now correctly calls it a *best-effort burst guard* rather than a real rate limiter (the in-memory `Map` is per Lambda instance — warm-instance scale-out and concurrent invocations bypass the cap). Calls out Upstash/Redis/Vercel KV as the migration target.
- **`VersionHistoryDialog.tsx`** — silenced the pre-existing `react-hooks/incompatible-library` warning with an inline `eslint-disable-next-line` (the `"use no memo"` directive at the top of the component already handles the runtime side; the lint rule just doesn't read it). Build now ships with zero warnings.

---

## [1.30.0] - 2026-05-29

### Added

- **ATS-risk badges in the template picker.** Each template card now carries a small `✓ ATS` / `△ ATS` / `✗ ATS` pill (with a tooltip explaining the trade-off) so users picking by aesthetics know upfront whether the layout is single-column safe, has decorative elements some parsers mis-read, or is a multi-column layout the ATS may reorder or drop. `Sidebar` / `Modern` / `Tech` are flagged risky; `Gradient` / `Timeline` / `Infographic` flagged caution.
- **Empty-state CTA cards** for Education / Projects / Skills forms (matching the existing Experience pattern) — first-run users now see a clear "Add Your First X" button instead of a one-line tip.
- **Private-mode / quota offline banner.** When `localStorage` writes fail (private window, full disk, browser block) a persistent amber banner appears: "Edits aren't being saved. Open in a normal window to save." Replaces the previously silent failure where the autosave chip still claimed "Saved".
- **Confirm-before-import dialog.** Paste / file / LinkedIn imports now summarize what's about to land ("Import 4 experience, 2 education, 18 skills?") and remind the user that Ctrl+Z reverts. Prior rollback path is unchanged.
- **Share-link expiry.** Share dialog picks Never / 24h / 7d / 30d. Expiry timestamp encoded into the URL fragment alongside the resume data; viewer shows an "expired" page past that date. Zero-trust model preserved — no server check.
- **Cover letter as PDF cover page.** New checkbox in the Export → PDF menu (only enabled when a cover letter exists) prepends a styled cover-letter page to the printed PDF with `page-break-after: always`. Hidden on screen so it doesn't clutter the live preview.
- **JSON Resume schema import/export.** New `lib/jsonResume.ts` maps between our shape and `jsonresume.org/schema`. Export menu gets "JSON Resume .json"; file import auto-detects whether a `.json` upload is our internal shape or JSON Resume and parses accordingly. Awards round-trip via custom sections.
- **Schema-version migration scaffold.** Zustand persist now stamps `version: 1` on the stored payload with a `migrate` hook ready to absorb future schema changes without breaking existing localStorage data.
- **Corrupt version-history warning.** When `versionHistory.read()` hits unparseable JSON, the bad payload is dropped and a one-time toast surfaces: "Version history was unreadable and has been reset." (Previously silent.)

### Changed

- **ATS scoring is now per-entry, not all-or-nothing.** Adding one experience entry without a date no longer drops the whole Work Experience section from 25 → 15. Each entry contributes proportionally; partials get half credit.
- **Quantified-results detection broadened** from `\d+%|\$\d+|\d+\+` to also catch `$50K`, `$1.2M`, `25x`, `3.5×`, `2nd / 3rd / 4th`, `3M users` — the metric formats real resumes actually use.
- **Tech-keyword allowlist for KeywordAutoInsert.** A small allowlist of real tech acronyms (API, SQL, AWS, CI/CD, …) replaces the generic "ALL-CAPS 2-10 chars" heuristic, so non-tech all-caps words like NBA / CEO / USA no longer get classified as skills.
- **Non-color glyph on ATS score rings** (`✓ / △ / ✗`) plus `role="meter"` + `aria-label` so colorblind and screen-reader users get the same signal as the colored rings.
- **Page-break preview guide hidden in print.** The dashed page-break indicators in the live preview were inheriting `visibility: visible` from the print whitelist; now explicitly suppressed in `@media print`.
- **Hardened print CSS** — added `li { page-break-inside: avoid }` so bullets don't split across pages, and `p { orphans: 2; widows: 2 }` for paragraph breaks.
- **Import robustness** — AI-fallback parser now normalizes any non-array section (including explicit `null`) to `[]` so a malformed AI response can't crash the import. PDF column detection retains its existing "no confident gap → single-column" fallback.
- **`44 × 44` touch targets on preview zoom buttons** + proper `aria-label`s.
- **`aria-live` on async AI regions** (AISuggestions, JDTailor, ATSScoreChecker AI Gap) so screen-reader users get notified when generation completes or errors.
- **`AbortController` on streaming AI calls** (JDTailor, CoverLetterForm) — navigating away mid-stream now cancels the request instead of burning Groq quota on output the user will never see.

### Fixed

- **Groq API key was being sent quoted.** `useSessionStorage` from `usehooks-ts` JSON-stringifies its value (so `gsk_abc...` was stored as `"gsk_abc..."`), and `getGroqApiKey()` read the raw string — every Groq call sent `Authorization: Bearer "gsk_..."` and got back 401. AI features looked broken even with a valid key. `getGroqApiKey()` now unwraps the JSON-quoted form when present.
- **`/api/share/invite`** refactored to use `sendEmail()` from `lib/email.ts` instead of a duplicate `fetch` + locally-redefined `escapeHtml` — picks up the shared error logging, no behavior change for users.

---

## [1.29.0] - 2026-05-24

### Added

- **Inactive-account cleanup.** Daily cron `/api/cron/inactive-cleanup` warns accounts inactive for 6 months (email: "deleted in 14 days unless you log in"), then deletes them + their data if still inactive after the grace period. Returning users are spared — `/api/profile` bumps `last_seen_at` and clears the warning on any authenticated load. New `profiles.last_seen_at` + `inactive_warned_at` columns (migration `0001_volatile_war_machine.sql`, with backfill so existing users start fresh).
- **Token hygiene.** The same cron purges expired `session` + `verification` rows (no email — spent tokens) to keep the DB lean.
- New email templates `inactiveWarningEmail` + `inactiveDeletedEmail`; the warning timestamp is only stamped once the email actually sends, so no one is deleted unwarned.

---

## [1.28.0] - 2026-05-24

### Changed

- **Disabled server-side resume storage**, to match the privacy promise that resumes never leave the browser. Deleted `/api/cloud-sync`, `hooks/useCloudSync.ts`, and the builder sync indicator. The `resumes` table is **kept** in the schema but is now **dormant** — nothing reads or writes it — so it can be re-enabled later without a migration. In practice Neon stores only login details (Better Auth `user`/`session`/`account`/`verification`) and profile data (`profiles`), plus `waitlist` and `contact_messages`.

### Changed

- **Resume-reminder cron** reframed to a gentle new-user nudge (signup age + opt-out consent) since resume state is no longer visible server-side; email copy updated accordingly.

---

## [1.27.0] - 2026-05-24

### Added

- **Password-changed alert on authenticated change.** Better Auth `hooks.after` on `/change-password` sends the security alert when a logged-in user changes their password (previously only the forgot-password reset flow notified).
- **`lib/apiAuth.ts` `requireCronAuth()`** — constant-time (`timingSafeEqual`) bearer check shared by `/api/admin/broadcast` and both cron routes, replacing per-route string comparison.

### Changed

- **Two-step unsubscribe.** `GET /api/email/unsubscribe` now renders a confirmation page (no mutation) so email link-prefetchers/security scanners can't silently unsubscribe users; `POST` performs the opt-out. Marketing email sends `List-Unsubscribe` + `List-Unsubscribe-Post` (RFC 8058 one-click) headers.
- **Reminder consent is opt-out.** Resume-reminder cron sends unless `notify_product` is explicitly `false` (so lifecycle nudges reach new users); bulk broadcasts remain strict opt-in. All carry an unsubscribe link.
- **Welcome email de-duplicated.** Credential signups are welcomed after email verification (`afterEmailVerification`); social signups (pre-verified) at creation — no more welcome + verification double-send.
- Bulk send routes set `maxDuration = 60`; unsubscribe page escapes all interpolated text.

### Security

- **Lead APIs no longer leak raw DB errors.** `/api/leads/contact` + `/api/leads/waitlist` return a generic message and log details server-side.

---

## [1.26.0] - 2026-05-23

### Added

- **Shared email module.** `lib/emails/layout.ts` (one branded, responsive HTML wrapper) + `lib/emails/templates.ts` (pure `{ subject, html }` builders) for welcome, email verification, password reset, password-changed alert, email-change confirmation, account-deleted, contact-notify, product-update, and resume-reminder. All routed through `lib/email.ts` `sendEmail()` (no-ops without `RESEND_API_KEY`, never throws).
- **Email verification on signup** via Better Auth `emailVerification.sendVerificationEmail` (`sendOnSignUp`, `autoSignInAfterVerification`). Non-blocking — not required to sign in; social signups arrive pre-verified.
- **Account lifecycle emails.** Password-changed security alert (`onPasswordReset`), change-email confirmation to the current address (`user.changeEmail`), and account-deleted confirmation (`user.deleteUser.afterDelete`). Enabling `deleteUser` also repairs `auth.api.deleteUser` used by `/api/account/delete`.
- **Product-update broadcasts.** `POST /api/admin/broadcast` (CRON_SECRET-gated) emails users with `profiles.notify_product = true`, batched, each with a one-click unsubscribe link. Supports `dryRun`.
- **Engagement nudge.** `GET /api/cron/resume-reminders` (daily Vercel Cron) emails users who signed up 2–3 days ago with no saved resume, respecting product-update consent. The signup-age window reminds each user at most once with no schema change.
- **Stateless unsubscribe.** `lib/emailTokens.ts` HMAC tokens + `GET /api/email/unsubscribe` flips `notify_product` off with no stored token. New env vars `CRON_SECRET`, `WELCOME_FROM` documented in `.env.example`.

### Changed

- **AGENTS.md** expanded into a full project guide: stack, the mandatory lint + tsc + build gate, env/deploy gotchas (pooled Neon URL, build-time `NEXT_PUBLIC_*`), and conventions for email graceful-degradation, lazy db/auth proxies, API hardening, and cron/admin auth.

---

## [1.25.0] - 2026-05-23

### Added

- **Welcome email re-wired for Better Auth.** The old Supabase `send-welcome` Edge Function was removed in the migration, leaving new signups with no welcome mail. It now sends via a Better Auth `databaseHooks.user.create.after` Resend call — best-effort and non-blocking, so a slow or failed send can never break signup.
- **Contact-form operator notifications.** `/api/leads/contact` now emails `CONTACT_NOTIFY_TO` with each submission (Reply-To set to the sender) instead of silently storing it in `contact_messages`. Skips cleanly when unset.
- **`lib/email.ts`** shared Resend wrapper: a single `sendEmail()` that no-ops without `RESEND_API_KEY` and never throws, plus `escapeHtml`. Welcome, password-reset, and contact-notify paths all route through it.
- New env vars documented in `.env.example`: `WELCOME_FROM` (optional from-address override) and `CONTACT_NOTIFY_TO`.

### Changed

- **Production Google OAuth fixed.** Switched `DATABASE_URL` to the Neon pooled (`-pooler`) connection string, resolving `fetch failed` on the `verification` insert during the OAuth callback under serverless concurrency. `README.md` and `.env.example` now document the pooled-string requirement and that `NEXT_PUBLIC_SITE_URL` is baked in at build time.

### Security

- **Lead API hardening.** `/api/leads/contact` and `/api/leads/waitlist` now enforce server-side length caps, email-format validation, safe JSON parsing, and per-IP rate limiting (contact 5/hr, waitlist 10/hr). The API no longer trusts client-side trimming alone.

---

## [1.24.0] - 2026-05-23

### Changed

- **Full Supabase removal.** Replaced the entire Supabase stack with open-source, self-hosted alternatives:
  - **Auth:** Supabase Auth (GoTrue) → [Better Auth](https://www.better-auth.com/) with Google OAuth + email/password.
  - **Database:** Supabase Postgres → Neon PostgreSQL + Drizzle ORM (`@neondatabase/serverless` neon-http driver).
  - **Storage:** Supabase Storage → Cloudflare R2 via `@aws-sdk/client-s3`.
  - **Edge Functions:** Supabase Deno runtime → Next.js API Route Handlers (`/api/usage`, `/api/account/delete`, `/api/cloud-sync`, `/api/profile`, `/api/upload/avatar`).
- **New Drizzle schema** (`lib/db/schema.ts`) with 8 tables: `user`, `session`, `account`, `verification` (Better Auth core), `profiles`, `resumes`, `waitlist`, `contact_messages`.
- **Profile auto-creation** via Better Auth `databaseHooks.user.create.after` — new users get a `profiles` row on first sign-up.
- **Password reset** via Resend email integration in Better Auth's `sendResetPassword` hook.
- **CSP updated** — removed `*.supabase.co` from `connect-src`.
- **Privacy Policy, Terms, Status page** — all references to Supabase removed.
- **ESLint config** — added `varsIgnorePattern: "^_"` for destructured omit patterns.

### Removed

- `@supabase/ssr` and `@supabase/supabase-js` dependencies.
- All `NEXT_PUBLIC_SUPABASE_*` and `SUPABASE_SERVICE_ROLE_KEY` environment variables.
- `lib/supabase/client.ts`, `server.ts`, `admin.ts` replaced with error-throwing stubs (to be deleted).

### Added

- `better-auth`, `drizzle-orm`, `@neondatabase/serverless`, `@aws-sdk/client-s3`, `drizzle-kit` dependencies.
- `npm run db:generate`, `db:migrate`, `db:studio` scripts.
- Backup branch `backup/supabase-original` preserving the pre-migration codebase.

---

## [1.23.1] - 2026-05-06

### Security

- **Checkout privilege escalation fixed**: `app/api/checkout/route.ts` now extracts `userId` from the server-side Supabase session cookie instead of trusting the request body. Prevents any authenticated user from upgrading an arbitrary account.
- **Groq API key moved to `sessionStorage`**: keys are now scoped to the current tab and cleared automatically when it closes, reducing the exposure window vs. `localStorage`. All reads centralised through `getGroqApiKey()` in `lib/groqAI.ts`.
- **Share invite endpoint gated behind auth**: `app/api/share/invite/route.ts` now returns 401 for unauthenticated requests — previously an open endpoint could be used to send email from the domain.
- **Stripe webhook casts hardened**: replaced `as StripeX` with `as unknown as StripeX` throughout `app/api/stripe/webhook/route.ts`; the intermediate `unknown` step is now required by TypeScript's strict overlap check.

### Fixed

- **Auth race condition**: `hooks/useAuth.ts` — `fetchProfile` is now `await`-ed before `setLoading(false)`. Previously the loading state cleared before the profile was available, causing brief "no plan" flashes.
- **Supabase guest stub fragility**: replaced the hard-coded method stub in `lib/supabase/client.ts` and `lib/supabase/server.ts` with a recursive `Proxy`. Any query chain (`.select().eq().single()`, etc.) now resolves safely without needing every method enumerated.
- **`useMemo(() => createClient(), [])` removed**: `createClient()` is already a module singleton — the wrapper added unnecessary closure overhead with no benefit.
- **`importData` undo gap**: `store/useResumeStore.ts` — importing a JSON resume now snapshots the previous state into history so the user can undo an accidental import.
- **`UNLIMITED = 9999`**: `lib/usage.ts` replaced `Infinity` — `JSON.stringify(Infinity)` serialises to `null`, which would have broken any response that included the remaining count.
- **Server-only env guard**: `lib/env.ts` — `serverEnv` getters now call `assertServerSide()` which throws an explicit error if accessed from a Client Component, instead of silently returning `undefined`.
- **Import hoisting**: `store/useResumeStore.ts` — all `import` statements moved above module-level side effects (`addEventListener` calls) to satisfy the ES module spec.

### Changed

- **`AISuggestions.tsx`** switched from `useLocalStorage` to `useSessionStorage` for the Groq key; security notice updated to explain the tab-close behaviour.
- **`components/forms/CoverLetterForm.tsx`**, **`components/JDTailor.tsx`**, **`lib/importResume.ts`** — updated to use `getGroqApiKey()` instead of direct `localStorage.getItem` calls.

### Docs

- **`SECURITY.md`** — complete rewrite to reflect the current hybrid architecture (Supabase, Stripe, Edge Functions, sessionStorage API keys). The previous version described a purely client-side app with no auth or backend.
- **`CONTRIBUTING.md`** — fixed stale `lib/store.ts` path reference → `store/useResumeStore.ts`.
- **`.env.example`** — added missing server-side variables: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `SHARE_INVITE_FROM`.
- **`README.md`** — clarified Groq API key storage (sessionStorage, cleared on tab close).

### Internal

- Added targeted WHY-focused comments across 20 files covering: SSE buffer/parse loop, Flesch-Kincaid syllable algorithm, ATS scoring weights, bigram keyword extraction, `"use no memo"` pragma, `pagehide` mobile bfcache behaviour, Server Component cookie write error, env accessor semantics, and more.

---

## [1.23.0] - 2026-05-05

### Added

- **sonner** — replaced custom `Toast.tsx` with sonner. All existing `useToast` / `showToast` call sites unchanged; the adapter maps `success/warning/info/pro` types to sonner's built-in variants. `<Toaster position="top-right" richColors closeButton />` added to `Providers.tsx`.
- **react-hook-form + @hookform/resolvers** — added date-range validation to all four form components (`ExperienceForm`, `EducationForm`, `CertificationsForm`, `ProjectsForm`). End-date fields show inline red error messages when start > end.
- **date-fns** — rewrote `lib/dateUtils.ts` with `parse`/`format`/`isBefore`/`differenceInMonths` from date-fns. Same `toMonthInput`/`fromMonthInput` API; added new exports `formatDuration` and `isValidDateRange`.
- **usehooks-ts** — replaced manual `localStorage.getItem/setItem` calls in `AISuggestions.tsx` (groq-api-key) and `MultiJDMatching.tsx` (saved JDs) with typed `useLocalStorage` hook.
- **next-safe-action** — created `lib/safe-action.ts` with `action` and `actionWithAuth` clients. `actionWithAuth` middleware verifies Supabase session server-side. First server action: `lib/actions/profileActions.ts` (`updateProfileAction`) — Zod-validated, auth-gated profile update.
- **@tanstack/react-virtual** — applied `useVirtualizer` to the version history list in `VersionHistoryDialog.tsx`. Renders only visible rows regardless of how many saved snapshots exist.
- **framer-motion** — added spring-bounce animation to template selection in `TemplateSelector.tsx`. Selected card scales `1→1.03→1`; checkmark badge animates in/out with `AnimatePresence`.

---

## [1.22.5] - 2026-05-05

### Fixed

- **PageLoader grace period raised to 300 ms**: fast blog-to-blog navigations
  (static pages served from CDN in ~100–250 ms) no longer trigger the loading
  overlay. `SHOW_DELAY_MS` bumped from 150 → 300 in `components/PageLoader.tsx`.
- **Cover Letter moved into Blog dropdown**: removed Cover Letter from the
  top-level nav bar. Blog is now a dropdown containing All Posts (`/blog`),
  Cover Letter (`/cover-letter`), and Company Guides (`/blog/company-guides`).
  Mobile menu shows the same three links under a "Blog" section header.
- **Blog dropdown accessibility**: added `aria-expanded`, `aria-haspopup`, and
  `aria-label="Blog menu"` to the Blog trigger button in `SiteNavbar.tsx`.

---

## [1.22.4] - 2026-05-05

### Changed

- **ESLint zero-warning baseline**: removed 20 stale
  `eslint-disable react/no-unescaped-entities` directives from blog
  `Content.tsx` files (rule violations were already fixed; directives
  became no-ops). Removed unused `path` import from
  `scripts/_mergeStaging.mjs` and dead `nameInput` variable from
  `tests/e2e/builder.spec.ts`. Pre-push hook now exits clean with 0
  warnings.

---

## [1.22.3] - 2026-05-05

### Fixed

- **Builder double-loading screen removed**: replaced the full-screen
  Sparkles hydration splash in `builder/Content.tsx` with a `null` return
  while `mounted` is `false`. The `PageLoader` already covers the
  navigation transition, so the second blocking screen was redundant and
  annoying.
- **PageLoader hard-cut on dismiss fixed**: the page-transition overlay
  previously vanished instantly when navigation completed. It now fades
  out over 200 ms via a `leaving` state + CSS `transition-opacity`. A ref
  guard prevents a phantom fade-out when the loader never rendered (grace
  period not elapsed).

### Fixed (SEO / Crawlability)

- **`/author/surya-l` added to sitemap**: the author page existed with
  full metadata and Person schema but was absent from `app/sitemap.ts`,
  making it undiscoverable by Google without an inbound link.
- **`og:locale` corrected to `en_US`**: root layout was declaring
  `en_IN`, signalling Indian-English to social crawlers (Facebook,
  LinkedIn) despite the product targeting US/global job seekers.

---

## [1.22.2] - 2026-05-05

### Fixed

- **Stripe billing now functional**: implemented all three webhook
  handlers (`checkout.session.completed`, `subscription.updated/deleted`,
  `invoice.payment_failed`) so `profiles.plan` is correctly set to `pro`
  after payment. Added `lib/supabase/admin.ts` service-role client used
  exclusively in the webhook after signature verification.
- **Bullet evaluator proper noun false positive**: sentence-start
  capitalised words (e.g. "Led", "Managed") were incorrectly counted as
  proper nouns, inflating specificity scores. Fixed filter to exclude the
  first word when it begins the sentence.
- **Template photo error handling**: all 20 resume templates now use
  `safePhotoSrc()` and an `onError` handler that hides the `<img>` on
  broken or malformed data URLs rather than rendering a broken image icon.

### Changed

- **Server-side AI usage counter**: `AISuggestions` and `BulletScoreList`
  now gate and increment via the `increment-usage` Edge Function instead
  of localStorage alone. `refreshProfile` is called after each successful
  use so the quota display updates immediately.
- **Server-side PDF export counter**: `builder/Content.tsx` increments
  PDF usage via the Edge Function after each export. `handlePrint()` is
  kept synchronous before any `await` to preserve the browser gesture
  context required for `window.print()`.
- **`structuredClone()` in Zustand store**: replaced all five
  `JSON.parse(JSON.stringify(...))` deep clones with the native
  `structuredClone()` (~2× faster).
- **`deleteAccount` partial-deletion feedback**: navbar now shows a
  distinct message when the Edge Function was unavailable and only the
  `profiles` row was deleted, directing the user to contact support for
  full `auth.users` removal.

### Docs

- `docs/SUPABASE_ACCOUNT_SCHEMA.md` updated with `stripe_customer_id`
  column + unique index, and daily usage counter columns.
- `supabase/README.md` client-side wiring updated to reflect current
  `checkServerUsage` / `incrementServerUsage` API.
- `tests/e2e/README.md` updated to document the new builder test suite.

### Tests

- Added `tests/e2e/builder.spec.ts`: Playwright golden-path suite covering
  SSR H1, no JS errors, personal info section, name input, live preview
  update, experience section, bullet scorer, export buttons, template
  switcher, and ATS tab smoke test.

---

## [1.22.1] - 2026-05-05

### Changed

- **Crawl/indexing hardening**:
  - `/blog` filter chips and pagination now render as real links,
    not JS-only buttons, so Google can follow archive and category
    states without requiring client interaction.
  - `app/sitemap.ts` no longer emits duplicate blog filter query
    URLs, and stable `lastModified` dates replace the old
    request-time churn on static marketing entries.
  - `/login`, `/forgot-password`, and `/account` now ship
    server-rendered `robots: { index: false, follow: false }`
    metadata in the initial HTML.
  - `app/robots.ts` now explicitly disallows `/auth` callback
    paths and advertises the site host alongside the sitemap.
  - `app/not-found.tsx` now searches only published posts, so
    scheduled slugs never leak through the 404 helper.

- **Structured-data cleanup**:
  - `faqPageSchema()` now trims whitespace and drops empty FAQ
    pairs before emitting JSON-LD, preventing Google Search
    Console "Unnamed item" rich-result errors from stale or blank
    FAQ content.
  - `HowTo` steps and breadcrumb labels now receive the same
    normalization so empty names cannot leak into schema output.

### Docs

- **README updated** to match the current repo behavior:
  - `NEXT_PUBLIC_SITE_URL` docs now reflect the
    `https://resumebuildz.tech` fallback.
  - Husky docs now reflect the real hook flow: pre-commit is a
    no-op, while pre-push runs lint, `tsc --noEmit`, and build.
- **Changelog sources synced** so `CHANGELOG.md` and
  `lib/changelogData.ts` both include the crawl/indexing and
  schema-hardening release notes.

## [1.22.0] - 2026-04-19

### Added

- **`lib/blogSeo.ts`** central SEO registry holding per-post title
  (<=60 chars), 150-160 char description, category, slug, FAQs. One
  source of truth for 19 blog posts.
- **`/author/surya-l`** bio page with `Person` JSON-LD schema
  (`sameAs` GitHub + LinkedIn). `DEFAULT_AUTHOR` in `articleSchema.ts`
  now points at this page, lifting E-E-A-T across every Article
  schema in one edit.
- **`lib/lazyStripe.ts`** DRY helper for the lazy-loaded Stripe SDK.
  Replaces 16 lines of duplicated bundler-dodge code across
  `/api/checkout` and `/api/stripe/webhook`. Typed, documented,
  one place to swap when Stripe becomes a permanent dep.
- **`BLOG_PLAN_V2.html`** reference doc at repo root: 50 queued
  blog topics organised into 6 clusters with per-post SEO fields
  (primary keyword, volume, KD, secondary, intent, outline, unique
  angle, target audience, internal links). Priority-ordered:
  13 red, 23 amber, 14 green. Total search volume ~740k/month.

### Changed

- **SEO migration**: all 29 public pages now serve correct server-
  side metadata to Googlebot. Pre-migration, every `'use client'`
  page served the root layout title ("ResumeBuildz by Surya L...")
  because `document.title = ...` in useEffect runs only after the
  initial crawl. Fixed by splitting each page into:
  - `page.tsx`: server component exporting `metadata` + JSON-LD
  - `Content.tsx`: existing `'use client'` component, unchanged
    except for stripped useEffect metadata block

  Covers 19 blog posts + 10 non-blog pages (builder, pricing,
  templates, about, faq, contact, blog hub, company-guides hub,
  changelog, privacy).

  Each page type gets appropriate JSON-LD:
  - Blog posts: Article + FAQPage + BreadcrumbList
  - `/builder`: SoftwareApplication with featureList
  - `/pricing`: Product with 4 Offer entries
  - `/templates`, `/blog`, `/blog/company-guides`: CollectionPage
  - `/about`: Organization
  - `/contact`: ContactPage
  - `/faq`: FAQPage (auto-generated from full 26-item array)

- **BlogPostLayout mobile fix**: collapsible mobile TOC at top of
  every post (was `display: none` below `lg`, users lost nav).
  Responsive H1 `text-2xl sm:text-3xl md:text-4xl`, responsive
  padding, centred article column on mobile, `min-w-0` overflow
  guard, Prev/Next stacks on narrow phones.

- **Husky reconfig**: pre-commit is now a no-op; all checks
  (lint + tsc + build) consolidated in pre-push. Fast commits,
  single gate at push time.

- **`robots.ts`** already covered `/account` and auth pages;
  confirmed no updates needed.

### Security

- **Contact form hardening** (`app/contact/Content.tsx` +
  `lib/leads.ts`):
  - `maxLength` caps: name 100, email 254, subject 100, message
    5000 chars
  - Hidden honeypot `<input>` field — bots filling every input
    auto-populate it; submissions with non-empty honeypot
    silently succeed so the bot moves on
  - Client-side sessionStorage rate limit: 3 submits per 5 min
  - Server-side `slice()` caps in `submitContactMessage` (defence
    in depth over the client caps)
  - Email regex validation + 10-char minimum message
- **XSS defence in depth**:
  - Homepage FAQ JSON-LD swapped from raw `JSON.stringify` to
    `jsonLd()` helper (escapes `<` to `\u003c` so a `</script>`
    in content can never break out)
  - `sanitizeCSS` in `ResumePreview.tsx` extended to strip
    `@import`, `@charset`, `data:text/html` URLs, quoted
    `javascript:` / `vbscript:` variants, `-moz-binding`,
    legacy IE `behavior:`
- **Supabase RLS verified**:
  - `contact_messages`: RLS enabled, single INSERT policy for
    public role, no SELECT/UPDATE/DELETE (default-deny protects
    reads)
  - `profiles`: RLS enabled, SELECT/INSERT/UPDATE policies each
    gated on `auth.uid() = id`, no DELETE policy (only
    `delete-user` Edge Function deletes via service role)

### Infrastructure

- **All 3 Supabase Edge Functions deployed and ACTIVE**:
  `delete-user`, `increment-usage`, `send-welcome`. Previously-
  deployed `resend-email` (mis-named) removed and redeployed
  under the canonical `send-welcome` slug so the Postgres
  welcome trigger SQL resolves correctly.

### Docs

- `.claude/SKILLS_CATALOG.md` (gitignored) — routing reference
  mapping 38 top-level skills + 100+ sub-skills across 9 repos
  to keyword triggers. Future commands route via this catalog
  for token-efficient skill selection.

---

## [1.21.0] - 2026-04-19

### Added

- **10 SEO-optimised blog posts** targeting combined ~323k/month of
  search volume, each structured per BLOG_PLAN's uniform template
  (40-60 word featured-snippet answer, H2-heavy outline, PAA-harvested
  FAQ accordion, 5 related cross-links, mid + final CTAs):
  - `/pass-ats-resume-scanning` (33k/mo, KD 28)
  - `/resume-action-verbs` (40k/mo, KD 22) — 210 verbs across 7 role categories + weak-to-strong swap table
  - `/resume-length` (27k/mo, KD 25)
  - `/resume-summary-examples` (60k/mo, KD 32) — 25 before/after examples (15 by stage, 10 by industry)
  - `/resume-format-guide` (22k/mo, KD 30)
  - `/quantify-resume-achievements` (12k/mo, KD 18) — XYZ formula + 50+ bullets across 8 roles
  - `/cover-letter-vs-resume` (33k/mo, KD 24)
  - `/tailor-resume` (18k/mo, KD 20) — minute-by-minute process
  - `/best-free-resume-builder` (33k/mo, KD 38)
  - `/ai-resume-builders-tested` (45k/mo, KD 42)
- **10 programmatic role-based resume guides** at `/resume/[role]` via
  `generateStaticParams` over `lib/resumeRoleData.ts`. Hand-written,
  India + global aware: software-engineer, data-scientist, product-
  manager, ui-ux-designer, digital-marketer, full-stack-developer,
  devops-engineer, business-analyst, cybersecurity-analyst, machine-
  learning-engineer. Each covers must-have sections, ATS keywords,
  sample bullets, mistakes, India salary benchmarks, related roles.
  Hub page at `/resume` groups by category.
- **Sentry error monitoring (dormant)**. `@sentry/nextjs` wired via
  `instrumentation.ts` (server + edge), `instrumentation-client.ts`
  (browser), and `app/global-error.tsx`. Gated on
  `NEXT_PUBLIC_SENTRY_DSN` so zero traffic is sent until activated.
  Session replays on error, noise filters for RSC-fetch aborts and
  ResizeObserver warnings.
- **Typed analytics events** (`lib/analytics.ts`) wrapping
  `@vercel/analytics` with a compile-checked event-name union.
  Instrumented: signup_submit / signup_success (email + google),
  login_success, ai_rewrite_used, upgrade_modal_opened (ai + pdf),
  resume_exported (pdf/docx/html/markdown).
- **Husky pre-commit + pre-push hooks** enforce the mandatory
  checklist. Pre-commit runs `npm run lint && npx tsc --noEmit`;
  pre-push runs the full `npm run build`. Auto-installed on
  `npm install` via the `prepare` script.

### Changed

- **/about**: added "Our principles" (5 commitments that shape product
  decisions) and "What makes us different" (honest comparison table
  vs Zety, Resume.io, and Canva on download cost, privacy, ATS
  compatibility, AI, open source).
- **/ats-guide**: 4 new deep-dive sections — parser step-by-step
  (text extraction through ranking), per-system tuning (Workday,
  Greenhouse, Lever, iCIMS, Taleo, SmartRecruiters), manual resume
  testing workflow, and a 7-question FAQ.
- **/cover-letter**: 5 new sections — a complete 266-word cover
  letter example with annotations, length + formatting rules, email
  body vs attached file guidance, 8 explained mistakes, and an
  8-question FAQ.
- **/resume-tips**: 4 new sections — filename + format rules, length
  discipline with 5-point cut-test, 4-step proofreading workflow,
  and an 8-question FAQ.
- **/faq**: expanded from 17 to 26 questions (covers Pro tier,
  profile limit, AI privacy, keyboard shortcuts, mobile PWA,
  accessibility, blog/resources, cancellation, and data portability
  if the app ever shuts down). FAQPage JSON-LD schema now auto-
  generates from the full array instead of a hardcoded subset of 6.

### Docs

- `CHANGELOG.md` + `lib/changelogData.ts` entry for this release.
- `.env.example` includes commented `NEXT_PUBLIC_SENTRY_DSN` slot.

---

## [1.20.1] - 2026-04-19

### Added

- **Welcome email pipeline.** New `supabase/functions/send-welcome` Edge Function posts branded welcome HTML to Resend, gated by a shared-secret bearer (`WELCOME_HOOK_SECRET`). A Postgres trigger on `auth.users` (`supabase/sql/welcome_email_trigger.sql`) fires it exactly once when `email_confirmed_at` transitions from NULL, via `pg_net.http_post`. Async by design — confirmation flow is never blocked by Resend latency. Dormant until domain verification and secrets are in place.
- **`RESEND_SETUP.html`** standalone, offline-friendly setup guide covering Resend account creation, Namecheap DNS (MX / SPF / DKIM / DMARC) with the `send` subdomain gotcha, API key restrictions, Supabase SMTP configuration for the 13 built-in auth/notification templates, SQL wiring for the welcome trigger, and a 7-point end-to-end smoke test.

### Fixed

- **Lighthouse Accessibility (91 mobile / 95 desktop → 100 / 100):**
  - Footer column headings `<h4>` → `<h3>` so they nest under the section `<h2>` (was skipping h3 level).
  - Footer body/CTA/link-grid text bumped from `text-gray-400/500` → `text-gray-300` on the near-black gradient (old `gray-500` scored 4.10:1, failing WCAG AA 4.5:1; `gray-300` is 13.4:1, AAA).
  - Footer email input placeholder: `text-gray-500` → `text-gray-400`.
  - Hero "[1]" citation link now has `aria-label="Source: Jobscan 2024 ATS statistics"` so screen readers announce the source rather than just the number.
  - Changelog list headings: `<h1> → <h3> → <h4>` reshaped to `<h1> → <h2> → <h3>` per entry.
  - Pricing plan card headings: plan names (`Free`, `Pro`, `Lifetime`, `Coach`) `<h3>` → `<h2>` so they don't skip from the page `<h1>`.
  - Templates grid card titles: `<h3>` → `<h2>`.
  - `/blog/company-guides` company card titles: `<h3>` → `<h2>`.
  - Builder sidebar "Resume Sections" heading: `<h3>` → `<h2>`.

### Security

- **`/account` added to `app/robots.ts`** disallow list. Prevents private, auth-gated settings from appearing in search results.

### Chore

- **`.gitignore`** extended with `.claude/` and `supabase/.temp/` (Claude Code worktrees and Supabase CLI local state — never meant for commit).
- **`supabase/README.md`** — removed the outdated `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...` step (the `SUPABASE_` prefix is reserved; Supabase auto-injects `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` into every deployed function). Documents the new `send-welcome` deploy command and the one-time trigger SQL editing step.

---

## [1.20.0] - 2026-04-18

### Added

- **Account Settings page (`/account`).** Tabbed post-login page replacing the basic profile-dropdown options. Seven sections:
  - **Profile** — avatar upload (Supabase Storage, max 2 MB, JPG/PNG/WebP), full name, headline, current role, years of experience, timezone, locale.
  - **Job Search** — target role, seniority (intern through C-suite), industry, preferred locations, "open to work" toggle.
  - **Builder Defaults** — default template, font, accent colour (hex), resume language (en/hi), mask-phone-on-share toggle.
  - **Links** — LinkedIn, GitHub, portfolio URLs (https-only, auto-fill into builder).
  - **Notifications** — weekly ATS tips, product updates opt-in.
  - **Security** — change password, TOTP 2FA enrol/verify/remove, connected Google account, sign-out-this-device + sign-out-everywhere.
  - **Billing** — current plan (read-only, payments still on hold), invoice email.
- **`lib/accountUpdate.ts`** single-source helper: every write routes through a field-whitelisted `updateProfile` so forms cannot smuggle extra columns.
- **`lib/accountSchema.ts`** Zod validators for every form with length caps and URL/hex/email checks.
- **`docs/SUPABASE_ACCOUNT_SCHEMA.md`** migration doc with idempotent SQL for the new columns, RLS policies (`auth.uid() = id` on SELECT/UPDATE/INSERT, no DELETE), and the `avatars` storage bucket with owner-only write policies keyed by `storage.foldername(name)[1]`.
- **Code-split panels** — each tab is a separate file under `components/account/` loaded via `next/dynamic` so Turbopack compiles them on demand.

### Changed

- Navbar profile dropdown: "Manage Plan" → "Account Settings" pointing at `/account`. Upgrade and Reset Password links preserved.
- `Profile` type in `hooks/useAuth.ts` extended with 21 nullable fields matching the new schema; `.select('*')` so all fields hydrate on load.

### Security

- New columns all nullable with DB-level check constraints (length, enum, hex-regex).
- RLS policies enforce that no user can read or modify another user's row.
- Avatar bucket policies check `auth.uid()::text = storage.foldername(name)[1]` so users can only upload to their own folder.
- URL fields reject non-`https://` schemes and block `javascript:` explicitly.
- 2FA, password change, OAuth linking go through Supabase Auth API (audit logged, re-auth where required).

---

## [1.19.2] - 2026-04-17

### Changed

- **Navbar redesign — Notion-style clean white.** Inverted from dark `bg-gray-900` to white with `blue-500` logo chip, blue hover states, and blue-500 CTA. All existing functionality preserved: mega-dropdown (4 blog clusters + Help footer), auth profile dropdown (Manage Plan, Reset Password, Export Data, Sign Out, Delete Account, Upgrade), mobile menu, `useLoginGateway` wiring. CTA copy: "Get started free" for anon, "Build Resume" for signed-in.
- **Footer redesign — Newsletter takeover.** Dark `from-gray-900 via-slate-900 to-black` gradient (matches existing homepage hero for visual continuity). Live email validation (green/red border on input). Blue-400→blue-600 gradient headline. 4-column link grid (Product, Resources, Company, Legal) with Sitemap link in Legal column + bottom nav. GitHub URL corrected to canonical `Surya8991/ResumeBuildz` casing.

### Fixed

- **Supabase guest-mode stub completeness** — extended `lib/supabase/client.ts` stub with `.maybeSingle()`, `.upsert()`, `.insert()`, `.update()` methods. Previously only covered `.select().eq().single()` + `.delete().eq()`. Now handles every call path in `useCloudSync.ts` (`.maybeSingle`, `.upsert`) so guest-mode boot survives even if a user object somehow materializes.
- **Auth pages excluded from indexing** — `/login` and `/forgot-password` added to `app/robots.ts` disallow. Prevents outranking product pages on brand queries.

### Removed

- `app/design-previews/` and `app/preview-final/` — internal design-selection pages deleted after navbar/footer picks were finalized. Were showing up in `next build` output as static routes; now gone.

---

## [1.19.1] - 2026-04-16

### Fixed

- **Runtime crash when Supabase env vars missing.** `createBrowserClient('', '')` was throwing on first render on fresh clones with no `.env.local`. Both `lib/supabase/client.ts` and `lib/supabase/server.ts` now detect missing env and return a no-op stub so the app runs in guest mode. Same guard added to `proxy.ts` and `app/auth/callback/route.ts`.
- **React "script tag while rendering component" warning** in `app/layout.tsx`. Replaced `next/script` with `strategy="beforeInteractive"` (which Next 16 no longer renders correctly when placed in `<body>`) with a plain inline `<script>` tag in `<head>`. Dark-mode init still runs synchronously before hydration — no FOUC.
- **3 ESLint errors** (`react-hooks/set-state-in-effect`) in `ShareResumeDialog`, `VersionHistoryDialog`, `ATSTrend`, and `app/r/page.tsx`. All legitimate async-state-sync patterns — suppressed with targeted per-line disables + explanatory comments.
- **Typed env accessors** (`lib/env.ts`) replace scattered `process.env.FOO!` non-null assertions with lazy getters that throw a clear "Missing required env var: X" error at access time. Soft-required helpers return `''` with a dev warning so the app still boots in guest mode.
- **Auth error normalization** (`lib/authErrors.ts`). Raw Supabase error messages are no longer reflected into URL query params or UI — all errors pass through `classifyAuthError` → stable code (`code_expired`, `invalid_credentials`, etc.) → friendly label. Prevents implementation-detail leaks and weak-trust phishing.

### Chore

- **Lint cleanup** — 16 warnings resolved: unused imports (`CheckCircle2`, `FileText`, `Link`, `Users`, `UserCircle`, `CustomSection`), unused `eslint-disable` directives, 3 dead `useMemo` hook calls in `ATSScoreChecker` whose return values had moved to child sections.
- **Canonical URL cleanup** — `lib/siteConfig.ts` fallback corrected from the non-existent `resumebuildz.vercel.app` to the actual Vercel project URL `resume-forge-orcin.vercel.app`. All GitHub references (`app/layout.tsx` JSON-LD, `components/SiteFooter.tsx`, `README.md`, `README.html`) updated to the canonical casing `Surya8991/ResumeBuildz`. Vercel env var `NEXT_PUBLIC_SITE_URL` should be set in the production environment to override this fallback with the final custom domain.

---

## [1.19.0] - 2026-04-16

### Security — 10 hardening fixes

1. **Content-Security-Policy** header added (`next.config.ts`) with `frame-ancestors 'none'`, `object-src 'none'`, strict `default-src 'self'`, and allowlisted `connect-src` for Supabase + Groq + Vercel. Also adds `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`.
2. **Rate limit on `/api/checkout`** (`lib/rateLimit.ts`): in-memory token bucket, 10 sessions/hour/IP. Protects against Stripe-fee DoS.
3. **CSRF / Origin verification on `/api/checkout`**: rejects cross-origin POSTs. Prevents hidden-form attacks from racking up checkout sessions.
4. **Photo upload magic-byte validation** (`lib/imageMagic.ts`): verifies first 12 bytes match JPEG/PNG/GIF/WebP signatures before accepting. MIME type alone was spoofable.
5. **`maxLength` support in RichTextarea** + 2000-char cap on summary. Defense against multi-MB paste DoS. Pattern available for all RichTextarea usages.
6. **`Referrer-Policy: no-referrer`** on `/r/*` share pages. Even though URL fragments never hit the wire, this prevents leaking resume content via any potential Referer on outbound link clicks.
7. **Narrowed proxy matcher** to only auth-requiring paths (`/builder`, `/login`, `/auth/*`, `/api/*`, `/pricing`). Marketing pages no longer trigger Supabase session refresh on every request — less attack surface + faster TTFB.
8. **Stripe webhook signature stub** at `/api/stripe/webhook`: reads raw body, verifies with `STRIPE_WEBHOOK_SECRET`, routes 4 event types. Returns 503 until env vars set so Stripe retries. Prevents spoofed subscription upgrades.
9. **BYOK security warning banner** in AI tab: explicit callout that the Groq key lives in localStorage and is vulnerable to XSS/extensions, with rotation + spending-cap guidance.
10. **Production-safe logger** (`lib/logger.ts`): silences `.info`/`.warn` in prod, scrubs sensitive keys (password/token/secret/api_key/auth/cookie/session) from `.error` args. Wired into useAuth, useCloudSync, proxy, webhook handler.

### Added
- Local PDF.js worker `Content-Type` header (`text/javascript`) and 1-year `Cache-Control`.

---

## [1.18.0] - 2026-04-16

### Added — 8 roadmap features shipped

- **PDF.js worker bundled locally** at `/pdfjs/pdf.worker.min.mjs`. Kills unpkg CDN dependency — PDF import now works behind corporate firewalls.
- **LinkedIn JSON import** (`lib/importLinkedIn.ts` + `LinkedInImportModal`). Auto-detects LinkedIn Data Export, Voyager API, and JSON Resume formats. Toolbar: "LinkedIn" button.
- **Resume version history** (`lib/versionHistory.ts` + `VersionHistoryDialog`). Up to 30 named snapshots, auto-save hourly, one-click restore with automatic pre-restore backup. Toolbar: "Versions" button.
- **Shareable read-only link** at `/r#<payload>`. Resume encoded in URL fragment via gzip+base64url. Zero backend, zero PII leaves the browser. Toolbar: "Share" button. `/r` added to robots disallow.
- **JD-tailored rewrite** (`components/JDTailor.tsx`). Paste a job description, AI rewrites summary + top experience bullets with diff preview. Auto-snapshots before applying. Lives in the AI tab.
- **Resume diff viewer** (`components/ResumeDiff.tsx`). Word-level LCS diff — inline or side-by-side. Powers the JD tailor preview.
- **Cover letter tone variants** — 4 picks (Professional, Formal, Casual, Concise) in the cover letter form. Per-tone system prompts and temperature tuning.
- **ATS score trend** (`components/ats/ATSTrend.tsx`). SVG sparkline of score history. Debounced snapshots (min 1-minute gap). Visible in the ATS tab.

### Infrastructure

- New shared libs: `lib/shareLink.ts` (gzip+base64url codec), `lib/diffText.ts` (LCS word-diff), `lib/atsTrend.ts` (trend storage), `lib/versionHistory.ts`.
- Build output unchanged: 0 errors, same number of static routes +1 (`/r`).

---

## [1.17.0] - 2026-04-16

### Added — 15 features across builder, AI, infra, growth

#### Builder
- **Markdown export** (`.md`) — dev-friendly, GitHub-renderable.
- **ATS plain-text export** (`.txt`) — pure UTF-8, ASCII-safe bullets, for Workday/Greenhouse/Naukri.
- **Streaming AI** — cover letter now streams live instead of 3-5s blank wait. New `streamGroqAI()` helper with SSE parser.
- **Keyboard shortcut cheatsheet** (`Ctrl+/` or `?`) — full dialog of all 11 shortcuts.
- **Last-edited timestamp** — "Saved 2m ago" in the builder footer. Auto-refreshes every 30s.
- **Dark mode persist** — localStorage-backed, init-before-paint script prevents FOUC.
- **Removed duplicate Ctrl+E shortcut** — `Ctrl+P` and `Ctrl+E` were both bound to PDF export.

#### Infrastructure
- **Stripe checkout scaffold** — `lib/stripe.ts` + `app/api/checkout/route.ts` + `hooks/useCheckout.ts`. Lazy SDK load, returns 503 when not configured. Pricing page + UpgradeModal wired.
- **Cloud sync hook** — `hooks/useCloudSync.ts` pulls on sign-in and debounced-pushes on edits to a Supabase `resumes` table. Silent fallback when table missing.
- **Edge Function: `delete-user`** — GDPR-safe account deletion (deletes both `profiles` row and `auth.users` row). `useAuth.deleteAccount` invokes this with fallback to legacy behavior.
- **Edge Function: `increment-usage`** — server-side rate limiting for AI/PDF. Plan-aware limits, dry-run mode.
- **`supabase/README.md`** with deploy steps + required SQL.

#### Growth / SEO
- **Changelog RSS feed** at `/changelog/rss.xml`.
- **Status page** at `/status` — live health of app, AI, auth, PDF-import upstreams.
- **Roadmap page** at `/roadmap` — public tracker with shipped / in-progress / planned.
- **404 page with live search** — searches all pages + blog posts + company guides.
- **ShareButton component** — copy link + LinkedIn/X/email intents for blog posts.
- **Sitemap auto-discovery** — blog posts now pulled from `BLOG_POSTS` registry instead of manual entries. Adds `/roadmap` and `/status`.
- **Changelog data extracted** to `lib/changelogData.ts` — single source for page + RSS route.

### Fixed
- `toggleDarkMode` now persists state to localStorage and initializes from DOM class (was always starting `false`).

---

## [1.16.0] - 2026-04-16

### Fixed (full-project codereview — 40+ findings across 31 files)

#### Security
- **High:** `ensureUrl()` now blocks `javascript:`, `data:`, and `vbscript:` URI schemes.
- **High:** `safePhotoSrc()` rejects remote photo URLs — only `data:image/*` allowed. Wired into `ResumePreview` so all 20 templates are protected.
- **High:** `safePrimaryColor()` validates hex format before interpolation into CSS. Wired into `ResumePreview`.
- **High:** `callGroqAI` calls wrapped in try/catch/finally in `ATSScoreChecker`, `AISuggestions`, and `CoverLetterForm` — no more permanent loading states on network failure.
- **Medium:** `fetchProfile` now uses explicit `select(...)` instead of `select('*')`, logs errors instead of swallowing them.
- **Medium:** `exportUserData` now picks only safe fields from profile instead of dumping the raw object.
- **Medium:** `canUseAI` limit aligned to `FREE_LIMITS.ai = 1` (was hardcoded `< 3`).

#### Bugs
- **High:** `SectionReorder` `indexOf` can return -1 — guard added to prevent array corruption.
- **High:** Legacy `.doc` import now returns clear error instead of opaque mammoth crash.
- **High:** AI-parsed JSON validated: arrays checked with `Array.isArray`, malformed objects rejected.
- **Medium:** `DateConsistency` non-null assertion replaced with proper null check.
- **Medium:** `InfographicTemplate` skill bars use deterministic formula instead of `Math.random()`.
- **Medium:** `ModernTemplate` two-column layout now includes custom sections (were silently dropped).
- **Medium:** `exportDocx`/`exportHtml` handle empty `endDate` — no more trailing " - " with nothing.
- **Medium:** `PasteImportModal` 100k char limit now enforced on the Import button.
- **Medium:** `MultiJDMatching` ID collision risk fixed with random suffix.
- **Medium:** `BoldTemplate` certifications: "to" → "-".
- **Medium:** `MonochromeTemplate` empty proficiency no longer renders `()`.
- **Low:** `builder/page.tsx` custom section IDs use `crypto.randomUUID()` instead of `Math.random()`.
- **Low:** Blob URL revoke deferred 60s in builder export and useAuth export (prevents download cancellation).

#### UX / Accessibility
- **Medium:** `deleteProfile` now requires `confirm()` before deletion.
- **Medium:** `ErrorBoundary` "Reset & Reload" now requires `confirm()` before nuking localStorage.
- **Medium:** Toast container has `role="status" aria-live="polite"` for screen readers.
- **Medium:** Contact form success changed from "Message Sent!" to "Email Client Opened!" with fallback text.
- **Medium:** `SummaryForm` removed misleading "/500" counter (no maxLength was enforced).
- **Low:** `PersonalInfoForm` LinkedIn/GitHub regex now checks URL starts with the domain.
- **Low:** Phone validation requires >= 7 actual digits.
- **Low:** `textAnalysis.ts` bigram extraction skips stop-word pairs.

#### Cleanup
- **Medium:** Removed redundant `<link rel="preconnect">` for Google Fonts (next/font handles this).
- **Medium:** `SiteNavbar` mobile menu removed dead `/builder` branch (NAV_LINKS never contained it).
- **Low:** `WhatsNew` + `OnboardingGuide` localStorage access wrapped in try/catch (Safari private browsing).
- **Low:** `ReadingProgress` resize listener now passive.
- **Low:** `siteConfig.ts` fallback URL updated from old `resume-forge-orcin` to `resumebuildz`.

Lint: 0 errors. Build clean. 31 files changed.

---

## [1.15.1] - 2026-04-16

### Fixed (codereview pass #2 — 13 findings)

- **High:** `GROQ_MODEL` was duplicated in 4 files (`groqAI.ts`, `AISuggestions.tsx`, `importResume.ts`, `CoverLetterForm.tsx`). Now exported once from `groqAI.ts` and imported everywhere.
- **High:** `AISuggestions.tsx` duplicated the entire Groq fetch call instead of using `callGroqAI()`. Refactored to use the shared helper; same for `CoverLetterForm.tsx` and `importResume.ts`.
- **Medium:** `callGroqAI()` enhanced with `status` field on errors (for granular 401/429/402 handling) and optional `apiKeyOverride` parameter (for `importResume.ts` which passes keys explicitly).
- **Medium:** `ResumePreview.tsx` `overrideCSS` now passes through `sanitizeCSS()` that strips `<script`, `expression()`, and `url(javascript:)` patterns (defense-in-depth; values were already sanitized at construction).
- **Medium:** `navigator.clipboard.writeText()` wrapped in try/catch in `AISuggestions.tsx` and `CoverLetterForm.tsx`. Shows toast/alert on failure instead of unhandled rejection.
- **Medium:** `/hero-preview` and `/loader-preview` now use server-rendered `<meta name="robots" content="noindex,nofollow">` via Next.js `layout.tsx` metadata export. Removed client-side `useEffect` injection that search engine crawlers couldn't see.
- **Low:** `LoaderCard` accepts `size` prop (`'sm' | 'md'`). `Loader7_BottomRightCard` now reuses `<LoaderCard size="sm" />` instead of duplicating skeleton markup.
- **Low:** `hero-preview` familyLabel now correctly shows "Combined" (with amber badge) instead of "Fill" for combined-family options.
- **Low:** `Loader10_SparkleCursor` documented: mousemove listener won't fire when parent has `pointer-events:none` (e.g., production PageLoader overlay). Only suitable for interactive containers.

---

## [1.15.0] - 2026-04-16

### Added

- **`components/LoaderCard.tsx`** — shared centered skeleton card used by both the production `PageLoader` and the `/loader-preview` gallery's Loader4. Single source of truth for brand visuals.

### Fixed (codereview pass on PageLoader work)

- **High:** `PageLoader` now has an 8-second safety timeout that auto-hides the loader if a navigation never completes (cancelled, network failure, hard crash). Previously the user could get stuck staring at a frozen overlay until they refreshed.
- **Medium:** `prefers-reduced-motion` respected via Tailwind's `motion-safe:` / `motion-reduce:` variants. Users with the OS-level "Reduce motion" setting see a static skeleton with no pulse animation. WCAG 2.3.3 compliant.
- **Medium:** SVG `<a>` elements now type-guarded — the click listener checks `instanceof HTMLAnchorElement` before reading `target` / `rel` / `download`, preventing undefined behavior on inline SVG links.
- **Medium:** Relative URLs now resolved correctly. `<a href="about">` clicked from `/some/path` now correctly compares against the resolved URL `/some/about`. Was previously doing a raw string comparison that triggered the loader on no-op same-page navigations.
- **Low:** `<aria-live="polite">` + visually-hidden "Loading page" announcement so screen readers know a navigation is happening. Previously `aria-hidden` made the loader invisible to assistive tech.
- **Low:** All `<style jsx>` keyframe blocks in `PageLoaderOptions.tsx` extracted to `app/globals.css` with `loader-` prefixed names (`loader-pulse-scale`, `loader-dot-bounce`, `loader-pulse-ring`, `loader-eq-bar`, `loader-aurora-sweep`). No more global-scope keyframe collisions.
- **Low:** `Loader4_SkeletonCard` now imports the shared `LoaderCard` component instead of duplicating 30 lines of JSX.
- **Low:** `/loader-preview` and `/hero-preview` get `<meta name="robots" content="noindex,nofollow">` injected on mount to keep them out of search engine indexes. `app/robots.ts` also adds them to the crawler `disallow` list as defense-in-depth.

Lint: 0 errors, 13 warnings. Build clean.

---

## [1.14.0] - 2026-04-15

### Changed

- **Page loader replaced** with the centered-skeleton-card design (Option 4 from `/loader-preview`). The previous top progress bar + bottom-right floating card design is gone. The new loader is a centered card on a soft white backdrop with skeletal resume bars filling in — mirrors the homepage Fill7_Ultimate hero aesthetic so every page transition reinforces the resume-building brand metaphor.
- **Loader has a 150ms grace period** before showing. Quick navigations that complete in under 150ms never flash the loader at all.
- **`/loader-preview` gallery** added with 10 loader options (Stripe, Vercel, Spotify, Apple, GitHub, Linear, Notion, Material Design inspirations) for selecting between alternative designs.

### Fixed

- `components/PageLoaderOptions.tsx` Loader10_SparkleCursor: moved initial `setPos` out of the effect body into a `queueMicrotask` callback to satisfy the cascading-renders lint rule.

---

## [1.13.0] - 2026-04-15

### Added

- **Page transition loader** (`components/PageLoader.tsx`) — global navigation indicator wired into `app/layout.tsx`. Two visual elements:
  - Thin blue gradient progress bar at the top of the viewport that trickles up to ~85% during navigation and snaps to 100% on completion.
  - Floating mini "resume building" card in the bottom-right corner with skeletal bars filling in (mirrors the homepage Fill7_Ultimate hero aesthetic). Only shows after 25% progress so quick navigations don't flash it.
- The loader detects navigation start via a global click listener on `<a>` elements (filters out external links, downloads, modifier-key clicks, anchor jumps, mailto/tel links). It also responds to browser back/forward via `popstate`. Completes when `usePathname()` reports the new route.

### Fixed (codereview pass — 16 issues)

- **High:** `WhatsNew.tsx` `APP_VERSION` bumped from stale `1.4.0` to `1.12.0` with current release notes.
- **High:** ESLint enforcement moved from `next.config.ts` (Next 16 removed the option) to `.github/workflows/ci.yml` — CI now runs `npm run lint -- --max-warnings 50` between TypeScript check and build.
- **Medium:** `app/login/page.tsx` setError-in-effect → lazy useState initializer. No more cascading-render warning.
- **Medium:** `components/CookieBanner.tsx` and `components/WhatsNew.tsx` — dropped `mounted` flag, setState only inside setTimeout/rAF callbacks.
- **Medium:** `store/useResumeStore.ts` `let pendingWrites` → `const`.
- **Medium:** `app/resume-after-career-gap/page.tsx` line 179 unescaped `"` → `&quot;`.
- **Medium:** `lib/siteConfig.ts` (new) centralizes the deployed site URL via `NEXT_PUBLIC_SITE_URL`. All 9 hardcoded `https://resume-forge-orcin.vercel.app` references replaced with `SITE_URL` / `absoluteUrl()` imports. Renaming the Vercel project now requires changing one constant.
- **Medium:** All `dangerouslySetInnerHTML JSON.stringify` blocks for JSON-LD now use the `jsonLd()` helper from `lib/articleSchema.ts` (escapes `<`).
- **Medium:** Removed unused `SUPABASE_SERVICE_ROLE_KEY` from `.env.example` and `README.md`.
- **Medium:** `components/templates/MonochromeTemplate.tsx` — removed dead `const _ = primaryColor` workaround. Destructure `{ data }` only.
- **Low:** `components/HeroOptions.tsx` Fill4 — removed `as unknown as ReturnType<typeof setInterval>` type lie. Uses union of separate intervalId / timeoutId variables.
- **Low:** `components/HeroOptions.tsx` Fill7_Ultimate — added `IntersectionObserver` to pause animation timers when hero scrolls offscreen. Resumes on re-entry.
- **Low:** `eslint.config.mjs` silences `@next/next/no-img-element` for `components/templates/**` (since `images.unoptimized: true` makes `<img>` no worse than `<Image />`).
- **Low:** `next.config.ts` documented why `images.unoptimized: true` is set.
- **Low:** `lib/validation.ts` removed unused `eslint-disable` directive.

Lint result: **0 errors, 13 warnings** (down from 5 errors / 35 warnings before the codereview).

---

## [1.12.0] - 2026-04-15

### Added

- **Ahrefs-style 2-tier blog taxonomy**: 4 parent groups containing 7 child clusters, based on research across HubSpot, Ahrefs, Indeed, Zety, Enhancv, Kickresume, Teal, LinkedIn Talent, Canva, and Notion blog navs.
- **New "Interviews & Cover Letters" category** at `/blog/category/interviews-cover-letters` — closes the biggest gap vs. every direct competitor.
- **`/cover-letter` page** added as a blog post in the new category.
- **`PARENT_GROUPS` array + `parentGroup` field** in `lib/blogCategories.ts`. New helpers `getCategoriesByParent()` and `getParentBySlug()`.
- **Mega-dropdown in the navbar** Resources menu — 4-column grid on desktop showing parent group headers + their child categories. Mobile renders as nested accordion grouped by parent.
- **Parent-grouped blog hub** at `/blog` — categories now grouped under 4 pillar headers (Resume & ATS, Job Search, India Hiring, Company Guides) instead of a flat 6-card grid.

### Changed

- **Footer Blog column** restructured into 3 visual groups (Resume & ATS / Job Search / India & Companies) matching the new parent taxonomy.
- **Sitemap** auto-includes the new `/blog/category/interviews-cover-letters` URL.

### Why this structure

Research summary: every direct resume/career competitor (Zety, Indeed, Enhancv, Kickresume, Teal) caps at 3-6 flat categories around Resume + Cover Letter + Interview + Job Search. None of them break out India Hiring, Company Guides, or AI Tools as top-level — those would dilute the 5-cluster cap. ResumeBuildz has all three as content moats, so a flat 7-cluster menu would bury our differentiators. The Ahrefs nested model is the only researched pattern that scales to 7+ clusters while preserving clean SEO silos.

---

## [1.11.0] - 2026-04-15

### Changed

- **Navbar "Resources" dropdown** now contains two nested sections: a **"Blog — topic clusters"** group with all 6 clusters (Resume Writing, ATS & Keywords, Career Transitions, India Hiring, Company Deep Dives, AI Resume Tools), and a **"Help"** group with FAQ + Company Guides Hub. FAQ moved out of the top-level nav.
- **Main nav items**: Templates, Resources (dropdown), About, Pricing, Contact.
- **Footer Blog column** (replacing the old Resources column) with links to All Articles, 4 cluster pages, and FAQ. GitHub link updated to `Surya8991/resumebuildz`.
- **OG image** brand text changed from "ResumeForge" to "ResumeBuildz" in `app/opengraph-image.tsx`.
- **JSON-LD Organization** `sameAs` in `app/layout.tsx` updated to the new repo URL.
- **README.md / README.html** clone commands updated to `resumebuildz.git`.
- **Project renamed** from ResumeForge to **ResumeBuildz**. Every user-facing string ("ResumeForge") has been replaced with "ResumeBuildz" across 43 files: site metadata (titles, descriptions, OG/Twitter tags), JSON-LD publisher name, brand logo text in navbar/footer/login/builder/not-found, all in-page copy, testimonials, manifest.json, llms.txt, README, CONTRIBUTING, SECURITY, LICENSE, .env.example, and all blog/resources/situation/company pages.
- **package.json** name changed from `resumeforge` to `resumebuildz`.
- **Historical CHANGELOG entries** rewritten to say "ResumeBuildz" so brand consistency is preserved for anyone reading the file top-to-bottom (no historical inaccuracy — the product is the same, only the name changed).

### Not changed (technical identifiers — intentional)

- **localStorage keys** (`resumeforge-storage`, `resumeforge-usage-ai`, `resumeforge-usage-pdf`, `resumeforge-last-visit`, `resumeforge-waitlist`, `resumeforge-cookie-consent`, `resumeforge-saved-jds`, `resumeforge-onboarding-done`, `resumeforge-version`) — renaming these would orphan every existing user's saved resume data silently. Kept as-is; the keys are internal and never shown to users.
- **Vercel deployment URL** (`resume-forge-orcin.vercel.app`) — the URL still points to the old Vercel project name. Rename the Vercel project via the dashboard to update the URL; JSON-LD canonical URLs, sitemap.ts, and schema helpers all read from this string and will pick up the new URL once changed.
- **GitHub repo URL** (`github.com/Surya8991/resumeforge`) — rename the repository in GitHub settings to update. References in footer, contributing, security, and meta tags point here and will continue working via GitHub's automatic redirect.
- **Git history** — preserved.

---

## [1.10.0] - 2026-04-15

### Added

- **Blog section** at `/blog` with topic-cluster discovery layer over existing long-form content:
  - `/blog` hub page with featured strip, topic-cluster cards, and filterable post grid.
  - `/blog/category/[category]` dynamic route with 6 statically generated category pages.
  - `lib/blogCategories.ts` with 6 topic clusters (Resume Writing, ATS & Keywords, Career Transitions, India Hiring, Company Deep Dives, AI Resume Tools) — each with slug, name, description, long description, icon, color, and SEO keywords.
  - `lib/blogPosts.ts` with 8 blog post entries + 1 virtual post (company guides hub link). Each post references its existing page URL — no URL moves, no SEO breakage.
- **Ultimate hero** (`Fill7_Ultimate`) — the most complete hero possible. Mouse-tracked 3D parallax tilt with score chip + suggestion popups floating at different translateZ depths, resume filling in section by section, 4 coaching chips resolving to green checks, ATS score climbing 0% → 94% in lock-step, "ATS-READY" badge at the end, plus a cursor-tracked blue highlight sweep. Applied to the homepage hero.
- **Combined hero** (`Fill6_Combined`) — intermediate version without the tilt. Kept in the preview gallery as option 11.
- Sitemap updated with `/blog` and 6 blog category URLs.

### Changed

- **Resources dropdown in navbar** restructured to point to blog categories instead of flat page links. Now shows: All Articles, Resume Writing, ATS & Keywords, Career Transitions, India Hiring, Company Guides.
- **Homepage hero** replaced with `Fill7_Ultimate` (was `Fill6_Combined`, was static `/templates/modern.png` before that).

---

## [1.9.0] - 2026-04-15

### Added

- **Long-form article scaffolding** for all 28 content pages (22 company + 6 situation): sticky TOC sidebar (xl+) with mobile accordion, breadcrumb navigation, ArticleMeta bar (author + reading time + last updated + fact-checked badge), JSON-LD Article + FAQPage + HowTo + BreadcrumbList schemas.
- **components/TOC.tsx** — auto-detects h2 elements on mount, assigns stable IDs, uses IntersectionObserver for active-section highlighting, smooth scroll with URL hash update.
- **components/Breadcrumbs.tsx** — visual breadcrumbs with Home icon.
- **components/ArticleMeta.tsx** — author avatar + reading time + last updated + fact-checked badge.
- **components/ReadingProgress.tsx** — thin blue scroll progress bar + back-to-top floating button. Scoped to long-form pages only (not homepage/builder/marketing).
- **lib/articleSchema.ts** — Article / FAQPage / HowTo / BreadcrumbList JSON-LD helpers + combineSchemas() for multi-graph pages.
- **lib/resumeCompanyDataDeep.ts** — 5 new content fields per company: cover letter template (3 paragraphs), 5 common interview questions with hints, 5 red flags that auto-reject, salary benchmark table (3 roles x 3 seniority levels), referral strategy paragraph.
- **5 new sections on every company page**: Cover letter template, interview questions, red flags, salary benchmarks, referral strategy.
- **6 situation pages enriched** with topic-specific additions: email templates (layoff, career gap, career change), comparison tables (fresher chronological vs functional vs hybrid), glossary (fresher resume), case studies (Priya/Rohan/Arjun/Meera/Nikhil — composite stories).
- **/hero-preview internal gallery** at `/hero-preview` with 10 hero variations (5 mouse-tracked tilt + 5 AI-fill animations) for selecting the homepage hero treatment.
- **CSS keyframes** added to globals.css for marquee and floating animations.

### Changed

- **ReadingProgress scope**: moved out of the global `app/layout.tsx` and now only renders on long-form content pages (6 situation pages + CompanyResumeView covers all 22 company pages). Homepage, builder, templates, pricing, auth, and legal pages no longer show the scroll progress bar.
- **Login gateway audit**: every remaining direct `<Link href="/builder">` in app/ replaced with a `<button onClick={() => openGateway('/builder')}>` pattern. Fixed in `app/not-found.tsx`, `app/ats-guide/page.tsx`, `app/cover-letter/page.tsx`. The only remaining `href="/builder"` is the post-login profile dropdown link in the navbar, which is intentional (user is already authenticated).
- **CompanyResumeView** renders 5 additional deep-content sections conditionally when deep data exists (cover letter, questions, red flags, salary, referral).

---

## [1.8.0] - 2026-04-14

### Added

- **22 company resume guides** under `/resume-for/[company]` — 10 global (Google, Amazon, Microsoft, Meta, Apple, Deloitte, McKinsey, Goldman Sachs, JP Morgan, Accenture) + 12 India (TCS, Infosys, Wipro, Flipkart, Zomato, Swiggy, Zoho, BYJU'S, PhonePe, Razorpay, Freshworks, Ola).
- **`/resume-for` hub page** listing all 22 companies, segmented by Global vs India tier.
- **`lib/resumeCompanyData.ts`** — single source of truth for all 22 entries (slug, name, tier, industry, hq, hiring focus, 15 ATS keywords, 5 insider tips, recommended template, meta title, meta description). Fully static, no API calls.
- **6 situation-based static pages**: `/fresher-resume`, `/campus-placement-resume`, `/naukri-resume-tips`, `/resume-after-layoff`, `/resume-after-career-gap`, `/resume-for-career-change`. Each is a hand-written long-form guide with internal links, CTAs, and SEO meta tags.
- **Resources dropdown in navbar** exposing all 9 new pages on desktop (with icons) and as a collapsible group on mobile.
- **Dynamic page generation**: `app/resume-for/[company]/page.tsx` uses `generateStaticParams` + `generateMetadata` so all 22 company pages prerender at build time with unique titles and descriptions.
- **Sitemap expanded** by 29 URLs (1 hub + 22 companies + 6 situations).

### Changed

- **SiteNavbar** restructured: Templates is now the first item, followed by a Resources dropdown, then About / Pricing / FAQ / Contact.
- All new pages reuse existing `SiteNavbar`, `SiteFooter`, `useLoginGateway` hook, and the dark gradient hero pattern from `/templates` and `/ats-guide`.

---

## [1.7.0] - 2026-04-14

### Added

- **Vercel Web Analytics** (cookieless, GDPR safe, free on Hobby plan) replaces the planned Plausible integration.
- **README** alternatives section listing 3 free analytics options (Cloudflare Web Analytics, Umami Cloud, PostHog).

### Changed

- **Privacy Policy** completely rewritten for legal compliance with the new analytics, Supabase auth, and waitlist email storage. Old wording incorrectly claimed "zero data collection."
- **Terms of Use** Section 3 updated to accurately describe data handling.
- **Homepage Privacy First** card no longer claims "no analytics."
- **About page Mission** statement updated. Stats updated from "0 data sent" to "Free to start" and "Open Source." Tech stack item "Client-side Only" relabeled "Client-side First."
- **Template Showcase** on homepage now uses real template thumbnail PNGs instead of solid color blocks.
- **Navbar** removed "Resume Builder" from main nav links and added `whitespace-nowrap` to all items. Fixes overflow at 1024px laptop widths.
- **Contact form** now opens user's email client with a pre-filled mailto link instead of pretending to send (no backend yet).

### Page-by-page review fixes

A full top-to-bottom code + live preview review of all 16 pages. Found and fixed:
- Homepage: 3 issues (Template Showcase, Privacy First card, Build My Resume CTA copy)
- About page: 5 issues (mission text, stats, tech stack, hero subtitle, Privacy card)
- Privacy page: 9 sections rewritten for accuracy
- Terms page: 1 section updated
- Contact page: form submission now works via mailto

---

## [1.6.0] - 2026-04-14

### Added

- **Undo / Redo system** with 50-snapshot history. Ctrl+Z to undo, Ctrl+Y or Ctrl+Shift+Z to redo. Auto-snapshots after 1.5s of inactivity.
- **Keyboard shortcuts**: Ctrl+E for PDF export, Ctrl+1-5 to jump between Edit/Preview/Templates/ATS/AI tabs. Shortcuts are ignored while typing in form fields.
- **Login Gateway modal** on Build Resume CTAs offers Sign In or Continue as Guest.
- **Email verification banner** in builder for unverified users.
- **Resume import rollback**: snapshot taken before import, automatically restored on failure.
- **BreadcrumbList JSON-LD schema** on ATS Guide page for better SEO.
- **Section visibility hint** on Languages form clarifying when sections appear in preview.
- **Real diverse names** in homepage avatars (Sarah Mitchell, David Chen, Priya Sharma, Marcus Johnson, Emily Rodriguez) replacing placeholder letters.

### Changed

- **Debounced localStorage writes** (1s) to reduce battery drain on mobile. Flushes on beforeunload/pagehide to prevent data loss.
- **`<img>` to `next/image`** on homepage hero and template thumbnails for better performance and LCP.
- **`React.memo`** on ResumePreview component to prevent re-renders on every keystroke.
- **Weighted completion score** (15% name, 12% email, 15% experience, etc.) instead of flat per-check weighting.
- **Loading states** on export use try/finally instead of setTimeout for accurate UI state.
- **Touch swipe** ignores inputs, draggable handles, sliders, buttons, and contenteditable. Vertical tolerance prevents accidental swipes during scrolls.
- **AI error handling**: granular messages for HTTP 401 (invalid key), 429 (rate limit), 402/403 (quota), and malformed JSON responses.
- **Skills category** now shows `(required)` indicator with amber border when empty.
- **Photo upload** validates MIME type (no SVG) to prevent embedded scripts. Allows JPEG, PNG, WebP, GIF only.
- **DragEnd handlers** validate findIndex returns to prevent silent reorder bugs.
- **Resume parser regex** extracted to `lib/parserConfig.ts` for easier maintenance.
- **Em dashes and double hyphens** removed from all user-facing copy across 12 pages, templates, and docs.
- **License updated** to allow author commercial use while preventing third-party reselling.
- **Stat citations** added to homepage and other pages: (Jobscan, 2024), (Glassdoor, 2024), etc.

### Fixed

- ATS scoring crashes when keyword matches array is empty or undefined.
- DragEnd handlers in Experience, Education, and Projects forms no longer fail silently when findIndex returns -1.
- ResumeProfileManager memory leak verified as false positive (cleanup is correct).
- Builder god component reduced (still 950+ lines, deferred for full split).
- `alert()` calls in resume import replaced with toast notifications.

### Security

- Photo upload MIME type whitelist (no SVG XSS vector).
- AI suggestions now handle malformed JSON safely.
- Validation helpers in `lib/validation.ts` provide consistent input sanitization.

---

## [1.5.0] - 2026-04-13

### Added

- Supabase authentication with Google OAuth and email/password sign-in.
- Profile dropdown with avatar, Manage Plan, Reset Password, Sign Out, Export Data, Delete Account.
- Pricing page with 5 tiers: Free, Starter ($5), Pro ($9), Team ($19), Lifetime ($49).
- Freemium gates: 1 AI rewrite/day, 3 PDF exports/day on free tier.
- Toast notification system for actions, warnings, and Pro upgrades.
- Waitlist email capture on pricing page for Pro launch notifications.
- GDPR controls: Export My Data and Delete Account in profile dropdown.
- Terms of Use page with detailed legal sections.
- Custom 404 not-found page with helpful navigation.
- Month picker for date fields (Experience, Education, Projects, Certifications).
- Dynamic OG image via Next.js ImageResponse (edge runtime).
- Dynamic robots.ts and sitemap.ts (replaced static files).
- FAQ schema on `/ats-guide` and `/faq` pages.
- Organization JSON-LD schema with logo and founder.
- Login page with Google OAuth and email/password.
- Forgot password flow.
- Auth callback route with redirect whitelist validation.
- Proxy.ts (Next.js 16 migration from middleware.ts).

### Changed

- Removed `output: 'export'` to enable server-side features and proxy.
- Updated LICENSE to allow author commercial use.
- Replaced "100% Free" messaging with "Free to start" across all pages.
- Builder toolbar buttons (Import, Reset, Dark/Light) now match Export button styling.

### Security

- CSP headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- OAuth redirect whitelist validation in auth callback.
- Singleton Supabase client (fixed infinite re-render bug).
- Email verification gate for Pro features.

---

## [1.4.0] - 2026-04-11

### Added

- Resume completion percentage bar (10 criteria, color-coded red/yellow/green).
- Welcome back indicator for returning users (>1hr gap detection).
- What's New v1.4.0 popup (version-tracked, bottom-right notification).
- Skill suggestions based on job title (fuzzy matching against 201 roles).
- Social proof section in landing page hero (avatars, stars, trust indicator).
- Per-page OG meta descriptions for all 11 pages.
- GitHub Actions CI/CD pipeline (TypeScript check + build on push/PR).
- Vercel security headers (X-Frame-Options, X-XSS-Protection, etc.).
- SECURITY.md vulnerability disclosure timeline (72hr response, 90-day process).
- Page transition animations across all pages (fadeInUp, slideIn, scaleIn).
- Section completion indicators (green/gray dots in dropdown).
- Cover letter auto-fill from Personal Info job title.
- Export loading states with disabled buttons.
- Mobile profile manager in bottom bar.

### Mobile UX

- Swipeable tabs on mobile (swipe left/right between Edit, Preview, Style, ATS, AI).
- Bottom sheet section picker with slide-up sheet, icons, and completion dots.
- Touch-friendly drag handles with larger grip areas on Experience, Education, and Projects.
- Mobile resume preview auto-scales to fit viewport.
- Separate mobile tab row below navbar (full width, evenly spaced, icon+label).
- Responsive sidebar widths (320px md, 400px lg, 460px xl).
- Improved mobile action bar (vertical icon+label layout, larger tap targets).
- All mobile overflow issues fixed (tested on 10 devices from 280px to 1440px).

### Improved

- Skill matching accuracy (prefix stripping, quality scoring).
- Help and Profile button visibility in light mode.
- Page transition animations across all pages.
- Section completion indicators in section dropdown.
- Cover letter auto-fill from Personal Info.
- Export loading states with disabled buttons.
- Mobile profile manager in bottom bar.
- Mobile tab bar text visibility (explicit dark colors on dark navbar).
- HelpTip changed from button to span (fixes hydration nesting error).
- Completion bar thicker on mobile (h-1.5).
- Prev/Next buttons larger (h-10 px-4).
- Bottom bar labels bumped to text-xs.
- Smart Matching accordion open by default.
- AI quick actions use flex-wrap instead of grid-cols-3.

---

## [1.3.0] - 2026-04-11

### Added

- PDF import support via `pdfjs-dist`. Upload existing PDF resumes and extract content automatically.
- Multiple resume profiles. Save up to 10 separate resume versions, each with its own data and template selection.
- Template preview modal with full-size preview before applying a template.
- Drag-and-drop entry reordering within Experience, Education, and Projects sections.

### Improved

- Print CSS polish with `color-adjust: exact`, proper `page-break` rules, and consistent spacing across all templates.

---

## [1.2.0] - 2026-04-11

### Improved

- Modernized help dialog with icons, card-based layout, and gradient header for a cleaner look.
- Modernized onboarding flow with progress bar, achievement badges, and larger action buttons.
- Updated README with expanded Getting Started instructions and inline changelog.

---

## [1.1.0] - 2026-04-11

### Added

- 12 ATS analysis tools: readability score, formatting checker, active voice detector, industry keywords matcher, section completeness, bullet point analyzer, quantification checker, verb strength analyzer, length optimizer, consistency checker, contact info validator, and file format advisor.
- 20 industries with 201 roles and 25-30 keywords each for targeted keyword analysis.
- AI Gap Analysis powered by Groq. Identifies missing skills and experience relative to job descriptions.
- HelpTip tooltips on all major sections to guide users through the resume building process.
- Custom section dropdown navigator for quick access to resume sections.
- Smart Matching suggestion triggered on job title input to recommend relevant keywords.
- Clickable contact links (email, phone, LinkedIn, GitHub) in all 20 templates.

### Improved

- Navbar redesign with better navigation and branding.
- Footer update with improved layout and links.
- Text size adjustments across the application for better readability.

---

## [1.0.0] - 2026-04-10

### Added

- Initial release of ResumeBuildz.
- 20 professionally designed resume templates, each ATS-optimized.
- AI writing assistant powered by Groq for generating summaries, bullet points, and cover letters.
- Cover letter builder with customizable templates.
- ATS score checker with job description keyword matching.
- Multi-format import: DOCX, TXT, HTML, and Markdown.
- Multi-format export: PDF, DOCX, and HTML.
- Dark mode and light mode with system preference detection.
- Progressive Web App (PWA) support for offline use.
- SEO optimization with meta tags and Open Graph support.
- Fully client-side. No data ever leaves the browser.
- localStorage-based data persistence.
- Responsive design for desktop, tablet, and mobile.
