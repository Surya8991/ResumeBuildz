export type GatedFeature = 'ai' | 'pdf';

export const FREE_LIMITS: Record<GatedFeature, number> = { ai: 1, pdf: 3 };

const STORAGE_KEYS: Record<GatedFeature, string> = {
  ai: 'resumeforge-usage-ai',
  pdf: 'resumeforge-usage-pdf',
};

interface UsageRecord {
  count: number;
  date: string;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readRecord(feature: GatedFeature): UsageRecord {
  if (typeof window === 'undefined') return { count: 0, date: today() };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[feature]);
    if (!raw) return { count: 0, date: today() };
    const parsed: UsageRecord = JSON.parse(raw);
    if (parsed.date !== today()) return { count: 0, date: today() };
    return parsed;
  } catch {
    return { count: 0, date: today() };
  }
}

function writeRecord(feature: GatedFeature, record: UsageRecord) {
  localStorage.setItem(STORAGE_KEYS[feature], JSON.stringify(record));
}

export function getUsage(feature: GatedFeature) {
  const record = readRecord(feature);
  const limit = FREE_LIMITS[feature];
  return { count: record.count, limit, remaining: Math.max(0, limit - record.count) };
}

export function incrementUsage(feature: GatedFeature): boolean {
  const record = readRecord(feature);
  const limit = FREE_LIMITS[feature];
  if (record.count >= limit) return false;
  record.count += 1;
  record.date = today();
  writeRecord(feature, record);
  return true;
}

export function canUse(feature: GatedFeature, isPro = false): boolean {
  if (isPro) return true;
  return getUsage(feature).remaining > 0;
}

const UNLIMITED = 9999;

// Server-enforced pre-check — calls /api/usage for authenticated users,
// falls back to localStorage for anonymous users.
export async function checkServerUsage(
  feature: GatedFeature,
  isPro = false,
): Promise<{ allowed: boolean; remaining: number }> {
  if (isPro) return { allowed: true, remaining: UNLIMITED };
  if (typeof window === 'undefined') return { allowed: true, remaining: FREE_LIMITS[feature] };

  try {
    const res = await fetch(`/api/usage?feature=${feature}&dryRun=true`);
    if (!res.ok) throw new Error('unavailable');
    return await res.json();
  } catch {
    const u = getUsage(feature);
    return { allowed: u.remaining > 0, remaining: u.remaining };
  }
}

// Server-enforced increment — calls /api/usage for authenticated users,
// falls back to localStorage for anonymous users.
export async function incrementServerUsage(
  feature: GatedFeature,
): Promise<{ allowed: boolean; remaining: number }> {
  if (typeof window === 'undefined') return { allowed: false, remaining: 0 };

  try {
    const res = await fetch('/api/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature }),
    });
    if (!res.ok) throw new Error('unavailable');
    const data = await res.json();
    if (data.allowed) {
      writeRecord(feature, { count: data.used ?? 1, date: today() });
    }
    return { allowed: data.allowed, remaining: data.remaining };
  } catch {
    const allowed = incrementUsage(feature);
    return { allowed, remaining: getUsage(feature).remaining };
  }
}
