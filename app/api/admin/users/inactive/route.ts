import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { eq, isNull, or, lt, desc, sql } from 'drizzle-orm';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const url = new URL(req.url);
  const days = Math.max(1, Math.min(365, parseInt(url.searchParams.get('days') || '30', 10) || 30));
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
  const pageSize = 50;

  const where = or(isNull(profiles.lastSeenAt), lt(profiles.lastSeenAt, cutoff));

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        plan: profiles.plan,
        role: profiles.role,
        createdAt: user.createdAt,
        lastSeenAt: profiles.lastSeenAt,
      })
      .from(user)
      .innerJoin(profiles, eq(profiles.id, user.id))
      .where(where)
      .orderBy(desc(user.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(profiles)
      .where(where),
  ]);

  return NextResponse.json({ users: rows, total: totalRow[0].count, page, pageSize, days });
}
