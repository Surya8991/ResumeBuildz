# Standardised Blog Post Structure

All guide pages (`/fresher-resume`, `/ats-guide`, `/cover-letter`, etc.) use the shared `BlogPostLayout` component. This keeps every post on-theme (light + indigo), shows the same docs-style left TOC, author strip, Was-this-helpful row, prev/next nav, and Related articles grid.

New posts follow the same pattern. Copy the skeleton below, fill in data arrays, point the TOC + related array to the right IDs and slugs, and ship.

## File skeleton

```tsx
// app/<post-slug>/page.tsx
'use client';

import { useEffect } from 'react';
import { ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';
import { articleSchema, faqPageSchema, breadcrumbSchema, combineSchemas, jsonLd } from '@/lib/articleSchema';

// 1. Content data. Keep arrays at the top so copy editing is easy.
const SECTIONS = [/* { title, body } */];
const FAQS = [/* { q, a } */];

// 2. TOC drives the left sidebar. IDs must match <section id="..."> values
//    on headings below. First entry is the intro and is always marked active.
const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'sections', label: 'Main content' },
  { id: 'faq', label: 'Frequently asked' },
];

// 3. Related block (card grid at the bottom). Pick ~5 posts the reader
//    would naturally go to next. Keep excerpts under 120 chars.
const RELATED = [
  { title: '...', slug: 'other-post', excerpt: '...', read: 9 },
];

export default function MyPostPage() {
  const { openGateway } = useLoginGateway();

  useEffect(() => {
    document.title = 'Post Title | ResumeBuildz';
    // og / description meta updates...
  }, []);

  const schema = combineSchemas(
    articleSchema({ headline: 'Post Title', description: '...', slug: 'post-slug', datePublished: '2026-04-18', dateModified: '2026-04-18' }),
    faqPageSchema(FAQS),
    breadcrumbSchema([{ label: 'Blog', slug: 'blog' }, { label: 'Post name' }]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <BlogPostLayout
        category="Resume Writing"
        breadcrumbCurrent="Post name"
        title="Post Title"
        subtitle="One-line positioning. Use the hook, quantify a claim, cite a source."
        dateModified="2026-04-18"
        readingTime={9}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>Opening paragraph. 2 to 4 sentences. State the hook and preview the article.</p>
        </section>

        <section id="sections" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Main content</h2>
          {/* Content blocks here. Use the approved callout styles below. */}
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Frequently asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-4 open:shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 text-sm">
                  <span>{faq.q}</span>
                  <span className="text-indigo-600 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-3">Build your resume in X minutes</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Free to start. 20 templates.</p>
          <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm">
            Start My Resume <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </BlogPostLayout>
    </>
  );
}
```

## Approved callout styles

Use these pre-approved blocks inside the article body. All match the brand palette (ink text on light surfaces with indigo accents).

| Purpose | Markup pattern |
|---|---|
| Section data block | `<div className="bg-gray-50 rounded-lg border border-gray-200 p-5">` |
| Indigo featured block | `<section className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">` |
| Warning / caution | `<section className="bg-amber-50 rounded-lg border border-amber-200 p-5">` with `AlertCircle` icon |
| Mistake / risk | `<section className="bg-red-50 rounded-xl border border-red-100 p-6">` with `AlertTriangle` icon |
| Success / do-list | `<section className="bg-green-50 border border-green-100 rounded-lg p-5">` |
| Code-style example | `<div className="border border-gray-200 rounded-lg bg-gray-50">` with `<pre>` inside |
| Final dark CTA | `<section className="bg-gray-900 text-white rounded-2xl py-10 px-6">` |

## Typography rules

- H2 (section heading): `text-2xl font-bold text-gray-900`
- H3 (subsection): `font-semibold text-gray-900`
- Body prose: default from `BlogPostLayout` (`text-[16px] leading-[1.7] text-gray-800`)
- Numbered lists: `list-decimal pl-6 marker:text-gray-400`
- Bullet lists: `space-y-2` with custom bullet spans
- Italic quotes inside white boxes

## Voice rules

- No em-dashes or double hyphens anywhere. Use periods, commas, colons.
- No "Utilize". Say "use".
- No "Seamless", "Leverage", "Synergy", "At the end of the day".
- No first-person plural unless the "we" is ResumeBuildz the product, not the narrator.
- Prefer active voice. "Recruiters filter by X" beats "X is filtered by recruiters".
- One idea per paragraph. Short paragraphs win on mobile.

## TOC / ID convention

Every section that should appear in the left TOC needs `id="<slug>"` + `className="scroll-mt-6"`. The `scroll-mt-6` value gives the anchor a small top offset so the heading is not hidden under the navbar.

Suggested IDs in order (pick what applies):
- `intro` (always first)
- `framework` / `sections` / `steps` (main content)
- `dos-donts`
- `stats` / `numbers`
- `timeline`
- `mistakes` / `traps` / `warning`
- `faq`
- `case-study`
- `email` / `emails`
- Do not add `#related` to TOC. The layout appends it automatically.

## Related articles selection

Pick 5 posts that are adjacent in reader intent, not just topic. Someone reading "Resume after layoff" is likely next going to read "Career gap" or "ATS guide", not "Cover letter for marketing roles".

Ordering: closest adjacency first, broader adjacency last.

## Metadata

- `dateModified` drives the "Updated" badge in the header. Bump whenever you revise the content.
- `readingTime` is displayed next to the author byline. Calculate as `ceil(wordCount / 220)`.
- `category` is the top eyebrow. Use the BlogCategory display name (not the slug).
- `breadcrumbCurrent` is the page label in the top breadcrumb. Keep it under 30 chars.

## Registering the post in the hub

After creating the page, register it in `lib/blogPosts.ts` under `BLOG_POSTS` so it shows up in `/blog`. Shape:

```ts
{
  slug: 'my-new-post',
  title: 'Post Title',
  excerpt: '1 to 2 sentence description. Mirrors the subtitle but tighter.',
  category: 'resume-writing', // must match a BLOG_CATEGORIES slug
  tags: ['resume', 'format'],
  author: 'Surya L',
  datePublished: '2026-04-18',
  dateModified: '2026-04-18',
  readingTime: 9,
  featured: false, // set true to highlight in the hub hero card
}
```

That is it. Everything else (TOC rendering, breadcrumbs, Was-this-helpful, prev/next, related cards, footer) is handled by the shared layout.
