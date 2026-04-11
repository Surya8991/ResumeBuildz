'use client';

import Link from 'next/link';
import { FileText, Menu, X, ExternalLink, Filter } from 'lucide-react';
import { useState } from 'react';
import { TEMPLATES } from '@/types/resume';

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

const STYLE_TAGS: Record<string, string> = {
  classic: 'Classic',
  modern: 'Modern',
  minimalist: 'Minimal',
  professional: 'Professional',
  executive: 'Professional',
  creative: 'Creative',
  compact: 'Minimal',
  tech: 'Modern',
  elegant: 'Classic',
  bold: 'Modern',
  academic: 'Classic',
  corporate: 'Professional',
  nordic: 'Minimal',
  gradient: 'Modern',
  timeline: 'Creative',
  sidebar: 'Modern',
  infographic: 'Creative',
  federal: 'Professional',
  startup: 'Creative',
  monochrome: 'Minimal',
};

const FILTER_OPTIONS = ['All', 'Classic', 'Modern', 'Creative', 'Minimal', 'Professional'];

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => STYLE_TAGS[t.name] === activeFilter);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">20 ATS-Friendly Templates</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Every template is designed to pass Applicant Tracking Systems while looking great on screen and in print.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Filter className="h-4 w-4 text-gray-400 shrink-0" />
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeFilter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="bg-gray-50 py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No templates match this filter.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((t) => (
                <div key={t.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                  <div className="h-44 relative" style={{ backgroundColor: t.primaryColor, opacity: 0.9 }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-white/60" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{t.label}</h3>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        {STYLE_TAGS[t.name]}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{t.description}</p>
                    <Link
                      href="/"
                      className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
