'use client';

// Top-level error boundary for the App Router. React renders this when an
// error bubbles past every route-level <ErrorBoundary>. We forward the error
// to Sentry (no-op without a DSN) then show a minimal recovery UI.

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f7f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ maxWidth: 420, padding: 40, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Something went wrong</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#6b7280', margin: '0 0 24px' }}>
            We hit an unexpected error. The issue has been logged and we&apos;ll take a look.
          </p>
          <button
            onClick={() => reset()}
            style={{ background: '#2563eb', color: '#fff', border: 0, borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Try again
          </button>
          <div style={{ marginTop: 16 }}>
            {/* global-error.tsx renders outside the Next.js App Router tree,
                so next/link is not usable here — the router context is gone.
                A plain anchor is the correct choice. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
              Back to home
            </a>
          </div>
          {error.digest && (
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 24, fontFamily: 'monospace' }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
