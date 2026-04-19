// JSON-LD schema helpers. All emit Schema.org markup as plain objects that
// can be dropped into a <script type="application/ld+json"> tag via
// dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}.
//
// Keep helpers pure and deterministic — no Date.now(), no randomness.

import { SITE_URL } from './siteConfig';
const PUBLISHER = {
  '@type': 'Organization',
  name: 'ResumeBuildz',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/icon.svg`,
  },
};
const DEFAULT_AUTHOR = {
  '@type': 'Person',
  name: 'Surya L',
  url: `${SITE_URL}/author/surya-l`,
  jobTitle: 'Founder, ResumeBuildz',
  sameAs: [
    'https://github.com/Surya8991',
    'https://linkedin.com/in/surya-l',
  ],
};

export interface ArticleInput {
  headline: string;
  description: string;
  slug: string; // path without leading slash, e.g. "resume-for/google"
  datePublished: string; // ISO yyyy-mm-dd
  dateModified?: string; // ISO yyyy-mm-dd
  image?: string; // absolute or relative URL
}

export function articleSchema({
  headline,
  description,
  slug,
  datePublished,
  dateModified,
  image,
}: ArticleInput) {
  const url = `${SITE_URL}/${slug.replace(/^\//, '')}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: DEFAULT_AUTHOR,
    publisher: PUBLISHER,
    image: image
      ? (image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`)
      : `${SITE_URL}/og-default.png`,
  };
}

export interface FAQItem {
  q: string;
  a: string;
}

export function faqPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export function howToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration e.g. "PT30M"
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export interface CrumbInput {
  label: string;
  slug?: string; // omit for current page
}

export function breadcrumbSchema(crumbs: CrumbInput[]) {
  // Always prepend Home as position 1
  const items = [
    { label: 'Home', slug: '' },
    ...crumbs,
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.slug !== undefined && { item: `${SITE_URL}/${c.slug.replace(/^\//, '')}`.replace(/\/$/, '') || SITE_URL }),
    })),
  };
}

/**
 * Helper to emit multiple schemas in a single JSON-LD script as a graph.
 * Use when a page has Article + FAQPage + BreadcrumbList all at once.
 */
export function combineSchemas(...schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map((s) => {
      // Strip nested @context since @graph establishes the context.
      const { ['@context']: _ctx, ...rest } = s as Record<string, unknown>;
      void _ctx;
      return rest;
    }),
  };
}

/**
 * Estimate reading time in minutes based on a word count.
 * Uses the standard 225 wpm benchmark for English long-form web content.
 */
export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 225));
}

/**
 * Renders a JSON-LD string safe for dangerouslySetInnerHTML.
 * Escapes the one character that matters for inline <script> injection.
 */
export function jsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
