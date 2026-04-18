'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Clock, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { BLOG_CATEGORIES, getCategoriesByParent, PARENT_GROUPS, getCategoryBySlug } from '@/lib/blogCategories';
import { getAllPosts, getFeaturedPosts, type BlogPost } from '@/lib/blogPosts';
import { COMPANIES, type CompanyEntry } from '@/lib/resumeCompanyData';

// Blog hub. Vercel/Linear tech-blog structure (featured hero + card grid +
// filter chips + pagination) in the ResumeBuildz light theme.
//
// Filter types:
//   'all'               -> every post + every hub
//   parent-group slug   -> every post whose child-category belongs to that group
//                          + every hub whose category belongs to that group
//   child-category slug -> only posts in that category
//                          + only hubs in that category

const POSTS_PER_PAGE = 9;

type FilterValue = 'all' | string;

type PARENT_SLUG = 'resume-ats' | 'job-search' | 'india-hiring' | 'company-guides';

function isParentGroup(slug: string): slug is PARENT_SLUG {
  return PARENT_GROUPS.some((g) => g.slug === slug);
}

// Combined display item so posts and company guides flow through the same
// grid. Every one of the 22 companies is a first-class article card that
// shows up under All and under the Company Guides filter.
type DisplayItem =
  | { kind: 'post'; post: BlogPost }
  | { kind: 'company'; company: CompanyEntry };

// Company entries belong to the company-guides child category (and therefore
// the company-guides parent group).
function filterIncludesCompanies(filter: string): boolean {
  return filter === 'all' || filter === 'company-guides';
}

export default function BlogHubPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialFilter = searchParams.get('cat') || 'all';
  const initialPage = Math.max(1, Number(searchParams.get('page') || 1));
  const [filter, setFilter] = useState<FilterValue>(initialFilter);
  const [page, setPage] = useState<number>(initialPage);

  // Sync local state when the URL changes (navbar dropdown, back button).
  useEffect(() => {
    setFilter(searchParams.get('cat') || 'all');
    setPage(Math.max(1, Number(searchParams.get('page') || 1)));
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

  // ---------- Data (stable across renders) ----------
  // allPosts is sorted once and reused. getAllPosts returns a fresh array so
  // wrapping in useMemo with [] keeps the reference stable.
  const allPosts = useMemo(() => getAllPosts(), []);
  const featured = useMemo(() => getFeaturedPosts(), []);
  const hero = featured[0] || allPosts[0];

  // Precomputed indexes. Built once on mount, O(n). Filtering becomes O(1)
  // lookup afterward regardless of post count.
  const postsByCategory = useMemo(() => {
    const map = new Map<string, BlogPost[]>();
    for (const p of allPosts) {
      const list = map.get(p.category);
      if (list) list.push(p);
      else map.set(p.category, [p]);
    }
    return map;
  }, [allPosts]);

  const postsByParent = useMemo(() => {
    const map = new Map<PARENT_SLUG, BlogPost[]>();
    for (const g of PARENT_GROUPS) {
      const childSlugs = new Set(getCategoriesByParent(g.slug).map((c) => c.slug));
      map.set(g.slug, allPosts.filter((p) => childSlugs.has(p.category)));
    }
    return map;
  }, [allPosts]);

  // Counts reflect exactly what the grid renders for each filter. The 22
  // company entries always surface as first-class cards, so they count on
  // All and on Company Guides. Non-company parents count only their posts.
  const parentChips = useMemo(
    () => [
      { value: 'all' as const, label: 'All', count: allPosts.length + COMPANIES.length },
      ...PARENT_GROUPS.map((g) => {
        const postCount = postsByParent.get(g.slug)?.length || 0;
        const companyCount = g.slug === 'company-guides' ? COMPANIES.length : 0;
        return { value: g.slug, label: g.name, count: postCount + companyCount };
      }),
    ],
    [allPosts, postsByParent],
  );

  // URL + state sync. `cat` is preserved across pagination; `page` is dropped
  // when filter changes so the user is not stranded on an empty page 4.
  const updateUrl = (nextFilter: FilterValue, nextPage: number) => {
    const params = new URLSearchParams();
    if (nextFilter !== 'all') params.set('cat', nextFilter);
    if (nextPage > 1) params.set('page', String(nextPage));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleFilter = (value: FilterValue) => {
    setFilter(value);
    setPage(1);
    updateUrl(value, 1);
  };

  const handlePage = (next: number) => {
    setPage(next);
    updateUrl(filter, next);
    // Scroll to the grid so the user sees the new page start.
    if (typeof window !== 'undefined') {
      const grid = document.getElementById('post-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ---------- Filtered results (O(1) via indexes) ----------
  const filteredPosts = useMemo((): BlogPost[] => {
    const excludeHero = (p: BlogPost) => p.slug !== hero?.slug;
    if (filter === 'all') return allPosts.filter(excludeHero);
    if (isParentGroup(filter)) return (postsByParent.get(filter) || []).filter(excludeHero);
    return (postsByCategory.get(filter) || []).filter(excludeHero);
  }, [filter, allPosts, postsByParent, postsByCategory, hero]);

  // Unified display stream: posts first, company cards after. Companies are
  // included whenever the active filter scope covers them (All or Company
  // Guides). No separate "hub summary" card — each company stands on its own.
  const allItems: DisplayItem[] = useMemo(() => {
    const postItems = filteredPosts.map((post) => ({ kind: 'post' as const, post }));
    const companyItems = filterIncludesCompanies(filter)
      ? COMPANIES.map((company) => ({ kind: 'company' as const, company }))
      : [];
    return [...postItems, ...companyItems];
  }, [filter, filteredPosts]);

  const totalItems = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const pageItems = allItems.slice(startIdx, startIdx + POSTS_PER_PAGE);

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
                onClick={() => handleFilter(chip.value)}
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
              Showing: <strong className="text-gray-900">{activeLabel}</strong> ({totalItems} item{totalItems === 1 ? '' : 's'})
            </p>
          )}
        </div>
      </section>

      {/* Featured hero (only on All filter, page 1) */}
      {hero && filter === 'all' && safePage === 1 && (
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

      {/* Post grid + pagination */}
      <section id="post-grid" className="flex-1 py-14 md:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {totalItems === 0 ? (
            <p className="text-gray-500 text-center py-20">No posts in this section yet.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                {pageItems.map((item) =>
                  item.kind === 'post'
                    ? <PostCard key={item.post.slug} post={item.post} />
                    : <CompanyCard key={item.company.slug} company={item.company} />,
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  page={safePage}
                  totalPages={totalPages}
                  onChange={handlePage}
                />
              )}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// --------------------------------------------------------------------
// Cards
// --------------------------------------------------------------------

function PostCard({ post }: { post: BlogPost }) {
  const cat = BLOG_CATEGORIES.find((c) => c.slug === post.category);
  return (
    <Link href={`/${post.slug}`} className="group">
      <div className="aspect-video bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-100 rounded-xl mb-5 relative overflow-hidden border border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="absolute bottom-4 left-4 text-xs text-indigo-700 uppercase tracking-wider font-semibold">
          {cat?.name || post.category.replace('-', ' ')}
        </div>
      </div>
      <h3 className="font-bold text-gray-900 text-xl leading-snug group-hover:text-indigo-700 transition mb-3 tracking-tight">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center gap-3 text-sm">
        <AuthorAvatar size="sm" />
        <span className="text-gray-900 font-medium">Surya L</span>
        <span className="text-gray-300">.</span>
        <span className="text-gray-500 inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {post.readingTime} min
        </span>
      </div>
    </Link>
  );
}

function CompanyCard({ company }: { company: CompanyEntry }) {
  const tierColor = company.tier === 'Global'
    ? 'from-indigo-500 via-indigo-600 to-blue-600'
    : 'from-amber-500 via-orange-500 to-rose-500';
  return (
    <Link href={`/blog/company-guides/${company.slug}`} className="group">
      <div className={`aspect-video bg-gradient-to-br ${tierColor} rounded-xl mb-5 relative overflow-hidden border border-gray-200 shadow-sm`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.22),transparent_60%)]" />
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {company.tier}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs text-white/90 uppercase tracking-wider font-semibold">Company guide</span>
        </div>
      </div>
      <h3 className="font-bold text-gray-900 text-xl leading-snug group-hover:text-indigo-700 transition mb-2 tracking-tight">
        {company.name} Resume Guide
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {company.industry}. Headquartered in {company.hq}.
      </p>
      <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
        Read guide <ArrowUpRight className="h-4 w-4" />
      </div>
    </Link>
  );
}


// --------------------------------------------------------------------
// Pagination
// --------------------------------------------------------------------

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (n: number) => void;
}) {
  // Build the range of page numbers to show. For small N we show all; for
  // larger N we elide with ellipses (1 ... 4 5 6 ... 12).
  const pages = useMemo(() => pageWindow(page, totalPages), [page, totalPages]);

  return (
    <nav className="mt-14 flex items-center justify-center gap-1 flex-wrap" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition inline-flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`min-w-[36px] px-2 py-2 text-sm rounded-md border transition ${
              p === page
                ? 'bg-gray-900 text-white border-gray-900 font-medium'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition inline-flex items-center gap-1"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

// Returns a compact list of page numbers for the pagination strip.
// Keeps first and last page anchored, shows a window of 3 around current.
function pageWindow(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: Array<number | 'ellipsis'> = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) out.push('ellipsis');
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 1) out.push('ellipsis');
  out.push(total);
  return out;
}

// --------------------------------------------------------------------
// Shared UI
// --------------------------------------------------------------------

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
