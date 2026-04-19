// Typed wrapper around Vercel Web Analytics' track() so every event name is
// spelled the same way everywhere. Using a union type for the name field
// means calling `track('signup_succeded')` (typo) is a compile error.
//
// Vercel Analytics is always imported — in development it logs to the
// console instead of hitting the network, and without an active analytics
// subscription the beacon silently no-ops in production too. That means
// calling track() is safe everywhere with no runtime cost guard.

import { track as vercelTrack } from '@vercel/analytics';

export type AnalyticsEvent =
  | 'signup_submit'
  | 'signup_success'
  | 'login_success'
  | 'resume_exported'
  | 'ai_rewrite_used'
  | 'upgrade_modal_opened';

type EventProps = {
  signup_submit: { method: 'email' | 'google' };
  signup_success: { method: 'email' | 'google' };
  login_success: { method: 'email' | 'google' };
  resume_exported: { format: 'pdf' | 'docx' | 'html' | 'markdown'; template?: string };
  ai_rewrite_used: { section?: string; remaining?: number };
  upgrade_modal_opened: { feature: 'ai' | 'pdf'; source?: string };
};

export function track<E extends AnalyticsEvent>(event: E, props?: EventProps[E]): void {
  try {
    vercelTrack(event, props as Record<string, string | number | boolean | null>);
  } catch {
    // Never let analytics failure break a user action.
  }
}
