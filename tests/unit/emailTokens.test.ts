import { describe, it, expect } from 'vitest';
import {
  unsubscribeToken,
  verifyUnsubscribeToken,
  unsubscribeUrl,
} from '@/lib/emailTokens';

describe('unsubscribeToken', () => {
  it('is deterministic for the same user', () => {
    expect(unsubscribeToken('user-1')).toBe(unsubscribeToken('user-1'));
  });

  it('differs between users', () => {
    expect(unsubscribeToken('user-1')).not.toBe(unsubscribeToken('user-2'));
  });

  it('is a 64-char hex digest (HMAC-SHA256)', () => {
    expect(unsubscribeToken('user-1')).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('verifyUnsubscribeToken', () => {
  it('accepts a freshly generated token', () => {
    const t = unsubscribeToken('user-42');
    expect(verifyUnsubscribeToken('user-42', t)).toBe(true);
  });

  it('rejects a token issued for a different user', () => {
    const t = unsubscribeToken('user-42');
    expect(verifyUnsubscribeToken('user-99', t)).toBe(false);
  });

  it('rejects a tampered token of the same length', () => {
    const t = unsubscribeToken('user-42');
    const flipped = (t[0] === 'a' ? 'b' : 'a') + t.slice(1);
    expect(verifyUnsubscribeToken('user-42', flipped)).toBe(false);
  });

  it('rejects empty inputs', () => {
    expect(verifyUnsubscribeToken('', '')).toBe(false);
    expect(verifyUnsubscribeToken('user-42', '')).toBe(false);
    expect(verifyUnsubscribeToken('', unsubscribeToken('user-42'))).toBe(false);
  });

  it('rejects a token of the wrong length without throwing', () => {
    expect(verifyUnsubscribeToken('user-42', 'short')).toBe(false);
  });
});

describe('unsubscribeUrl', () => {
  it('builds an absolute URL with u + t params that re-verify', () => {
    const url = new URL(unsubscribeUrl('user-7'));
    expect(url.origin).toBe('https://resumebuildz.tech');
    expect(url.pathname).toBe('/api/email/unsubscribe');
    const u = url.searchParams.get('u')!;
    const t = url.searchParams.get('t')!;
    expect(u).toBe('user-7');
    expect(verifyUnsubscribeToken(u, t)).toBe(true);
  });

  it('url-encodes the user id', () => {
    const url = new URL(unsubscribeUrl('user/with space'));
    expect(url.searchParams.get('u')).toBe('user/with space');
  });
});
