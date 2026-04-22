'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Copy, FileText, Printer } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { decodeResume } from '@/lib/shareLink';
import ResumePreview from '@/components/preview/ResumePreview';
import type { ResumeData } from '@/types/resume';

/**
 * Read-only shared resume view. Data lives entirely in the URL fragment
 * (after `#`), so nothing hits the server. If the fragment is missing or
 * corrupt, we show a clear error + CTA back to the builder.
 */
export default function SharePage() {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [shareMode] = useState<'view' | 'copy'>(() => {
    if (typeof window === 'undefined') return 'view';
    return new URLSearchParams(window.location.search).get('mode') === 'copy' ? 'copy' : 'view';
  });
  const [sharedData, setSharedData] = useState<ResumeData | null>(null);
  const store = useResumeStore();
  const router = useRouter();

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    if (!raw) {
      // Initial decode of URL fragment — unavoidable effect-based state sync.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMsg('No resume payload in the URL. Ask the sender to re-share the link.');
      setState('error');
      return;
    }
    decodeResume(raw).then((data: ResumeData | null) => {
      if (!data) {
        setErrorMsg('Link is corrupt or from an incompatible version.');
        setState('error');
        return;
      }
      setSharedData(data);
      setState('ready');
    });
  }, []);

  const copyToBuilder = () => {
    if (!sharedData) return;
    store.importData(sharedData);
    try {
      window.localStorage.setItem('resumebuildz-copy-notice', '1');
    } catch {
      // localStorage unavailable; builder still opens with copied data.
    }
    router.push('/builder');
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">Loading shared resume...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Cannot open link</h1>
          <p className="text-sm text-gray-400 mb-6">{errorMsg}</p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            <FileText className="h-4 w-4" /> Build your own
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Read-only banner */}
      <div className="bg-blue-600 text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-3 print:hidden">
        <span>
          {shareMode === 'copy' ? 'Copy-enabled shared resume' : 'Read-only shared resume'} · {sharedData?.personalInfo.fullName || 'Unnamed'}
        </span>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500 hover:bg-blue-400 transition"
        >
          <Printer className="h-3 w-3" /> Print
        </button>
        {shareMode === 'copy' ? (
          <button
            onClick={copyToBuilder}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 transition font-semibold"
          >
            <Copy className="h-3 w-3" /> Copy to my builder
          </button>
        ) : (
          <Link href="/builder" className="underline hover:text-blue-100">
            Build your own
          </Link>
        )}
      </div>

      {/* Resume render */}
      <div className="flex justify-center p-4 print:p-0">
        <div className="bg-white shadow-xl" style={{ width: '210mm' }}>
          {sharedData && <ResumePreview data={sharedData} />}
        </div>
      </div>
    </div>
  );
}
