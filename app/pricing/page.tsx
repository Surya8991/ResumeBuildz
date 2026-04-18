'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  Infinity as InfinityIcon,
  Users,
  Crown,
  HelpCircle,
  Mail,
  ArrowRight,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

type Billing = 'monthly' | 'annual';
type Currency = 'USD' | 'INR';

const COPY = {
  tagline: {
    pro: 'For your next job search.',
    lifetime: 'For every job search after this one.',
    coach: "For coaches who don't want to send Google Docs.",
  },
};

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('annual');
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    document.title = 'Pricing . ResumeBuildz';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ResumeBuildz pricing. Free forever plan plus Pro, Lifetime, and Coach tiers. Build a resume that passes ATS in minutes.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Pricing . ResumeBuildz');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'ResumeBuildz pricing. Free forever plan plus Pro, Lifetime, and Coach tiers.');
  }, []);

  const sym = currency === 'USD' ? '$' : '\u20B9';
  const prices = {
    proMonthly: currency === 'USD' ? 9 : 299,
    proAnnual: currency === 'USD' ? 69 : 1999,
    lifetime: currency === 'USD' ? 149 : 2999,
    coach: currency === 'USD' ? 19 : 799,
  };

  const proPrice = billing === 'annual' ? prices.proAnnual : prices.proMonthly;
  const proPeriod = billing === 'annual' ? '/ year' : '/ month';
  const proStrikethrough = billing === 'annual' ? prices.proMonthly * 12 : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-200 py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 mb-6">
            <Crown className="h-3.5 w-3.5" /> Simple, transparent pricing
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Free forever. Pro when you&apos;re serious.
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Job hunts are episodic. Pay for the months you&apos;re searching, or once for life. Pick what fits the way you actually look for work.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  billing === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  billing === 'annual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                }`}
              >
                Annual
                <span className="ml-2 inline-block text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  Save 36%
                </span>
              </button>
            </div>

            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  currency === 'USD' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  currency === 'INR' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                }`}
              >
                INR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* FREE */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Free</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{sym}0</span>
                <span className="text-gray-500">forever</span>
              </div>
              <p className="text-sm text-gray-600 mt-3">Start building right now. No account needed.</p>
            </div>
            <ul className="space-y-2.5 mb-6 text-sm text-gray-700 flex-1">
              {[
                'All 20 ATS-tested templates',
                '12 ATS checks',
                '1 AI rewrite per day',
                '3 PDF exports per day',
                'DOCX and HTML export',
                'Guest mode (no sign-up)',
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/builder"
              className="block text-center border border-gray-300 hover:border-gray-400 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition"
            >
              Start free
            </Link>
          </div>

          {/* PRO */}
          <div className="bg-white rounded-2xl border-2 border-indigo-600 p-6 flex flex-col relative shadow-sm">
            <span className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Pro
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{sym}{proPrice}</span>
                <span className="text-gray-500 text-sm">{proPeriod}</span>
              </div>
              {proStrikethrough && (
                <p className="text-xs text-gray-500 mt-1">
                  <span className="line-through">{sym}{proStrikethrough}/yr</span>
                  <span className="ml-2 text-green-700 font-medium">
                    Save {sym}{proStrikethrough - proPrice}
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-600 mt-3 italic">{COPY.tagline.pro}</p>
            </div>
            <ul className="space-y-2.5 mb-6 text-sm text-gray-700 flex-1">
              {[
                'Unlimited AI rewrites',
                'Unlimited PDF exports',
                'Unlimited ATS scans',
                'Multiple resume versions (tailor per job)',
                'Cloud sync across devices',
                'Priority AI queue',
                'Cover letter AI',
                'Email support',
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#waitlist"
              className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
              Join waitlist
            </a>
          </div>

          {/* LIFETIME */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col relative">
            <span className="absolute -top-3 left-6 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              BEST VALUE
            </span>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide flex items-center gap-2">
                <InfinityIcon className="h-4 w-4" /> Lifetime
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{sym}{prices.lifetime}</span>
                <span className="text-gray-500 text-sm">one-time</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pays back in {currency === 'USD' ? '17' : '10'} months vs monthly Pro.
              </p>
              <p className="text-sm text-gray-600 mt-3 italic">{COPY.tagline.lifetime}</p>
            </div>
            <ul className="space-y-2.5 mb-6 text-sm text-gray-700 flex-1">
              {[
                'Everything in Pro, forever',
                'All future features included',
                'Founding member badge',
                'First access to betas',
                'Priority support',
                'No renewals, no upsells',
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Crown className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#waitlist"
              className="block text-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              Join waitlist
            </a>
          </div>

          {/* COACH */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Users className="h-4 w-4" /> Coach
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{sym}{prices.coach}</span>
                <span className="text-gray-500 text-sm">/ seat / month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 3 seats.</p>
              <p className="text-sm text-gray-600 mt-3 italic">{COPY.tagline.coach}</p>
            </div>
            <ul className="space-y-2.5 mb-6 text-sm text-gray-700 flex-1">
              {[
                'Everything in Pro per seat',
                'Coach dashboard (all clients in one view)',
                'Inline comments on client resumes',
                'Co-branded shared resume links',
                'Bulk invite via CSV',
                'Seat management',
                'Dedicated onboarding',
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="mailto:Suryaraj8147@gmail.com?subject=Coach%20plan%20interest"
              className="block text-center border border-gray-300 hover:border-gray-400 text-gray-900 px-4 py-2.5 rounded-lg font-medium transition"
            >
              Talk to us
            </a>
          </div>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="bg-white border-y border-gray-200 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">What you get by plan</h2>
          <p className="text-gray-600 text-center mb-10">Side by side so you can pick without guessing.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500"></th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-indigo-700 bg-indigo-50 rounded-t-lg">Pro</th>
                  <th className="text-center py-3 px-4 font-semibold text-amber-700">Lifetime</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Coach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { label: 'Templates', Free: 'All 20', Pro: 'All 20 + new', Life: 'All 20 + new', Coach: 'All 20 + new' },
                  { label: 'AI rewrites', Free: '1 / day', Pro: 'Unlimited', Life: 'Unlimited', Coach: 'Unlimited / seat' },
                  { label: 'PDF exports', Free: '3 / day', Pro: 'Unlimited', Life: 'Unlimited', Coach: 'Unlimited' },
                  { label: 'ATS scans', Free: '3 / day', Pro: 'Unlimited', Life: 'Unlimited', Coach: 'Unlimited' },
                  { label: 'Multiple resume versions', Free: '1', Pro: 'Unlimited', Life: 'Unlimited', Coach: 'Unlimited' },
                  { label: 'Cloud sync', Free: 'No', Pro: 'Yes', Life: 'Yes', Coach: 'Yes' },
                  { label: 'Cover letter AI', Free: 'No', Pro: 'Yes', Life: 'Yes', Coach: 'Yes' },
                  { label: 'Coach dashboard', Free: 'No', Pro: 'No', Life: 'No', Coach: 'Yes' },
                  { label: 'Client inline comments', Free: 'No', Pro: 'No', Life: 'No', Coach: 'Yes' },
                  { label: 'Support', Free: 'Community', Pro: 'Email', Life: 'Priority', Coach: 'Dedicated' },
                  { label: 'Future features', Free: 'Core only', Pro: 'All included', Life: 'All included, forever', Coach: 'All included' },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-3 px-4 text-gray-700 font-medium">{row.label}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{row.Free}</td>
                    <td className="py-3 px-4 text-center text-gray-900 font-medium bg-indigo-50/60">{row.Pro}</td>
                    <td className="py-3 px-4 text-center text-gray-900 font-medium">{row.Life}</td>
                    <td className="py-3 px-4 text-center text-gray-900 font-medium">{row.Coach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">Which one fits you?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Pro',
                color: 'indigo',
                fit: 'Actively applying right now',
                bullet: 'You job-search in bursts. Pay monthly while you look, cancel when you land.',
              },
              {
                title: 'Lifetime',
                color: 'amber',
                fit: 'Rather pay once and be done',
                bullet: `You change jobs every 2 to 3 years. ${sym}${prices.lifetime} once beats monthly charges every time you come back.`,
              },
              {
                title: 'Coach',
                color: 'gray',
                fit: 'Run a coaching practice or bootcamp',
                bullet: 'You support 3+ clients at a time. Replace shared Google Docs with a proper client dashboard.',
              },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{c.fit}</div>
                <div className={`text-xl font-bold mt-1 ${c.color === 'indigo' ? 'text-indigo-700' : c.color === 'amber' ? 'text-amber-700' : 'text-gray-900'}`}>
                  Go with {c.title}
                </div>
                <p className="text-sm text-gray-600 mt-3">{c.bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-200 py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-indigo-600" /> Pricing FAQ
          </h2>
          <div className="space-y-5">
            {[
              {
                q: 'Is Free really free forever?',
                a: 'Yes. All 20 templates, 12 ATS checks, DOCX and HTML export, and guest mode are free with no expiry. We rate-limit AI rewrites and PDF exports on Free to keep infra costs sane, that is the only catch.',
              },
              {
                q: 'Can I cancel Pro anytime?',
                a: 'Yes. Cancel in one click from your profile. You keep access until the end of the current billing cycle, then drop back to Free. Your resumes stay in your account.',
              },
              {
                q: 'Why is Lifetime worth the price?',
                a: 'If you change jobs every 2 to 3 years and use ResumeBuildz for a month each time, Lifetime pays for itself in roughly 17 months. Beyond that it is free. It also includes every feature we ship in the future.',
              },
              {
                q: 'Do you offer a student discount?',
                a: 'Yes. 50% off Pro with a valid .edu or college email. Contact support to activate.',
              },
              {
                q: 'What happens to my resumes if I stop paying?',
                a: 'Nothing. Your resume data lives in your browser localStorage (and optionally cloud sync on Pro). You can keep editing and exporting on the Free tier forever.',
              },
              {
                q: 'Do coaches own their clients data?',
                a: 'Coaches have view and comment access. Clients own their resumes and can leave the workspace at any time, taking their data with them.',
              },
            ].map((item) => (
              <details key={item.q} className="group bg-gray-50 rounded-lg border border-gray-200 p-5">
                <summary className="cursor-pointer font-semibold text-gray-900 flex items-center justify-between">
                  {item.q}
                  <span className="text-indigo-600 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-gray-700 mt-3 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <WaitlistSection />

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to build?</h2>
          <p className="text-gray-300 mb-8">Start free. Upgrade only when the product earns it.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/builder" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-sm">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#waitlist" className="inline-flex items-center gap-2 border border-gray-600 hover:border-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition">
              Join Pro waitlist
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Store in localStorage for now. Replace with Supabase/email service later.
    try {
      const existing = JSON.parse(localStorage.getItem('resumeforge-waitlist') || '[]');
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem('resumeforge-waitlist', JSON.stringify(existing));
      }
    } catch { /* ignore */ }
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="py-16 md:py-20 bg-indigo-50/40 scroll-mt-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get notified when Pro launches</h2>
        <p className="text-gray-600 text-sm mb-6">
          Join the waitlist. First 100 members get 50% off launch price, one-time.
        </p>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium text-sm">
              You&apos;re on the list. We&apos;ll notify you at {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shrink-0 shadow-sm"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
