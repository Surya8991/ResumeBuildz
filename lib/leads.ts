// Lead capture — backed by API routes.

const WAITLIST_LOCAL_KEY = 'resumeforge-waitlist';
const CONTACT_LOCAL_KEY = 'resumeforge-contact-pending';

export interface WaitlistResult {
  ok: boolean;
  mode: 'api' | 'local';
  error?: string;
}

export async function joinWaitlist(email: string, source = 'pricing'): Promise<WaitlistResult> {
  const clean = email.trim().toLowerCase();
  if (!clean) return { ok: false, mode: 'local', error: 'Email is required.' };

  try {
    const existing = JSON.parse(localStorage.getItem(WAITLIST_LOCAL_KEY) || '[]') as string[];
    if (!existing.includes(clean)) {
      existing.push(clean);
      localStorage.setItem(WAITLIST_LOCAL_KEY, JSON.stringify(existing));
    }
  } catch {
    // ignore
  }

  try {
    const res = await fetch('/api/leads/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean, source }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (/duplicate|unique/i.test(body.error ?? '')) return { ok: true, mode: 'api' };
      return { ok: false, mode: 'api', error: body.error ?? 'Network error' };
    }
    return { ok: true, mode: 'api' };
  } catch (e) {
    return { ok: true, mode: 'local', error: e instanceof Error ? e.message : 'Network error' };
  }
}

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResult {
  ok: boolean;
  mode: 'api' | 'local';
  error?: string;
}

const LIMITS = { name: 100, email: 254, subject: 100, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactMessage(payload: ContactPayload): Promise<ContactResult> {
  const trimmed: ContactPayload = {
    name: payload.name.trim().slice(0, LIMITS.name),
    email: payload.email.trim().toLowerCase().slice(0, LIMITS.email),
    subject: payload.subject?.trim().slice(0, LIMITS.subject) || undefined,
    message: payload.message.trim().slice(0, LIMITS.message),
  };

  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return { ok: false, mode: 'local', error: 'Name, email, and message are required.' };
  }
  if (!EMAIL_RE.test(trimmed.email)) {
    return { ok: false, mode: 'local', error: 'Please enter a valid email address.' };
  }
  if (trimmed.message.length < 10) {
    return { ok: false, mode: 'local', error: 'Please provide a few words so we can help.' };
  }

  try {
    const existing = JSON.parse(localStorage.getItem(CONTACT_LOCAL_KEY) || '[]') as ContactPayload[];
    existing.push(trimmed);
    localStorage.setItem(CONTACT_LOCAL_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }

  try {
    const res = await fetch('/api/leads/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trimmed),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, mode: 'api', error: body.error ?? 'Network error' };
    }
    return { ok: true, mode: 'api' };
  } catch (e) {
    return { ok: true, mode: 'local', error: e instanceof Error ? e.message : 'Network error' };
  }
}
