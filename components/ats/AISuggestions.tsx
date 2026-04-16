'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, Check, AlertCircle, Key } from 'lucide-react';
import { HelpTip } from '@/components/ui/help-tip';
import { getUsage, incrementUsage, canUse } from '@/lib/usage';
import UpgradeModal from '@/components/UpgradeModal';
import { useToast } from '@/components/Toast';
import { useAuthContext } from '@/components/Providers';
import { callGroqAI } from '@/components/ats/utils/groqAI';

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
  const { showToast } = useToast();
  const { isPro } = useAuthContext();
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
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [aiRemaining, setAiRemaining] = useState(() => getUsage('ai').remaining);

  const saveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('groq-api-key', key);
    setShowKeyInput(false);
  };

  const generate = async (type: SuggestionType) => {
    if (!canUse('ai', isPro())) {
      setShowUpgrade(true);
      return;
    }
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

    const res = await callGroqAI(
      'You are a professional resume writer and ATS optimization expert. Give concise, actionable suggestions. Do not include any preamble or explanation - just the requested content.',
      `Here is the resume:\n\n${resumeContext}\n\n${prompt}`,
      500,
      0.7,
    );
    setLoading(false);

    if (!res.success) {
      if (res.status === 401) {
        setError('Invalid API key. Please check your Groq API key.');
        setShowKeyInput(true);
      } else if (res.status === 429) {
        setError('Rate limit reached. Please wait a moment and try again.');
      } else if (res.status === 402 || res.status === 403) {
        setError('Quota exceeded. Check your Groq account at console.groq.com.');
      } else {
        setError(res.error || 'AI request failed. Try again.');
      }
      showToast('AI request failed. See error details below.', 'warning');
      return;
    }

    setResult(res.content!);
    incrementUsage('ai');
    const remaining = getUsage('ai').remaining;
    setAiRemaining(remaining);
    if (remaining === 0) {
      showToast('Last free AI rewrite used today. Upgrade for unlimited.', 'warning', 5000);
    } else {
      showToast('AI suggestion generated! Copy it to your resume.', 'success');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy — try selecting the text manually.', 'warning');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Sparkles className="h-4 w-4" /> AI Writing Assistant
        <HelpTip text="Generate professional summaries, bullet points, and skills using AI. Requires a free Groq API key. Click Summary, Bullet Points, or Skills for quick suggestions, or write a custom prompt." />
      </h3>

      {/* API Key setup */}
      {showKeyInput ? (
        <Card className="p-3 space-y-2">
          <p className="text-sm font-medium text-foreground mb-1">Bring Your Own API Key (free)</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI features require your own Groq API key. No key is provided with this app.<br/><br/>
            1. Visit <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">console.groq.com/keys</a> and sign up (free)<br/>
            2. Click &quot;Create API Key&quot; and copy it<br/>
            3. Paste it below  -  stored only in your browser, never on any server
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="gsk_..."
              className="flex-1 text-sm px-2.5 py-1.5 border rounded-md bg-background"
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
          <span className="text-xs text-muted-foreground">Your Groq API key is active</span>
          <button onClick={() => setShowKeyInput(true)} className="text-xs text-muted-foreground hover:text-foreground underline">
            Change key
          </button>
        </div>
      )}

      {/* Usage counter */}
      <p className="text-xs text-muted-foreground">
        {aiRemaining} free rewrite{aiRemaining !== 1 ? 's' : ''} remaining today
      </p>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-1.5">
        <Button
          variant="outline" size="sm"
          className="text-xs h-9"
          onClick={() => generate('summary')}
          disabled={loading}
        >
          Summary
        </Button>
        <Button
          variant="outline" size="sm"
          className="text-xs h-9"
          onClick={() => generate('bullets')}
          disabled={loading}
        >
          Bullet Points
        </Button>
        <Button
          variant="outline" size="sm"
          className="text-xs h-9"
          onClick={() => generate('skills')}
          disabled={loading}
        >
          Skills
        </Button>
      </div>

      {/* Custom prompt */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Custom prompt</Label>
        <div className="flex gap-1.5">
          <Textarea
            placeholder="e.g., Rewrite my summary for a product manager role..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="text-sm min-h-[60px] resize-none"
          />
        </div>
        <Button
          variant="outline" size="sm"
          className="w-full text-sm"
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
          <pre className="text-sm text-foreground whitespace-pre-wrap pr-8 leading-relaxed font-sans">{result}</pre>
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            Copy this text and paste it into the relevant section of your resume.
          </p>
        </Card>
      )}

      <UpgradeModal feature="ai" open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
