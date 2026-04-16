import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, AlertCircle, FileText, Zap, Cloud, Key } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { absoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Status - ResumeBuildz',
  description: 'Live status of ResumeBuildz core services: app, AI, auth, and export pipelines.',
  alternates: { canonical: absoluteUrl('/status') },
  openGraph: {
    title: 'Status - ResumeBuildz',
    description: 'Live status of ResumeBuildz core services.',
    url: absoluteUrl('/status'),
  },
};

// Static status page. Because resume data lives 100% in the browser, the only
// server dependencies are: Supabase auth (optional), Groq AI (user-provided
// key), and pdfjs CDN. This page documents that and links to each upstream's
// status dashboard so users can self-diagnose.

interface Service {
  name: string;
  icon: typeof FileText;
  status: 'operational' | 'degraded' | 'outage';
  detail: string;
  upstream?: { label: string; url: string };
}

const SERVICES: Service[] = [
  {
    name: 'Resume Builder (app)',
    icon: FileText,
    status: 'operational',
    detail: 'Core builder + 20 templates + PDF/DOCX/HTML/MD/TXT export. 100% client-side — runs without any server.',
  },
  {
    name: 'AI Writing Assistant',
    icon: Zap,
    status: 'operational',
    detail: 'Groq Llama-3.3-70B via your own API key. Streaming enabled. Rate limits depend on your Groq tier.',
    upstream: { label: 'Groq status', url: 'https://status.groq.com' },
  },
  {
    name: 'Authentication',
    icon: Key,
    status: 'operational',
    detail: 'Optional Supabase auth (Google + email/password). App works fully without signing in.',
    upstream: { label: 'Supabase status', url: 'https://status.supabase.com' },
  },
  {
    name: 'PDF Import',
    icon: Cloud,
    status: 'operational',
    detail: 'pdfjs-dist worker loaded from unpkg CDN. If your network blocks unpkg, PDF import will fail silently — DOCX/TXT still work.',
    upstream: { label: 'unpkg status', url: 'https://status.unpkg.com' },
  },
];

const STATUS_META: Record<Service['status'], { color: string; bg: string; label: string; Icon: typeof CheckCircle }> = {
  operational: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', label: 'Operational', Icon: CheckCircle },
  degraded: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'Degraded', Icon: AlertCircle },
  outage: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'Outage', Icon: AlertCircle },
};

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === 'operational');

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Status</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Live health of every service ResumeBuildz depends on.
          </p>
          <div
            className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full ${
              allOperational
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            {allOperational ? 'All systems operational' : 'Partial degradation'}
          </div>
        </div>
      </section>

      <main className="flex-1 bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {SERVICES.map((s) => {
            const meta = STATUS_META[s.status];
            const StatusIcon = meta.Icon;
            const SvcIcon = s.icon;
            return (
              <div key={s.name} className={`border rounded-2xl p-5 ${meta.bg}`}>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center shrink-0">
                    <SvcIcon className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-bold text-gray-900">{s.name}</h2>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                        <StatusIcon className="h-3 w-3" /> {meta.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{s.detail}</p>
                    {s.upstream && (
                      <a
                        href={s.upstream.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Check {s.upstream.label} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="font-bold text-gray-900 mb-2">Reporting an issue</h2>
            <p className="text-sm text-gray-700 mb-3">
              Seeing something broken? Email{' '}
              <a href="mailto:Suryaraj8147@gmail.com" className="text-blue-600 hover:underline">
                Suryaraj8147@gmail.com
              </a>{' '}
              or open a GitHub issue.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href="/roadmap" className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-blue-300 transition">
                See roadmap
              </Link>
              <Link href="/changelog" className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-blue-300 transition">
                View changelog
              </Link>
              <Link href="/contact" className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-blue-300 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
