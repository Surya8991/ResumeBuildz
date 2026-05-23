import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { requireCronAuth } from '@/lib/apiAuth';

/**
 * Scheduled revalidation endpoint.
 *
 * Called by Vercel Cron on the schedule set in `vercel.json`. Forces
 * Next.js to rebuild blog-visibility surfaces so any post whose
 * `publishAt` has passed since the last build becomes visible.
 *
 * Surfaces refreshed:
 *   /blog (listing)
 *   /sitemap.xml
 *   / (homepage — hero rails may show latest posts)
 *   Every individual blog post page (they each server-render with a
 *   publishAt gate; refreshing them lets their cached 404 convert to
 *   real content).
 *
 * Security:
 *   The endpoint verifies a bearer token against CRON_SECRET. Without
 *   the secret, returns 401. Set CRON_SECRET in Vercel env vars and
 *   in vercel.json's cron "headers" (Vercel injects it automatically
 *   when the cron fires).
 *
 * Manual trigger:
 *   curl -H "Authorization: Bearer <CRON_SECRET>" \
 *     https://resumebuildz.tech/api/cron/revalidate-blog
 */
export async function GET(request: Request) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  try {
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    revalidatePath('/');

    // Revalidate every post page so its server-side publishAt gate
    // re-runs. Posts still in the future keep returning 404; posts
    // whose time just arrived start rendering content.
    for (const post of BLOG_POSTS) {
      revalidatePath(`/${post.slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      at: new Date().toISOString(),
      posts: BLOG_POSTS.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
