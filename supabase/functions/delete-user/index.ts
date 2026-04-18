// Supabase Edge Function: delete-user
//
// Deploy with:
//   supabase functions deploy delete-user --no-verify-jwt
//
// The --no-verify-jwt flag is intentional: we manually verify the caller
// below using the anon-key-authenticated client, then escalate to the
// service role for the actual delete.
//
// REQUIRED ENV (set on the function, not the app):
//   SUPABASE_URL             - project URL (auto-set by Supabase CLI)
//   SUPABASE_ANON_KEY        - anon key (auto-set)
//   SUPABASE_SERVICE_ROLE_KEY - service role key (YOU must set this)
//
// Client-side usage (from hooks/useAuth.ts):
//   const { data, error } = await supabase.functions.invoke('delete-user');

// @ts-expect-error - Deno runtime import, only resolves at deploy time
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

// @ts-expect-error - Deno global, not Node
declare const Deno: { env: { get(k: string): string | undefined } };

// Allowed origins for CORS. Production apex + www, plus common dev ports.
// A caller from any other origin gets their CORS headers omitted entirely,
// so the browser blocks the response before any credential is used. This
// doesn't authenticate — we still JWT-verify the Bearer — but it prevents a
// stolen token from being weaponised from an attacker-controlled origin.
const ALLOWED_ORIGINS = new Set([
  'https://resumebuildz.tech',
  'https://www.resumebuildz.tech',
  'http://localhost:3000',
  'http://localhost:5467',
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://resumebuildz.tech';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  };
}

serve(async (req: Request): Promise<Response> => {
  const CORS = corsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!url || !anonKey || !serviceKey) {
    return new Response(JSON.stringify({ error: 'Function environment not configured' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // 1. Verify caller identity using their JWT (anon key client).
  const auth = req.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  // 2. Escalate to service role for the actual deletion. This:
  //    - deletes the profiles row (explicit, for audit)
  //    - deletes the auth.users row (the whole reason this function exists)
  //    - any FK-cascaded rows in other tables follow automatically
  const admin = createClient(url, serviceKey);

  const { error: profileErr } = await admin.from('profiles').delete().eq('id', user.id);
  if (profileErr) {
    return new Response(JSON.stringify({ error: `Profile delete failed: ${profileErr.message}` }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const { error: authErr } = await admin.auth.admin.deleteUser(user.id);
  if (authErr) {
    return new Response(JSON.stringify({ error: `Auth delete failed: ${authErr.message}` }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, userId: user.id }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
});
