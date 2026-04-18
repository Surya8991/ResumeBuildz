// Typed, fail-fast env var accessors.
//
// Each getter accesses `process.env.NEXT_PUBLIC_*` as a LITERAL property so
// Next.js can inline the value into the client bundle at build time. Dynamic
// access via `process.env[name]` is NOT inlined — it returns undefined in the
// browser because browsers have no real `process.env` object. That's why the
// helpers below take the already-read value as a parameter; the literal
// `process.env.X` read stays at the call site.
//
// All accessors are lazy (getter-based). Importing this module never throws —
// only touching a required property does, and only at the moment of use.
// This keeps `next build` passing when the build environment lacks non-build
// secrets (e.g., SUPABASE_SERVICE_ROLE_KEY isn't needed to compile).

function softValue(name: string, v: string | undefined): string {
  if (!v || v.trim() === '') {
    if (typeof console !== 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(`[env] ${name} is not set — auth features will not work until you add it to .env.local`);
    }
    return '';
  }
  return v;
}

function optionalValue(v: string | undefined): string | undefined {
  return v && v.trim() !== '' ? v : undefined;
}

function requiredValue(name: string, v: string | undefined): string {
  if (!v || v.trim() === '') {
    throw new Error(
      `Missing required env var: ${name}. Set it in .env.local (dev) or Vercel project settings (prod).`,
    );
  }
  return v;
}

/** Public vars (safe to use on client). Lazy getters — never throw on import. */
export const env = {
  get SUPABASE_URL(): string { return softValue('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL); },
  get SUPABASE_ANON_KEY(): string { return softValue('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); },
  get SITE_URL(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_SITE_URL); },
  get STRIPE_PRICE_STARTER(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER); },
  get STRIPE_PRICE_PRO(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO); },
  get STRIPE_PRICE_TEAM(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM); },
  get STRIPE_PRICE_LIFETIME(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME); },
};

/**
 * Server-only env. Call from Route Handlers / Server Components only.
 * Accessing from a Client Component will throw because Next.js strips
 * non-public env vars from the client bundle.
 */
export const serverEnv = {
  get STRIPE_SECRET_KEY(): string { return requiredValue('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY); },
  get STRIPE_WEBHOOK_SECRET(): string { return requiredValue('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET); },
  get SUPABASE_SERVICE_ROLE_KEY(): string { return requiredValue('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY); },
};
