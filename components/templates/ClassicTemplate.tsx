'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function ClassicTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-4">
            <h2 style={{ color: primaryColor, borderBottomColor: primaryColor }} className="text-[13px] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 font-serif">
              Professional Summary
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 style={{ color: primaryColor, borderBottomColor: primaryColor }} className="text-[13px] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 font-serif">
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold">{exp.position}</h3>
                  <span className="text-[10px] text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[11px] text-gray-600 italic">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
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
        ) : null;

      case 'education':
        return education.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 style={{ color: primaryColor, borderBottomColor: primaryColor }} className="text-[13px] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 font-serif">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span className="text-[10px] text-gray-600">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-[11px] text-gray-600 italic">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-[10px] text-gray-600">GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
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
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 style={{ color: primaryColor, borderBottomColor: primaryColor }} className="text-[13px] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 font-serif">
              Skills
            </h2>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-1">
                <span className="text-[11px] font-semibold">{skill.category}: </span>
                <span className="text-[11px] text-gray-700">{skill.items.join(', ')}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 style={{ color: primaryColor, borderBottomColor: primaryColor }} className="text-[13px] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 font-serif">
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold">{proj.name}</h3>
                  {proj.startDate && <span className="text-[10px] text-gray-600">{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</span>}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-[10px] text-gray-500 italic">{proj.technologies.join(', ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
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
        ) : null;

      case 'certifications':
        return certifications.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 style={{ color: primaryColor, borderBottomColor: primaryColor }} className="text-[13px] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 font-serif">
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 flex justify-between">
                <div>
                  <span className="text-[11px] font-semibold">{cert.name}</span>
                  <span className="text-[11px] text-gray-600"> - {cert.issuer}</span>
                </div>
                <span className="text-[10px] text-gray-600">{cert.date}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 style={{ color: primaryColor, borderBottomColor: primaryColor }} className="text-[13px] font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 font-serif">
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {languages.map((lang) => (
                <span key={lang.id} className="text-[11px]">
                  <strong>{lang.name}</strong>{lang.proficiency ? ` - ${lang.proficiency}` : ''}
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
    <div className="bg-white text-black p-8 font-serif" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="text-center mb-4">
        {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mx-auto mb-2" />}
        <h1 style={{ color: primaryColor }} className="text-[22px] font-bold uppercase tracking-wide">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && <p className="text-[13px] text-gray-600 mt-0.5">{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 mt-1.5 text-[10px] text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
          {personalInfo.github && <span>| {personalInfo.github}</span>}
        </div>
      </div>

      {/* Content based on section order */}
      {sectionOrder.map((section) => renderSection(section))}
    </div>
  );
}
