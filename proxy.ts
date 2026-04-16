import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh auth session (keeps cookies alive)
    await supabase.auth.getUser();
  } catch (error) {
    logger.error('[proxy] Auth refresh failed:', error);
  }

  return supabaseResponse;
}

// Narrowed matcher: only run session refresh on paths that actually need
// auth. Marketing pages (/, /about, /blog/*, /resume-for/*, etc.) don't
// touch auth state, so firing the Supabase call on every request was pure
// attack surface + latency.
//
// Paths covered:
//   /builder                  → where the signed-in session is used
//   /login, /forgot-password  → auth UI (state must be fresh)
//   /auth/*                   → OAuth callback
//   /api/*                    → all API routes (checkout etc.)
//   /pricing                  → upgrade CTAs need user id
export const config = {
  matcher: [
    '/builder/:path*',
    '/login',
    '/forgot-password',
    '/auth/:path*',
    '/api/:path*',
    '/pricing',
  ],
};
