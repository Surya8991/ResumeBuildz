// Best-effort burst guard — NOT a real rate limiter.
//
// On Vercel serverless each Lambda instance has its own Map: warm instances,
// cold-starts, and concurrent invocations all keep separate counters. An
// attacker spreading requests across IPs or hitting during scale-out can
// trivially bypass the cap. Treat this as a cheap shield against accidental
// floods from a single client, nothing more. For real per-user/IP limiting,
// back this with Upstash, Redis, or Vercel KV.
//
// Algorithm: fixed-window counter keyed by "route:identifier", per process.

interface Bucket { resetAt: number; count: number }

const buckets = new Map<string, Bucket>();

/**
 * Check-and-increment against the in-process Map. Returns
 * { allowed, remaining, retryAfterSec }. Counters are per-instance and
 * per-process — not shared across Lambda invocations or deployments.
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
