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

export function inactiveWarningEmail(opts: { name: string; deleteDate: string }): RenderedEmail {
  return {
    subject: 'Your ResumeBuildz account will be deleted soon',
    html: renderEmail({
      heading: 'Your account is scheduled for deletion',
      preheader: 'Log in to keep your ResumeBuildz account.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(opts.name)}</p>
        <p style="margin:0 0 20px;">We haven't seen you on ResumeBuildz in over 6 months, so your account
        is scheduled for deletion on <strong>${escapeHtml(opts.deleteDate)}</strong>. Just log in before
        then and we'll keep your account exactly as it is &mdash; no other action needed.</p>`,
      cta: { label: 'Log in to keep my account', url: `${SITE_URL}/login` },
      footerNote: 'After deletion your account data is removed permanently. (Your resume lives only in your browser and is unaffected.)',
    }),
  };
}

export function inactiveDeletedEmail(name: string): RenderedEmail {
  return {
    subject: 'Your ResumeBuildz account was deleted (inactivity)',
    html: renderEmail({
      heading: 'Your account was deleted',
      preheader: 'Your inactive ResumeBuildz account was removed.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(name)}</p>
        <p style="margin:0 0 20px;">Because your account was inactive for more than 6 months, we've
        removed it and its data, as we warned. You're always welcome back &mdash; you can create a fresh
        account anytime.</p>`,
      cta: { label: 'Create a new account', url: `${SITE_URL}/login` },
      footerNote: 'This was an automated cleanup of inactive accounts.',
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

// ── Admin-triggered transactional ───────────────────────────────────────────

export function rolePromotedEmail(opts: { name: string }): RenderedEmail {
  return {
    subject: 'Your ResumeBuildz account has been upgraded',
    html: renderEmail({
      heading: 'Your account has been upgraded',
      preheader: 'You now have admin access on ResumeBuildz.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(opts.name)}</p>
        <p style="margin:0 0 20px;">Your account has been granted admin access on ResumeBuildz.
        You can now manage user accounts and access the admin dashboard.</p>`,
      cta: { label: 'Go to admin dashboard', url: `${SITE_URL}/admin` },
      footerNote: "If you think this was a mistake, contact support right away.",
    }),
  };
}

export function planChangedEmail(opts: { name: string; plan: string }): RenderedEmail {
  const planLabel = escapeHtml(opts.plan.charAt(0).toUpperCase() + opts.plan.slice(1));
  return {
    subject: 'Your ResumeBuildz plan has been updated',
    html: renderEmail({
      heading: 'Your plan has been updated',
      preheader: `You are now on the ${planLabel} plan.`,
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(opts.name)}</p>
        <p style="margin:0 0 20px;">Your ResumeBuildz plan has been changed to
        <strong>${planLabel}</strong> by your account administrator.
        Your new features are active immediately.</p>`,
      cta: { label: 'Open the builder', url: `${SITE_URL}/builder` },
      footerNote: "Questions? Contact support and we'll sort it out.",
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
    subject: 'Ready to build your resume on ResumeBuildz?',
    html: renderEmail({
      heading: 'Ready to build your resume?',
      preheader: 'Your ATS-ready resume is a few clicks away.',
      bodyHtml: `<p style="margin:0 0 12px;">${greeting(opts.name)}</p>
        <p style="margin:0 0 20px;">Thanks for signing up! Whenever you're ready, building an ATS-ready
        resume only takes a few minutes &mdash; choose a template and let the AI do the heavy lifting on
        your bullet points. Everything stays private in your browser.</p>`,
      cta: { label: 'Build my resume', url: builderUrl() },
      unsubscribeUrl: opts.unsubscribeUrl,
    }),
  };
}
