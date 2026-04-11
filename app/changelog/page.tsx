'use client';

import Link from 'next/link';
import { FileText, Menu, X, ExternalLink, Plus, Zap, Tag } from 'lucide-react';
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

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  added: string[];
  improved: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v1.3.0',
    date: 'April 11, 2026',
    title: 'PDF Import & Multi-Profile Support',
    added: [
      'PDF import support via pdfjs-dist -- upload existing PDF resumes and extract content automatically.',
      'Multiple resume profiles -- save up to 10 separate resume versions, each with its own data and template selection.',
      'Template preview modal with full-size preview before applying a template.',
      'Drag-and-drop entry reordering within Experience, Education, and Projects sections.',
    ],
    improved: [
      'Print CSS polish with color-adjust: exact, proper page-break rules, and consistent spacing across all templates.',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'April 11, 2026',
    title: 'UI Modernization',
    added: [],
    improved: [
      'Modernized help dialog with icons, card-based layout, and gradient header for a cleaner look.',
      'Modernized onboarding flow with progress bar, achievement badges, and larger action buttons.',
      'Updated README with expanded Getting Started instructions and inline changelog.',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'April 11, 2026',
    title: 'ATS Tools & AI Gap Analysis',
    added: [
      '12 ATS analysis tools: readability score, formatting checker, active voice detector, industry keywords matcher, section completeness, bullet point analyzer, quantification checker, verb strength analyzer, length optimizer, consistency checker, contact info validator, and file format advisor.',
      '20 industries with 201 roles and 25-30 keywords each for targeted keyword analysis.',
      'AI Gap Analysis powered by Groq -- identify missing skills and experience relative to job descriptions.',
      'HelpTip tooltips on all major sections to guide users through the resume building process.',
      'Custom section dropdown navigator for quick access to resume sections.',
      'Smart Matching suggestion triggered on job title input to recommend relevant keywords.',
      'Clickable contact links (email, phone, LinkedIn, GitHub) in all 20 templates.',
    ],
    improved: [
      'Navbar redesign with better navigation and branding.',
      'Footer update with improved layout and links.',
      'Text size adjustments across the application for better readability.',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'April 10, 2026',
    title: 'Initial Release',
    added: [
      'Initial release of ResumeForge.',
      '20 professionally designed resume templates, each ATS-optimized.',
      'AI writing assistant powered by Groq for generating summaries, bullet points, and cover letters.',
      'Cover letter builder with customizable templates.',
      'ATS score checker with job description keyword matching.',
      'Multi-format import: DOCX, TXT, HTML, and Markdown.',
      'Multi-format export: PDF, DOCX, and HTML.',
      'Dark mode and light mode with system preference detection.',
      'Progressive Web App (PWA) support for offline use.',
      'SEO optimization with meta tags and Open Graph support.',
      'Fully client-side -- no data ever leaves the browser.',
      'localStorage-based data persistence.',
      'Responsive design for desktop, tablet, and mobile.',
    ],
    improved: [],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Changelog</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            All notable changes and updates to ResumeForge, documented by version.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-20 flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

            <div className="space-y-12">
              {CHANGELOG.map((entry, index) => (
                <div key={entry.version} className="relative md:pl-16">
                  {/* Dot */}
                  <div className="absolute left-4 top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow hidden md:block" />

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <Tag className="h-3.5 w-3.5" />
                        {entry.version}
                      </span>
                      <span className="text-gray-500 text-sm">{entry.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{entry.title}</h3>

                    {entry.added.length > 0 && (
                      <div className="mb-4">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
                          <Plus className="h-4 w-4" /> Added
                        </h4>
                        <ul className="space-y-2">
                          {entry.added.map((item, i) => (
                            <li key={i} className="flex gap-2 text-gray-600 text-sm">
                              <span className="text-green-500 mt-1 shrink-0">&#8226;</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.improved.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                          <Zap className="h-4 w-4" /> Improved
                        </h4>
                        <ul className="space-y-2">
                          {entry.improved.map((item, i) => (
                            <li key={i} className="flex gap-2 text-gray-600 text-sm">
                              <span className="text-blue-500 mt-1 shrink-0">&#8226;</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
