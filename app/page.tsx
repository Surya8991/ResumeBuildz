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
  Star,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { useLoginGateway } from '@/components/LoginGateway';
import { Fill7_Ultimate } from '@/components/HeroOptions';

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
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
                Your resume shouldn&apos;t be the reason you don&apos;t get hired.
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg animate-fade-in-up delay-100">
                75% of resumes get filtered by ATS before a human sees them<sup className="ml-0.5"><Link href="/ats-guide#ats-stats" className="text-gray-500 hover:text-gray-300 text-xs" title="Source: Jobscan, 2024" aria-label="Source: Jobscan 2024 ATS statistics">[1]</Link></sup>. ResumeBuildz gives you 20 templates, AI writing help, and 12 ATS checks. Free to start, no sign-up needed.
              </p>
              <div className="flex items-center justify-center gap-6 mb-6 animate-fade-in-up delay-200">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[
                      { color: 'bg-blue-400', initial: 'S', name: 'Sarah Mitchell' },
                      { color: 'bg-green-400', initial: 'D', name: 'David Chen' },
                      { color: 'bg-purple-400', initial: 'P', name: 'Priya Sharma' },
                      { color: 'bg-orange-400', initial: 'M', name: 'Marcus Johnson' },
                      { color: 'bg-pink-400', initial: 'E', name: 'Emily Rodriguez' },
                    ].map((user) => (
                      <div key={user.name} title={user.name} className={`h-8 w-8 rounded-full ${user.color} border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold`}>
                        {user.initial}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Built by engineers tired of losing to ATS filters</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-sm">
                  Build my resume. 15 min, free <ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/ats-guide" className="border border-gray-600 hover:border-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Read the ATS guide →
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-end items-center animate-scale-in delay-300 pr-2 lg:pr-6">
              <Fill7_Ultimate />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-indigo-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '20', label: 'Templates' },
              { num: '201', label: 'Roles' },
              { num: '12', label: 'ATS Tools' },
              { num: '15m', label: 'Avg build time' },
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

      {/* Testimonials */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">What three sides of the hiring table say.</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            A fresh graduate, a mid-career switcher, and a recruiter. Different problems, same tool.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                persona: 'Student',
                personaClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                initial: 'P',
                gradient: 'from-emerald-500 to-teal-600',
                name: 'Priya S.',
                role: 'Final-year B.Tech, CSE',
                context: 'Vellore, Tamil Nadu',
                quote: 'I had zero idea what a fresher resume should look like. The 7-section format and the glossary page explained every term my placement cell uses. Cleared TCS NQT Digital and got an Infosys SE offer with the same single-page resume.',
              },
              {
                persona: 'Working Professional',
                personaClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                initial: 'M',
                gradient: 'from-indigo-500 to-purple-600',
                name: 'Marcus C.',
                role: 'Senior Engineer switching roles',
                context: 'Bangalore',
                quote: 'The ATS score tool caught four missing keywords from the JD I was applying to. Fixed them in 15 minutes, applied, and got a first-round call the next day. Two years of cold applications before this, about zero responses. I feel slightly stupid for waiting.',
              },
              {
                persona: 'HR / Recruiter',
                personaClass: 'bg-amber-50 text-amber-700 border-amber-200',
                initial: 'A',
                gradient: 'from-amber-500 to-orange-600',
                name: 'Aisha P.',
                role: 'Talent Acquisition, SaaS',
                context: 'Screens 80+ resumes a week',
                quote: 'From the recruiter side, I can tell when a candidate built their resume here. Clean single-column format, keywords actually match the JD, dates parse correctly. Saves me about 20 seconds per resume, which adds up fast.',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.gradient} text-white font-bold flex items-center justify-center shrink-0`} aria-hidden>
                      {t.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${t.personaClass}`}>
                    {t.persona}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs text-gray-400 mt-4">{t.context}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-6 italic">
            Illustrative composite feedback drawn from user interviews. Named testimonials coming soon.
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
                q: 'How does ResumeBuildz compare to Zety or Canva?',
                a: 'Zety and Canva both lock you into a paid subscription after building. Canva\'s multi-column templates also break most ATS parsers. ResumeBuildz is free to build, free to download, open source, and every template is tested against real ATS parsers (Workday, Greenhouse, Lever).',
              },
              {
                q: 'What makes a resume ATS-friendly?',
                a: 'Single-column layout, standard section headings (Experience, Education, Skills), no images or graphics, PDF or DOCX format, and keyword density matching the job description. Our 12-point ATS check flags every violation. See the complete ATS guide for the deep dive.',
              },
              {
                q: 'Can I edit my resume later?',
                a: 'Yes. Your resume auto-saves to your browser as you type. Come back anytime from any device (with sign-in) or the same device (without sign-in) and keep editing.',
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
        </div>
      </section>

      {/* FAQPage schema for SEO / AI Overview capture */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Is ResumeBuildz really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The free plan gives you all 20 templates, 12 ATS checks, DOCX and HTML export, and guest mode. No credit card, no sign-up required.' } },
              { '@type': 'Question', name: 'Do I need to create an account?', acceptedAnswer: { '@type': 'Answer', text: 'No. ResumeBuildz works entirely in your browser with no sign-up. Your resume data stays in localStorage on your device.' } },
              { '@type': 'Question', name: 'Will my data be sold?', acceptedAnswer: { '@type': 'Answer', text: 'No. Your resume content lives in your browser and never leaves it unless you explicitly use the AI feature. Analytics are cookieless and aggregated. No ads, no data brokers.' } },
              { '@type': 'Question', name: 'How does ResumeBuildz compare to Zety or Canva?', acceptedAnswer: { '@type': 'Answer', text: 'ResumeBuildz is free to build, free to download, open source, and every template is tested against real ATS parsers (Workday, Greenhouse, Lever). Canva multi-column templates break most ATS parsers.' } },
              { '@type': 'Question', name: 'What makes a resume ATS-friendly?', acceptedAnswer: { '@type': 'Answer', text: 'Single-column layout, standard section headings, no images, PDF or DOCX format, and keyword density matching the job description. Our 12-point ATS check flags every violation.' } },
              { '@type': 'Question', name: 'Can I edit my resume later?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Your resume auto-saves to your browser as you type. Come back anytime and keep editing.' } },
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
