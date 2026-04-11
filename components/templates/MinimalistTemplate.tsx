'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function MinimalistTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-6">
            <p className="text-[11px] leading-relaxed text-gray-600">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-[12px] font-medium text-gray-900">{exp.position}</h3>
                    <p className="text-[10px] text-gray-500">{exp.company}{exp.location ? ` — ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-3 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300 before:text-[10px]">
                        {formatBullet(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return education.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-[12px] font-medium text-gray-900">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h3>
                    <p className="text-[10px] text-gray-500">{edu.institution}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{edu.startDate} — {edu.endDate}</span>
                </div>
                {edu.gpa && <p className="text-[10px] text-gray-400 mt-0.5">{edu.gpa}</p>}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Skills</h2>
            <div className="space-y-1.5">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <span className="text-[10px] font-medium text-gray-700">{skill.category}:</span>
                  <span className="text-[10px] text-gray-500 ml-1.5">{skill.items.join('  ·  ')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <h3 className="text-[12px] font-medium text-gray-900">{proj.name}</h3>
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] text-gray-400">{proj.technologies.join('  ·  ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-3 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300">
                        {formatBullet(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'certifications':
        return certifications.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 text-[10px] text-gray-600">
                {cert.name} — <span className="text-gray-400">{cert.issuer}, {cert.date}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Languages</h2>
            <div className="text-[10px] text-gray-600">
              {languages.map((l) => `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join('  ·  ')}
            </div>
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  return (
    <div className="bg-white text-black p-10" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />}
          <div>
            <h1 className="text-[28px] font-light text-gray-900 tracking-tight">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && <p className="text-[12px] text-gray-500 mt-0.5 tracking-wide">{personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 mt-2 text-[10px] text-gray-400">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
        <div className="mt-3 h-px bg-gray-200" />
      </div>

      {sectionOrder.map((section) => renderSection(section))}
    </div>
  );
}
