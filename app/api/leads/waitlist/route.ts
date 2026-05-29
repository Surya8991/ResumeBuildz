import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { rateLimit, clientId } from '@/lib/rateLimit';
import { randomUUID } from 'crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { email: 254, source: 60 } as const;

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`waitlist:${clientId(req)}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const body = (raw ?? {}) as Record<string, unknown>;

  const email = String(body.email ?? '').trim().toLowerCase().slice(0, LIMITS.email);
  const source = String(body.source ?? 'pricing').trim().slice(0, LIMITS.source) || 'pricing';

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    await db.insert(waitlist).values({ id: randomUUID(), email, source });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'DB error';
    // Treat a duplicate email as success — the visitor is already on the list.
    if (/duplicate|unique/i.test(msg)) return NextResponse.json({ ok: true });
    // Don't leak DB/driver internals to the client; log server-side only.
    console.error('[leads/waitlist] insert failed:', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
