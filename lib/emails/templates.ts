// Every email the app sends, as pure builders returning { subject, html }.
// Transport is lib/email.ts -> sendEmail(); these never send, they only render.
//
// User-supplied values (names, messages, emails) are escaped here before being
// embedded in HTML. URLs produced by Better Auth are trusted but still escaped.

import { escapeHtml } from '@/lib/email';
import { renderEmail } from '@/lib/emails/layout';
import { SITE_URL } from '@/lib/siteConfig';

export interface RenderedEmail {
  subject: string;
  html: string;
}

const builderUrl = () => `${SITE_URL}/builder`;
const firstName = (name: string) => (name ? escapeHtml(name.trim().split(/\s+/)[0]) : '');
const greeting = (name: string) => (firstName(name) ? `Hi ${firstName(name)},` : 'Hi there,');

// ── Transactional: auth ──────────────────────────────────────────────────────

export function welcomeEmail(name: string): RenderedEmail {
  return {
    subject: 'Welcome to ResumeBuildz',
    html: renderEmail({
      heading: 'Welcome to ResumeBuildz',
      preheader: 'Build an ATS-ready resume in minutes.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(name)}</p>
        <p style="margin:0 0 20px;">Thanks for signing up. You're all set to build an ATS-ready resume in
        minutes &mdash; pick a template, drop in your experience, and let the AI tighten your bullet points.</p>`,
      cta: { label: 'Open the builder', url: builderUrl() },
      footerNote: "Need a hand? Just reply to this email and we'll help you out.",
    }),
  };
}

export function verifyEmail(url: string): RenderedEmail {
  return {
    subject: 'Verify your email for ResumeBuildz',
    html: renderEmail({
      heading: 'Confirm your email address',
      preheader: 'One quick click to verify your ResumeBuildz account.',
      bodyHtml: `<p style="margin:0 0 20px;">Confirm this email address to secure your ResumeBuildz
        account and unlock account recovery. This link expires in 1 hour.</p>`,
      cta: { label: 'Verify email', url },
      footerNote: "If you didn't create a ResumeBuildz account, you can safely ignore this email.",
    }),
  };
}

export function resetPasswordEmail(url: string): RenderedEmail {
  return {
    subject: 'Reset your ResumeBuildz password',
    html: renderEmail({
      heading: 'Reset your password',
      preheader: 'Reset your ResumeBuildz password.',
      bodyHtml: `<p style="margin:0 0 20px;">Click the button below to choose a new password.
        This link expires in 1 hour.</p>`,
      cta: { label: 'Reset password', url },
      footerNote: "Didn't request this? You can safely ignore this email — your password won't change.",
    }),
  };
}

export function passwordChangedEmail(name: string): RenderedEmail {
  return {
    subject: 'Your ResumeBuildz password was changed',
    html: renderEmail({
      heading: 'Your password was changed',
      preheader: 'Security notice for your ResumeBuildz account.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(name)}</p>
        <p style="margin:0 0 20px;">This is a confirmation that your ResumeBuildz password was just changed.</p>`,
      cta: { label: 'Go to your account', url: `${SITE_URL}/account` },
      footerNote: "If this wasn't you, reset your password immediately and contact support.",
    }),
  };
}

export function changeEmailConfirmEmail(opts: { newEmail: string; url: string }): RenderedEmail {
  return {
    subject: 'Approve your email change on ResumeBuildz',
    html: renderEmail({
      heading: 'Approve your email change',
      preheader: 'Confirm the new address for your ResumeBuildz account.',
      bodyHtml: `<p style="margin:0 0 20px;">A request was made to change your account email to
        <strong>${escapeHtml(opts.newEmail)}</strong>. Approve it with the button below.</p>`,
      cta: { label: 'Approve change', url: opts.url },
      footerNote: "If you didn't request this, do not click the button and reset your password.",
    }),
  };
}

export function accountDeletedEmail(name: string): RenderedEmail {
  return {
    subject: 'Your ResumeBuildz account was deleted',
    html: renderEmail({
      heading: 'Your account was deleted',
      preheader: 'Confirmation that your ResumeBuildz account was removed.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(name)}</p>
        <p style="margin:0 0 20px;">Your ResumeBuildz account and associated data have been permanently
        deleted. We're sorry to see you go &mdash; you're always welcome back.</p>`,
      cta: { label: 'Create a new account', url: `${SITE_URL}/login` },
      footerNote: "If you didn't request this deletion, contact us right away.",
    }),
  };
}

// ── Operator notification ────────────────────────────────────────────────────

export function contactNotifyEmail(m: {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}): RenderedEmail {
  return {
    subject: `[ResumeBuildz contact] ${m.subject || 'New message'}`,
    html: renderEmail({
      heading: 'New contact form submission',
      bodyHtml: `
        <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(m.name)}</p>
        <p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(m.email)}</p>
        <p style="margin:0 0 12px;"><strong>Subject:</strong> ${escapeHtml(m.subject || '(none)')}</p>
        <p style="margin:0 0 4px;"><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;word-break:break-word;background:#f6f7f9;padding:12px;border-radius:8px;margin:0;font-family:inherit;font-size:14px;">${escapeHtml(m.message)}</pre>`,
    }),
  };
}

// ── Marketing / lifecycle (require unsubscribeUrl) ───────────────────────────

export function productUpdateEmail(opts: {
  name: string;
  heading: string;
  /** Pre-sanitized HTML body for the announcement. */
  bodyHtml: string;
  cta?: { label: string; url: string };
  unsubscribeUrl: string;
}): RenderedEmail {
  return {
    subject: opts.heading,
    html: renderEmail({
      heading: opts.heading,
      preheader: opts.heading,
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(opts.name)}</p>${opts.bodyHtml}`,
      cta: opts.cta,
      unsubscribeUrl: opts.unsubscribeUrl,
    }),
  };
}

export function resumeReminderEmail(opts: { name: string; unsubscribeUrl: string }): RenderedEmail {
  return {
    subject: 'Your resume is waiting on ResumeBuildz',
    html: renderEmail({
      heading: 'Pick up where you left off',
      preheader: 'Your ATS-ready resume is a few clicks away.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(opts.name)}</p>
        <p style="margin:0 0 20px;">You signed up but haven't built a resume yet. It only takes a few
        minutes &mdash; choose a template and let the AI do the heavy lifting on your bullet points.</p>`,
      cta: { label: 'Build my resume', url: builderUrl() },
      unsubscribeUrl: opts.unsubscribeUrl,
    }),
  };
}
