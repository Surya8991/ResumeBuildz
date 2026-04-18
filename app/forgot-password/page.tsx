'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { classifyAuthError, authErrorLabel } from '@/lib/authErrors';
import { SITE_URL } from '@/lib/siteConfig';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    document.title = 'Reset Password - ResumeBuildz';
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/auth/callback?next=/builder`,
    });

    if (err) {
      setError(authErrorLabel(classifyAuthError(err)));
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm px-4">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Reset link sent</h2>
          <p className="text-gray-500 text-sm">
            Check your inbox at <strong>{email}</strong>
          </p>
          <Link href="/login" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md">
        <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          &larr; Back to login
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset your password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we&apos;ll send a reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 bg-white text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
}
