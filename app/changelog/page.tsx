'use client';

import { useEffect } from 'react';
import { Plus, Zap, Tag } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  added: string[];
  improved: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v1.5.0',
    date: 'April 14, 2026',
    title: 'Auth, Pricing & Pro Plans',
    added: [
      'Supabase authentication with Google OAuth and email/password sign-in.',
      'Profile dropdown with avatar, Manage Plan, Reset Password, and Sign Out.',
      'Pricing page with 5 tiers: Free, Starter ($5), Pro ($9), Team ($19), Lifetime ($49).',
      'Freemium gates: 1 AI rewrite/day and 3 PDF exports/day on free tier.',
      'Toast notification system for actions, warnings, and Pro upgrades.',
      'Waitlist email capture on pricing page for Pro launch notifications.',
      'GDPR controls: Export My Data and Delete Account in profile dropdown.',
      'Terms of Use page with detailed legal sections.',
      '404 page with helpful navigation to popular pages.',
      'Month picker for date fields (Experience, Education, Projects, Certifications).',
    ],
    improved: [
      'Security headers: HSTS, X-Frame-Options, Permissions-Policy.',
      'Email verification now required for Pro features.',
      'Builder toolbar: text labels for Import, Reset, and Dark mode buttons.',
      'Builder header: user avatar, name, and last-edited indicator.',
      'Navbar: profile dropdown visible on all screen sizes.',
      'SEO: dynamic robots.ts, sitemap.ts, OG image, and Organization schema.',
    ],
  },
  {
    version: 'v1.4.0',
    date: 'April 11, 2026',
    title: 'Skill Suggestions, Auth & Pricing',
    added: [
      'Skill suggestions based on your job title -- pulls from data covering 201 roles across 20 industries.',
      'Smooth page animations throughout the app for a more polished feel.',
      'Section completion dots so you can see which parts of your resume are done at a glance.',
      'Cover letter now auto-fills your job title from your personal info.',
      'Export buttons show loading state so you know when your file is being generated.',
      'Profile manager now accessible from the bottom bar on mobile devices.',
    ],
    improved: [
      'Improved skill matching accuracy (prefix stripping, quality scoring).',
      'Fixed Help/Profile button visibility in light mode.',
      'Comprehensive monetization plan document.',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'March 28, 2026',
    title: 'PDF Import & Multi-Profile Support',
    added: [
      'PDF import -- upload an existing PDF resume and ResumeForge extracts the content automatically.',
      'Multiple resume profiles -- save up to 10 different resume versions, each with its own data and template.',
      'Template preview -- see a full-size preview of any template before applying it.',
      'Drag-and-drop reordering for Experience, Education, and Projects entries.',
    ],
    improved: [
      'Better print quality -- colors, page breaks, and spacing now look consistent across all 20 templates when printing.',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'March 14, 2026',
    title: 'UI Modernization',
    added: [],
    improved: [
      'Redesigned help dialog -- now uses icons and cards for easier navigation.',
      'Improved onboarding flow with a progress bar and clearer action buttons.',
      'Updated documentation with expanded Getting Started instructions.',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'February 22, 2026',
    title: 'ATS Tools & AI Gap Analysis',
    added: [
      '12 ATS analysis tools -- checks readability, formatting, active voice, keywords, section completeness, bullet points, metrics, verb strength, length, consistency, contact info, and file format.',
      'Industry keyword database covering 20 industries and 201 roles with 25-30 targeted keywords each.',
      'AI Gap Analysis -- paste a job description and see what skills and experience you\'re missing.',
      'Helpful tooltips throughout the app explaining what each section is for.',
      'Section dropdown navigator so you can jump to any resume section quickly.',
      'Smart keyword suggestions that appear when you enter your job title.',
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
    date: 'February 1, 2026',
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
  useEffect(() => {
    document.title = 'Changelog - ResumeForge Updates';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ResumeForge version history and release notes. See all updates, new features, and improvements.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'ResumeForge version history and release notes. See all updates, new features, and improvements.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Changelog - ResumeForge Updates');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">Changelog</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            What&apos;s new in ResumeForge. Every feature, fix, and improvement in one place.
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
