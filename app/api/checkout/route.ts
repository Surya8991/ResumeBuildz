import { NextRequest, NextResponse } from 'next/server';
import { PLANS, type PlanId, isStripeConfigured } from '@/lib/stripe';
import { SITE_URL } from '@/lib/siteConfig';
import { rateLimit, clientId } from '@/lib/rateLimit';
import { serverEnv } from '@/lib/env';
import { loadStripe } from '@/lib/lazyStripe';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Stripe checkout session creator.
//
// Returns:
//   - 200 { url } on success (redirect user there)
//   - 503 when Stripe env vars missing (pre-launch state)
//   - 400 on invalid plan
//   - 500 on Stripe API error
//
// This route is intentionally lazy: it requires the `stripe` SDK only when
// actually used, so the app still builds without it installed.

export async function POST(req: NextRequest) {
  // ── CSRF defense: require same-origin POST ──────────────────────────
  // Checkout sessions cost money. A cross-origin attacker embedding a
  // hidden form on evil.com would otherwise create sessions in our
  // Stripe account using a victim's cookies. We verify Origin (set by
  // every modern browser on POST) matches SITE_URL.
  const origin = req.headers.get('origin');
  if (!origin) {
    return NextResponse.json({ error: 'Missing Origin header' }, { status: 403 });
  }
  try {
    const reqOrigin = new URL(origin).origin;
    const siteOrigin = new URL(SITE_URL).origin;
    // In dev, also allow localhost origins so http://localhost:5467 works.
    const devOk = process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)/.test(reqOrigin);
    if (reqOrigin !== siteOrigin && !devOk) {
      return NextResponse.json({ error: 'Cross-origin requests not allowed' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid Origin' }, { status: 403 });
  }

  // ── Rate limit: 10 checkout sessions / hour / IP ────────────────────
  // Protects against Stripe-fee exhaustion + accidental double-clicks.
  const id = clientId(req);
  const rl = rateLimit(`checkout:${id}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limited. Try again in ${rl.retryAfterSec}s.`, code: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: 'Billing not yet enabled. Join the waitlist on /pricing to get notified when Pro launches.',
        code: 'stripe_not_configured',
      },
      { status: 503 },
    );
  }

  // Extract the authenticated user server-side — never trust userId from the
  // request body, as a caller could supply any user's ID and attribute the
  // payment to a victim's account.
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user ?? null;
  const userId = user?.id ?? null;
  const email = user?.email ?? undefined;

  let body: { plan?: PlanId };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { plan } = body;
  if (!plan || !(plan in PLANS)) {
    return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
  }

  const planMeta = PLANS[plan];
  if (!planMeta.priceId) {
    return NextResponse.json(
      { error: `Price ID missing for ${planMeta.displayName}. Set NEXT_PUBLIC_STRIPE_PRICE_${plan.toUpperCase()}.` },
      { status: 503 },
    );
  }

  // Lazy-load Stripe SDK (see lib/lazyStripe.ts). Returns null if the
  // package is not installed so the app still builds without it.
  const Stripe = await loadStripe();
  if (!Stripe) {
    return NextResponse.json(
      { error: 'Stripe SDK not installed. Run: npm install stripe', code: 'stripe_sdk_missing' },
      { status: 503 },
    );
  }

  try {
    const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: planMeta.recurring === 'one-time' ? 'payment' : 'subscription',
      line_items: [{ price: planMeta.priceId, quantity: 1 }],
      success_url: `${SITE_URL}/builder?upgrade=success&plan=${plan}`,
      cancel_url: `${SITE_URL}/pricing?upgrade=cancelled`,
      client_reference_id: userId,
      customer_email: email,
      metadata: { plan, userId: userId || '' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Never surface raw Stripe/exception text to the client — it can leak
    // account/config internals. Log server-side, return a generic message.
    console.error('[checkout] Stripe session create failed:', err);
    return NextResponse.json({ error: 'Could not start checkout. Please try again.', code: 'stripe_error' }, { status: 500 });
  }
}
