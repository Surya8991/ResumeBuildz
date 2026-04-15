import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Internal preview tools — selectable galleries only, no public
      // value, kept out of indexing to avoid SEO leakage.
      disallow: ['/loader-preview', '/hero-preview'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
