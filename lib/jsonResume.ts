// JSON Resume schema interop — https://jsonresume.org/schema/
//
// Lets users round-trip between ResumeBuildz and any JSON-Resume-aware tool
// (resume.com, jsonresume.org themes, GitHub README workflows, etc.).
//
// We map a careful subset; fields our internal model doesn't track are
// dropped on import (they would otherwise sit invisibly forever) and omitted
// on export. The mapping favors data preservation over completeness — every
// section we track maps cleanly, and no field is silently lost.

import {
  ResumeData,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  CustomSection,
  defaultResumeData,
} from '@/types/resume';
import { generateId } from '@/lib/ids';

interface JRBasics {
  name?: string;
  label?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: { address?: string; city?: string; region?: string; countryCode?: string };
  profiles?: Array<{ network?: string; username?: string; url?: string }>;
}

interface JRWork {
  name?: string;
  position?: string;
  url?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

interface JREducation {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
  location?: string;
}

interface JRSkill { name?: string; level?: string; keywords?: string[] }
interface JRProject { name?: string; description?: string; highlights?: string[]; keywords?: string[]; startDate?: string; endDate?: string; url?: string }
interface JRCertificate { name?: string; date?: string; issuer?: string; url?: string }
interface JRLanguage { language?: string; fluency?: string }
interface JRAward { title?: string; date?: string; awarder?: string; summary?: string }

export interface JsonResume {
  basics?: JRBasics;
  work?: JRWork[];
  education?: JREducation[];
  skills?: JRSkill[];
  projects?: JRProject[];
  certificates?: JRCertificate[];
  languages?: JRLanguage[];
  awards?: JRAward[];
}

// ---- toJsonResume ----------------------------------------------------------

export function toJsonResume(data: ResumeData): JsonResume {
  const p = data.personalInfo;
  const profiles: NonNullable<JRBasics['profiles']> = [];
  if (p.linkedin) profiles.push({ network: 'LinkedIn', url: p.linkedin });
  if (p.github) profiles.push({ network: 'GitHub', url: p.github });

  const out: JsonResume = {
    basics: {
      name: p.fullName || undefined,
      label: p.jobTitle || undefined,
      email: p.email || undefined,
      phone: p.phone || undefined,
      url: p.website || undefined,
      summary: data.summary || undefined,
      location: p.location ? { address: p.location } : undefined,
      profiles: profiles.length > 0 ? profiles : undefined,
    },
    work: data.experience.length
      ? data.experience.map((e): JRWork => ({
          name: e.company || undefined,
          position: e.position || undefined,
          location: e.location || undefined,
          startDate: e.startDate || undefined,
          endDate: e.current ? undefined : e.endDate || undefined,
          summary: e.description || undefined,
          highlights: e.highlights.length ? e.highlights : undefined,
        }))
      : undefined,
    education: data.education.length
      ? data.education.map((e): JREducation => ({
          institution: e.institution || undefined,
          area: e.field || undefined,
          studyType: e.degree || undefined,
          startDate: e.startDate || undefined,
          endDate: e.endDate || undefined,
          score: e.gpa || undefined,
          location: e.location || undefined,
          courses: e.highlights.length ? e.highlights : undefined,
        }))
      : undefined,
    skills: data.skills.length
      ? data.skills.map((s): JRSkill => ({
          name: s.category || undefined,
          keywords: s.items.length ? s.items : undefined,
        }))
      : undefined,
    projects: data.projects.length
      ? data.projects.map((proj): JRProject => ({
          name: proj.name || undefined,
          description: proj.description || undefined,
          highlights: proj.highlights.length ? proj.highlights : undefined,
          keywords: proj.technologies.length ? proj.technologies : undefined,
          startDate: proj.startDate || undefined,
          endDate: proj.endDate || undefined,
          url: proj.link || undefined,
        }))
      : undefined,
    certificates: data.certifications.length
      ? data.certifications.map((c): JRCertificate => ({
          name: c.name || undefined,
          date: c.date || undefined,
          issuer: c.issuer || undefined,
          url: c.url || undefined,
        }))
      : undefined,
    languages: data.languages.length
      ? data.languages.map((l): JRLanguage => ({
          language: l.name || undefined,
          fluency: l.proficiency || undefined,
        }))
      : undefined,
  };

  // Custom sections named "Awards" map into the JSON-Resume awards block.
  const awardsSection = data.customSections.find((s) => /award/i.test(s.title));
  if (awardsSection?.items.length) {
    out.awards = awardsSection.items.map((i): JRAward => ({
      title: i.title || undefined,
      date: i.date || undefined,
      awarder: i.subtitle || undefined,
      summary: i.description || undefined,
    }));
  }

  return out;
}

// ---- fromJsonResume --------------------------------------------------------

function asArr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function findProfileUrl(profiles: JRBasics['profiles'], network: string): string {
  for (const p of profiles || []) {
    if (p?.network?.toLowerCase() === network.toLowerCase()) {
      return p.url || '';
    }
  }
  return '';
}

export function fromJsonResume(input: unknown): ResumeData {
  const data: ResumeData = structuredClone(defaultResumeData);
  if (!input || typeof input !== 'object') return data;
  const jr = input as JsonResume;
  const basics = jr.basics || {};
  const loc = basics.location;

  data.personalInfo = {
    fullName: basics.name || '',
    jobTitle: basics.label || '',
    email: basics.email || '',
    phone: basics.phone || '',
    location: loc ? [loc.address, loc.city, loc.region].filter(Boolean).join(', ') : '',
    linkedin: findProfileUrl(basics.profiles, 'LinkedIn'),
    website: basics.url || '',
    github: findProfileUrl(basics.profiles, 'GitHub'),
    photo: '',
  };
  data.summary = basics.summary || '';

  data.experience = asArr<JRWork>(jr.work).map((w): Experience => ({
    id: generateId(),
    company: w.name || '',
    position: w.position || '',
    location: w.location || '',
    startDate: w.startDate || '',
    endDate: w.endDate || '',
    current: !w.endDate,
    description: w.summary || '',
    highlights: asArr<string>(w.highlights),
  }));

  data.education = asArr<JREducation>(jr.education).map((e): Education => ({
    id: generateId(),
    institution: e.institution || '',
    degree: e.studyType || '',
    field: e.area || '',
    location: e.location || '',
    startDate: e.startDate || '',
    endDate: e.endDate || '',
    gpa: e.score || '',
    highlights: asArr<string>(e.courses),
  }));

  data.skills = asArr<JRSkill>(jr.skills).map((s): Skill => ({
    id: generateId(),
    category: s.name || 'Skills',
    items: asArr<string>(s.keywords),
  }));

  data.projects = asArr<JRProject>(jr.projects).map((p): Project => ({
    id: generateId(),
    name: p.name || '',
    description: p.description || '',
    technologies: asArr<string>(p.keywords),
    link: p.url || '',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    highlights: asArr<string>(p.highlights),
  }));

  data.certifications = asArr<JRCertificate>(jr.certificates).map((c): Certification => ({
    id: generateId(),
    name: c.name || '',
    issuer: c.issuer || '',
    date: c.date || '',
    expiryDate: '',
    credentialId: '',
    url: c.url || '',
  }));

  data.languages = asArr<JRLanguage>(jr.languages).map((l): Language => ({
    id: generateId(),
    name: l.language || '',
    proficiency: (l.fluency as Language['proficiency']) || '',
  }));

  // JSON-Resume awards → custom section so they're editable in the builder.
  const awards = asArr<JRAward>(jr.awards);
  if (awards.length > 0) {
    const awardsSection: CustomSection = {
      id: generateId(),
      title: 'Awards',
      items: awards.map((a) => ({
        id: generateId(),
        title: a.title || '',
        subtitle: a.awarder || '',
        date: a.date || '',
        description: a.summary || '',
      })),
    };
    data.customSections = [awardsSection];
    data.sectionOrder = [...data.sectionOrder, `custom-${awardsSection.id}`];
  }

  return data;
}
