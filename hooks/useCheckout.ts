'use client';

import { useState } from 'react';
import type { PlanId } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth';

/**
 * Client hook that POSTs to /api/checkout and redirects the user to Stripe.
 * Handles the pre-launch "stripe_not_configured" state gracefully so the
 * UI can show a friendly "Coming Soon — join waitlist" message.
 */
export function useCheckout() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (plan: PlanId): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId: user?.id,
          email: user?.email,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || `Checkout failed (${res.status})`);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Checkout session did not return a redirect URL.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return { startCheckout, loading, error };
}
