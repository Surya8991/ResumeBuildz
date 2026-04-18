'use client';

// Quality feedback panel rendered below the Achievements textarea in
// ExperienceForm / ProjectsForm. One row per bullet: colored pip, score,
// first snippet, and a collapsible list of concrete issues + a "rewrite
// weak opener" chip row when applicable.

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Info, AlertTriangle, AlertCircle, Wand2, Sparkles, Check, X, Loader2 } from 'lucide-react';
import { evaluateBullet, gradeBg, gradeColor } from '@/lib/bulletEvaluator';
import { callGroqAI, getGroqApiKey } from '@/components/ats/utils/groqAI';
import { canUse, incrementUsage } from '@/lib/usage';

export interface BulletScoreListProps {
  bullets: string[];
  onReplace: (index: number, nextBullet: string) => void;
}

export default function BulletScoreList({ bullets, onReplace }: BulletScoreListProps) {
  const filtered = useMemo(
    () => bullets.map((b, i) => ({ raw: b, i })).filter((x) => x.raw.trim()),
    [bullets]
  );

  const scored = useMemo(
    () =>
      filtered.map((x) => {
        const siblings = filtered.filter((o) => o.i !== x.i).map((o) => o.raw);
        return { ...x, result: evaluateBullet(x.raw, { siblings }) };
      }),
    [filtered]
  );

  const avg = scored.length ? Math.round(scored.reduce((s, x) => s + x.result.score, 0) / scored.length) : 0;

  if (!scored.length) return null;

  function applyWeakRewrite(index: number, newOpener: string) {
    const original = bullets[index] || '';
    // Use [\s\S] instead of . + /s flag so the ES2017 target accepts this.
    const match = original.match(/^([-*.·•]\s*)?(\S[\s\S]*)/);
    if (!match) return;
    const prefix = match[1] || '';
    const rest = match[2];
    // Replace the first weak phrase (up to 3 words) with the selected opener
    const replaced = rest.replace(/^(\S+(?:\s+\S+){0,2})\s*/, (full) => {
      const lower = full.toLowerCase();
      // Preserve casing style of the first letter
      const keep = newOpener;
      // Keep the rest of the sentence starting after the matched phrase
      // Whether the match was a 1, 2, or 3 word weak phrase, we just swap it
      // for the new opener and let the user polish connector words.
      void lower;
      return keep + ' ';
    });
    onReplace(index, prefix + replaced.replace(/\s+/g, ' ').trim());
  }

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/60">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-800">Bullet quality</span>
          <span className={`text-xs font-bold ${avg >= 80 ? 'text-emerald-600' : avg >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
            Avg {avg}/100
          </span>
        </div>
        <span className="text-[10px] text-gray-500">{scored.length} bullet{scored.length === 1 ? '' : 's'}</span>
      </div>
      <ul className="divide-y divide-gray-200">
        {scored.map(({ raw, i, result }) => (
          <BulletRow
            key={`${i}-${raw.slice(0, 20)}`}
            index={i}
            bullet={raw}
            score={result.score}
            grade={result.grade}
            issues={result.issues}
            suggestions={result.suggestions}
            onApplyOpener={(opener) => applyWeakRewrite(i, opener)}
            onReplaceFull={(next) => onReplace(i, next)}
          />
        ))}
      </ul>
    </div>
  );
}

function BulletRow({
  bullet,
  score,
  grade,
  issues,
  suggestions,
  onApplyOpener,
  onReplaceFull,
}: {
  index: number;
  bullet: string;
  score: number;
  grade: 'green' | 'yellow' | 'red';
  issues: ReturnType<typeof evaluateBullet>['issues'];
  suggestions: string[];
  onApplyOpener: (opener: string) => void;
  onReplaceFull: (next: string) => void;
}) {
  const [open, setOpen] = useState(grade === 'red');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const hasIssues = issues.length > 0;
  const weakOpenerSuggestions = suggestions.filter((s) => s && !s.startsWith('['));

  async function runAiRewrite() {
    setAiError(null);
    setAiResult(null);
    if (!getGroqApiKey()) {
      setAiError('Add a Groq API key in AI settings first.');
      return;
    }
    if (!canUse('ai')) {
      setAiError('Daily free AI limit reached. Upgrade for unlimited.');
      return;
    }
    setAiBusy(true);
    const { success, content, error } = await callGroqAI(
      'You are a resume coach. Rewrite a single resume bullet to be stronger: strong action verb start, one specific quantified metric, 14-22 words, no fluff. Return ONLY the rewritten bullet, no preamble, no quotes.',
      `Original: ${bullet}`,
      120,
      0.5,
    );
    setAiBusy(false);
    if (success && content) {
      setAiResult(content.replace(/^["']|["']$/g, '').trim());
      incrementUsage('ai');
    } else {
      setAiError(error || 'AI rewrite failed.');
    }
  }

  return (
    <li className="px-3 py-2 text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left"
        aria-expanded={open}
      >
        <span className={`h-2 w-2 rounded-full shrink-0 ${gradeBg(grade)}`} aria-hidden />
        <span className={`font-semibold tabular-nums ${gradeColor(grade)}`}>{score}</span>
        <span className="flex-1 truncate text-gray-700">{bullet}</span>
        {hasIssues ? (
          open ? <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        ) : (
          <span className="text-[10px] text-emerald-600 font-medium shrink-0">OK</span>
        )}
      </button>
      {open && hasIssues && (
        <div className="mt-2 pl-4 space-y-1.5">
          {issues.map((iss) => (
            <div key={iss.id} className="flex items-start gap-1.5 text-gray-700">
              {iss.severity === 'error' && <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />}
              {iss.severity === 'warn' && <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />}
              {iss.severity === 'info' && <Info className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />}
              <div>
                <span>{iss.message}</span>
                {iss.fix && <span className="text-gray-500"> . {iss.fix}</span>}
              </div>
            </div>
          ))}
          {weakOpenerSuggestions.length > 0 && (
            <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-gray-500"><Wand2 className="h-3 w-3" /> Replace opener:</span>
              {weakOpenerSuggestions.slice(0, 4).map((opener) => (
                <button
                  key={opener}
                  type="button"
                  onClick={() => onApplyOpener(opener)}
                  className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition border border-indigo-100"
                >
                  {opener}
                </button>
              ))}
            </div>
          )}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={runAiRewrite}
              disabled={aiBusy}
              className="inline-flex items-center gap-1 text-[11px] bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-2 py-1 rounded transition"
            >
              {aiBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              {aiBusy ? 'Rewriting...' : 'Rewrite with AI'}
            </button>
            {aiError && <span className="text-[10px] text-red-600">{aiError}</span>}
          </div>
          {aiResult && (
            <div className="mt-2 rounded-md border border-indigo-200 bg-indigo-50/60 p-2 text-[11px]">
              <p className="text-gray-800 mb-2">{aiResult}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { onReplaceFull(aiResult); setAiResult(null); }}
                  className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-medium"
                >
                  <Check className="h-3 w-3" /> Replace
                </button>
                <button
                  type="button"
                  onClick={() => setAiResult(null)}
                  className="inline-flex items-center gap-1 text-[10px] border border-gray-300 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded font-medium"
                >
                  <X className="h-3 w-3" /> Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
