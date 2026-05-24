// Shareable read-only link encoding.
//
// Resume data is zipped-JSON and base64url-encoded into the URL fragment.
// The fragment is never sent to the server, so:
//   - No backend required
//   - No PII leaves the user's browser
//   - Recipients can view without signing up
//
// Tradeoff: URLs get long (~2-5kb). Most recipients paste into chat, which
// handles URL length fine. Email clients may truncate — we surface this to
// the user in the Share dialog.

import type { ResumeData } from '@/types/resume';

// Base64url: RFC 4648 §5, safe for URL fragments.
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice(0, (4 - (s.length % 4)) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/**
 * Upper bound for the share-link payload length (base64url characters).
 * Browsers and email clients vary wildly on URL length support:
 *   - Chromium: ~32KB effective cap
 *   - Firefox: ~64KB
 *   - Old Outlook / some SMS gateways: 2KB truncate silently
 * We clamp at 50_000 chars (~60KB URL total) so the decode side isn't fed
 * a truncated payload. Beyond that, the UI surfaces a friendly "too big,
 * use PDF export" error instead.
 */
export const MAX_SHARE_PAYLOAD_LENGTH = 50_000;

export class ShareLinkTooLargeError extends Error {
  constructor(public payloadLength: number) {
    super(`Resume is too large for a share link (${payloadLength} chars, max ${MAX_SHARE_PAYLOAD_LENGTH}). Export as PDF instead.`);
    this.name = 'ShareLinkTooLargeError';
  }
}

/**
 * Encode ResumeData into a URL-safe fragment. Uses CompressionStream when
 * available (all modern browsers) for ~70% size reduction.
 *
 * Throws {@link ShareLinkTooLargeError} if the encoded payload exceeds
 * {@link MAX_SHARE_PAYLOAD_LENGTH} characters.
 */
export async function encodeResume(data: ResumeData): Promise<string> {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);

  // Try gzip compression — cuts URL length roughly 3-4x.
  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Response(
        new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream('gzip')),
      );
      const compressed = new Uint8Array(await stream.arrayBuffer());
      const payload = 'g:' + base64UrlEncode(compressed);
      if (payload.length > MAX_SHARE_PAYLOAD_LENGTH) {
        throw new ShareLinkTooLargeError(payload.length);
      }
      return payload;
    } catch (err) {
      if (err instanceof ShareLinkTooLargeError) throw err;
      // Fall through to uncompressed.
    }
  }

  const payload = 'p:' + base64UrlEncode(bytes);
  if (payload.length > MAX_SHARE_PAYLOAD_LENGTH) {
    throw new ShareLinkTooLargeError(payload.length);
  }
  return payload;
}

export async function decodeResume(payload: string): Promise<ResumeData | null> {
  try {
    const [tag, body] = payload.split(':', 2);
    if (!tag || !body) return null;
    const bytes = base64UrlDecode(body);

    let json: string;
    if (tag === 'g') {
      if (typeof DecompressionStream === 'undefined') return null;
      const stream = new Response(
        new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip')),
      );
      json = await stream.text();
    } else if (tag === 'p') {
      json = new TextDecoder().decode(bytes);
    } else {
      return null;
    }

    // Reject prototype-pollution keys anywhere in the decoded payload — the
    // fragment is fully attacker-controlled. The reviver runs for every key.
    const parsed = JSON.parse(json, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') return undefined;
      return value;
    });
    if (!parsed?.personalInfo) return null;
    return parsed as ResumeData;
  } catch {
    return null;
  }
}

/**
 * Approximate the final shared URL length so the UI can warn the user
 * about clients that truncate (older Outlook, some SMS gateways).
 */
export function estimateUrlLength(base: string, payload: string): number {
  return base.length + '/r#'.length + payload.length;
}
