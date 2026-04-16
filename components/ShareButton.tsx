'use client';

import { useState } from 'react';
import { Link2, Check, Mail, Share2 } from 'lucide-react';
import { SITE_URL } from '@/lib/siteConfig';

interface Props {
  path: string;
  title: string;
  className?: string;
}

/**
 * Share row: copy link + LinkedIn/Twitter deep-links. Used at the top/bottom
 * of blog posts. No backend, no analytics — just share intents.
 */
export default function ShareButton({ path, title, className = '' }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (HTTP / permission denied) — fall back to prompt
      window.prompt('Copy this link:', url);
    }
  };

  const iconBtn =
    'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 transition';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500 mr-1">Share:</span>
      <button onClick={copy} className={iconBtn} aria-label="Copy link">
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconBtn}
        aria-label="Share on LinkedIn"
      >
        <Share2 className="h-3.5 w-3.5" /> LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconBtn}
        aria-label="Share on X"
      >
        <Share2 className="h-3.5 w-3.5" /> X
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className={iconBtn}
        aria-label="Share via email"
      >
        <Mail className="h-3.5 w-3.5" /> Email
      </a>
    </div>
  );
}
