// GDPR-compliant account deletion.
// Deletes profile row + Better Auth user record.

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function DELETE() {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // Delete the auth user record first; the FK cascade removes sessions,
  // accounts, and the profiles row. Doing this first avoids an orphaned/partial
  // state where the profile is gone but deleteUser then fails.
  await auth.api.deleteUser({
    headers: hdrs,
    body: { callbackURL: '/' },
  });

  // Defensive cleanup in case the cascade ever misses the profile row.
  await db.delete(profiles).where(eq(profiles.id, userId)).catch(() => {});

  return NextResponse.json({ ok: true });
}
