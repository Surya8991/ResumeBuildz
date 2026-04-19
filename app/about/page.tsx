'use client';

import { useEffect } from 'react';
import {
  ExternalLink,
  Heart,
  Shield,
  UserX,
  Globe,
  Code,
  Palette,
  Database,
  Layers,
  Zap,
  Layout,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

const TECH_STACK = [
  { icon: Globe, name: 'Next.js 16', desc: 'React framework with App Router' },
  { icon: Code, name: 'TypeScript', desc: 'Type-safe development' },
  { icon: Palette, name: 'Tailwind CSS', desc: 'Utility-first styling' },
  { icon: Database, name: 'Zustand', desc: 'Lightweight state management' },
  { icon: Layers, name: 'React-PDF', desc: 'Client-side PDF generation' },
  { icon: Zap, name: 'Groq AI', desc: 'AI writing assistance' },
  { icon: Layout, name: 'PWA', desc: 'Offline-capable web app' },
  { icon: Shield, name: 'Client-side First', desc: 'Resume data stays in your browser' },
];

const STATS = [
  { num: '20', label: 'Resume Templates' },
  { num: '201', label: 'Industry Roles' },
  { num: '12', label: 'ATS Tools' },
  { num: '20', label: 'Industries' },
  { num: 'Free', label: 'To Start' },
  { num: 'Open', label: 'Source' },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About ResumeBuildz - Free Open Source Resume Builder';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ResumeBuildz is a free, open-source, privacy-first resume builder. Built with Next.js 16 by Surya L. No data leaves your browser.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'ResumeBuildz is a free, open-source, privacy-first resume builder. Built with Next.js 16 by Surya L. No data leaves your browser.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'About ResumeBuildz - Free Open Source Resume Builder');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">About ResumeBuildz</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            A free-to-start, open-source resume builder. Privacy-friendly, browser-first, and built to help you write a resume that actually gets past ATS.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-10 w-10 text-blue-400 mx-auto mb-6 animate-fade-in" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in-up delay-100">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Most resume builders charge $20 to $40 per month, require your email, and store your personal data on their servers. That felt wrong. ResumeBuildz exists because job seekers shouldn&apos;t have to pay or surrender their privacy just to write a decent resume. Your resume content runs entirely in your browser. We never see what you type.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-100">
                <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Privacy First</h3>
                <p className="text-gray-600 text-sm">Resume data stays in your browser. We use cookieless analytics only.</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-200">
                <UserX className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No Sign-up</h3>
                <p className="text-gray-600 text-sm">Start building immediately. No email, no account needed.</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-300">
                <ExternalLink className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Open Source</h3>
                <p className="text-gray-600 text-sm">View, fork, or contribute to the source code on GitHub.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Created By</h2>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              SL
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Surya L</h3>
            <p className="text-gray-600 mb-4">Full-Stack Developer</p>
            <p className="text-gray-600 text-sm mb-6">
              I built ResumeBuildz because I was frustrated with existing resume tools. They either cost too much, required sign-ups, or uploaded my data to unknown servers. So I made the tool I wished existed: free, private, and actually good.
            </p>
            <a
              href="https://github.com/Surya8991"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              <ExternalLink className="h-4 w-4" /> View GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Built with Modern, Fast Tech</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Every choice was made for one reason: to give you a faster, more private resume builder than anything else out there.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECH_STACK.map((tech, i) => (
              <div key={tech.name} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
                <tech.icon className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                <p className="text-gray-600 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Our principles</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Five commitments that shape every product decision. If we ever break one, we owe you an explanation.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { n: '01', t: 'Free to start, forever', b: 'The build + export loop is free. No paywalled downloads, no watermarks, no 14-day trials that renew at Rs 2,000/month. Pro exists for unlimited AI rewrites and heavy-use features; the core tool stays free.' },
              { n: '02', t: 'Your data stays yours', b: 'Resume content lives in your browser\'s localStorage by default. Sign-in is opt-in, and even then we store the minimum needed to sync across devices. We never sell data, never feed it to third-party recruiter networks, never use it to train models.' },
              { n: '03', t: 'ATS-first, always', b: 'Every template we ship is parsed and tested against real ATS (Workday, Greenhouse, Lever, iCIMS, Taleo). Pretty designs that fail parsers get rejected in review. Function before flourish.' },
              { n: '04', t: 'Honest AI', b: 'AI assists writing; it does not invent. Our rewrites use your actual bullet context so they never hallucinate metrics. If we cannot make a feature reliably honest, we do not ship it.' },
              { n: '05', t: 'Open and inspectable', b: 'Full source code on GitHub. Anyone can audit what runs in your browser, fork the project, contribute templates, or self-host. Transparency is not marketing; it is the default.' },
            ].map((p) => (
              <div key={p.n} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-bold text-blue-500 tracking-wider mb-2">{p.n}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{p.t}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">What makes us different</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">A honest comparison with the resume builders most people recognise. We will not pretend to be strictly better than every option; we will explain the tradeoffs.</p>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Feature</th>
                  <th className="text-left p-3 font-semibold text-blue-600 border-b border-gray-200">ResumeBuildz</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Zety / Resume.io</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Canva</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr className="border-b border-gray-100"><td className="p-3 font-medium">Free PDF download</td><td className="p-3 text-emerald-700">Yes, unlimited</td><td className="p-3 text-rose-700">Paywalled</td><td className="p-3 text-amber-700">Limited templates</td></tr>
                <tr className="border-b border-gray-100"><td className="p-3 font-medium">Data privacy</td><td className="p-3 text-emerald-700">localStorage first</td><td className="p-3 text-amber-700">Server-side default</td><td className="p-3 text-amber-700">Server-side</td></tr>
                <tr className="border-b border-gray-100"><td className="p-3 font-medium">ATS-tested templates</td><td className="p-3 text-emerald-700">All 20</td><td className="p-3 text-amber-700">Claimed, varies</td><td className="p-3 text-rose-700">Most fail ATS</td></tr>
                <tr className="border-b border-gray-100"><td className="p-3 font-medium">AI bullet rewrites</td><td className="p-3 text-emerald-700">Yes, context-aware</td><td className="p-3 text-emerald-700">Yes, generic</td><td className="p-3 text-rose-700">No</td></tr>
                <tr className="border-b border-gray-100"><td className="p-3 font-medium">Open source</td><td className="p-3 text-emerald-700">Yes, on GitHub</td><td className="p-3 text-rose-700">Proprietary</td><td className="p-3 text-rose-700">Proprietary</td></tr>
                <tr className="border-b border-gray-100"><td className="p-3 font-medium">Cover letter builder</td><td className="p-3 text-emerald-700">Matching design</td><td className="p-3 text-emerald-700">Bundled</td><td className="p-3 text-amber-700">Separate</td></tr>
                <tr><td className="p-3 font-medium">Where paid is better</td><td className="p-3 text-gray-600">Unlimited AI, priority support</td><td className="p-3 text-gray-600">Larger template library</td><td className="p-3 text-gray-600">Rich visual design</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">For a deeper, independent comparison: <a href="/best-free-resume-builder" className="text-blue-600 hover:underline">Free vs paid builders 2026</a>.</p>
        </div>
      </section>

      {/* Open Source */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ExternalLink className="h-10 w-10 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Source</h2>
          <p className="text-gray-600 text-lg mb-8">
            ResumeBuildz is fully open-source. Browse the code, report issues, or contribute new features and templates on GitHub.
          </p>
          <a
            href="https://github.com/Surya8991/ResumeBuildz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <ExternalLink className="h-5 w-5" /> View on GitHub
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((s, i) => (
              <div key={s.label} className={`text-center animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
                <div className="text-3xl font-bold text-blue-500 mb-1">{s.num}</div>
                <div className="text-gray-600 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
