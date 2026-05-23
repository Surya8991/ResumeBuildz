import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { waitlist } from '@/lib/db/schema';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const { email, source } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    await db.insert(waitlist).values({ id: randomUUID(), email, source: source ?? 'pricing' });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'DB error';
    if (/duplicate|unique/i.test(msg)) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
