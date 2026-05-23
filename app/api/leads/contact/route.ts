import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  try {
    await db.insert(contactMessages).values({ id: randomUUID(), name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
