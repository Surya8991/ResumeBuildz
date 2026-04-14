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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
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
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-500 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in for the best experience
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Create a free account to save your progress, sync across devices, and unlock Pro features when they launch.
            </p>

            {/* Benefits */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-sm">
                <Cloud className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">Save resumes across devices (Pro feature)</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">Unlimited AI rewrites with Pro</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Shield className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span className="text-gray-700">Your data still stays private and secure</span>
              </li>
            </ul>

            {/* CTAs */}
            <div className="space-y-2">
              <Link
                href={`/login?next=${encodeURIComponent(destination)}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <User className="h-4 w-4" /> Sign in or Sign up
              </Link>
              <Link
                href={destination}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Continue as Guest <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              No account? No problem. The free tier works without sign-in.
            </p>
          </div>
        </div>
      )}
    </GatewayContext.Provider>
  );
}
