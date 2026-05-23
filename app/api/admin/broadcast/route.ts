// Product-update broadcast.
//
// Operator-only: gated by a CRON_SECRET bearer (the same secret used for cron
// routes). Sends a product-update email to every user who has opted into
// product updates (profiles.notifyProduct = true), each with a personal
// one-click unsubscribe link.
//
// POST body:
//   { heading: string, bodyHtml: string, cta?: { label, url }, dryRun?: boolean }
//   - bodyHtml is operator-authored HTML, embedded as-is (trusted input).
//   - dryRun: true returns the recipient count without sending.
//
// Trigger:
//   curl -X POST -H "Authorization: Bearer <CRON_SECRET>" \
//     -H "Content-Type: application/json" \
//     -d '{"heading":"New templates","bodyHtml":"<p>...</p>"}' \
//     https://resumebuildz.tech/api/admin/broadcast

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, emailEnabled } from '@/lib/email';
import { productUpdateEmail } from '@/lib/emails/templates';
import { unsubscribeUrl } from '@/lib/emailTokens';

export const dynamic = 'force-dynamic';

const BATCH = 20; // concurrent sends per chunk — friendly to Resend rate limits.

interface BroadcastBody {
  heading?: string;
  bodyHtml?: string;
  cta?: { label?: string; url?: string };
  dryRun?: boolean;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 });
  }
  if ((req.headers.get('authorization') ?? '') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: BroadcastBody;
  try {
    body = (await req.json()) as BroadcastBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const heading = String(body.heading ?? '').trim();
  const bodyHtml = String(body.bodyHtml ?? '').trim();
  if (!heading || !bodyHtml) {
    return NextResponse.json({ error: 'heading and bodyHtml are required.' }, { status: 400 });
  }
  const cta =
    body.cta?.label && body.cta?.url ? { label: body.cta.label, url: body.cta.url } : undefined;

  // Recipients: users opted into product updates.
  const recipients = await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(eq(profiles.notifyProduct, true));

  if (body.dryRun) {
    return NextResponse.json({ dryRun: true, recipients: recipients.length });
  }
  if (!emailEnabled()) {
    return NextResponse.json({ error: 'Email is not configured (RESEND_API_KEY).' }, { status: 503 });
  }

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const chunk = recipients.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      chunk.map((r) => {
        const { subject, html } = productUpdateEmail({
          name: r.name || '',
          heading,
          bodyHtml,
          cta,
          unsubscribeUrl: unsubscribeUrl(r.id),
        });
        return sendEmail({ to: r.email, subject, html });
      }),
    );
    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) sent += 1;
      else failed += 1;
    }
  }

  return NextResponse.json({ ok: true, recipients: recipients.length, sent, failed });
}
