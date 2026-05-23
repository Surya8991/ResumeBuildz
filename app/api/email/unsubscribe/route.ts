// Unsubscribe from product-update email.
//
// Two-step by design so email link-prefetchers / security scanners (Outlook
// SafeLinks, corporate gateways, antivirus) that auto-follow GET links cannot
// silently unsubscribe a user:
//   GET  -> renders a confirmation page with a one-click button (NO mutation)
//   POST -> verifies the HMAC token and flips notifyProduct off (the mutation)
//
// The POST handler also satisfies RFC 8058 one-click unsubscribe, so the
// List-Unsubscribe-Post header on marketing mail unsubscribes without the
// confirmation page when the mail client supports it.

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyUnsubscribeToken } from '@/lib/emailTokens';
import { escapeHtml } from '@/lib/email';

export const dynamic = 'force-dynamic';

function page(title: string, message: string, status: number, bodyExtra = ''): Response {
  const h = (s: string) => escapeHtml(s);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${h(title)}</title></head>
  <body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f7f9;color:#111827;">
    <div style="max-width:480px;margin:80px auto;background:#fff;border-radius:12px;padding:36px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <h1 style="font-size:20px;margin:0 0 8px;">${h(title)}</h1>
      <p style="font-size:15px;color:#374151;line-height:1.6;margin:0;">${h(message)}</p>
      ${bodyExtra}
    </div>
  </body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// GET — confirmation page only. Never mutates (safe for link prefetchers).
export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get('u') ?? '';
  const t = req.nextUrl.searchParams.get('t') ?? '';

  if (!verifyUnsubscribeToken(u, t)) {
    return page('Invalid link', 'This unsubscribe link is invalid or has expired.', 400);
  }

  const form = `<form method="POST" style="margin-top:20px;">
      <input type="hidden" name="u" value="${escapeHtml(u)}">
      <input type="hidden" name="t" value="${escapeHtml(t)}">
      <button type="submit" style="background:#2563eb;color:#fff;border:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:15px;cursor:pointer;">Unsubscribe</button>
    </form>`;
  return page('Unsubscribe from product updates?', 'Click the button to stop receiving product-update emails.', 200, form);
}

// POST — performs the unsubscribe (form submit or RFC 8058 one-click).
export async function POST(req: NextRequest) {
  let u = req.nextUrl.searchParams.get('u') ?? '';
  let t = req.nextUrl.searchParams.get('t') ?? '';

  // Form posts (and one-click clients) send the params in the body.
  if (!u || !t) {
    try {
      const form = await req.formData();
      u = u || String(form.get('u') ?? '');
      t = t || String(form.get('t') ?? '');
    } catch {
      /* no form body — fall through to token check */
    }
  }

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
