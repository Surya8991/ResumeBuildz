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
