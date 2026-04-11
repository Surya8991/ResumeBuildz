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

async function extractTextFromPlain(file: File): Promise<string> {
  return file.text();
}

// ---- Resume Parser ----

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const SECTION_HEADINGS: Record<string, RegExp> = {
  summary: /^(?:\/\/\s*)?(?:summary|profile|profile\s*summary|objective|about|about\s*me|professional\s*summary|career\s*summary|career\s*objective)$/i,
  experience: /^(?:\/\/\s*)?(?:experience|work\s*experience|work\s*history|employment|employment\s*history|professional\s*experience)$/i,
  education: /^(?:\/\/\s*)?(?:education|academic\s*background|academics|educational\s*background)$/i,
  skills: /^(?:\/\/\s*)?(?:skills|technical\s*skills|core\s*competencies|competencies|technologies|expertise|key\s*skills)$/i,
  projects: /^(?:\/\/\s*)?(?:projects|personal\s*projects|portfolio|key\s*projects|selected\s*projects)$/i,
  certifications: /^(?:\/\/\s*)?(?:certifications?|certs?|licenses?\s*(?:&|and)?\s*certifications?|credentials?|professional\s*certifications?)$/i,
  languages: /^(?:\/\/\s*)?(?:languages?|language\s*proficiency|language\s*skills)$/i,
};

const SECTION_LOOSE: Record<string, RegExp> = {
  summary: /\b(summary|profile|objective|about)\b/i,
  experience: /\b(experience|employment|work\s*history)\b/i,
  education: /\b(education|academic)\b/i,
  skills: /\b(skills|competencies|technologies|expertise)\b/i,
  projects: /\b(projects|portfolio)\b/i,
  certifications: /\b(certifications?|certs?|licenses?|credentials?)\b/i,
  languages: /\b(languages?)\b/i,
};

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d[\d\s\-().]{7,}\d)/;
const LINKEDIN_RE = /linkedin\.com\/in\/[\w-]+/i;
const GITHUB_RE = /github\.com\/[\w-]+/i;
const LOCATION_RE = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*(?:[A-Z][a-z]+|[A-Z]{2,})(?:\s*\d{5,6})?)/;
const JOB_TITLE_WORDS = /\b(engineer|developer|designer|manager|analyst|consultant|architect|lead|director|specialist|coordinator|intern|student|scientist|administrator|officer|executive|assistant|associate|senior|junior|principal|staff|head|chief|marketing|data|product|seo|digital)\b/i;
const DATE_RANGE_RE = /(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\.?\s*\d{4}|\d{1,2}\/\d{2,4}|\d{4})\s*[-–—]+\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\.?\s*\d{4}|\d{1,2}\/\d{2,4}|\d{4}|present|current|now|ongoing)/i;
const BULLET_RE = /^[•\-\*▸►▪◦‣⁃●○→>]\s+/;

function detectSection(line: string): string | null {
  const cleaned = line.replace(/[:\-–—|\/\/]/g, '').trim();
  if (cleaned.length > 50) return null;
  for (const [section, re] of Object.entries(SECTION_HEADINGS)) {
    if (re.test(cleaned)) return section;
  }
  if (cleaned.length < 35) {
    for (const [section, re] of Object.entries(SECTION_LOOSE)) {
      if (re.test(cleaned)) return section;
    }
  }
  return null;
}

function cleanBullet(line: string): string {
  return line.replace(BULLET_RE, '').trim();
}

function parseDateRange(text: string): { start: string; end: string; current: boolean } {
  const match = text.match(DATE_RANGE_RE);
  if (match) {
    const parts = match[0].split(/\s*[-–—]+\s*/);
    return {
      start: parts[0]?.trim() || '',
      end: /present|current|now|ongoing/i.test(parts[parts.length - 1]) ? '' : parts[parts.length - 1]?.trim() || '',
      current: /present|current|now|ongoing/i.test(parts[parts.length - 1] || ''),
    };
  }
  return { start: '', end: '', current: false };
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
    const c = line.replace(/[#@◇⋄|]/g, '').trim();
    if (c.length >= 3 && c.length < 50 && !EMAIL_RE.test(c) && !PHONE_RE.test(c) && !LINKEDIN_RE.test(c) && !GITHUB_RE.test(c) && !/^\+?\d/.test(c) && !/^www\b/i.test(c)) {
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

  // Sections
  const sections: Record<string, string[]> = {};
  let currentSection: string | null = null;
  for (const line of lines) {
    const section = detectSection(line);
    if (section) { currentSection = section; if (!sections[currentSection]) sections[currentSection] = []; }
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
    const profMap: Record<string, 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'> = {
      native: 'Native', fluent: 'Fluent', advanced: 'Advanced', intermediate: 'Intermediate',
      basic: 'Basic', beginner: 'Basic', proficient: 'Advanced', conversational: 'Intermediate',
    };
    const all = sections.languages.flatMap(l => cleanBullet(l).split(/[,;•|]/).map(s => s.trim())).filter(l => l.length > 1 && l.length < 50);
    data.languages = all.map(l => {
      const m = l.match(/^(.+?)\s*[(\-–:]\s*(.+?)\)?\s*$/);
      return { id: generateId(), name: m ? m[1].trim() : l, proficiency: profMap[(m?.[2] || '').trim().toLowerCase()] || '' };
    });
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

const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function parseWithAI(rawText: string, apiKey: string): Promise<ResumeData | null> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: `You are a resume parser. Return ONLY valid JSON matching this schema (no markdown):
{"personalInfo":{"fullName":"","jobTitle":"","email":"","phone":"","location":"","linkedin":"","website":"","github":"","photo":""},"summary":"","coverLetter":"","experience":[{"id":"exp-1","company":"","position":"","location":"","startDate":"","endDate":"","current":false,"description":"","highlights":[]}],"education":[{"id":"edu-1","institution":"","degree":"","field":"","location":"","startDate":"","endDate":"","gpa":"","highlights":[]}],"skills":[{"id":"skill-1","category":"","items":[]}],"projects":[{"id":"proj-1","name":"","description":"","technologies":[],"link":"","startDate":"","endDate":"","highlights":[]}],"certifications":[{"id":"cert-1","name":"","issuer":"","date":"","expiryDate":"","credentialId":"","url":""}],"languages":[{"id":"lang-1","name":"","proficiency":"Native|Fluent|Advanced|Intermediate|Basic"}],"customSections":[],"sectionOrder":["summary","experience","education","skills","projects","certifications","languages"]}
Extract ALL bullet points completely. Keep exact text. Use unique IDs. Set current:true for "Present". Return ONLY JSON.` },
          { role: 'user', content: rawText },
        ],
        max_tokens: 4000, temperature: 0.1,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    const parsed = JSON.parse(jsonStr);
    if (!parsed?.personalInfo) return null;
    if (!parsed.sectionOrder) parsed.sectionOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'];
    if (!parsed.customSections) parsed.customSections = [];
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
  const supported = ['docx', 'doc', 'txt', 'html', 'htm', 'md'];
  if (!supported.includes(ext)) return { success: false, error: `Unsupported: .${ext}. Use DOCX, TXT, HTML, or MD.` };

  try {
    let rawText: string;
    if (ext === 'docx' || ext === 'doc') rawText = await extractTextFromDocx(file);
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

export const SUPPORTED_IMPORT_FORMATS = '.docx,.doc,.txt,.html,.htm,.md';
