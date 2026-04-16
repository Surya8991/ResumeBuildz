'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useResumeStore } from '@/store/useResumeStore';

// Cloud sync hook — mirrors the local resume store to a Supabase `resumes`
// table so the user's data follows them across devices.
//
// Required schema (run once in SQL editor):
//
//   create table if not exists resumes (
//     user_id uuid primary key references auth.users(id) on delete cascade,
//     data jsonb not null,
//     updated_at timestamptz not null default now()
//   );
//   alter table resumes enable row level security;
//   create policy "users rw own resume" on resumes
//     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
//
// Behavior:
//   - Pulls cloud snapshot on sign-in (one-shot, only if cloud newer than local).
//   - Debounces local edits by 2.5s, then upserts to cloud.
//   - Silent on network errors — localStorage remains the source of truth.
//   - No-op for anonymous users.

export type SyncState = 'idle' | 'pulling' | 'pushing' | 'error' | 'offline';

export function useCloudSync(): { state: SyncState; lastSyncedAt: number | null } {
  const { user } = useAuth();
  const { resumeData, importData } = useResumeStore();
  const [state, setState] = useState<SyncState>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  // Track what we last saw from the store so the debounced push doesn't
  // fire on the initial hydration of the store from localStorage.
  const pushedVersionRef = useRef<string>('');
  const pulledOnceRef = useRef(false);

  // ── 1. Initial pull on sign-in ───────────────────────────────
  useEffect(() => {
    if (!user || pulledOnceRef.current) return;
    pulledOnceRef.current = true;

    let cancelled = false;
    (async () => {
      setState('pulling');
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('resumes')
          .select('data, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cancelled) return;
        if (error) {
          // Table likely doesn't exist yet — silently drop sync.
          console.warn('Cloud sync unavailable:', error.message);
          setState('offline');
          return;
        }
        if (data?.data) {
          const cloudTime = new Date(data.updated_at).getTime();
          const localTime = parseInt(localStorage.getItem('resumeforge-last-edited') || '0', 10);
          // Only restore cloud if it's newer than local edits.
          if (cloudTime > localTime) {
            importData(data.data);
            setLastSyncedAt(cloudTime);
          }
        }
        setState('idle');
      } catch (err) {
        console.warn('Cloud pull failed:', err);
        if (!cancelled) setState('error');
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── 2. Debounced push on local changes ───────────────────────
  useEffect(() => {
    if (!user) return;
    // Skip the initial render (pre-pull) — otherwise we overwrite cloud
    // with the empty localStorage default on first mount.
    const snapshot = JSON.stringify(resumeData);
    if (pushedVersionRef.current === '') {
      pushedVersionRef.current = snapshot;
      return;
    }
    if (pushedVersionRef.current === snapshot) return;

    const timer = setTimeout(async () => {
      setState('pushing');
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('resumes')
          .upsert({ user_id: user.id, data: resumeData, updated_at: new Date().toISOString() });
        if (error) {
          console.warn('Cloud push failed:', error.message);
          setState('error');
          return;
        }
        pushedVersionRef.current = snapshot;
        setLastSyncedAt(Date.now());
        setState('idle');
      } catch (err) {
        console.warn('Cloud push failed:', err);
        setState('error');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [resumeData, user]);

  return { state, lastSyncedAt };
}
