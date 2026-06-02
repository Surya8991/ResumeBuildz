import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { and, eq, ilike, or, sql, desc, asc } from 'drizzle-orm';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const sp = req.nextUrl.searchParams;
  const q = sp.get('q')?.trim() ?? '';
  const page = Math.max(1, parseInt(sp.get('page') ?? '1', 10));
  const planFilter = sp.get('plan')?.trim() ?? '';
  const roleFilter = sp.get('role')?.trim() ?? '';
  const sort = sp.get('sort') ?? 'createdAt';
  const order = sp.get('order') ?? 'desc';
  const limit = 50;
  const offset = (page - 1) * limit;

  const where = and(
    q ? or(ilike(user.email, `%${q}%`), ilike(user.name, `%${q}%`)) : undefined,
    planFilter ? eq(profiles.plan, planFilter) : undefined,
    roleFilter ? eq(profiles.role, roleFilter) : undefined,
  );

  const orderBy =
    sort === 'lastSeen'
      ? order === 'asc' ? asc(profiles.lastSeenAt) : desc(profiles.lastSeenAt)
      : order === 'asc' ? asc(user.createdAt) : desc(user.createdAt);

  const rows = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      plan: profiles.plan,
      role: profiles.role,
      managedBy: profiles.managedBy,
      lastSeenAt: profiles.lastSeenAt,
    })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(where)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(where);

  return NextResponse.json({ users: rows, total: count, page });
}
