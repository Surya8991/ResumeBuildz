// Stripe checkout configuration.
//
// ⚠️  Backend not yet provisioned. When you are ready to launch Pro:
//   1. Create products in Stripe Dashboard → Products
//   2. Copy each price ID into the env vars below (or hardcode temporarily)
//   3. Set STRIPE_SECRET_KEY in Vercel env
//   4. Install the Stripe SDK: `npm install stripe @stripe/stripe-js`
//   5. Uncomment the Stripe client creation in app/api/checkout/route.ts
//   6. Remove the `disabled` prop from Pricing page buttons
//
// Until then, the checkout API returns a 503 with a clear "coming soon"
// message and the pricing buttons display "Coming Soon" as before.

export type PlanId = 'starter' | 'pro' | 'team' | 'lifetime';

export interface PlanMeta {
  id: PlanId;
  displayName: string;
  priceId: string | undefined; // Stripe price ID (env var)
  amountCents: number; // for display-only fallback
  recurring: 'month' | 'one-time';
}

export const PLANS: Record<PlanId, PlanMeta> = {
  starter: {
    id: 'starter',
    displayName: 'Starter',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    amountCents: 500,
    recurring: 'month',
  },
  pro: {
    id: 'pro',
    displayName: 'Pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    amountCents: 900,
    recurring: 'month',
  },
  team: {
    id: 'team',
    displayName: 'Team',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM,
    amountCents: 1900,
    recurring: 'month',
  },
  lifetime: {
    id: 'lifetime',
    displayName: 'Lifetime',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME,
    amountCents: 4900,
    recurring: 'one-time',
  },
};

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
