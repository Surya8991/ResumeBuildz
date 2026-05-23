import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { resumes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// GET /api/cloud-sync — pull latest resume from DB
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ data: null, updated_at: null });

  const [row] = await db
    .select({ data: resumes.data, updatedAt: resumes.updatedAt })
    .from(resumes)
    .where(eq(resumes.userId, user.id))
    .limit(1);

  return NextResponse.json(row ?? { data: null, updatedAt: null });
}

// POST /api/cloud-sync — upsert resume to DB
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  await db
    .insert(resumes)
    .values({ userId: user.id, data: body.data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: resumes.userId,
      set: { data: body.data, updatedAt: new Date() },
    });

  return NextResponse.json({ ok: true });
}
