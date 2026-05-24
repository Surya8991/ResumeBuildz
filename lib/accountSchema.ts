// Zod validators for every /account form. Each schema strips unknown
// fields (.strict() is too aggressive since we merge partial updates)
// and caps every string so a compromised or buggy client cannot push
// oversized payloads into the database. The DB has matching check
// constraints as a second line of defence.

import { z } from 'zod';

const urlSchema = z
  .string()
  .trim()
  .max(240)
  .refine(
    (v) => v === '' || /^https:\/\//i.test(v),
    'URL must start with https://',
  )
  .refine(
    (v) => !/^javascript:/i.test(v),
    'Invalid URL scheme',
  );

export const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(80),
  headline: z.string().trim().max(120).optional().default(''),
  current_role: z.string().trim().max(120).optional().default(''),
  years_experience: z.coerce
    .number()
    .int()
    .min(0)
    .max(60)
    .optional()
    .nullable(),
  timezone: z.string().trim().max(64).optional().default(''),
  locale: z.string().trim().max(16).optional().default('en-US'),
});

export const jobSearchSchema = z.object({
  target_role: z.string().trim().max(120).optional().default(''),
  target_seniority: z
    .enum([
      'intern',
      'junior',
      'mid',
      'senior',
      'staff',
      'principal',
      'director',
      'vp',
      'c-suite',
    ])
    .optional()
    .nullable(),
  target_industry: z.string().trim().max(120).optional().default(''),
  target_locations: z.string().trim().max(240).optional().default(''),
  open_to_work: z.boolean().optional().default(false),
});

export const defaultsSchema = z.object({
  default_template: z.string().trim().max(40).optional().default(''),
  default_font: z.string().trim().max(40).optional().default(''),
  default_accent: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex colour like #4F46E5')
    .optional()
    .default('#4F46E5'),
  default_language: z.enum(['en', 'hi']).optional().default('en'),
  mask_phone_on_share: z.boolean().optional().default(false),
});

export const linksSchema = z.object({
  linkedin_url: urlSchema.optional().default(''),
  github_url: urlSchema.optional().default(''),
  portfolio_url: urlSchema.optional().default(''),
});

export const notificationsSchema = z.object({
  notify_ats_tips: z.boolean().optional().default(false),
  notify_product: z.boolean().optional().default(true),
});

export const passwordSchema = z
  .object({
    // Better Auth's /change-password verifies the current password, so it must
    // be collected and sent — an empty value always fails with INVALID_PASSWORD.
    current_password: z.string().min(1, 'Enter your current password'),
    new_password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .max(72, 'Maximum 72 characters'),
    confirm_password: z.string(),
  })
  .refine((v) => v.new_password === v.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export const billingSchema = z.object({
  invoice_email: z
    .string()
    .trim()
    .email('Must be a valid email')
    .max(254)
    .optional()
    .or(z.literal('')),
});

// Server-side validator for PATCH /api/profile, which accepts an arbitrary
// subset of fields. Every field is optional (.partial()) but each is still
// type-checked, length-capped, and enum/URL-validated so the client cannot
// push oversized, wrong-typed, or unsafe values straight into the DB.
export const profilePatchSchema = z
  .object({
    full_name: z.string().trim().min(1).max(80),
    avatar_url: urlSchema,
    headline: z.string().trim().max(120),
    current_role: z.string().trim().max(120),
    years_experience: z.coerce.number().int().min(0).max(60).nullable(),
    timezone: z.string().trim().max(64),
    locale: z.string().trim().max(16),
    target_role: z.string().trim().max(120),
    target_seniority: z
      .enum(['intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'director', 'vp', 'c-suite'])
      .nullable(),
    target_industry: z.string().trim().max(120),
    target_locations: z.string().trim().max(240),
    open_to_work: z.boolean(),
    default_template: z.string().trim().max(40),
    default_font: z.string().trim().max(40),
    default_accent: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex colour like #4F46E5'),
    default_language: z.enum(['en', 'hi']),
    mask_phone_on_share: z.boolean(),
    linkedin_url: urlSchema,
    github_url: urlSchema,
    portfolio_url: urlSchema,
    notify_ats_tips: z.boolean(),
    notify_product: z.boolean(),
    invoice_email: z.string().trim().email().max(254).or(z.literal('')),
  })
  .partial();

export type ProfileInput = z.infer<typeof profileSchema>;
export type JobSearchInput = z.infer<typeof jobSearchSchema>;
export type DefaultsInput = z.infer<typeof defaultsSchema>;
export type LinksInput = z.infer<typeof linksSchema>;
export type NotificationsInput = z.infer<typeof notificationsSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type BillingInput = z.infer<typeof billingSchema>;
