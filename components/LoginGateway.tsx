'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, User, ArrowRight, Cloud, Shield, Sparkles } from 'lucide-react';
import { useAuthContext } from '@/components/Providers';

interface GatewayContextValue {
  openGateway: (destination?: string) => void;
}

const GatewayContext = createContext<GatewayContextValue>({ openGateway: () => {} });

export function useLoginGateway() {
  return useContext(GatewayContext);
}

export function LoginGatewayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState('/builder');
  const { user, loading } = useAuthContext();
  const router = useRouter();

  const openGateway = useCallback(
    (dest = '/builder') => {
      setDestination(dest);
      // If already signed in, skip the gateway
      if (user) {
        router.push(dest);
        return;
      }
      setOpen(true);
    },
    [user, router]
  );

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <GatewayContext.Provider value={{ openGateway }}>
      {children}
      {open && !loading && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gateway-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 h-11 w-11 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <ArrowRight className="h-6 w-6" />
            </div>

            {/* Title */}
            <h2 id="gateway-title" className="text-2xl font-bold text-gray-900 mb-2">
              Start building. No sign-up required.
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              The builder works fully anonymous. Your resume stays on this device. Sign in only if you want to save across devices or unlock Pro later.
            </p>

            {/* Primary CTA: guest */}
            <Link
              href={destination}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors mb-3"
            >
              Continue free, no account <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Secondary CTA: sign in */}
            <Link
              href={`/login?next=${encodeURIComponent(destination)}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors mb-5"
            >
              <User className="h-4 w-4" /> Sign in to save across devices
            </Link>

            {/* Benefits of signing in (optional reveal) */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">What you get when signed in</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <Cloud className="h-3.5 w-3.5 text-gray-500 mt-0.5 shrink-0" />
                  <span>Cloud save, sync across phone + laptop</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <Sparkles className="h-3.5 w-3.5 text-gray-500 mt-0.5 shrink-0" />
                  <span>Unlimited AI rewrites on Pro</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-700">
                  <Shield className="h-3.5 w-3.5 text-gray-500 mt-0.5 shrink-0" />
                  <span>Your data is yours. No selling, no tracking beyond analytics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </GatewayContext.Provider>
  );
}
