# Security Policy

ResumeBuildz takes security seriously. This document describes the security architecture, data handling practices, and vulnerability reporting process.

## Architecture Overview

ResumeBuildz is a **hybrid application**: the builder UI runs entirely in the browser, but opt-in features (auth, billing, share invites) use server-side infrastructure.

| Layer | Technology | What it handles |
|---|---|---|
| Frontend | Next.js 16 (App Router) | Builder UI, ATS tools, templates |
| Auth | Better Auth | Google OAuth, email/password |
| Database | Neon PostgreSQL + Drizzle ORM | User accounts, profile metadata, usage counters, Stripe webhook idempotency |
| Storage | Cloudflare R2 | Avatar uploads (with cleanup on overwrite + account delete) |
| Billing | Stripe | Subscription management (signature-verified webhooks, idempotent handlers) |
| Email | Resend | Password reset, share invite emails |
| Rate limiting | Upstash Redis (optional) | Per-IP limits on public write endpoints; falls back to in-memory burst guard |
| API Routes | Next.js Route Handlers | Usage counting, account deletion (GDPR), profile management |

## Data Storage

### Resume content (everyone)
- Resume content, template, and preferences live in **`localStorage`** — they never leave the browser, signed-in or not. The app never syncs resumes to the server.
- Auto-saves debounce at 1 second; `beforeunload` / `pagehide` flush any pending writes.
- Multiple resume profiles are stored as separate localStorage entries; the user picks the active one via the profile manager.

### Server-side data (signed-in users only)
- Better Auth user, session, account, verification tables: required to log you in.
- `profiles` table: plan tier, usage counters (AI rewrites, PDF exports), Stripe customer ID, account preferences. Does **not** contain resume content.
- `webhook_events` table: Stripe event IDs for idempotency, no PII.
- All data access is mediated through authenticated API routes — the client never connects to the database directly.
- Server-side session verification via `auth.api.getSession()` in every Route Handler and Server Action.

### Groq API Keys (AI assist)
- Users supply their own Groq API key for the AI writing assistant.
- Keys are stored in **`sessionStorage`** — scoped to the current browser tab and automatically cleared when the tab closes, limiting the exposure window compared to `localStorage`.
- API calls go **directly from the browser to Groq**. The key never passes through any ResumeBuildz server.

## Authentication

- **Google OAuth** and **email/password** are supported via [Better Auth](https://www.better-auth.com/).
- Session cookies are managed by Better Auth with cookie caching (5-minute maxAge).
- Server-side auth is verified via `auth.api.getSession({ headers })` in every Route Handler and Server Action — never trusted from request body or headers alone.
- The checkout Route Handler extracts `userId` from the server-side session cookie; it is not accepted from the request body to prevent privilege escalation.

## API Security

### Rate Limiting
- Public write endpoints: share invite (10/h/IP), waitlist (10/h/IP), contact (5/h/IP), checkout (10/h/IP).
- Backed by Upstash Redis when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set — atomic `INCR` + first-write `EXPIRE` shared across every Lambda instance and region. Without those env vars the limiter degrades to a per-process in-memory burst guard (fine for dev/self-host; trivial to bypass on Vercel because each Lambda has its own counter).
- Falls through to the in-memory guard on Upstash request failure so a Redis outage doesn't lock everyone out.
- Same-origin enforcement: `Origin` header is validated against `SITE_URL` on all write endpoints.

### Input Validation
- All user-facing inputs are validated with `lib/validation.ts` helpers.
- Free-text fields are sanitized with `stripControlChars` to remove C0 control characters and zero-width Unicode that can break ATS parsers.
- HTML export output is escaped with `escapeHtml` before rendering in email bodies or HTML files.

### Stripe Webhooks
- All incoming Stripe webhook payloads are verified with `stripe.webhooks.constructEvent` using `STRIPE_WEBHOOK_SECRET` before any database writes.
- Unverified payloads return 400 immediately.
- **Idempotency:** every processed `event.id` is recorded in the `webhook_events` table via `INSERT ... ON CONFLICT DO NOTHING`. A Stripe replay short-circuits to `{ received: true, replay: true }` before any handler runs, so a retried event cannot double-apply a state change.

## Security Measures

### XSS Prevention
- HTML export output is sanitized before writing to files.
- No `dangerouslySetInnerHTML` with unsanitized user input.
- Content Security Policy, HSTS, X-Frame-Options, and Referrer-Policy headers are set via Next.js middleware.

### File Upload Limits
- Resume import: maximum 10 MB (DOCX, TXT, HTML, MD, PDF).
- Profile photo: maximum 2 MB.
- File type validation runs before any processing.
- Files are processed client-side only and are never transmitted to ResumeBuildz servers.

### CSS Injection Prevention
- Font selections are restricted to a whitelist of safe fonts.
- Configurable numeric values (font size, margins) are clamped to safe ranges.

## GDPR Compliance

- **Export data**: `useAuth.exportUserData()` downloads a JSON bundle of account details and localStorage resume data.
- **Delete account**: calls the `/api/account/delete` Route Handler which removes the `profiles` row and then deletes the Better Auth user record.
- Deleted users' data is removed from the database immediately.

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly.

### How to Report

Send an email to: **Suryaraj8147@gmail.com**

Include:
- A description of the vulnerability.
- Steps to reproduce.
- The potential impact.
- Any suggested fixes (optional but appreciated).

### What to Expect

- Acknowledgment within 48 hours.
- Investigation and status updates.
- Credit in the fix commit unless you prefer to remain anonymous.

## Responsible Disclosure

- Do not publicly disclose before a fix is deployed.
- Do not exploit beyond what is necessary to demonstrate the issue.
- Act in good faith to avoid data destruction or service disruption.

We will not pursue legal action against researchers who follow this policy.

## Scope

**In scope:**
- Auth bypass or privilege escalation (e.g. upgrading account plan without payment)
- XSS in resume rendering, PDF export, or HTML export
- Data leakage through exported files or share links
- Stripe webhook bypass or billing manipulation
- Database access control bypass
- Groq API key exfiltration from sessionStorage
- File import parsing vulnerabilities (DOCX, PDF, HTML, MD, TXT)

**Out of scope:**
- Vulnerabilities in third-party services (Groq, Stripe, Neon, Cloudflare infrastructure)
- Issues requiring physical device access
- Browser-specific bugs not caused by ResumeBuildz code
- Social engineering attacks

## Disclosure Timeline

| Day | Action |
|---|---|
| 0 | Vulnerability report received |
| 1–2 | Acknowledgment sent |
| 7 | Initial assessment and severity classification |
| 30 | Fix developed and tested |
| 45 | Fix deployed to production |
| 90 | Public disclosure (coordinated with reporter) |

---

Last updated: 2026-05-23
