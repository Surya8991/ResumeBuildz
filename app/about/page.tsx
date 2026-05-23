import type { Metadata } from 'next';
import { jsonLd } from '@/lib/articleSchema';
import { absoluteUrl, SITE_URL } from '@/lib/siteConfig';
import Content from './Content';

const title = 'About ResumeBuildz — Free, Open-Source, Privacy-First';
const description = 'ResumeBuildz is a free, open-source, privacy-first resume builder. Built by Surya L with Next.js 16 + TypeScript. No data leaves your browser by default.';

export const metadata: Metadata = {
  title: `${title} | ResumeBuildz`,
  description,
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: `${title} | ResumeBuildz`,
    description,
    type: 'website',
    url: absoluteUrl('/about'),
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ResumeBuildz',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description,
  founder: {
    '@type': 'Person',
    name: 'Surya L',
    url: absoluteUrl('/author/surya-l'),
  },
  sameAs: [
    'https://github.com/Surya8991/ResumeBuildz',
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(orgSchema) }} />
      <Content />
    </>
  );
}
