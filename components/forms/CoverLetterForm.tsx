'use client';

import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Copy, Check } from 'lucide-react';
import { streamGroqAI, streamGroqViaServer, getGroqApiKey } from '@/components/ats/utils/groqAI';
import { useAuthContext } from '@/components/Providers';

type Tone = 'professional' | 'formal' | 'casual' | 'concise';

const TONE_PROMPTS: Record<Tone, string> = {
  professional: 'Write a professional cover letter. Balanced tone, concrete achievements, 250-350 words. No placeholders - use the provided details. Return only the letter text.',
  formal: 'Write a formal cover letter suitable for law, finance, government, or academia. Third-person style where natural, sophisticated vocabulary, 300-400 words. No contractions. No placeholders. Return only the letter text.',
  casual: 'Write a warm, conversational cover letter for a startup or creative agency. First-person, use contractions, show personality, 200-300 words. No placeholders. Return only the letter text.',
  concise: 'Write a concise cover letter. 4 short paragraphs, <200 words total. Lead with one killer achievement with a number. No placeholders. Return only the letter text.',
};

const TONE_LABELS: Record<Tone, string> = {
  professional: 'Professional',
  formal: 'Formal',
  casual: 'Casual',
  concise: 'Concise',
};

export default function CoverLetterForm() {
  const { resumeData, updateCoverLetter } = useResumeStore();
  const { isPro, profile } = useAuthContext();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  // Cancel any in-flight stream on unmount or re-run so we don't burn the
  // user's Groq quota generating output they'll never see.
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!jobTitle && resumeData.personalInfo.jobTitle) {
      setJobTitle(resumeData.personalInfo.jobTitle);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const generateCoverLetter = async () => {
    const apiKey = getGroqApiKey();
    const useServer = (isPro() || ['pro', 'team', 'lifetime'].includes(profile?.plan ?? '')) && !apiKey;
    if (!apiKey && !useServer) {
      alert('AI is not configured.\n\nOpen the "ATS Score" / AI panel and paste a free Groq API key (https://console.groq.com/keys) — or upgrade to a paid plan to use the built-in server proxy without a personal key.');
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const { personalInfo, summary, experience, skills } = resumeData;
    const context = [
      `Name: ${personalInfo.fullName}`,
      `Title: ${personalInfo.jobTitle}`,
      `Summary: ${summary}`,
      experience.length > 0 ? `Recent role: ${experience[0].position} at ${experience[0].company}` : '',
      skills.length > 0 ? `Skills: ${skills.flatMap(s => s.items).slice(0, 15).join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const userMsg = `Write a cover letter for ${jobTitle || 'a role'} at ${company || 'a company'}.\n\nCandidate info:\n${context}`;
    const temp = tone === 'casual' ? 0.85 : tone === 'formal' ? 0.5 : 0.7;

    setLoading(true);
    // Clear any existing letter so streamed output replaces it cleanly.
    updateCoverLetter('');
    try {
      const res = useServer
        ? await streamGroqViaServer(TONE_PROMPTS[tone], userMsg, (_delta, full) => updateCoverLetter(full), 900, temp, abortRef.current.signal)
        : await streamGroqAI(TONE_PROMPTS[tone], userMsg, (_delta, full) => updateCoverLetter(full), 900, temp, abortRef.current.signal);
      if (!res.success) alert(res.error || 'AI generation failed.');
    } catch {
      alert('Failed to connect to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy — try selecting the text manually.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cover Letter</h3>

      {/* AI Generation */}
      <div className="p-3 rounded-lg border bg-muted/30 space-y-3">
        <p className="text-xs font-medium flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Generate with AI
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">Job Title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Marketing Manager" className="mt-0.5 h-8 text-xs" />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Company</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" className="mt-0.5 h-8 text-xs" />
          </div>
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Tone</Label>
          <div className="grid grid-cols-4 gap-1 mt-1">
            {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                disabled={loading}
                className={`text-[10px] font-semibold px-2 py-1.5 rounded border transition ${
                  tone === t
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input'
                }`}
              >
                {TONE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
        <Button size="sm" onClick={generateCoverLetter} disabled={loading} className="w-full gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> {loading ? 'Generating...' : `Generate ${TONE_LABELS[tone]} Letter`}
        </Button>
      </div>

      {/* Editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-sm">Letter Content</Label>
          {resumeData.coverLetter && (
            <button onClick={copyToClipboard} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        <Textarea
          value={resumeData.coverLetter}
          onChange={(e) => updateCoverLetter(e.target.value)}
          placeholder="Write your cover letter here, or use AI to generate one..."
          rows={15}
          className="text-sm leading-relaxed"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          {resumeData.coverLetter.length} characters | ~{Math.round(resumeData.coverLetter.split(/\s+/).filter(Boolean).length)} words
        </p>
      </div>
    </div>
  );
}
