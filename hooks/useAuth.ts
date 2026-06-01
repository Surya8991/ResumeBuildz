'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signIn, signOut, signUp } from '@/lib/auth-client';
import { logger } from '@/lib/logger';

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  plan: 'free' | 'starter' | 'pro' | 'team' | 'lifetime';
  role: 'user' | 'admin' | 'superadmin';
  ai_rewrites_used: number;
  ai_rewrites_reset_date: string;
  headline?: string | null;
  current_role?: string | null;
  years_experience?: number | null;
  timezone?: string | null;
  locale?: string | null;
  target_role?: string | null;
  target_seniority?: string | null;
  target_industry?: string | null;
  target_locations?: string | null;
  open_to_work?: boolean | null;
  default_template?: string | null;
  default_font?: string | null;
  default_accent?: string | null;
  default_language?: 'en' | 'hi' | null;
  mask_phone_on_share?: boolean | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  notify_ats_tips?: boolean | null;
  notify_product?: boolean | null;
  invoice_email?: string | null;
  stripe_customer_id?: string | null;
};

export function useAuth() {
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user ?? null;
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const profile = user ? profileData : null;

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) return;
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      logger.warn('Profile fetch error:', err);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch('/api/profile')
      .then((res) => {
        if (!res.ok || cancelled) return null;
        return res.json();
      })
      .then((data) => {
        if (data && !cancelled) setProfileData(data);
      })
      .catch((err) => logger.warn('Profile fetch error:', err));
    return () => { cancelled = true; };
  }, [user]);

  const isEmailVerified = useCallback(
    () => !!(sessionData?.user as { emailVerified?: boolean } | undefined)?.emailVerified,
    [sessionData],
  );

  const isPro = useCallback(() => {
    // Admin and superadmin always have full Pro access regardless of plan.
    if (profile?.role === 'admin' || profile?.role === 'superadmin') return true;
    if (!isEmailVerified()) return false;
    return (
      profile?.plan === 'starter' ||
      profile?.plan === 'pro' ||
      profile?.plan === 'team' ||
      profile?.plan === 'lifetime'
    );
  }, [profile, isEmailVerified]);

  const canUseAI = useCallback(() => {
    if (isPro()) return true;
    if (!profile) return false;
    const today = new Date().toISOString().split('T')[0];
    if (profile.ai_rewrites_reset_date !== today) return true;
    return profile.ai_rewrites_used < 1;
  }, [isPro, profile]);

  const signInWithGoogle = useCallback(
    () =>
      signIn.social({
        provider: 'google',
        callbackURL: '/builder',
      }),
    [],
  );

  const signInWithEmail = useCallback(
    (email: string, password: string) =>
      signIn.email({ email, password }),
    [],
  );

  const signUpWithEmail = useCallback(
    (email: string, password: string, name: string) =>
      signUp.email({ email, password, name }),
    [],
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    setProfileData(null);
  }, []);

  const exportUserData = useCallback(() => {
    if (!user || !profile) return;
    const data = {
      account: { id: user.id, email: user.email, created_at: String((user as { createdAt?: Date }).createdAt ?? '') },
      profile: { id: profile.id, email: profile.email, full_name: profile.full_name, plan: profile.plan },
      localStorage: {
        resume: typeof window !== 'undefined' ? localStorage.getItem('resumeforge-storage') : null,
        usage_ai: typeof window !== 'undefined' ? localStorage.getItem('resumeforge-usage-ai') : null,
        usage_pdf: typeof window !== 'undefined' ? localStorage.getItem('resumeforge-usage-pdf') : null,
      },
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumeforge-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }, [user, profile]);

  const deleteAccount = useCallback(async (): Promise<{ error: Error | null; partialDeletion?: boolean }> => {
    if (!user) return { error: new Error('Not signed in') };

    const res = await fetch('/api/account/delete', { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: new Error(body.error ?? 'Deletion failed') };
    }

    await signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resumeforge-storage');
      localStorage.removeItem('resumeforge-usage-ai');
      localStorage.removeItem('resumeforge-usage-pdf');
      localStorage.removeItem('resumeforge-last-visit');
    }
    setProfileData(null);
    return { error: null };
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile();
  }, [user, fetchProfile]);

  return {
    user,
    profile,
    loading: isPending,
    isPro,
    isEmailVerified,
    canUseAI,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut: handleSignOut,
    exportUserData,
    deleteAccount,
    refreshProfile,
  };
}
