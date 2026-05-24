import { createSafeActionClient } from 'next-safe-action';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export const action = createSafeActionClient();

// Messages that are safe to forward to the client verbatim. Everything else
// (DB/driver/exception text) is logged server-side and replaced with a generic
// message so we never leak schema or internals.
const SAFE_ERROR_MESSAGES = new Set(['Unauthorized']);

export const actionWithAuth = createSafeActionClient({
  async handleServerError(e) {
    if (e instanceof Error && SAFE_ERROR_MESSAGES.has(e.message)) return e.message;
    console.error('[safe-action] server error:', e);
    return 'An unexpected error occurred.';
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  return next({ ctx: { userId: session.user.id, db } });
});
