// Pure, testable bullet quality scorer used by the builder's live feedback
// panels. Takes a single bullet string and (optionally) its sibling bullets
// so it can flag duplicate openers inside a role. Returns a 0-100 score,
// a traffic-light grade, and a list of concrete issues the user can act on.

export type BulletGrade = 'green' | 'yellow' | 'red';

export interface BulletIssue {
  id: string;
  severity: 'error' | 'warn' | 'info';
  message: string;
  fix?: string;
}

export interface BulletScore {
  score: number;
  grade: BulletGrade;
  issues: BulletIssue[];
  suggestions: string[];
}

// Weak openers that should be replaced with strong action verbs. The value
// array is ordered roughly by how aggressive the rewrite is — pick the
// first that fits your context.
export const WEAK_OPENERS: Record<string, string[]> = {
  'responsible for': ['Led', 'Owned', 'Managed', 'Drove'],
  'in charge of': ['Led', 'Directed', 'Managed'],
  'worked on': ['Built', 'Shipped', 'Developed', 'Delivered'],
  'helped': ['Enabled', 'Supported', 'Accelerated', 'Contributed to'],
  'helped with': ['Enabled', 'Supported', 'Contributed to'],
  'assisted': ['Supported', 'Enabled', 'Partnered on'],
  'involved in': ['Led', 'Contributed to', 'Drove'],
  'duties included': ['Led', 'Owned', 'Delivered'],
  'tasked with': ['Led', 'Owned', 'Delivered'],
  'was': ['[start with verb]'],
};

// Common filler / weasel words that dilute bullets.
const FLUFF = [
  'various', 'multiple', 'several', 'many', 'some',
  'a lot of', 'tons of', 'stuff', 'things',
  'very', 'really', 'quite', 'basically', 'actually', 'just',
  'etc', 'etc.',
];

// Numeric patterns that count as a quantified metric. At least one must
// match for the bullet to claim a measurable outcome.
const METRIC_REGEX = /(\d+(?:[.,]\d+)?\s*(?:%|percent|k|m|b|x|hrs?|hours?|days?|weeks?|months?|years?|yrs?)?|\$\d|\d+\+|\d+\/\d+)/i;

function firstWord(s: string): string {
  const trimmed = s.trim().replace(/^[-*.·•]\s*/, '');
  const match = trimmed.match(/^[A-Za-z']+/);
  return match ? match[0] : '';
}

function detectWeakOpener(bullet: string): { phrase: string; suggestions: string[] } | null {
  const lower = bullet.trim().toLowerCase().replace(/^[-*.·•]\s*/, '');
  for (const phrase of Object.keys(WEAK_OPENERS)) {
    if (lower.startsWith(phrase + ' ') || lower === phrase) {
      return { phrase, suggestions: WEAK_OPENERS[phrase] };
    }
  }
  return null;
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function hasMetric(s: string): boolean {
  return METRIC_REGEX.test(s);
}

function hasFluff(s: string): string[] {
  const lower = ' ' + s.toLowerCase() + ' ';
  return FLUFF.filter((w) => lower.includes(' ' + w + ' '));
}

function startsWithVerb(s: string): boolean {
  const fw = firstWord(s);
  if (!fw) return false;
  // Rough heuristic: strong action verbs are usually 3+ chars and end in -ed,
  // -d (past tense) or are known verbs. Short words like "is", "was", "be"
  // are caught by the weak opener map. Pronouns are rejected.
  const pronouns = ['i', 'we', 'my', 'our', 'they', 'he', 'she', 'it'];
  if (pronouns.includes(fw.toLowerCase())) return false;
  return fw.length >= 3;
}

export function evaluateBullet(
  raw: string,
  opts: { siblings?: string[] } = {}
): BulletScore {
  const bullet = raw.trim();
  const issues: BulletIssue[] = [];
  const suggestions: string[] = [];

  if (!bullet) {
    return { score: 0, grade: 'red', issues, suggestions };
  }

  const words = countWords(bullet);
  const weak = detectWeakOpener(bullet);
  const hasNum = hasMetric(bullet);
  const fluffHits = hasFluff(bullet);
  const verbStart = !weak && startsWithVerb(bullet);

  // 1. Action verb at start — 25 pts
  let verbScore = 0;
  if (verbStart) verbScore = 25;
  if (weak) {
    issues.push({
      id: 'weak-opener',
      severity: 'error',
      message: `Starts with weak phrase "${weak.phrase}"`,
      fix: `Try: ${weak.suggestions.slice(0, 3).join(', ')}`,
    });
    suggestions.push(...weak.suggestions);
  } else if (!verbStart) {
    issues.push({
      id: 'no-verb',
      severity: 'warn',
      message: 'Should start with a strong action verb',
      fix: 'Lead with Built, Led, Shipped, Drove, Designed...',
    });
  }

  // 2. Quantified metric — 30 pts
  const metricScore = hasNum ? 30 : 0;
  if (!hasNum) {
    issues.push({
      id: 'no-metric',
      severity: 'warn',
      message: 'No measurable outcome',
      fix: 'Add a number: % improvement, $ impact, count, time saved',
    });
  }

  // 3. Length — 15 pts (sweet spot 8-28 words)
  let lenScore = 0;
  if (words >= 8 && words <= 28) lenScore = 15;
  else if (words >= 6 && words <= 35) lenScore = 8;
  if (words < 6) {
    issues.push({ id: 'too-short', severity: 'warn', message: `Too short (${words} words)`, fix: 'Add context: what, how, impact' });
  } else if (words > 35) {
    issues.push({ id: 'too-long', severity: 'warn', message: `Too long (${words} words)`, fix: 'Split into two bullets or trim the setup' });
  }

  // 4. Specificity — 15 pts (has a proper noun, tech, or product)
  const properNounMatches = bullet.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || [];
  // Ignore first word since sentence-start capitalisation is automatic
  const specificTokens = properNounMatches.filter((_, i) => i > 0 || bullet.indexOf(_) > 0);
  const specScore = specificTokens.length > 0 ? 15 : 0;
  if (!specScore) {
    issues.push({ id: 'no-specifics', severity: 'info', message: 'Add specifics', fix: 'Name the stack, product, framework, or team (Kubernetes, Stripe, etc.)' });
  }

  // 5. No fluff — 15 pts
  const fluffScore = fluffHits.length === 0 ? 15 : Math.max(0, 15 - fluffHits.length * 5);
  if (fluffHits.length) {
    issues.push({ id: 'fluff', severity: 'info', message: `Filler words: ${fluffHits.slice(0, 3).join(', ')}`, fix: 'Remove or replace with specifics' });
  }

  // Duplicate opener across siblings (detected when evaluator is fed peers)
  if (opts.siblings && opts.siblings.length >= 2) {
    const myVerb = firstWord(bullet).toLowerCase();
    if (myVerb) {
      const matches = opts.siblings.filter((s) => firstWord(s).toLowerCase() === myVerb).length;
      if (matches >= 2) {
        issues.push({
          id: 'duplicate-opener',
          severity: 'warn',
          message: `"${myVerb}" starts ${matches + 1} bullets in this role`,
          fix: 'Vary the opener: Led, Drove, Shipped, Built, Designed, Scaled, Reduced, Grew',
        });
      }
    }
  }

  const score = Math.min(100, verbScore + metricScore + lenScore + specScore + fluffScore);
  const grade: BulletGrade = score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red';

  return { score, grade, issues, suggestions };
}

// Quick helpers for the UI.
export function gradeColor(g: BulletGrade): string {
  if (g === 'green') return 'text-emerald-600';
  if (g === 'yellow') return 'text-amber-600';
  return 'text-red-600';
}

export function gradeBg(g: BulletGrade): string {
  if (g === 'green') return 'bg-emerald-500';
  if (g === 'yellow') return 'bg-amber-500';
  return 'bg-red-500';
}
