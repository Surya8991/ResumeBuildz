// Stateless unsubscribe tokens for marketing email.
//
// We derive an HMAC over the user id with BETTER_AUTH_SECRET so unsubscribe
// links need no DB lookup or stored token column — the link itself is the
// proof. Tokens don't expire (an unsubscribe link should always work).

import { createHmac, timingSafeEqual } from 'crypto';
import { SITE_URL } from '@/lib/siteConfig';

function secret(): string {
  return process.env.BETTER_AUTH_SECRET || '';
}

export function unsubscribeToken(userId: string): string {
  return createHmac('sha256', secret()).update(`unsub:${userId}`).digest('hex');
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  if (!userId || !token) return false;
  const expected = unsubscribeToken(userId);
  // Length guard so timingSafeEqual doesn't throw on mismatched buffers.
  if (expected.length !== token.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

/** Absolute unsubscribe URL to embed in marketing email footers. */
export function unsubscribeUrl(userId: string): string {
  const t = unsubscribeToken(userId);
  return `${SITE_URL}/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${t}`;
}
