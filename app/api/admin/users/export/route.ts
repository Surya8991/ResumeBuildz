import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';

export async function GET() {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const rows = await db
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
    .orderBy(desc(user.createdAt))
    .limit(10000);

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;

  const header = 'id,email,name,plan,role,createdAt,lastSeenAt\n';
  const body = rows
    .map((r) =>
      [
        escape(r.id),
        escape(r.email),
        escape(r.name ?? ''),
        r.plan,
        r.role,
        r.createdAt?.toISOString() ?? '',
        r.lastSeenAt?.toISOString() ?? '',
      ].join(','),
    )
    .join('\n');

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(header + body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="users-${date}.csv"`,
    },
  });
}
