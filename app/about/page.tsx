'use client';

import Link from 'next/link';
import {
  FileText,
  Menu,
  X,
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
  BarChart3,
  Sparkles,
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

const TECH_STACK = [
  { icon: Globe, name: 'Next.js 16', desc: 'React framework with App Router' },
  { icon: Code, name: 'TypeScript', desc: 'Type-safe development' },
  { icon: Palette, name: 'Tailwind CSS', desc: 'Utility-first styling' },
  { icon: Database, name: 'Zustand', desc: 'Lightweight state management' },
  { icon: Layers, name: 'React-PDF', desc: 'Client-side PDF generation' },
  { icon: Zap, name: 'Groq AI', desc: 'AI writing assistance' },
  { icon: Layout, name: 'PWA', desc: 'Offline-capable web app' },
  { icon: Shield, name: 'Client-side Only', desc: 'No server, no data leaks' },
];

const STATS = [
  { num: '20', label: 'Resume Templates' },
  { num: '201', label: 'Industry Roles' },
  { num: '12', label: 'ATS Tools' },
  { num: '20', label: 'Industries' },
  { num: '0', label: 'Data Sent to Servers' },
  { num: '100%', label: 'Free Forever' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">About ResumeForge</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A free, open-source resume builder designed to help everyone create professional, ATS-optimized resumes.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-10 w-10 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Job seekers deserve access to professional resume tools without paywalls, sign-up barriers, or privacy trade-offs. ResumeForge was built to provide exactly that -- a completely free, fully private resume builder that runs entirely in your browser.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">100% Private</h3>
                <p className="text-gray-600 text-sm">Your data never leaves your browser. No tracking, no analytics.</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <UserX className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No Sign-up</h3>
                <p className="text-gray-600 text-sm">Start building immediately. No email, no account needed.</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              SL
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Surya L</h3>
            <p className="text-gray-600 mb-4">Full-Stack Developer</p>
            <p className="text-gray-600 text-sm mb-6">
              Passionate about building tools that make professional opportunities more accessible. ResumeForge is built with the belief that everyone deserves a great resume.
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tech Stack</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <tech.icon className="h-8 w-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                <p className="text-gray-600 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ExternalLink className="h-10 w-10 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Source</h2>
          <p className="text-gray-600 text-lg mb-8">
            ResumeForge is fully open-source. Browse the code, report issues, or contribute new features and templates on GitHub.
          </p>
          <a
            href="https://github.com/Surya8991/ResumeForge"
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
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">{s.num}</div>
                <div className="text-gray-600 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
