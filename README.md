# ResumeForge - ATS-Friendly Resume Generator

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Source--Available-orange)
![Templates](https://img.shields.io/badge/Templates-20-purple)


A fully client-side, professional resume builder with 20 ATS-optimized templates, AI-powered writing assistant, cover letter builder, guided onboarding, and multi-format import/export. Built with Next.js 16, Tailwind CSS, and shadcn/ui.

**Free to start. No sign-up required. Your data stays in your browser.**

## Features

### Resume Building
- **20 ATS-Friendly Templates** - Classic, Modern, Minimalist, Professional, Executive, Creative, Compact, Tech, Elegant, Bold, Academic, Corporate, Nordic, Gradient, Timeline, Sidebar, Infographic, Federal, Startup, Monochrome
- **Live Preview** - Real-time rendering as you type with zoom controls (default 80%)
- **9+ Resume Sections** - Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Cover Letter + unlimited Custom Sections
- **Photo/Avatar Upload** - Optional profile photo with circular display on templates (max 2MB)
- **Cover Letter Builder** - Write or AI-generate cover letters with job title and company context
- **Custom Sections** - Add unlimited sections (Volunteer Work, Publications, Awards, etc.)
- **Drag-and-Drop Section Reordering** - Reorder how sections appear on your resume
- **Drag-and-Drop Entry Reordering** - Reorder individual entries within Experience, Education, and Projects
- **Rich Text Toolbar** - Bold, italic, bullet points, and dividers in text fields (Ctrl+B/I)
- **Guided Onboarding Tour** - 11-step interactive popup guide for new users with tips and navigation
- **Form Validation** - Required field indicators, email/phone/URL validation with error messages
- **Sample Resume** - Pre-loaded sample data (Sarah Mitchell, Product Manager) so new users see a working example immediately
- **Clickable Contact Links** - All templates render mailto, tel, and https links as clickable
- **HelpTip Tooltips** - (?) tooltips on all major sections for contextual guidance
- **Error Boundary** - Graceful error recovery with reset option
- **Step-by-Step Wizard** - Previous/Next navigation between sections with dropdown section navigator and progress dots
- **Keyboard Shortcuts** - Ctrl+P for PDF export, Ctrl+S for backup save
- **Page Estimate** - Shows estimated page count in preview toolbar
- **Auto-Save** - Data persists in localStorage automatically
- **Dark/Light Mode** - Theme toggle for comfortable editing
- **Smart Matching** - Suggests relevant job keywords when a job title is entered
- **Skill Suggestions** - Intelligent skill suggestions based on job title, drawn from 201-role industry data with prefix stripping and quality scoring
- **Resume Completion Bar** - Color-coded progress bar tracking 10 completion criteria (red <40%, yellow 40-70%, green >70%)
- **Welcome Back Indicator** - Shows last edit time for returning users after >1 hour gap
- **What's New Popup** - Version-tracked changelog notification for updates (bottom-right, dismissible)
- **Page Animations** - Smooth page transition animations across all pages (fadeInUp, slideIn, scaleIn)
- **Section Completion Indicators** - Green/gray dots in dropdown show which sections are complete
- **Export Loading States** - Visual loading states with disabled buttons during PDF/DOCX/HTML export
- **Cover Letter Auto-Fill** - Cover letter auto-populates job title from Personal Info
- **Print CSS Optimized** - color-adjust, page-break rules for clean PDF output
- **PWA Ready** - Web app manifest for installable experience

### Mobile Responsive
- **Swipeable Tabs** - Swipe left/right between Edit, Preview, Style, ATS, and AI tabs on mobile
- **Bottom Sheet Section Picker** - Slide-up sheet with icons and completion dots for quick section navigation
- **Touch-Friendly Drag Handles** - Larger grip areas on Experience, Education, and Projects for easy reordering
- **Auto-Scaling Preview** - Mobile resume preview automatically scales to fit the viewport width
- **Responsive Sidebar** - Adaptive widths (320px md, 400px lg, 460px xl) for optimal use of screen space
- **Mobile Action Bar** - Vertical icon+label layout with larger tap targets
- **Mobile Tab Row** - Full-width, evenly spaced tabs with icon+label below the navbar
- **Mobile Dropdown Filter** - Templates page uses a native dropdown on mobile instead of horizontal buttons
- **Overflow Protection** - All content uses overflow-x-hidden to prevent horizontal scroll on any device
- **Tested on 10 Devices** - Verified on Galaxy Fold (280px), Galaxy S23, iPhone SE, iPhone 14 Pro, Samsung A52, Pixel 7, iPad Mini, Tablet 768px, iPad Pro, Desktop 1440px

### Multiple Resume Profiles
- **Save Up to 10 Profiles** - Keep separate resumes for different job targets
- **Load, Rename, Delete** - Manage profiles from the header menu
- **Per-Profile Settings** - Each profile stores resume data, selected template, and accent color
- **Mobile Profile Manager** - Access profile switching from the bottom bar on mobile devices

### Template & Customization
- **Template Preview Modal** - Click the eye icon on any template to see a full-size preview before selecting
- **Typography** - 12 Google Fonts (Inter, Roboto, Open Sans, Lato, Merriweather, Playfair Display, etc.)
- **Font Size & Line Height** - Adjustable with sliders
- **Section Spacing & Page Margins** - Fine-tune layout density
- **Quick Presets** - Compact, Default, Comfortable, Roomy
- **10+ Accent Colors** - Plus custom color picker with hex input

### Import & Export
- **Import from PDF, DOCX, TXT, HTML, MD** - Upload an existing resume and auto-fill the form
- **AI-Powered Parsing** - Uses Groq AI (Llama 3.3 70B) for accurate resume parsing with heuristic fallback
- **Export as PDF** - Browser print for pixel-perfect output (best for ATS)
- **Export as DOCX** - Microsoft Word format
- **Export as HTML** - Web-ready format for online hosting
- **JSON Backup** - Save and restore resume data via Ctrl+S

### ATS Optimization
- **ATS Compatibility Score** - Analyzes resume with 7 checks and actionable feedback
- **Job Description Matcher** - Paste a job listing to see keyword match percentage
- **Missing/Matched Keywords** - Color-coded breakdown (red = missing, green = matched)
- **Keyword Density** - Shows occurrence count for each matched keyword (e.g., "React x3")
- **Section Score Breakdown** - Mini progress bars showing points per section (Contact 15/15, Experience 25/25, etc.)
- **Readability Score** - Flesch-Kincaid readability scoring with interpretation (60-70 is ideal for resumes)
- **Formatting Warnings** - Detects ATS-breaking characters, bullet inconsistencies, empty fields
- **Industry Keywords** - 20 industries with 201 roles, 25-30 keywords each. Searchable. Shows role-specific keywords in your resume
- **Resume Length Check** - Word count with zone bar (red <300, green 300-700, yellow >700)
- **Date Consistency** - Checks date formats, chronological order, and overlaps
- **Active Voice Detector** - Flags passive voice in bullet points with active alternatives
- **JD Comparison** - Shows resume text with matched keywords highlighted
- **Multi-JD Matching** - Save up to 5 job descriptions, compare match scores in a table
- **Keyword Auto-Insert** - Classifies missing keywords by target section (Skills/Experience/Summary)
- **AI Gap Analysis** - Uses Groq AI to suggest how to naturally add missing keywords (requires API key)
- **AI Writing Assistant** - Generate professional summaries, bullet points, skills, and custom prompts

### Landing Page
- **Social Proof** - Hero section with user avatars, star ratings, and "Trusted by 1,000+" indicator

### SEO & Performance
- **Open Graph Tags** - Optimized for LinkedIn, Twitter, Facebook sharing
- **Per-Page OG Meta** - Unique Open Graph titles and descriptions for each of the 11 pages
- **Twitter Cards** - Large image card for social sharing
- **JSON-LD Schema** - WebApplication structured data for search engines
- **PWA Manifest** - Installable web app with icons and theme color
- **Lazy Font Loading** - Only the selected Google Font is loaded
- **GitHub Actions CI/CD** - Automated TypeScript checking and build verification on every push and pull request

### Security
- **Vercel Security Headers** - X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy configured via vercel.json

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand with localStorage persistence
- **Resume Import:** mammoth (DOCX), pdfjs-dist (PDF) — client-side text extraction
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **PDF Export:** react-to-print (browser print)
- **DOCX Export:** docx + file-saver
- **AI Integration:** Groq API (Llama 3.3 70B) - optional, free
- **Icons:** Lucide React

## Getting Started

ResumeForge runs entirely in your browser -- there is no backend server, database, or account required. Clone the repository, install dependencies, and you are ready to build resumes locally. All data is persisted in your browser's localStorage so nothing leaves your machine.

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Surya8991/resumeforge.git
cd resumeforge

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. A sample resume is pre-loaded so you can explore templates, ATS scoring, and export options right away.

### Build for Production

```bash
npm run build
```

This generates a static export in the `out/` folder, ready for deployment to any static hosting provider (GitHub Pages, Vercel, Netlify, Cloudflare Pages, etc.).

## How to Use

1. **Follow the onboarding tour** - First-time users see an 11-step guided popup (restart from Help menu)
2. **Edit the sample resume** - Replace the pre-loaded sample data with your own details
3. **Upload a photo** - Add an optional profile photo in Personal Info
4. **Choose a template** - Click "Style" to browse 20 designs; use the eye icon to preview full-size before selecting
5. **Manage profiles** - Save up to 10 resume profiles from the header menu; load, rename, or delete as needed
6. **Customize appearance** - Adjust font, colors, spacing, and margins
6. **Add custom sections** - Click "Add Section" for Volunteer Work, Publications, etc.
8. **Reorder sections & entries** - Click "Reorder Sections" at the bottom of any form; drag entries within Experience, Education, and Projects
9. **Import existing resume** - Click "Import Resume" to upload PDF, DOCX, TXT, HTML, or MD
10. **Write a cover letter** - Use the Cover Letter tab with optional AI generation
11. **Check ATS score** - Click "ATS" to analyze compatibility and match job descriptions
12. **Use AI suggestions** - Click "AI" to get AI-powered content improvements
13. **Download** - Export as PDF, DOCX, or HTML

### AI Features (Bring Your Own Key)

**No API key is included with this app.** AI features require your own free Groq API key:

1. Visit [console.groq.com/keys](https://console.groq.com/keys) and sign up (free)
2. Click "Create API Key" and copy it
3. In the app, go to AI tab > paste your key
4. Your key is stored **only in your browser localStorage** — it is never sent to any server except Groq's API

> **Note:** The app works fully without an API key. AI features (writing assistant, cover letter generator, smart import parsing) are optional enhancements. All core resume building, templates, ATS scoring, and export features work without any API key.

## Deployment

### GitHub Pages

1. Push to GitHub
2. Go to Settings > Pages > Source: GitHub Actions
3. Deploy the `out/` folder

### Vercel

```bash
npx vercel
```

### Any Static Host

Upload the `out/` folder to Netlify, Cloudflare Pages, or any static hosting provider.

## Project Structure

```
resumeforge/
├── app/
│   ├── layout.tsx                  # Root layout with Google Fonts preconnect
│   ├── page.tsx                    # Main application (tabs, sidebar, preview)
│   └── globals.css                 # Global + print + page-break styles
├── components/
│   ├── ui/                         # shadcn/ui components + RichTextarea
│   ├── forms/                      # 9 form components + CustomSectionForm + CoverLetterForm
│   ├── ResumeProfileManager.tsx    # Multiple resume profiles (save/load/rename/delete)
│   ├── templates/                  # 20 resume templates + TemplateWrapper + index
│   ├── preview/ResumePreview.tsx   # Live preview with style overrides
│   ├── ats/
│   │   ├── ATSScoreChecker.tsx     # ATS score + JD keyword matcher
│   │   └── AISuggestions.tsx       # Groq AI writing assistant
│   ├── TemplateSelector.tsx        # Style panel (templates, fonts, colors, spacing)
│   ├── SectionReorder.tsx          # Drag-and-drop section reordering
│   ├── OnboardingGuide.tsx         # 11-step popup onboarding tour
│   ├── FontLoader.tsx              # Dynamic Google Font loader
│   ├── ErrorBoundary.tsx           # Error recovery wrapper
│   └── HelpDialog.tsx              # Help guide with "Restart Tour" button
├── store/useResumeStore.ts         # Zustand store with persistence
├── types/resume.ts                 # TypeScript types, 20 template configs, sample data
└── lib/
    ├── importResume.ts             # PDF/DOCX/TXT/HTML/MD import + AI parsing
    ├── exportDocx.ts               # DOCX generation
    └── exportHtml.ts               # HTML generation with XSS sanitization
```

## Security

- No API keys stored in source code
- Groq API key stored only in browser localStorage (user's own key)
- HTML export sanitizes all user data and validates colors
- File imports limited to 10MB with type validation
- CSS injection prevented via font family whitelist
- All numeric style values clamped to safe ranges
- JSON import validates structure before loading
- Photo uploads limited to 2MB with image type validation

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | Fully supported |
| Firefox | 90+ | Fully supported |
| Safari | 15+ | Fully supported |
| Edge | 90+ | Fully supported |
| Opera | 76+ | Fully supported |
| Mobile Chrome | Latest | Fully supported |
| Mobile Safari | 15+ | Fully supported |

> **Note:** PDF export uses browser print, so results may vary slightly between browsers. Chrome gives the best PDF output.

## Accessibility

- Keyboard navigable — all form fields, buttons, and dropdowns accessible via Tab/Enter/Escape
- Section dropdown and progress dots support keyboard interaction
- Form labels associated with inputs via `htmlFor`
- Focus rings on interactive elements (`focus-visible`)
- Dark mode for comfortable editing in low-light
- Color contrast meets WCAG AA standards
- Screen reader support via semantic HTML and ARIA attributes
- Responsive design works with zoom up to 200%

## Performance

- **Client-side only** — no server requests (except optional Groq AI)
- **Lazy font loading** — only the selected Google Font is fetched
- **Static export** — pre-rendered HTML for instant load
- **Turbopack** — fast development builds with Next.js 16
- **No tracking** — zero analytics, cookies, or third-party scripts
- **Typical build size:** ~500KB gzipped
- **Lighthouse score:** 95+ Performance, 100 Accessibility, 100 Best Practices

## Environment Variables

No environment variables are required. The app runs entirely in the browser.

The only external service is Groq AI (optional), which uses the user's own API key stored in localStorage — not in environment variables.

## Contributing

Contributions are welcome and appreciated! Whether it's fixing a bug, adding a feature, improving documentation, or suggesting ideas — all contributions help make ResumeForge better for everyone.

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork locally (`git clone https://github.com/your-username/resumeforge.git`)
3. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **Make your changes** and test them locally with `npm run dev`
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear description of what you changed and why

### Contribution Guidelines

- Keep PRs focused — one feature or fix per pull request
- Follow the existing code style (TypeScript, Tailwind CSS)
- Test your changes locally before submitting
- Update the README if your change adds new features or modifies behavior
- Be respectful and constructive in discussions

### Ideas for Contributions

- New resume templates
- Additional export formats
- Accessibility (a11y) improvements
- Translation / i18n support
- Performance optimizations
- Bug fixes and UI polish
- Mobile responsiveness improvements
- New AI-powered features

### Reporting Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/Surya8991/resumeforge/issues) with details about the problem or your idea. Include steps to reproduce for bugs.

## Changelog

### v1.4.0
- Resume completion percentage bar (10 criteria, color-coded red/yellow/green)
- Welcome back indicator for returning users (>1hr gap detection)
- What's New v1.4.0 popup (version-tracked, bottom-right notification)
- Skill suggestions based on job title (fuzzy matching against 201 roles)
- Social proof section in landing page hero (avatars, stars, trust indicator)
- Per-page OG meta descriptions for all 11 pages
- GitHub Actions CI/CD pipeline (TypeScript check + build on push/PR)
- Vercel security headers (X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- SECURITY.md vulnerability disclosure timeline (72hr response, 90-day process)
- Page transition animations across all pages (fadeInUp, slideIn, scaleIn)
- Section completion indicators (green/gray dots in dropdown)
- Cover letter auto-fill from Personal Info job title
- Export loading states with disabled buttons
- Mobile profile manager in bottom bar
- Swipeable tabs on mobile (swipe left/right between Edit/Preview/Style/ATS/AI)
- Bottom sheet section picker with icons and completion dots
- Touch-friendly drag handles with larger grip areas on Experience/Education/Projects
- Mobile resume preview auto-scales to fit viewport
- Separate mobile tab row below navbar (full width, evenly spaced, icon+label)
- Responsive sidebar widths (320px md, 400px lg, 460px xl)
- Improved mobile action bar (vertical icon+label layout, larger tap targets)
- All mobile overflow issues fixed (tested on 10 devices from 280px to 1440px)
- Mobile tab bar text visibility fixed (explicit dark colors on dark navbar)
- HelpTip changed from button to span (fixes hydration nesting error)
- Completion bar thicker on mobile (h-1.5)
- Prev/Next buttons larger (h-10 px-4)
- Smart Matching accordion open by default
- AI quick actions use flex-wrap instead of grid-cols-3
- Improved skill matching accuracy (prefix stripping, quality scoring)
- Fixed Help/Profile button visibility in light mode

### v1.3.0
- PDF import support (pdfjs-dist for client-side PDF text extraction)
- Multiple resume profiles: save up to 10 profiles, load, rename, and delete
- Template preview modal: click the eye icon to preview a full-size template before selecting
- Drag-and-drop entry reordering within Experience, Education, and Projects sections
- Print CSS optimized with color-adjust and page-break rules for clean PDF output
- Clickable contact links (mailto, tel, https) in all 20 templates
- HelpTip tooltips on all major sections
- Smart Matching suggestions when a job title is entered

### v1.2.0
- Modernized Help Dialog UI with Card-based sections, gradient header, and section icons
- Modernized Onboarding Guide with gradient progress bar, step badges, and improved tip styling
- Improved keyboard shortcut display with realistic keycap-style kbd elements
- Larger, more touch-friendly navigation buttons in onboarding and help dialogs
- Completed step dots now show a distinct filled style for better progress visibility
- Updated README and HTML documentation with expanded Getting Started section

### v1.1.0
- Enhanced ATS panel with 12 new analysis tools:
  - Keyword Density with occurrence counts
  - Section Score Breakdown with mini progress bars
  - Flesch-Kincaid Readability Score
  - Formatting Warnings for ATS-breaking characters
  - Industry Keywords database (20 industries, 201 roles, 25-30 keywords each)
  - Resume Length Check with visual zone bar
  - Date Consistency checker (format, order, overlaps)
  - Active Voice Detector with suggested alternatives
  - JD Comparison with highlighted keyword matches
  - Multi-JD Matching (save up to 5 JDs, compare scores)
  - Keyword Auto-Insert suggestions by section
  - AI Gap Analysis for natural keyword integration

### v1.0.0
- 20 ATS-friendly resume templates
- AI Writing Assistant (Groq-powered, BYOK)
- Cover Letter Builder with AI generation
- ATS Score Checker with Job Description keyword matcher
- Photo/avatar upload support
- Custom sections with drag-and-drop reordering
- Rich text toolbar (bold, italic, bullets, dividers)
- Step-by-step wizard navigation (Previous/Next with progress dots)
- Multi-format import (PDF, DOCX, TXT, HTML, MD) with AI parsing
- Multi-format export (PDF, DOCX, HTML)
- 12 Google Fonts with lazy loading
- Typography, spacing, and color customization
- 11-step interactive onboarding guide
- Form validation with error messages
- Keyboard shortcuts (Ctrl+P, Ctrl+S, Ctrl+B, Ctrl+I)
- SEO: Open Graph, Twitter Cards, JSON-LD structured data
- PWA manifest for installable web app
- Dark/light mode
- Error boundary with recovery
- Static export for GitHub Pages / Vercel / Netlify deployment

## Troubleshooting

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| **Preview is blank / shows "Your Name"** | Browser has old cached data | Open DevTools (F12) → Console → type `localStorage.clear(); location.reload()` |
| **Old data showing after update** | localStorage persists between versions | Clear site data: Settings → Privacy → Clear browsing data → Cookies and site data |
| **Fonts not loading** | Google Fonts CDN blocked or slow | Check internet connection. The app uses lazy loading — only the selected font is fetched |
| **PDF export looks different from preview** | Browser print styles differ | Use Chrome for best results. Set margins to "None" and enable "Background graphics" in print dialog |
| **DOCX export missing formatting** | DOCX uses simplified layout | DOCX export is plain-formatted for ATS compatibility. Use PDF for styled output |
| **AI features not working** | No Groq API key configured | Go to AI tab → enter your free key from [console.groq.com/keys](https://console.groq.com/keys) |
| **AI returns error "Invalid API key"** | Key is wrong or expired | Generate a new key at console.groq.com/keys and re-enter it |
| **Import not parsing correctly** | Complex document formatting | Use DOCX or TXT for best results. Enable AI parsing with a Groq key for better accuracy |
| **Dark mode looks broken on templates** | Templates use white background by design | Templates are always white (for printing). Dark mode only affects the app UI |
| **Template thumbnails cut off in sidebar** | Screen width too narrow | Scroll down in the Style panel, or close the sidebar to give preview more space |
| **Photo not showing on resume** | Not all templates show photos | Photo display depends on the selected template. Try Modern, Tech, or Compact |
| **Custom section not appearing in preview** | Section is empty | Add at least one item with a title to the custom section |
| **Drag-and-drop reorder not working** | Need to click "Reorder Sections" first | Scroll to bottom of any form → click "Reorder Sections" → drag to reorder |
| **Page overflows (content cut off in PDF)** | Too much content for one page | Use the Compact template or reduce font size/spacing in Style panel. Check "~X pages" estimate |
| **App crashes / white screen** | JavaScript error | Click "Try Again" on the error screen, or "Reset & Reload" to clear all data |
| **`npm run dev` fails** | Missing dependencies | Run `npm install` first. Requires Node.js 18+ |
| **`npm run build` fails** | TypeScript errors | Run `npx tsc --noEmit` to see errors. Ensure all files are saved |
| **Onboarding popup won't stop showing** | localStorage flag cleared | Complete the tour or click "Skip". It won't show again after dismissal |
| **Keyboard shortcuts not working** | Focus is on an input field | Click outside the input field first, then use Ctrl+P or Ctrl+S |

### Reset Everything

If something is completely broken, reset all data:

```bash
# In browser console (F12 → Console)
localStorage.clear(); location.reload();
```

Or click the **Reset** button (↺) in the app header to clear resume data only.

## Designed By

**Surya L** - [GitHub](https://github.com/Surya8991)

## License

**Non-Commercial Use Only** - See [LICENSE](LICENSE) for full terms.

**You CAN:**
- Use this tool for free to build your resumes
- Study the code to learn how it works
- Use it as a reference to build your own original tools
- Fork and modify for personal/educational use
- Share it with others (with attribution)

**You CANNOT:**
- Sell this tool or charge money for access
- Offer it as a paid SaaS or subscription service
- Place ads or monetize it in any way
- White-label and resell it
- Clone it to create a competing commercial product

**For commercial licensing:** Contact Suryaraj8147@gmail.com
