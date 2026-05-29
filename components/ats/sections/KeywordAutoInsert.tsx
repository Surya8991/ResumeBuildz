'use client';

import { useMemo, useState, useCallback } from 'react';
import { Clipboard, Check } from 'lucide-react';

interface KeywordAutoInsertProps {
  missingKeywords: string[];
}

type SectionType = 'skills' | 'experience' | 'summary' | 'education';

const EDUCATION_TERMS = /\b(degree|bachelor|master|university|certified|certification|diploma|phd|mba|accredited|academic|coursework|gpa)\b/i;

// Known tech acronyms — exclude false positives like "NBA", "USA", "CEO" that
// would otherwise match the generic "ALL CAPS 2-10 chars" rule below.
const TECH_ACRONYMS = new Set([
  'API', 'APIS', 'REST', 'GRAPHQL', 'GRPC', 'SOAP', 'HTTP', 'HTTPS', 'TCP', 'UDP', 'SSH', 'SSL', 'TLS',
  'SQL', 'NOSQL', 'CSS', 'HTML', 'XML', 'JSON', 'YAML', 'TOML', 'CSV', 'XSS', 'CSRF', 'JWT', 'OAUTH',
  'AWS', 'GCP', 'IBM', 'ETL', 'ELT', 'CI', 'CD', 'CICD', 'CI/CD', 'DNS', 'CDN', 'VPC', 'IAM', 'S3', 'EC2', 'RDS', 'SNS', 'SQS',
  'IDE', 'CLI', 'GUI', 'SDK', 'ORM', 'MVC', 'MVP', 'MVVM', 'SPA', 'PWA', 'SSR', 'SSG', 'CSR', 'WCAG', 'ARIA',
  'AI', 'ML', 'NLP', 'LLM', 'CV', 'RAG', 'GAN', 'GPU', 'CPU', 'RAM', 'TPU',
  'TDD', 'BDD', 'DRY', 'SOLID', 'OOP', 'FP', 'KPI', 'OKR', 'SLA', 'SLO', 'SLI', 'MTTR', 'MTTF',
  'GIT', 'SVN', 'NPM', 'YARN', 'PNPM', 'GO', 'RUST', 'JAVA', 'C++', 'C#', 'F#',
]);

const ACTION_VERBS = new Set([
  'led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built',
  'launched', 'increased', 'reduced', 'improved', 'achieved', 'delivered',
  'collaborated', 'established', 'optimized', 'streamlined', 'spearheaded',
  'mentored', 'analyzed', 'coordinated', 'facilitated', 'executed', 'directed',
  'supervised', 'trained', 'negotiated', 'presented', 'resolved', 'initiated',
  'transformed', 'accelerated', 'pioneered', 'orchestrated', 'oversaw',
]);

function classifyKeyword(keyword: string): SectionType {
  const lower = keyword.toLowerCase().trim();
  const upper = keyword.trim().toUpperCase();

  // Tech terms -> skills
  if (
    /\.(js|ts|py|rb|go|rs|cs|java|net)$/i.test(keyword) ||
    /\+\+|#/.test(keyword) ||
    // Allowlisted tech acronym (avoids false positives like "NBA" / "CEO").
    TECH_ACRONYMS.has(upper)
  ) {
    return 'skills';
  }

  // Action verbs -> experience
  if (ACTION_VERBS.has(lower)) {
    return 'experience';
  }

  // Education terms -> education
  if (EDUCATION_TERMS.test(lower)) {
    return 'education';
  }

  // Default -> summary
  return 'summary';
}

const SECTION_COLORS: Record<SectionType, { bg: string; text: string; border: string }> = {
  skills: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-900',
  },
  experience: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-900',
  },
  summary: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900',
  },
  education: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900',
  },
};

const SECTION_LABELS: Record<SectionType, string> = {
  skills: 'Skills',
  experience: 'Experience',
  summary: 'Summary',
  education: 'Education',
};

export default function KeywordAutoInsert({ missingKeywords }: KeywordAutoInsertProps) {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const groups: Record<SectionType, string[]> = {
      skills: [],
      experience: [],
      summary: [],
      education: [],
    };

    for (const keyword of missingKeywords) {
      const section = classifyKeyword(keyword);
      groups[section].push(keyword);
    }

    return groups;
  }, [missingKeywords]);

  const handleCopy = useCallback(async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopiedKeyword(keyword);
      setTimeout(() => setCopiedKeyword(null), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = keyword;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKeyword(keyword);
      setTimeout(() => setCopiedKeyword(null), 1500);
    }
  }, []);

  if (missingKeywords.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-2">
        No missing keywords to suggest. Great job!
      </p>
    );
  }

  const sectionOrder: SectionType[] = ['skills', 'experience', 'summary', 'education'];

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Click a keyword to copy it to clipboard, then paste it into the appropriate section.
      </p>

      {sectionOrder.map((section) => {
        const keywords = grouped[section];
        if (keywords.length === 0) return null;

        const colors = SECTION_COLORS[section];

        return (
          <div key={section} className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1.5">
              <span className={`inline-block w-2 h-2 rounded-full ${colors.bg} border ${colors.border}`} />
              {SECTION_LABELS[section]}
              <span className="text-muted-foreground font-normal">({keywords.length})</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {keywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => handleCopy(kw)}
                  className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border} hover:opacity-80 transition-opacity cursor-pointer`}
                  title={`Copy "${kw}" to clipboard`}
                >
                  {copiedKeyword === kw ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3 w-3" />
                      {kw}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
