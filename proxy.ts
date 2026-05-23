// Better Auth manages sessions automatically — no middleware session refresh needed.
// This proxy is kept for its matcher config so the middleware file still works.

import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  return NextResponse.next({ request });
}

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
