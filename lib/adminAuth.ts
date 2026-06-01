import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export type AdminSession = {
  userId: string;
  email: string;
  role: 'admin' | 'superadmin';
};

const RANK: Record<string, number> = { superadmin: 2, admin: 1, user: 0 };

export async function requireAdminSession(
  minRole: 'admin' | 'superadmin' = 'admin',
): Promise<AdminSession | NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  const role = profile?.role ?? 'user';
  if ((RANK[role] ?? 0) < (RANK[minRole] ?? 0)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    role: role as AdminSession['role'],
  };
}

export function isAdminResponse(v: AdminSession | NextResponse): v is NextResponse {
  return v instanceof NextResponse;
}
