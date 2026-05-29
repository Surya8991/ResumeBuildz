// Lazy Stripe loader.
//
// Background:
//   The Stripe SDK is an optional dependency — the app builds and runs
//   without it so contributors on a fresh clone don't need `npm install
//   stripe` just to get `next dev` going. This helper loads the SDK at
//   request time, returning `null` if the package isn't installed.
//
// Why `new Function(...)`:
//   Static `import from 'stripe'` would force Turbopack / webpack to
//   resolve the dependency at build time, breaking the build when it's
//   absent. `new Function('m', 'return import(m)')` hides the dynamic
//   import behind a string literal so the bundler never sees it.
//   This requires `'unsafe-eval'` in our Content-Security-Policy
//   `script-src` — acceptable while Stripe is not a permanent dep.
//   Once it is (payments going live), swap this helper for a direct
//   `await import('stripe')` and drop `'unsafe-eval'` from the CSP.
//
// Security:
//   The `m` argument is always the literal string `'stripe'`, never a
//   user-supplied value. No dynamic code eval from request data occurs.

export type StripeLike = new (key: string) => {
  checkout: {
    sessions: {
      create: (opts: Record<string, unknown>) => Promise<{ url: string | null }>;
    };
  };
  webhooks: {
    constructEvent: (
      body: string,
      sig: string,
      secret: string,
    ) => { id: string; type: string; data: { object: Record<string, unknown> } };
  };
};

export async function loadStripe(): Promise<StripeLike | null> {
  try {
    const dyn = new Function('m', 'return import(m)') as (
      m: string,
    ) => Promise<{ default: StripeLike }>;
    const mod = await dyn('stripe').catch(() => null);
    return mod?.default ?? null;
  } catch {
    return null;
  }
}
