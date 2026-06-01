import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { profilePatchSchema } from '@/lib/accountSchema';

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// GET /api/profile — returns profile merged with user fields (email, name, image)
export async function GET() {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, authUser.id))
    .limit(1);

  if (!row) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  // Activity heartbeat for the inactivity-cleanup cron. Throttled to once/day
  // to avoid write amplification; also clears any pending deletion warning so a
  // returning user is never deleted. Best-effort — never block the response.
  const DAY = 24 * 60 * 60 * 1000;
  const lastSeen = row.lastSeenAt ? new Date(row.lastSeenAt).getTime() : 0;
  if (Date.now() - lastSeen > DAY || row.inactiveWarnedAt) {
    db.update(profiles)
      .set({ lastSeenAt: new Date(), inactiveWarnedAt: null })
      .where(eq(profiles.id, authUser.id))
      .catch(() => {});
  }

  return NextResponse.json({
    id: authUser.id,
    email: authUser.email,
    full_name: authUser.name,
    avatar_url: authUser.image ?? '',
    plan: row.plan,
    ai_rewrites_used: row.aiRewritesUsed,
    ai_rewrites_reset_date: row.aiRewritesResetDate ?? '',
    headline: row.headline,
    current_role: row.currentRole,
    years_experience: row.yearsExperience,
    timezone: row.timezone,
    locale: row.locale,
    target_role: row.targetRole,
    target_seniority: row.targetSeniority,
    target_industry: row.targetIndustry,
    target_locations: row.targetLocations,
    open_to_work: row.openToWork,
    default_template: row.defaultTemplate,
    default_font: row.defaultFont,
    default_accent: row.defaultAccent,
    default_language: row.defaultLanguage as 'en' | 'hi' | null,
    mask_phone_on_share: row.maskPhoneOnShare,
    linkedin_url: row.linkedinUrl,
    github_url: row.githubUrl,
    portfolio_url: row.portfolioUrl,
    notify_ats_tips: row.notifyAtsTips,
    notify_product: row.notifyProduct,
    invoice_email: row.invoiceEmail,
    stripe_customer_id: row.stripeCustomerId,
    role: (row.role ?? 'user') as 'user' | 'admin' | 'superadmin',
  });
}

const ALLOWED_KEYS = [
  'full_name', 'avatar_url', 'headline', 'current_role', 'years_experience',
  'timezone', 'locale', 'target_role', 'target_seniority', 'target_industry',
  'target_locations', 'open_to_work', 'default_template', 'default_font',
  'default_accent', 'default_language', 'mask_phone_on_share', 'linkedin_url',
  'github_url', 'portfolio_url', 'notify_ats_tips', 'notify_product', 'invoice_email',
] as const;

// PATCH /api/profile — update profile fields
export async function PATCH(req: NextRequest) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate + coerce server-side: type-check, length-cap, enum/URL validate.
  // Never trust the client; only validated fields proceed to the DB.
  const parsed = profilePatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid profile fields' }, { status: 400 });
  }
  const body: Record<string, unknown> = parsed.data;

  // Whitelist patch keys and remap to DB column names.
  const dbPatch: Record<string, unknown> = {};
  const keyMap: Record<string, string> = {
    full_name: 'full_name', // handled separately via user table
    avatar_url: 'avatar_url', // handled separately via user table
    headline: 'headline',
    current_role: 'currentRole',
    years_experience: 'yearsExperience',
    timezone: 'timezone',
    locale: 'locale',
    target_role: 'targetRole',
    target_seniority: 'targetSeniority',
    target_industry: 'targetIndustry',
    target_locations: 'targetLocations',
    open_to_work: 'openToWork',
    default_template: 'defaultTemplate',
    default_font: 'defaultFont',
    default_accent: 'defaultAccent',
    default_language: 'defaultLanguage',
    mask_phone_on_share: 'maskPhoneOnShare',
    linkedin_url: 'linkedinUrl',
    github_url: 'githubUrl',
    portfolio_url: 'portfolioUrl',
    notify_ats_tips: 'notifyAtsTips',
    notify_product: 'notifyProduct',
    invoice_email: 'invoiceEmail',
  };

  let updateName: string | undefined;
  let updateImage: string | undefined;
  for (const key of ALLOWED_KEYS) {
    if (key in body) {
      if (key === 'full_name') {
        updateName = body[key] as string;
      } else if (key === 'avatar_url') {
        updateImage = body[key] as string;
      } else {
        dbPatch[keyMap[key]] = body[key];
      }
    }
  }

  if (Object.keys(dbPatch).length > 0) {
    await db.update(profiles).set(dbPatch).where(eq(profiles.id, authUser.id));
  }

  const userPatch: Record<string, string> = {};
  if (updateName !== undefined) userPatch.name = updateName;
  if (updateImage !== undefined) userPatch.image = updateImage;
  if (Object.keys(userPatch).length > 0) {
    await db.update(user).set(userPatch).where(eq(user.id, authUser.id));
  }

  return NextResponse.json({ updated: true });
}
