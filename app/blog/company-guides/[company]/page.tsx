import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCompanyBySlug, COMPANIES } from '@/lib/resumeCompanyData';
import { getCompanyExtended } from '@/lib/resumeCompanyDataExtended';
import { articleSchema, faqPageSchema, breadcrumbSchema, combineSchemas, jsonLd } from '@/lib/articleSchema';
import { absoluteUrl } from '@/lib/siteConfig';
import CompanyResumeView from './CompanyResumeView';

// Generate one static page per company at build time.
export function generateStaticParams() {
  return COMPANIES.map((c) => ({ company: c.slug }));
}

interface PageProps {
  params: Promise<{ company: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { company } = await params;
  const data = getCompanyBySlug(company);
  if (!data) {
    return {
      title: 'Company guide not found - ResumeBuildz',
      description: 'The requested company resume guide could not be found.',
    };
  }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: absoluteUrl(`/blog/company-guides/${data.slug}`) },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: 'article',
    },
  };
}

export default async function CompanyResumePage({ params }: PageProps) {
  const { company } = await params;
  const data = getCompanyBySlug(company);

  if (!data) {
    notFound();
  }

  // Find related companies in the same tier for cross-linking
  const related = COMPANIES.filter((c) => c.tier === data.tier && c.slug !== data.slug).slice(0, 4);
  const extended = getCompanyExtended(data.slug);

  // Build structured data: Article + FAQPage (if FAQs exist) + BreadcrumbList
  const schema = combineSchemas(
    articleSchema({
      headline: `${data.name} Resume Guide 2026`,
      description: data.metaDescription,
      slug: `blog/company-guides/${data.slug}`,
      datePublished: '2026-04-14',
      dateModified: '2026-04-15',
    }),
    ...(extended?.faqs && extended.faqs.length > 0 ? [faqPageSchema(extended.faqs)] : []),
    breadcrumbSchema([
      { label: 'Blog', slug: 'blog' },
      { label: 'Company Guides', slug: 'blog/company-guides' },
      { label: data.name },
    ])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <CompanyResumeView data={data} related={related} />
    </>
  );
}
