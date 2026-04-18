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

  // ─────────── India Hiring ───────────
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

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === categorySlug);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.dateModified.localeCompare(a.dateModified));
}

export function getPostCountByCategory(categorySlug: string): number {
  return BLOG_POSTS.filter((p) => p.category === categorySlug).length +
    VIRTUAL_POSTS.filter((p) => p.category === categorySlug).length;
}
