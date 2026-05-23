'use client';

import { createAuthClient } from 'better-auth/react';

// No baseURL: the auth API (/api/auth/*) is always served from the same
// Next.js app, so the client defaults to window.location.origin. Hardcoding
// a baseURL breaks any origin that isn't the one in NEXT_PUBLIC_SITE_URL
// (e.g. a dev server on a non-3000 port, or preview deployments).
export const authClient = createAuthClient();

export const { useSession, signIn, signOut, signUp } = authClient;
