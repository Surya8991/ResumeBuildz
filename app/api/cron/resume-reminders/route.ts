// Daily engagement nudge.
//
// Emails users who signed up but never built a resume, reminding them to start.
// Runs daily via Vercel Cron (see vercel.json). To send each user at most once
// without a "reminded" flag column, we target a 24h window of signups that are
// now 2-3 days old — the daily run catches each cohort exactly once.
//
// Respects marketing consent: only users with profiles.notifyProduct = true,
// and every email carries a one-click unsubscribe link.
//
// Security: Bearer CRON_SECRET, fail-closed (matches /api/cron/revalidate-blog).

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, profiles, resumes } from '@/lib/db/schema';
import { and, eq, gte, lt, isNull } from 'drizzle-orm';
import { sendEmail, emailEnabled } from '@/lib/email';
import { resumeReminderEmail } from '@/lib/emails/templates';
import { unsubscribeUrl } from '@/lib/emailTokens';

export const dynamic = 'force-dynamic';

const BATCH = 20;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 });
  }
  if ((request.headers.get('authorization') ?? '') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const windowStart = new Date(now - 3 * DAY_MS); // 3 days ago
  const windowEnd = new Date(now - 2 * DAY_MS); // 2 days ago

  // Users who signed up 2-3 days ago, opted into product updates, and have no
  // saved resume yet (resumes has one row per user keyed by userId).
  const targets = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .leftJoin(resumes, eq(resumes.userId, user.id))
    .where(
      and(
        gte(user.createdAt, windowStart),
        lt(user.createdAt, windowEnd),
        eq(profiles.notifyProduct, true),
        isNull(resumes.userId),
      ),
    );

  if (!emailEnabled()) {
    return NextResponse.json({ ok: true, targets: targets.length, sent: 0, skipped: 'email-not-configured' });
  }

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < targets.length; i += BATCH) {
    const chunk = targets.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      chunk.map((t) => {
        const { subject, html } = resumeReminderEmail({
          name: t.name || '',
          unsubscribeUrl: unsubscribeUrl(t.id),
        });
        return sendEmail({ to: t.email, subject, html });
      }),
    );
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) sent += 1;
      else failed += 1;
    }
  }

  return NextResponse.json({ ok: true, targets: targets.length, sent, failed, at: new Date().toISOString() });
}
