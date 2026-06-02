import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auditLog, user } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';

export async function GET() {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const targetUser = alias(user, 'target_user');

  const rows = await db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      createdAt: auditLog.createdAt,
      metadata: auditLog.metadata,
      actorEmail: user.email,
      actorName: user.name,
      targetUserId: auditLog.targetUserId,
      targetEmail: targetUser.email,
    })
    .from(auditLog)
    .leftJoin(user, eq(user.id, auditLog.actorUserId))
    .leftJoin(targetUser, eq(targetUser.id, auditLog.targetUserId))
    .orderBy(desc(auditLog.createdAt))
    .limit(50);

  return NextResponse.json({ entries: rows });
}
