'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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

const FEATURES = [
  { icon: Layout, title: '20 Templates', desc: 'Pick from 20 resume designs built to pass ATS filters and look great in print. Classic, modern, creative -- every style covered.' },
  { icon: Sparkles, title: 'AI Writing Help', desc: 'Stuck on bullet points? Our Groq-powered AI rewrites weak descriptions into results-driven statements in seconds.' },
  { icon: BarChart3, title: 'ATS Score Checker', desc: '12 analysis tools scan your resume for keyword gaps, formatting issues, and readability -- just like a real ATS would.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your resume data never leaves your browser. No servers, no tracking, no analytics. You own your data completely.' },
  { icon: UserX, title: 'No Sign-up Needed', desc: 'Start building immediately -- no account required. Sign in optionally to unlock Pro features.' },
  { icon: ExternalLink, title: 'Open Source', desc: 'Every line of code is on GitHub. Inspect it, fork it, self-host it, or contribute new templates.' },
];

const STEPS = [
  { num: '1', title: 'Add Your Info', desc: 'Type in your experience, education, and skills -- or import an existing resume.' },
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

const TESTIMONIALS = [
  { name: 'Alex R.', role: 'Software Engineer', text: 'I rewrote my resume in about 25 minutes. The ATS checker flagged that I was missing 4 keywords from the job description -- added them, applied, and got a callback the next day.' },
  { name: 'Priya S.', role: 'Marketing Manager', text: 'Honestly didn\'t expect a free tool to be this polished. The AI rewrote my bullet points with actual metrics, and I got 3 interview calls in my first week of applying.' },
  { name: 'James C.', role: '2024 CS Graduate', text: 'I\'d been using Google Docs for my resume. Switched to ResumeForge, ran the ATS check, and realized my old resume would\'ve been filtered out by most systems. Wish I found this sooner.' },
];

export default function HomePage() {
  useEffect(() => {
    document.title = 'ResumeForge - Free ATS Resume Builder with 20 Templates & AI';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Build professional, ATS-optimized resumes with 20 free templates, AI writing assistant, and real-time ATS scoring. No sign-up required.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Build professional, ATS-optimized resumes with 20 free templates, AI writing assistant, and real-time ATS scoring. No sign-up required.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'ResumeForge - Free ATS Resume Builder with 20 Templates & AI');
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
                Land More Interviews with ATS-Tested Resumes
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg animate-fade-in-up delay-100">
                75% of resumes get filtered by ATS before a human sees them <span className="text-gray-500 text-sm">(Jobscan, 2024)</span>. ResumeForge gives you 20 templates, AI writing help, and 12 ATS checks &mdash; free to start, no sign-up needed.
              </p>
              <div className="flex items-center justify-center gap-6 mb-6 animate-fade-in-up delay-200">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400'].map((color, i) => (
                      <div key={i} className={`h-8 w-8 rounded-full ${color} border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold`}>
                        {['S', 'M', 'A', 'R', 'K'][i]}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Trusted by 1,000+ job seekers</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
                <Link href="/builder" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                  Build My Resume <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/templates" className="border border-gray-600 hover:border-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition">
                  See All 20 Templates
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center animate-scale-in delay-300">
              <img src="/templates/modern.png" alt="Resume template preview" className="rounded-lg shadow-2xl border border-gray-700 max-h-[400px] object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '20', label: 'Templates' },
              { num: '201', label: 'Roles' },
              { num: '12', label: 'ATS Tools' },
              { num: 'Free', label: 'To Start' },
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4 animate-fade-in-up">Everything You Need to Land Interviews</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Professional resume tools -- templates, AI writing, ATS scoring -- without paying a dime or creating an account.
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
                <div className="h-40" style={{ backgroundColor: t.color, opacity: 0.85 }} />
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <Link href="/templates" className="text-blue-400 text-sm hover:underline">
                    View all templates
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
                Most companies use ATS software to filter resumes before a recruiter ever reads them. Our 12 built-in tools check your resume the same way an ATS does -- so you can fix problems before you hit &quot;apply.&quot;
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">ATS Score</h3>
                <span className="text-3xl font-bold text-blue-500">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '92%' }} />
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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What People Say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{t.text}</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up">Your Resume Shouldn&apos;t Be the Reason You Don&apos;t Get Hired</h2>
          <p className="text-gray-300 mb-8 text-lg animate-fade-in-up delay-100">
            Build a resume that actually passes ATS screening. It takes about 15 minutes and costs nothing.
          </p>
          <Link href="/builder" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition">
            Build My Resume Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
