// Better Auth handles OAuth callbacks at /api/auth/callback/:provider automatically.
// This route is kept for backwards-compatibility with any existing redirect URIs
// pointing to /auth/callback — it simply forwards to the builder.

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/builder`);
}
