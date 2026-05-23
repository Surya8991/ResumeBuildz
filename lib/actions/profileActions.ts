'use server';

import { z } from 'zod';
import { actionWithAuth } from '@/lib/safe-action';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const ProfileSchema = z.object({
  full_name: z.string().max(100).optional(),
  headline: z.string().max(200).optional(),
  current_role: z.string().max(100).optional(),
  target_role: z.string().max(100).optional(),
  target_industry: z.string().max(100).optional(),
  target_locations: z.string().max(200).optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  open_to_work: z.boolean().optional(),
  default_template: z.string().max(50).optional(),
  default_font: z.string().max(50).optional(),
  default_accent: z.string().max(20).optional(),
  mask_phone_on_share: z.boolean().optional(),
  notify_ats_tips: z.boolean().optional(),
  notify_product: z.boolean().optional(),
  years_experience: z.number().int().min(0).max(60).nullable().optional(),
});

export const updateProfileAction = actionWithAuth
  .schema(ProfileSchema)
  .action(async ({ parsedInput, ctx: { userId, db } }) => {
    const keyMap: Record<string, string> = {
      headline: 'headline',
      current_role: 'currentRole',
      target_role: 'targetRole',
      target_industry: 'targetIndustry',
      target_locations: 'targetLocations',
      linkedin_url: 'linkedinUrl',
      github_url: 'githubUrl',
      portfolio_url: 'portfolioUrl',
      open_to_work: 'openToWork',
      default_template: 'defaultTemplate',
      default_font: 'defaultFont',
      default_accent: 'defaultAccent',
      mask_phone_on_share: 'maskPhoneOnShare',
      notify_ats_tips: 'notifyAtsTips',
      notify_product: 'notifyProduct',
      years_experience: 'yearsExperience',
    };

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsedInput)) {
      if (v !== undefined && k !== 'full_name') {
        payload[keyMap[k] ?? k] = v;
      }
    }

    if (Object.keys(payload).length === 0) return { updated: false };

    await db.update(profiles).set(payload).where(eq(profiles.id, userId));
    return { updated: true };
  });
