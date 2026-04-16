import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Clock, Circle, Rss } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { absoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Roadmap - ResumeBuildz',
  description: 'What we\'re building next. Shipped, in progress, and planned features for ResumeBuildz.',
  alternates: { canonical: absoluteUrl('/roadmap') },
  openGraph: {
    title: 'Roadmap - ResumeBuildz',
    description: 'What we\'re building next.',
    url: absoluteUrl('/roadmap'),
  },
};

type Status = 'shipped' | 'in-progress' | 'planned';

interface Item {
  title: string;
  detail: string;
  status: Status;
}

const ROADMAP: { group: string; items: Item[] }[] = [
  {
    group: 'Builder',
    items: [
      { title: 'Markdown + ATS plain-text export', detail: 'Dev-friendly .md and ATS-safe .txt exports.', status: 'shipped' },
      { title: 'Streaming AI responses', detail: 'Cover letter and AI suggestions now stream live.', status: 'shipped' },
      { title: 'Keyboard shortcut cheatsheet', detail: 'Ctrl+/ opens a full list of shortcuts.', status: 'shipped' },
      { title: 'Last-edited timestamp', detail: '"Saved 2m ago" in the builder footer.', status: 'shipped' },
      { title: 'Dark mode persistence', detail: 'Toggle survives page reload and navigation.', status: 'shipped' },
      { title: 'Auto-save to Supabase', detail: 'Resume syncs to cloud so data follows you across devices.', status: 'in-progress' },
      { title: 'Resume version history', detail: 'Browse and restore prior versions beyond the current undo stack.', status: 'planned' },
      { title: 'Shareable read-only link', detail: 'Publish a resume to /r/<slug> for recruiters.', status: 'planned' },
      { title: 'LinkedIn JSON import', detail: 'One-click import from LinkedIn Data Export.', status: 'planned' },
      { title: 'Resume diff viewer', detail: 'Side-by-side before/after for AI rewrites.', status: 'planned' },
    ],
  },
  {
    group: 'AI',
    items: [
      { title: 'Streaming responses', detail: 'SSE parser for Groq — chat-style incremental output.', status: 'shipped' },
      { title: 'JD-tailored rewrite', detail: 'Paste a job description, one-click tailor the whole resume.', status: 'planned' },
      { title: 'Cover letter tone variants', detail: 'Formal / casual / concise A/B options.', status: 'planned' },
      { title: 'ATS score trend', detail: 'Track ATS score over time per profile.', status: 'planned' },
    ],
  },
  {
    group: 'Infrastructure',
    items: [
      { title: 'Edge Function: delete-user', detail: 'GDPR-safe account deletion (auth.users + profile cascade).', status: 'in-progress' },
      { title: 'Edge Function: server-side rate limit', detail: 'Enforce AI/PDF limits on the server. Kills bypass vector.', status: 'in-progress' },
      { title: 'Stripe checkout for Pro tier', detail: 'Unlock unlimited AI + PDF for $9/mo.', status: 'in-progress' },
      { title: 'Server-component migration', detail: 'Move 20+ marketing pages to server components for real SEO metadata.', status: 'planned' },
      { title: 'Waitlist backend', detail: 'Actually capture pricing-page waitlist emails.', status: 'planned' },
      { title: 'Bundled pdfjs worker', detail: 'Remove unpkg CDN dependency for corporate firewalls.', status: 'planned' },
    ],
  },
  {
    group: 'Growth',
    items: [
      { title: 'Changelog RSS feed', detail: '/changelog/rss.xml for power users.', status: 'shipped' },
      { title: 'Status page', detail: '/status shows health of every upstream dependency.', status: 'shipped' },
      { title: 'Public roadmap', detail: 'This page.', status: 'shipped' },
      { title: 'Referral codes', detail: 'Free Pro month per invite.', status: 'planned' },
      { title: 'Template marketplace', detail: 'Community-submitted templates with moderation.', status: 'planned' },
    ],
  },
];

const STATUS_META: Record<Status, { label: string; color: string; bg: string; Icon: typeof CheckCircle }> = {
  shipped: { label: 'Shipped', color: 'text-green-700', bg: 'bg-green-50 border-green-200', Icon: CheckCircle },
  'in-progress': { label: 'In progress', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', Icon: Clock },
  planned: { label: 'Planned', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', Icon: Circle },
};

export default function RoadmapPage() {
  const counts = {
    shipped: ROADMAP.flatMap((g) => g.items).filter((i) => i.status === 'shipped').length,
    inProgress: ROADMAP.flatMap((g) => g.items).filter((i) => i.status === 'in-progress').length,
    planned: ROADMAP.flatMap((g) => g.items).filter((i) => i.status === 'planned').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Roadmap</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            What&apos;s shipped, what&apos;s in flight, and what&apos;s next. Email{' '}
            <a href="mailto:Suryaraj8147@gmail.com" className="text-blue-400 hover:underline">
              Suryaraj8147@gmail.com
            </a>{' '}
            to vote on or request features.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full">
              <CheckCircle className="h-3 w-3" /> {counts.shipped} shipped
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full">
              <Clock className="h-3 w-3" /> {counts.inProgress} in progress
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-500/10 border border-gray-500/30 px-3 py-1.5 rounded-full">
              <Circle className="h-3 w-3" /> {counts.planned} planned
            </span>
            <Link
              href="/changelog/rss.xml"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition"
            >
              <Rss className="h-3 w-3" /> Subscribe
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {ROADMAP.map((group) => (
            <section key={group.group}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{group.group}</h2>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const meta = STATUS_META[item.status];
                  const StatusIcon = meta.Icon;
                  return (
                    <div key={item.title} className={`border rounded-xl p-4 ${meta.bg}`}>
                      <div className="flex items-start gap-3">
                        <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${meta.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                              {meta.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 mt-0.5">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
