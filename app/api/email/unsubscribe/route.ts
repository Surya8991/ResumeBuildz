// One-click unsubscribe from product-update email.
//
// Linked from marketing email footers. GET so it works from any mail client.
// Verifies the HMAC token (no auth/session needed) and flips notifyProduct off.
// Always returns a friendly HTML page rather than JSON.

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyUnsubscribeToken } from '@/lib/emailTokens';

export const dynamic = 'force-dynamic';

function page(title: string, message: string, status: number): Response {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
  <body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f7f9;color:#111827;">
    <div style="max-width:480px;margin:80px auto;background:#fff;border-radius:12px;padding:36px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <h1 style="font-size:20px;margin:0 0 8px;">${title}</h1>
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0;">${message}</p>
    </div>
  </body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get('u') ?? '';
  const t = req.nextUrl.searchParams.get('t') ?? '';

  if (!verifyUnsubscribeToken(u, t)) {
    return page('Invalid link', 'This unsubscribe link is invalid or has expired.', 400);
  }

  try {
    await db.update(profiles).set({ notifyProduct: false }).where(eq(profiles.id, u));
  } catch {
    return page('Something went wrong', 'We could not update your preferences. Please try again later.', 500);
  }

  return page(
    'You have been unsubscribed',
    "You'll no longer receive product-update emails. You can re-enable them anytime in your account settings.",
    200,
  );
}
