// In-memory rate limiter. Fine for a single Vercel/Node instance; for a
// horizontally-scaled deployment swap the Map for Redis/Upstash.
//
// Algorithm: fixed-window counter keyed by "route:identifier". Resets on a
// rolling window so a burst at t=59s + another burst at t=60s cannot double
// the limit.

interface Bucket { resetAt: number; count: number }

const buckets = new Map<string, Bucket>();

/**
 * Check-and-increment. Returns { allowed, remaining, retryAfterSec }.
 * Safe to call from every request without awaiting cleanup.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterSec: number } {
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

/** Extract a best-effort client identifier from a request. */
export function clientId(req: Request): string {
  const h = req.headers;
  // Vercel / most proxies set x-forwarded-for. Take the first hop (closest
  // to the actual client) — anything else can be spoofed by the client.
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || 'unknown';
}
