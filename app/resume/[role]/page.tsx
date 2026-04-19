import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { ROLES, getRoleBySlug, getRelatedRoles } from '@/lib/resumeRoleData';
import { articleSchema, breadcrumbSchema, combineSchemas, jsonLd } from '@/lib/articleSchema';
import { absoluteUrl } from '@/lib/siteConfig';
import { ArrowRight, CheckCircle2, XCircle, Sparkles, IndianRupee } from 'lucide-react';

// Generate one static page per role at build time.
export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.slug }));
}

interface PageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const data = getRoleBySlug(role);
  if (!data) {
    return {
      title: 'Role resume guide not found - ResumeBuildz',
      description: 'The requested role guide could not be found.',
    };
  }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: absoluteUrl(`/resume/${data.slug}`) },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: 'article',
    },
  };
}

export default async function RoleResumePage({ params }: PageProps) {
  const { role } = await params;
  const data = getRoleBySlug(role);
  if (!data) notFound();

  const related = getRelatedRoles(data);

  const schema = combineSchemas(
    articleSchema({
      headline: `${data.name} Resume Guide 2026`,
      description: data.metaDescription,
      slug: `resume/${data.slug}`,
      datePublished: '2026-04-19',
      dateModified: '2026-04-19',
    }),
    breadcrumbSchema([
      { label: 'Resume by Role', slug: 'resume' },
      { label: data.name },
    ])
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <div className="min-h-screen flex flex-col bg-white">
        <SiteNavbar />
        <main className="flex-1">
          <header className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
              <nav className="text-sm text-gray-500 mb-6">
                <Link href="/resume" className="hover:text-blue-600">Resume by Role</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{data.name}</span>
              </nav>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {data.name} Resume Guide 2026
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{data.shortBlurb}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/builder" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  Start building <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/templates" className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  Browse templates
                </Link>
              </div>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-14">
            {/* Must-have sections */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">What recruiters expect to see</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {data.mustHaveSections.map((s) => (
                  <div key={s.title} className="border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {s.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.why}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Keywords */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">ATS keywords to include</h2>
              <p className="text-gray-600 mb-5">Copy-paste into the skills section, naturally sprinkled across experience bullets.</p>
              <div className="flex flex-wrap gap-2">
                {data.coreKeywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </section>

            {/* Sample bullets */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sample bullets that work</h2>
              <p className="text-gray-600 mb-5">Each follows the verb + action + scope + measurable outcome pattern.</p>
              <ul className="space-y-3">
                {data.sampleBullets.map((b, i) => (
                  <li key={i} className="border border-gray-200 rounded-lg p-4 text-gray-700 leading-relaxed text-sm">
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            {/* Action verbs */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Action verbs to open bullets</h2>
              <div className="flex flex-wrap gap-2">
                {data.actionVerbs.map((v) => (
                  <span key={v} className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-sm font-medium">
                    {v}
                  </span>
                ))}
              </div>
            </section>

            {/* Common mistakes */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Mistakes that kill interviews</h2>
              <ul className="space-y-3">
                {data.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ATS tips */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">ATS-specific tips for this role</h2>
              <ul className="space-y-3">
                {data.atsTips.map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Salary */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IndianRupee className="h-6 w-6 text-gray-700" /> India salary benchmarks
              </h2>
              <p className="text-gray-600 mb-5 text-sm">Indicative ranges for {data.name} roles in 2026. Bengaluru / Mumbai / Hyderabad are typically at the higher end; Pune / Chennai slightly below.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Junior</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{data.salaryIndia.junior}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mid</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{data.salaryIndia.mid}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Senior</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{data.salaryIndia.senior}</p>
                </div>
              </div>
            </section>

            {/* Related roles */}
            {related.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Related role guides</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/resume/${r.slug}`} className="group border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-xl p-4 transition-all">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{r.name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.shortBlurb}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Final CTA */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-10 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Build your {data.name} resume now
              </h2>
              <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                ATS-ready templates. Live ATS score. AI bullet suggestions. Free to start, no sign-up required.
              </p>
              <Link href="/builder" className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg text-sm font-bold transition-colors">
                Start building <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
