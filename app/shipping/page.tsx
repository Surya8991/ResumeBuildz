import type { Metadata } from 'next';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { absoluteUrl } from '@/lib/siteConfig';

// Shipping & Delivery Policy.
//
// ResumeBuildz is a digital-only SaaS, so "shipping" here means service
// delivery (account access, AI credits, export entitlements). Razorpay
// and other Indian payment processors require this page on file even for
// non-physical goods — treat it as a service delivery disclosure.

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy - ResumeBuildz',
  description:
    'How ResumeBuildz delivers its digital service. Instant activation on payment, email confirmations, and service access policies.',
  alternates: { canonical: absoluteUrl('/shipping') },
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <main className="flex-1 bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Delivery</h1>
          <p className="text-sm text-gray-500 mb-3">Your account activates within 60 minutes of payment.</p>
          <p className="text-sm text-gray-400 mb-10">Last updated: April 18, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-600">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. Digital Service</h2>
              <p>
                ResumeBuildz is a software-as-a-service (SaaS) product. There are no physical
                goods to ship. &quot;Delivery&quot; in this policy refers to activation of your paid plan
                and access to the features purchased.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">2. Activation Time</h2>
              <p>
                Paid plans are activated <strong>immediately</strong> upon successful payment
                confirmation from our payment processor (Razorpay or Stripe). In the rare event
                of a processing delay, activation is guaranteed within <strong>60 minutes</strong>.
                If your account is not upgraded within this window, contact us using the details
                in Section 5 below.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">3. Confirmation Email</h2>
              <p>
                A receipt and payment confirmation is sent to the email address you provided at
                checkout. The email typically arrives within 5 minutes of purchase. Please check
                your spam folder before contacting support, and add{' '}
                <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">no-reply@resumebuildz.tech</code>{' '}
                to your allowed senders.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">4. Service Availability</h2>
              <p>
                ResumeBuildz is accessible 24/7 at{' '}
                <a href="https://resumebuildz.tech" className="text-blue-500 hover:underline">
                  https://resumebuildz.tech
                </a>{' '}
                from anywhere with an internet connection. We target 99.5% uptime. Planned
                maintenance windows, if any, are announced in advance on our{' '}
                <a href="/status" className="text-blue-500 hover:underline">
                  status page
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">5. Delivery Issues</h2>
              <p>
                If your paid features are not active within 60 minutes of payment, or if the
                confirmation email does not arrive within 24 hours, email us at{' '}
                <a href="mailto:suryaraj8147@gmail.com" className="text-blue-500 hover:underline">
                  suryaraj8147@gmail.com
                </a>{' '}
                with the subject line &quot;Delivery Issue&quot; and your transaction ID. We typically
                resolve such issues within 24 hours, Monday through Friday.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">6. No Physical Shipping</h2>
              <p>
                Because there are no physical goods, we do not collect shipping addresses, do not
                charge shipping fees, and do not use courier or postal services. All features are
                delivered through your ResumeBuildz account.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">7. International Customers</h2>
              <p>
                ResumeBuildz is available globally. Activation time and service availability are
                identical regardless of the customer&apos;s country. Payment is processed in INR via
                Razorpay for Indian customers and in USD via Stripe for international customers,
                at our sole discretion based on the detected location and selected currency at
                checkout.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">8. Refunds</h2>
              <p>
                See our{' '}
                <a href="/refund" className="text-blue-500 hover:underline">
                  Refund &amp; Cancellation Policy
                </a>{' '}
                for details on the 7-day refund window and how to request a refund or cancel a
                subscription.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
