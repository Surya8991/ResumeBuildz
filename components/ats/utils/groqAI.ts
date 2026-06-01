export const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const SERVER_AI_ENDPOINT = '/api/ai/groq';

export function getGroqApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  // sessionStorage: key is scoped to the current tab and cleared automatically
  // when the tab closes, limiting the exposure window vs. localStorage.
  const raw = sessionStorage.getItem('groq-api-key');
  if (!raw) return null;
  // The UI writes this via usehooks-ts `useSessionStorage`, which JSON-stringifies
  // the value (so a string is stored quoted). Unwrap if needed; tolerate either shape.
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try { return JSON.parse(raw) as string; } catch { return raw; }
  }
  return raw;
}

export async function callGroqAI(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 300,
  temperature: number = 0.7,
  apiKeyOverride?: string
): Promise<{ success: boolean; content?: string; error?: string; status?: number }> {
  const apiKey = apiKeyOverride || getGroqApiKey();
  if (!apiKey) return { success: false, error: 'No API key configured' };

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) return { success: false, error: 'Invalid API key', status: 401 };
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData?.error?.message || `API error (${response.status})`,
        status: response.status,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (content) return { success: true, content };
    return { success: false, error: 'No response generated' };
  } catch {
    return { success: false, error: 'Failed to connect to AI service' };
  }
}

/**
 * Streaming variant — calls `onChunk` as tokens arrive. Returns the full
 * assembled content when the stream ends. Falls back cleanly on network / auth
 * errors (identical shape to `callGroqAI`).
 *
 * Useful wherever a 3-5s wall-of-silence hurts UX (cover letter, AI Gap).
 */
export async function streamGroqAI(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (delta: string, full: string) => void,
  maxTokens: number = 300,
  temperature: number = 0.7,
  signal?: AbortSignal,
): Promise<{ success: boolean; content?: string; error?: string; status?: number }> {
  const apiKey = getGroqApiKey();
  if (!apiKey) return { success: false, error: 'No API key configured' };

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) return { success: false, error: 'Invalid API key', status: 401 };
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errData?.error?.message || `API error (${response.status})`,
        status: response.status,
      };
    }

    if (!response.body) return { success: false, error: 'No response body' };

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Server-Sent Events format: "data: {...}\n\n"
      // Each reader chunk may contain partial lines; buffer accumulates and
      // splits on \n so we never parse an incomplete JSON object.
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim(); // Remove "data: " prefix (5 chars) before JSON.parse.
        if (payload === '[DONE]') continue; // Groq signals end-of-stream with the literal string '[DONE]'; skip it.
        try {
          const json = JSON.parse(payload);
          const delta: string = json.choices?.[0]?.delta?.content || '';
          if (delta) {
            full += delta;
            onChunk(delta, full);
          }
        } catch { /* Skip corrupted SSE chunks and continue; one bad chunk shouldn't abort the stream. */ }
      }
    }

    return { success: true, content: full.trim() };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    return { success: false, error: 'Failed to connect to AI service' };
  }
}

// ─── Server-side proxy variants (paid plan users — no personal key needed) ───

export async function callGroqViaServer(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 300,
  temperature = 0.7,
): Promise<{ success: boolean; content?: string; error?: string; status?: number }> {
  try {
    const res = await fetch(SERVER_AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt, maxTokens, temperature }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: (data as { error?: string }).error || `AI request failed (${res.status})`,
        status: res.status,
      };
    }
    const data = await res.json() as { content?: string };
    if (data.content) return { success: true, content: data.content };
    return { success: false, error: 'No response generated' };
  } catch {
    return { success: false, error: 'Failed to connect to AI service' };
  }
}

export async function streamGroqViaServer(
  systemPrompt: string,
  userPrompt: string,
  onChunk: (delta: string, full: string) => void,
  maxTokens = 300,
  temperature = 0.7,
  signal?: AbortSignal,
): Promise<{ success: boolean; content?: string; error?: string; status?: number }> {
  try {
    const res = await fetch(SERVER_AI_ENDPOINT, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt, maxTokens, temperature, stream: true }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: (data as { error?: string }).error || `AI request failed (${res.status})`,
        status: res.status,
      };
    }
    if (!res.body) return { success: false, error: 'No response body' };

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const json = JSON.parse(payload);
          const delta: string = json.choices?.[0]?.delta?.content || '';
          if (delta) { full += delta; onChunk(delta, full); }
        } catch { /* skip corrupted SSE chunks */ }
      }
    }
    return { success: true, content: full.trim() };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return { success: false, error: 'Request cancelled' };
    return { success: false, error: 'Failed to connect to AI service' };
  }
}
