// Inactive-account lifecycle + token hygiene.
//
// Runs daily via Vercel Cron (see vercel.json). Three steps:
//   1. Purge expired session + verification rows (spent tokens, not user data —
//      no email, the user's account is untouched).
//   2. WARN users inactive > 6 months: email them that their account will be
//      deleted in GRACE days unless they log in, and stamp inactiveWarnedAt.
//   3. DELETE users warned > GRACE days ago who are still inactive: email a
//      final notice, then remove the user (cascade drops session/account/profile).
//
// Returning users are spared automatically: /api/profile bumps lastSeenAt and
// clears inactiveWarnedAt on any authenticated load.
//
// Security: Bearer CRON_SECRET, fail-closed (requireCronAuth).

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, profiles, session, verification } from '@/lib/db/schema';
import { and, eq, lt, isNull, isNotNull } from 'drizzle-orm';
import { sendEmail, emailEnabled } from '@/lib/email';
import { inactiveWarningEmail, inactiveDeletedEmail } from '@/lib/emails/templates';
import { requireCronAuth } from '@/lib/apiAuth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;
const INACTIVE_MS = 183 * DAY_MS; // ~6 months
const GRACE_MS = 14 * DAY_MS; // warning -> deletion grace period
const BATCH = 20;

export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  const now = Date.now();
  const nowDate = new Date(now);

  // ── 1. Purge expired tokens (no email; these are spent auth artifacts) ──────
  let purgedSessions = 0;
  let purgedVerifications = 0;
  try {
    const s = await db.delete(session).where(lt(session.expiresAt, nowDate)).returning({ id: session.id });
    purgedSessions = s.length;
    const v = await db.delete(verification).where(lt(verification.expiresAt, nowDate)).returning({ id: verification.id });
    purgedVerifications = v.length;
  } catch (e) {
    console.error('[inactive-cleanup] token purge failed:', e);
  }

  // Account warn/delete needs email to notify the user first. If email is not
  // configured, skip both (but token purge above still ran).
  if (!emailEnabled()) {
    return NextResponse.json({ ok: true, purgedSessions, purgedVerifications, warned: 0, deleted: 0, skipped: 'email-not-configured' });
  }

  const inactiveCutoff = new Date(now - INACTIVE_MS);
  const graceCutoff = new Date(now - GRACE_MS);

  // ── 2. Warn users inactive > 6 months and not already warned ────────────────
  const toWarn = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(and(lt(profiles.lastSeenAt, inactiveCutoff), isNull(profiles.inactiveWarnedAt)));

  const deleteDate = new Date(now + GRACE_MS).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let warned = 0;
  for (let i = 0; i < toWarn.length; i += BATCH) {
    const chunk = toWarn.slice(i, i + BATCH);
    await Promise.allSettled(
      chunk.map(async (u) => {
        const { subject, html } = inactiveWarningEmail({ name: u.name || '', deleteDate });
        const sent = await sendEmail({ to: u.email, subject, html });
        // Only stamp the warning if the email actually went out, so we never
        // delete someone who was never warned.
        if (sent) {
          await db.update(profiles).set({ inactiveWarnedAt: nowDate }).where(eq(profiles.id, u.id));
          warned += 1;
        }
      }),
    );
  }

  // ── 3. Delete users warned > GRACE ago who are still inactive ───────────────
  const toDelete = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(
      and(
        isNotNull(profiles.inactiveWarnedAt),
        lt(profiles.inactiveWarnedAt, graceCutoff),
        lt(profiles.lastSeenAt, inactiveCutoff),
      ),
    );

  let deleted = 0;
  for (let i = 0; i < toDelete.length; i += BATCH) {
    const chunk = toDelete.slice(i, i + BATCH);
    await Promise.allSettled(
      chunk.map(async (u) => {
        // Notify before deleting (we need the address). Best-effort.
        const { subject, html } = inactiveDeletedEmail(u.name || '');
        await sendEmail({ to: u.email, subject, html });
        // Cascade removes session, account, and profiles rows.
        await db.delete(user).where(eq(user.id, u.id));
        deleted += 1;
      }),
    );
  }

  return NextResponse.json({
    ok: true,
    purgedSessions,
    purgedVerifications,
    warned,
    deleted,
    at: nowDate.toISOString(),
  });
}
