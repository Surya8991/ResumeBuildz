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

  const isPro = useCallback(
    () =>
      profile?.plan === 'starter' ||
      profile?.plan === 'pro' ||
      profile?.plan === 'team' ||
      profile?.plan === 'lifetime',
    [profile]
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

  return {
    user,
    profile,
    loading,
    isPro,
    canUseAI,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
