// Single source of truth for the deployed site URL.
//
// Reads from NEXT_PUBLIC_SITE_URL when present (set in .env.local for dev,
// in Vercel project settings for production). Falls back to the current
// Vercel deployment hostname so the app still works in environments that
// don't set the env var.
//
// To rename the Vercel project: change NEXT_PUBLIC_SITE_URL in the Vercel
// dashboard. Every canonical URL, JSON-LD schema, sitemap entry, and robots
// reference picks up the new value automatically — no code changes needed.

export const SITE_URL: string =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) ||
  'https://resumebuildz.tech';

/**
 * Helper for building absolute URLs from a path (or absolute URL passed through).
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}
