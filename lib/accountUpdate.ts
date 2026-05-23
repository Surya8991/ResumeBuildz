// Profile writes and avatar uploads — now backed by API routes instead of Supabase.

export type ProfilePatch = Partial<{
  full_name: string;
  avatar_url: string;
  headline: string;
  current_role: string;
  years_experience: number | null;
  timezone: string;
  locale: string;
  target_role: string;
  target_seniority: string | null;
  target_industry: string;
  target_locations: string;
  open_to_work: boolean;
  default_template: string;
  default_font: string;
  default_accent: string;
  default_language: 'en' | 'hi';
  mask_phone_on_share: boolean;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  notify_ats_tips: boolean;
  notify_product: boolean;
  invoice_email: string;
}>;

export async function updateProfile(_userId: string, patch: ProfilePatch) {
  if (Object.keys(patch).length === 0) return { error: null };
  const res = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: new Error(body.error ?? 'Update failed') };
  }
  return { error: null };
}

export async function uploadAvatar(_userId: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return { error: new Error('Only JPG, PNG, or WebP allowed'), url: null };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { error: new Error('Max file size is 2 MB'), url: null };
  }

  const form = new FormData();
  form.append('file', file);

  const res = await fetch('/api/upload/avatar', { method: 'POST', body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { error: new Error(body.error ?? 'Upload failed'), url: null };
  }
  const { url } = await res.json();
  return { error: null, url };
}
