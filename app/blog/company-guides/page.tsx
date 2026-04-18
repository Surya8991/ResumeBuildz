'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, ArrowRight, ChevronRight, ArrowUpRight } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { useLoginGateway } from '@/components/LoginGateway';
import { COMPANIES } from '@/lib/resumeCompanyData';

type TierFilter = 'all' | 'Global' | 'India';

export default function CompanyGuidesHubPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openGateway } = useLoginGateway();

  const initialTier = (searchParams.get('tier') as TierFilter) || 'all';
  const initialIndustry = searchParams.get('industry') || 'all';
  const [tier, setTier] = useState<TierFilter>(initialTier);
  const [industry, setIndustry] = useState<string>(initialIndustry);

  useEffect(() => {
    document.title = 'Company Resume Guides . 22 Top Employers | ResumeBuildz';
    const meta = (name: string) => document.querySelector(`meta[name="${name}"]`);
    const ogMeta = (prop: string) => document.querySelector(`meta[property="${prop}"]`);
    const desc = 'Tailored resume guides for 22 top global and Indian companies. Real keywords, formatting tips, recommended templates.';
    meta('description')?.setAttribute('content', desc);
    ogMeta('og:title')?.setAttribute('content', 'Company Resume Guides | ResumeBuildz');
    ogMeta('og:description')?.setAttribute('content', desc);
  }, []);

  // URL-sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (tier !== 'all') params.set('tier', tier);
    if (industry !== 'all') params.set('industry', industry);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [tier, industry, pathname, router]);

  // Distinct industries, sorted by count desc so heavy ones surface first.
  const industries = useMemo(() => {
    const counts = new Map<string, number>();
    COMPANIES.forEach((c) => counts.set(c.industry, (counts.get(c.industry) || 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));
  }, []);

  const filtered = useMemo(() => {
    return COMPANIES.filter((c) => {
      if (tier !== 'all' && c.tier !== tier) return false;
      if (industry !== 'all' && c.industry !== industry) return false;
      return true;
    });
  }, [tier, industry]);

  const globalCount = COMPANIES.filter((c) => c.tier === 'Global').length;
  const indiaCount = COMPANIES.filter((c) => c.tier === 'India').length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteNavbar />

      <main className="flex-1">
        {/* Page header */}
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
              <Link href="/blog" className="hover:text-gray-900">Blog</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900">Company Guides</span>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3">
              Company Guides
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
              Resume guides for {COMPANIES.length} top companies.
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
              Each guide has the exact keywords recruiters scan for, the resume moves that actually work, and our recommended template, built from public hiring signal and recruiter interviews.
            </p>

            {/* Tier chips */}
            <div className="flex flex-wrap gap-2 mt-8">
              {[
                { value: 'all' as const, label: 'All', count: COMPANIES.length },
                { value: 'Global' as const, label: 'Global', count: globalCount },
                { value: 'India' as const, label: 'India', count: indiaCount },
              ].map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setTier(chip.value)}
                  className={`px-4 py-1.5 text-sm rounded-full border transition ${
                    tier === chip.value
                      ? 'bg-gray-900 text-white border-gray-900 font-medium'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {chip.label}
                  <span className={`ml-1.5 text-xs ${tier === chip.value ? 'text-white/70' : 'text-gray-500'}`}>
                    {chip.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Industry chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <button
                onClick={() => setIndustry('all')}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  industry === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                    : 'border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
                }`}
              >
                All industries
              </button>
              {industries.map((ind) => (
                <button
                  key={ind.label}
                  onClick={() => setIndustry(ind.label)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${
                    industry === ind.label
                      ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                      : 'border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700'
                  }`}
                >
                  {ind.label}
                  <span className={`ml-1 ${industry === ind.label ? 'text-white/70' : 'text-gray-400'}`}>
                    {ind.count}
                  </span>
                </button>
              ))}
            </div>

            {(tier !== 'all' || industry !== 'all') && (
              <p className="text-sm text-gray-500 mt-4">
                Showing <strong className="text-gray-900">{filtered.length}</strong> of {COMPANIES.length} companies
                {' '}
                <button
                  onClick={() => { setTier('all'); setIndustry('all'); }}
                  className="ml-2 text-indigo-600 hover:underline"
                >
                  Clear filters
                </button>
              </p>
            )}
          </div>
        </section>

        {/* Company card grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-center py-16">No companies match these filters.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/blog/company-guides/${c.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm p-5 transition flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold text-right">
                        {c.tier}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 transition tracking-tight">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">{c.hq}</p>
                    <p className="text-xs text-gray-500 mb-3">{c.industry}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium mt-auto">
                      Read guide <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why company-specific */}
        <section className="bg-gray-50 border-y border-gray-200 py-14 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center tracking-tight mb-10">
              Why a company-specific resume wins
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { n: '1', title: 'Different ATS, different rules', body: 'Workday, Greenhouse, Lever, and TCS internal portal all parse differently. A resume that flies through one can fail another.' },
                { n: '2', title: 'Each company has a screening philosophy', body: 'Amazon screens on Leadership Principles. McKinsey screens on distinctive achievement. Google screens on impact at scale. Match the philosophy.' },
                { n: '3', title: 'Keyword density beats keyword presence', body: 'Mentioning Java once is not enough. ATS ranks resumes by how often the right terms appear in the right sections.' },
              ].map((item) => (
                <div key={item.n} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center mb-3">
                    {item.n}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 text-white py-14">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to build your company-specific resume?</h2>
            <p className="text-white/70 mb-6 text-sm">
              Pick a template, tailor your bullets to one of these companies, and run it through our free ATS checker before you apply.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-flex items-center gap-2 shadow-sm">
                Build my resume <ArrowRight className="h-4 w-4" />
              </button>
              <Link href="/templates" className="border border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-lg font-semibold transition">
                Browse 20 templates
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
