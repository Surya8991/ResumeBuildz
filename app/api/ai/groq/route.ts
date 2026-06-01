// Server-side Groq proxy for paid plan users (pro / team / lifetime / admin).
// Lifetime users get AI features without needing their own API key.
// POST { systemPrompt, userPrompt, maxTokens?, temperature?, stream? }

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const PAID_PLANS = ['pro', 'team', 'lifetime'];

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in to use AI features' }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  const [profile] = await db
    .select({ plan: profiles.plan, role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const hasAccess =
    profile.role === 'admin' ||
    profile.role === 'superadmin' ||
    PAID_PLANS.includes(profile.plan);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Upgrade required' }, { status: 403 });
  }

  let body: {
    systemPrompt?: unknown;
    userPrompt?: unknown;
    maxTokens?: unknown;
    temperature?: unknown;
    stream?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const systemPrompt =
    typeof body.systemPrompt === 'string' ? body.systemPrompt.slice(0, 4000) : '';
  const userPrompt =
    typeof body.userPrompt === 'string' ? body.userPrompt.slice(0, 8000) : '';
  const maxTokens =
    typeof body.maxTokens === 'number' ? Math.min(Math.max(body.maxTokens, 1), 2000) : 300;
  const temperature =
    typeof body.temperature === 'number' ? Math.min(Math.max(body.temperature, 0), 1) : 0.7;
  const stream = body.stream === true;

  if (!systemPrompt || !userPrompt) {
    return NextResponse.json(
      { error: 'systemPrompt and userPrompt are required' },
      { status: 400 },
    );
  }

  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature,
        stream,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}));
      console.error('[ai/groq] upstream error', groqRes.status, err);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    if (stream) {
      return new NextResponse(groqRes.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    const data = await groqRes.json();
    const content: string = data.choices?.[0]?.message?.content?.trim() ?? '';
    if (!content) return NextResponse.json({ error: 'No response generated' }, { status: 502 });
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: 'Failed to connect to AI service' }, { status: 502 });
  }
}
