// Avatar uploads to Cloudflare R2 (or any S3-compatible store).

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadToR2 } from '@/lib/storage';
import { detectImageKind, type ImageKind } from '@/lib/imageMagic';
import { headers } from 'next/headers';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
// Allowed image kinds, mapped to a safe extension + content type that we
// control (never derived from the client-supplied filename or MIME).
const KIND_META: Partial<Record<ImageKind, { ext: string; contentType: string }>> = {
  jpeg: { ext: 'jpg', contentType: 'image/jpeg' },
  png: { ext: 'png', contentType: 'image/png' },
  webp: { ext: 'webp', contentType: 'image/webp' },
};

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Max file size is 2 MB' }, { status: 400 });
  }

  // Validate by actual file bytes, not the client-supplied MIME/extension
  // (both are spoofable — an attacker could upload HTML/SVG as image/png).
  const kind = await detectImageKind(file);
  const meta = kind ? KIND_META[kind] : undefined;
  if (!meta) {
    return NextResponse.json({ error: 'Only JPG, PNG, or WebP allowed' }, { status: 400 });
  }

  // Key + content type are derived from validated server-side values, never
  // from file.name (which could contain path traversal or a dangerous ext).
  const key = `avatars/${session.user.id}/avatar-${Date.now()}.${meta.ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadToR2(key, buffer, meta.contentType);

  // Persist the new avatar URL to the user record (Better Auth's `image` field).
  await db.update(user).set({ image: url }).where(eq(user.id, session.user.id));

  return NextResponse.json({ url });
}
