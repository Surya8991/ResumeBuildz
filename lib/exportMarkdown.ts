// Markdown and ATS plain-text export for resumes.
//
// Markdown: dev-friendly, version-controllable, GitHub-renderable.
// ATS text:  pure UTF-8 text for pasting into Workday/Greenhouse/Naukri forms
//            that strip formatting but preserve whitespace/newlines.
//
// Neither path uses any library — both are simple string concatenation.

import type { ResumeData } from '@/types/resume';
import { formatBullet } from '@/components/templates/TemplateWrapper';

function fmtDate(exp: { startDate: string; endDate: string; current?: boolean }): string {
  const end = exp.current ? 'Present' : (exp.endDate || 'Present');
  if (!exp.startDate && !exp.endDate) return '';
  return `${exp.startDate || ''} - ${end}`;
}

export function generateMarkdown(data: ResumeData): string {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections, sectionOrder } = data;
  const lines: string[] = [];

  // Header
  if (personalInfo.fullName) lines.push(`# ${personalInfo.fullName}`);
  if (personalInfo.jobTitle) lines.push(`**${personalInfo.jobTitle}**`);
  lines.push('');

  // Contact line
  const contact: string[] = [];
  if (personalInfo.email) contact.push(personalInfo.email);
  if (personalInfo.phone) contact.push(personalInfo.phone);
  if (personalInfo.location) contact.push(personalInfo.location);
  if (personalInfo.linkedin) contact.push(`[LinkedIn](${personalInfo.linkedin})`);
  if (personalInfo.github) contact.push(`[GitHub](${personalInfo.github})`);
  if (personalInfo.website) contact.push(`[Website](${personalInfo.website})`);
  if (contact.length > 0) {
    lines.push(contact.join(' · '));
    lines.push('');
  }

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        if (summary) { lines.push('## Summary', '', summary, ''); }
        break;
      case 'experience':
        if (experience.length > 0) {
          lines.push('## Experience', '');
          for (const exp of experience) {
            lines.push(`### ${exp.position}${exp.company ? ` — ${exp.company}` : ''}`);
            const meta = [fmtDate(exp), exp.location].filter(Boolean).join(' · ');
            if (meta) lines.push(`*${meta}*`);
            lines.push('');
            for (const h of exp.highlights) lines.push(`- ${formatBullet(h)}`);
            lines.push('');
          }
        }
        break;
      case 'education':
        if (education.length > 0) {
          lines.push('## Education', '');
          for (const edu of education) {
            const deg = [edu.degree, edu.field].filter(Boolean).join(' in ');
            lines.push(`### ${deg}${edu.institution ? ` — ${edu.institution}` : ''}`);
            const meta = [fmtDate({ startDate: edu.startDate, endDate: edu.endDate }), edu.location, edu.gpa ? `GPA: ${edu.gpa}` : ''].filter(Boolean).join(' · ');
            if (meta) lines.push(`*${meta}*`);
            lines.push('');
            for (const h of edu.highlights) lines.push(`- ${formatBullet(h)}`);
            if (edu.highlights.length > 0) lines.push('');
          }
        }
        break;
      case 'skills':
        if (skills.length > 0) {
          lines.push('## Skills', '');
          for (const s of skills) {
            if (s.category) lines.push(`**${s.category}:** ${s.items.join(', ')}`);
            else lines.push(s.items.join(', '));
          }
          lines.push('');
        }
        break;
      case 'projects':
        if (projects.length > 0) {
          lines.push('## Projects', '');
          for (const p of projects) {
            lines.push(`### ${p.name}${p.link ? ` — [Link](${p.link})` : ''}`);
            if (p.description) lines.push(p.description);
            if (p.technologies && p.technologies.length > 0) lines.push(`*Tech: ${p.technologies.join(', ')}*`);
            lines.push('');
            for (const h of p.highlights) lines.push(`- ${formatBullet(h)}`);
            if (p.highlights.length > 0) lines.push('');
          }
        }
        break;
      case 'certifications':
        if (certifications.length > 0) {
          lines.push('## Certifications', '');
          for (const c of certifications) {
            const parts = [c.name, c.issuer, c.date].filter(Boolean).join(' — ');
            lines.push(`- ${parts}${c.url ? ` ([link](${c.url}))` : ''}`);
          }
          lines.push('');
        }
        break;
      case 'languages':
        if (languages.length > 0) {
          lines.push('## Languages', '');
          for (const l of languages) {
            lines.push(`- **${l.name}**${l.proficiency ? ` — ${l.proficiency}` : ''}`);
          }
          lines.push('');
        }
        break;
      default:
        if (key.startsWith('custom-')) {
          const customId = key.replace('custom-', '');
          const section = customSections.find((s) => s.id === customId);
          if (section && section.items.length > 0) {
            lines.push(`## ${section.title}`, '');
            for (const item of section.items) {
              const head = [item.title, item.subtitle, item.date].filter(Boolean).join(' — ');
              lines.push(`### ${head}`);
              if (item.description) lines.push(item.description);
              lines.push('');
            }
          }
        }
    }
  };

  for (const key of sectionOrder) renderSection(key);

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * Plain-text ATS export. No markdown syntax, no bullet chars that ATS parsers
 * sometimes choke on. Only ASCII. Preserves section structure via blank lines.
 */
export function generateAtsText(data: ResumeData): string {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections, sectionOrder } = data;
  const lines: string[] = [];

  if (personalInfo.fullName) lines.push(personalInfo.fullName.toUpperCase());
  if (personalInfo.jobTitle) lines.push(personalInfo.jobTitle);

  const contact: string[] = [];
  if (personalInfo.email) contact.push(personalInfo.email);
  if (personalInfo.phone) contact.push(personalInfo.phone);
  if (personalInfo.location) contact.push(personalInfo.location);
  if (personalInfo.linkedin) contact.push(personalInfo.linkedin);
  if (personalInfo.github) contact.push(personalInfo.github);
  if (personalInfo.website) contact.push(personalInfo.website);
  if (contact.length > 0) lines.push(contact.join(' | '));
  lines.push('');

  const heading = (t: string) => {
    lines.push('');
    lines.push(t.toUpperCase());
    lines.push('='.repeat(Math.min(t.length, 60)));
  };

  const render = (key: string) => {
    switch (key) {
      case 'summary':
        if (summary) { heading('Summary'); lines.push(summary); }
        break;
      case 'experience':
        if (experience.length > 0) {
          heading('Experience');
          for (const exp of experience) {
            lines.push(`${exp.position}${exp.company ? `, ${exp.company}` : ''}`);
            const meta = [fmtDate(exp), exp.location].filter(Boolean).join(' | ');
            if (meta) lines.push(meta);
            for (const h of exp.highlights) lines.push(`- ${formatBullet(h)}`);
            lines.push('');
          }
        }
        break;
      case 'education':
        if (education.length > 0) {
          heading('Education');
          for (const edu of education) {
            const deg = [edu.degree, edu.field].filter(Boolean).join(' in ');
            lines.push(`${deg}${edu.institution ? `, ${edu.institution}` : ''}`);
            const meta = [fmtDate({ startDate: edu.startDate, endDate: edu.endDate }), edu.location, edu.gpa ? `GPA: ${edu.gpa}` : ''].filter(Boolean).join(' | ');
            if (meta) lines.push(meta);
            lines.push('');
          }
        }
        break;
      case 'skills':
        if (skills.length > 0) {
          heading('Skills');
          for (const s of skills) {
            if (s.category) lines.push(`${s.category}: ${s.items.join(', ')}`);
            else lines.push(s.items.join(', '));
          }
        }
        break;
      case 'projects':
        if (projects.length > 0) {
          heading('Projects');
          for (const p of projects) {
            lines.push(p.name + (p.link ? ` (${p.link})` : ''));
            if (p.description) lines.push(p.description);
            if (p.technologies && p.technologies.length > 0) lines.push(`Tech: ${p.technologies.join(', ')}`);
            for (const h of p.highlights) lines.push(`- ${formatBullet(h)}`);
            lines.push('');
          }
        }
        break;
      case 'certifications':
        if (certifications.length > 0) {
          heading('Certifications');
          for (const c of certifications) {
            lines.push(`- ${[c.name, c.issuer, c.date].filter(Boolean).join(' - ')}`);
          }
        }
        break;
      case 'languages':
        if (languages.length > 0) {
          heading('Languages');
          for (const l of languages) lines.push(`- ${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`);
        }
        break;
      default:
        if (key.startsWith('custom-')) {
          const customId = key.replace('custom-', '');
          const section = customSections.find((s) => s.id === customId);
          if (section && section.items.length > 0) {
            heading(section.title);
            for (const item of section.items) {
              lines.push([item.title, item.subtitle, item.date].filter(Boolean).join(' - '));
              if (item.description) lines.push(item.description);
              lines.push('');
            }
          }
        }
    }
  };

  for (const key of sectionOrder) render(key);

  // Strip non-ASCII (bullet chars, em-dashes etc.) for strict ATS compatibility.
  return lines
    .join('\n')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2022\u25E6\u2043]/g, '-')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

function download(filename: string, body: string, mime: string) {
  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function downloadMarkdown(data: ResumeData) {
  const name = (data.personalInfo.fullName || 'resume').trim().replace(/\s+/g, '_');
  download(`${name}.md`, generateMarkdown(data), 'text/markdown;charset=utf-8');
}

export function downloadAtsText(data: ResumeData) {
  const name = (data.personalInfo.fullName || 'resume').trim().replace(/\s+/g, '_');
  download(`${name}-ats.txt`, generateAtsText(data), 'text/plain;charset=utf-8');
}
