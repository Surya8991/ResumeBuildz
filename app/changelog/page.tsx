'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus, Zap, Tag, Rss } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { CHANGELOG } from '@/lib/changelogData';


export default function ChangelogPage() {
  useEffect(() => {
    document.title = 'Changelog - ResumeBuildz Updates';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ResumeBuildz version history and release notes. See all updates, new features, and improvements.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'ResumeBuildz version history and release notes. See all updates, new features, and improvements.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Changelog - ResumeBuildz Updates');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">Changelog</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            What&apos;s new in ResumeBuildz. Every feature, fix, and improvement in one place.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up delay-200">
            <Link
              href="/changelog/rss.xml"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full transition"
            >
              <Rss className="h-3 w-3" /> RSS feed
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full transition"
            >
              Roadmap
            </Link>
            <Link
              href="/status"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 hover:text-green-300 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full transition"
            >
              Status
            </Link>
          </div>
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
                <div key={entry.version} className={`relative md:pl-16 animate-slide-in-left delay-${Math.min((index + 1) * 100, 500)}`}>
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

      <SiteFooter />
    </div>
  );
}
