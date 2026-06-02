'use client';

import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2, AlertCircle, Loader2 } from 'lucide-react';
import { streamGroqAI, streamGroqViaServer, getGroqApiKey } from '@/components/ats/utils/groqAI';
import { saveVersion } from '@/lib/versionHistory';
import { useToast } from '@/components/Toast';
import ResumeDiff from '@/components/ResumeDiff';
import { useAuthContext } from '@/components/Providers';

/**
 * JD-tailored rewrite: user pastes a job description, AI rewrites the
 * summary + top 3 experience bullets to emphasize JD-matched keywords.
 *
 * Saves a version snapshot before applying so user can roll back.
 * Streams the rewrite for visible progress on long outputs.
 */
export default function JDTailor() {
  const { resumeData, updateSummary, updateExperience } = useResumeStore();
  const { showToast } = useToast();
  const { isPro, profile } = useAuthContext();
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamed, setStreamed] = useState('');
  const [preview, setPreview] = useState<{ summary: string; bullets: string[] } | null>(null);
  // Cancel any in-flight stream when the user re-runs or unmounts the panel,
  // so we don't burn the user's Groq quota on output they'll never see.
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const canRun = jd.trim().length > 30 && resumeData.experience.length > 0;

  const run = async () => {
    if (!canRun) return;
    const apiKey = getGroqApiKey();
    const useServer = (isPro() || ['pro', 'team', 'lifetime'].includes(profile?.plan ?? '')) && !apiKey;
    if (!apiKey && !useServer) {
      setError('AI not configured. Paste a free Groq API key in the AI panel (console.groq.com/keys) or upgrade to a paid plan.');
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setError('');
    setStreamed('');
    setPreview(null);
    setLoading(true);

    const topExp = resumeData.experience[0];
    const currentSummary = resumeData.summary || '(none)';
    const currentBullets = topExp.highlights.slice(0, 5).map((b, i) => `${i + 1}. ${b}`).join('\n') || '(none)';

    const system = `You are an ATS optimization expert. Given a job description and a candidate's current resume summary + bullets, rewrite them to emphasize keywords from the JD while staying truthful. Return ONLY valid JSON matching this exact schema:
{"summary": "...", "bullets": ["...", "...", "...", "...", "..."]}
Rules: 3 sentences max for summary; up to 5 bullets each starting with a strong action verb; quantify where possible; NO markdown, NO preamble, JUST JSON.`;

    const user = `JOB DESCRIPTION:\n${jd.trim()}\n\nCURRENT SUMMARY:\n${currentSummary}\n\nCURRENT BULLETS (for role "${topExp.position}" at "${topExp.company}"):\n${currentBullets}\n\nRewrite for better JD match.`;

    try {
      const res = useServer
        ? await streamGroqViaServer(system, user, (_delta, full) => setStreamed(full), 1000, 0.5, abortRef.current.signal)
        : await streamGroqAI(system, user, (_delta, full) => setStreamed(full), 1000, 0.5, abortRef.current.signal);
      if (!res.success || !res.content) {
        setError(res.status === 503 ? 'AI is temporarily unavailable. Please try again later.' : res.error || 'AI rewrite failed.');
        setLoading(false);
        return;
      }
      const match = res.content.match(/\{[\s\S]*\}/);
      if (!match) {
        setError('AI returned unparseable output. Try again.');
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(match[0]);
      if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.bullets)) {
        setError('AI output missing summary or bullets.');
        setLoading(false);
        return;
      }
      setPreview({
        summary: parsed.summary,
        bullets: parsed.bullets.filter((b: unknown): b is string => typeof b === 'string'),
      });
    } catch {
      setError('Failed to connect to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!preview) return;
    // Snapshot current state so the user can restore.
    saveVersion(resumeData, `Before JD tailor - ${new Date().toLocaleString()}`);
    updateSummary(preview.summary);
    const topExpId = resumeData.experience[0].id;
    updateExperience(topExpId, { highlights: preview.bullets });
    showToast('Resume tailored. Prior version saved.', 'success');
    setPreview(null);
    setStreamed('');
    setJd('');
  };

  const revert = () => {
    setPreview(null);
    setStreamed('');
    showToast('Discarded AI rewrite.', 'info');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Wand2 className="h-4 w-4" /> Tailor to Job Description
      </h3>

      <Card className="p-3 space-y-3">
        <div>
          <Label className="text-xs">Paste the full job description</Label>
          <Textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Copy the entire JD here — AI will extract keywords and requirements..."
            className="mt-1 text-sm min-h-[120px]"
            disabled={loading}
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            {jd.length} characters · {resumeData.experience.length === 0 ? 'Add at least one experience entry first.' : `Will rewrite summary + bullets for "${resumeData.experience[0].position}"`}
          </p>
        </div>

        <Button
          onClick={run}
          disabled={!canRun || loading}
          className="w-full gap-1.5"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? 'Rewriting...' : 'Tailor Resume'}
        </Button>

        {loading && streamed && (
          <div className="bg-muted/50 rounded p-2 max-h-48 overflow-auto">
            <pre className="text-[10px] whitespace-pre-wrap font-mono text-muted-foreground">{streamed}</pre>
          </div>
        )}

        {error && (
          <div role="alert" aria-live="polite" className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      {preview && (
        <Card aria-live="polite" className="p-3 space-y-4 border-green-200">
          <p className="text-xs font-semibold text-green-700">
            AI rewrite ready — review before applying (current version will be auto-saved)
          </p>

          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Summary diff</Label>
            <ResumeDiff before={resumeData.summary} after={preview.summary} sideBySide className="mt-1" />
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">New bullets</Label>
            <ul className="mt-1 space-y-1 text-sm">
              {preview.bullets.map((b, i) => (
                <li key={i} className="pl-3 relative before:content-['▸'] before:absolute before:left-0 before:text-green-600">{b}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={apply} className="flex-1 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Apply rewrite
            </Button>
            <Button variant="outline" onClick={revert} className="flex-1">
              Discard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
