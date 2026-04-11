'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Target, Sparkles, BarChart3, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HelpTip } from '@/components/ui/help-tip';

// Hooks
import { useATSScore, type ATSCheck } from './hooks/useATSScore';
import { useKeywordMatch } from './hooks/useKeywordMatch';
import { useReadabilityScore } from './hooks/useReadabilityScore';
import { useFormattingWarnings } from './hooks/useFormattingWarnings';
import { useActiveVoice } from './hooks/useActiveVoice';

// Sections
import SectionScoreBreakdown from './sections/SectionScoreBreakdown';
import ReadabilityScore from './sections/ReadabilityScore';
import FormattingWarnings from './sections/FormattingWarnings';
import IndustryKeywords from './sections/IndustryKeywords';
import ResumeLengthCheck from './sections/ResumeLengthCheck';
import DateConsistency from './sections/DateConsistency';
import ActiveVoiceDetector from './sections/ActiveVoiceDetector';
import JDComparison from './sections/JDComparison';
import MultiJDMatching from './sections/MultiJDMatching';
import KeywordAutoInsert from './sections/KeywordAutoInsert';

// Utils
import { getResumeText } from './utils/textAnalysis';
import { callGroqAI, getGroqApiKey } from './utils/groqAI';

export default function ATSScoreChecker() {
  const { resumeData } = useResumeStore();
  const { score, maxScore, checks, sectionScores } = useATSScore();
  const [jobDescription, setJobDescription] = useState('');
  const keywordResult = useKeywordMatch(jobDescription);
  const readability = useReadabilityScore();
  const formattingWarnings = useFormattingWarnings();
  const passiveVoiceFlags = useActiveVoice();

  // AI gap analysis state
  const [aiGapAnalysis, setAiGapAnalysis] = useState('');
  const [aiGapLoading, setAiGapLoading] = useState(false);

  const resumeText = getResumeText(resumeData);

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreRing = () => {
    if (score >= 80) return 'border-green-500';
    if (score >= 50) return 'border-yellow-500';
    return 'border-red-500';
  };

  const getIcon = (status: ATSCheck['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500 shrink-0" />;
    }
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 70) return 'text-green-600';
    if (pct >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchRing = (pct: number) => {
    if (pct >= 70) return 'border-green-500';
    if (pct >= 40) return 'border-yellow-500';
    return 'border-red-500';
  };

  const handleAIGapAnalysis = async () => {
    if (!keywordResult || !jobDescription.trim()) return;
    setAiGapLoading(true);
    setAiGapAnalysis('');
    const missing = keywordResult.matches.filter(m => !m.found).map(m => m.keyword).slice(0, 20);
    const result = await callGroqAI(
      'You are an ATS optimization expert. Give concise, actionable advice in 3-5 bullet points. No preamble.',
      `Resume summary: ${resumeData.summary}\n\nJob description keywords missing from resume: ${missing.join(', ')}\n\nSuggest how to naturally incorporate these missing keywords into the resume. Be specific about which section to add them to.`,
      400,
      0.7
    );
    if (result.success && result.content) setAiGapAnalysis(result.content);
    else setAiGapAnalysis(result.error || 'Failed to generate analysis');
    setAiGapLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* ---- ATS Score ---- */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Info className="h-4 w-4" /> ATS Compatibility Score
          <HelpTip text="ATS (Applicant Tracking System) scans your resume for keywords, formatting, and structure. Score 80+ means your resume is well-optimized. Each check awards points based on content quality." />
        </h3>

        <div className="flex justify-center py-3">
          <div className={`w-24 h-24 rounded-full border-4 ${getScoreRing()} flex flex-col items-center justify-center`}>
            <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-xs text-muted-foreground">/ {maxScore}</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-3">
          {score === 0 ? 'Start filling in your resume to see your ATS score improve.' :
           score >= 80 ? 'Excellent! Your resume is well-optimized for ATS.' :
           score >= 50 ? 'Good start, but there\'s room for improvement.' :
           'Your resume needs more content to pass ATS screening.'}
        </p>

        <div className="space-y-1.5">
          {checks.map((check, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              {getIcon(check.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{check.label}</span>
                  <Badge variant={check.status === 'pass' ? 'default' : check.status === 'warn' ? 'secondary' : 'destructive'} className="text-[10px] px-1.5 py-0">
                    {check.status === 'pass' ? 'Pass' : check.status === 'warn' ? 'Improve' : 'Missing'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{check.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section Score Breakdown */}
        <div className="mt-4">
          <SectionScoreBreakdown sectionScores={sectionScores} />
        </div>
      </section>

      <Separator />

      {/* ---- Enhanced Analysis (Accordion) ---- */}
      <Accordion>
        <AccordionItem value="enhanced-analysis">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Enhanced Analysis
              <HelpTip text="Readability scoring, resume length, formatting warnings, date consistency, and active voice detection. Expand to see detailed analysis of your resume quality." />
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-5 pt-2">
              <ReadabilityScore />
              <Separator />
              <ResumeLengthCheck />
              <Separator />
              <FormattingWarnings />
              <Separator />
              <DateConsistency />
              <Separator />
              <ActiveVoiceDetector />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* ---- Job Description Matcher ---- */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" /> Job Description Match
          <HelpTip text="Paste a job description to see which keywords appear in your resume. Aim for 70%+ match. Missing keywords are shown in red — add them to your Skills or Experience sections." />
        </h3>

        <div className="space-y-2">
          <Label className="text-sm">Paste a job description to check keyword match</Label>
          <Textarea
            placeholder="Paste the job description here to see how well your resume matches..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[100px] text-sm resize-none"
          />
        </div>

        {keywordResult && (
          <div className="mt-4 space-y-3">
            {/* Match score */}
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 rounded-full border-[3px] ${getMatchRing(keywordResult.matchPercentage)} flex flex-col items-center justify-center shrink-0`}>
                <span className={`text-lg font-bold ${getMatchColor(keywordResult.matchPercentage)}`}>{keywordResult.matchPercentage}%</span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {keywordResult.foundCount} of {keywordResult.totalCount} keywords matched
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {keywordResult.matchPercentage >= 70
                    ? 'Great match! Your resume aligns well with this job.'
                    : keywordResult.matchPercentage >= 40
                    ? 'Decent match. Add missing keywords to improve your chances.'
                    : 'Low match. Consider tailoring your resume to this job description.'}
                </p>
              </div>
            </div>

            {/* Missing keywords with density */}
            {keywordResult.matches.filter((m) => !m.found).length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-1.5 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Missing Keywords
                </p>
                <div className="flex flex-wrap gap-1">
                  {keywordResult.matches
                    .filter((m) => !m.found)
                    .slice(0, 30)
                    .map((m, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900">
                        {m.keyword}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Found keywords with occurrence count */}
            {keywordResult.matches.filter((m) => m.found).length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Matched Keywords
                </p>
                <div className="flex flex-wrap gap-1">
                  {keywordResult.matches
                    .filter((m) => m.found)
                    .slice(0, 30)
                    .map((m, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900">
                        {m.keyword}{m.occurrences > 1 && <span className="ml-1 opacity-70">×{m.occurrences}</span>}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Keyword Auto-Insert Suggestions */}
            {keywordResult.matches.filter(m => !m.found).length > 0 && (
              <>
                <Separator />
                <KeywordAutoInsert missingKeywords={keywordResult.matches.filter(m => !m.found).map(m => m.keyword)} />
              </>
            )}

            {/* AI Gap Analysis */}
            {getGroqApiKey() && keywordResult.matches.filter(m => !m.found).length > 0 && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1.5"
                  onClick={handleAIGapAnalysis}
                  disabled={aiGapLoading}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {aiGapLoading ? 'Analyzing...' : 'AI Gap Analysis'}
                </Button>
                {aiGapAnalysis && (
                  <Card className="mt-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed font-sans">{aiGapAnalysis}</pre>
                  </Card>
                )}
              </div>
            )}

            {/* JD Comparison View */}
            <JDComparison
              resumeText={resumeText}
              jobDescription={jobDescription}
              keywordMatches={keywordResult.matches}
            />
          </div>
        )}

        {!keywordResult && (
          <Card className="mt-3 p-3 bg-muted/30 border-dashed">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste a job description above to see which keywords from the listing appear in your resume.
                Tailoring your resume to each job posting can significantly improve your ATS score.
              </p>
            </div>
          </Card>
        )}
      </section>

      <Separator />

      {/* ---- Smart Matching (Accordion - open by default) ---- */}
      <Accordion defaultValue={['smart-matching']}>
        <AccordionItem value="smart-matching">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Smart Matching
              <HelpTip text="Search 20 industries and 201 roles to find keywords ATS systems scan for. Save multiple job descriptions to compare match scores across different positions." />
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-5 pt-2">
              <IndustryKeywords />
              <Separator />
              <MultiJDMatching
                jobDescription={jobDescription}
                onLoadJD={(text) => setJobDescription(text)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Tips */}
      <Card className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <h4 className="text-sm font-semibold mb-1.5">ATS Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-0.5">
          <li>Use standard section headings (Experience, Education, Skills)</li>
          <li>Avoid tables, columns, images, and headers/footers in PDF</li>
          <li>Use keywords from the job description</li>
          <li>Stick to standard fonts and simple formatting</li>
          <li>Save as PDF for consistent parsing</li>
        </ul>
      </Card>
    </div>
  );
}
