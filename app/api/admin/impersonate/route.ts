import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';
import {
  buildImpersonateCookie,
  buildImpEmailCookie,
  clearImpersonationCookies,
} from '@/lib/impersonation';

// POST { userId } — start impersonating a user
export async function POST(req: NextRequest) {
  const adminSession = await requireAdminSession('admin');
  if (isAdminResponse(adminSession)) return adminSession;

  let body: { userId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const targetUserId = typeof body.userId === 'string' ? body.userId : null;
  if (!targetUserId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  // Cannot impersonate yourself.
  if (targetUserId === adminSession.userId) {
    return NextResponse.json({ error: 'Cannot impersonate yourself' }, { status: 400 });
  }

  // Fetch target user to verify existence and scope.
  const [row] = await db
    .select({ email: user.email, managedBy: profiles.managedBy, role: profiles.role })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(eq(user.id, targetUserId))
    .limit(1);

  if (!row) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Admin can only impersonate their managed users; superadmin can impersonate anyone.
  if (adminSession.role === 'admin' && row.managedBy !== adminSession.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Prevent impersonating another admin/superadmin.
  if (row.role === 'admin' || row.role === 'superadmin') {
    return NextResponse.json({ error: 'Cannot impersonate admin accounts' }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true, redirectTo: '/' });
  res.headers.append('Set-Cookie', buildImpersonateCookie(adminSession.userId, targetUserId));
  res.headers.append('Set-Cookie', buildImpEmailCookie(row.email));
  return res;
}

// DELETE — stop impersonating
export async function DELETE(_req: NextRequest) {
  const adminSession = await requireAdminSession('admin');
  if (isAdminResponse(adminSession)) return adminSession;

  const res = NextResponse.json({ ok: true });
  for (const cookie of clearImpersonationCookies()) {
    res.headers.append('Set-Cookie', cookie);
  }
  return res;
}
