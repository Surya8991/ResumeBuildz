# Changelog

All notable changes to ResumeForge are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

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
