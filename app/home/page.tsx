'use client';

import Link from 'next/link';
import {
  FileText,
  Sparkles,
  BarChart3,
  Shield,
  UserX,
  ExternalLink,
  Layout,
  CheckCircle,
  Download,
  PenTool,
  ArrowRight,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/about', label: 'About' },
  { href: '/changelog', label: 'Changelog' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-400" />
            <span className="text-white font-bold text-xl">ResumeForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white text-sm transition">
                {l.label}
              </Link>
            ))}
            <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Build Resume
            </Link>
          </div>
          <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="block text-gray-300 hover:text-white px-2 py-1 text-sm">
                {l.label}
              </Link>
            ))}
            <Link href="/" className="block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">
              Build Resume
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  const columns = [
    { title: 'Product', links: [{ label: 'Resume Builder', href: '/' }, { label: 'Templates', href: '/templates' }, { label: 'ATS Checker', href: '/' }, { label: 'Cover Letter', href: '/' }] },
    { title: 'Resources', links: [{ label: 'Changelog', href: '/changelog' }, { label: 'Documentation', href: '/' }, { label: 'Blog', href: '/' }, { label: 'FAQ', href: '/' }] },
    { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Contact', href: '/' }, { label: 'Careers', href: '/' }] },
    { title: 'Legal', links: [{ label: 'Privacy', href: '/' }, { label: 'Terms', href: '/' }, { label: 'Cookies', href: '/' }] },
  ];
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white text-sm transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold">ResumeForge</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com/Surya8991" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const FEATURES = [
  { icon: Layout, title: '20 Templates', desc: 'Professionally designed, ATS-optimized resume templates for every industry.' },
  { icon: Sparkles, title: 'AI Writing', desc: 'AI-powered bullet points, summaries, and cover letters via Groq.' },
  { icon: BarChart3, title: 'ATS Score', desc: '12 built-in analysis tools to maximize your resume ATS score.' },
  { icon: Shield, title: 'Privacy First', desc: 'All data stays in your browser. Nothing is ever sent to a server.' },
  { icon: UserX, title: 'No Sign-up', desc: 'Start building immediately. No account, no email, no friction.' },
  { icon: ExternalLink, title: 'Open Source', desc: 'Fully open-source on GitHub. Contribute, fork, or self-host.' },
];

const STEPS = [
  { num: '1', title: 'Fill Details', desc: 'Enter your experience, education, and skills.' },
  { num: '2', title: 'Choose Template', desc: 'Pick from 20 ATS-friendly templates.' },
  { num: '3', title: 'Check ATS', desc: 'Run 12 analysis tools to optimize your score.' },
  { num: '4', title: 'Export PDF', desc: 'Download your polished resume instantly.' },
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
  { name: 'Alex Rivera', role: 'Software Engineer at Google', text: 'ResumeForge helped me rewrite my resume in under 30 minutes. The ATS checker caught issues I never would have found on my own.' },
  { name: 'Priya Sharma', role: 'Marketing Manager', text: 'The templates are beautiful and the AI suggestions were surprisingly good. I landed 3 interviews in my first week.' },
  { name: 'James Chen', role: 'Recent Graduate', text: 'As a new grad with no budget, having a completely free tool with this level of quality was a game-changer.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Build ATS-Friendly Resumes in Minutes
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                20 professional templates, AI-powered writing, 12 ATS analysis tools, and a cover letter builder. 100% free, no sign-up required.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                  Build My Resume <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/templates" className="border border-gray-600 hover:border-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition">
                  View Templates
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-72 h-96 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-sm">Resume Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '20+', label: 'Templates' },
              { num: '201', label: 'Roles' },
              { num: '12', label: 'ATS Tools' },
              { num: '100%', label: 'Free' },
            ].map((s) => (
              <div key={s.label}>
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Everything You Need</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Professional resume tools that are completely free and private.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
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
            {SHOWCASE_TEMPLATES.map((t) => (
              <div key={t.name} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
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
                12 analysis tools ensure your resume passes through Applicant Tracking Systems.
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
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of job seekers who built their resume with ResumeForge.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition">
            Build My Resume Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
