'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function CorporateTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
              Executive Summary
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-4">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[11px] text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">
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
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-4">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-[11px] text-gray-600">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-[10px] text-gray-500">GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">
                        {formatBullet(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
              Core Competencies
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {skills.map((skill) => (
                <div key={skill.id} className="border-l-2 pl-2" style={{ borderColor: `${primaryColor}40` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: primaryColor }}>{skill.category}</p>
                  <p className="text-[10px] text-gray-700">{skill.items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
              Key Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-semibold text-gray-900">{proj.name}</h3>
                  {proj.startDate && <span className="text-[10px] text-gray-500 shrink-0 ml-4">{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</span>}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-[10px] text-gray-500">{proj.technologies.join(', ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">
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
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
              Professional Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 flex justify-between">
                <div>
                  <span className="text-[11px] font-semibold">{cert.name}</span>
                  <span className="text-[11px] text-gray-600"> — {cert.issuer}</span>
                </div>
                <span className="text-[10px] text-gray-500">{cert.date}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider pb-1.5 mb-2 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
              Languages
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className="text-[11px] border-l-2 pl-2" style={{ borderColor: `${primaryColor}40` }}>
                  <span className="font-semibold">{lang.name}</span>
                  {lang.proficiency && <span className="text-gray-500 block text-[10px]">{lang.proficiency}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  return (
    <div className="bg-white text-black" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header with navy top bar */}
      <div className="h-2" style={{ backgroundColor: primaryColor }} />
      <div className="px-10 py-5 border-b" style={{ borderColor: `${primaryColor}20` }}>
        <div className="flex items-center gap-4">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-200" />}
          <div className="flex-1">
            <h1 className="text-[20px] font-semibold tracking-wide" style={{ color: primaryColor }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && <p className="text-[12px] text-gray-600 mt-0.5">{personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-2 mt-3 text-[10px] text-gray-500">
          {personalInfo.email && <span className="border-r pr-2" style={{ borderColor: `${primaryColor}30` }}>{personalInfo.email}</span>}
          {personalInfo.phone && <span className="border-r pr-2" style={{ borderColor: `${primaryColor}30` }}>{personalInfo.phone}</span>}
          {personalInfo.location && <span className="border-r pr-2" style={{ borderColor: `${primaryColor}30` }}>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="border-r pr-2" style={{ borderColor: `${primaryColor}30` }}>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="border-r pr-2" style={{ borderColor: `${primaryColor}30` }}>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="px-10 py-5">
        {sectionOrder.map((s) => renderSection(s))}
      </div>
    </div>
  );
}
