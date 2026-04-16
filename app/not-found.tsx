'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, Home, Search, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { COMPANIES } from '@/lib/resumeCompanyData';

// All pages a 404'd user might be looking for.
const SEARCHABLE = [
  { path: '/', title: 'Home' },
  { path: '/builder', title: 'Resume Builder' },
  { path: '/templates', title: 'Templates' },
  { path: '/pricing', title: 'Pricing' },
  { path: '/ats-guide', title: 'ATS Guide' },
  { path: '/resume-tips', title: 'Resume Tips' },
  { path: '/cover-letter', title: 'Cover Letter' },
  { path: '/blog', title: 'Blog' },
  { path: '/faq', title: 'FAQ' },
  { path: '/about', title: 'About' },
  { path: '/contact', title: 'Contact' },
  { path: '/changelog', title: 'Changelog' },
  { path: '/status', title: 'Status' },
  { path: '/roadmap', title: 'Roadmap' },
  ...BLOG_POSTS.map((p) => ({ path: `/${p.slug}`, title: p.title })),
  ...COMPANIES.map((c) => ({ path: `/resume-for/${c.slug}`, title: `Resume for ${c.name}` })),
];

export default function NotFound() {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return SEARCHABLE.filter(
      (e) => e.title.toLowerCase().includes(needle) || e.path.toLowerCase().includes(needle),
    ).slice(0, 8);
  }, [q]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-4 py-12">
      <div className="w-full max-w-xl">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            Resume<span className="text-blue-400">Buildz</span>
          </span>
        </Link>

        <h1 className="text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need:
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages, blog posts, company guides..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
            {results.map((r) => (
              <Link
                key={r.path}
                href={r.path}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0 text-sm"
              >
                <div>
                  <p className="text-white">{r.title}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{r.path}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {q.trim() && results.length === 0 && (
          <p className="text-sm text-gray-500 mb-6">No matches. Try &quot;resume&quot;, &quot;ATS&quot;, or a company name.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Browse Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
