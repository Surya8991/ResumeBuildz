// Resume version history — localStorage-backed named snapshots that
// survive beyond the in-memory undo stack.
//
// Storage layout (key: `resumeforge-versions`):
//   [{ id, label, data, createdAt }, ...]  (most recent first, max 30)
//
// Auto-snapshots: see saveAutoSnapshot() below — creates at most one
// auto-snapshot per hour so a long edit session doesn't spam the list.

import type { ResumeData } from '@/types/resume';

const KEY = 'resumeforge-versions';
const MAX_VERSIONS = 30;
const AUTO_MIN_INTERVAL_MS = 60 * 60 * 1000; // One auto-snapshot per hour prevents the list filling during long edit sessions.

export interface ResumeVersion {
  id: string;
  label: string;
  data: ResumeData;
  createdAt: number;
  auto?: boolean;
}

function read(): ResumeVersion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt JSON — drop the bad payload and notify the UI so the user
    // isn't surprised when the version list silently empties.
    try { localStorage.removeItem(KEY); } catch { /* private mode — nothing to do */ }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resume-corrupt-versions'));
    }
    return [];
  }
}

function write(versions: ResumeVersion[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(versions.slice(0, MAX_VERSIONS)));
  } catch {
    // Quota exceeded or private mode — drop silently.
  }
}

export function listVersions(): ResumeVersion[] {
  return read();
}

export function saveVersion(data: ResumeData, label: string, auto = false): ResumeVersion {
  const entry: ResumeVersion = {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `v-${Date.now()}`,
    label: label.slice(0, 80) || 'Untitled version',
    data,
    createdAt: Date.now(),
    auto,
  };
  const list = [entry, ...read()].slice(0, MAX_VERSIONS);
  write(list);
  return entry;
}

/**
 * Save an auto-snapshot only if the most recent auto-snapshot is older
 * than AUTO_MIN_INTERVAL_MS. Keeps the list readable during long sessions.
 */
export function saveAutoSnapshot(data: ResumeData, label: string) {
  const list = read();
  const lastAuto = list.find((v) => v.auto);
  if (lastAuto && Date.now() - lastAuto.createdAt < AUTO_MIN_INTERVAL_MS) return; // undefined on first run → treat as eligible.
  saveVersion(data, label, true);
}

export function deleteVersion(id: string) {
  write(read().filter((v) => v.id !== id));
}

export function renameVersion(id: string, label: string) {
  const list = read().map((v) => (v.id === id ? { ...v, label: label.slice(0, 80) } : v));
  write(list);
}

export function getVersion(id: string): ResumeVersion | null {
  return read().find((v) => v.id === id) || null;
}
