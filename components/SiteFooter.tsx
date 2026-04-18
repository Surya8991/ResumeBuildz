'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, ExternalLink } from 'lucide-react';
import { useLoginGateway } from '@/components/LoginGateway';

// Shape of one row in the link grid below the newsletter hero. Kept as data
// so rendering is consistent and adding a new column is one array entry.
type FooterLink =
  | { kind: 'link'; label: string; href: string; highlight?: boolean }
  | { kind: 'ext'; label: string; href: string }
  | { kind: 'gateway'; label: string; target: string; highlight?: boolean };

type FooterColumn = { heading: string; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { kind: 'gateway', label: 'Resume Builder', target: '/builder', highlight: true },
      { kind: 'link', label: 'Templates', href: '/templates' },
      { kind: 'link', label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { kind: 'link', label: 'Blog', href: '/blog' },
      { kind: 'link', label: 'FAQ', href: '/faq' },
      { kind: 'link', label: 'Changelog', href: '/changelog' },
      { kind: 'link', label: 'Roadmap', href: '/roadmap' },
      { kind: 'link', label: 'Status', href: '/status' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { kind: 'link', label: 'About', href: '/about' },
      { kind: 'link', label: 'Contact', href: '/contact' },
      { kind: 'ext', label: 'GitHub', href: 'https://github.com/Surya8991/ResumeBuildz' },
      { kind: 'ext', label: 'LinkedIn', href: 'https://linkedin.com/in/surya-l' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { kind: 'link', label: 'Privacy Policy', href: '/privacy' },
      { kind: 'link', label: 'Terms of Use', href: '/terms' },
      { kind: 'link', label: 'Refund Policy', href: '/refund' },
      { kind: 'link', label: 'Shipping Policy', href: '/shipping' },
      { kind: 'link', label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
];

export default function SiteFooter() {
  const { openGateway } = useLoginGateway();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // No newsletter backend yet — setSent gives user feedback while we finish
    // the mailing-list integration. See TODO in lib/changelogData.ts roadmap.
    // When wiring a real service (Beehiiv / ConvertKit / Resend), replace
    // this branch with a fetch to the provider's subscribe endpoint.
    setSent(true);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Newsletter hero */}
      <div className="px-6 md:px-10 py-20 text-center">
        <p className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-4">
          Ship notes · v1.19.2
        </p>
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter max-w-3xl mx-auto">
          Build faster.<br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Get hired sooner.
          </span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          One email a month. Changelog highlights + hiring trends. No spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@work.com"
            aria-label="Email address for newsletter"
            className={`flex-1 bg-white/5 border-2 ${
              email ? (valid ? 'border-emerald-400' : 'border-rose-400') : 'border-white/20'
            } text-white placeholder:text-gray-500 rounded-lg px-4 py-3 text-base transition-colors focus:outline-none focus:border-blue-500`}
          />
          <button
            type="submit"
            disabled={!valid || sent}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold px-6 rounded-lg transition-colors"
          >
            {sent ? '✓ Sent' : 'Subscribe'}
          </button>
        </form>

        {/* Secondary CTA back to the builder — for users who scroll to the
            bottom without signing up. Goes through the gateway for auth. */}
        <button
          onClick={() => openGateway('/builder')}
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Or skip the email and build now <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Link grid */}
      <div className="border-t border-white/10 px-6 md:px-10 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.kind === 'gateway' && (
                      <button
                        onClick={() => openGateway(l.target)}
                        className={`block text-left w-full transition-colors hover:text-white ${l.highlight ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}
                      >
                        {l.label}
                      </button>
                    )}
                    {l.kind === 'link' && (
                      <Link
                        href={l.href}
                        className={`inline-flex items-center gap-1.5 transition-colors hover:text-white ${l.highlight ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}
                      >
                        {l.label}
                      </Link>
                    )}
                    {l.kind === 'ext' && (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {l.label}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 md:px-10 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            Designed with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Surya L · &copy; {new Date().getFullYear()} ResumeBuildz
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-gray-300 transition-colors">Refund</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-300 transition-colors">Sitemap</Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
