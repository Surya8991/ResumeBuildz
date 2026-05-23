// Normalized auth error codes.
//
// Raw error messages from the auth provider should never be reflected into
// URL query params or rendered as-is to users:
//   - They can leak implementation details (e.g. "Email rate limit exceeded").
//   - A future auth provider release could produce scary-looking messages
//     that weaken user trust.
//   - URL-reflected raw text can be used for mild phishing ("your session was
//     compromised, enter your password again").
//
// All auth entry points (callback route, login page, forgot-password) should
// convert raw errors to one of these codes, then render a friendly string.

export type AuthErrorCode =
  | 'auth_failed'
  | 'code_expired'
  | 'code_exchange_failed'
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'rate_limited'
  | 'network_error'
  | 'unknown';

export function classifyAuthError(err: unknown): AuthErrorCode {
  const msg = (err instanceof Error ? err.message : typeof err === 'string' ? err : '').toLowerCase();
  if (!msg) return 'unknown';
  if (msg.includes('expired')) return 'code_expired';
  if (msg.includes('rate limit')) return 'rate_limited';
  if (msg.includes('email not confirmed') || msg.includes('not_confirmed')) return 'email_not_confirmed';
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('invalid_grant')) {
    return 'invalid_credentials';
  }
  if (msg.includes('network') || msg.includes('fetch')) return 'network_error';
  if (msg.includes('exchange')) return 'code_exchange_failed';
  return 'auth_failed';
}

const LABELS: Record<AuthErrorCode, string> = {
  auth_failed: 'Sign-in failed. Please try again.',
  code_expired: 'Sign-in link expired. Request a new one.',
  code_exchange_failed: 'Sign-in link is no longer valid.',
  invalid_credentials: 'Incorrect email or password.',
  email_not_confirmed: 'Check your email to confirm your address first.',
  rate_limited: 'Too many attempts. Please wait a minute and try again.',
  network_error: 'Network error. Check your connection and retry.',
  unknown: 'Something went wrong. Please try again.',
};

export function authErrorLabel(code: string | null | undefined): string {
  if (!code) return LABELS.unknown;
  return LABELS[code as AuthErrorCode] ?? LABELS.unknown;
}
