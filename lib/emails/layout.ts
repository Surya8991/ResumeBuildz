// Shared branded HTML layout for every transactional + marketing email.
//
// Callers pass already-safe HTML for `bodyHtml`/`footerNote` (escape any
// user-supplied substrings with escapeHtml from lib/email before interpolating).
// When `unsubscribeUrl` is set, a CAN-SPAM-style unsubscribe footer is rendered —
// always pass it for marketing/product-update mail, never for transactional mail.

import { escapeHtml } from '@/lib/email';
import { SITE_URL } from '@/lib/siteConfig';

export interface EmailLayoutOptions {
  heading: string;
  /** Pre-sanitized HTML for the email body. */
  bodyHtml: string;
  cta?: { label: string; url: string };
  /** Pre-sanitized HTML shown in small print under the body. */
  footerNote?: string;
  /** When set, renders an unsubscribe link in the footer (marketing email). */
  unsubscribeUrl?: string;
  /** Hidden preheader text shown in inbox previews. */
  preheader?: string;
}

const BRAND = 'ResumeBuildz';
const ACCENT = '#2563eb';

export function renderEmail(opts: EmailLayoutOptions): string {
  const { heading, bodyHtml, cta, footerNote, unsubscribeUrl, preheader } = opts;

  const ctaHtml = cta
    ? `<a href="${escapeHtml(cta.url)}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:15px;margin-top:8px;">${escapeHtml(cta.label)}</a>`
    : '';

  const footerNoteHtml = footerNote
    ? `<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#6b7280;">${footerNote}</p>`
    : '';

  const unsubscribeHtml = unsubscribeUrl
    ? `<p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#9ca3af;">
         You're receiving product updates from ${BRAND}.
         <a href="${escapeHtml(unsubscribeUrl)}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a>.
       </p>`
    : '';

  const preheaderHtml = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>`
    : '';

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
    ${preheaderHtml}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:32px 0;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:36px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr><td>
            <p style="margin:0 0 20px;font-size:18px;font-weight:800;color:${ACCENT};letter-spacing:-0.02em;">${BRAND}</p>
            <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0f172a;">${escapeHtml(heading)}</h1>
            <div style="font-size:15px;line-height:1.6;color:#374151;">${bodyHtml}</div>
            ${ctaHtml}
            ${footerNoteHtml}
          </td></tr>
        </table>
        <table width="560" cellpadding="0" cellspacing="0" style="padding:16px 36px 0;">
          <tr><td style="text-align:center;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
              <a href="${escapeHtml(SITE_URL)}" style="color:#9ca3af;text-decoration:none;">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ''))}</a>
            </p>
            ${unsubscribeHtml}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
