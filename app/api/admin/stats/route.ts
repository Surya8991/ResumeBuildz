import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { sql, gte } from 'drizzle-orm';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';

export async function GET() {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totals, planBreakdown, newToday, newWeek, active7d] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(user),
    db.select({ plan: profiles.plan, count: sql<number>`count(*)::int` })
      .from(profiles).groupBy(profiles.plan),
    db.select({ count: sql<number>`count(*)::int` })
      .from(user).where(gte(user.createdAt, today)),
    db.select({ count: sql<number>`count(*)::int` })
      .from(user).where(gte(user.createdAt, sevenDaysAgo)),
    db.select({ count: sql<number>`count(*)::int` })
      .from(profiles).where(gte(profiles.lastSeenAt, sevenDaysAgo)),
  ]);

  const byPlan: Record<string, number> = {};
  for (const row of planBreakdown) byPlan[row.plan] = row.count;

  const paid = (byPlan.starter ?? 0) + (byPlan.pro ?? 0) + (byPlan.team ?? 0) + (byPlan.lifetime ?? 0);

  return NextResponse.json({
    total: totals[0].count,
    paid,
    free: byPlan.free ?? 0,
    newToday: newToday[0].count,
    newThisWeek: newWeek[0].count,
    activeLast7d: active7d[0].count,
    byPlan,
  });
}
