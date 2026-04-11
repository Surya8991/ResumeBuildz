'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function ProfessionalTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h2 className="text-[13px] font-bold uppercase">Summary</h2>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-700 ml-4">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h2 className="text-[13px] font-bold uppercase">Experience</h2>
            </div>
            <div className="ml-4">
              {experience.map((exp) => (
                <div key={exp.id} className="mb-3 border-l-2 border-gray-200 pl-3">
                  <h3 className="text-[12px] font-bold">{exp.position}</h3>
                  <p className="text-[11px]" style={{ color: primaryColor }}>{exp.company}</p>
                  <p className="text-[10px] text-gray-500">
                    {exp.location && `${exp.location} | `}{exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['■'] before:absolute before:left-0 before:text-[6px] before:top-[3px]" style={{ '--tw-before-color': primaryColor } as React.CSSProperties}>
                          {formatBullet(h)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return education.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h2 className="text-[13px] font-bold uppercase">Education</h2>
            </div>
            <div className="ml-4">
              {education.map((edu) => (
                <div key={edu.id} className="mb-2 border-l-2 border-gray-200 pl-3">
                  <h3 className="text-[12px] font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-[11px]" style={{ color: primaryColor }}>{edu.institution}</p>
                  <p className="text-[10px] text-gray-500">{edu.startDate} - {edu.endDate}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h2 className="text-[13px] font-bold uppercase">Technical Skills</h2>
            </div>
            <div className="ml-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <span className="text-[10px] font-bold uppercase text-gray-500">{skill.category}</span>
                  <p className="text-[11px] text-gray-700">{skill.items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h2 className="text-[13px] font-bold uppercase">Projects</h2>
            </div>
            <div className="ml-4">
              {projects.map((proj) => (
                <div key={proj.id} className="mb-3 border-l-2 border-gray-200 pl-3">
                  <h3 className="text-[12px] font-bold">{proj.name}</h3>
                  {proj.technologies.length > 0 && (
                    <p className="text-[10px]" style={{ color: primaryColor }}>{proj.technologies.join(' | ')}</p>
                  )}
                  {proj.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {proj.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['■'] before:absolute before:left-0 before:text-[6px] before:top-[3px]">
                          {formatBullet(h)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'certifications':
        return certifications.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h2 className="text-[13px] font-bold uppercase">Certifications</h2>
            </div>
            <div className="ml-4 space-y-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between text-[11px]">
                  <span><strong>{cert.name}</strong> — {cert.issuer}</span>
                  <span className="text-gray-500">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h2 className="text-[13px] font-bold uppercase">Languages</h2>
            </div>
            <div className="ml-4 flex flex-wrap gap-3">
              {languages.map((lang) => (
                <span key={lang.id} className="text-[11px] px-2 py-0.5 rounded border border-gray-200">
                  {lang.name}{lang.proficiency ? ` — ${lang.proficiency}` : ''}
                </span>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  return (
    <div className="bg-white text-black" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="px-8 py-6" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-4">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />}
          <div>
            <h1 className="text-[24px] font-bold text-white">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && <p className="text-[13px] text-white/80 mt-0.5">{personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 mt-2 text-[10px] text-white/70">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      <div className="px-8 py-6">
        {sectionOrder.map((section) => renderSection(section))}
      </div>
    </div>
  );
}
