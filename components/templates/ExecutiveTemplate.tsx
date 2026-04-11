'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function ExecutiveTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-6 border-l-4 pl-4" style={{ borderColor: primaryColor }}>
            <p className="text-[11.5px] leading-relaxed text-gray-600 italic">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-light uppercase tracking-[0.3em] mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[13px] font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-[11px] font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                    {exp.location && <p className="text-[10px] text-gray-400">{exp.location}</p>}
                  </div>
                </div>
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-4 relative before:content-['◆'] before:absolute before:left-0 before:text-[7px] before:top-[2px]" style={{ color: undefined }}>
                        <span className="before:hidden" style={{ color: primaryColor, position: 'absolute', left: 0, fontSize: '7px', top: '2px' }}>◆</span>
                        <span className="text-gray-600">{formatBullet(h)}</span>
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
            <h2 className="text-[14px] font-light uppercase tracking-[0.3em] mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 flex justify-between">
                <div>
                  <h3 className="text-[12px] font-semibold">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h3>
                  <p className="text-[11px] text-gray-600">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                  {edu.gpa && <p className="text-[10px] text-gray-400">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-[10px] text-gray-400">{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-light uppercase tracking-[0.3em] mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Core Competencies
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <h4 className="text-[10px] font-semibold uppercase text-gray-400 mb-1">{skill.category}</h4>
                  <p className="text-[10px] text-gray-700">{skill.items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-light uppercase tracking-[0.3em] mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Key Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <h3 className="text-[12px] font-semibold">{proj.name}</h3>
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] uppercase tracking-wider text-gray-400">{proj.technologies.join(' · ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-600 pl-4 relative">
                        <span style={{ color: primaryColor, position: 'absolute', left: 0, fontSize: '7px', top: '2px' }}>◆</span>
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
            <h2 className="text-[14px] font-light uppercase tracking-[0.3em] mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Certifications
            </h2>
            <div className="space-y-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between text-[11px]">
                  <span className="font-medium">{cert.name} <span className="text-gray-400 font-normal">— {cert.issuer}</span></span>
                  <span className="text-gray-400">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-light uppercase tracking-[0.3em] mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Languages
            </h2>
            <div className="flex gap-6">
              {languages.map((lang) => (
                <div key={lang.id} className="text-[11px]">
                  <span className="font-medium">{lang.name}</span>
                  {lang.proficiency && <span className="text-gray-400 ml-1">({lang.proficiency})</span>}
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
    <div className="bg-white text-black p-10" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
        {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mx-auto mb-2" />}
        <h1 className="text-[30px] font-light tracking-wide" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && <p className="text-[13px] text-gray-500 mt-1 tracking-wider uppercase font-light">{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 mt-3 text-[10px] text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {sectionOrder.map((section) => renderSection(section))}
    </div>
  );
}
