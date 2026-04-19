import type { Metadata } from 'next';
import { absoluteUrl, SITE_URL } from '@/lib/siteConfig';
import { jsonLd } from '@/lib/articleSchema';
import { CHANGELOG } from '@/lib/changelogData';
import Content from './Content';

const title = 'Changelog — What Shipped in ResumeBuildz';
const description = 'Release notes for every ResumeBuildz version. New features, fixes, SEO improvements, and performance wins, organised by release date.';

export const metadata: Metadata = {
  title: `${title} | ResumeBuildz`,
  description,
  alternates: { canonical: absoluteUrl('/changelog') },
  openGraph: {
    title: `${title} | ResumeBuildz`,
    description,
    type: 'website',
    url: absoluteUrl('/changelog'),
  },
};

// CollectionPage that lists each release as a separate Article so Google
// can understand each version as a distinct content unit. Aids the
// "release notes" rich result and gives the domain more recency signal.
const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: title,
  description,
  url: absoluteUrl('/changelog'),
  hasPart: CHANGELOG.map((entry) => ({
    '@type': 'Article',
    headline: `${entry.version} — ${entry.title}`,
    datePublished: entry.isoDate ?? entry.date,
    dateModified: entry.isoDate ?? entry.date,
    url: absoluteUrl(`/changelog#${entry.version}`),
    author: {
      '@type': 'Person',
      name: 'Surya L',
      url: absoluteUrl('/author/surya-l'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'ResumeBuildz',
      url: SITE_URL,
    },
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Content />
    </>
  );
}
