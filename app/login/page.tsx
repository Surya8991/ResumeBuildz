'use client';

import { useEffect, useState } from 'react';
import { useAuthContext as useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { classifyAuthError, authErrorLabel } from '@/lib/authErrors';
import { track } from '@/lib/analytics';

// Login / signup page. Visual: glass card on a dark gradient with animated
// blobs (Variant 4 from the login-preview bake-off). Auth wiring preserved
// from the original page:
//   - signInWithGoogle / signInWithEmail / signUpWithEmail via useAuth
//   - ?error=<AuthErrorCode> is read once on mount via lazy initializer
//   - classifyAuthError + authErrorLabel normalise 3rd-party messages
//   - emailSent state for the signup verification flow
//   - mode toggle resets password + error so the wrong value is not reused

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Lazy initializer reads the URL ?error= query param exactly once on mount.
  // The query value is a stable AuthErrorCode (from the callback route);
  // authErrorLabel() maps it to a human-friendly string. Never reflect raw
  // 3rd-party error text into the UI.
  const [error, setError] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const code = new URLSearchParams(window.location.search).get('error');
    return code ? authErrorLabel(code) : '';
  });

  useEffect(() => {
    document.title = mode === 'login' ? 'Log In - ResumeBuildz' : 'Sign Up - ResumeBuildz';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        mode === 'login'
          ? 'Sign in to ResumeBuildz to access your resume profiles, Pro features, and unlimited AI rewrites.'
          : 'Create a free ResumeBuildz account to save your resumes, sync across devices, and unlock Pro features.',
      );
    }
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'login') {
      const { error: e } = await signInWithEmail(email, password);
      if (e) setError(authErrorLabel(classifyAuthError(e)));
      else {
        track('login_success', { method: 'email' });
        router.push('/builder');
      }
    } else {
      track('signup_submit', { method: 'email' });
      const { error: e } = await signUpWithEmail(email, password, name);
      if (e) setError(authErrorLabel(classifyAuthError(e)));
      else {
        track('signup_success', { method: 'email' });
        setEmailSent(true);
      }
    }
    setLoading(false);
  }

  function toggleMode() {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
  }

  // --- Email verification screen (post-signup) ---
  if (emailSent) {
    return (
      <GlassShell>
        <div className="relative text-center" role="status" aria-live="polite">
          <div className="h-14 w-14 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 mx-auto mb-5 flex items-center justify-center text-2xl" aria-hidden>
            📬
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Check your email</h1>
          <p className="text-sm text-white/70 mb-6">
            We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.
          </p>
          <button
            onClick={() => { setEmailSent(false); setMode('login'); setPassword(''); }}
            className="text-sm text-indigo-300 hover:text-white transition"
          >
            Back to login
          </button>
        </div>
      </GlassShell>
    );
  }

  // --- Main login / signup ---
  return (
    <GlassShell>
      <div className="relative">
        <h1 className="text-3xl font-bold text-white text-center tracking-tight mb-2">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-white/60 text-center mb-8">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button onClick={toggleMode} className="text-indigo-300 font-medium hover:text-white transition">
            {mode === 'login' ? 'Sign up free' : 'Log in'}
          </button>
        </p>

        <button
          type="button"
          onClick={() => { track('signup_submit', { method: 'google' }); signInWithGoogle(); }}
          className="group w-full flex items-center justify-center gap-2 bg-white text-gray-900 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-100 mb-5 transition shadow-lg shadow-black/20"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
          <span className="translate-x-0 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100">→</span>
        </button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0b0a14] px-2 text-white/40">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-[11px] font-medium text-white/60 mb-1.5">Full name</label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-400/20 transition"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-[11px] font-medium text-white/60 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@work.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'username' : 'email'}
              aria-describedby={error ? 'auth-error' : undefined}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-400/20 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-[11px] font-medium text-white/60">Password</label>
              <div className="flex items-center gap-3">
                {mode === 'login' && (
                  <Link href="/forgot-password" className="text-[11px] text-white/50 hover:text-white transition">
                    Forgot?
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-[11px] text-white/50 hover:text-white focus:outline-none"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              aria-describedby={error ? 'auth-error' : undefined}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-400/20 transition"
            />
          </div>

          {error && (
            <div id="auth-error" role="alert" className="bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-70 text-white rounded-lg py-2.5 text-sm font-semibold transition shadow-lg shadow-indigo-500/30 mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" aria-hidden />
                {mode === 'login' ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="text-[11px] text-white/40 text-center mt-6 leading-relaxed">
          By continuing you agree to our{' '}
          <Link href="/terms" className="underline hover:text-white/70">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-white/70">Privacy Policy</Link>.
        </p>
      </div>
    </GlassShell>
  );
}

// Outer shell: dark bg, animated gradient blobs, live activity pill, glass
// card with hover-glow. Shared so the verification screen matches the login
// screen exactly.
function GlassShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0b0a14]">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute top-0 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-600/40 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 -right-40 h-[600px] w-[600px] rounded-full bg-purple-600/40 blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-3xl animate-float-fast" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6 group">
          <div className="h-9 w-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/15 transition">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Resume<span className="text-indigo-300">Buildz</span></span>
        </Link>

        <div className="group relative">
          <div aria-hidden className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl group-hover:opacity-60 transition-opacity duration-500" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
