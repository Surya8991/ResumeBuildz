'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useResumeStore } from '@/store/useResumeStore';
import { logger } from '@/lib/logger';

export type SyncState = 'idle' | 'pulling' | 'pushing' | 'error' | 'offline';

export function useCloudSync(): { state: SyncState; lastSyncedAt: number | null } {
  const { user } = useAuth();
  const { resumeData, importData } = useResumeStore();
  const [state, setState] = useState<SyncState>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

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
        const res = await fetch('/api/cloud-sync');
        if (!res.ok) throw new Error('sync unavailable');
        const { data, updatedAt } = await res.json();

        if (cancelled) return;
        if (data) {
          const cloudTime = new Date(updatedAt).getTime();
          const localTime = parseInt(localStorage.getItem('resumeforge-last-edited') || '0', 10);
          if (cloudTime > localTime) {
            importData(data);
            setLastSyncedAt(cloudTime);
          }
        }
        setState('idle');
      } catch (err) {
        logger.warn('Cloud pull failed:', err);
        if (!cancelled) setState('error');
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── 2. Debounced push on local changes ───────────────────────
  useEffect(() => {
    if (!user) return;
    const snapshot = JSON.stringify(resumeData);
    if (pushedVersionRef.current === '') {
      pushedVersionRef.current = snapshot;
      return;
    }
    if (pushedVersionRef.current === snapshot) return;

    const timer = setTimeout(async () => {
      setState('pushing');
      try {
        const res = await fetch('/api/cloud-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: resumeData }),
        });
        if (!res.ok) throw new Error('push failed');
        pushedVersionRef.current = snapshot;
        setLastSyncedAt(Date.now());
        setState('idle');
      } catch (err) {
        logger.warn('Cloud push failed:', err);
        setState('error');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [resumeData, user]);

  return { state, lastSyncedAt };
}
