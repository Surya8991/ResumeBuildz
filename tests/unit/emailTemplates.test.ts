import { describe, it, expect } from 'vitest';
import {
  welcomeEmail,
  verifyEmail,
  resetPasswordEmail,
  contactNotifyEmail,
  productUpdateEmail,
  resumeReminderEmail,
} from '@/lib/emails/templates';

describe('transactional templates', () => {
  it('welcomeEmail returns a subject and HTML document', () => {
    const { subject, html } = welcomeEmail('Ada Lovelace');
    expect(subject).toMatch(/welcome/i);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Hi Ada,'); // greets by first name
  });

  it('greets generically when no name is given', () => {
    expect(welcomeEmail('').html).toContain('Hi there,');
  });

  it('verify + reset embed the provided URL in a CTA', () => {
    expect(verifyEmail('https://x.test/v?token=abc').html).toContain('https://x.test/v?token=abc');
    expect(resetPasswordEmail('https://x.test/r?token=xyz').html).toContain('https://x.test/r?token=xyz');
  });

  it('transactional email has NO unsubscribe footer', () => {
    expect(welcomeEmail('Ada').html.toLowerCase()).not.toContain('unsubscribe');
    expect(resetPasswordEmail('https://x.test/r').html.toLowerCase()).not.toContain('unsubscribe');
  });

  it('contactNotifyEmail escapes user-supplied content', () => {
    const { html } = contactNotifyEmail({
      name: '<script>x</script>',
      email: 'a@b.com',
      subject: null,
      message: 'hello <b>world</b>',
    });
    expect(html).not.toContain('<script>x</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;b&gt;world&lt;/b&gt;');
  });
});

describe('marketing templates', () => {
  it('productUpdateEmail includes the unsubscribe link and CTA', () => {
    const { subject, html } = productUpdateEmail({
      name: 'Ada',
      heading: 'New templates shipped',
      bodyHtml: '<p>Check them out.</p>',
      cta: { label: 'See templates', url: 'https://resumebuildz.tech/templates' },
      unsubscribeUrl: 'https://resumebuildz.tech/api/email/unsubscribe?u=1&t=tok',
    });
    expect(subject).toBe('New templates shipped');
    expect(html.toLowerCase()).toContain('unsubscribe');
    expect(html).toContain('https://resumebuildz.tech/api/email/unsubscribe?u=1&amp;t=tok');
    expect(html).toContain('See templates');
  });

  it('resumeReminderEmail includes an unsubscribe link', () => {
    const { html } = resumeReminderEmail({
      name: 'Ada',
      unsubscribeUrl: 'https://resumebuildz.tech/api/email/unsubscribe?u=1&t=tok',
    });
    expect(html.toLowerCase()).toContain('unsubscribe');
  });
});
