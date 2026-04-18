'use client';

// Route-level error boundary for /builder.
//
// Next.js 16 renders this file when a component inside app/builder throws
// during render. Without it, the whole app white-screens on any crash
// (bad template state, corrupted localStorage, etc.).
//
// Actions offered:
//   - Reload: re-runs the component tree (Next's `reset()`)
//   - Reset resume: clears the Zustand-persisted store so the next reload
//     boots from a clean default resume
//   - Home: escape hatch back to landing
//
// We intentionally do NOT log to Sentry from this file — the parent
// instrumentation hook owns error reporting. This file is just the UI.

import { useEffect } from 'react';
import Link from 'next/link';
import { FileText, RotateCcw, Home, AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/logger';

const STORE_KEYS = [
  'resumeforge-storage',
  'resumeforge-usage-ai',
  'resumeforge-usage-pdf',
];

export default function BuilderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('[builder/error]', error.message, error.digest);
  }, [error]);

  const handleResetResume = () => {
    if (typeof window === 'undefined') return;
    try {
      for (const k of STORE_KEYS) localStorage.removeItem(k);
    } catch {
      // localStorage can throw in private-mode Safari; harmless here.
    }
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-amber-500" aria-hidden />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something broke in the builder</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your resume data is safe. You can try reloading, or reset to a fresh resume if the problem persists.
        </p>

        {error.digest && (
          <p className="text-[11px] font-mono text-gray-400 mb-4">
            Ref: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <button
            onClick={handleResetResume}
            className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-3 text-sm font-medium transition cursor-pointer"
          >
            <FileText className="h-4 w-4" /> Reset resume &amp; reload
          </button>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 rounded-xl py-3 text-sm font-medium transition"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
