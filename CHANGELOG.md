# Changelog

All notable changes to ResumeForge are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.9.0] - 2026-04-15

### Added

- **Long-form article scaffolding** for all 28 content pages (22 company + 6 situation): sticky TOC sidebar (xl+) with mobile accordion, breadcrumb navigation, ArticleMeta bar (author + reading time + last updated + fact-checked badge), JSON-LD Article + FAQPage + HowTo + BreadcrumbList schemas.
- **components/TOC.tsx** — auto-detects h2 elements on mount, assigns stable IDs, uses IntersectionObserver for active-section highlighting, smooth scroll with URL hash update.
- **components/Breadcrumbs.tsx** — visual breadcrumbs with Home icon.
- **components/ArticleMeta.tsx** — author avatar + reading time + last updated + fact-checked badge.
- **components/ReadingProgress.tsx** — thin blue scroll progress bar + back-to-top floating button. Scoped to long-form pages only (not homepage/builder/marketing).
- **lib/articleSchema.ts** — Article / FAQPage / HowTo / BreadcrumbList JSON-LD helpers + combineSchemas() for multi-graph pages.
- **lib/resumeCompanyDataDeep.ts** — 5 new content fields per company: cover letter template (3 paragraphs), 5 common interview questions with hints, 5 red flags that auto-reject, salary benchmark table (3 roles x 3 seniority levels), referral strategy paragraph.
- **5 new sections on every company page**: Cover letter template, interview questions, red flags, salary benchmarks, referral strategy.
- **6 situation pages enriched** with topic-specific additions: email templates (layoff, career gap, career change), comparison tables (fresher chronological vs functional vs hybrid), glossary (fresher resume), case studies (Priya/Rohan/Arjun/Meera/Nikhil — composite stories).
- **/hero-preview internal gallery** at `/hero-preview` with 10 hero variations (5 mouse-tracked tilt + 5 AI-fill animations) for selecting the homepage hero treatment.
- **CSS keyframes** added to globals.css for marquee and floating animations.

### Changed

- **ReadingProgress scope**: moved out of the global `app/layout.tsx` and now only renders on long-form content pages (6 situation pages + CompanyResumeView covers all 22 company pages). Homepage, builder, templates, pricing, auth, and legal pages no longer show the scroll progress bar.
- **Login gateway audit**: every remaining direct `<Link href="/builder">` in app/ replaced with a `<button onClick={() => openGateway('/builder')}>` pattern. Fixed in `app/not-found.tsx`, `app/ats-guide/page.tsx`, `app/cover-letter/page.tsx`. The only remaining `href="/builder"` is the post-login profile dropdown link in the navbar, which is intentional (user is already authenticated).
- **CompanyResumeView** renders 5 additional deep-content sections conditionally when deep data exists (cover letter, questions, red flags, salary, referral).

---

## [1.8.0] - 2026-04-14

### Added

- **22 company resume guides** under `/resume-for/[company]` — 10 global (Google, Amazon, Microsoft, Meta, Apple, Deloitte, McKinsey, Goldman Sachs, JP Morgan, Accenture) + 12 India (TCS, Infosys, Wipro, Flipkart, Zomato, Swiggy, Zoho, BYJU'S, PhonePe, Razorpay, Freshworks, Ola).
- **`/resume-for` hub page** listing all 22 companies, segmented by Global vs India tier.
- **`lib/resumeCompanyData.ts`** — single source of truth for all 22 entries (slug, name, tier, industry, hq, hiring focus, 15 ATS keywords, 5 insider tips, recommended template, meta title, meta description). Fully static, no API calls.
- **6 situation-based static pages**: `/fresher-resume`, `/campus-placement-resume`, `/naukri-resume-tips`, `/resume-after-layoff`, `/resume-after-career-gap`, `/resume-for-career-change`. Each is a hand-written long-form guide with internal links, CTAs, and SEO meta tags.
- **Resources dropdown in navbar** exposing all 9 new pages on desktop (with icons) and as a collapsible group on mobile.
- **Dynamic page generation**: `app/resume-for/[company]/page.tsx` uses `generateStaticParams` + `generateMetadata` so all 22 company pages prerender at build time with unique titles and descriptions.
- **Sitemap expanded** by 29 URLs (1 hub + 22 companies + 6 situations).

### Changed

- **SiteNavbar** restructured: Templates is now the first item, followed by a Resources dropdown, then About / Pricing / FAQ / Contact.
- All new pages reuse existing `SiteNavbar`, `SiteFooter`, `useLoginGateway` hook, and the dark gradient hero pattern from `/templates` and `/ats-guide`.

---

## [1.7.0] - 2026-04-14

### Added

- **Vercel Web Analytics** (cookieless, GDPR safe, free on Hobby plan) replaces the planned Plausible integration.
- **README** alternatives section listing 3 free analytics options (Cloudflare Web Analytics, Umami Cloud, PostHog).

### Changed

- **Privacy Policy** completely rewritten for legal compliance with the new analytics, Supabase auth, and waitlist email storage. Old wording incorrectly claimed "zero data collection."
- **Terms of Use** Section 3 updated to accurately describe data handling.
- **Homepage Privacy First** card no longer claims "no analytics."
- **About page Mission** statement updated. Stats updated from "0 data sent" to "Free to start" and "Open Source." Tech stack item "Client-side Only" relabeled "Client-side First."
- **Template Showcase** on homepage now uses real template thumbnail PNGs instead of solid color blocks.
- **Navbar** removed "Resume Builder" from main nav links and added `whitespace-nowrap` to all items. Fixes overflow at 1024px laptop widths.
- **Contact form** now opens user's email client with a pre-filled mailto link instead of pretending to send (no backend yet).

### Page-by-page review fixes

A full top-to-bottom code + live preview review of all 16 pages. Found and fixed:
- Homepage: 3 issues (Template Showcase, Privacy First card, Build My Resume CTA copy)
- About page: 5 issues (mission text, stats, tech stack, hero subtitle, Privacy card)
- Privacy page: 9 sections rewritten for accuracy
- Terms page: 1 section updated
- Contact page: form submission now works via mailto

---

## [1.6.0] - 2026-04-14

### Added

- **Undo / Redo system** with 50-snapshot history. Ctrl+Z to undo, Ctrl+Y or Ctrl+Shift+Z to redo. Auto-snapshots after 1.5s of inactivity.
- **Keyboard shortcuts**: Ctrl+E for PDF export, Ctrl+1-5 to jump between Edit/Preview/Templates/ATS/AI tabs. Shortcuts are ignored while typing in form fields.
- **Login Gateway modal** on Build Resume CTAs offers Sign In or Continue as Guest.
- **Email verification banner** in builder for unverified users.
- **Resume import rollback**: snapshot taken before import, automatically restored on failure.
- **BreadcrumbList JSON-LD schema** on ATS Guide page for better SEO.
- **Section visibility hint** on Languages form clarifying when sections appear in preview.
- **Real diverse names** in homepage avatars (Sarah Mitchell, David Chen, Priya Sharma, Marcus Johnson, Emily Rodriguez) replacing placeholder letters.

### Changed

- **Debounced localStorage writes** (1s) to reduce battery drain on mobile. Flushes on beforeunload/pagehide to prevent data loss.
- **`<img>` to `next/image`** on homepage hero and template thumbnails for better performance and LCP.
- **`React.memo`** on ResumePreview component to prevent re-renders on every keystroke.
- **Weighted completion score** (15% name, 12% email, 15% experience, etc.) instead of flat per-check weighting.
- **Loading states** on export use try/finally instead of setTimeout for accurate UI state.
- **Touch swipe** ignores inputs, draggable handles, sliders, buttons, and contenteditable. Vertical tolerance prevents accidental swipes during scrolls.
- **AI error handling**: granular messages for HTTP 401 (invalid key), 429 (rate limit), 402/403 (quota), and malformed JSON responses.
- **Skills category** now shows `(required)` indicator with amber border when empty.
- **Photo upload** validates MIME type (no SVG) to prevent embedded scripts. Allows JPEG, PNG, WebP, GIF only.
- **DragEnd handlers** validate findIndex returns to prevent silent reorder bugs.
- **Resume parser regex** extracted to `lib/parserConfig.ts` for easier maintenance.
- **Em dashes and double hyphens** removed from all user-facing copy across 12 pages, templates, and docs.
- **License updated** to allow author commercial use while preventing third-party reselling.
- **Stat citations** added to homepage and other pages: (Jobscan, 2024), (Glassdoor, 2024), etc.

### Fixed

- ATS scoring crashes when keyword matches array is empty or undefined.
- DragEnd handlers in Experience, Education, and Projects forms no longer fail silently when findIndex returns -1.
- ResumeProfileManager memory leak verified as false positive (cleanup is correct).
- Builder god component reduced (still 950+ lines, deferred for full split).
- `alert()` calls in resume import replaced with toast notifications.

### Security

- Photo upload MIME type whitelist (no SVG XSS vector).
- AI suggestions now handle malformed JSON safely.
- Validation helpers in `lib/validation.ts` provide consistent input sanitization.

---

## [1.5.0] - 2026-04-13

### Added

- Supabase authentication with Google OAuth and email/password sign-in.
- Profile dropdown with avatar, Manage Plan, Reset Password, Sign Out, Export Data, Delete Account.
- Pricing page with 5 tiers: Free, Starter ($5), Pro ($9), Team ($19), Lifetime ($49).
- Freemium gates: 1 AI rewrite/day, 3 PDF exports/day on free tier.
- Toast notification system for actions, warnings, and Pro upgrades.
- Waitlist email capture on pricing page for Pro launch notifications.
- GDPR controls: Export My Data and Delete Account in profile dropdown.
- Terms of Use page with detailed legal sections.
- Custom 404 not-found page with helpful navigation.
- Month picker for date fields (Experience, Education, Projects, Certifications).
- Dynamic OG image via Next.js ImageResponse (edge runtime).
- Dynamic robots.ts and sitemap.ts (replaced static files).
- FAQ schema on `/ats-guide` and `/faq` pages.
- Organization JSON-LD schema with logo and founder.
- Login page with Google OAuth and email/password.
- Forgot password flow.
- Auth callback route with redirect whitelist validation.
- Proxy.ts (Next.js 16 migration from middleware.ts).

### Changed

- Removed `output: 'export'` to enable server-side features and proxy.
- Updated LICENSE to allow author commercial use.
- Replaced "100% Free" messaging with "Free to start" across all pages.
- Builder toolbar buttons (Import, Reset, Dark/Light) now match Export button styling.

### Security

- CSP headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- OAuth redirect whitelist validation in auth callback.
- Singleton Supabase client (fixed infinite re-render bug).
- Email verification gate for Pro features.

---

## [1.4.0] - 2026-04-11

### Added

- Resume completion percentage bar (10 criteria, color-coded red/yellow/green).
- Welcome back indicator for returning users (>1hr gap detection).
- What's New v1.4.0 popup (version-tracked, bottom-right notification).
- Skill suggestions based on job title (fuzzy matching against 201 roles).
- Social proof section in landing page hero (avatars, stars, trust indicator).
- Per-page OG meta descriptions for all 11 pages.
- GitHub Actions CI/CD pipeline (TypeScript check + build on push/PR).
- Vercel security headers (X-Frame-Options, X-XSS-Protection, etc.).
- SECURITY.md vulnerability disclosure timeline (72hr response, 90-day process).
- Page transition animations across all pages (fadeInUp, slideIn, scaleIn).
- Section completion indicators (green/gray dots in dropdown).
- Cover letter auto-fill from Personal Info job title.
- Export loading states with disabled buttons.
- Mobile profile manager in bottom bar.

### Mobile UX

- Swipeable tabs on mobile (swipe left/right between Edit, Preview, Style, ATS, AI).
- Bottom sheet section picker with slide-up sheet, icons, and completion dots.
- Touch-friendly drag handles with larger grip areas on Experience, Education, and Projects.
- Mobile resume preview auto-scales to fit viewport.
- Separate mobile tab row below navbar (full width, evenly spaced, icon+label).
- Responsive sidebar widths (320px md, 400px lg, 460px xl).
- Improved mobile action bar (vertical icon+label layout, larger tap targets).
- All mobile overflow issues fixed (tested on 10 devices from 280px to 1440px).

### Improved

- Skill matching accuracy (prefix stripping, quality scoring).
- Help and Profile button visibility in light mode.
- Page transition animations across all pages.
- Section completion indicators in section dropdown.
- Cover letter auto-fill from Personal Info.
- Export loading states with disabled buttons.
- Mobile profile manager in bottom bar.
- Mobile tab bar text visibility (explicit dark colors on dark navbar).
- HelpTip changed from button to span (fixes hydration nesting error).
- Completion bar thicker on mobile (h-1.5).
- Prev/Next buttons larger (h-10 px-4).
- Bottom bar labels bumped to text-xs.
- Smart Matching accordion open by default.
- AI quick actions use flex-wrap instead of grid-cols-3.

---

## [1.3.0] - 2026-04-11

### Added

- PDF import support via `pdfjs-dist`. Upload existing PDF resumes and extract content automatically.
- Multiple resume profiles. Save up to 10 separate resume versions, each with its own data and template selection.
- Template preview modal with full-size preview before applying a template.
- Drag-and-drop entry reordering within Experience, Education, and Projects sections.

### Improved

- Print CSS polish with `color-adjust: exact`, proper `page-break` rules, and consistent spacing across all templates.

---

## [1.2.0] - 2026-04-11

### Improved

- Modernized help dialog with icons, card-based layout, and gradient header for a cleaner look.
- Modernized onboarding flow with progress bar, achievement badges, and larger action buttons.
- Updated README with expanded Getting Started instructions and inline changelog.

---

## [1.1.0] - 2026-04-11

### Added

- 12 ATS analysis tools: readability score, formatting checker, active voice detector, industry keywords matcher, section completeness, bullet point analyzer, quantification checker, verb strength analyzer, length optimizer, consistency checker, contact info validator, and file format advisor.
- 20 industries with 201 roles and 25-30 keywords each for targeted keyword analysis.
- AI Gap Analysis powered by Groq. Identifies missing skills and experience relative to job descriptions.
- HelpTip tooltips on all major sections to guide users through the resume building process.
- Custom section dropdown navigator for quick access to resume sections.
- Smart Matching suggestion triggered on job title input to recommend relevant keywords.
- Clickable contact links (email, phone, LinkedIn, GitHub) in all 20 templates.

### Improved

- Navbar redesign with better navigation and branding.
- Footer update with improved layout and links.
- Text size adjustments across the application for better readability.

---

## [1.0.0] - 2026-04-10

### Added

- Initial release of ResumeForge.
- 20 professionally designed resume templates, each ATS-optimized.
- AI writing assistant powered by Groq for generating summaries, bullet points, and cover letters.
- Cover letter builder with customizable templates.
- ATS score checker with job description keyword matching.
- Multi-format import: DOCX, TXT, HTML, and Markdown.
- Multi-format export: PDF, DOCX, and HTML.
- Dark mode and light mode with system preference detection.
- Progressive Web App (PWA) support for offline use.
- SEO optimization with meta tags and Open Graph support.
- Fully client-side. No data ever leaves the browser.
- localStorage-based data persistence.
- Responsive design for desktop, tablet, and mobile.
