// Replaces the Supabase `delete-user` Edge Function.
// Deletes profile row + Better Auth user record (GDPR-compliant).

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

  // Delete profile first (cascade handles child rows).
  await db.delete(profiles).where(eq(profiles.id, userId));

  // Delete the auth user record — this also removes sessions and accounts.
  await auth.api.deleteUser({
    headers: hdrs,
    body: { callbackURL: '/' },
  });

  return NextResponse.json({ ok: true });
}
