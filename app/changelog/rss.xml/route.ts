import { CHANGELOG } from '@/lib/changelogData';
import { SITE_URL } from '@/lib/siteConfig';

export const dynamic = 'force-static';

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00Z').toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

export async function GET() {
  const items = CHANGELOG.slice(0, 20).map((entry) => {
    const body = [
      ...(entry.added.length > 0 ? ['<strong>Added</strong>', '<ul>', ...entry.added.map((i) => `<li>${escape(i)}</li>`), '</ul>'] : []),
      ...(entry.improved.length > 0 ? ['<strong>Improved</strong>', '<ul>', ...entry.improved.map((i) => `<li>${escape(i)}</li>`), '</ul>'] : []),
    ].join('');
    const link = `${SITE_URL}/changelog#${entry.version}`;
    const pubDate = toRfc822(entry.isoDate || '2026-01-01');
    return `
    <item>
      <title>${escape(entry.version)} — ${escape(entry.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">resumebuildz-${escape(entry.version)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${body}]]></description>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ResumeBuildz Changelog</title>
    <link>${SITE_URL}/changelog</link>
    <atom:link href="${SITE_URL}/changelog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Version history, new features, fixes, and improvements for ResumeBuildz.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
