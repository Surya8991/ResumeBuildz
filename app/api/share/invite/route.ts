import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientId } from '@/lib/rateLimit';
import { SITE_URL } from '@/lib/siteConfig';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MODES = new Set(['view', 'copy']);

type InviteBody = {
  email?: string;
  mode?: string;
  url?: string;
  resumeName?: string;
};

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin) {
    return NextResponse.json({ emailSent: false, error: 'Missing Origin header' }, { status: 403 });
  }

  let reqOrigin: string;
  try {
    reqOrigin = new URL(origin).origin;
    const siteOrigin = new URL(SITE_URL).origin;
    const devOk = process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(reqOrigin);
    if (reqOrigin !== siteOrigin && !devOk) {
      return NextResponse.json({ emailSent: false, error: 'Cross-origin requests not allowed' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ emailSent: false, error: 'Invalid Origin' }, { status: 403 });
  }

  const rl = rateLimit(`share-invite:${clientId(req)}`, 10, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { emailSent: false, error: `Rate limited. Try again in ${rl.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    );
  }

  let body: InviteBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ emailSent: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() || '';
  const mode = body.mode || '';
  const inviteUrl = body.url || '';
  const resumeName = (body.resumeName || 'shared resume').trim().slice(0, 120);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ emailSent: false, error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (!MODES.has(mode)) {
    return NextResponse.json({ emailSent: false, error: 'Invalid invite mode.' }, { status: 400 });
  }

  let parsedInviteUrl: URL;
  try {
    parsedInviteUrl = new URL(inviteUrl);
  } catch {
    return NextResponse.json({ emailSent: false, error: 'Invalid invite link.' }, { status: 400 });
  }

  const siteOrigin = new URL(SITE_URL).origin;
  if (parsedInviteUrl.origin !== reqOrigin && parsedInviteUrl.origin !== siteOrigin) {
    return NextResponse.json({ emailSent: false, error: 'Invite link origin is not allowed.' }, { status: 400 });
  }
  if (parsedInviteUrl.pathname !== '/r' || !parsedInviteUrl.hash) {
    return NextResponse.json({ emailSent: false, error: 'Invite link must be a ResumeBuildz share link.' }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.SHARE_INVITE_FROM || process.env.WELCOME_FROM || 'ResumeBuildz <noreply@resumebuildz.tech>';
  if (!resendKey) {
    return NextResponse.json({ emailSent: false, error: 'Email is not configured. Copy the invite link instead.' });
  }

  const canCopy = mode === 'copy';
  const subject = canCopy
    ? `${resumeName} was shared with copy access`
    : `${resumeName} was shared with you`;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      html: inviteHtml({ resumeName, inviteUrl, canCopy }),
    }),
  });

  if (!resendRes.ok) {
    return NextResponse.json({ emailSent: false, error: 'Email failed. Copy the invite link instead.' });
  }

  return NextResponse.json({ emailSent: true });
}

function inviteHtml({ resumeName, inviteUrl, canCopy }: { resumeName: string; inviteUrl: string; canCopy: boolean }) {
  const escapedName = escapeHtml(resumeName);
  const escapedUrl = escapeHtml(inviteUrl);
  const access = canCopy
    ? 'You can view this resume and copy it into your own ResumeBuildz builder to edit your own duplicate.'
    : 'You can view this resume in read-only mode.';

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:32px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:36px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr><td>
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Resume shared with you</h1>
            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151;">
              ${escapedName} was shared from ResumeBuildz. ${escapeHtml(access)}
            </p>
            <a href="${escapedUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:15px;">Open resume</a>
            <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#6b7280;">
              If the button does not work, copy and paste this link:<br>
              <span style="word-break:break-all;color:#374151;">${escapedUrl}</span>
            </p>
          </td></tr>
        </table>
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
