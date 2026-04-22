'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  BarChart3,
  Shield,
  UserX,
  ExternalLink,
  Layout,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { useLoginGateway } from '@/components/LoginGateway';
import { jsonLd } from '@/lib/articleSchema';

// Lazy-load the hero illustration. Heavy animations + SVG weight don't
// need to block LCP. Placeholder keeps layout stable via explicit
// min-height. ssr:false keeps the server-rendered hero copy paintable
// without the decoration.
const Fill7_Ultimate = dynamic(() => import('@/components/HeroOptions').then((m) => ({ default: m.Fill7_Ultimate })), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full" aria-hidden />,
});

const FEATURES = [
  { icon: Layout, title: '20 Templates', desc: 'Pick from 20 resume designs built to pass ATS filters and look great in print. Classic, modern, creative. Every style covered.' },
  { icon: Sparkles, title: 'AI Writing Help', desc: 'Stuck on bullet points? Our Groq-powered AI rewrites weak descriptions into results-driven statements in seconds.' },
  { icon: BarChart3, title: 'ATS Score Checker', desc: '12 analysis tools scan your resume for keyword gaps, formatting issues, and readability, just like a real ATS would.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your resume data stays in your browser localStorage. We use cookieless privacy-friendly analytics only (no personal tracking).' },
  { icon: UserX, title: 'No Sign-up Needed', desc: 'Start building immediately. No account required. Sign in optionally to unlock Pro features.' },
  { icon: ExternalLink, title: 'Open Source', desc: 'Every line of code is on GitHub. Inspect it, fork it, self-host it, or contribute new templates.' },
];

const STEPS = [
  { num: '1', title: 'Add Your Info', desc: 'Type in your experience, education, and skills, or import an existing resume.' },
  { num: '2', title: 'Pick a Template', desc: 'Choose from 20 ATS-tested designs. Preview each one before committing.' },
  { num: '3', title: 'Run ATS Check', desc: 'Our 12-point analysis spots keyword gaps, formatting issues, and weak verbs.' },
  { num: '4', title: 'Download PDF', desc: 'Export a print-ready PDF, DOCX, or HTML file. Done in minutes.' },
];

const SHOWCASE_TEMPLATES = [
  { name: 'Classic', color: '#1a1a1a' },
  { name: 'Modern', color: '#2563eb' },
  { name: 'Creative', color: '#db2777' },
  { name: 'Tech', color: '#10b981' },
  { name: 'Executive', color: '#4338ca' },
  { name: 'Nordic', color: '#64748b' },
];

export default function HomePage() {
  const { openGateway } = useLoginGateway();
  useEffect(() => {
    document.title = 'ResumeBuildz - Free ATS Resume Builder with 20 Templates & AI';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Build professional, ATS-optimized resumes with 20 free templates, AI writing assistant, and real-time ATS scoring. No sign-up required.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Build professional, ATS-optimized resumes with 20 free templates, AI writing assistant, and real-time ATS scoring. No sign-up required.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'ResumeBuildz - Free ATS Resume Builder with 20 Templates & AI');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 animate-fade-in-up">
                Your resume shouldn&apos;t be the reason you don&apos;t get hired.
              </h1>
              <p className="text-lg md:text-xl text-blue-200/90 mb-6 max-w-lg font-medium animate-fade-in-up delay-100">
                Free ATS-friendly resume builder with 20 templates, AI writing help, and live ATS scoring.
              </p>
              <p className="text-base text-gray-300 mb-8 max-w-lg animate-fade-in-up delay-100">
                75% of resumes get filtered by ATS before a human sees them<sup className="ml-0.5"><Link href="/ats-guide#ats-stats" className="text-gray-500 hover:text-gray-300 text-xs" title="Source: Jobscan, 2024" aria-label="Source: Jobscan 2024 ATS statistics">[1]</Link></sup>. ResumeBuildz gives you 12 ATS checks against every template. Free to start, no sign-up needed.
              </p>
              <div className="flex items-center gap-3 mb-6 animate-fade-in-up delay-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">SL</div>
                <div className="text-left">
                  <p className="text-sm text-white font-semibold">Built by <Link href="/author/surya-l" className="underline decoration-indigo-400 underline-offset-4 hover:decoration-indigo-300">Surya L</Link></p>
                  <p className="text-xs text-gray-400">Solo founder, ex-IT services engineer. Shipping in public.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-sm">
                  Build free. No sign-up. <ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/pass-ats-resume-scanning" className="border border-gray-600 hover:border-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition">
                  How ATS scans resumes →
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-4 animate-fade-in-up delay-300">
                Free forever. Paid plan unlocks unlimited AI rewrites + exports.
              </p>
            </div>
            <div className="hidden md:flex justify-end items-center animate-scale-in delay-300 pr-2 lg:pr-6">
              <Fill7_Ultimate />
            </div>
          </div>
        </div>
      </section>

      {/* Problem -> Solution strip. Translates ATS pain into outcome
          language before the feature list. Composite examples drawn
          from user interviews; not individual testimonials. */}
      <section className="bg-white py-14 md:py-18 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">Why resumes fail in 2026</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            The real bottleneck is not you. It is the parser.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                before: '47 applications, 0 callbacks',
                cause: 'Two-column template broke ATS parsing',
                after: '4 interviews in 2 weeks after template swap',
              },
              {
                before: '"Your resume is impressive but..."',
                cause: 'Missing 6 hard-skill keywords from the JD',
                after: 'JD-match tool surfaced + rewrote bullets in 10 min',
              },
              {
                before: 'Spent Rs 4,800 on a paid builder',
                cause: 'Paywalled download hidden until after 90-min build',
                after: 'Free forever + unlimited PDF export here',
              },
            ].map((row, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-rose-700 font-semibold mb-1">Before</p>
                  <p className="text-sm text-gray-900 font-medium leading-snug">{row.before}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Why</p>
                  <p className="text-sm text-gray-700 leading-snug">{row.cause}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-1">After</p>
                  <p className="text-sm text-gray-900 font-medium leading-snug">{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-indigo-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '20', label: 'ATS-tested templates' },
              { num: '29', label: 'In-depth guides' },
              { num: '12', label: 'ATS checks' },
              { num: 'Free', label: 'Forever, no sign-up' },
            ].map((s, i) => (
              <div key={s.label} className={`animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="text-2xl md:text-3xl font-bold">{s.num}</div>
                <div className="text-blue-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4 animate-fade-in-up">Built for one thing: getting you interviewed.</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Professional resume tools (templates, AI writing, ATS scoring) without paying a dime or creating an account.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
                <f.icon className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 animate-fade-in-up">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`text-center animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Template Showcase</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Pick from 20 professionally designed templates, each optimized for ATS.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {SHOWCASE_TEMPLATES.map((t, i) => (
              <div key={t.name} className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition animate-scale-in delay-${Math.min((i + 1) * 100, 500)}`}>
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <Image
                    src={`/templates/${t.name.toLowerCase()}.png`}
                    alt={`${t.name} template preview`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-4 bg-white flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <Link href="/templates" className="text-blue-400 text-sm hover:underline">
                    View all
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role guides hub teaser — adds a discovery path to /resume and the
          10 role-specific guides. Without this, users who never enter via
          a blog post never find them. */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">Role guides</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Hand-written guides for 10+ roles</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                ATS keywords, real bullet examples, common mistakes, and India salary benchmarks per role.
              </p>
            </div>
            <Link href="/resume" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap">
              See all role guides →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { slug: 'software-engineer', label: 'Software Engineer' },
              { slug: 'data-scientist', label: 'Data Scientist' },
              { slug: 'product-manager', label: 'Product Manager' },
              { slug: 'ui-ux-designer', label: 'UI/UX Designer' },
              { slug: 'digital-marketer', label: 'Digital Marketer' },
              { slug: 'full-stack-developer', label: 'Full-Stack Developer' },
              { slug: 'devops-engineer', label: 'DevOps Engineer' },
              { slug: 'business-analyst', label: 'Business Analyst' },
              { slug: 'cybersecurity-analyst', label: 'Cybersecurity Analyst' },
              { slug: 'machine-learning-engineer', label: 'ML Engineer' },
            ].map((r) => (
              <Link
                key={r.slug}
                href={`/resume/${r.slug}`}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition text-center"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Built-in ATS Optimization</h2>
              <p className="text-gray-600 mb-6">
                Most companies use ATS software to filter resumes before a recruiter ever reads them. Our 12 built-in tools check your resume the same way an ATS does, so you can fix problems before you hit &quot;apply.&quot;
              </p>
              <ul className="space-y-3">
                {[
                  'Readability score analysis',
                  'Formatting compatibility check',
                  'Active voice detection',
                  'Industry keyword matching',
                  'Section completeness audit',
                  'Bullet point optimization',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-blue-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">ATS Score</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Sample. Your score will vary</p>
                </div>
                <span className="text-3xl font-bold text-indigo-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-8 mt-4">
                <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '92%' }} />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Keywords', score: 95 },
                  { label: 'Formatting', score: 88 },
                  { label: 'Readability', score: 93 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-900 font-medium">{item.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust block. Replaces the earlier composite-testimonial section
          since honest trust signals beat fake reviews. Real testimonials
          will be added once users opt in. */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Built in public. Fully inspectable.</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            The code that builds your resume runs in your browser. You can read every line of it on GitHub.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1.5">localStorage-first</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your resume data lives on your device by default. Not on our servers, not in an ad network. Cloud sync is opt-in.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <ExternalLink className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1.5">Open source, MIT-adjacent</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                The full codebase is on GitHub. Read, fork, self-host, or just verify our privacy claims.
              </p>
              <a href="https://github.com/Surya8991/ResumeBuildz" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-indigo-600 hover:underline">
                github.com/Surya8991/ResumeBuildz →
              </a>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <CheckCircle className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1.5">Audited against real ATS</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                All 20 templates are tested against Workday, Greenhouse, Lever, iCIMS, and Taleo parsers before shipping.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-8">
            No fake reviews. No paid placements. Real user testimonials are coming once early adopters opt in.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Questions, answered.</h2>
          <p className="text-gray-600 text-center mb-10">
            What people ask before they start.
          </p>
          <div className="space-y-3">
            {[
              {
                q: 'Is ResumeBuildz really free?',
                a: 'Yes. The free plan gives you all 20 templates, 12 ATS checks, DOCX and HTML export, and guest mode. No credit card, no sign-up required. We rate-limit AI rewrites and PDF exports on Free to keep infra costs sane.',
              },
              {
                q: 'Do I need to create an account?',
                a: 'No. ResumeBuildz works entirely in your browser with no sign-up. Your resume data stays in localStorage on your device. Sign in optionally to sync across devices when Pro launches.',
              },
              {
                q: 'Will my data be sold?',
                a: 'No. Your resume content lives in your browser and never leaves it unless you explicitly use the AI feature (which goes directly to Groq with your own API key). Analytics are cookieless and aggregated. No ads, no data brokers, no retargeting.',
              },
              {
                q: 'What makes a resume ATS-friendly?',
                a: 'Single-column layout, standard section headings (Experience, Education, Skills), no images or graphics, PDF or DOCX format, and keyword density matching the job description. Our 12-point ATS check flags every violation. See the complete ATS guide for the deep dive.',
              },
            ].map((item, i) => (
              <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-5 open:shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 list-none">
                  <span>{item.q}</span>
                  <span className="text-indigo-600 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="text-center mt-6 text-sm">
            <Link href="/faq" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
              See all 26 questions →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQPage schema for SEO / AI Overview capture */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            // Keep this list in sync with the 4 FAQs rendered above.
            // Google penalises FAQPage schema whose questions do not
            // appear in the page content.
            mainEntity: [
              { '@type': 'Question', name: 'Is ResumeBuildz really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The free plan gives you all 20 templates, 12 ATS checks, DOCX and HTML export, and guest mode. No credit card, no sign-up required.' } },
              { '@type': 'Question', name: 'Do I need to create an account?', acceptedAnswer: { '@type': 'Answer', text: 'No. ResumeBuildz works entirely in your browser with no sign-up. Your resume data stays in localStorage on your device.' } },
              { '@type': 'Question', name: 'Will my data be sold?', acceptedAnswer: { '@type': 'Answer', text: 'No. Your resume content lives in your browser and never leaves it unless you explicitly use the AI feature. Analytics are cookieless and aggregated. No ads, no data brokers.' } },
              { '@type': 'Question', name: 'What makes a resume ATS-friendly?', acceptedAnswer: { '@type': 'Answer', text: 'Single-column layout, standard section headings, no images, PDF or DOCX format, and keyword density matching the job description. Our 12-point ATS check flags every violation.' } },
            ],
          }),
        }}
      />

      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up">Ready when you are.</h2>
          <p className="text-gray-300 mb-8 text-lg animate-fade-in-up delay-100">
            Build a resume that actually passes ATS screening. About 15 minutes, no sign-up, no catch.
          </p>
          <button onClick={() => openGateway('/builder')} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-sm">
            Build my resume now <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
