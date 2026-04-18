'use client';

import { useState, useCallback, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Separator } from '@/components/ui/separator';
import { Plus, BarChart3, X, FileText } from 'lucide-react';
import { extractKeywords, getResumeText } from '../utils/textAnalysis';
import { generateId } from '@/lib/ids';

interface SavedJD {
  id: string;
  label: string;
  text: string;
  savedAt: number;
}

interface ComparisonResult {
  id: string;
  label: string;
  matchPercentage: number;
  matchedCount: number;
  totalCount: number;
}

interface MultiJDMatchingProps {
  jobDescription: string;
  onLoadJD: (text: string) => void;
}

const STORAGE_KEY = 'resumeforge-saved-jds';
const MAX_JDS = 5;

function loadSavedJDs(): SavedJD[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persistJDs(jds: SavedJD[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jds));
}

export default function MultiJDMatching({ jobDescription, onLoadJD }: MultiJDMatchingProps) {
  const [savedJDs, setSavedJDs] = useState<SavedJD[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonResult[] | null>(null);
  const { resumeData } = useResumeStore();

  // Load saved JDs from localStorage on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setSavedJDs(loadSavedJDs()));
    return () => cancelAnimationFrame(id);
  }, []);

  const saveCurrentJD = useCallback(() => {
    if (!jobDescription.trim()) return;

    const newJD: SavedJD = {
      id: generateId(),
      label: jobDescription.trim().slice(0, 40).replace(/\s+/g, ' ') + (jobDescription.length > 40 ? '...' : ''),
      text: jobDescription.trim(),
      savedAt: Date.now(),
    };

    setSavedJDs((prev) => {
      const updated = [newJD, ...prev].slice(0, MAX_JDS);
      persistJDs(updated);
      return updated;
    });
  }, [jobDescription]);

  const removeJD = useCallback((id: string) => {
    setSavedJDs((prev) => {
      const updated = prev.filter((jd) => jd.id !== id);
      persistJDs(updated);
      return updated;
    });
    setComparisons((prev) => (prev ? prev.filter((c) => c.id !== id) : null));
  }, []);

  const compareAll = useCallback(() => {
    if (savedJDs.length === 0) return;

    const resumeText = getResumeText(resumeData);
    const results: ComparisonResult[] = savedJDs.map((jd) => {
      const keywords = extractKeywords(jd.text).filter((kw) => kw.length >= 3);
      const matched = keywords.filter((kw) => resumeText.includes(kw));
      const pct = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 0;

      return {
        id: jd.id,
        label: jd.label,
        matchPercentage: pct,
        matchedCount: matched.length,
        totalCount: keywords.length,
      };
    });

    setComparisons(results);
  }, [savedJDs, resumeData]);

  const getMatchColor = (pct: number) => {
    if (pct >= 70) return 'text-green-600';
    if (pct >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-3">
      {/* Save current JD */}
      <button
        onClick={saveCurrentJD}
        disabled={!jobDescription.trim() || savedJDs.length >= MAX_JDS}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full justify-center"
      >
        <Plus className="h-3.5 w-3.5" />
        Save Current JD ({savedJDs.length}/{MAX_JDS})
      </button>

      {/* Saved JDs */}
      {savedJDs.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium">Saved Job Descriptions</p>
          <div className="flex flex-wrap gap-1">
            {savedJDs.map((jd) => (
              <div
                key={jd.id}
                className="group flex items-center gap-1 max-w-full"
              >
                <button
                  onClick={() => onLoadJD(jd.text)}
                  className="text-xs px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 truncate max-w-[200px] text-left transition-colors flex items-center gap-1"
                  title={jd.label}
                >
                  <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                  {jd.label}
                </button>
                <button
                  onClick={() => removeJD(jd.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5"
                  title="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compare All button */}
      {savedJDs.length > 0 && (
        <>
          <button
            onClick={compareAll}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full justify-center"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Compare All
          </button>

          {/* Comparison results table */}
          {comparisons && (
            <>
              <Separator />
              <div className="space-y-1">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
                  <span>Label</span>
                  <span>Match</span>
                  <span>Keywords</span>
                </div>
                {comparisons.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-1 py-1 rounded hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-xs truncate" title={c.label}>{c.label}</span>
                    <span className={`text-xs font-bold ${getMatchColor(c.matchPercentage)}`}>
                      {c.matchPercentage}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.matchedCount}/{c.totalCount}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {savedJDs.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Paste a job description above, then save it here to compare multiple JDs.
        </p>
      )}
    </div>
  );
}
