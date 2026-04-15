# Changelog

All notable changes to ResumeBuildz are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.15.0] - 2026-04-16

### Added

- **`components/LoaderCard.tsx`** — shared centered skeleton card used by both the production `PageLoader` and the `/loader-preview` gallery's Loader4. Single source of truth for brand visuals.

### Fixed (codereview pass on PageLoader work)

- **High:** `PageLoader` now has an 8-second safety timeout that auto-hides the loader if a navigation never completes (cancelled, network failure, hard crash). Previously the user could get stuck staring at a frozen overlay until they refreshed.
- **Medium:** `prefers-reduced-motion` respected via Tailwind's `motion-safe:` / `motion-reduce:` variants. Users with the OS-level "Reduce motion" setting see a static skeleton with no pulse animation. WCAG 2.3.3 compliant.
- **Medium:** SVG `<a>` elements now type-guarded — the click listener checks `instanceof HTMLAnchorElement` before reading `target` / `rel` / `download`, preventing undefined behavior on inline SVG links.
- **Medium:** Relative URLs now resolved correctly. `<a href="about">` clicked from `/some/path` now correctly compares against the resolved URL `/some/about`. Was previously doing a raw string comparison that triggered the loader on no-op same-page navigations.
- **Low:** `<aria-live="polite">` + visually-hidden "Loading page" announcement so screen readers know a navigation is happening. Previously `aria-hidden` made the loader invisible to assistive tech.
- **Low:** All `<style jsx>` keyframe blocks in `PageLoaderOptions.tsx` extracted to `app/globals.css` with `loader-` prefixed names (`loader-pulse-scale`, `loader-dot-bounce`, `loader-pulse-ring`, `loader-eq-bar`, `loader-aurora-sweep`). No more global-scope keyframe collisions.
- **Low:** `Loader4_SkeletonCard` now imports the shared `LoaderCard` component instead of duplicating 30 lines of JSX.
- **Low:** `/loader-preview` and `/hero-preview` get `<meta name="robots" content="noindex,nofollow">` injected on mount to keep them out of search engine indexes. `app/robots.ts` also adds them to the crawler `disallow` list as defense-in-depth.

Lint: 0 errors, 13 warnings. Build clean.

---

## [1.14.0] - 2026-04-15

### Changed

- **Page loader replaced** with the centered-skeleton-card design (Option 4 from `/loader-preview`). The previous top progress bar + bottom-right floating card design is gone. The new loader is a centered card on a soft white backdrop with skeletal resume bars filling in — mirrors the homepage Fill7_Ultimate hero aesthetic so every page transition reinforces the resume-building brand metaphor.
- **Loader has a 150ms grace period** before showing. Quick navigations that complete in under 150ms never flash the loader at all.
- **`/loader-preview` gallery** added with 10 loader options (Stripe, Vercel, Spotify, Apple, GitHub, Linear, Notion, Material Design inspirations) for selecting between alternative designs.

### Fixed

- `components/PageLoaderOptions.tsx` Loader10_SparkleCursor: moved initial `setPos` out of the effect body into a `queueMicrotask` callback to satisfy the cascading-renders lint rule.

---

## [1.13.0] - 2026-04-15

### Added

- **Page transition loader** (`components/PageLoader.tsx`) — global navigation indicator wired into `app/layout.tsx`. Two visual elements:
  - Thin blue gradient progress bar at the top of the viewport that trickles up to ~85% during navigation and snaps to 100% on completion.
  - Floating mini "resume building" card in the bottom-right corner with skeletal bars filling in (mirrors the homepage Fill7_Ultimate hero aesthetic). Only shows after 25% progress so quick navigations don't flash it.
- The loader detects navigation start via a global click listener on `<a>` elements (filters out external links, downloads, modifier-key clicks, anchor jumps, mailto/tel links). It also responds to browser back/forward via `popstate`. Completes when `usePathname()` reports the new route.

### Fixed (codereview pass — 16 issues)

- **High:** `WhatsNew.tsx` `APP_VERSION` bumped from stale `1.4.0` to `1.12.0` with current release notes.
- **High:** ESLint enforcement moved from `next.config.ts` (Next 16 removed the option) to `.github/workflows/ci.yml` — CI now runs `npm run lint -- --max-warnings 50` between TypeScript check and build.
- **Medium:** `app/login/page.tsx` setError-in-effect → lazy useState initializer. No more cascading-render warning.
- **Medium:** `components/CookieBanner.tsx` and `components/WhatsNew.tsx` — dropped `mounted` flag, setState only inside setTimeout/rAF callbacks.
- **Medium:** `store/useResumeStore.ts` `let pendingWrites` → `const`.
- **Medium:** `app/resume-after-career-gap/page.tsx` line 179 unescaped `"` → `&quot;`.
- **Medium:** `lib/siteConfig.ts` (new) centralizes the deployed site URL via `NEXT_PUBLIC_SITE_URL`. All 9 hardcoded `https://resume-forge-orcin.vercel.app` references replaced with `SITE_URL` / `absoluteUrl()` imports. Renaming the Vercel project now requires changing one constant.
- **Medium:** All `dangerouslySetInnerHTML JSON.stringify` blocks for JSON-LD now use the `jsonLd()` helper from `lib/articleSchema.ts` (escapes `<`).
- **Medium:** Removed unused `SUPABASE_SERVICE_ROLE_KEY` from `.env.example` and `README.md`.
- **Medium:** `components/templates/MonochromeTemplate.tsx` — removed dead `const _ = primaryColor` workaround. Destructure `{ data }` only.
- **Low:** `components/HeroOptions.tsx` Fill4 — removed `as unknown as ReturnType<typeof setInterval>` type lie. Uses union of separate intervalId / timeoutId variables.
- **Low:** `components/HeroOptions.tsx` Fill7_Ultimate — added `IntersectionObserver` to pause animation timers when hero scrolls offscreen. Resumes on re-entry.
- **Low:** `eslint.config.mjs` silences `@next/next/no-img-element` for `components/templates/**` (since `images.unoptimized: true` makes `<img>` no worse than `<Image />`).
- **Low:** `next.config.ts` documented why `images.unoptimized: true` is set.
- **Low:** `lib/validation.ts` removed unused `eslint-disable` directive.

Lint result: **0 errors, 13 warnings** (down from 5 errors / 35 warnings before the codereview).

---

## [1.12.0] - 2026-04-15

### Added

- **Ahrefs-style 2-tier blog taxonomy**: 4 parent groups containing 7 child clusters, based on research across HubSpot, Ahrefs, Indeed, Zety, Enhancv, Kickresume, Teal, LinkedIn Talent, Canva, and Notion blog navs.
- **New "Interviews & Cover Letters" category** at `/blog/category/interviews-cover-letters` — closes the biggest gap vs. every direct competitor.
- **`/cover-letter` page** added as a blog post in the new category.
- **`PARENT_GROUPS` array + `parentGroup` field** in `lib/blogCategories.ts`. New helpers `getCategoriesByParent()` and `getParentBySlug()`.
- **Mega-dropdown in the navbar** Resources menu — 4-column grid on desktop showing parent group headers + their child categories. Mobile renders as nested accordion grouped by parent.
- **Parent-grouped blog hub** at `/blog` — categories now grouped under 4 pillar headers (Resume & ATS, Job Search, India Hiring, Company Guides) instead of a flat 6-card grid.

### Changed

- **Footer Blog column** restructured into 3 visual groups (Resume & ATS / Job Search / India & Companies) matching the new parent taxonomy.
- **Sitemap** auto-includes the new `/blog/category/interviews-cover-letters` URL.

### Why this structure

Research summary: every direct resume/career competitor (Zety, Indeed, Enhancv, Kickresume, Teal) caps at 3-6 flat categories around Resume + Cover Letter + Interview + Job Search. None of them break out India Hiring, Company Guides, or AI Tools as top-level — those would dilute the 5-cluster cap. ResumeBuildz has all three as content moats, so a flat 7-cluster menu would bury our differentiators. The Ahrefs nested model is the only researched pattern that scales to 7+ clusters while preserving clean SEO silos.

---

## [1.11.0] - 2026-04-15

### Changed

- **Navbar "Resources" dropdown** now contains two nested sections: a **"Blog — topic clusters"** group with all 6 clusters (Resume Writing, ATS & Keywords, Career Transitions, India Hiring, Company Deep Dives, AI Resume Tools), and a **"Help"** group with FAQ + Company Guides Hub. FAQ moved out of the top-level nav.
- **Main nav items**: Templates, Resources (dropdown), About, Pricing, Contact.
- **Footer Blog column** (replacing the old Resources column) with links to All Articles, 4 cluster pages, and FAQ. GitHub link updated to `Surya8991/resumebuildz`.
- **OG image** brand text changed from "ResumeForge" to "ResumeBuildz" in `app/opengraph-image.tsx`.
- **JSON-LD Organization** `sameAs` in `app/layout.tsx` updated to the new repo URL.
- **README.md / README.html** clone commands updated to `resumebuildz.git`.
- **Project renamed** from ResumeForge to **ResumeBuildz**. Every user-facing string ("ResumeForge") has been replaced with "ResumeBuildz" across 43 files: site metadata (titles, descriptions, OG/Twitter tags), JSON-LD publisher name, brand logo text in navbar/footer/login/builder/not-found, all in-page copy, testimonials, manifest.json, llms.txt, README, CONTRIBUTING, SECURITY, LICENSE, .env.example, and all blog/resources/situation/company pages.
- **package.json** name changed from `resumeforge` to `resumebuildz`.
- **Historical CHANGELOG entries** rewritten to say "ResumeBuildz" so brand consistency is preserved for anyone reading the file top-to-bottom (no historical inaccuracy — the product is the same, only the name changed).

### Not changed (technical identifiers — intentional)

- **localStorage keys** (`resumeforge-storage`, `resumeforge-usage-ai`, `resumeforge-usage-pdf`, `resumeforge-last-visit`, `resumeforge-waitlist`, `resumeforge-cookie-consent`, `resumeforge-saved-jds`, `resumeforge-onboarding-done`, `resumeforge-version`) — renaming these would orphan every existing user's saved resume data silently. Kept as-is; the keys are internal and never shown to users.
- **Vercel deployment URL** (`resume-forge-orcin.vercel.app`) — the URL still points to the old Vercel project name. Rename the Vercel project via the dashboard to update the URL; JSON-LD canonical URLs, sitemap.ts, and schema helpers all read from this string and will pick up the new URL once changed.
- **GitHub repo URL** (`github.com/Surya8991/resumeforge`) — rename the repository in GitHub settings to update. References in footer, contributing, security, and meta tags point here and will continue working via GitHub's automatic redirect.
- **Git history** — preserved.

---

## [1.10.0] - 2026-04-15

### Added

- **Blog section** at `/blog` with topic-cluster discovery layer over existing long-form content:
  - `/blog` hub page with featured strip, topic-cluster cards, and filterable post grid.
  - `/blog/category/[category]` dynamic route with 6 statically generated category pages.
  - `lib/blogCategories.ts` with 6 topic clusters (Resume Writing, ATS & Keywords, Career Transitions, India Hiring, Company Deep Dives, AI Resume Tools) — each with slug, name, description, long description, icon, color, and SEO keywords.
  - `lib/blogPosts.ts` with 8 blog post entries + 1 virtual post (company guides hub link). Each post references its existing page URL — no URL moves, no SEO breakage.
- **Ultimate hero** (`Fill7_Ultimate`) — the most complete hero possible. Mouse-tracked 3D parallax tilt with score chip + suggestion popups floating at different translateZ depths, resume filling in section by section, 4 coaching chips resolving to green checks, ATS score climbing 0% → 94% in lock-step, "ATS-READY" badge at the end, plus a cursor-tracked blue highlight sweep. Applied to the homepage hero.
- **Combined hero** (`Fill6_Combined`) — intermediate version without the tilt. Kept in the preview gallery as option 11.
- Sitemap updated with `/blog` and 6 blog category URLs.

### Changed

- **Resources dropdown in navbar** restructured to point to blog categories instead of flat page links. Now shows: All Articles, Resume Writing, ATS & Keywords, Career Transitions, India Hiring, Company Guides.
- **Homepage hero** replaced with `Fill7_Ultimate` (was `Fill6_Combined`, was static `/templates/modern.png` before that).

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

- Initial release of ResumeBuildz.
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
