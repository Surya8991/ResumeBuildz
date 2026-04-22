// Blog post registry. Each entry points to an existing page URL. The blog
// hub is an index layer, not a URL move, so no SEO redirects are needed.
// Company pages live at /blog/company-guides/[company] and are surfaced
// here via a "company-guides" category that links to the /blog/company-guides hub.

export interface BlogPost {
  slug: string; // canonical URL slug (matches the actual page path after /)
  title: string;
  excerpt: string; // 1-2 sentence description for cards and SEO
  category: string; // BlogCategory slug
  tags: string[];
  author: string;
  datePublished: string; // ISO yyyy-mm-dd
  dateModified: string; // ISO yyyy-mm-dd
  readingTime: number; // minutes
  featured?: boolean; // show in hero carousel
  /**
   * Optional scheduled-publish timestamp. If set AND in the future, the
   * post is hidden from /blog hub, sitemap, RSS, and related-post arrays,
   * and its route returns 404 until the date passes. Absent = published
   * immediately on deploy (current behaviour for every post committed
   * before scheduling shipped).
   *
   * Format: ISO 8601 UTC, e.g. '2026-04-21T04:47:00Z' (10:17 IST).
   * Keep scheduled posts in the 09:00-12:00 IST publishing window.
   */
  publishAt?: string;
}

/**
 * Returns true when a post is publicly visible — either no schedule
 * was set, or the scheduled time has passed. Used as the single source
 * of truth for visibility across hub, sitemap, RSS, and per-route
 * 404 guards.
 */
export function isPublished(post: { publishAt?: string }, now: Date = new Date()): boolean {
  if (!post.publishAt) return true;
  const target = new Date(post.publishAt);
  if (Number.isNaN(target.getTime())) return true; // malformed -> treat as published (fail open)
  return target.getTime() <= now.getTime();
}

export const BLOG_POSTS: BlogPost[] = [
  // ─────────── Resume Writing ───────────
  {
    slug: 'fresher-resume',
    title: 'Fresher Resume Format 2026',
    excerpt:
      'The exact 7-section format that beats Indian and global ATS for freshers. Built for campus placements, off-campus drives, and NQT/InfyTQ/NTH applications.',
    category: 'resume-writing',
    tags: ['fresher', 'format', 'template', 'campus'],
    author: 'Surya L',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
    readingTime: 11,
    featured: true,
  },
  {
    slug: 'resume-tips',
    title: 'Resume Writing Tips That Actually Work',
    excerpt:
      'The practical tips recruiters wish more candidates followed — from quantified bullets and action verbs to the one-page rule and file naming.',
    category: 'resume-writing',
    tags: ['tips', 'bullets', 'action-verbs'],
    author: 'Surya L',
    datePublished: '2026-03-20',
    dateModified: '2026-04-15',
    readingTime: 9,
  },
  {
    slug: 'resume-action-verbs',
    title: '200+ Resume Action Verbs by Category (with Examples)',
    excerpt:
      '210 powerful verbs grouped by role (leadership, technical, sales, analysis, more). Includes the weak-to-strong swap table and 10 real bullet examples.',
    category: 'resume-writing',
    tags: ['action-verbs', 'bullets', 'writing'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 9,
  },
  {
    slug: 'resume-length',
    title: 'Resume Length in 2026: 1 Page vs 2 Pages',
    excerpt:
      'How long should a resume be in 2026? 1 page under 5 years, 2 above. Full framework with career stage, industry, and cutting/expanding tactics.',
    category: 'resume-writing',
    tags: ['length', 'formatting', 'one-page', 'two-page'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 8,
  },
  {
    slug: 'resume-summary-examples',
    title: '25 Resume Summary Examples That Get Interviews (2026)',
    excerpt:
      '15 summary examples by career stage + 10 by industry. Before/after versions, the 4-part formula, common mistakes, and how to use AI without generic phrasing.',
    category: 'resume-writing',
    tags: ['summary', 'examples', 'formula'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 14,
    featured: true,
  },
  {
    slug: 'resume-format-guide',
    title: 'Best Resume Format 2026: Chronological vs Functional vs Hybrid',
    excerpt:
      'The 3 formats compared. Which beats ATS, which recruiters actually read, and the decision tree for picking the right one for your situation.',
    category: 'resume-writing',
    tags: ['format', 'chronological', 'hybrid', 'functional', 'ATS'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 10,
  },
  {
    slug: 'quantify-resume-achievements',
    title: 'How to Quantify Resume Achievements (50+ Examples by Role)',
    excerpt:
      'Turn vague bullets into metric-driven proof. The XYZ formula, where to find numbers, and 50+ examples across 8 roles.',
    category: 'resume-writing',
    tags: ['metrics', 'bullets', 'XYZ-formula', 'quantification'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 12,
    featured: true,
  },

  // ─────────── ATS & Keywords ───────────
  {
    slug: 'ats-guide',
    title: 'How to Beat ATS: The Complete Guide',
    excerpt:
      '75% of resumes never reach a human recruiter. Here is how ATS works, why your resume might be filtered, and exactly how to fix it.',
    category: 'ats-keywords',
    tags: ['ATS', 'keywords', 'parsing'],
    author: 'Surya L',
    datePublished: '2026-02-15',
    dateModified: '2026-04-15',
    readingTime: 12,
    featured: true,
  },
  {
    slug: 'pass-ats-resume-scanning',
    title: 'How to Pass ATS Resume Scanning in 2026',
    excerpt:
      '98% of Fortune 500 use an ATS. 75% of resumes never reach a human. The practical 2026 playbook: 7 killers, 10 tactics, PDF vs DOCX truth, and the top 5 systems explained.',
    category: 'ats-keywords',
    tags: ['ATS', 'keywords', 'parsing', 'workday', 'greenhouse'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 11,
    featured: true,
  },

  // ─────────── Career Transitions ───────────
  {
    slug: 'resume-after-layoff',
    title: 'Resume After a Layoff: A 5-Step Guide for 2026',
    excerpt:
      '250,000+ tech workers were laid off in 2024 and another 100,000+ in early 2025. Here is exactly how to write a resume that gets interviews, with no apologetic tone and no awkward gaps.',
    category: 'career-transitions',
    tags: ['layoff', 'recovery', 'email-templates'],
    author: 'Surya L',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
    readingTime: 12,
    featured: true,
  },
  {
    slug: 'resume-after-career-gap',
    title: 'How to Write a Resume After a Career Gap',
    excerpt:
      'A career gap is not a deal-breaker. 62% of professionals have non-linear career paths. Here is how to address the gap honestly and still get interviews.',
    category: 'career-transitions',
    tags: ['career-gap', 'returnship', 'caregiving'],
    author: 'Surya L',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
    readingTime: 10,
  },
  {
    slug: 'resume-for-career-change',
    title: 'Resume for Career Change: The 5-Step Pivot Guide',
    excerpt:
      'Transferable-skills rewriting, hybrid format, 6 common pivot examples, realistic 12-month timeline, and an informational interview email template.',
    category: 'career-transitions',
    tags: ['career-change', 'pivot', 'transferable-skills'],
    author: 'Surya L',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
    readingTime: 11,
  },

  // ─────────── Interviews & Cover Letters ───────────
  {
    slug: 'cover-letter',
    title: 'Cover Letter Guide & Templates',
    excerpt:
      'How to write a cover letter that pairs with a strong resume — 4-part structure, 6 industry templates, and the do/don\'t list every recruiter wishes more candidates followed.',
    category: 'interviews-cover-letters',
    tags: ['cover-letter', 'templates', 'STAR', 'job-search'],
    author: 'Surya L',
    datePublished: '2026-03-15',
    dateModified: '2026-04-15',
    readingTime: 8,
    featured: true,
  },
  {
    slug: 'cover-letter-vs-resume',
    title: 'Cover Letter vs Resume: Do You Need Both in 2026?',
    excerpt:
      'Honest answer with data. When to write a cover letter, when to skip, and the hidden cost of going without.',
    category: 'interviews-cover-letters',
    tags: ['cover-letter', 'strategy'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 8,
  },
  {
    slug: 'tailor-resume',
    title: 'How to Tailor Your Resume in 10 Minutes',
    excerpt:
      'Tailored resumes get 3x more callbacks. The minute-by-minute process without starting from scratch, plus the AI-assisted workflow.',
    category: 'ats-keywords',
    tags: ['tailoring', 'keywords', 'JD-matching'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 10,
  },
  {
    slug: 'best-free-resume-builder',
    title: 'Free vs Paid Resume Builders 2026: Brutally Honest Comparison',
    excerpt:
      '8 builders compared: pricing, privacy, ATS, AI features. Which "free" builders paywall the download, which are open-source.',
    category: 'ai-resume',
    tags: ['comparison', 'free', 'paid', 'privacy'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 13,
    featured: true,
  },
  {
    slug: 'ai-resume-builders-tested',
    title: 'AI Resume Builders 2026: We Tested 8',
    excerpt:
      'Which AI tools hallucinate, which preserve voice, and the 5 rules for using AI without generic output. Strengths, weaknesses, pricing, privacy for each.',
    category: 'ai-resume',
    tags: ['AI', 'ChatGPT', 'Claude', 'Rezi', 'review'],
    author: 'Surya L',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    readingTime: 13,
    featured: true,
  },

  {
    slug: 'why-should-we-hire-you',
    title: 'How to Answer "Why Should We Hire You" (8 Examples)',
    excerpt:
      '3-pillar formula (Problem, Proof, Compounding), 8 worked examples from fresher to executive, and the 6 mistakes that kill this answer.',
    category: 'interviews-cover-letters',
    tags: ['interview', 'closing-question', 'pitch', 'why-hire-you'],
    author: 'Surya L',
    datePublished: '2026-05-12',
    dateModified: '2026-05-12',
    readingTime: 12,
    publishAt: '2026-05-12T04:43:00Z',
  },
  {
    slug: 'resume-margins-spacing',
    title: 'Resume Margins & Spacing: The Ideal Setup (2026)',
    excerpt:
      'Exact margin, line-height, and section-spacing values for a resume that parses on ATS and reads clean. 8-point spec plus common layout fixes.',
    category: 'resume-writing',
    tags: ['margins', 'spacing', 'formatting', 'layout'],
    author: 'Surya L',
    datePublished: '2026-05-14',
    dateModified: '2026-05-14',
    readingTime: 10,
    publishAt: '2026-05-14T05:59:00Z',
  },
  {
    slug: 'workday-resume-tips',
    title: 'Workday Resume Tips That Actually Pass (2026)',
    excerpt:
      'How Workday parses your resume, 8 tactical tips to raise match score, and the Profile Sync gotcha that catches most candidates.',
    category: 'ats-keywords',
    tags: ['Workday', 'ATS', 'resume-parsing', 'match-score'],
    author: 'Surya L',
    datePublished: '2026-05-17',
    dateModified: '2026-05-17',
    readingTime: 11,
    publishAt: '2026-05-17T05:11:00Z',
  },
  {
    slug: 'star-method-examples',
    title: 'STAR Method for Behavioural Interviews: 8 Full Examples',
    excerpt:
      'The 90-second STAR formula with 8 full worked examples across Tech, Product, Design, Finance, Marketing, Management, and HR, plus the 6 STAR mistakes that tank answers.',
    category: 'interviews-cover-letters',
    tags: ['STAR', 'behavioural', 'interview', 'framework', 'examples'],
    author: 'Surya L',
    datePublished: '2026-05-05',
    dateModified: '2026-05-05',
    readingTime: 15,
    featured: true,
    publishAt: '2026-05-05T04:41:00Z',
  },
  {
    slug: 'best-resume-fonts',
    title: 'Best Resume Fonts 2026 (Tested Against 4 ATS)',
    excerpt:
      '10 fonts tested on Workday, Greenhouse, Lever, and Taleo. Safe picks, fonts to avoid, size rules, PDF embedding, and heading-vs-body setup.',
    category: 'resume-writing',
    tags: ['fonts', 'typography', 'ATS', 'formatting'],
    author: 'Surya L',
    datePublished: '2026-05-07',
    dateModified: '2026-05-07',
    readingTime: 12,
    publishAt: '2026-05-07T06:07:00Z',
  },
  {
    slug: 'wipro-elite-nth-guide',
    title: 'Wipro Elite NTH 2026: Syllabus, Process & Resume Tips',
    excerpt:
      'Complete Wipro NTH 2026 guide: 3-round process, full syllabus, Elite Hire vs Turbo Hire packages, resume placement, and the 45-day prep plan.',
    category: 'india-hiring',
    tags: ['Wipro', 'NTH', 'Elite', 'fresher', 'campus', 'India'],
    author: 'Surya L',
    datePublished: '2026-05-10',
    dateModified: '2026-05-10',
    readingTime: 13,
    publishAt: '2026-05-10T05:18:00Z',
  },
  {
    slug: 'tell-me-about-yourself',
    title: 'How to Answer "Tell Me About Yourself" (10 Examples)',
    excerpt:
      'The 3-part present-past-future formula, 10 worked examples by career stage, and the 6 mistakes that tank this first-interview question.',
    category: 'interviews-cover-letters',
    tags: ['interview', 'tell-me-about-yourself', 'elevator-pitch', 'prep'],
    author: 'Surya L',
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    readingTime: 13,
    publishAt: '2026-04-28T05:38:00Z',
  },
  {
    slug: 'linkedin-url-on-resume',
    title: 'Should You Put a LinkedIn URL on Your Resume?',
    excerpt:
      'Yes, if your profile passes the 8-point check. 4 reasons to include, 4 cases where you should not, and correct URL formatting.',
    category: 'resume-writing',
    tags: ['linkedin', 'resume-header', 'contact', 'social'],
    author: 'Surya L',
    datePublished: '2026-04-30',
    dateModified: '2026-04-30',
    readingTime: 10,
    publishAt: '2026-04-30T05:23:00Z',
  },
  {
    slug: 'infosys-infytq-guide',
    title: 'Infosys InfyTQ Certification: Full 2026 Guide',
    excerpt:
      '5-phase process, Foundation + Advanced syllabus, Systems Engineer to Specialist Programmer roles, HackWithInfy accelerator, and resume placement.',
    category: 'india-hiring',
    tags: ['Infosys', 'InfyTQ', 'certification', 'fresher', 'HackWithInfy'],
    author: 'Surya L',
    datePublished: '2026-04-30',
    dateModified: '2026-04-30',
    readingTime: 15,
    publishAt: '2026-05-03T05:54:00Z',
  },
  {
    slug: 'interview-questions-and-answers',
    title: '100 Common Interview Questions & How to Answer Them (2026)',
    excerpt:
      'The 100 questions hiring managers actually ask in 2026. Behavioural, situational, technical, leadership, culture, tricky, and closing. STAR method + 48-hour prep plan.',
    category: 'interviews-cover-letters',
    tags: ['interview', 'STAR', 'behavioural', 'prep', 'questions'],
    author: 'Surya L',
    datePublished: '2026-04-21',
    dateModified: '2026-04-21',
    readingTime: 16,
    featured: true,
  },
  {
    slug: 'resume-skills-list',
    title: 'How to List Skills on a Resume (by Skill Type) in 2026',
    excerpt:
      'Hard skills, soft skills, languages, certifications, tools — each lands differently with recruiters and ATS. The exact grouping, order, and formatting.',
    category: 'resume-writing',
    tags: ['skills', 'hard-skills', 'soft-skills', 'certifications', 'ATS'],
    author: 'Surya L',
    datePublished: '2026-04-23',
    dateModified: '2026-04-23',
    readingTime: 11,
    publishAt: '2026-04-23T06:12:00Z',
  },

  // ─────────── India Hiring ───────────
  {
    slug: 'tcs-nqt-resume-guide',
    title: 'TCS NQT 2026: Resume & Process Playbook for Freshers',
    excerpt:
      'Complete TCS NQT 2026 guide: 5-round process, TCS iON-safe resume format, 25 keywords, 3 project templates, timeline, bond, and interview prep.',
    category: 'india-hiring',
    tags: ['TCS', 'NQT', 'fresher', 'campus', 'India', 'iON'],
    author: 'Surya L',
    datePublished: '2026-04-26',
    dateModified: '2026-04-26',
    readingTime: 14,
    featured: true,
    publishAt: '2026-04-26T05:05:00Z',
  },
  {
    slug: 'campus-placement-resume',
    title: 'Campus Placement Resume 2026',
    excerpt:
      'The exact 10-point checklist + 5-round process walkthrough for Indian campus placements. Built around TCS NQT, Infosys InfyTQ, and Wipro Elite NTH.',
    category: 'india-hiring',
    tags: ['campus', 'TCS', 'Infosys', 'Wipro', 'NQT'],
    author: 'Surya L',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
    readingTime: 10,
    featured: true,
  },
  {
    slug: 'naukri-resume-tips',
    title: '8 Naukri.com Resume Tips That 3x Recruiter Views',
    excerpt:
      'Naukri\'s 90M candidates and 350k recruiters work off filters, not browsing. Here is how to rank higher in the search results that matter.',
    category: 'india-hiring',
    tags: ['Naukri', 'profile', 'recruiter', 'LinkedIn-vs-Naukri'],
    author: 'Surya L',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
    readingTime: 9,
  },
];

/**
 * "Virtual" posts. Entries that represent the /blog/company-guides hub
 * as a single card in the blog index. Clicking goes to the hub, not a real post.
 */
export interface VirtualPost {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  category: string;
  badge: string;
}

export const VIRTUAL_POSTS: VirtualPost[] = [
  {
    slug: 'company-guides-hub',
    href: '/blog/company-guides',
    title: '22 Company-Specific Resume Guides',
    excerpt:
      'Full resume guides for Google, Amazon, Microsoft, Meta, Apple, McKinsey, Goldman Sachs, TCS, Infosys, Flipkart, PhonePe, Razorpay, and 10 more. Each includes 15 ATS keywords, 5 insider tips, interview questions, salary benchmarks, and a cover letter template.',
    category: 'company-guides',
    badge: 'Hub',
  },
];

// ─── Helpers ───
//
// Every public getter filters out scheduled-future posts via isPublished().
// Callers that need the full registry (admin, migrations, debugging) should
// import BLOG_POSTS directly. Never do that from a public page; ship hidden
// posts out to Google by mistake.

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return undefined;
  return isPublished(post) ? post : undefined; // future posts appear "missing" to callers
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === categorySlug && isPublished(p));
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured && isPublished(p));
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => isPublished(p)).sort((a, b) => b.dateModified.localeCompare(a.dateModified));
}

export function getPostCountByCategory(categorySlug: string): number {
  return BLOG_POSTS.filter((p) => p.category === categorySlug && isPublished(p)).length +
    VIRTUAL_POSTS.filter((p) => p.category === categorySlug).length;
}
