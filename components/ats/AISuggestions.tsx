'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, Check, AlertCircle, Key } from 'lucide-react';

const GROQ_MODEL = 'llama-3.3-70b-versatile';

function getResumeContext(resumeData: ReturnType<typeof useResumeStore.getState>['resumeData']): string {
  const parts: string[] = [];
  const { personalInfo } = resumeData;
  if (personalInfo.fullName) parts.push(`Name: ${personalInfo.fullName}`);
  if (personalInfo.jobTitle) parts.push(`Title: ${personalInfo.jobTitle}`);
  if (resumeData.summary) parts.push(`Summary: ${resumeData.summary}`);

  if (resumeData.experience.length > 0) {
    parts.push('Experience:');
    for (const exp of resumeData.experience) {
      parts.push(`- ${exp.position} at ${exp.company}`);
      for (const h of exp.highlights.slice(0, 3)) parts.push(`  * ${h}`);
    }
  }

  if (resumeData.skills.length > 0) {
    parts.push('Skills: ' + resumeData.skills.flatMap(s => s.items).join(', '));
  }

  return parts.join('\n');
}

type SuggestionType = 'summary' | 'bullets' | 'skills' | 'custom';

const PROMPTS: Record<SuggestionType, string> = {
  summary: 'Write a compelling 2-3 sentence professional summary for this resume. Make it ATS-friendly with strong keywords. Return ONLY the summary text, no labels or quotes.',
  bullets: 'Suggest 3-4 strong achievement-based bullet points for the most recent role. Use action verbs and quantified results. Return bullet points only, one per line, starting with a dash.',
  skills: 'Based on this resume, suggest 10 additional relevant skills that would strengthen the profile and improve ATS matching. Return skills as a comma-separated list only.',
  custom: '',
};

export default function AISuggestions() {
  const { resumeData } = useResumeStore();
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('groq-api-key') || '';
    return '';
  });
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const saveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('groq-api-key', key);
    setShowKeyInput(false);
  };

  const generate = async (type: SuggestionType) => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const resumeContext = getResumeContext(resumeData);
    if (!resumeContext || resumeContext.length < 20) {
      setError('Add some resume content first (name, experience, skills) before generating suggestions.');
      return;
    }

    const prompt = type === 'custom' ? customPrompt : PROMPTS[type];
    if (!prompt) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer and ATS optimization expert. Give concise, actionable suggestions. Do not include any preamble or explanation - just the requested content.',
            },
            {
              role: 'user',
              content: `Here is the resume:\n\n${resumeContext}\n\n${prompt}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          setError('Invalid API key. Please check your Groq API key.');
          setShowKeyInput(true);
        } else {
          setError(errData?.error?.message || `API error (${response.status})`);
        }
        return;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) setResult(content);
      else setError('No suggestion generated. Try again.');
    } catch (err) {
      setError('Failed to connect to AI service. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Sparkles className="h-4 w-4" /> AI Writing Assistant
      </h3>

      {/* API Key setup */}
      {showKeyInput ? (
        <Card className="p-3 space-y-2">
          <p className="text-xs font-medium text-foreground mb-1">Bring Your Own API Key (free)</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            AI features require your own Groq API key. No key is provided with this app.<br/><br/>
            1. Visit <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">console.groq.com/keys</a> and sign up (free)<br/>
            2. Click &quot;Create API Key&quot; and copy it<br/>
            3. Paste it below — stored only in your browser, never on any server
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="gsk_..."
              className="flex-1 text-xs px-2 py-1.5 border rounded-md bg-background"
              onChange={(e) => setApiKey(e.target.value)}
              value={apiKey}
            />
            <Button size="sm" onClick={() => saveKey(apiKey)} disabled={!apiKey || apiKey.length < 10}>
              <Key className="h-3 w-3 mr-1" /> Save
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Your Groq API key is active</span>
          <button onClick={() => setShowKeyInput(true)} className="text-[10px] text-muted-foreground hover:text-foreground underline">
            Change key
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-1.5">
        <Button
          variant="outline" size="sm"
          className="text-[10px] h-8"
          onClick={() => generate('summary')}
          disabled={loading}
        >
          Summary
        </Button>
        <Button
          variant="outline" size="sm"
          className="text-[10px] h-8"
          onClick={() => generate('bullets')}
          disabled={loading}
        >
          Bullet Points
        </Button>
        <Button
          variant="outline" size="sm"
          className="text-[10px] h-8"
          onClick={() => generate('skills')}
          disabled={loading}
        >
          Skills
        </Button>
      </div>

      {/* Custom prompt */}
      <div className="space-y-1.5">
        <Label className="text-[10px] text-muted-foreground">Custom prompt</Label>
        <div className="flex gap-1.5">
          <Textarea
            placeholder="e.g., Rewrite my summary for a product manager role..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="text-xs min-h-[60px] resize-none"
          />
        </div>
        <Button
          variant="outline" size="sm"
          className="w-full text-xs"
          onClick={() => generate('custom')}
          disabled={loading || !customPrompt.trim()}
        >
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <Card className="p-3 relative">
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
          <pre className="text-xs text-foreground whitespace-pre-wrap pr-8 leading-relaxed font-sans">{result}</pre>
          <p className="text-[9px] text-muted-foreground mt-2 pt-2 border-t">
            Copy this text and paste it into the relevant section of your resume.
          </p>
        </Card>
      )}
    </div>
  );
}
