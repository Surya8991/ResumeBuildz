import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminSession, isAdminResponse } from '@/lib/adminAuth';
import { sendEmail } from '@/lib/email';
import { rolePromotedEmail, planChangedEmail } from '@/lib/emails/templates';

type Params = { params: Promise<{ userId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const { userId } = await params;

  const [row] = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      plan: profiles.plan,
      role: profiles.role,
      managedBy: profiles.managedBy,
      lastSeenAt: profiles.lastSeenAt,
      aiRewritesUsed: profiles.aiRewritesUsed,
      aiRewritesResetDate: profiles.aiRewritesResetDate,
      pdfExportsUsed: profiles.pdfExportsUsed,
      pdfExportsResetDate: profiles.pdfExportsResetDate,
    })
    .from(user)
    .innerJoin(profiles, eq(profiles.id, user.id))
    .where(eq(user.id, userId))
    .limit(1);

  if (!row) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Admin can only access their managed users.
  if (adminSession.role === 'admin' && row.managedBy !== adminSession.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(row);
}

const VALID_PLANS = ['free', 'starter', 'pro', 'team', 'lifetime'] as const;
const VALID_ROLES = ['user', 'admin', 'superadmin'] as const;

export async function PATCH(req: NextRequest, { params }: Params) {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const { userId } = await params;

  // Fetch target to check scope and get contact info for post-update notifications.
  const [target] = await db
    .select({ managedBy: profiles.managedBy, role: profiles.role, email: user.email, name: user.name })
    .from(profiles)
    .innerJoin(user, eq(user.id, profiles.id))
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (adminSession.role === 'admin' && target.managedBy !== adminSession.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { role?: unknown; plan?: unknown; managedBy?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};

  if ('plan' in body) {
    if (!VALID_PLANS.includes(body.plan as (typeof VALID_PLANS)[number])) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    patch.plan = body.plan;
  }

  if ('role' in body) {
    // Only superadmin may change roles.
    if (adminSession.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden: role changes require superadmin' }, { status: 403 });
    }
    if (!VALID_ROLES.includes(body.role as (typeof VALID_ROLES)[number])) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    patch.role = body.role;
  }

  if ('managedBy' in body) {
    if (adminSession.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden: managedBy changes require superadmin' }, { status: 403 });
    }
    patch.managedBy = body.managedBy ?? null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  await db.update(profiles).set(patch).where(eq(profiles.id, userId));

  // Transactional notifications — best-effort, never block the response.
  const notifyEmail = target.email;
  const notifyName = target.name ?? '';
  if ('role' in patch && patch.role === 'admin') {
    const { subject, html } = rolePromotedEmail({ name: notifyName });
    sendEmail({ to: notifyEmail, subject, html }).catch(() => {});
  }
  if ('plan' in patch && typeof patch.plan === 'string') {
    const { subject, html } = planChangedEmail({ name: notifyName, plan: patch.plan });
    sendEmail({ to: notifyEmail, subject, html }).catch(() => {});
  }

  return NextResponse.json({ updated: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const adminSession = await requireAdminSession('superadmin');
  if (isAdminResponse(adminSession)) return adminSession;

  const { userId } = await params;

  if (userId === adminSession.userId) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const [target] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (target.role === 'superadmin') {
    return NextResponse.json({ error: 'Cannot delete a superadmin account' }, { status: 403 });
  }

  await db.delete(user).where(eq(user.id, userId));

  return NextResponse.json({ deleted: true });
}
