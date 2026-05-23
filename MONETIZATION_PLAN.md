# ResumeBuildz — 1-Year Monetization & Growth Execution Plan

**Author:** Surya L
**Date:** April 2026
**Status:** Planning Phase

---

## Executive Summary

ResumeBuildz is a free, open-source, client-side ATS resume builder with 20 templates, AI writing, and 12 ATS analysis tools. This plan outlines the strategy to monetize it through a freemium model while maintaining the open-source community.

---

## Phase 1: Foundation (Month 1-2)

### 1.1 Authentication System ✅ DONE
- **Tool:** Better Auth (open-source, self-hosted) + Neon PostgreSQL + Drizzle ORM
- **Implementation:** Google OAuth + email/password via Better Auth
- **Data:** User profiles, subscription status, saved resumes in Neon PostgreSQL
- **Files:**
  - `lib/auth.ts` — Better Auth server config
  - `lib/auth-client.ts` — Client-side auth hooks
  - `lib/db/schema.ts` — Drizzle ORM schema (8 tables)
  - `lib/db/index.ts` — Neon serverless DB client
  - `app/api/auth/[...all]/route.ts` — Better Auth catch-all handler

### 1.2 Payment Integration
- **Tool:** Stripe Checkout + Stripe Customer Portal
- **Plans:**
  - Free: $0 (default)
  - Pro Monthly: $9.99/month
  - Pro Yearly: $59.99/year (save 50%)
  - Lifetime: $49.99 one-time
- **Implementation:** Stripe Checkout sessions, webhooks for subscription events
- **Effort:** 2-3 days

### 1.3 Feature Gating
- **Free tier gets:**
  - 5 templates (Classic, Modern, Minimalist, Professional, Compact)
  - Basic ATS score (7 checks only)
  - 1 resume profile
  - PDF export only
  - No AI features
- **Pro tier gets:**
  - All 20 templates
  - Full ATS suite (12 analysis tools)
  - 10 resume profiles
  - PDF, DOCX, HTML export
  - AI Writing Assistant
  - Industry Keywords (201 roles)
  - Multi-JD Matching
  - Priority support
- **Implementation:** `isPro()` hook checking profile plan via Better Auth session
- **Effort:** 1-2 days

### 1.4 Pricing Page
- **Route:** `/pricing`
- **Design:** 3-column pricing cards (Free, Pro Monthly, Pro Yearly) + Lifetime badge
- **Feature comparison table**
- **FAQ section specific to pricing**
- **Effort:** 1 day

---

## Phase 2: Launch (Month 2-3)

### 2.1 Product Hunt Launch
- **Timing:** Tuesday or Wednesday (best days for PH)
- **Tagline:** "Free ATS resume builder with AI — no sign-up needed"
- **Key selling points:**
  - 20 templates, 100% free tier
  - AI writing with BYOK (no hidden costs)
  - 12 ATS analysis tools
  - Privacy-first (all data in browser)
- **Hunter:** Find a top hunter on PH to submit
- **Preparation:** Ship 1 week before launch, get 10+ early reviews
- **Goal:** Top 5 of the day, 500+ upvotes

### 2.2 AppSumo Lifetime Deal
- **Price:** $49 lifetime (one-time)
- **Platform fee:** 30% to AppSumo
- **Net:** $34.30 per sale
- **Goal:** 500 sales = $17,150
- **Duration:** 60-day campaign

### 2.3 Hacker News / Reddit Launch
- **Show HN post:** Focus on the open-source + privacy angle
- **Reddit:** Post in r/resumes, r/jobs, r/webdev, r/SideProject
- **Content:** "I built a free ATS resume builder that doesn't store your data"

### 2.4 Early Adopter Pricing
- **First 100 Pro users:** 50% off forever ($4.99/month)
- **Creates urgency and loyalty**
- **Announce via email capture from free users**

---

## Phase 3: Growth (Month 3-6)

### 3.1 SEO Strategy
- **Already built:** ATS Guide, Resume Tips, Cover Letter Guide pages
- **Add blog section** (`/blog`) with articles:
  - "How to Write an ATS-Friendly Resume in 2026"
  - "50 Action Verbs That Will Get Your Resume Past ATS"
  - "Complete Guide to Resume Keywords by Industry"
  - "How to Use AI to Write Your Resume (Without It Sounding Generic)"
  - "Resume vs CV: Which One Should You Use?"
- **Target keywords:**
  - "free resume builder" (135K monthly searches)
  - "ATS resume builder" (18K)
  - "resume templates free" (90K)
  - "ATS friendly resume" (22K)
- **Technical SEO:**
  - Already have: Open Graph, Twitter Cards, JSON-LD, sitemap
  - Add: Blog post schema, FAQ schema on FAQ page
  - Improve: Meta descriptions per page, alt text on template images
- **Goal:** 10K organic monthly visitors by Month 6

### 3.2 Content Marketing
- **YouTube:** 5-minute tutorials
  - "How to Build an ATS Resume in 5 Minutes (Free)"
  - "I Tested My Resume Against ATS — Here's What Happened"
  - "20 Resume Templates Ranked by ATS Score"
- **Twitter/X:** Daily resume tips, before/after examples
- **LinkedIn:** Weekly posts about job search tips + tool mention
- **TikTok:** 60-second resume tips (surprisingly high engagement)

### 3.3 Email Marketing
- **Tool:** Resend (free for 3K emails/month) or Loops
- **Capture:** Email popup on landing page after 30 seconds
- **Sequences:**
  1. Welcome + quick start guide
  2. "5 ATS mistakes to avoid" (Day 3)
  3. "Try our AI writing assistant" — Pro feature teaser (Day 7)
  4. "Your resume score improved!" — re-engagement (Day 14)
  5. Pro upgrade offer with 20% discount (Day 21)
- **Goal:** 5K email subscribers by Month 6

### 3.4 Social Proof
- **Add testimonials** on landing page (real user quotes)
- **Collect reviews** on G2, Capterra, Trustpilot
- **Show usage stats** ("10K+ resumes created")
- **Add "As seen on" logos** after PH/AppSumo launch

---

## Phase 4: Scale (Month 6-12)

### 4.1 Advanced Features (Pro-only)
- **Resume scoring history** — track ATS score over time
- **AI resume rewriter** — paste old resume, AI rewrites for target role
- **Interview question generator** — AI generates questions based on resume + JD
- **LinkedIn profile optimizer** — analyze and improve LinkedIn based on resume
- **Resume analytics dashboard** — word cloud, keyword frequency, section balance

### 4.2 B2B / Enterprise
- **University career centers** — bulk licensing ($500/year per university)
- **Bootcamps** — partner with coding bootcamps (Lambda, Flatiron, etc.)
- **Staffing agencies** — white-label for recruitment firms
- **Pricing:** Custom enterprise quotes, $5-10 per user per year

### 4.3 Affiliate Program
- **Commission:** 30% recurring for referrals
- **Tools:** Rewardful or FirstPromoter
- **Target:** Career coaches, resume reviewers, YouTubers
- **Materials:** Banner ads, referral links, email templates

### 4.4 Partnerships
- **Job boards:** Indeed, LinkedIn, Glassdoor — "Build your resume" integration
- **Career platforms:** Handshake (college students), Wellfound (startups)
- **AI companies:** Groq partnership for featured integration

---

## Brand Guidelines

### Voice & Tone
- **Professional but approachable** — not corporate, not casual
- **Empowering** — "You've got this. We just make the resume part easy."
- **Privacy-first** — Always emphasize data stays in the browser
- **Anti-complexity** — "No sign-up. No server. No limits."

### Visual Identity
- **Primary color:** Blue (#2563eb) — trust, professionalism
- **Dark hero:** Gradient gray-900 to black — modern, tech-forward
- **Typography:** Geist Sans (clean, modern)
- **Icons:** Lucide React (consistent line icons)
- **Cards:** White with subtle shadows, rounded-xl

### Key Messages
1. "Build ATS-Friendly Resumes in Minutes"
2. "20 Templates. AI Writing. 100% Free."
3. "Your data stays in your browser. Period."
4. "The only resume builder that scores your resume in real-time."

---

## Social Media Strategy

### Platforms & Posting Schedule
| Platform | Frequency | Content Type |
|----------|-----------|-------------|
| Twitter/X | Daily | Tips, stats, before/after, product updates |
| LinkedIn | 3x/week | Career advice, feature showcases, user stories |
| YouTube | 2x/month | Tutorials, template walkthroughs, ATS deep dives |
| TikTok | 3x/week | 60-sec resume tips, quick template showcases |
| Reddit | Weekly | Value posts in r/resumes, r/jobs, r/careerguidance |
| Instagram | 2x/week | Template carousels, resume tip infographics |

### Content Pillars
1. **Resume tips** (40%) — Action verbs, formatting, ATS optimization
2. **Product features** (25%) — New template showcase, AI demo, score walkthrough
3. **Career advice** (20%) — Interview tips, job search strategy, networking
4. **User stories** (15%) — Before/after resumes, success stories, testimonials

### Hashtags
- #ResumeBuilder #ATSResume #JobSearch #CareerTips #ResumeTips
- #FreeResumeBuilder #ResumeBuildz #ATSOptimization #JobHunting

---

## SEO Keyword Targets

### Primary Keywords (High Volume)
| Keyword | Monthly Volume | Difficulty | Target Page |
|---------|---------------|------------|-------------|
| free resume builder | 135,000 | High | / (landing) |
| resume templates free | 90,000 | High | /templates |
| resume builder | 201,000 | Very High | / (landing) |
| ATS resume builder | 18,000 | Medium | / (landing) |
| ATS friendly resume | 22,000 | Medium | /ats-guide |

### Long-tail Keywords (Lower Competition)
| Keyword | Monthly Volume | Difficulty | Target Page |
|---------|---------------|------------|-------------|
| free ATS resume builder no sign up | 2,400 | Low | / |
| resume builder with AI | 5,400 | Medium | / |
| how to pass ATS screening | 8,100 | Medium | /ats-guide |
| resume action verbs list | 12,000 | Low | /resume-tips |
| cover letter generator free | 14,000 | Medium | /cover-letter |
| resume builder open source | 1,200 | Low | /about |
| best resume templates 2026 | 6,600 | Medium | /templates |

---

## Financial Projections (Year 1)

### Conservative Scenario
| Month | Free Users | Pro Subs | Lifetime Sales | MRR | Total Revenue |
|-------|-----------|----------|----------------|-----|--------------|
| 1 | 200 | 5 | 10 | $50 | $550 |
| 2 | 500 | 15 | 20 | $150 | $1,150 |
| 3 | 1,500 | 40 | 50 | $400 | $2,900 |
| 4 | 3,000 | 80 | 30 | $800 | $2,300 |
| 5 | 5,000 | 130 | 20 | $1,300 | $2,300 |
| 6 | 8,000 | 200 | 15 | $2,000 | $2,750 |
| 7-12 | 15,000+ | 500+ | 50+ | $5,000+ | $5,000+/mo |
| **Year 1 Total** | | | | | **~$35,000** |

### Optimistic (with PH #1 + AppSumo success)
| Year 1 Total | ~$75,000-$100,000 |

### Costs
| Item | Monthly Cost |
|------|-------------|
| Neon (Free/Pro) | $0-19 |
| Vercel (Pro) | $20 |
| Stripe fees | ~3% of revenue |
| Domain | $12/year |
| Email (Resend) | $0-20 |
| **Total** | ~$50-70/month |

### Profit Margin: 95%+ (SaaS with no server-side compute)

---

## Technical Roadmap for Monetization

### Sprint 1 (Week 1-2): Auth + Payments ✅ DONE
- [x] Set up Neon PostgreSQL + Drizzle ORM
- [x] Add Better Auth with Google OAuth + email/password
- [x] Create login/signup pages
- [x] Integrate Stripe Checkout
- [x] Add webhook handler for subscription events
- [x] Create pricing page

### Sprint 2 (Week 3): Feature Gating
- [ ] Create `useSubscription()` hook
- [ ] Gate templates (5 free, 15 pro)
- [ ] Gate ATS features (basic free, full pro)
- [ ] Gate export formats (PDF free, DOCX/HTML pro)
- [ ] Gate AI features (pro only)
- [ ] Gate resume profiles (1 free, 10 pro)
- [ ] Add upgrade prompts in gated UI

### Sprint 3 (Week 4): Launch Prep
- [ ] Add email capture form
- [ ] Set up Resend for transactional emails
- [ ] Create Product Hunt assets (screenshots, description, video)
- [ ] Apply for AppSumo listing
- [ ] Write launch blog post
- [ ] Set up analytics (Plausible or PostHog — privacy-friendly)

### Sprint 4 (Month 2): Launch
- [ ] Launch on Product Hunt
- [ ] Post on Hacker News, Reddit, Twitter
- [ ] Start AppSumo campaign
- [ ] Begin email sequences
- [ ] Collect first testimonials

---

## Competitive Advantages

| vs Competitor | ResumeBuildz Edge |
|--------------|-----------------|
| Resume.io ($25/mo) | Free tier, lifetime deal, open source |
| Zety ($24/mo) | No sign-up needed, 100% private |
| Jobscan ($50/mo) | 12 ATS tools included (they charge extra) |
| Canva Resume | ATS scoring, keyword matching, AI writing |
| NovoResume ($20/mo) | 20 templates vs 6, industry keywords |
| Google Docs templates | AI writing, ATS scoring, drag-drop |

---

## Key Metrics to Track

| Metric | Tool | Target (Month 6) |
|--------|------|------------------|
| Monthly Active Users | Vercel Analytics | 8,000 |
| Free to Pro conversion | Stripe Dashboard | 3-5% |
| Monthly Recurring Revenue | Stripe | $2,000 |
| Organic Traffic | Google Search Console | 10K/month |
| Email Subscribers | Resend | 5,000 |
| Product Hunt Upvotes | PH | 500+ |
| GitHub Stars | GitHub | 1,000+ |
| NPS Score | In-app survey | 60+ |

---

## Summary

ResumeBuildz has strong product-market fit with a differentiated value proposition (free, private, open-source, comprehensive ATS tools). The monetization path is clear: freemium model with generous free tier to drive adoption, Pro tier for power users, and lifetime deals for early traction. The 95%+ profit margin and zero server-side costs make this highly scalable.

**Next action:** Tell me when you're ready to start Sprint 1 (Auth + Payments).
