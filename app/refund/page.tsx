import type { Metadata } from 'next';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { absoluteUrl } from '@/lib/siteConfig';

// Refund & Cancellation Policy page.
//
// Required by payment processors (Razorpay, Stripe, PayU) for SaaS
// merchants. Covers the full chain: free tier, trial refunds, subscription
// cancellation, lifetime refunds, and dispute handling. Keep the language
// plain so non-lawyer reviewers at Razorpay can approve quickly.

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy - ResumeBuildz',
  description:
    'ResumeBuildz refund and cancellation policy. 7-day refund window on paid plans, clear cancellation flow, and dispute resolution.',
  alternates: { canonical: absoluteUrl('/refund') },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <main className="flex-1 bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund &amp; Cancellation Policy</h1>
          <p className="text-sm text-gray-600 mb-3">7-day no-questions-asked window on all paid plans. Payments processed by Razorpay (INR) or Stripe (other currencies).</p>
          <p className="text-sm text-gray-400 mb-10">Last updated: April 18, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-600">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. Free Tier</h2>
              <p>
                ResumeBuildz is free to use. The builder, 20+ templates, 12 ATS checks, PDF
                export, and unlimited resume creation are available without any payment. You can
                stop using the free tier at any time without notice or fees.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">2. Paid Plans</h2>
              <p>
                Paid plans (Starter, Pro, Team, Lifetime) unlock unlimited AI rewrites, premium
                templates, and additional features as described on our{' '}
                <a href="/pricing" className="text-blue-500 hover:underline">
                  pricing page
                </a>
                . Payment is processed via Razorpay (for INR) or Stripe (for other currencies).
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">3. 7-Day Refund Window</h2>
              <p>
                If you are not satisfied with your paid plan, you may request a full refund within
                <strong> 7 days of your first payment</strong>. To request a refund, email{' '}
                <a href="mailto:suryaraj8147@gmail.com" className="text-blue-500 hover:underline">
                  suryaraj8147@gmail.com
                </a>{' '}
                with the subject line &quot;Refund Request&quot; and your order/transaction ID. Refunds are
                issued to the original payment method within 5–10 business days.
              </p>
              <p className="mt-2">
                The 7-day refund window does not apply to renewal charges on recurring
                subscriptions. To avoid a renewal charge, cancel your subscription before the
                renewal date (see Section 4).
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">4. Cancelling a Subscription</h2>
              <p>
                Monthly and annual subscriptions renew automatically until cancelled. You can
                cancel at any time from your account settings → Manage Plan, or by emailing us.
                Cancellation takes effect at the end of the current billing period — you retain
                access to paid features until then, and you will not be charged again.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">5. Lifetime Plan</h2>
              <p>
                Lifetime plan is a one-time payment with no renewals. The 7-day refund window
                (Section 3) applies. After 7 days, Lifetime purchases are non-refundable except
                where required by applicable consumer protection law.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">6. Exceptions</h2>
              <p>
                Refunds may be denied if we determine the account has been used in violation of
                our{' '}
                <a href="/terms" className="text-blue-500 hover:underline">
                  Terms of Use
                </a>{' '}
                (for example: account sharing, reselling, abuse of AI credits, or fraudulent
                chargebacks). In such cases we will explain the reason in writing.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">7. Failed or Duplicate Payments</h2>
              <p>
                If you are charged twice for the same order, or a payment fails after the amount
                has been debited from your bank, email us with the transaction ID and we will
                refund the duplicate or reconcile the failed charge within 5 business days. No
                questions asked, no 7-day limit.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">8. Chargebacks &amp; Disputes</h2>
              <p>
                Before raising a chargeback with your bank, please email us first — almost every
                issue is resolvable directly and faster than the chargeback process. Chargebacks
                raised without prior contact may result in account suspension pending review.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">9. Contact</h2>
              <p>
                For any refund, cancellation, or billing question, reach us at{' '}
                <a href="mailto:suryaraj8147@gmail.com" className="text-blue-500 hover:underline">
                  suryaraj8147@gmail.com
                </a>
                . Typical response time is 24–48 hours, Monday through Friday.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">10. Changes to this Policy</h2>
              <p>
                We may update this policy. Material changes will be posted with an updated date
                at the top. Continued use of ResumeBuildz after changes take effect constitutes
                acceptance of the new policy.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
