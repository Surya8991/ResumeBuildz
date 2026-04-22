'use client';

import { ResumeData, defaultResumeData } from '@/types/resume';

// ---- Text Extraction ----

async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromHtml(file: File): Promise<string> {
  const html = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  // Remove script and style elements
  doc.querySelectorAll('script, style, noscript').forEach(el => el.remove());
  return doc.body?.textContent?.trim() || '';
}

type PdfItem = { str: string; x: number; y: number; width: number; height: number };

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  // Worker bundled locally at /public/pdfjs/. Removes unpkg CDN dependency —
  // PDF import now works behind corporate firewalls that block unpkg.
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });

    // Extract items with spatial coordinates
    const items: PdfItem[] = [];
    for (const item of content.items) {
      if (!('str' in item) || !(item as Record<string, unknown>).str) continue;
      const raw = item as Record<string, unknown>;
      const transform = raw.transform as number[] | undefined;
      const str = raw.str as string;
      if (!str.trim()) continue;
      items.push({
        str,
        x: transform ? transform[4] : 0,
        y: transform ? viewport.height - transform[5] : 0,
        width: (raw.width as number) || 0,
        height: (raw.height as number) || 0,
      });
    }

    if (items.length === 0) continue;

    // Group items into lines by y-coordinate
    const avgHeight = items.reduce((s, it) => s + it.height, 0) / items.length || 10;
    const yTolerance = avgHeight * 0.45;
    items.sort((a, b) => a.y - b.y || a.x - b.x);

    const lines: PdfItem[][] = [];
    let currentLine: PdfItem[] = [items[0]];
    let currentY = items[0].y;

    for (let j = 1; j < items.length; j++) {
      if (Math.abs(items[j].y - currentY) <= yTolerance) {
        currentLine.push(items[j]);
      } else {
        lines.push(currentLine);
        currentLine = [items[j]];
        currentY = items[j].y;
      }
    }
    lines.push(currentLine);

    // Detect column layout by finding a vertical gap where few items cross
    const columnBoundary = detectColumnBoundary(items, viewport.width);

    if (columnBoundary > 0) {
      // Multi-column: extract each column as separate text block
      // Determine which column is the sidebar (narrower one)
      const leftWidth = columnBoundary;
      const rightWidth = viewport.width - columnBoundary;
      const sidebarIsLeft = leftWidth < rightWidth * 0.7;

      const col1Lines: string[] = [];
      const col2Lines: string[] = [];

      for (const line of lines) {
        const col1Items = line.filter(it => it.x + it.width / 2 < columnBoundary);
        const col2Items = line.filter(it => it.x + it.width / 2 >= columnBoundary);
        if (col1Items.length > 0) {
          col1Items.sort((a, b) => a.x - b.x);
          col1Lines.push(joinLineItems(col1Items));
        }
        if (col2Items.length > 0) {
          col2Items.sort((a, b) => a.x - b.x);
          col2Lines.push(joinLineItems(col2Items));
        }
      }

      // Main content first (wider column), then sidebar
      if (sidebarIsLeft) {
        pages.push([...col2Lines, '', '---', '', ...col1Lines].join('\n'));
      } else {
        pages.push([...col1Lines, '', '---', '', ...col2Lines].join('\n'));
      }
    } else {
      // Single column: join items per line
      const textLines = lines.map(line => {
        line.sort((a, b) => a.x - b.x);
        return joinLineItems(line);
      });
      pages.push(textLines.join('\n'));
    }
  }

  return pages.join('\n\n');
}

/** Detect a column boundary by finding a vertical gap in x-positions where few items exist */
function detectColumnBoundary(items: PdfItem[], pageWidth: number): number {
  if (items.length < 20) return 0;

  // Build histogram of x-positions (which x-ranges have items)
  const bucketSize = 5;
  const buckets = new Array(Math.ceil(pageWidth / bucketSize)).fill(0);
  for (const item of items) {
    const start = Math.floor(item.x / bucketSize);
    const end = Math.floor((item.x + item.width) / bucketSize);
    for (let b = start; b <= end && b < buckets.length; b++) {
      buckets[b]++;
    }
  }

  // Find the widest gap in the middle 20%-80% of the page (skip margins)
  const minBucket = Math.floor(buckets.length * 0.15);
  const maxBucket = Math.floor(buckets.length * 0.75);
  let bestGapStart = -1;
  let bestGapWidth = 0;
  let gapStart = -1;
  let gapWidth = 0;

  for (let b = minBucket; b < maxBucket; b++) {
    if (buckets[b] <= 1) { // Empty or near-empty bucket = gap
      if (gapStart < 0) gapStart = b;
      gapWidth = b - gapStart + 1;
    } else {
      if (gapWidth > bestGapWidth) {
        bestGapStart = gapStart;
        bestGapWidth = gapWidth;
      }
      gapStart = -1;
      gapWidth = 0;
    }
  }
  if (gapWidth > bestGapWidth) {
    bestGapStart = gapStart;
    bestGapWidth = gapWidth;
  }

  // Gap must be at least 3 buckets wide (~15px) to count as column separator
  if (bestGapWidth >= 3 && bestGapStart > 0) {
    return (bestGapStart + bestGapWidth / 2) * bucketSize;
  }

  return 0; // No column boundary found
}

/** Join text items on the same line with appropriate spacing */
function joinLineItems(items: PdfItem[]): string {
  if (items.length === 0) return '';
  let result = items[0].str;
  for (let i = 1; i < items.length; i++) {
    const gap = items[i].x - (items[i - 1].x + items[i - 1].width);
    if (gap > 15) result += '  ' + items[i].str;
    else if (gap > 1) result += ' ' + items[i].str;
    else result += items[i].str;
  }
  return result.trim();
}

async function extractTextFromPlain(file: File): Promise<string> {
  return file.text();
}

// ---- Resume Parser ----

import { SECTION_HEADINGS, SECTION_LOOSE, PARSER_PATTERNS } from './parserConfig';
import { generateId } from './ids';

const EMAIL_RE = PARSER_PATTERNS.email;
const PHONE_RE = PARSER_PATTERNS.phone;
const LINKEDIN_RE = PARSER_PATTERNS.linkedin;
const GITHUB_RE = PARSER_PATTERNS.github;
const LOCATION_RE = PARSER_PATTERNS.location;
const JOB_TITLE_WORDS = PARSER_PATTERNS.jobTitle;
const DATE_RANGE_RE = PARSER_PATTERNS.dateRange;
const BULLET_RE = PARSER_PATTERNS.bullet;

function detectSection(line: string): string | null {
  // Normalize separators: strip symbols, decorators, pipes, dashes, etc.
  const cleaned = line.replace(/[:\-–—|\/\/◇⋄►▸▪●○•■□★☆※#~=_><]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length === 0 || cleaned.length > 60) return null;
  // Strict match on common headings
  for (const [section, re] of Object.entries(SECTION_HEADINGS)) {
    if (re.test(cleaned)) return section;
  }
  // Loose match for shorter strings
  if (cleaned.length < 40) {
    for (const [section, re] of Object.entries(SECTION_LOOSE)) {
      if (re.test(cleaned)) return section;
    }
  }
  return null;
}

function cleanBullet(line: string): string {
  return line.replace(BULLET_RE, '').trim();
}

const CURRENT_RE = /\b(present|current|now|ongoing|to\s*date)\b/i;
type LanguageProficiency = ResumeData['languages'][number]['proficiency'];

const PROFICIENCY_MAP: Record<string, Exclude<LanguageProficiency, ''>> = {
  native: 'Native',
  fluent: 'Fluent',
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  basic: 'Basic',
  beginner: 'Basic',
  proficient: 'Advanced',
  conversational: 'Intermediate',
  bilingual: 'Fluent',
  'mother tongue': 'Native',
  'mother-tongue': 'Native',
  'full professional': 'Fluent',
  'professional working': 'Advanced',
  'limited working': 'Intermediate',
  elementary: 'Basic',
};

const SPOKEN_LANGUAGE_ALIASES: { canonical: string; aliases: string[] }[] = [
  { canonical: 'Mandarin', aliases: ['mandarin chinese', 'mandarin'] },
  { canonical: 'Portuguese', aliases: ['brazilian portuguese', 'portuguese'] },
  { canonical: 'English', aliases: ['english'] },
  { canonical: 'Hindi', aliases: ['hindi'] },
  { canonical: 'Marathi', aliases: ['marathi'] },
  { canonical: 'Tamil', aliases: ['tamil'] },
  { canonical: 'Telugu', aliases: ['telugu'] },
  { canonical: 'Kannada', aliases: ['kannada'] },
  { canonical: 'Malayalam', aliases: ['malayalam'] },
  { canonical: 'Bengali', aliases: ['bengali', 'bangla'] },
  { canonical: 'Gujarati', aliases: ['gujarati'] },
  { canonical: 'Punjabi', aliases: ['punjabi'] },
  { canonical: 'Urdu', aliases: ['urdu'] },
  { canonical: 'Odia', aliases: ['odia', 'oriya'] },
  { canonical: 'Assamese', aliases: ['assamese'] },
  { canonical: 'Sanskrit', aliases: ['sanskrit'] },
  { canonical: 'Konkani', aliases: ['konkani'] },
  { canonical: 'Nepali', aliases: ['nepali'] },
  { canonical: 'French', aliases: ['french'] },
  { canonical: 'Spanish', aliases: ['spanish'] },
  { canonical: 'German', aliases: ['german'] },
  { canonical: 'Chinese', aliases: ['chinese'] },
  { canonical: 'Arabic', aliases: ['arabic'] },
  { canonical: 'Japanese', aliases: ['japanese'] },
  { canonical: 'Korean', aliases: ['korean'] },
  { canonical: 'Russian', aliases: ['russian'] },
  { canonical: 'Italian', aliases: ['italian'] },
  { canonical: 'Dutch', aliases: ['dutch'] },
  { canonical: 'Swedish', aliases: ['swedish'] },
  { canonical: 'Norwegian', aliases: ['norwegian'] },
  { canonical: 'Danish', aliases: ['danish'] },
  { canonical: 'Finnish', aliases: ['finnish'] },
  { canonical: 'Turkish', aliases: ['turkish'] },
  { canonical: 'Greek', aliases: ['greek'] },
  { canonical: 'Thai', aliases: ['thai'] },
  { canonical: 'Vietnamese', aliases: ['vietnamese'] },
  { canonical: 'Indonesian', aliases: ['indonesian', 'bahasa indonesia'] },
  { canonical: 'Malay', aliases: ['malay', 'bahasa malaysia'] },
  { canonical: 'Sinhala', aliases: ['sinhala', 'sinhalese'] },
];

const LANGUAGE_ALIAS_PATTERNS = SPOKEN_LANGUAGE_ALIASES.flatMap(({ canonical, aliases }) =>
  aliases.map((alias) => ({
    canonical,
    alias,
    re: new RegExp(`(^|[^A-Za-z])(${escapeRegExp(alias).replace(/\\ /g, '\\s+')})(?=$|[^A-Za-z])`, 'gi'),
  })),
).sort((a, b) => b.alias.length - a.alias.length);

const PROFICIENCY_RE = new RegExp(
  `\\b(${Object.keys(PROFICIENCY_MAP).map(escapeRegExp).join('|')})\\b`,
  'i',
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function languageProficiencyFrom(text: string): LanguageProficiency {
  const match = text.match(PROFICIENCY_RE);
  return match ? PROFICIENCY_MAP[match[1].toLowerCase()] || '' : '';
}

function cleanLanguageName(text: string): string {
  return text
    .replace(/\b(?:languages?|known|proficiency|skills|speak|read|write|spoken|written)\b/gi, ' ')
    .replace(PROFICIENCY_RE, ' ')
    .replace(/^[\s:()[\]\-–—]+|[\s:()[\]\-–—]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findKnownLanguages(text: string): { canonical: string; index: number; end: number }[] {
  const matches: { canonical: string; index: number; end: number }[] = [];
  for (const { canonical, re } of LANGUAGE_ALIAS_PATTERNS) {
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      const index = match.index + match[1].length;
      const end = index + match[2].length;
      if (!matches.some((item) => index < item.end && end > item.index)) {
        matches.push({ canonical, index, end });
      }
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}

export function parseLanguageLines(lines: string[]): ResumeData['languages'] {
  const languages = new Map<string, { name: string; proficiency: LanguageProficiency }>();
  const chunks = lines
    .flatMap((line) =>
      cleanBullet(line)
        .replace(/^(?:languages?|language\s*(?:known|proficiency|skills))\s*[:\-–—]\s*/i, '')
        .split(/[,;•|/]+|\s+(?:and|&)\s+/i),
    )
    .map((item) => item.trim())
    .filter((item) => item.length > 1 && item.length < 120);

  const addLanguage = (name: string, proficiency: LanguageProficiency) => {
    const cleanedName = cleanLanguageName(name);
    if (!cleanedName || cleanedName.length > 40) return;
    const key = cleanedName.toLowerCase();
    const existing = languages.get(key);
    languages.set(key, {
      name: existing?.name || cleanedName,
      proficiency: existing?.proficiency || proficiency,
    });
  };

  for (const chunk of chunks) {
    const known = findKnownLanguages(chunk);
    if (known.length > 0) {
      known.forEach((match, index) => {
        const next = known[index + 1];
        const segment = chunk.slice(match.index, next?.index ?? chunk.length);
        addLanguage(match.canonical, languageProficiencyFrom(segment));
      });
      continue;
    }

    const m = chunk.match(/^(.+?)\s*[(\-–:]\s*(.+?)\)?\s*$/);
    addLanguage(m ? m[1] : chunk, languageProficiencyFrom(m?.[2] || chunk));
  }

  return Array.from(languages.values()).map((language) => ({
    id: generateId(),
    name: language.name,
    proficiency: language.proficiency,
  }));
}

function parseDateRange(text: string): { start: string; end: string; current: boolean } {
  const match = text.match(DATE_RANGE_RE);
  if (match) {
    const parts = match[0].split(/\s*[-–—]+\s*/);
    return {
      start: parts[0]?.trim() || '',
      end: CURRENT_RE.test(parts[parts.length - 1] || '') ? '' : parts[parts.length - 1]?.trim() || '',
      current: CURRENT_RE.test(parts[parts.length - 1] || ''),
    };
  }
  // Fallback: try to find standalone year or "Month Year"
  const singleDate = text.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}/i);
  if (singleDate) {
    return { start: singleDate[0].trim(), end: '', current: CURRENT_RE.test(text) };
  }
  return { start: '', end: '', current: CURRENT_RE.test(text) };
}

function mergeParagraphLines(lines: string[]): string[] {
  const merged: string[] = [];
  for (const line of lines) {
    const prev = merged.length > 0 ? merged[merged.length - 1] : null;
    if (!prev) { merged.push(line); continue; }
    const isNew = BULLET_RE.test(line) || DATE_RANGE_RE.test(line) || detectSection(line) !== null;
    if (!isNew && !/[.!?]$/.test(prev)) {
      merged[merged.length - 1] = prev + ' ' + line;
    } else {
      merged.push(line);
    }
  }
  return merged;
}

function mergeSkillLines(lines: string[]): string[] {
  const merged: string[] = [];
  for (const line of lines) {
    const prev = merged.length > 0 ? merged[merged.length - 1] : null;
    if (!prev) { merged.push(line); continue; }
    if (prev.endsWith(',') || (/^[^:]+\s*:/.test(prev) && !/^[^:]+\s*:/.test(line) && !BULLET_RE.test(line))) {
      merged[merged.length - 1] = prev + ' ' + line;
    } else {
      merged.push(line);
    }
  }
  return merged;
}

function mergeExperienceLines(lines: string[]): string[] {
  const merged: string[] = [];
  let insideBullet = false;
  for (const line of lines) {
    const prev = merged.length > 0 ? merged[merged.length - 1] : null;
    const isNew = BULLET_RE.test(line) || DATE_RANGE_RE.test(line) || detectSection(line) !== null;
    if (isNew) { insideBullet = BULLET_RE.test(line); merged.push(line); continue; }
    if (insideBullet && prev) { merged[merged.length - 1] = prev + ' ' + line; continue; }
    insideBullet = false;
    merged.push(line);
  }
  return merged;
}

function parseResumeText(rawText: string): ResumeData {
  const data: ResumeData = structuredClone(defaultResumeData);
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return data;

  let firstSectionIdx = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (detectSection(lines[i])) { firstSectionIdx = i; break; }
  }

  // Header / contact info
  const headerLines = lines.slice(0, Math.min(firstSectionIdx, 25));
  const headerText = headerLines.join(' ');

  for (const line of headerLines) {
    const c = line.replace(/[#◇⋄|]/g, '').trim();
    // Check original line for @ (email), not cleaned version
    if (c.length >= 2 && c.length < 50 && !EMAIL_RE.test(line) && !PHONE_RE.test(line) && !LINKEDIN_RE.test(line) && !GITHUB_RE.test(line) && !/^\+?\d/.test(c) && !/^www\b/i.test(c) && !/@/.test(line) && !/^---$/.test(c)) {
      data.personalInfo.fullName = c; break;
    }
  }
  const nameIdx = headerLines.findIndex(l => l.includes(data.personalInfo.fullName));
  for (const line of headerLines.slice(Math.max(nameIdx + 1, 1))) {
    const c = line.replace(/[#@◇⋄|]/g, '').trim();
    if (JOB_TITLE_WORDS.test(c) && c.length < 80 && !EMAIL_RE.test(c) && !PHONE_RE.test(c)) {
      data.personalInfo.jobTitle = c.replace(/[|•⋄◇].*$/, '').trim(); break;
    }
  }
  const em = headerText.match(EMAIL_RE); if (em) data.personalInfo.email = em[0];
  const ph = headerText.match(PHONE_RE); if (ph) data.personalInfo.phone = ph[1].trim();
  const li = headerText.match(LINKEDIN_RE); if (li) data.personalInfo.linkedin = li[0];
  const gh = headerText.match(GITHUB_RE); if (gh) data.personalInfo.github = gh[0];
  const loc = headerText.match(LOCATION_RE); if (loc) data.personalInfo.location = loc[1];

  // Sections — skip '---' separator (used to separate main content from sidebar in multi-column PDFs)
  const sections: Record<string, string[]> = {};
  let currentSection: string | null = null;
  for (const line of lines) {
    if (line === '---') { currentSection = null; continue; }
    const section = detectSection(line);
    if (section) {
      if (section === 'contact') {
        // Contact section: scan for email/phone/links not yet found
        currentSection = '__contact__';
        continue;
      }
      currentSection = section;
      if (!sections[currentSection]) sections[currentSection] = [];
    }
    else if (currentSection === '__contact__') {
      // Extract contact info from sidebar contact section
      if (!data.personalInfo.email) { const m = line.match(EMAIL_RE); if (m) data.personalInfo.email = m[0]; }
      if (!data.personalInfo.phone) { const m = line.match(PHONE_RE); if (m) data.personalInfo.phone = m[1].trim(); }
      if (!data.personalInfo.linkedin) { const m = line.match(LINKEDIN_RE); if (m) data.personalInfo.linkedin = m[0]; }
      if (!data.personalInfo.github) { const m = line.match(GITHUB_RE); if (m) data.personalInfo.github = m[0]; }
      if (!data.personalInfo.location) { const m = line.match(LOCATION_RE); if (m) data.personalInfo.location = m[1]; }
    }
    else if (currentSection) { sections[currentSection].push(line); }
  }

  if (sections.summary) data.summary = mergeParagraphLines(sections.summary).join(' ').trim();

  if (sections.experience) {
    const merged = mergeExperienceLines(sections.experience);
    data.experience = parseEntries(merged).map(e => {
      const dates = parseDateRange(e.headerText);
      return {
        id: generateId(), position: e.title, company: e.subtitle, location: e.location,
        startDate: dates.start, endDate: dates.end, current: dates.current,
        description: '', highlights: e.bullets,
      };
    });
  }

  if (sections.education) {
    data.education = sections.education.filter(l => l.length > 3).reduce((acc, line) => {
      if (/\b(university|college|institute|school|academy|iit|nit)\b/i.test(line)) {
        acc.push({ id: generateId(), institution: line, degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '', highlights: [] });
      } else if (acc.length > 0 && !acc[acc.length - 1].degree && /\b(bachelor|master|phd|b\.?s|m\.?s|b\.?e|m\.?e|b\.?tech|m\.?tech|engineering|diploma)\b/i.test(line)) {
        const m = line.match(/^(.+?)(?:\s+(?:in|of)\s+(.+))?$/i);
        acc[acc.length - 1].degree = m?.[1]?.trim() || line;
        acc[acc.length - 1].field = m?.[2]?.trim() || '';
      }
      return acc;
    }, [] as ResumeData['education']);
  }

  if (sections.skills) {
    const merged = mergeSkillLines(sections.skills);
    const groups: { category: string; items: string[] }[] = [];
    for (const line of merged) {
      const c = cleanBullet(line);
      const catMatch = c.match(/^([^:]+?)\s*:\s*(.+)$/);
      if (catMatch && catMatch[2].includes(',')) {
        groups.push({ category: catMatch[1].trim(), items: catMatch[2].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0) });
      } else {
        const items = c.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 60);
        if (items.length > 1) groups.push({ category: 'Skills', items });
      }
    }
    const mergedMap = new Map<string, string[]>();
    for (const g of groups) { mergedMap.set(g.category, [...(mergedMap.get(g.category) || []), ...g.items]); }
    data.skills = Array.from(mergedMap.entries()).map(([cat, items]) => ({ id: generateId(), category: cat, items: [...new Set(items)] }));
  }

  if (sections.projects) {
    const merged = mergeExperienceLines(sections.projects);
    data.projects = parseEntries(merged).map(e => ({
      id: generateId(), name: e.title, description: e.bullets[0] || '', technologies: [],
      link: '', startDate: '', endDate: '', highlights: e.bullets.slice(1),
    }));
  }

  if (sections.certifications) {
    data.certifications = sections.certifications.filter(l => l.length > 3).map(line => {
      const parts = cleanBullet(line).split(/\s*[-–—]\s*/);
      return { id: generateId(), name: parts[0], issuer: parts[1] || '', date: '', expiryDate: '', credentialId: '', url: '' };
    });
  }

  if (sections.languages) {
    data.languages = parseLanguageLines(sections.languages);
  }

  return data;
}

function parseEntries(lines: string[]): { title: string; subtitle: string; location: string; headerText: string; bullets: string[] }[] {
  const entries: { title: string; subtitle: string; location: string; headerText: string; bullets: string[] }[] = [];
  let cur: typeof entries[0] | null = null;
  for (const line of lines) {
    const isBullet = BULLET_RE.test(line);
    const hasDate = DATE_RANGE_RE.test(line);
    if (isBullet) { if (cur) cur.bullets.push(cleanBullet(line)); continue; }
    if (hasDate && line.length < 150) {
      if (cur) entries.push(cur);
      const withoutDate = line.replace(DATE_RANGE_RE, '').replace(/[-–—|,]+$/, '').trim();
      cur = { title: withoutDate, subtitle: '', location: '', headerText: line, bullets: [] };
    } else if (cur && !cur.subtitle && cur.bullets.length === 0 && line.length < 120) {
      const locM = line.match(LOCATION_RE);
      cur.subtitle = locM ? line.replace(locM[0], '').replace(/[,|]+$/, '').trim() : line;
      if (locM) cur.location = locM[1];
      cur.headerText += ' ' + line;
    } else if (cur && cur.bullets.length > 0 && line.length < 120) {
      entries.push(cur);
      cur = { title: line, subtitle: '', location: '', headerText: line, bullets: [] };
    } else if (cur) { cur.bullets.push(line); }
  }
  if (cur) entries.push(cur);
  return entries;
}

// ---- AI Parsing via Groq ----

import { callGroqAI } from '@/components/ats/utils/groqAI';

async function parseWithAI(rawText: string, apiKey: string): Promise<ResumeData | null> {
  const systemPrompt = `You are a resume parser. Return ONLY valid JSON matching this schema (no markdown):
{"personalInfo":{"fullName":"","jobTitle":"","email":"","phone":"","location":"","linkedin":"","website":"","github":"","photo":""},"summary":"","coverLetter":"","experience":[{"id":"exp-1","company":"","position":"","location":"","startDate":"","endDate":"","current":false,"description":"","highlights":[]}],"education":[{"id":"edu-1","institution":"","degree":"","field":"","location":"","startDate":"","endDate":"","gpa":"","highlights":[]}],"skills":[{"id":"skill-1","category":"","items":[]}],"projects":[{"id":"proj-1","name":"","description":"","technologies":[],"link":"","startDate":"","endDate":"","highlights":[]}],"certifications":[{"id":"cert-1","name":"","issuer":"","date":"","expiryDate":"","credentialId":"","url":""}],"languages":[{"id":"lang-1","name":"","proficiency":"Native|Fluent|Advanced|Intermediate|Basic"}],"customSections":[],"sectionOrder":["summary","experience","education","skills","projects","certifications","languages"]}
Extract ALL bullet points completely. Keep exact text. Use unique IDs. Set current:true for "Present". Return ONLY JSON.`;

  const res = await callGroqAI(systemPrompt, rawText, 4000, 0.1, apiKey);
  if (!res.success || !res.content) return null;

  try {
    let jsonStr = res.content;
    const jsonMatch = res.content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    const parsed = JSON.parse(jsonStr);
    if (!parsed?.personalInfo || typeof parsed.personalInfo !== 'object') return null;
    // Validate arrays to prevent downstream crashes from malformed AI output
    if (parsed.experience && !Array.isArray(parsed.experience)) parsed.experience = [];
    if (parsed.education && !Array.isArray(parsed.education)) parsed.education = [];
    if (parsed.skills && !Array.isArray(parsed.skills)) parsed.skills = [];
    if (parsed.projects && !Array.isArray(parsed.projects)) parsed.projects = [];
    if (parsed.certifications && !Array.isArray(parsed.certifications)) parsed.certifications = [];
    if (parsed.languages && !Array.isArray(parsed.languages)) parsed.languages = [];
    if (!parsed.sectionOrder || !Array.isArray(parsed.sectionOrder)) parsed.sectionOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];
    if (!parsed.customSections || !Array.isArray(parsed.customSections)) parsed.customSections = [];
    if (!parsed.coverLetter) parsed.coverLetter = '';
    if (!parsed.personalInfo.photo) parsed.personalInfo.photo = '';
    return parsed as ResumeData;
  } catch { return null; }
}

// ---- Main Import ----

export type ImportResult = { success: boolean; data?: ResumeData; error?: string; rawText?: string };

export async function importResumeFromFile(file: File): Promise<ImportResult> {
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) return { success: false, error: 'File exceeds 10MB limit.' };

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const supported = ['pdf', 'docx', 'doc', 'txt', 'html', 'htm', 'md'];
  if (!supported.includes(ext)) return { success: false, error: `Unsupported: .${ext}. Use PDF, DOCX, TXT, HTML, or MD.` };

  try {
    let rawText: string;
    if (ext === 'pdf') rawText = await extractTextFromPdf(file);
    else if (ext === 'doc') return { success: false, error: 'Legacy .doc format is not supported. Please save as .docx and try again.' };
    else if (ext === 'docx') rawText = await extractTextFromDocx(file);
    else if (ext === 'html' || ext === 'htm') rawText = await extractTextFromHtml(file);
    else rawText = await extractTextFromPlain(file); // txt and md

    if (!rawText.trim()) return { success: false, error: 'No text extracted. File may be empty.' };

    const groqKey = typeof window !== 'undefined' ? localStorage.getItem('groq-api-key') : null;
    if (groqKey) {
      const aiData = await parseWithAI(rawText, groqKey);
      if (aiData) return { success: true, data: aiData, rawText };
    }

    return { success: true, data: parseResumeText(rawText), rawText };
  } catch (err) {
    return { success: false, error: `Import failed: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}

export const SUPPORTED_IMPORT_FORMATS = '.pdf,.docx,.txt,.html,.htm,.md';

/**
 * Import resume from raw text (paste workflow).
 * Useful for LinkedIn profile pastes, plain text resumes, etc.
 */
export async function importResumeFromText(text: string): Promise<ImportResult> {
  const trimmed = text.trim();
  if (!trimmed) return { success: false, error: 'Please paste some resume text first.' };
  if (trimmed.length > 100000) return { success: false, error: 'Text exceeds 100k characters. Please paste a smaller section.' };

  try {
    const groqKey = typeof window !== 'undefined' ? localStorage.getItem('groq-api-key') : null;
    if (groqKey) {
      const aiData = await parseWithAI(trimmed, groqKey);
      if (aiData) return { success: true, data: aiData, rawText: trimmed };
    }
    return { success: true, data: parseResumeText(trimmed), rawText: trimmed };
  } catch (err) {
    return { success: false, error: `Parse failed: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}
