export const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export function getGroqApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('groq-api-key');
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

      // Parse SSE lines (data: {...}\n\n)
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
          if (delta) {
            full += delta;
            onChunk(delta, full);
          }
        } catch { /* skip malformed chunk */ }
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
