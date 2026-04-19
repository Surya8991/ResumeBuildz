import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Internal preview tools + auth-only flows — no public SEO value.
      // Auth pages (/login, /forgot-password) deliberately excluded from
      // indexing so they don't outrank product/marketing pages on brand queries.
      disallow: ['/loader-preview', '/hero-preview', '/r', '/r/*', '/login', '/forgot-password', '/account'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
