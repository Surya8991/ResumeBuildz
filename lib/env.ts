// Typed, fail-fast env var accessors.
//
// NEXT_PUBLIC_* vars must be accessed via literal property reads so Next.js
// can inline them into the client bundle at build time. Dynamic access like
// process.env[name] returns undefined in the browser.

function softValue(name: string, v: string | undefined): string {
  if (!v || v.trim() === '') {
    if (typeof console !== 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(`[env] ${name} is not set — some features may not work until you add it to .env.local`);
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
      `Missing required env var: ${name}. Set it in .env.local (dev) or your hosting provider's env settings (prod).`,
    );
  }
  return v;
}

/** Public vars (safe to use on client). */
export const env = {
  get SITE_URL(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_SITE_URL); },
  get STRIPE_PRICE_STARTER(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER); },
  get STRIPE_PRICE_PRO(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO); },
  get STRIPE_PRICE_TEAM(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM); },
  get STRIPE_PRICE_LIFETIME(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME); },
  get SENTRY_DSN(): string | undefined { return optionalValue(process.env.NEXT_PUBLIC_SENTRY_DSN); },
  // Better Auth base URL (public — needed by auth-client.ts)
  get AUTH_URL(): string { return softValue('NEXT_PUBLIC_SITE_URL', process.env.NEXT_PUBLIC_SITE_URL) || 'http://localhost:3000'; },
};

function assertServerSide(name: string): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      `[env] ${name} was accessed on the client. ` +
      'Move this call to a Route Handler, Server Action, or Server Component.',
    );
  }
}

export const serverEnv = {
  get STRIPE_SECRET_KEY(): string { assertServerSide('STRIPE_SECRET_KEY'); return requiredValue('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY); },
  get STRIPE_WEBHOOK_SECRET(): string { assertServerSide('STRIPE_WEBHOOK_SECRET'); return requiredValue('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET); },
  get DATABASE_URL(): string { assertServerSide('DATABASE_URL'); return requiredValue('DATABASE_URL', process.env.DATABASE_URL); },
  get BETTER_AUTH_SECRET(): string { assertServerSide('BETTER_AUTH_SECRET'); return requiredValue('BETTER_AUTH_SECRET', process.env.BETTER_AUTH_SECRET); },
};
