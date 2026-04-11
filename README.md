# ResumeForge - ATS-Friendly Resume Generator

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Non--Commercial-red)
![Templates](https://img.shields.io/badge/Templates-20-purple)

A fully client-side, professional resume builder with 20 ATS-optimized templates, AI-powered writing assistant, cover letter builder, guided onboarding, and multi-format import/export. Built with Next.js 16, Tailwind CSS, and shadcn/ui.

**No sign-up. No server. No limits. 100% free.**

## Features

### Resume Building
- **20 ATS-Friendly Templates** - Classic, Modern, Minimalist, Professional, Executive, Creative, Compact, Tech, Elegant, Bold, Academic, Corporate, Nordic, Gradient, Timeline, Sidebar, Infographic, Federal, Startup, Monochrome
- **Live Preview** - Real-time rendering as you type with zoom controls (default 80%)
- **9+ Resume Sections** - Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages + unlimited Custom Sections
- **Photo/Avatar Upload** - Optional profile photo with circular display on templates (max 2MB)
- **Cover Letter Builder** - Write or AI-generate cover letters with job title and company context
- **Custom Sections** - Add unlimited sections (Volunteer Work, Publications, Awards, etc.)
- **Drag-and-Drop Section Reordering** - Reorder how sections appear on your resume
- **Rich Text Toolbar** - Bold, italic, bullet points, and dividers in text fields (Ctrl+B/I)
- **Guided Onboarding Tour** - 11-step interactive popup guide for new users with tips and navigation
- **Form Validation** - Required field indicators, email/phone/URL validation with error messages
- **Sample Resume** - Pre-loaded sample data so new users see a working example immediately
- **Error Boundary** - Graceful error recovery with reset option
- **Step-by-Step Wizard** - Previous/Next navigation between sections with step counter and progress dots
- **Keyboard Shortcuts** - Ctrl+P for PDF export, Ctrl+S for JSON save
- **Page Estimate** - Shows estimated page count in preview toolbar
- **Auto-Save** - Data persists in localStorage automatically
- **Dark/Light Mode** - Theme toggle for comfortable editing
- **PWA Ready** - Web app manifest for installable experience

### Customization
- **Typography** - 12 Google Fonts (Inter, Roboto, Open Sans, Lato, Merriweather, Playfair Display, etc.)
- **Font Size & Line Height** - Adjustable with sliders
- **Section Spacing & Page Margins** - Fine-tune layout density
- **Quick Presets** - Compact, Default, Comfortable, Roomy
- **10+ Accent Colors** - Plus custom color picker with hex input

### Import & Export
- **Import from DOCX, TXT, HTML, MD** - Upload an existing resume and auto-fill the form
- **AI-Powered Parsing** - Uses Groq AI (Llama 3.3 70B) for accurate resume parsing with heuristic fallback
- **Export as PDF** - Browser print for pixel-perfect output (best for ATS)
- **Export as DOCX** - Microsoft Word format
- **Export as HTML** - Web-ready format for online hosting
- **JSON Import/Export** - Backup and transfer resume data across devices

### ATS Optimization
- **ATS Compatibility Score** - Analyzes resume with 7 checks and actionable feedback
- **Job Description Matcher** - Paste a job listing to see keyword match percentage
- **Missing/Matched Keywords** - Color-coded breakdown (red = missing, green = matched)
- **AI Writing Assistant** - Generate professional summaries, bullet points, skills, and custom prompts

### SEO & Performance
- **Open Graph Tags** - Optimized for LinkedIn, Twitter, Facebook sharing
- **Twitter Cards** - Large image card for social sharing
- **JSON-LD Schema** - WebApplication structured data for search engines
- **PWA Manifest** - Installable web app with icons and theme color
- **Lazy Font Loading** - Only the selected Google Font is loaded

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand with localStorage persistence
- **DOCX Import:** mammoth (client-side text extraction)
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **PDF Export:** react-to-print (browser print)
- **DOCX Export:** docx + file-saver
- **AI Integration:** Groq API (Llama 3.3 70B) - optional, free
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This generates a static export in the `out/` folder, ready for deployment.

## How to Use

1. **Follow the onboarding tour** - First-time users see an 11-step guided popup (restart from Help menu)
2. **Edit the sample resume** - Replace the pre-loaded sample data with your own details
3. **Upload a photo** - Add an optional profile photo in Personal Info
4. **Choose a template** - Click "Style" to browse 20 designs with live previews
5. **Customize appearance** - Adjust font, colors, spacing, and margins
6. **Add custom sections** - Click "Add Section" for Volunteer Work, Publications, etc.
7. **Reorder sections** - Click "Reorder Sections" at the bottom of any form
8. **Import existing resume** - Click "Import Resume" to upload DOCX, TXT, HTML, or MD
9. **Write a cover letter** - Use the Cover Letter tab with optional AI generation
10. **Check ATS score** - Click "ATS" to analyze compatibility and match job descriptions
11. **Use AI suggestions** - Click "AI" to get AI-powered content improvements
12. **Download** - Export as PDF, DOCX, HTML, or JSON

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
    ├── importResume.ts             # DOCX/TXT/HTML/MD import + AI parsing
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

### v1.0.0
- 20 ATS-friendly resume templates
- AI Writing Assistant (Groq-powered, BYOK)
- Cover Letter Builder with AI generation
- ATS Score Checker with Job Description keyword matcher
- Photo/avatar upload support
- Custom sections with drag-and-drop reordering
- Rich text toolbar (bold, italic, bullets, dividers)
- Step-by-step wizard navigation (Previous/Next with progress dots)
- Multi-format import (DOCX, TXT, HTML, MD) with AI parsing
- Multi-format export (PDF, DOCX, HTML, JSON)
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
