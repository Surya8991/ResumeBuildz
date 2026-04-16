import type { MetadataRoute } from 'next';
import { COMPANIES } from '@/lib/resumeCompanyData';
import { BLOG_CATEGORIES } from '@/lib/blogCategories';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { SITE_URL } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/builder`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/templates`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ats-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resume-tips`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/cover-letter`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/roadmap`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
    { url: `${base}/status`, lastModified: now, changeFrequency: 'daily', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },

    // Resources hub + situation pages (PART 3 + 4)
    { url: `${base}/resume-for`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/fresher-resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/campus-placement-resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/naukri-resume-tips`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resume-after-layoff`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resume-after-career-gap`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resume-for-career-change`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Blog hub
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Blog category pages
  const blogCategoryEntries: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((c) => ({
    url: `${base}/blog/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // PART 2: dynamic company pages (22 entries)
  const companyEntries: MetadataRoute.Sitemap = COMPANIES.map((c) => ({
    url: `${base}/resume-for/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Blog posts — auto-discovered from registry so new posts hit the sitemap
  // without manual edits. Slugs point to top-level routes (e.g. /fresher-resume).
  const staticSlugs = new Set(staticEntries.map((e) => e.url));
  const blogPostEntries: MetadataRoute.Sitemap = BLOG_POSTS
    .map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: new Date(p.dateModified),
      changeFrequency: 'monthly' as const,
      priority: p.featured ? 0.8 : 0.7,
    }))
    .filter((e) => !staticSlugs.has(e.url));

  return [...staticEntries, ...companyEntries, ...blogCategoryEntries, ...blogPostEntries];
}
