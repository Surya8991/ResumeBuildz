import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { serverEnv } from '@/lib/env';
import { loadStripe } from '@/lib/lazyStripe';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PLANS, type PlanId } from '@/lib/stripe';

interface StripeCustomer { id: string }
type StripeCustomerOrId = string | StripeCustomer;

interface StripeCheckoutSession {
  client_reference_id?: string | null;
  customer?: StripeCustomerOrId | null;
  metadata?: Record<string, string | null> | null;
}

interface StripeSubscriptionItem {
  price?: { id?: string };
}

interface StripeSubscription {
  customer: StripeCustomerOrId;
  status: string;
  items?: { data?: StripeSubscriptionItem[] };
}

interface StripeInvoice {
  customer: StripeCustomerOrId;
}

function customerId(raw: StripeCustomerOrId): string {
  return typeof raw === 'string' ? raw : raw.id;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUIRED_ENV = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] as const;

export async function POST(req: NextRequest) {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      return new NextResponse('Webhook not configured', { status: 503 });
    }
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return new NextResponse('Missing signature', { status: 400 });

  const rawBody = await req.text();
  const Stripe = await loadStripe();
  if (!Stripe) return new NextResponse('Stripe SDK not installed', { status: 503 });

  const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, serverEnv.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.warn('[stripe-webhook] signature verification failed:', err instanceof Error ? err.message : err);
    return new NextResponse('Signature verification failed', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as StripeCheckoutSession;
        const userId = session.client_reference_id ?? session.metadata?.userId ?? null;
        const plan = session.metadata?.plan ?? null;
        const cid = session.customer != null ? customerId(session.customer) : null;

        if (!userId) { logger.warn('[stripe-webhook] checkout: no userId'); break; }
        if (!plan || !(plan in PLANS)) { logger.warn('[stripe-webhook] checkout: unknown plan:', plan); break; }

        const update: Partial<typeof profiles.$inferInsert> = { plan: plan as PlanId };
        if (cid) update.stripeCustomerId = cid;

        await db.update(profiles).set(update).where(eq(profiles.id, userId));
        logger.info(`[stripe-webhook] upgraded user ${userId} to ${plan}`);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as unknown as StripeSubscription;
        const cid = customerId(sub.customer);

        let newPlan = 'free';
        if (event.type === 'customer.subscription.updated' && sub.status === 'active') {
          const priceId = sub.items?.data?.[0]?.price?.id;
          const matched = Object.values(PLANS).find((p) => p.priceId && p.priceId === priceId);
          if (matched) newPlan = matched.id;
        }

        await db.update(profiles).set({ plan: newPlan }).where(eq(profiles.stripeCustomerId, cid));
        logger.info(`[stripe-webhook] ${event.type}: customer ${cid} → ${newPlan}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as StripeInvoice;
        logger.warn(`[stripe-webhook] payment_failed for customer ${customerId(invoice.customer)}`);
        break;
      }

      default:
        logger.warn('[stripe-webhook] unhandled event:', event.type);
    }
  } catch (err) {
    logger.error('[stripe-webhook] handler error:', err);
    return new NextResponse('Handler error', { status: 500 });
  }

  return NextResponse.json({ received: true });
}
