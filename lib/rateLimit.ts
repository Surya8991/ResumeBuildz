// Rate limiter with optional Upstash Redis backing.
//
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to get a *real*
// per-IP/per-route limit shared across every Lambda instance and region.
// Without those env vars the limiter degrades to a per-process Map — that's
// fine for local dev and self-hosted single-node deploys, but on serverless
// it's only a best-effort burst guard (warm-instance scale-out and cold
// starts each carry their own Map).
//
// Algorithm (both backings): fixed-window counter keyed by "route:identifier".
// Atomic on Upstash via INCR + first-INCR sets EXPIRE; non-atomic in memory
// but fine because no other process competes for the key in that case.

import { Redis } from '@upstash/redis';

interface Bucket { resetAt: number; count: number }

const buckets = new Map<string, Bucket>();

let _redis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) { _redis = null; return null; }
  try {
    _redis = new Redis({ url, token });
    return _redis;
  } catch (e) {
    console.error('[rateLimit] Upstash init failed, falling back to in-memory:', e);
    _redis = null;
    return null;
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

/**
 * Check-and-increment for `key`. Returns whether the call is allowed plus
 * how many slots remain in the current window.
 *
 * When Upstash is configured this is atomic and globally consistent. Without
 * it, the counter is per-process — multiple Lambda instances will each see
 * their own counter, so the effective cap is `limit × instanceCount`.
 *
 * Always awaitable: the in-memory fast path resolves synchronously.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const redis = getRedis();
  if (redis) {
    try {
      const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
      // INCR returns the new value; if it's 1 we just created the key, so
      // stamp the TTL. PEXPIRE only-if-no-ttl would also work but EXPIRE on
      // first-incr is the canonical Redis rate-limit recipe.
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, windowSec);
      const ttl = await redis.ttl(key);
      const retryAfterSec = ttl > 0 ? ttl : windowSec;
      if (count > limit) {
        return { allowed: false, remaining: 0, retryAfterSec };
      }
      return { allowed: true, remaining: Math.max(0, limit - count), retryAfterSec: 0 };
    } catch (e) {
      // Upstash blip: do NOT lock everyone out — fall through to in-memory
      // burst guard. Logged so the operator notices a sustained outage.
      console.error('[rateLimit] Upstash request failed, using in-memory fallback:', e);
    }
  }

  return rateLimitInMemory(key, limit, windowMs);
}

function rateLimitInMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt <= now) {
    buckets.set(key, { resetAt: now + windowMs, count: 1 });
    // Opportunistic cleanup — drop stale buckets so the Map doesn't grow
    // unboundedly over the lifetime of the process.
    if (buckets.size > 5_000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (b.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }

  b.count += 1;
  return { allowed: true, remaining: limit - b.count, retryAfterSec: 0 };
}

/** Extract a best-effort client identifier from a request.
 *
 * IMPORTANT: assumes deployment on Vercel (or any proxy that overwrites
 * `x-real-ip` and strips untrusted `x-forwarded-for` entries). On a raw
 * origin without such a proxy, clients can spoof both headers to bypass
 * rate limits — don't use this verbatim for self-hosted deploys.
 *
 * Preference order (stricter → looser):
 *   1. `x-real-ip` — Vercel sets this directly from the edge, clients
 *      cannot spoof it.
 *   2. `x-forwarded-for` first hop — the leftmost entry is the originating
 *      client IP when the proxy is trusted. Fallback only.
 *   3. `'unknown'` — same bucket for all unidentifiable callers, which
 *      intentionally makes them share a quota.
 */
export function clientId(req: Request): string {
  const h = req.headers;
  const real = h.get('x-real-ip');
  if (real && real.trim()) return real.trim();
  const xff = h.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return 'unknown';
}
