import { describe, it, expect } from 'vitest';
import { escapeHtml, emailEnabled } from '@/lib/email';

describe('escapeHtml', () => {
  it('escapes all five HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x" o='y'>&`)).toBe(
      '&lt;a href=&quot;x&quot; o=&#39;y&#39;&gt;&amp;',
    );
  });

  it('escapes & first so existing entities are not double-broken oddly', () => {
    expect(escapeHtml('a & <b>')).toBe('a &amp; &lt;b&gt;');
  });

  it('leaves plain text untouched', () => {
    expect(escapeHtml('Just a normal name')).toBe('Just a normal name');
  });

  it('neutralizes a script-tag injection attempt', () => {
    const out = escapeHtml('<script>alert(1)</script>');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
  });
});

describe('emailEnabled', () => {
  it('reflects presence of RESEND_API_KEY', () => {
    const prev = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    expect(emailEnabled()).toBe(false);
    process.env.RESEND_API_KEY = 're_test';
    expect(emailEnabled()).toBe(true);
    if (prev === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = prev;
  });
});
