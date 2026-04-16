// Shared changelog source of truth. Consumed by:
//   - app/changelog/page.tsx (rendered UI)
//   - app/changelog/rss.xml/route.ts (RSS feed)
// Keep it in sync with CHANGELOG.md on every release.

export interface ChangelogEntry {
  version: string;
  date: string; // human-readable ("April 16, 2026")
  isoDate?: string; // RFC-822-friendly ISO date for RSS (YYYY-MM-DD)
  title: string;
  added: string[];
  improved: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v1.19.0',
    date: 'April 16, 2026',
    isoDate: '2026-04-16',
    title: 'Security Hardening — 10 Cybersecurity Fixes',
    added: [
      'Content-Security-Policy header with frame-ancestors none, strict default-src, allowlisted connect-src.',
      'In-memory rate limiter (lib/rateLimit.ts) — 10 sessions/hour/IP on /api/checkout.',
      'CSRF defense: Origin verification on /api/checkout rejects cross-origin POSTs.',
      'Photo upload magic-byte validation (lib/imageMagic.ts) — MIME spoofing no longer accepted.',
      'maxLength support in RichTextarea + 2000-char cap on summary.',
      'Referrer-Policy: no-referrer on /r/* share pages.',
      'Stripe webhook signature stub with 4 event-type routing at /api/stripe/webhook.',
      'BYOK security warning banner in AI tab (XSS/extension risk + rotation guidance).',
      'Production-safe logger (lib/logger.ts) scrubs password/token/secret/api_key/auth/cookie keys.',
    ],
    improved: [
      'Narrowed Supabase middleware matcher to /builder, /auth/*, /api/*, /login, /pricing. Marketing pages no longer hit auth refresh.',
      'Added Cross-Origin-Opener-Policy + Cross-Origin-Resource-Policy headers.',
      '/pdfjs/ worker served with correct Content-Type and 1-year immutable cache.',
      'useAuth, useCloudSync, proxy, webhook handler all use logger instead of console.',
    ],
  },
  {
    version: 'v1.18.0',
    date: 'April 16, 2026',
    isoDate: '2026-04-16',
    title: '8 Roadmap Features: LinkedIn Import, Versions, Share, JD Tailor, Diff, Tones, Trend',
    added: [
      'PDF.js worker bundled locally — PDF import now works behind corporate firewalls that block unpkg CDN.',
      'LinkedIn JSON import — auto-detects LinkedIn Data Export, Voyager API, and JSON Resume formats.',
      'Resume version history — up to 30 named snapshots, auto-save hourly, one-click restore with pre-restore backup.',
      'Shareable read-only link /r#<payload> — gzip+base64url encoded, zero backend, no PII leaves the browser.',
      'JD-tailored rewrite in AI tab — paste JD, AI rewrites summary + top bullets with side-by-side diff preview.',
      'Resume diff viewer — word-level LCS diff, inline or side-by-side rendering.',
      'Cover letter tone variants — Professional, Formal, Casual, Concise with per-tone temperature tuning.',
      'ATS score trend — SVG sparkline of score history with debounced snapshots.',
    ],
    improved: [
      'Toolbar gains LinkedIn, Versions, and Share buttons (desktop).',
      'New shared libs: shareLink.ts, diffText.ts, atsTrend.ts, versionHistory.ts, importLinkedIn.ts.',
      'JD tailor and LinkedIn import both auto-snapshot to version history before applying.',
    ],
  },
  {
    version: 'v1.17.0',
    date: 'April 16, 2026',
    isoDate: '2026-04-16',
    title: 'Feature Shipping: Markdown/Text Export, Streaming AI, Shortcuts, RSS',
    added: [
      'Markdown export (.md) — dev-friendly, GitHub-renderable resume dumps.',
      'ATS plain-text export (.txt) — pure UTF-8 for Workday/Greenhouse/Naukri paste boxes.',
      'Streaming AI: streamGroqAI() with SSE parser. Cover letter now streams live instead of 3-5s blank wait.',
      'Keyboard shortcut cheatsheet dialog (Ctrl+/ or ?). Shows all 11 shortcuts grouped by category.',
      'Last-edited timestamp in builder footer ("Saved 2m ago"). Auto-refreshes every 30s.',
      '404 page with live search across all pages, blog posts, and company guides.',
      'ShareButton component on blog posts — copy link + LinkedIn/X/email intents.',
      'Changelog RSS feed at /changelog/rss.xml for power users.',
      'Status page at /status (service health dashboard).',
      'Roadmap page at /roadmap (public feature tracker).',
      'Sitemap auto-discovers blog posts from lib/blogPosts.ts registry.',
      'Dark mode now persists across sessions via localStorage and init-before-paint script.',
    ],
    improved: [
      'Removed duplicate Ctrl+E shortcut (previously bound to the same PDF export as Ctrl+P).',
      'Footer shortcut hint ("⌨ Shortcuts") for discoverability on desktop.',
      'Changelog data extracted to lib/changelogData.ts as single source for page + RSS.',
    ],
  },
  {
    version: 'v1.16.0',
    date: 'April 16, 2026',
    isoDate: '2026-04-16',
    title: 'Full-Project Codereview — 40+ Findings Fixed',
    added: [
      'safePhotoSrc(): rejects remote photo URLs — only data:image/* allowed. Wired into ResumePreview for all 20 templates.',
      'safePrimaryColor(): validates hex format before CSS interpolation. Wired into ResumePreview.',
      'ensureUrl() blocks javascript:, data:, and vbscript: URI schemes.',
    ],
    improved: [
      'Security: callGroqAI wrapped in try/catch/finally in ATSScoreChecker, AISuggestions, and CoverLetterForm. No more permanent loading on network failure.',
      'Security: fetchProfile uses explicit select() instead of select(*), logs errors. exportUserData picks only safe fields.',
      'Bugs: SectionReorder indexOf guard, .doc import clear error, AI JSON schema validation, DateConsistency null check.',
      'Bugs: InfographicTemplate deterministic skill bars, ModernTemplate custom sections, exportDocx/Html empty date handling.',
      'Bugs: PasteImportModal 100k limit enforced, MultiJDMatching collision-safe IDs, BoldTemplate "to" → "-", MonochromeTemplate empty proficiency.',
      'UX: deleteProfile + ErrorBoundary require confirm(). Toast ARIA live region. Contact form honest success text.',
      'Cleanup: Removed dead SiteNavbar branch, redundant preconnect links. localStorage try/catch in WhatsNew + OnboardingGuide.',
      'siteConfig.ts fallback URL updated to resumebuildz.vercel.app.',
    ],
  },
  {
    version: 'v1.15.1',
    date: 'April 16, 2026',
    isoDate: '2026-04-16',
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
    isoDate: '2026-04-16',
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
    isoDate: '2026-04-15',
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
    isoDate: '2026-04-15',
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
    isoDate: '2026-04-15',
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
    isoDate: '2026-04-15',
    title: 'Project Renamed to ResumeBuildz + Navbar Restructure',
    added: [
      'Navbar Resources dropdown restructured with two nested sections: "Blog — topic clusters" (6 clusters) and "Help" (FAQ + Company Guides Hub).',
      'Blog column added to the footer (All Articles + 4 cluster pages + FAQ).',
    ],
    improved: [
      'Main nav simplified: Templates, Resources, About, Pricing, Contact. FAQ moved out of top-level nav into the Resources dropdown and the footer.',
      'Brand renamed from ResumeForge to ResumeBuildz across 43 files.',
      'package.json name changed from "resumeforge" to "resumebuildz".',
    ],
  },
  {
    version: 'v1.10.0',
    date: 'April 15, 2026',
    isoDate: '2026-04-15',
    title: 'Blog Section with Topic Clusters + Ultimate Hero',
    added: [
      'Blog hub at /blog with featured strip, topic-cluster cards, and filterable post grid.',
      'Dynamic /blog/category/[category] route with 6 topic clusters.',
      'Ultimate hero on the homepage (Fill7_Ultimate) with 3D parallax tilt.',
      'Sitemap expanded with /blog + 6 category URLs.',
    ],
    improved: [
      'Resources dropdown in navbar now points to blog categories instead of flat page links.',
    ],
  },
  {
    version: 'v1.9.0',
    date: 'April 15, 2026',
    isoDate: '2026-04-15',
    title: 'Article Scaffolding, Deep Content & Hero Preview Gallery',
    added: [
      'Sticky TOC (desktop sidebar + mobile accordion) on all 28 long-form pages.',
      'Breadcrumbs + JSON-LD BreadcrumbList schema on every content page.',
      'JSON-LD Article + FAQPage + HowTo schemas for rich Google results.',
      'Scroll progress bar and back-to-top button (scoped to long-form pages only).',
    ],
    improved: [
      'Sitemap covers all new URLs. Homepage now has lower visual noise at rest.',
    ],
  },
  {
    version: 'v1.8.0',
    date: 'April 14, 2026',
    isoDate: '2026-04-14',
    title: 'SEO Expansion: 22 Company Guides + 6 Situation Pages',
    added: [
      'Company resume guides hub at /resume-for with 22 curated employers (10 global + 12 India).',
      'Dynamic /resume-for/[company] route with 22 statically generated pages.',
      '6 situation-specific pages: fresher, campus placement, Naukri tips, post-layoff, career gap, career change.',
      'Resources dropdown in navbar exposing all 9 new resource pages.',
    ],
    improved: [
      'SiteNavbar layout: Templates link is now the first item, followed by a Resources dropdown.',
    ],
  },
  {
    version: 'v1.7.0',
    date: 'April 14, 2026',
    isoDate: '2026-04-14',
    title: 'Analytics, Privacy Compliance & Page Review',
    added: [
      'Vercel Web Analytics (cookieless, GDPR-safe, free on Hobby plan).',
      'Login Gateway expanded to all builder CTAs across all pages.',
      'Paste Import workflow for LinkedIn or any plain text resume.',
      'Cookie consent banner (GDPR safety net).',
    ],
    improved: [
      'Privacy Policy rewritten for accuracy.',
      'About page mission statement, stats, and tech stack updated.',
    ],
  },
  {
    version: 'v1.6.0',
    date: 'April 14, 2026',
    isoDate: '2026-04-14',
    title: 'Undo/Redo, Shortcuts & Polish',
    added: [
      'Undo/Redo system with 50-snapshot history.',
      'Keyboard shortcuts: Ctrl+E for PDF export, Ctrl+1-5 to jump tabs.',
      'Login Gateway modal on Build Resume CTAs.',
      'Email verification banner in builder for unverified users.',
    ],
    improved: [
      'Debounced localStorage writes (1s) reduce battery drain on mobile.',
      'React.memo on ResumePreview prevents re-renders on every keystroke.',
    ],
  },
  {
    version: 'v1.5.0',
    date: 'April 13, 2026',
    isoDate: '2026-04-13',
    title: 'Auth, Pricing & Pro Plans',
    added: [
      'Supabase authentication with Google OAuth and email/password sign-in.',
      'Pricing page with 5 tiers: Free, Starter ($5), Pro ($9), Team ($19), Lifetime ($49).',
      'Freemium gates: 1 AI rewrite/day and 3 PDF exports/day on free tier.',
      'Toast notification system.',
      'GDPR controls: Export My Data and Delete Account.',
    ],
    improved: [
      'Email verification now required for Pro features.',
      'SEO: dynamic robots.ts, sitemap.ts, OG image, and Organization schema.',
    ],
  },
  {
    version: 'v1.4.0',
    date: 'April 11, 2026',
    isoDate: '2026-04-11',
    title: 'Skill Suggestions, Auth & Pricing',
    added: [
      'Skill suggestions based on your job title. 201 roles across 20 industries.',
      'Section completion dots.',
      'Cover letter auto-fills your job title.',
    ],
    improved: [
      'Improved skill matching accuracy.',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'March 28, 2026',
    isoDate: '2026-03-28',
    title: 'PDF Import & Multi-Profile Support',
    added: [
      'PDF import via pdfjs-dist.',
      'Multiple resume profiles — save up to 10 different versions.',
      'Template preview modal.',
      'Drag-and-drop reordering for Experience, Education, Projects.',
    ],
    improved: [
      'Better print quality across all 20 templates.',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'March 14, 2026',
    isoDate: '2026-03-14',
    title: 'UI Modernization',
    added: [],
    improved: [
      'Redesigned help dialog with icons and cards.',
      'Improved onboarding flow with progress bar.',
      'Updated documentation.',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'February 22, 2026',
    isoDate: '2026-02-22',
    title: 'ATS Tools & AI Gap Analysis',
    added: [
      '12 ATS analysis tools.',
      'Industry keyword database: 20 industries, 201 roles.',
      'AI Gap Analysis — paste JD, see missing skills.',
      'Clickable contact links in all 20 templates.',
    ],
    improved: [
      'Navbar redesign with better navigation.',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'February 1, 2026',
    isoDate: '2026-02-01',
    title: 'Initial Release',
    added: [
      '20 professionally designed ATS-optimized resume templates.',
      'AI writing assistant powered by Groq.',
      'Cover letter builder.',
      'ATS score checker with JD keyword matching.',
      'Multi-format import (DOCX, TXT, HTML, MD) and export (PDF, DOCX, HTML).',
      'Dark mode. PWA support. 100% client-side.',
    ],
    improved: [],
  },
];
