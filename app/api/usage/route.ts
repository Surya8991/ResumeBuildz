// Usage tracking and rate limiting.
// GET  ?feature=ai&dryRun=true  → check remaining without incrementing
// POST { feature: 'ai' }        → increment and return new remaining

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

type Feature = 'ai' | 'pdf';

const FREE_LIMITS: Record<Feature, number> = { ai: 1, pdf: 3 };
const STARTER_LIMITS: Record<Feature, number> = { ai: 5, pdf: 10 };
const UNLIMITED = 9999;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function limitForPlan(plan: string, feature: Feature): number {
  if (['pro', 'team', 'lifetime'].includes(plan)) return UNLIMITED;
  if (plan === 'starter') return STARTER_LIMITS[feature];
  return FREE_LIMITS[feature];
}

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ allowed: false, remaining: 0 });

  const feature = (req.nextUrl.searchParams.get('feature') ?? 'ai') as Feature;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (!profile) return NextResponse.json({ allowed: false, remaining: 0 });

  // Admin and superadmin always have unlimited quota — bypass plan checks entirely.
  if (profile.role === 'admin' || profile.role === 'superadmin') {
    return NextResponse.json({ allowed: true, remaining: UNLIMITED });
  }

  const limit = limitForPlan(profile.plan, feature);
  if (limit === UNLIMITED) return NextResponse.json({ allowed: true, remaining: UNLIMITED });

  const usedKey = feature === 'ai' ? 'aiRewritesUsed' : 'pdfExportsUsed';
  const dateKey = feature === 'ai' ? 'aiRewritesResetDate' : 'pdfExportsResetDate';
  const used = profile[dateKey] === today() ? (profile[usedKey] ?? 0) : 0;
  const remaining = Math.max(0, limit - used);

  return NextResponse.json({ allowed: remaining > 0, remaining });
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ allowed: false, remaining: 0 }, { status: 401 });

  let body: { feature?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const feature = body?.feature as Feature | undefined;
  if (!feature || !['ai', 'pdf'].includes(feature)) {
    return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
  }

  const [profile] = await db
    .select({ plan: profiles.plan, role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (!profile) return NextResponse.json({ allowed: false, remaining: 0 }, { status: 404 });

  // Admin and superadmin always have unlimited quota — no counter increments.
  if (profile.role === 'admin' || profile.role === 'superadmin') {
    return NextResponse.json({ allowed: true, remaining: UNLIMITED });
  }

  const limit = limitForPlan(profile.plan, feature);
  if (limit === UNLIMITED) return NextResponse.json({ allowed: true, remaining: UNLIMITED });

  const usedKey = feature === 'ai' ? 'aiRewritesUsed' : 'pdfExportsUsed';
  const dateKey = feature === 'ai' ? 'aiRewritesResetDate' : 'pdfExportsResetDate';
  const usedCol = feature === 'ai' ? profiles.aiRewritesUsed : profiles.pdfExportsUsed;
  const dateCol = feature === 'ai' ? profiles.aiRewritesResetDate : profiles.pdfExportsResetDate;
  const t = today();

  // Atomic increment: a single conditional UPDATE so concurrent requests can't
  // both read the same count and double-spend the quota. Reset to 1 when the
  // day rolled over, otherwise +1 — but only while still under the limit.
  const updated = await db
    .update(profiles)
    .set({
      [usedKey]: sql`CASE WHEN ${dateCol} = ${t} THEN COALESCE(${usedCol}, 0) + 1 ELSE 1 END`,
      [dateKey]: t,
    })
    .where(
      and(
        eq(profiles.id, user.id),
        sql`(${dateCol} IS DISTINCT FROM ${t} OR COALESCE(${usedCol}, 0) < ${limit})`,
      ),
    )
    .returning({ used: usedCol });

  if (updated.length === 0) {
    // The guard failed → already at the limit for today.
    return NextResponse.json({ allowed: false, remaining: 0 });
  }

  const newUsed = updated[0].used ?? 1;
  return NextResponse.json({ allowed: true, used: newUsed, remaining: Math.max(0, limit - newUsed) });
}
