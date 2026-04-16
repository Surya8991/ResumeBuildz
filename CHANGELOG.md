# Changelog

All notable changes to ResumeBuildz are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.19.0] - 2026-04-16

### Security — 10 hardening fixes

1. **Content-Security-Policy** header added (`next.config.ts`) with `frame-ancestors 'none'`, `object-src 'none'`, strict `default-src 'self'`, and allowlisted `connect-src` for Supabase + Groq + Vercel. Also adds `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`.
2. **Rate limit on `/api/checkout`** (`lib/rateLimit.ts`): in-memory token bucket, 10 sessions/hour/IP. Protects against Stripe-fee DoS.
3. **CSRF / Origin verification on `/api/checkout`**: rejects cross-origin POSTs. Prevents hidden-form attacks from racking up checkout sessions.
4. **Photo upload magic-byte validation** (`lib/imageMagic.ts`): verifies first 12 bytes match JPEG/PNG/GIF/WebP signatures before accepting. MIME type alone was spoofable.
5. **`maxLength` support in RichTextarea** + 2000-char cap on summary. Defense against multi-MB paste DoS. Pattern available for all RichTextarea usages.
6. **`Referrer-Policy: no-referrer`** on `/r/*` share pages. Even though URL fragments never hit the wire, this prevents leaking resume content via any potential Referer on outbound link clicks.
7. **Narrowed proxy middleware matcher** to only auth-requiring paths (`/builder`, `/login`, `/auth/*`, `/api/*`, `/pricing`). Marketing pages no longer trigger Supabase session refresh on every request — less attack surface + faster TTFB.
8. **Stripe webhook signature stub** at `/api/stripe/webhook`: reads raw body, verifies with `STRIPE_WEBHOOK_SECRET`, routes 4 event types. Returns 503 until env vars set so Stripe retries. Prevents spoofed subscription upgrades.
9. **BYOK security warning banner** in AI tab: explicit callout that the Groq key lives in localStorage and is vulnerable to XSS/extensions, with rotation + spending-cap guidance.
10. **Production-safe logger** (`lib/logger.ts`): silences `.info`/`.warn` in prod, scrubs sensitive keys (password/token/secret/api_key/auth/cookie/session) from `.error` args. Wired into useAuth, useCloudSync, proxy, webhook handler.

### Added
- Local PDF.js worker `Content-Type` header (`text/javascript`) and 1-year `Cache-Control`.

---

## [1.18.0] - 2026-04-16

### Added — 8 roadmap features shipped

- **PDF.js worker bundled locally** at `/pdfjs/pdf.worker.min.mjs`. Kills unpkg CDN dependency — PDF import now works behind corporate firewalls.
- **LinkedIn JSON import** (`lib/importLinkedIn.ts` + `LinkedInImportModal`). Auto-detects LinkedIn Data Export, Voyager API, and JSON Resume formats. Toolbar: "LinkedIn" button.
- **Resume version history** (`lib/versionHistory.ts` + `VersionHistoryDialog`). Up to 30 named snapshots, auto-save hourly, one-click restore with automatic pre-restore backup. Toolbar: "Versions" button.
- **Shareable read-only link** at `/r#<payload>`. Resume encoded in URL fragment via gzip+base64url. Zero backend, zero PII leaves the browser. Toolbar: "Share" button. `/r` added to robots disallow.
- **JD-tailored rewrite** (`components/JDTailor.tsx`). Paste a job description, AI rewrites summary + top experience bullets with diff preview. Auto-snapshots before applying. Lives in the AI tab.
- **Resume diff viewer** (`components/ResumeDiff.tsx`). Word-level LCS diff — inline or side-by-side. Powers the JD tailor preview.
- **Cover letter tone variants** — 4 picks (Professional, Formal, Casual, Concise) in the cover letter form. Per-tone system prompts and temperature tuning.
- **ATS score trend** (`components/ats/ATSTrend.tsx`). SVG sparkline of score history. Debounced snapshots (min 1-minute gap). Visible in the ATS tab.

### Infrastructure

- New shared libs: `lib/shareLink.ts` (gzip+base64url codec), `lib/diffText.ts` (LCS word-diff), `lib/atsTrend.ts` (trend storage), `lib/versionHistory.ts`.
- Build output unchanged: 0 errors, same number of static routes +1 (`/r`).

---

## [1.17.0] - 2026-04-16

### Added — 15 features across builder, AI, infra, growth

#### Builder
- **Markdown export** (`.md`) — dev-friendly, GitHub-renderable.
- **ATS plain-text export** (`.txt`) — pure UTF-8, ASCII-safe bullets, for Workday/Greenhouse/Naukri.
- **Streaming AI** — cover letter now streams live instead of 3-5s blank wait. New `streamGroqAI()` helper with SSE parser.
- **Keyboard shortcut cheatsheet** (`Ctrl+/` or `?`) — full dialog of all 11 shortcuts.
- **Last-edited timestamp** — "Saved 2m ago" in the builder footer. Auto-refreshes every 30s.
- **Dark mode persist** — localStorage-backed, init-before-paint script prevents FOUC.
- **Removed duplicate Ctrl+E shortcut** — `Ctrl+P` and `Ctrl+E` were both bound to PDF export.

#### Infrastructure
- **Stripe checkout scaffold** — `lib/stripe.ts` + `app/api/checkout/route.ts` + `hooks/useCheckout.ts`. Lazy SDK load, returns 503 when not configured. Pricing page + UpgradeModal wired.
- **Cloud sync hook** — `hooks/useCloudSync.ts` pulls on sign-in and debounced-pushes on edits to a Supabase `resumes` table. Silent fallback when table missing.
- **Edge Function: `delete-user`** — GDPR-safe account deletion (deletes both `profiles` row and `auth.users` row). `useAuth.deleteAccount` invokes this with fallback to legacy behavior.
- **Edge Function: `increment-usage`** — server-side rate limiting for AI/PDF. Plan-aware limits, dry-run mode.
- **`supabase/README.md`** with deploy steps + required SQL.

#### Growth / SEO
- **Changelog RSS feed** at `/changelog/rss.xml`.
- **Status page** at `/status` — live health of app, AI, auth, PDF-import upstreams.
- **Roadmap page** at `/roadmap` — public tracker with shipped / in-progress / planned.
- **404 page with live search** — searches all pages + blog posts + company guides.
- **ShareButton component** — copy link + LinkedIn/X/email intents for blog posts.
- **Sitemap auto-discovery** — blog posts now pulled from `BLOG_POSTS` registry instead of manual entries. Adds `/roadmap` and `/status`.
- **Changelog data extracted** to `lib/changelogData.ts` — single source for page + RSS route.

### Fixed
- `toggleDarkMode` now persists state to localStorage and initializes from DOM class (was always starting `false`).

---

## [1.16.0] - 2026-04-16

### Fixed (full-project codereview — 40+ findings across 31 files)

#### Security
- **High:** `ensureUrl()` now blocks `javascript:`, `data:`, and `vbscript:` URI schemes.
- **High:** `safePhotoSrc()` rejects remote photo URLs — only `data:image/*` allowed. Wired into `ResumePreview` so all 20 templates are protected.
- **High:** `safePrimaryColor()` validates hex format before interpolation into CSS. Wired into `ResumePreview`.
- **High:** `callGroqAI` calls wrapped in try/catch/finally in `ATSScoreChecker`, `AISuggestions`, and `CoverLetterForm` — no more permanent loading states on network failure.
- **Medium:** `fetchProfile` now uses explicit `select(...)` instead of `select('*')`, logs errors instead of swallowing them.
- **Medium:** `exportUserData` now picks only safe fields from profile instead of dumping the raw object.
- **Medium:** `canUseAI` limit aligned to `FREE_LIMITS.ai = 1` (was hardcoded `< 3`).

#### Bugs
- **High:** `SectionReorder` `indexOf` can return -1 — guard added to prevent array corruption.
- **High:** Legacy `.doc` import now returns clear error instead of opaque mammoth crash.
- **High:** AI-parsed JSON validated: arrays checked with `Array.isArray`, malformed objects rejected.
- **Medium:** `DateConsistency` non-null assertion replaced with proper null check.
- **Medium:** `InfographicTemplate` skill bars use deterministic formula instead of `Math.random()`.
- **Medium:** `ModernTemplate` two-column layout now includes custom sections (were silently dropped).
- **Medium:** `exportDocx`/`exportHtml` handle empty `endDate` — no more trailing " - " with nothing.
- **Medium:** `PasteImportModal` 100k char limit now enforced on the Import button.
- **Medium:** `MultiJDMatching` ID collision risk fixed with random suffix.
- **Medium:** `BoldTemplate` certifications: "to" → "-".
- **Medium:** `MonochromeTemplate` empty proficiency no longer renders `()`.
- **Low:** `builder/page.tsx` custom section IDs use `crypto.randomUUID()` instead of `Math.random()`.
- **Low:** Blob URL revoke deferred 60s in builder export and useAuth export (prevents download cancellation).

#### UX / Accessibility
- **Medium:** `deleteProfile` now requires `confirm()` before deletion.
- **Medium:** `ErrorBoundary` "Reset & Reload" now requires `confirm()` before nuking localStorage.
- **Medium:** Toast container has `role="status" aria-live="polite"` for screen readers.
- **Medium:** Contact form success changed from "Message Sent!" to "Email Client Opened!" with fallback text.
- **Medium:** `SummaryForm` removed misleading "/500" counter (no maxLength was enforced).
- **Low:** `PersonalInfoForm` LinkedIn/GitHub regex now checks URL starts with the domain.
- **Low:** Phone validation requires >= 7 actual digits.
- **Low:** `textAnalysis.ts` bigram extraction skips stop-word pairs.

#### Cleanup
- **Medium:** Removed redundant `<link rel="preconnect">` for Google Fonts (next/font handles this).
- **Medium:** `SiteNavbar` mobile menu removed dead `/builder` branch (NAV_LINKS never contained it).
- **Low:** `WhatsNew` + `OnboardingGuide` localStorage access wrapped in try/catch (Safari private browsing).
- **Low:** `ReadingProgress` resize listener now passive.
- **Low:** `siteConfig.ts` fallback URL updated from old `resume-forge-orcin` to `resumebuildz`.

Lint: 0 errors. Build clean. 31 files changed.

---

## [1.15.1] - 2026-04-16

### Fixed (codereview pass #2 — 13 findings)

- **High:** `GROQ_MODEL` was duplicated in 4 files (`groqAI.ts`, `AISuggestions.tsx`, `importResume.ts`, `CoverLetterForm.tsx`). Now exported once from `groqAI.ts` and imported everywhere.
- **High:** `AISuggestions.tsx` duplicated the entire Groq fetch call instead of using `callGroqAI()`. Refactored to use the shared helper; same for `CoverLetterForm.tsx` and `importResume.ts`.
- **Medium:** `callGroqAI()` enhanced with `status` field on errors (for granular 401/429/402 handling) and optional `apiKeyOverride` parameter (for `importResume.ts` which passes keys explicitly).
- **Medium:** `ResumePreview.tsx` `overrideCSS` now passes through `sanitizeCSS()` that strips `<script`, `expression()`, and `url(javascript:)` patterns (defense-in-depth; values were already sanitized at construction).
- **Medium:** `navigator.clipboard.writeText()` wrapped in try/catch in `AISuggestions.tsx` and `CoverLetterForm.tsx`. Shows toast/alert on failure instead of unhandled rejection.
- **Medium:** `/hero-preview` and `/loader-preview` now use server-rendered `<meta name="robots" content="noindex,nofollow">` via Next.js `layout.tsx` metadata export. Removed client-side `useEffect` injection that search engine crawlers couldn't see.
- **Low:** `LoaderCard` accepts `size` prop (`'sm' | 'md'`). `Loader7_BottomRightCard` now reuses `<LoaderCard size="sm" />` instead of duplicating skeleton markup.
- **Low:** `hero-preview` familyLabel now correctly shows "Combined" (with amber badge) instead of "Fill" for combined-family options.
- **Low:** `Loader10_SparkleCursor` documented: mousemove listener won't fire when parent has `pointer-events:none` (e.g., production PageLoader overlay). Only suitable for interactive containers.

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
