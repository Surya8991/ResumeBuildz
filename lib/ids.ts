// Collision-resistant ID generator.
//
// Prefers the Web Crypto `randomUUID()` (cryptographically random, 128 bits
// of entropy, collision-free for any realistic list size). Falls back to a
// timestamp + random-suffix scheme only in ancient browsers without
// crypto.randomUUID (effectively Safari < 15.4 / Chrome < 92). The fallback
// still uses crypto.getRandomValues when available for 96 bits of entropy.
//
// Why this exists: `Math.random().toString(36).substring(2, 9)` gives only
// ~9 characters of base-36 entropy (~42 bits), which collides in birthday
// bound at ~65k items. With crypto.randomUUID we get effectively unique
// ids even for a user saving 10^9 resume items.

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    let out = '';
    for (const b of bytes) out += b.toString(16).padStart(2, '0');
    return out;
  }
  // Last-resort fallback — still better than plain Math.random alone because
  // we incorporate Date.now() for monotonic uniqueness within a single tab.
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}
