'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function TimelineTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Summary
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Experience
            </h2>
            <div className="relative ml-3">
              {/* Vertical line */}
              <div className="absolute left-0 top-1 bottom-1 w-0.5" style={{ backgroundColor: `${primaryColor}30` }} />
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4 pl-6 relative">
                  {/* Circle dot */}
                  <div className="absolute left-[-4px] top-[4px] w-[9px] h-[9px] rounded-full border-2 bg-white" style={{ borderColor: primaryColor }} />
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-bold text-gray-900">{exp.position}</h3>
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <p className="text-[11px] text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    <span className="text-[10px] font-medium shrink-0 ml-3" style={{ color: primaryColor }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Education
            </h2>
            <div className="relative ml-3">
              {/* Vertical line */}
              <div className="absolute left-0 top-1 bottom-1 w-0.5" style={{ backgroundColor: `${primaryColor}30` }} />
              {education.map((edu) => (
                <div key={edu.id} className="mb-3 pl-6 relative">
                  {/* Circle dot */}
                  <div className="absolute left-[-4px] top-[4px] w-[9px] h-[9px] rounded-full border-2 bg-white" style={{ borderColor: primaryColor }} />
                  <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <p className="text-[11px] text-gray-600">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                    <span className="text-[10px] font-medium shrink-0 ml-3" style={{ color: primaryColor }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                  {edu.gpa && <p className="text-[10px] text-gray-500 mt-0.5">GPA: {edu.gpa}</p>}
                  {edu.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {edu.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Skills
            </h2>
            <div className="space-y-1.5">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <span className="text-[11px] font-semibold" style={{ color: primaryColor }}>{skill.category}: </span>
                  <span className="text-[11px] text-gray-700">{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Projects
            </h2>
            <div className="relative ml-3">
              <div className="absolute left-0 top-1 bottom-1 w-0.5" style={{ backgroundColor: `${primaryColor}30` }} />
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4 pl-6 relative">
                  <div className="absolute left-[-4px] top-[4px] w-[9px] h-[9px] rounded-full border-2 bg-white" style={{ borderColor: primaryColor }} />
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[12px] font-bold text-gray-900">{proj.name}</h3>
                    {proj.startDate && (
                      <span className="text-[10px] font-medium shrink-0 ml-3" style={{ color: primaryColor }}>
                        {proj.startDate}{proj.endDate ? ` — ${proj.endDate}` : ''}
                      </span>
                    )}
                  </div>
                  {proj.technologies.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5">{proj.technologies.join(', ')}</p>
                  )}
                  {proj.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {proj.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1.5 flex justify-between">
                <div>
                  <span className="text-[11px] font-semibold">{cert.name}</span>
                  <span className="text-[11px] text-gray-600"> — {cert.issuer}</span>
                </div>
                <span className="text-[10px] font-medium" style={{ color: primaryColor }}>{cert.date}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {languages.map((lang) => (
                <span key={lang.id} className="text-[11px]">
                  <strong>{lang.name}</strong>{lang.proficiency ? ` — ${lang.proficiency}` : ''}
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
    <div className="bg-white text-black p-8" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
        {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover border-2" style={{ borderColor: primaryColor }} />}
        <div className="flex-1">
          <h1 className="text-[22px] font-bold" style={{ color: primaryColor }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && <p className="text-[13px] text-gray-600 mt-0.5">{personalInfo.jobTitle}</p>}
          <div className="flex flex-wrap gap-x-3 mt-1.5 text-[10px] text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
            {personalInfo.website && <span>| {personalInfo.website}</span>}
            {personalInfo.github && <span>| {personalInfo.github}</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      {sectionOrder.map((s) => renderSection(s))}
    </div>
  );
}
