# Supabase migration for /account page

Run these SQL blocks in the Supabase SQL editor in order. Every block is
idempotent (uses `if not exists` / `on conflict do nothing`) so re-running
is safe.

## 1. Extend profiles table

New columns cover the /account tabs. All are nullable so existing rows are
unaffected. String columns have length caps at the Zod layer too; the DB
caps are a last line of defence.

```sql
alter table public.profiles
  add column if not exists headline         text check (char_length(headline) <= 120),
  -- current_role is a reserved keyword in Postgres 16+, so quote it
  add column if not exists "current_role"   text check (char_length("current_role") <= 120),
  add column if not exists years_experience smallint check (years_experience between 0 and 60),
  add column if not exists timezone         text check (char_length(timezone) <= 64),
  add column if not exists locale           text check (char_length(locale) <= 16),
  add column if not exists target_role      text check (char_length(target_role) <= 120),
  add column if not exists target_seniority text check (target_seniority in ('intern','junior','mid','senior','staff','principal','director','vp','c-suite')),
  add column if not exists target_industry  text check (char_length(target_industry) <= 120),
  add column if not exists target_locations text check (char_length(target_locations) <= 240),
  add column if not exists open_to_work     boolean not null default false,
  add column if not exists default_template text check (char_length(default_template) <= 40),
  add column if not exists default_font     text check (char_length(default_font) <= 40),
  add column if not exists default_accent   text check (default_accent ~ '^#[0-9a-fA-F]{6}$'),
  add column if not exists default_language text check (default_language in ('en','hi')) default 'en',
  add column if not exists mask_phone_on_share boolean not null default false,
  add column if not exists linkedin_url     text check (char_length(linkedin_url) <= 240),
  add column if not exists github_url       text check (char_length(github_url) <= 240),
  add column if not exists portfolio_url    text check (char_length(portfolio_url) <= 240),
  add column if not exists notify_ats_tips  boolean not null default false,
  add column if not exists notify_product   boolean not null default true,
  add column if not exists invoice_email    text check (char_length(invoice_email) <= 254);
```

## 2. Row-Level Security on profiles

Users can only SELECT, UPDATE, and INSERT their own profile. Nobody can
DELETE through the API (account deletion goes through the Edge Function).

```sql
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
```

## 3. Avatar storage bucket

Public-read (so avatars render in <img>) but owner-only write. Files are
keyed under `<user-id>/<filename>` so the policies can scope by path.

```sql
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 4. Enable MFA (for 2FA in Security tab)

In Supabase dashboard: **Authentication → Providers → Phone/TOTP** and
enable **Multi-factor authentication (TOTP)**. No SQL needed.

## 5. Enable Google OAuth (for Connected accounts)

In Supabase dashboard: **Authentication → Providers → Google**. Paste
the client ID/secret from Google Cloud Console. No SQL needed.

## Safety notes

- Every write from the client goes through the anon key with RLS enforced.
  A malicious client cannot read or modify another user's row.
- `invoice_email` is stored separately from `auth.users.email` so changing
  one does not rotate the other.
- Avatar file size + mime type checks are enforced client-side (max 2 MB,
  image/jpeg|png|webp). Supabase also rejects non-image MIME at upload.
- Password change, email change, MFA enroll/verify all go through the
  Supabase Auth API which handles re-authentication and audit logging.
