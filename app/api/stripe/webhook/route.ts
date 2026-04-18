import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { serverEnv } from '@/lib/env';

// Stripe webhook handler — signature verification + event routing.
//
// Deployment steps (all required before Stripe Dashboard setup):
//   1. npm install stripe
//   2. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in Vercel env
//   3. Stripe Dashboard → Developers → Webhooks → Add endpoint:
//        URL: https://<yourdomain>/api/stripe/webhook
//        Events: checkout.session.completed,
//                customer.subscription.updated,
//                customer.subscription.deleted,
//                invoice.payment_failed
//   4. Copy the signing secret → STRIPE_WEBHOOK_SECRET
//
// SECURITY: the signature check below is the ONLY thing standing between
// the internet and your billing state. Never accept events without it —
// an attacker who knows the webhook URL can otherwise promote themselves
// to Pro by POSTing a fake `customer.subscription.updated` payload.
//
// Rate limiting: not applied here intentionally. Stripe retries with
// exponential backoff on 5xx, so a tight rate limit would break legitimate
// retries. Stripe signs every request, so spam from other parties fails
// at the signature check anyway.

// Node runtime required because we need the raw body for signature check.
export const runtime = 'nodejs';
// Disable Next.js body parsing; Stripe needs the exact raw bytes.
export const dynamic = 'force-dynamic';

const REQUIRED_ENV = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] as const;

export async function POST(req: NextRequest) {
  // 1. Fail fast if webhook env not configured (pre-launch state).
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      // Return 503 so Stripe retries once the secret is set, but don't
      // reveal which env var is missing to an outside caller.
      return new NextResponse('Webhook not configured', { status: 503 });
    }
  }

  // 2. Signature verification. MUST happen on the raw body.
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  const rawBody = await req.text();

  // Lazy import so the app builds without the Stripe SDK installed.
  // See M3 in audit — swap for a direct `await import('stripe')` once the
  // SDK is a permanent dep.
  type StripeCtor = new (key: string) => {
    webhooks: { constructEvent: (body: string, sig: string, secret: string) => { type: string; data: { object: Record<string, unknown> } } };
  };
  let stripeMod: { default: StripeCtor } | null = null;
  try {
    const dyn = new Function('m', 'return import(m)') as (m: string) => Promise<{ default: StripeCtor }>;
    stripeMod = await dyn('stripe').catch(() => null);
  } catch {
    stripeMod = null;
  }
  if (!stripeMod) {
    return new NextResponse('Stripe SDK not installed', { status: 503 });
  }

  const Stripe = stripeMod.default;
  const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, serverEnv.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid signature';
    // Only log the TYPE of failure — never echo the signature back, as
    // that leaks timing info that could help forge future requests.
    logger.warn('[stripe-webhook] signature verification failed:', msg);
    return new NextResponse('Signature verification failed', { status: 400 });
  }

  // 3. Route events. All state updates go through Supabase service role
  //    (server-only; never exposed to the client). Each handler is
  //    idempotent because Stripe retries on any non-2xx.
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // TODO: mark user as upgraded in profiles table
        // const session = event.data.object;
        // const userId = session.client_reference_id;
        // const plan = session.metadata?.plan;
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // TODO: sync plan + cancel_at_period_end to profiles
        break;
      }
      case 'invoice.payment_failed': {
        // TODO: mark profile as payment_failed, email user
        break;
      }
      default:
        // Log unknown events for visibility without crashing.
        logger.warn('[stripe-webhook] unhandled event:', event.type);
    }
  } catch (err) {
    // 500 triggers Stripe retry with backoff. Don't return details to Stripe.
    logger.error('[stripe-webhook] handler error:', err);
    return new NextResponse('Handler error', { status: 500 });
  }

  return NextResponse.json({ received: true });
}
