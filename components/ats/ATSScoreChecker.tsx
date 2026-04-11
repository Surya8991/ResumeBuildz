'use client';

import { useState, useMemo } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle, XCircle, Info, Target, Sparkles } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface ATSCheck {
  label: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

function useATSScore() {
  const { resumeData } = useResumeStore();
  const checks: ATSCheck[] = [];
  let score = 0;
  const maxScore = 100;

  // Contact info completeness (15 pts)
  const { personalInfo } = resumeData;
  const contactFields = [personalInfo.fullName, personalInfo.email, personalInfo.phone, personalInfo.location];
  const contactFilled = contactFields.filter(Boolean).length;
  if (contactFilled === 4) {
    checks.push({ label: 'Contact Information', status: 'pass', message: 'All essential contact details provided' });
    score += 15;
  } else if (contactFilled >= 2) {
    checks.push({ label: 'Contact Information', status: 'warn', message: `Missing ${4 - contactFilled} contact field(s). Add name, email, phone, and location.` });
    score += 8;
  } else {
    checks.push({ label: 'Contact Information', status: 'fail', message: 'Missing essential contact information' });
  }

  // Professional summary (10 pts)
  if (resumeData.summary.length > 50) {
    checks.push({ label: 'Professional Summary', status: 'pass', message: 'Good summary length for ATS parsing' });
    score += 10;
  } else if (resumeData.summary.length > 0) {
    checks.push({ label: 'Professional Summary', status: 'warn', message: 'Summary is too short. Aim for 2-4 sentences.' });
    score += 5;
  } else {
    checks.push({ label: 'Professional Summary', status: 'fail', message: 'Add a professional summary to improve ATS matching' });
  }

  // Work experience (25 pts)
  if (resumeData.experience.length > 0) {
    const hasDescriptions = resumeData.experience.every((e) => e.highlights.length > 0);
    const hasDates = resumeData.experience.every((e) => e.startDate);
    if (hasDescriptions && hasDates) {
      checks.push({ label: 'Work Experience', status: 'pass', message: `${resumeData.experience.length} position(s) with descriptions and dates` });
      score += 25;
    } else {
      checks.push({ label: 'Work Experience', status: 'warn', message: 'Add bullet points and dates to all positions' });
      score += 15;
    }
  } else {
    checks.push({ label: 'Work Experience', status: 'fail', message: 'Add at least one work experience entry' });
  }

  // Education (15 pts)
  if (resumeData.education.length > 0) {
    checks.push({ label: 'Education', status: 'pass', message: 'Education section present' });
    score += 15;
  } else {
    checks.push({ label: 'Education', status: 'warn', message: 'Consider adding education' });
    score += 5;
  }

  // Skills (20 pts)
  if (resumeData.skills.length > 0) {
    const totalSkills = resumeData.skills.reduce((acc, s) => acc + s.items.length, 0);
    if (totalSkills >= 5) {
      checks.push({ label: 'Skills', status: 'pass', message: `${totalSkills} skills across ${resumeData.skills.length} categories` });
      score += 20;
    } else {
      checks.push({ label: 'Skills', status: 'warn', message: 'Add more skills. ATS systems match keywords from job descriptions.' });
      score += 10;
    }
  } else {
    checks.push({ label: 'Skills', status: 'fail', message: 'Skills section is critical for ATS keyword matching' });
  }

  // Bullet points with action verbs (10 pts)
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built', 'launched', 'increased', 'reduced', 'improved', 'achieved', 'delivered', 'collaborated', 'established', 'optimized', 'streamlined', 'spearheaded', 'mentored', 'analyzed'];
  const allHighlights = resumeData.experience.flatMap((e) => e.highlights);
  const hasActionVerbs = allHighlights.some((h) => actionVerbs.some((v) => h.toLowerCase().includes(v)));
  if (allHighlights.length > 0 && hasActionVerbs) {
    checks.push({ label: 'Action Verbs', status: 'pass', message: 'Bullet points use strong action verbs' });
    score += 10;
  } else if (allHighlights.length > 0) {
    checks.push({ label: 'Action Verbs', status: 'warn', message: 'Start bullet points with action verbs (Led, Developed, Managed, etc.)' });
    score += 5;
  }

  // Quantified achievements (5 pts)
  const hasNumbers = allHighlights.some((h) => /\d+%|\$\d+|\d+\+/.test(h));
  if (hasNumbers) {
    checks.push({ label: 'Quantified Results', status: 'pass', message: 'Achievements include measurable results' });
    score += 5;
  } else if (allHighlights.length > 0) {
    checks.push({ label: 'Quantified Results', status: 'warn', message: 'Add numbers/metrics (e.g., "Increased sales by 25%")' });
  }

  return { score: Math.min(score, maxScore), maxScore, checks };
}

// ---- Job Description Keyword Matcher ----

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
  'should', 'may', 'might', 'must', 'can', 'could', 'of', 'in', 'to', 'for', 'with',
  'on', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about',
  'also', 'well', 'up', 'you', 'your', 'we', 'our', 'they', 'their', 'this',
  'that', 'these', 'those', 'it', 'its', 'i', 'me', 'my', 'myself', 'he', 'him',
  'his', 'she', 'her', 'who', 'whom', 'which', 'what', 'if', 'while', 'etc',
  'ability', 'experience', 'work', 'working', 'role', 'team', 'years', 'year',
  'including', 'strong', 'looking', 'seeking', 'join', 'apply', 'position',
  'company', 'required', 'preferred', 'qualifications', 'requirements',
  'responsibilities', 'benefits', 'salary', 'equal', 'opportunity', 'employer',
]);

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().replace(/[^a-z0-9\s\-+#.]/g, ' ').split(/\s+/);
  const keywords = new Set<string>();

  for (const word of words) {
    const clean = word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
    if (clean.length >= 2 && !STOP_WORDS.has(clean)) {
      keywords.add(clean);
    }
  }

  // Also extract multi-word phrases (bigrams) for tech terms
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`.replace(/[^a-z0-9\s\-+#.]/g, '').trim();
    if (bigram.length >= 5 && /[a-z]/.test(bigram)) {
      keywords.add(bigram);
    }
  }

  return Array.from(keywords);
}

function getResumeText(resumeData: ResumeData): string {
  const parts: string[] = [
    resumeData.personalInfo.fullName,
    resumeData.personalInfo.jobTitle,
    resumeData.summary,
    ...resumeData.experience.flatMap((e) => [e.position, e.company, e.description, ...e.highlights]),
    ...resumeData.education.flatMap((e) => [e.institution, e.degree, e.field, ...e.highlights]),
    ...resumeData.skills.flatMap((s) => [s.category, ...s.items]),
    ...resumeData.projects.flatMap((p) => [p.name, p.description, ...p.technologies, ...p.highlights]),
    ...resumeData.certifications.map((c) => `${c.name} ${c.issuer}`),
    ...resumeData.languages.map((l) => l.name),
  ];
  return parts.join(' ').toLowerCase();
}

interface KeywordMatch {
  keyword: string;
  found: boolean;
}

function useKeywordMatch(jobDescription: string) {
  const { resumeData } = useResumeStore();

  return useMemo(() => {
    if (!jobDescription.trim()) return null;

    const jdKeywords = extractKeywords(jobDescription);
    const resumeText = getResumeText(resumeData);

    const matches: KeywordMatch[] = jdKeywords
      .filter((kw) => kw.length >= 3) // skip very short
      .map((keyword) => ({
        keyword,
        found: resumeText.includes(keyword),
      }))
      // Sort: missing first, then found
      .sort((a, b) => (a.found === b.found ? 0 : a.found ? 1 : -1));

    const foundCount = matches.filter((m) => m.found).length;
    const matchPercentage = matches.length > 0 ? Math.round((foundCount / matches.length) * 100) : 0;

    return { matches, foundCount, totalCount: matches.length, matchPercentage };
  }, [jobDescription, resumeData]);
}

// ---- Component ----

export default function ATSScoreChecker() {
  const { score, maxScore, checks } = useATSScore();
  const [jobDescription, setJobDescription] = useState('');
  const keywordResult = useKeywordMatch(jobDescription);

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

  return (
    <div className="space-y-5">
      {/* ---- ATS Score ---- */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Info className="h-4 w-4" /> ATS Compatibility Score
        </h3>

        <div className="flex justify-center py-3">
          <div className={`w-24 h-24 rounded-full border-4 ${getScoreRing()} flex flex-col items-center justify-center`}>
            <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-[10px] text-muted-foreground">/ {maxScore}</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mb-3">
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
                  <span className="text-xs font-medium">{check.label}</span>
                  <Badge variant={check.status === 'pass' ? 'default' : check.status === 'warn' ? 'secondary' : 'destructive'} className="text-[9px] px-1 py-0">
                    {check.status === 'pass' ? 'Pass' : check.status === 'warn' ? 'Improve' : 'Missing'}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{check.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ---- Job Description Matcher ---- */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" /> Job Description Match
        </h3>

        <div className="space-y-2">
          <Label className="text-xs">Paste a job description to check keyword match</Label>
          <Textarea
            placeholder="Paste the job description here to see how well your resume matches..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[100px] text-xs resize-none"
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
                <p className="text-xs font-medium">
                  {keywordResult.foundCount} of {keywordResult.totalCount} keywords matched
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {keywordResult.matchPercentage >= 70
                    ? 'Great match! Your resume aligns well with this job.'
                    : keywordResult.matchPercentage >= 40
                    ? 'Decent match. Add missing keywords to improve your chances.'
                    : 'Low match. Consider tailoring your resume to this job description.'}
                </p>
              </div>
            </div>

            {/* Missing keywords */}
            {keywordResult.matches.filter((m) => !m.found).length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-red-600 mb-1.5 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Missing Keywords
                </p>
                <div className="flex flex-wrap gap-1">
                  {keywordResult.matches
                    .filter((m) => !m.found)
                    .slice(0, 30)
                    .map((m, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900">
                        {m.keyword}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Found keywords */}
            {keywordResult.matches.filter((m) => m.found).length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-green-600 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Matched Keywords
                </p>
                <div className="flex flex-wrap gap-1">
                  {keywordResult.matches
                    .filter((m) => m.found)
                    .slice(0, 30)
                    .map((m, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900">
                        {m.keyword}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!keywordResult && (
          <Card className="mt-3 p-3 bg-muted/30 border-dashed">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Paste a job description above to see which keywords from the listing appear in your resume.
                Tailoring your resume to each job posting can significantly improve your ATS score.
              </p>
            </div>
          </Card>
        )}
      </section>

      <Separator />

      {/* Tips */}
      <Card className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <h4 className="text-xs font-semibold mb-1.5">ATS Tips</h4>
        <ul className="text-[10px] text-muted-foreground space-y-0.5">
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
