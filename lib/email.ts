// Thin wrapper around Resend's REST API.
//
// Every email feature in the app is OPTIONAL: when RESEND_API_KEY is unset
// `sendEmail` resolves to `false` instead of throwing, so callers degrade
// gracefully (the UI falls back to "copy link" / DB-only storage). Never let
// an email failure break the request that triggered it.

const DEFAULT_FROM = 'ResumeBuildz <noreply@resumebuildz.tech>';

/** True when email sending is configured. Use to skip work or adjust UX. */
export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  /** Defaults to SHARE_INVITE_FROM / WELCOME_FROM env, then a noreply address. */
  from?: string;
  /** Sets Reply-To so operators can answer the original sender directly. */
  replyTo?: string;
  /** Extra SMTP headers (e.g. List-Unsubscribe for marketing mail). */
  headers?: Record<string, string>;
}

/**
 * Send an email via Resend. Returns true on success, false if email is not
 * configured or the send failed. Never throws.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  const from =
    opts.from ||
    process.env.SHARE_INVITE_FROM ||
    process.env.WELCOME_FROM ||
    DEFAULT_FROM;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        ...(opts.headers ? { headers: opts.headers } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Escape user-supplied text before interpolating it into an HTML email body.
 * Prevents HTML/markup injection in emails we send on a user's behalf.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
