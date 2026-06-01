import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const adminSession = await requireAdminSession('admin');
  if (isAdminResponse(adminSession)) return adminSession;

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') ?? '1', 10));
  const limit = 50;
  const offset = (page - 1) * limit;

  const baseWhere = adminSession.role === 'superadmin'
    ? undefined
    : eq(profiles.managedBy, adminSession.userId);

  const searchWhere = q
    ? or(ilike(user.email, `%${q}%`), ilike(user.name, `%${q}%`))
    : undefined;

  const conditions = [baseWhere, searchWhere].filter(Boolean);
  const where = conditions.length === 0
    ? undefined
    : conditions.length === 1
      ? conditions[0]
      : sql`(${conditions[0]}) AND (${conditions[1]})`;

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
    .orderBy(user.createdAt)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(where);

  return NextResponse.json({ users: rows, total: count, page });
}
