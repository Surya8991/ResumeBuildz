-- Welcome-email trigger
--
-- Fires once when a user confirms their email (email_confirmed_at transitions
-- from NULL to a timestamp). Calls the `send-welcome` Edge Function via
-- pg_net, passing a shared secret so the function can authenticate the call.
--
-- Run this ONCE in the Supabase SQL editor after:
--   1. Deploying the send-welcome function
--   2. Setting its RESEND_API_KEY and WELCOME_HOOK_SECRET secrets
--   3. Filling in the two app settings below (project URL + same secret)

-- -----------------------------------------------------------------------
-- 1. pg_net is required for outbound HTTP from Postgres.
-- -----------------------------------------------------------------------
create extension if not exists pg_net with schema extensions;

-- -----------------------------------------------------------------------
-- 2. Store config as DB-level settings so we don't hardcode secrets in
--    the trigger body. Replace the placeholder values before running.
--    (These persist across sessions because ALTER DATABASE is used.)
-- -----------------------------------------------------------------------
-- REPLACE <project-ref> and <same-secret-as-function> below:
alter database postgres set app.welcome_fn_url       = 'https://<project-ref>.supabase.co/functions/v1/send-welcome';
alter database postgres set app.welcome_hook_secret  = '<same-secret-as-function>';

-- -----------------------------------------------------------------------
-- 3. The trigger function.
-- -----------------------------------------------------------------------
create or replace function public.handle_user_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fn_url      text := current_setting('app.welcome_fn_url', true);
  hook_secret text := current_setting('app.welcome_hook_secret', true);
  display_name text;
begin
  -- Only fire when email_confirmed_at goes from NULL to a value.
  if old.email_confirmed_at is not null or new.email_confirmed_at is null then
    return new;
  end if;

  if fn_url is null or hook_secret is null then
    raise warning 'welcome-email: app.welcome_fn_url or app.welcome_hook_secret not set';
    return new;
  end if;

  -- Best-effort display name from common metadata keys.
  display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    null
  );

  perform net.http_post(
    url     := fn_url,
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || hook_secret
    ),
    body    := jsonb_build_object(
      'email', new.email,
      'name',  display_name
    )
  );

  return new;
end;
$$;

-- -----------------------------------------------------------------------
-- 4. Attach the trigger to auth.users.
-- -----------------------------------------------------------------------
drop trigger if exists on_user_email_confirmed on auth.users;
create trigger on_user_email_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  execute function public.handle_user_email_confirmed();
