// Production-safe logger.
//
// In dev: pass-through to console.
// In prod: silence .info / .warn entirely; keep .error but strip potentially
// sensitive objects (auth tokens, full user rows) from the printed args.
//
// This is a defense-in-depth measure: any `console.warn('Profile fetch failed:',
// user)` that slipped through code review stops leaking the user object to
// anyone with DevTools open in production.

const IS_PROD = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

/** Strip sensitive-looking keys from any object we're about to log. */
function scrub(arg: unknown): unknown {
  if (!arg || typeof arg !== 'object') return arg;
  if (Array.isArray(arg)) return arg.map(scrub);
  const SENSITIVE = /^(password|token|secret|access_token|refresh_token|api_?key|auth|cookie|session)$/i;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(arg as Record<string, unknown>)) {
    if (SENSITIVE.test(k)) out[k] = '[redacted]';
    else out[k] = typeof v === 'object' ? scrub(v) : v;
  }
  return out;
}

export const logger = {
  info: (...args: unknown[]) => {
    if (!IS_PROD) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (!IS_PROD) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (IS_PROD) console.error(...args.map(scrub));
    else console.error(...args);
  },
};
