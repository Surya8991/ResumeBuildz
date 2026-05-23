// Shared bearer-token auth for cron + operator endpoints.
//
// Compares the Authorization header against CRON_SECRET in constant time so the
// check isn't vulnerable to timing analysis. Fails closed: returns a 503 when
// the secret isn't configured, 401 on mismatch, or null when authorized.

import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  try {
    return timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

/**
 * Validate the request's bearer token against CRON_SECRET.
 * @returns null when authorized, otherwise a NextResponse to return as-is.
 */
export function requireCronAuth(req: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 });
  }
  const header = req.headers.get('authorization') ?? '';
  if (!safeEqual(header, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
