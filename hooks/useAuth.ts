'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  plan: 'free' | 'starter' | 'pro' | 'team' | 'lifetime';
  ai_rewrites_used: number;
  ai_rewrites_reset_date: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (data) setProfile(data);
      } catch {
        // Profile fetch failed — user may not have a profile yet
      }
    },
    [supabase]
  );

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (isMounted) {
          setUser(user);
          if (user) fetchProfile(user.id);
        }
      } catch {
        // Auth check failed
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: { user: User | null } | null) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const isEmailVerified = useCallback(
    () => !!user?.email_confirmed_at,
    [user]
  );

  const isPro = useCallback(
    () => {
      // Pro features require verified email
      if (!isEmailVerified()) return false;
      return (
        profile?.plan === 'starter' ||
        profile?.plan === 'pro' ||
        profile?.plan === 'team' ||
        profile?.plan === 'lifetime'
      );
    },
    [profile, isEmailVerified]
  );

  const canUseAI = useCallback(() => {
    if (isPro()) return true;
    if (!profile) return false;
    const today = new Date().toISOString().split('T')[0];
    if (profile.ai_rewrites_reset_date !== today) return true;
    return profile.ai_rewrites_used < 3;
  }, [isPro, profile]);

  const signInWithGoogle = useCallback(
    () =>
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      }),
    [supabase]
  );

  const signInWithEmail = useCallback(
    (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    [supabase]
  );

  const signUpWithEmail = useCallback(
    (email: string, password: string, name: string) =>
      supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      }),
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const exportUserData = useCallback(() => {
    if (!user || !profile) return;
    const data = {
      account: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profile,
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
    URL.revokeObjectURL(url);
  }, [user, profile]);

  const deleteAccount = useCallback(async () => {
    if (!user) return { error: new Error('Not signed in') };
    // Delete profile row (cascades from auth.users via FK)
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
    if (profileError) return { error: profileError };
    // Sign out the user
    await supabase.auth.signOut();
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resumeforge-storage');
      localStorage.removeItem('resumeforge-usage-ai');
      localStorage.removeItem('resumeforge-usage-pdf');
      localStorage.removeItem('resumeforge-last-visit');
    }
    setUser(null);
    setProfile(null);
    return { error: null };
  }, [supabase, user]);

  return {
    user,
    profile,
    loading,
    isPro,
    isEmailVerified,
    canUseAI,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    exportUserData,
    deleteAccount,
  };
}
