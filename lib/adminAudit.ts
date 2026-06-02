import { db } from '@/lib/db';
import { auditLog } from '@/lib/db/schema';

export type AuditAction =
  | 'role.change'
  | 'plan.change'
  | 'managedBy.change'
  | 'user.delete'
  | 'user.impersonate'
  | 'broadcast.send';

// Fire-and-forget audit logger. Never throws — auditing must not block the
// caller. Errors are logged server-side so they're visible in Vercel logs.
export async function logAdminAction(
  actorUserId: string,
  action: AuditAction,
  targetUserId: string | null,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      actorUserId,
      action,
      targetUserId,
      metadata,
    });
  } catch (e) {
    console.error('[adminAudit] failed to write audit log entry', { action, e });
  }
}
