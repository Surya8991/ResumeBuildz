# Database Schema Reference

> **Migration note (May 2026):** The app was migrated from Supabase to
> Better Auth + Drizzle ORM + Neon PostgreSQL. This file previously
> contained Supabase SQL migrations. The canonical schema is now defined
> in TypeScript at [`lib/db/schema.ts`](../lib/db/schema.ts).

## Tables

| Table | Owner | Purpose |
|---|---|---|
| `user` | Better Auth | Core user record (id, name, email, image, emailVerified, createdAt, updatedAt) |
| `session` | Better Auth | Active sessions (token, expiresAt, ipAddress, userAgent) |
| `account` | Better Auth | OAuth provider links (providerId, accountId, tokens) |
| `verification` | Better Auth | Email verification / password reset tokens |
| `profiles` | App | Extended user data (plan, usage counters, preferences, Stripe ID) |
| `resumes` | App | Cloud-synced resume JSON (one per user, upsert on conflict) |
| `waitlist` | App | Pre-launch email capture |
| `contact_messages` | App | Contact form submissions |

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
