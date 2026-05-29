# Database Schema Reference

> The canonical schema is defined in TypeScript at [`lib/db/schema.ts`](../lib/db/schema.ts).
> This file is a human-readable summary; it can drift, so trust the source. (May 2026 the
> codebase migrated off Supabase to Better Auth + Drizzle + Neon — earlier revisions of
> this file documented the Supabase migrations; they are gone.)

## Tables

| Table | Owner | Purpose |
|---|---|---|
| `user` | Better Auth | Core user record (id, name, email, image, emailVerified, createdAt, updatedAt). Indexed on `createdAt` for the resume-reminders cron. |
| `session` | Better Auth | Active sessions (token, expiresAt, ipAddress, userAgent) |
| `account` | Better Auth | OAuth provider links (providerId, accountId, tokens) |
| `verification` | Better Auth | Email verification / password reset tokens |
| `profiles` | App | Extended user data (plan, usage counters, preferences, Stripe ID, inactivity timestamps). Indexed on `lastSeenAt`, `inactiveWarnedAt`, `notifyProduct`, and `stripeCustomerId` for cron queries + the Stripe webhook lookup. |
| `resumes` | App | **Dormant** — kept in the schema but unread/unwritten since v1.28.0. Cloud sync was removed; resumes live only in the browser. |
| `waitlist` | App | Pre-launch email capture |
| `contact_messages` | App | Contact form submissions |
| `webhook_events` | App | Stripe webhook idempotency. Stores every processed `event.id` so retries short-circuit before mutating state. |

## Running migrations

```bash
# Generate a migration from schema changes
npm run db:generate

# Apply pending migrations to Neon
npm run db:migrate

# Browse data with Drizzle Studio
npm run db:studio
```

## Profile columns

The `profiles` table has 28 columns covering:
- **Plan & billing:** `plan`, `stripeCustomerId`
- **Usage counters:** `aiRewritesUsed`, `aiRewritesResetDate`, `pdfExportsUsed`, `pdfExportsResetDate`
- **Personal:** `headline`, `currentRole`, `yearsExperience`, `timezone`, `locale`
- **Job search:** `targetRole`, `targetSeniority`, `targetIndustry`, `targetLocations`, `openToWork`
- **Builder defaults:** `defaultTemplate`, `defaultFont`, `defaultAccent`, `defaultLanguage`, `maskPhoneOnShare`
- **Links:** `linkedinUrl`, `githubUrl`, `portfolioUrl`
- **Notifications:** `notifyAtsTips`, `notifyProduct`
- **Billing:** `invoiceEmail`

See [`lib/db/schema.ts`](../lib/db/schema.ts) for the full column definitions and types.
