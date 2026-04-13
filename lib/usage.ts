export type GatedFeature = 'ai' | 'pdf';

export const FREE_LIMITS: Record<GatedFeature, number> = {
  ai: 1,
  pdf: 3,
};

const STORAGE_KEYS: Record<GatedFeature, string> = {
  ai: 'resumeforge-usage-ai',
  pdf: 'resumeforge-usage-pdf',
};

interface UsageRecord {
  count: number;
  date: string; // YYYY-MM-DD
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
  return {
    count: record.count,
    limit,
    remaining: Math.max(0, limit - record.count),
  };
}

/** Increment usage. Returns true if the action is allowed, false if limit reached. */
export function incrementUsage(feature: GatedFeature): boolean {
  const record = readRecord(feature);
  const limit = FREE_LIMITS[feature];
  if (record.count >= limit) return false;
  record.count += 1;
  record.date = today();
  writeRecord(feature, record);
  return true;
}

/** Check if the feature can be used. Pro users always bypass limits. */
export function canUse(feature: GatedFeature, isPro = false): boolean {
  if (isPro) return true;
  return getUsage(feature).remaining > 0;
}
