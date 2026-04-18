'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { BLOG_CATEGORIES, getCategoriesByParent, PARENT_GROUPS, getCategoryBySlug } from '@/lib/blogCategories';
import { VIRTUAL_POSTS, getAllPosts, getFeaturedPosts, getPostCountByCategory } from '@/lib/blogPosts';

// Blog hub. Vercel/Linear tech-blog structure (featured hero + 3-col grid +
// filter chips) in the ResumeBuildz light theme: paper background, ink text,
// indigo accent, hairline borders.

// Filter types:
//  'all'               -> show everything
//  parent-group slug   -> show all posts whose child-category belongs to that group
//  child-category slug -> show only posts in that category
type FilterValue = 'all' | string;

function isParentGroup(slug: string): slug is 'resume-ats' | 'job-search' | 'india-hiring' | 'company-guides' {
  return PARENT_GROUPS.some((g) => g.slug === slug);
}

export default function BlogHubPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCat = searchParams.get('cat') || 'all';
  const [filter, setFilter] = useState<FilterValue>(initialCat);

  // Sync local state if the URL changes (e.g. from the navbar dropdown).
  useEffect(() => {
    const cat = searchParams.get('cat') || 'all';
    setFilter(cat);
  }, [searchParams]);

  useEffect(() => {
    document.title = 'Blog . Updates, guides, and research . ResumeBuildz';
    const meta = (name: string) => document.querySelector(`meta[name="${name}"]`);
    const ogMeta = (prop: string) => document.querySelector(`meta[property="${prop}"]`);
    const desc =
      'Practical, research-backed guides on resume writing, ATS optimisation, career transitions, Indian hiring, and company-specific job applications.';
    meta('description')?.setAttribute('content', desc);
    ogMeta('og:title')?.setAttribute('content', 'Blog . ResumeBuildz');
    ogMeta('og:description')?.setAttribute('content', desc);
  }, []);

  const allPosts = getAllPosts();
  const featured = getFeaturedPosts();
  const hero = featured[0] || allPosts[0];

  // Chips grouped by parent group, each followed by its child categories.
  // User sees "All", then parent groups, then child filters under each.
  const parentChips = useMemo(
    () => [
      { value: 'all' as const, label: 'All', kind: 'all' as const, count: allPosts.length },
      ...PARENT_GROUPS.flatMap((g) => {
        const children = getCategoriesByParent(g.slug);
        const parentCount = children.reduce((sum, c) => sum + getPostCountByCategory(c.slug), 0);
        return [{ value: g.slug, label: g.name, kind: 'parent' as const, count: parentCount }];
      }),
    ],
    [allPosts],
  );

  const setFilterAndUrl = (value: FilterValue) => {
    setFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete('cat');
    else params.set('cat', value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const visiblePosts = useMemo(() => {
    if (filter === 'all') return allPosts.filter((p) => p.slug !== hero?.slug);
    if (isParentGroup(filter)) {
      const childSlugs = getCategoriesByParent(filter).map((c) => c.slug);
      return allPosts.filter((p) => childSlugs.includes(p.category) && p.slug !== hero?.slug);
    }
    // Child category slug
    return allPosts.filter((p) => p.category === filter && p.slug !== hero?.slug);
  }, [filter, allPosts, hero]);

  const activeLabel = useMemo(() => {
    if (filter === 'all') return null;
    if (isParentGroup(filter)) return PARENT_GROUPS.find((g) => g.slug === filter)?.name;
    return getCategoryBySlug(filter)?.name;
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <SiteNavbar />

      {/* Page header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <p className="text-sm text-indigo-600 font-medium mb-3">Blog</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.05]">
            Updates, guides, and research.
          </h1>
          <p className="text-gray-600 text-lg mt-5 max-w-2xl leading-relaxed">
            What we are learning about resumes, ATS, and the mechanics of getting hired in 2026. Research-backed, updated quarterly, written by someone who has read 10,000+ resumes.
          </p>

          {/* Parent filter chips */}
          <div className="flex flex-wrap gap-2 mt-8">
            {parentChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setFilterAndUrl(chip.value)}
                className={`px-4 py-1.5 text-sm rounded-full border transition ${
                  filter === chip.value
                    ? 'bg-gray-900 text-white border-gray-900 font-medium'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {chip.label}
                <span className={`ml-1.5 text-xs ${filter === chip.value ? 'text-white/70' : 'text-gray-500'}`}>
                  {chip.count}
                </span>
              </button>
            ))}
          </div>

          {activeLabel && (
            <p className="text-sm text-gray-500 mt-4">
              Showing: <strong className="text-gray-900">{activeLabel}</strong> ({visiblePosts.length} post{visiblePosts.length === 1 ? '' : 's'})
            </p>
          )}
        </div>
      </section>

      {/* Featured hero */}
      {hero && filter === 'all' && (
        <section className="border-b border-gray-200 bg-gray-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
            <Link
              href={`/${hero.slug}`}
              className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className="aspect-video bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_55%)]" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs text-white/90 font-semibold uppercase tracking-wider">Featured</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium mb-3">
                  {BLOG_CATEGORIES.find((c) => c.slug === hero.category)?.name || 'Guide'}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 group-hover:text-gray-700 transition leading-tight mb-4">
                  {hero.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">{hero.excerpt}</p>
                <div className="flex items-center gap-3">
                  <AuthorAvatar />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Surya L</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(hero.datePublished)} . {hero.readingTime} min read
                    </p>
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                  Read post <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Post grid */}
      <section className="flex-1 py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {visiblePosts.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No posts in this section yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {visiblePosts.map((p) => {
                const cat = BLOG_CATEGORIES.find((c) => c.slug === p.category);
                return (
                  <Link key={p.slug} href={`/${p.slug}`} className="group">
                    <div className="aspect-video bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-100 rounded-xl mb-5 relative overflow-hidden border border-gray-200">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18),transparent_60%)]" />
                      <div className="absolute bottom-4 left-4 text-xs text-indigo-700 uppercase tracking-wider font-semibold">
                        {cat?.name || p.category.replace('-', ' ')}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl leading-snug group-hover:text-indigo-700 transition mb-3 tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {p.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <AuthorAvatar size="sm" />
                      <span className="text-gray-900 font-medium">Surya L</span>
                      <span className="text-gray-300">.</span>
                      <span className="text-gray-500 inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {p.readingTime} min
                      </span>
                    </div>
                  </Link>
                );
              })}

              {filter === 'all' &&
                VIRTUAL_POSTS.map((v) => (
                  <Link key={v.slug} href={v.href} className="group">
                    <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl mb-5 relative overflow-hidden border border-indigo-500/30 shadow-sm">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.22),transparent_55%)]" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-white text-indigo-700 px-2 py-0.5 rounded-full">
                          {v.badge}
                        </span>
                        <span className="text-xs text-white/90 uppercase tracking-wider font-semibold">
                          Company guides
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl leading-snug group-hover:text-indigo-700 transition mb-3 tracking-tight">
                      {v.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {v.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                      Open hub <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function AuthorAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';
  return (
    <div
      className={`${dims} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shrink-0`}
      aria-hidden
    >
      S
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
