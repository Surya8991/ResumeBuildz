import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

// ── Better Auth core tables ──────────────────────────────────────────────────
// Column names must match what Better Auth expects exactly.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
}, (t) => ({
  // /api/cron/resume-reminders filters new accounts by creation date.
  createdAtIdx: index('user_created_at_idx').on(t.createdAt),
}));

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// ── App tables ───────────────────────────────────────────────────────────────

export const profiles = pgTable('profiles', {
  id: text('id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  plan: text('plan').notNull().default('free'),
  aiRewritesUsed: integer('ai_rewrites_used').notNull().default(0),
  aiRewritesResetDate: text('ai_rewrites_reset_date'),
  pdfExportsUsed: integer('pdf_exports_used').notNull().default(0),
  pdfExportsResetDate: text('pdf_exports_reset_date'),
  headline: text('headline'),
  currentRole: text('current_role'),
  yearsExperience: integer('years_experience'),
  timezone: text('timezone'),
  locale: text('locale'),
  targetRole: text('target_role'),
  targetSeniority: text('target_seniority'),
  targetIndustry: text('target_industry'),
  targetLocations: text('target_locations'),
  openToWork: boolean('open_to_work'),
  defaultTemplate: text('default_template'),
  defaultFont: text('default_font'),
  defaultAccent: text('default_accent'),
  defaultLanguage: text('default_language'),
  maskPhoneOnShare: boolean('mask_phone_on_share'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  portfolioUrl: text('portfolio_url'),
  notifyAtsTips: boolean('notify_ats_tips'),
  notifyProduct: boolean('notify_product'),
  invoiceEmail: text('invoice_email'),
  stripeCustomerId: text('stripe_customer_id'),
  // Inactivity lifecycle: lastSeenAt is bumped (throttled) on authenticated
  // app load; inactiveWarnedAt is set when a deletion warning is sent and
  // cleared when the user returns. Drives /api/cron/inactive-cleanup.
  lastSeenAt: timestamp('last_seen_at'),
  inactiveWarnedAt: timestamp('inactive_warned_at'),
  // Role-based access control. 'user' is the default for all sign-ups.
  // 'superadmin' is bootstrapped via SUPERADMIN_EMAIL env var on first signup,
  // then additional superadmins/admins are promoted via /admin/users.
  role: text('role').notNull().default('user'),
  // Admin scoping: when set, this user falls under that admin's management scope.
  // Superadmin can assign/unassign; admin can only see users where managedBy = their id.
  managedBy: text('managed_by').references(() => user.id, { onDelete: 'set null' }),
}, (t) => ({
  // /api/cron/inactive-cleanup filters profiles by these timestamps.
  lastSeenAtIdx: index('profiles_last_seen_at_idx').on(t.lastSeenAt),
  inactiveWarnedAtIdx: index('profiles_inactive_warned_at_idx').on(t.inactiveWarnedAt),
  // /api/admin/broadcast and /api/cron/resume-reminders filter by opt-in.
  notifyProductIdx: index('profiles_notify_product_idx').on(t.notifyProduct),
  // Stripe webhook looks up the profile by stripeCustomerId for subscription events.
  stripeCustomerIdIdx: index('profiles_stripe_customer_id_idx').on(t.stripeCustomerId),
  // Admin user list queries filter by managedBy to scope results.
  managedByIdx: index('profiles_managed_by_idx').on(t.managedBy),
}));

// Dormant: the table is kept (so it stays in the DB and can be re-enabled
// later) but NOTHING reads or writes it — resume content lives only in the
// user's browser. There is no cloud-sync route. Do not wire this up without
// updating the Privacy Policy first.
export const resumes = pgTable('resumes', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const waitlist = pgTable('waitlist', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  source: text('source'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Stripe webhook idempotency. Stripe retries on transient failures with the
// same eventId; we record processed events here and short-circuit replays.
// pruned out-of-band — old rows can be deleted once they age past Stripe's
// retry window (~3 days), but we keep them around longer for audit.
export const webhookEvents = pgTable('webhook_events', {
  eventId: text('event_id').primaryKey(),
  eventType: text('event_type').notNull(),
  processedAt: timestamp('processed_at').notNull().defaultNow(),
});
