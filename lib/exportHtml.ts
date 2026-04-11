import { ResumeData } from '@/types/resume';

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatBullet(text: string): string {
  return escapeHtml(text.replace(/^[•\-\*]\s*/, ''));
}

function sanitizeColor(color: string): string {
  return /^#[0-9A-Fa-f]{3,8}$/.test(color) ? color : '#2563eb';
}

export function generateResumeHtml(data: ResumeData, primaryColor: string): string {
  primaryColor = sanitizeColor(primaryColor);
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.website) contactParts.push(personalInfo.website);
  if (personalInfo.github) contactParts.push(personalInfo.github);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(personalInfo.fullName || 'Resume')} - Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 40px 30px; }
  h1 { font-size: 28px; color: ${primaryColor}; margin-bottom: 4px; }
  .job-title { font-size: 14px; color: #666; margin-bottom: 8px; }
  .contact { font-size: 12px; color: #888; margin-bottom: 24px; }
  .contact span { margin-right: 12px; }
  h2 { font-size: 15px; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid ${primaryColor}; padding-bottom: 4px; margin: 20px 0 12px; }
  h3 { font-size: 14px; font-weight: 600; }
  .meta { font-size: 12px; color: #666; }
  .entry { margin-bottom: 16px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  ul { padding-left: 20px; margin-top: 6px; }
  li { font-size: 13px; margin-bottom: 3px; color: #444; }
  .skills-category { margin-bottom: 6px; }
  .skills-category strong { font-size: 13px; }
  .skills-category span { font-size: 13px; color: #555; }
  .cert-row, .lang-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
  .tech { font-size: 11px; color: #888; font-style: italic; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>${escapeHtml(personalInfo.fullName || 'Your Name')}</h1>
${personalInfo.jobTitle ? `<div class="job-title">${escapeHtml(personalInfo.jobTitle)}</div>` : ''}
<div class="contact">${contactParts.map(c => `<span>${escapeHtml(c)}</span>`).join(' | ')}</div>
`;

  if (summary) {
    html += `<h2>Professional Summary</h2>\n<p style="font-size:13px;color:#444;">${escapeHtml(summary)}</p>\n`;
  }

  if (experience.length > 0) {
    html += `<h2>Professional Experience</h2>\n`;
    for (const exp of experience) {
      html += `<div class="entry">
  <div class="entry-header">
    <h3>${escapeHtml(exp.position)}</h3>
    <span class="meta">${escapeHtml(exp.startDate)} - ${exp.current ? 'Present' : escapeHtml(exp.endDate)}</span>
  </div>
  <div class="meta">${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
  ${exp.highlights.length > 0 ? `<ul>${exp.highlights.map(h => `<li>${formatBullet(h)}</li>`).join('\n')}</ul>` : ''}
</div>\n`;
    }
  }

  if (education.length > 0) {
    html += `<h2>Education</h2>\n`;
    for (const edu of education) {
      html += `<div class="entry">
  <div class="entry-header">
    <h3>${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}</h3>
    <span class="meta">${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate)}</span>
  </div>
  <div class="meta">${escapeHtml(edu.institution)}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}${edu.gpa ? ` | GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
  ${edu.highlights.length > 0 ? `<ul>${edu.highlights.map(h => `<li>${formatBullet(h)}</li>`).join('\n')}</ul>` : ''}
</div>\n`;
    }
  }

  if (skills.length > 0) {
    html += `<h2>Skills</h2>\n`;
    for (const skill of skills) {
      html += `<div class="skills-category"><strong>${escapeHtml(skill.category)}:</strong> <span>${skill.items.map(i => escapeHtml(i)).join(', ')}</span></div>\n`;
    }
  }

  if (projects.length > 0) {
    html += `<h2>Projects</h2>\n`;
    for (const proj of projects) {
      html += `<div class="entry">
  <div class="entry-header">
    <h3>${escapeHtml(proj.name)}</h3>
    ${proj.startDate ? `<span class="meta">${escapeHtml(proj.startDate)}${proj.endDate ? ` - ${escapeHtml(proj.endDate)}` : ''}</span>` : ''}
  </div>
  ${proj.technologies.length > 0 ? `<div class="tech">${proj.technologies.map(t => escapeHtml(t)).join(' | ')}</div>` : ''}
  ${proj.highlights.length > 0 ? `<ul>${proj.highlights.map(h => `<li>${formatBullet(h)}</li>`).join('\n')}</ul>` : ''}
</div>\n`;
    }
  }

  if (certifications.length > 0) {
    html += `<h2>Certifications</h2>\n`;
    for (const cert of certifications) {
      html += `<div class="cert-row"><span><strong>${escapeHtml(cert.name)}</strong> — ${escapeHtml(cert.issuer)}</span><span class="meta">${escapeHtml(cert.date)}</span></div>\n`;
    }
  }

  if (languages.length > 0) {
    html += `<h2>Languages</h2>\n`;
    html += `<div>${languages.map(l => `<span style="margin-right:16px;font-size:13px;"><strong>${escapeHtml(l.name)}</strong>${l.proficiency ? ` — ${escapeHtml(l.proficiency)}` : ''}</span>`).join('')}</div>\n`;
  }

  html += `</body>\n</html>`;
  return html;
}

export function downloadHtml(data: ResumeData, primaryColor: string) {
  const html = generateResumeHtml(data, primaryColor);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personalInfo.fullName || 'resume'}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
