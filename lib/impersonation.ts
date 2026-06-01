import { createHmac } from 'crypto';

const COOKIE_NAME = 'x-impersonate';
const EMAIL_COOKIE = 'x-imp-email';
const MAX_AGE = 60 * 60 * 2; // 2 hours

function secret(): string {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s) throw new Error('BETTER_AUTH_SECRET not set');
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

function encode(adminId: string, targetUserId: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ adminId, targetUserId, exp })).toString('base64url');
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function decode(token: string): { adminId: string; targetUserId: string } | null {
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (sign(payload) !== sig) return null;
  try {
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof obj.exp !== 'number' || Date.now() / 1000 > obj.exp) return null;
    return { adminId: obj.adminId, targetUserId: obj.targetUserId };
  } catch {
    return null;
  }
}

export function buildImpersonateCookie(adminId: string, targetUserId: string): string {
  const val = encode(adminId, targetUserId);
  return `${COOKIE_NAME}=${val}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function buildImpEmailCookie(email: string): string {
  const safe = encodeURIComponent(email);
  return `${EMAIL_COOKIE}=${safe}; Path=/; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

// Call this in any API route that should switch context to the impersonated user
// (e.g. if a server-side session switch is ever added). Currently resumes are
// localStorage-only so no server route needs to read the target user's data.
export function verifyImpersonation(cookieHeader: string): { adminId: string; targetUserId: string } | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  return decode(match[1]);
}

export function clearImpersonationCookies(): string[] {
  return [
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`,
    `${EMAIL_COOKIE}=; Path=/; SameSite=Strict; Max-Age=0`,
  ];
}
