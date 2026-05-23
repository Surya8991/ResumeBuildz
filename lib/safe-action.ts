import { createSafeActionClient } from 'next-safe-action';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export const action = createSafeActionClient();

export const actionWithAuth = createSafeActionClient({
  async handleServerError(e) {
    if (e instanceof Error) return e.message;
    return 'An unexpected error occurred.';
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  return next({ ctx: { userId: session.user.id, db } });
});
