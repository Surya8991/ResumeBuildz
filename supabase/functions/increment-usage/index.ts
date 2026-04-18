// Supabase Edge Function: increment-usage
//
// Server-side enforcement of AI/PDF daily limits. Replaces the trivially
// bypassable localStorage counter in lib/usage.ts for authenticated users.
//
// Deploy:
//   supabase functions deploy increment-usage --no-verify-jwt
//
// Required schema (run once in SQL editor):
//
//   alter table profiles add column if not exists ai_rewrites_used int default 0;
//   alter table profiles add column if not exists ai_rewrites_reset_date date default current_date;
//   alter table profiles add column if not exists pdf_exports_used int default 0;
//   alter table profiles add column if not exists pdf_exports_reset_date date default current_date;
//
// Client usage (see hooks/useAuth.ts):
//   const { data } = await supabase.functions.invoke('increment-usage', {
//     body: { feature: 'ai' | 'pdf' }
//   });
//   // data.allowed: boolean
//   // data.remaining: number
//
// Anonymous users fall back to localStorage. Authenticated users are
// enforced here — clearing localStorage no longer bypasses limits.

// @ts-expect-error - Deno runtime import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error - Deno runtime import
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

// @ts-expect-error - Deno global
declare const Deno: { env: { get(k: string): string | undefined } };

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

const LIMITS: Record<'ai' | 'pdf', Record<string, number>> = {
  ai: { free: 1, starter: 5, pro: 1_000_000, team: 1_000_000, lifetime: 1_000_000 },
  pdf: { free: 3, starter: 10, pro: 1_000_000, team: 1_000_000, lifetime: 1_000_000 },
};

serve(async (req: Request): Promise<Response> => {
  const CORS = corsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
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
    return new Response(JSON.stringify({ error: 'Function env not configured' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const auth = req.headers.get('Authorization');
  if (!auth) {
    return new Response(JSON.stringify({ error: 'Missing auth' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  let body: { feature?: 'ai' | 'pdf'; dryRun?: boolean };
  try { body = await req.json(); } catch { body = {}; }
  const feature = body.feature;
  if (feature !== 'ai' && feature !== 'pdf') {
    return new Response(JSON.stringify({ error: 'Invalid feature' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const admin = createClient(url, serviceKey);
  const today = new Date().toISOString().slice(0, 10);
  const usedCol = feature === 'ai' ? 'ai_rewrites_used' : 'pdf_exports_used';
  const resetCol = feature === 'ai' ? 'ai_rewrites_reset_date' : 'pdf_exports_reset_date';

  const { data: profile, error: pErr } = await admin
    .from('profiles')
    .select(`plan, ${usedCol}, ${resetCol}`)
    .eq('id', user.id)
    .single();

  if (pErr || !profile) {
    return new Response(JSON.stringify({ error: 'Profile not found' }), {
      status: 404,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const plan = (profile as Record<string, unknown>).plan as string || 'free';
  const rawUsed = Number((profile as Record<string, unknown>)[usedCol] ?? 0);
  const resetDate = String((profile as Record<string, unknown>)[resetCol] ?? today);
  const used = resetDate === today ? rawUsed : 0;
  const limit = LIMITS[feature][plan] ?? LIMITS[feature].free;

  if (used >= limit) {
    return new Response(
      JSON.stringify({ allowed: false, used, limit, remaining: 0 }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }

  // Dry-run mode: return current state without writing (useful for pre-check).
  if (body.dryRun) {
    return new Response(
      JSON.stringify({ allowed: true, used, limit, remaining: limit - used, dryRun: true }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }

  const { error: uErr } = await admin
    .from('profiles')
    .update({ [usedCol]: used + 1, [resetCol]: today })
    .eq('id', user.id);

  if (uErr) {
    return new Response(JSON.stringify({ error: uErr.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ allowed: true, used: used + 1, limit, remaining: limit - used - 1 }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } },
  );
});
