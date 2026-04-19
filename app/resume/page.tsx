import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { ROLES, rolesByCategory } from '@/lib/resumeRoleData';
import { absoluteUrl } from '@/lib/siteConfig';
import { breadcrumbSchema, jsonLd } from '@/lib/articleSchema';
import { ArrowUpRight, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resume Guides by Role | 10+ ATS-Friendly Role Guides | ResumeBuildz',
  description: 'Role-specific resume guides for software engineers, data scientists, product managers, designers, marketers and more. Real bullet examples, ATS keywords, and salary benchmarks.',
  alternates: { canonical: absoluteUrl('/resume') },
};

const CATEGORY_LABELS: Record<string, string> = {
  engineering: 'Engineering',
  data: 'Data + ML',
  product: 'Product',
  design: 'Design',
  marketing: 'Marketing',
  business: 'Business + Analyst',
  security: 'Security',
};

export default function ResumeByRoleHub() {
  const byCategory = rolesByCategory();
  const categories = Object.keys(byCategory);

  const schema = breadcrumbSchema([{ label: 'Resume by Role' }]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <div className="min-h-screen flex flex-col bg-white">
        <SiteNavbar />
        <main className="flex-1">
          <header className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Resume guides by role
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {ROLES.length} hand-written guides covering ATS keywords, real bullet examples, common mistakes, and India salary benchmarks for each role.
              </p>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
            {categories.map((cat) => (
              <section key={cat}>
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-sm text-gray-400 font-normal">({byCategory[cat].length})</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {byCategory[cat].map((r) => (
                    <Link
                      key={r.slug}
                      href={`/resume/${r.slug}`}
                      className="group border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-xl p-5 transition-all flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {r.name}
                        </h3>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{r.shortBlurb}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
