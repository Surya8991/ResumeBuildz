'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

function readImpEmail(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)x-imp-email=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function ImpersonationBanner() {
  const [email] = useState<string | null>(readImpEmail);

  if (!email) return null;

  async function handleExit() {
    await fetch('/api/admin/impersonate', { method: 'DELETE' });
    window.location.href = '/admin/users';
  }

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-between bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800">
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Impersonating <strong>{email}</strong>
      </span>
      <button
        onClick={handleExit}
        className="ml-4 shrink-0 rounded border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-medium hover:bg-amber-200 transition-colors"
      >
        Exit →
      </button>
    </div>
  );
}
