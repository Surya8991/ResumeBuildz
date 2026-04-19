// Supabase Edge Function: send-welcome
//
// Fires once per user, right after they confirm their email address.
// Called by a Postgres trigger on `auth.users` (see
// supabase/sql/welcome_email_trigger.sql) via pg_net.
//
// Deploy with:
//   supabase functions deploy send-welcome --no-verify-jwt
//
// The function is --no-verify-jwt because the caller is Postgres, not a
// logged-in user. Instead we gate on a shared secret in the Authorization
// header that only the database and this function know.
//
// REQUIRED SECRETS (set on the function, not the app):
//   RESEND_API_KEY         - Resend sending API key (re_...)
//   WELCOME_HOOK_SECRET    - random string, also stored in DB as app setting
//   WELCOME_FROM           - e.g. "ResumeBuildz <noreply@resumebuildz.tech>"
//
// Request body (sent by the Postgres trigger):
//   { "email": "user@example.com", "name": "Jane" | null }

// @ts-expect-error - Deno runtime import, only resolves at deploy time
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

// @ts-expect-error - Deno global, not Node
declare const Deno: { env: { get(k: string): string | undefined } };

const WELCOME_SUBJECT = "Welcome to ResumeBuildz, let's build your resume";

function welcomeHtml(name: string | null): string {
  const greeting = name ? `Welcome to ResumeBuildz, ${escapeHtml(name)}` : 'Welcome to ResumeBuildz';
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:32px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr><td>
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f172a;">${greeting}</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
              Your account is ready. ResumeBuildz helps you craft clean, ATS-ready resumes in minutes, no formatting headaches, no Word docs to wrestle with.
            </p>
            <a href="https://resumebuildz.tech/builder" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;font-size:15px;">Start building</a>

            <h2 style="margin:36px 0 12px;font-size:16px;font-weight:700;color:#0f172a;">Get started in 3 steps</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#0f172a;">1. Pick a template</strong><br><span style="font-size:14px;color:#6b7280;">Choose from recruiter-tested layouts built for ATS parsing.</span></td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#0f172a;">2. Fill in your details</strong><br><span style="font-size:14px;color:#6b7280;">Auto-save as you type. Import from LinkedIn or an existing resume.</span></td></tr>
              <tr><td style="padding:10px 0;"><strong style="color:#0f172a;">3. Export and apply</strong><br><span style="font-size:14px;color:#6b7280;">Download a pixel-perfect PDF ready for any job portal.</span></td></tr>
            </table>

            <h2 style="margin:32px 0 8px;font-size:16px;font-weight:700;color:#0f172a;">Helpful links</h2>
            <p style="margin:0;font-size:14px;line-height:1.8;color:#374151;">
              <a href="https://resumebuildz.tech/templates" style="color:#2563eb;text-decoration:none;">Browse templates</a><br>
              <a href="https://resumebuildz.tech/blog" style="color:#2563eb;text-decoration:none;">Resume writing guides</a><br>
              <a href="https://resumebuildz.tech/pricing" style="color:#2563eb;text-decoration:none;">Pricing and plans</a>
            </p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">Questions? Just reply to this email. We read every message.</p>
            <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Happy building,<br>The ResumeBuildz team</p>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">ResumeBuildz &middot; <a href="https://resumebuildz.tech" style="color:#9ca3af;text-decoration:none;">resumebuildz.tech</a></p>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

serve(async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  const hookSecret = Deno.env.get('WELCOME_HOOK_SECRET');
  const from = Deno.env.get('WELCOME_FROM') ?? 'ResumeBuildz <noreply@resumebuildz.tech>';

  if (!resendKey || !hookSecret) {
    return json({ error: 'Function environment not configured' }, 500);
  }

  // Shared-secret auth. The Postgres trigger sends this header.
  const auth = req.headers.get('Authorization') ?? '';
  if (auth !== `Bearer ${hookSecret}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { email?: string; name?: string | null };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const email = body.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email' }, 400);
  }
  const name = body.name?.trim() || null;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: WELCOME_SUBJECT,
      html: welcomeHtml(name),
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    return json({ error: 'Resend failed', detail }, 502);
  }

  return json({ success: true });
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
