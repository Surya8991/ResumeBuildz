'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, X, Crown, Sparkles, FileDown, BarChart3, Layout, Zap, HelpCircle, Mail } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { FREE_LIMITS } from '@/lib/usage';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Build a great resume at zero cost.',
    cta: 'Get Started',
    ctaHref: '/builder',
    highlight: false,
    badge: null,
    features: [
      { text: `${FREE_LIMITS.ai} AI rewrite / day`, included: true },
      { text: `${FREE_LIMITS.pdf} PDF exports / day`, included: true },
      { text: 'All 20 templates', included: true },
      { text: '12 ATS tools', included: true },
      { text: 'DOCX & HTML export', included: true },
      { text: 'Job description matching', included: true },
      { text: 'Priority support', included: false },
      { text: 'Cover letter AI', included: false },
    ],
  },
  {
    name: 'Starter',
    price: '$5',
    period: '/ month',
    description: 'More exports and rewrites for active job seekers.',
    cta: 'Coming Soon',
    ctaHref: null,
    highlight: false,
    badge: null,
    features: [
      { text: '5 AI rewrites / day', included: true },
      { text: '10 PDF exports / day', included: true },
      { text: 'All 20 templates', included: true },
      { text: '12 ATS tools', included: true },
      { text: 'DOCX & HTML export', included: true },
      { text: 'Job description matching', included: true },
      { text: 'Email support', included: true },
      { text: 'Cover letter AI', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/ month',
    description: 'Unlimited access for serious job seekers.',
    cta: 'Coming Soon',
    ctaHref: null,
    highlight: true,
    badge: 'MOST POPULAR',
    features: [
      { text: 'Unlimited AI rewrites', included: true },
      { text: 'Unlimited PDF exports', included: true },
      { text: 'All 20 templates', included: true },
      { text: '12 ATS tools', included: true },
      { text: 'DOCX & HTML export', included: true },
      { text: 'Job description matching', included: true },
      { text: 'Priority support', included: true },
      { text: 'Cover letter AI', included: true },
    ],
  },
  {
    name: 'Team',
    price: '$19',
    period: '/ month',
    description: 'For career coaches, bootcamps, and teams.',
    cta: 'Coming Soon',
    ctaHref: null,
    highlight: false,
    badge: null,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Up to 10 team members', included: true },
      { text: 'Shared template library', included: true },
      { text: 'Team analytics dashboard', included: true },
      { text: 'Admin controls', included: true },
      { text: 'Bulk resume export', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom branding', included: true },
    ],
  },
  {
    name: 'Lifetime',
    price: '$49',
    period: 'one-time',
    description: 'Pay once, use forever. No subscriptions.',
    cta: 'Coming Soon',
    ctaHref: null,
    highlight: false,
    badge: 'BEST VALUE',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited AI rewrites', included: true },
      { text: 'Unlimited PDF exports', included: true },
      { text: 'Lifetime updates', included: true },
      { text: 'Priority support', included: true },
      { text: 'Cover letter AI', included: true },
      { text: 'Early access to features', included: true },
      { text: 'No recurring fees', included: true },
    ],
  },
];

const FAQS = [
  {
    q: 'Is ResumeForge really free?',
    a: 'Yes. The free plan gives you access to all 20 templates, 12 ATS tools, DOCX/HTML export, and more, with no account required. AI rewrites and PDF exports have daily limits on the free plan.',
  },
  {
    q: 'What counts as an AI rewrite?',
    a: 'Each time you generate a summary, bullet points, skills, or a custom AI suggestion, that counts as one AI rewrite. The free plan includes 1 per day.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. ResumeForge works entirely in your browser with no sign-up. Your data stays on your device. Pro billing (when available) will require an account.',
  },
  {
    q: 'When will Pro be available?',
    a: 'Pro is launching in Q2 2026. Join the waitlist below to get an early-bird discount and be the first to know when paid plans go live.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. When Pro launches, you\'ll be able to cancel anytime with no questions asked. You\'ll keep Pro access until the end of your billing period.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. ResumeForge is 100% client-side. Your resume data never leaves your browser. It is stored in localStorage, not on any server.',
  },
];

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Pricing - ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ResumeForge pricing plans. Build your resume for free or upgrade to Pro for unlimited AI rewrites and PDF exports.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Pricing - ResumeForge');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 animate-fade-in-up">
            <Crown className="h-3.5 w-3.5" /> Simple, transparent pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up delay-100">
            Build your resume <span className="text-blue-400">for free</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Get started with everything you need at no cost. Upgrade to Pro when you want unlimited AI rewrites and PDF exports.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-10 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-900">
              <strong>The Free plan is genuinely usable.</strong> All 20 templates, all 12 ATS tools, DOCX/HTML export. No credit card, no sign-up. Paid plans unlock unlimited AI rewrites and PDF exports.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col animate-fade-in-up relative ${
                  plan.highlight
                    ? 'bg-white ring-2 ring-blue-500 shadow-xl'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white tracking-wide ${
                    plan.highlight ? 'bg-blue-500' : 'bg-gray-800'
                  }`}>
                    {plan.badge}
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                </div>

                {plan.ctaHref ? (
                  <Link
                    href={plan.ctaHref}
                    className={`block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 ${
                      plan.highlight
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-blue-500 text-white opacity-75 cursor-not-allowed mb-8 flex items-center justify-center gap-2"
                  >
                    <Crown className="h-4 w-4" /> {plan.cta}
                  </button>
                )}

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                      )}
                      <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            Everything included in Free
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Most resume builders charge for features we give away. Here&apos;s what you get at zero cost.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layout, title: '20 Templates', desc: 'Professional designs for every industry and career level' },
              { icon: BarChart3, title: '12 ATS Tools', desc: 'Check formatting, keywords, readability, and more' },
              { icon: Sparkles, title: 'AI Writing', desc: 'Generate summaries, bullet points, and skills with Groq AI' },
              { icon: FileDown, title: 'Multi-format Export', desc: 'Download as PDF, DOCX, HTML, or JSON' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 p-6 text-center animate-fade-in-up">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-500 mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Got questions? We&apos;ve got answers.
          </p>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in-up">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <WaitlistSection />

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in-up">
            Ready to build your resume?
          </h2>
          <p className="text-gray-400 mb-8 animate-fade-in-up delay-100">
            Start for free, no account required. Your data stays in your browser.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25 animate-fade-in-up delay-200"
          >
            <Zap className="h-4 w-4" /> Start Building
          </Link>
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
    // Store in localStorage for now. Replace with Supabase/email service later
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
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-500 mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get notified when Pro launches</h2>
        <p className="text-gray-500 text-sm mb-6">
          Join the waitlist and be the first to know when paid plans go live. No spam, just one email.
        </p>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-700 font-medium text-sm">You&apos;re on the list! We&apos;ll notify you at {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors shrink-0"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
