'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function BoldTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            <div className="py-1.5 px-3 mb-2" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-[14px] font-black uppercase tracking-widest text-white">
                Summary
              </h2>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-700 px-1">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="py-1.5 px-3 mb-2" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-[14px] font-black uppercase tracking-widest text-white">
                Experience
              </h2>
            </div>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3 px-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[13px] font-extrabold text-gray-900">{exp.position}</h3>
                  <span className="text-[10px] font-bold text-gray-500">{exp.startDate} &mdash; {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[11px] font-bold text-gray-600">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-4 relative before:content-['■'] before:absolute before:left-0 before:text-[8px] before:top-[2px]" style={{ '--tw-before-color': primaryColor } as React.CSSProperties}>
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
            <div className="py-1.5 px-3 mb-2" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-[14px] font-black uppercase tracking-widest text-white">
                Education
              </h2>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 px-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-extrabold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span className="text-[10px] font-bold text-gray-500">{edu.startDate} &mdash; {edu.endDate}</span>
                </div>
                <p className="text-[11px] font-bold text-gray-600">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-[10px] font-semibold text-gray-500">GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-4 relative before:content-['■'] before:absolute before:left-0 before:text-[8px] before:top-[2px]">
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
            <div className="py-1.5 px-3 mb-2" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-[14px] font-black uppercase tracking-widest text-white">
                Skills
              </h2>
            </div>
            <div className="px-1 space-y-1">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <span className="text-[11px] font-extrabold text-gray-900">{skill.category}: </span>
                  <span className="text-[11px] text-gray-700">{skill.items.join(' / ')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="py-1.5 px-3 mb-2" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-[14px] font-black uppercase tracking-widest text-white">
                Projects
              </h2>
            </div>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3 px-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-extrabold text-gray-900">{proj.name}</h3>
                  {proj.startDate && <span className="text-[10px] font-bold text-gray-500">{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</span>}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-[10px] font-bold text-gray-500">{proj.technologies.join(' / ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-4 relative before:content-['■'] before:absolute before:left-0 before:text-[8px] before:top-[2px]">
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
            <div className="py-1.5 px-3 mb-2" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-[14px] font-black uppercase tracking-widest text-white">
                Certifications
              </h2>
            </div>
            <div className="px-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-1 flex justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold">{cert.name}</span>
                    <span className="text-[11px] text-gray-600 font-bold"> &mdash; {cert.issuer}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="py-1.5 px-3 mb-2" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-[14px] font-black uppercase tracking-widest text-white">
                Languages
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 px-1">
              {languages.map((lang) => (
                <span key={lang.id} className="text-[11px]">
                  <span className="font-extrabold">{lang.name}</span>{lang.proficiency ? ` - ${lang.proficiency}` : ''}
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
    <div className="bg-white text-black" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header with dark background */}
      <div className="px-8 py-6" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-4">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/30" />}
          <div>
            <h1 className="text-[28px] font-black uppercase tracking-wider text-white leading-tight">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-[14px] font-extrabold text-white/80 uppercase tracking-wide mt-0.5">{personalInfo.jobTitle}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 text-[10px] text-white/80 font-bold">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* Thick divider */}
      <div className="h-1.5" style={{ backgroundColor: primaryColor, opacity: 0.6 }} />

      {/* Content */}
      <div className="px-8 py-5">
        {sectionOrder.map((s) => renderSection(s))}
      </div>
    </div>
  );
}
