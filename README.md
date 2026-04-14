# ResumeForge - ATS-Friendly Resume Generator

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Source--Available-orange)
![Templates](https://img.shields.io/badge/Templates-20-purple)


A professional resume builder with 20 ATS-optimized templates, AI-powered writing assistant, cover letter builder, freemium gates, optional sign-in, and multi-format import/export. Built with Next.js 16, Tailwind CSS, shadcn/ui, and Supabase auth.

**Free to start. No sign-up required. Your data stays in your browser.**

## Features

### Resume Building
- **20 ATS-Friendly Templates**: Classic, Modern, Minimalist, Professional, Executive, Creative, Compact, Tech, Elegant, Bold, Academic, Corporate, Nordic, Gradient, Timeline, Sidebar, Infographic, Federal, Startup, Monochrome
- **Live Preview**: Real-time rendering as you type with zoom controls (default 80%)
- **9+ Resume Sections**: Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Cover Letter + unlimited Custom Sections
- **Photo/Avatar Upload**: Optional profile photo with circular display on templates (max 2MB)
- **Cover Letter Builder**: Write or AI-generate cover letters with job title and company context
- **Custom Sections**: Add unlimited sections (Volunteer Work, Publications, Awards, etc.)
- **Drag-and-Drop Section Reordering**: Reorder how sections appear on your resume
- **Drag-and-Drop Entry Reordering**: Reorder individual entries within Experience, Education, and Projects
- **Rich Text Toolbar**: Bold, italic, bullet points, and dividers in text fields (Ctrl+B/I)
- **Month Picker Date Fields**: Browser-native month/year picker on Experience, Education, Projects, and Certifications dates
- **Guided Onboarding Tour**: 11-step interactive popup guide for new users with tips and navigation
- **Form Validation**: Required field indicators, email/phone/URL validation with error messages
- **Sample Resume**: Pre-loaded sample data (Sarah Mitchell, Product Manager) so new users see a working example immediately
- **Clickable Contact Links**: All templates render mailto, tel, and https links as clickable
- **HelpTip Tooltips**: (?) tooltips on all major sections for contextual guidance
- **Error Boundary**: Graceful error recovery with reset option
- **Step-by-Step Wizard**: Previous/Next navigation between sections with dropdown section navigator and progress dots
- **Keyboard Shortcuts**: Ctrl+P for PDF export, Ctrl+S for backup save
- **Page Estimate**: Shows estimated page count in preview toolbar
- **Auto-Save**: Data persists in localStorage automatically
- **Dark/Light Mode**: Theme toggle for comfortable editing
- **Smart Matching**: Suggests relevant job keywords when a job title is entered
- **Skill Suggestions**: Intelligent skill suggestions based on job title, drawn from 201-role industry data
- **Resume Completion Bar**: Color-coded progress bar tracking 10 completion criteria
- **Welcome Back Indicator**: Shows last edit time for returning users after >1 hour gap
- **Toast Notifications**: Visual feedback for actions (welcome, exports, limit warnings, Pro upgrades)

### Authentication & Profile
- **Supabase Auth**: Google OAuth and email/password sign-in (optional)
- **Profile Dropdown**: Avatar, Manage Plan, Reset Password, Export Data, Delete Account, Sign Out
- **GDPR Controls**: Export My Data and Delete Account from profile menu
- **Email Verification**: Pro features require verified email address
- **Auth-aware UI**: Builder header shows user avatar and last edited timestamp when signed in

### Pricing & Freemium
- **5 Pricing Tiers**: Free, Starter ($5/mo), Pro ($9/mo), Team ($19/mo), Lifetime ($49 one-time)
- **Free Daily Limits**: 1 AI rewrite per day, 3 PDF exports per day
- **Upgrade Modal**: In-app upgrade prompt when daily limits are hit
- **Waitlist Form**: Email capture on pricing page for Pro launch notifications
- **Pro Bypass**: Verified Pro users skip all daily limits

### Mobile Responsive
- **Swipeable Tabs**: Swipe left/right between Edit, Preview, Style, ATS, and AI tabs on mobile
- **Bottom Sheet Section Picker**: Slide-up sheet with icons and completion dots for quick section navigation
- **Touch-Friendly Drag Handles**: Larger grip areas on Experience, Education, and Projects for easy reordering
- **Auto-Scaling Preview**: Mobile resume preview automatically scales to fit the viewport width
- **Responsive Sidebar**: Adaptive widths (320px md, 400px lg, 460px xl)
- **Mobile Action Bar**: Vertical icon+label layout with larger tap targets
- **Mobile Tab Row**: Full-width, evenly spaced tabs with icon+label below the navbar
- **Mobile Dropdown Filter**: Templates page uses a native dropdown on mobile
- **Tested on 10 Devices**: Galaxy Fold (280px), Galaxy S23, iPhone SE, iPhone 14 Pro, Samsung A52, Pixel 7, iPad Mini, Tablet 768px, iPad Pro, Desktop 1440px

### Multiple Resume Profiles
- **Save Up to 10 Profiles**: Keep separate resumes for different job targets
- **Load, Rename, Delete**: Manage profiles from the header menu
- **Per-Profile Settings**: Each profile stores resume data, selected template, and accent color
- **Mobile Profile Manager**: Access profile switching from the bottom bar on mobile devices

### Template & Customization
- **Template Preview Modal**: Click the eye icon on any template to see a full-size preview before selecting
- **Typography**: 12 Google Fonts (Inter, Roboto, Open Sans, Lato, Merriweather, Playfair Display, etc.)
- **Font Size & Line Height**: Adjustable with sliders
- **Section Spacing & Page Margins**: Fine-tune layout density
- **Quick Presets**: Compact, Default, Comfortable, Roomy
- **10+ Accent Colors**: Plus custom color picker with hex input

### Import & Export
- **Import from PDF, DOCX, TXT, HTML, MD**: Upload an existing resume and auto-fill the form
- **AI-Powered Parsing**: Uses Groq AI (Llama 3.3 70B) for accurate resume parsing with heuristic fallback
- **Export as PDF**: Browser print for pixel-perfect output (best for ATS) - 3 free per day
- **Export as DOCX**: Microsoft Word format - unlimited
- **Export as HTML**: Web-ready format for online hosting - unlimited
- **JSON Backup**: Save and restore resume data via Ctrl+S

### ATS Optimization (12 Tools)
- **ATS Compatibility Score**: 7-check analysis with actionable feedback
- **Job Description Matcher**: Paste a job listing to see keyword match percentage
- **Missing/Matched Keywords**: Color-coded breakdown (red = missing, green = matched)
- **Keyword Density**: Shows occurrence count for each matched keyword
- **Section Score Breakdown**: Mini progress bars showing points per section
- **Readability Score**: Flesch-Kincaid scoring with interpretation
- **Formatting Warnings**: Detects ATS-breaking characters and inconsistencies
- **Industry Keywords**: 20 industries with 201 roles, 25-30 keywords each
- **Resume Length Check**: Word count with zone bar
- **Date Consistency**: Checks formats, chronological order, and overlaps
- **Active Voice Detector**: Flags passive voice in bullet points with active alternatives
- **JD Comparison**: Shows resume text with matched keywords highlighted
- **Multi-JD Matching**: Save up to 5 job descriptions, compare match scores in a table
- **Keyword Auto-Insert**: Classifies missing keywords by target section
- **AI Gap Analysis**: Uses Groq AI to suggest how to naturally add missing keywords
- **AI Writing Assistant**: Generate professional summaries, bullet points, skills, and custom prompts (1 free per day)

### SEO & Performance
- **Open Graph Tags**: Optimized for LinkedIn, Twitter, Facebook sharing
- **Per-Page OG Meta**: Unique Open Graph titles and descriptions for each page
- **Twitter Cards**: Large image card for social sharing
- **JSON-LD Schema**: WebSite, WebApplication, and Organization structured data
- **Dynamic OG Image**: Edge-rendered PNG via Next.js ImageResponse
- **Dynamic robots.ts and sitemap.ts**: Native Next.js metadata routes
- **FAQ Schema**: Structured data on FAQ and ATS Guide pages
- **PWA Manifest**: Installable web app with icons and theme color
- **Lazy Font Loading**: Only the selected Google Font is loaded
- **GitHub Actions CI/CD**: Automated TypeScript checking and build verification

### Security
- **CSP and Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **OAuth Redirect Whitelist**: Auth callback validates redirect destinations
- **Singleton Supabase Client**: Prevents memory leaks and infinite re-renders
- **Email Verification Gate**: Pro features blocked until email is confirmed
- **Browser-Only API Keys**: Groq API key stored in localStorage, never sent to ResumeForge servers
- **404 Page**: Custom not-found page with helpful navigation

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand with localStorage persistence
- **Auth**: Supabase (`@supabase/ssr` + `@supabase/supabase-js`)
- **Resume Import**: mammoth (DOCX), pdfjs-dist (PDF), client-side text extraction
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **PDF Export**: react-to-print (browser print)
- **DOCX Export**: docx + file-saver
- **AI Integration**: Groq API (Llama 3.3 70B), optional, free
- **Icons**: Lucide React

## Getting Started

ResumeForge runs in your browser with optional Supabase auth for Pro features. Clone the repository, install dependencies, set up environment variables, and you are ready to build resumes locally. All resume data is persisted in your browser's localStorage so your content stays on your machine.

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)
- A free Supabase project (only needed for auth/Pro features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Surya8991/resumeforge.git
cd resumeforge

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Then edit .env.local with your Supabase project credentials

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. A sample resume is pre-loaded so you can explore templates, ATS scoring, and export options right away.

### Build for Production

```bash
npm run build
```

This generates a Next.js production build, ready for deployment to Vercel, Netlify, or any Node.js hosting provider.

### Environment Variables

Required for auth and Pro features (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The app works for resume building without Supabase (auth-gated features will be disabled). The Groq AI key is entered in the browser by users, never as an environment variable.

## How to Use

1. **Follow the onboarding tour**: First-time users see an 11-step guided popup
2. **Edit the sample resume**: Replace the pre-loaded sample data with your own details
3. **Upload a photo**: Add an optional profile photo in Personal Info
4. **Choose a template**: Click "Style" to browse 20 designs; use the eye icon to preview full-size
5. **Manage profiles**: Save up to 10 resume profiles from the header menu
6. **Customize appearance**: Adjust font, colors, spacing, and margins
7. **Add custom sections**: Click "Add Section" for Volunteer Work, Publications, etc.
8. **Reorder sections & entries**: Click "Reorder Sections" or drag entries within sections
9. **Import existing resume**: Click "Import" to upload PDF, DOCX, TXT, HTML, or MD
10. **Write a cover letter**: Use the Cover Letter tab with optional AI generation
11. **Check ATS score**: Click "ATS" to analyze compatibility and match job descriptions
12. **Use AI suggestions**: Click "AI" to get AI-powered content improvements
13. **Download**: Export as PDF, DOCX, or HTML
14. **Sign in (optional)**: Click "Sign in" to save your profile and access Pro features when launched

### AI Features (Bring Your Own Key)

**No API key is included with this app.** AI features require your own free Groq API key:

1. Visit [console.groq.com/keys](https://console.groq.com/keys) and sign up (free)
2. Click "Create API Key" and copy it
3. In the app, go to AI tab and paste your key
4. Your key is stored only in your browser localStorage. It is never sent to any server except Groq's API.

> **Note:** The app works fully without an API key. AI features are optional enhancements. All core resume building, templates, ATS scoring, and export features work without any API key.

## Deployment

### Vercel (Recommended)

```bash
npx vercel
```

Set the four Supabase environment variables in Vercel project settings, then redeploy.

### Self-Hosted Node.js

```bash
npm run build
npm start
```

The app requires a Node.js runtime for proxy (auth refresh) and server components. Static export is no longer used.

## Project Structure

```
resumeforge/
├── app/
│   ├── layout.tsx                  # Root layout with JSON-LD schema
│   ├── page.tsx                    # Homepage
│   ├── builder/page.tsx            # Resume builder (tabs, sidebar, preview)
│   ├── login/page.tsx              # Login (Google OAuth + email/password)
│   ├── forgot-password/page.tsx    # Password reset flow
│   ├── auth/callback/route.ts      # OAuth callback handler
│   ├── pricing/page.tsx            # 5-tier pricing + waitlist
│   ├── terms/page.tsx              # Terms of Use (server component)
│   ├── not-found.tsx               # Custom 404 page
│   ├── opengraph-image.tsx         # Dynamic OG image
│   ├── robots.ts                   # Dynamic robots.txt
│   ├── sitemap.ts                  # Dynamic sitemap.xml
│   └── globals.css                 # Global + print + page-break styles
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── forms/                      # 9 form components + custom + cover letter
│   ├── templates/                  # 20 resume templates
│   ├── preview/ResumePreview.tsx   # Live preview with style overrides
│   ├── ats/                        # ATS Score Checker + AI Suggestions
│   ├── SiteNavbar.tsx              # Site navigation with profile dropdown
│   ├── SiteFooter.tsx              # Footer with social links
│   ├── Toast.tsx                   # Toast notification system
│   ├── Providers.tsx               # AuthContext + ToastProvider
│   ├── UpgradeModal.tsx            # Pro upgrade prompt
│   └── HelpDialog.tsx              # Help guide
├── hooks/
│   └── useAuth.ts                  # Supabase auth hook (singleton client)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client (singleton)
│   │   └── server.ts               # Server Supabase client
│   ├── usage.ts                    # Daily usage limits (AI, PDF)
│   ├── dateUtils.ts                # Month picker conversion helpers
│   ├── importResume.ts             # PDF/DOCX/TXT/HTML/MD import
│   ├── exportDocx.ts               # DOCX generation
│   └── exportHtml.ts               # HTML export with sanitization
├── store/
│   └── useResumeStore.ts           # Zustand store with persistence
├── types/
│   └── resume.ts                   # Types, template configs, sample data
├── proxy.ts                        # Next.js 16 proxy (auth session refresh)
└── public/
    ├── manifest.json               # PWA manifest
    └── llms.txt                    # LLM discovery file
```

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

- Keyboard navigable: all form fields, buttons, and dropdowns accessible via Tab/Enter/Escape
- Aria-expanded and aria-label on mobile menu toggle
- Section dropdown and progress dots support keyboard interaction
- Form labels associated with inputs via `htmlFor`
- Focus rings on interactive elements (`focus-visible`)
- Dark mode for comfortable editing in low-light
- Color contrast meets WCAG AA standards
- Screen reader support via semantic HTML and ARIA attributes
- Responsive design works with zoom up to 200%

## Performance

- **Singleton Supabase client**: prevents redundant connections and re-renders
- **Lazy font loading**: only the selected Google Font is fetched
- **Edge OG image**: dynamic generation via Next.js ImageResponse
- **Turbopack**: fast development builds with Next.js 16
- **No third-party tracking**: zero analytics, cookies, or scripts
- **Typical bundle size**: ~600KB gzipped

## Contributing

Contributions are welcome and appreciated. Whether it is fixing a bug, adding a feature, improving documentation, or suggesting ideas, all contributions help make ResumeForge better for everyone.

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **Make your changes** and test them locally with `npm run dev`
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear description

### Contribution Guidelines

- Keep PRs focused: one feature or fix per pull request
- Follow the existing code style (TypeScript, Tailwind CSS)
- Test your changes locally before submitting
- Update the README if your change adds new features or modifies behavior
- Be respectful and constructive in discussions

### Reporting Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/Surya8991/resumeforge/issues) with details about the problem or your idea.

## Designed By

**Surya L** - [GitHub](https://github.com/Surya8991)

## License

**Source-Available** - See [LICENSE](LICENSE) for full terms.

**You CAN:**
- Use this tool for free to build your resumes
- Study the code to learn how it works
- Use it as a reference to build your own original tools
- Fork and modify for personal/educational use

**You CANNOT (without permission):**
- Sell, sublicense, rent, or charge money for access to this Software
- Offer it as a paid SaaS or competing product
- White-label and resell it
- Clone it to create a competing commercial product

The original author (Surya L) retains exclusive rights to monetize and operate ResumeForge as a commercial service.

**For commercial licensing:** Contact Suryaraj8147@gmail.com
