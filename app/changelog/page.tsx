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
    version: 'v1.15.1',
    date: 'April 16, 2026',
    title: 'Codereview Pass #2 — 13 Findings Fixed',
    added: [],
    improved: [
      'Groq AI: GROQ_MODEL + fetch logic consolidated into single callGroqAI() helper. Removed 3 duplicate declarations and 3 duplicate fetch implementations (AISuggestions, CoverLetterForm, importResume).',
      'callGroqAI() now returns HTTP status on errors (for granular 401/429/402 handling) and accepts optional apiKey override.',
      'ResumePreview: overrideCSS sanitized via sanitizeCSS() that strips <script>, expression(), and url(javascript:) patterns.',
      'Clipboard: navigator.clipboard.writeText() wrapped in try/catch in AISuggestions and CoverLetterForm.',
      '/hero-preview and /loader-preview: noindex,nofollow now server-rendered via Next.js layout.tsx metadata. Removed client-side useEffect injection.',
      'LoaderCard: accepts size prop (sm/md). Loader7_BottomRightCard reuses shared component instead of duplicating markup.',
      'hero-preview: familyLabel correctly shows "Combined" with amber badge for combined-family options.',
      'Loader10_SparkleCursor: documented pointer-events constraint for production contexts.',
    ],
  },
  {
    version: 'v1.15.0',
    date: 'April 16, 2026',
    title: 'PageLoader Hardening (Codereview Pass)',
    added: [
      'Shared LoaderCard component used by both production PageLoader and the loader preview gallery (single source of truth for brand visuals).',
    ],
    improved: [
      'PageLoader: 8-second safety timeout auto-hides the loader if a navigation never completes. No more stuck overlays.',
      'PageLoader: respects prefers-reduced-motion via motion-safe: / motion-reduce: Tailwind variants.',
      'PageLoader: SVG <a> elements now type-guarded with instanceof check.',
      'PageLoader: relative URLs resolved correctly via new URL(href, location.href).',
      'PageLoader: aria-live="polite" + visually-hidden announcement for screen readers.',
      'PageLoaderOptions: all <style jsx> keyframes extracted to globals.css with loader- prefixed names to avoid collisions.',
      'PageLoaderOptions: Loader4_SkeletonCard now imports shared LoaderCard.',
      '/loader-preview and /hero-preview now noindex,nofollow with robots.txt disallow as defense-in-depth.',
    ],
  },
  {
    version: 'v1.14.0',
    date: 'April 15, 2026',
    title: 'Centered Skeleton Card Page Loader + Loader Preview',
    added: [
      '/loader-preview gallery with 10 page-loader animation options (Stripe, Vercel, Spotify, Apple, GitHub, Linear, Notion, Material Design inspirations).',
    ],
    improved: [
      'Page loader replaced with the centered skeleton card design (Option 4). Mirrors the homepage Fill7_Ultimate hero aesthetic so every page transition reinforces the resume-building brand metaphor.',
      'Top progress bar removed entirely. The new loader is a centered card on a soft white backdrop with skeletal resume bars filling in.',
      '150ms grace period before the loader shows — quick navigations that complete in under 150ms never flash the loader.',
    ],
  },
  {
    version: 'v1.13.0',
    date: 'April 15, 2026',
    title: 'Page Loader + Codereview Cleanup',
    added: [
      'Global page transition loader (PageLoader.tsx) wired into the root layout.',
      'Top blue gradient progress bar that trickles during navigation and snaps to 100% on completion.',
      'Floating mini "resume building" card in the bottom-right with skeletal bars filling in (matches the homepage hero aesthetic).',
      'Detects navigation start via global click listener on <a> elements; responds to browser back/forward via popstate; completes via usePathname.',
    ],
    improved: [
      'All 16 issues from the codereview pass fixed: WhatsNew APP_VERSION bumped to 1.12.0, ESLint enforcement moved to CI, setState-in-effect warnings resolved on login + CookieBanner + WhatsNew, hardcoded Vercel URL centralized via lib/siteConfig.ts (9 replacements), JSON-LD blocks consolidated via jsonLd() helper, unused SUPABASE_SERVICE_ROLE_KEY removed, MonochromeTemplate dead code removed, Fill4 type cast cleaned up, Fill7_Ultimate now pauses animations offscreen via IntersectionObserver, eslint-config silences <img> warnings for resume templates.',
      'Lint result: 0 errors, 13 warnings (down from 5 errors / 35 warnings).',
    ],
  },
  {
    version: 'v1.12.0',
    date: 'April 15, 2026',
    title: 'Ahrefs-style Blog Taxonomy + Mega-dropdown',
    added: [
      'Ahrefs-style 2-tier blog taxonomy: 4 parent groups (Resume & ATS, Job Search, India Hiring, Company Guides) containing 7 child clusters.',
      'New "Interviews & Cover Letters" category — closes the biggest content gap vs. every direct resume/career competitor.',
      'Cover Letter page added as a blog post in the new Interviews & Cover Letters cluster.',
      'PARENT_GROUPS array + parentGroup field in lib/blogCategories.ts with getCategoriesByParent helper.',
      'Mega-dropdown in the Resources navbar menu: 4-column grid on desktop, nested accordion on mobile.',
      'Parent-grouped blog hub at /blog showing categories under 4 pillar headers instead of a flat grid.',
    ],
    improved: [
      'Footer Blog column restructured into 3 visual groups matching the new parent taxonomy.',
      'Research-backed structure: HubSpot, Ahrefs, Indeed, Zety, Enhancv, Kickresume, Teal, LinkedIn Talent, Canva, Notion all studied. Ahrefs nested model picked as the only scalable approach for 7+ clusters.',
    ],
  },
  {
    version: 'v1.11.0',
    date: 'April 15, 2026',
    title: 'Project Renamed to ResumeBuildz + Navbar Restructure',
    added: [
      'Navbar Resources dropdown restructured with two nested sections: "Blog — topic clusters" (6 clusters) and "Help" (FAQ + Company Guides Hub).',
      'Blog column added to the footer (All Articles + 4 cluster pages + FAQ).',
    ],
    improved: [
      'Main nav simplified: Templates, Resources, About, Pricing, Contact. FAQ moved out of top-level nav into the Resources dropdown and the footer.',
      'Brand renamed from ResumeForge to ResumeBuildz across 43 files: metadata (titles, descriptions, OG/Twitter tags), JSON-LD publisher, brand logo in navbar/footer/login/builder/404, all in-page copy, testimonials, manifest.json, llms.txt, README, CONTRIBUTING, SECURITY, LICENSE, .env.example, and every blog/resources/situation/company page.',
      'package.json name changed from "resumeforge" to "resumebuildz".',
      'Historical CHANGELOG entries rewritten for brand consistency (no historical inaccuracy — same product, new name).',
      'localStorage keys kept as `resumeforge-*` intentionally to preserve existing user data.',
      'Vercel deployment URL and GitHub repo URL unchanged — rename those via dashboard/settings to complete the migration.',
    ],
  },
  {
    version: 'v1.10.0',
    date: 'April 15, 2026',
    title: 'Blog Section with Topic Clusters + Ultimate Hero',
    added: [
      'Blog hub at /blog with featured strip, topic-cluster cards, and filterable post grid.',
      'Dynamic /blog/category/[category] route with 6 topic clusters: Resume Writing, ATS & Keywords, Career Transitions, India Hiring, Company Deep Dives, AI Resume Tools.',
      'lib/blogCategories.ts and lib/blogPosts.ts — central registries for the blog. Existing situation pages retain their URLs and appear as blog posts in the right cluster.',
      'Ultimate hero on the homepage (Fill7_Ultimate): mouse-tracked 3D parallax tilt with the resume card, ATS score chip, and suggestion popups all at different translateZ depths. Filling animation + score climb + suggestion resolve + ATS-READY badge + cursor highlight sweep.',
      'Combined hero (Fill6_Combined) kept as option 11 in the preview gallery.',
      'Sitemap expanded with /blog + 6 category URLs.',
    ],
    improved: [
      'Resources dropdown in navbar now points to blog categories instead of flat page links.',
      'Homepage hero upgraded from static PNG → Fill6_Combined → Fill7_Ultimate.',
    ],
  },
  {
    version: 'v1.9.0',
    date: 'April 15, 2026',
    title: 'Article Scaffolding, Deep Content & Hero Preview Gallery',
    added: [
      'Sticky TOC (desktop sidebar + mobile accordion) on all 28 long-form pages.',
      'Breadcrumbs + JSON-LD BreadcrumbList schema on every content page.',
      'ArticleMeta bar with author, reading time, last updated, and fact-checked badge.',
      'JSON-LD Article + FAQPage + HowTo schemas for rich Google results.',
      'Scroll progress bar and back-to-top button (scoped to long-form pages only).',
      '5 new sections on every company page: cover letter template, interview questions, red flags, salary benchmarks, referral strategy.',
      'Email templates on situation pages (layoff networking, pivot outreach, career gap explanation).',
      'Comparison table on fresher resume page (chronological vs functional vs hybrid).',
      '10-term glossary on fresher resume page (ATS, CGPA, DSA, NQT, InfyTQ, NTH, OT, GD, PPT, CTC).',
      'Composite case studies on every situation page (Priya, Rohan, Arjun, Meera, Nikhil).',
      'Hero preview gallery at /hero-preview with 10 variations (5 tilt + 5 fill) for homepage hero selection.',
      'lib/resumeCompanyDataDeep.ts with 4 new content fields per company entry.',
      'lib/articleSchema.ts with pure helper functions for building JSON-LD graphs.',
    ],
    improved: [
      'Scroll progress bar moved out of global layout — now only renders on blog + resources/long-form pages, not on homepage, builder, or marketing pages.',
      'Every remaining direct /builder link replaced with useLoginGateway() pattern (not-found, ats-guide, cover-letter).',
      'Sitemap covers all new URLs. Homepage now has lower visual noise at rest.',
    ],
  },
  {
    version: 'v1.8.0',
    date: 'April 14, 2026',
    title: 'SEO Expansion: 22 Company Guides + 6 Situation Pages',
    added: [
      'Company resume guides hub at /resume-for with 22 curated employers (10 global + 12 India).',
      'Dynamic /resume-for/[company] route with 22 statically generated pages (Google, Amazon, Microsoft, Meta, Apple, Deloitte, McKinsey, Goldman Sachs, JP Morgan, Accenture, TCS, Infosys, Wipro, Flipkart, Zomato, Swiggy, Zoho, BYJU\'S, PhonePe, Razorpay, Freshworks, Ola).',
      'Each company page includes 15 ATS keywords, 5 insider tips, recommended template, and 4 related guides for cross-linking.',
      'Fresher Resume Format (/fresher-resume) with 7-section format and 6 rules.',
      'Campus Placement Resume (/campus-placement-resume) with 10-point checklist for TCS NQT, Infosys InfyTQ, Wipro NTH.',
      'Naukri.com Resume Tips (/naukri-resume-tips) - 8 tips to 3x recruiter views.',
      'Resume After Layoff (/resume-after-layoff) with 5-step recovery framework.',
      'Resume After Career Gap (/resume-after-career-gap) with 6 wording examples.',
      'Resume for Career Change (/resume-for-career-change) with 5-step pivot framework + 6 common pivots.',
      'Resources dropdown in navbar exposing all 9 new resource pages on desktop and mobile.',
      'Sitemap updated to include all 29 new URLs (1 hub + 22 companies + 6 situations).',
    ],
    improved: [
      'SiteNavbar layout: Templates link is now the first item, followed by a Resources dropdown.',
      'lib/resumeCompanyData.ts ships as fully static data so all 22 company pages prerender at build time (zero runtime cost).',
    ],
  },
  {
    version: 'v1.7.0',
    date: 'April 14, 2026',
    title: 'Analytics, Privacy Compliance & Page Review',
    added: [
      'Vercel Web Analytics (cookieless, GDPR-safe, free on Hobby plan).',
      'README section listing 3 free analytics alternatives (Cloudflare, Umami, PostHog).',
      'Login Gateway expanded to all builder CTAs across all pages.',
      'Paste Import workflow for LinkedIn or any plain text resume.',
      'Cookie consent banner (GDPR safety net).',
      'HowTo schema for ATS Guide page (better Google rich results).',
    ],
    improved: [
      'Privacy Policy rewritten for accuracy with new analytics + auth + waitlist.',
      'Terms of Use Section 3 updated to describe data handling correctly.',
      'Homepage Privacy First card no longer claims "no analytics".',
      'About page mission statement, stats, and tech stack updated.',
      'Template Showcase on homepage now uses real template thumbnails.',
      'Navbar removed "Resume Builder" link to fix 1024px overflow.',
      'Navbar items now use whitespace-nowrap to prevent text wrapping.',
      'Contact form now opens user email client via mailto (no fake submission).',
      'Removed em dashes and double hyphens from all user-facing copy.',
    ],
  },
  {
    version: 'v1.6.0',
    date: 'April 14, 2026',
    title: 'Undo/Redo, Shortcuts & Polish',
    added: [
      'Undo/Redo system with 50-snapshot history. Ctrl+Z to undo, Ctrl+Y or Ctrl+Shift+Z to redo.',
      'Keyboard shortcuts: Ctrl+E for PDF export, Ctrl+1-5 to jump tabs.',
      'Login Gateway modal on Build Resume CTAs (Sign In or Continue as Guest).',
      'Email verification banner in builder for unverified users.',
      'Resume import rollback: snapshot before import, restore on failure.',
      'BreadcrumbList JSON-LD schema on ATS Guide page.',
      'Section visibility hint on Languages form.',
      'lib/validation.ts: shared email/phone/url/length validators.',
      'lib/parserConfig.ts: extracted parser regex patterns for maintenance.',
    ],
    improved: [
      'Debounced localStorage writes (1s) reduce battery drain on mobile.',
      'next/image for hero and template thumbnails (better LCP).',
      'React.memo on ResumePreview prevents re-renders on every keystroke.',
      'Weighted completion score by importance (15% name, 12% summary, etc).',
      'Loading states on export use try/finally instead of setTimeout.',
      'Touch swipe ignores inputs, draggable, and vertical scrolls.',
      'AI error handling: granular messages for 401, 429, 402, 403, malformed JSON.',
      'Photo upload MIME validation (no SVG XSS vector).',
      'DragEnd handlers validate findIndex returns to prevent silent bugs.',
      'Em dashes and double hyphens removed from all user-facing copy.',
      'Real diverse names in homepage avatars instead of placeholder letters.',
      'Stat citations added to homepage and other pages.',
    ],
  },
  {
    version: 'v1.5.0',
    date: 'April 13, 2026',
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
      'Skill suggestions based on your job title. Pulls from data covering 201 roles across 20 industries.',
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
      'PDF import. Upload an existing PDF resume and ResumeBuildz extracts the content automatically.',
      'Multiple resume profiles. Save up to 10 different resume versions, each with its own data and template.',
      'Template preview. See a full-size preview of any template before applying it.',
      'Drag-and-drop reordering for Experience, Education, and Projects entries.',
    ],
    improved: [
      'Better print quality. Colors, page breaks, and spacing now look consistent across all 20 templates when printing.',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'March 14, 2026',
    title: 'UI Modernization',
    added: [],
    improved: [
      'Redesigned help dialog. Now uses icons and cards for easier navigation.',
      'Improved onboarding flow with a progress bar and clearer action buttons.',
      'Updated documentation with expanded Getting Started instructions.',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'February 22, 2026',
    title: 'ATS Tools & AI Gap Analysis',
    added: [
      '12 ATS analysis tools that check readability, formatting, active voice, keywords, section completeness, bullet points, metrics, verb strength, length, consistency, contact info, and file format.',
      'Industry keyword database covering 20 industries and 201 roles with 25-30 targeted keywords each.',
      'AI Gap Analysis. Paste a job description and see what skills and experience you\'re missing.',
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
      'Initial release of ResumeBuildz.',
      '20 professionally designed resume templates, each ATS-optimized.',
      'AI writing assistant powered by Groq for generating summaries, bullet points, and cover letters.',
      'Cover letter builder with customizable templates.',
      'ATS score checker with job description keyword matching.',
      'Multi-format import: DOCX, TXT, HTML, and Markdown.',
      'Multi-format export: PDF, DOCX, and HTML.',
      'Dark mode and light mode with system preference detection.',
      'Progressive Web App (PWA) support for offline use.',
      'SEO optimization with meta tags and Open Graph support.',
      'Fully client-side. No data ever leaves the browser.',
      'localStorage-based data persistence.',
      'Responsive design for desktop, tablet, and mobile.',
    ],
    improved: [],
  },
];

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
