import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
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
});

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
});

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
