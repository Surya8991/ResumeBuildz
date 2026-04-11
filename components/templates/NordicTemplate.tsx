'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function NordicTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3 pb-2" style={{ color: primaryColor, borderBottom: `0.5px solid ${primaryColor}30` }}>
              About
            </h2>
            <p className="text-[11px] leading-[1.8] text-gray-600">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3 pb-2" style={{ color: primaryColor, borderBottom: `0.5px solid ${primaryColor}30` }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-semibold text-gray-800">{exp.position}</h3>
                  <span className="text-[9px] text-gray-400 tracking-wide">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-600 pl-3 relative leading-[1.7]" style={{ borderLeft: `1px solid ${primaryColor}25` }}>
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
          <div key={key} className="mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3 pb-2" style={{ color: primaryColor, borderBottom: `0.5px solid ${primaryColor}30` }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-semibold text-gray-800">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h3>
                  <span className="text-[9px] text-gray-400 tracking-wide">{edu.startDate} — {edu.endDate}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-[9px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-600 pl-3 leading-[1.7]" style={{ borderLeft: `1px solid ${primaryColor}25` }}>
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
          <div key={key} className="mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3 pb-2" style={{ color: primaryColor, borderBottom: `0.5px solid ${primaryColor}30` }}>
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">{skill.category}</p>
                  <p className="text-[10px] text-gray-600">{skill.items.join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3 pb-2" style={{ color: primaryColor, borderBottom: `0.5px solid ${primaryColor}30` }}>
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-semibold text-gray-800">{proj.name}</h3>
                  {proj.startDate && <span className="text-[9px] text-gray-400 tracking-wide">{proj.startDate}{proj.endDate ? ` — ${proj.endDate}` : ''}</span>}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] text-gray-400 mt-0.5">{proj.technologies.join(' · ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-600 pl-3 leading-[1.7]" style={{ borderLeft: `1px solid ${primaryColor}25` }}>
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
          <div key={key} className="mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3 pb-2" style={{ color: primaryColor, borderBottom: `0.5px solid ${primaryColor}30` }}>
              Certifications
            </h2>
            <div className="space-y-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-700">{cert.name}</span>
                    <span className="text-[10px] text-gray-400"> — {cert.issuer}</span>
                  </div>
                  <span className="text-[9px] text-gray-400">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3 pb-2" style={{ color: primaryColor, borderBottom: `0.5px solid ${primaryColor}30` }}>
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="text-[10px]">
                  <span className="font-semibold text-gray-700">{lang.name}</span>
                  {lang.proficiency && <span className="text-gray-400 ml-1">{lang.proficiency}</span>}
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
    <div className="bg-white text-black px-12 py-10" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header - minimal Nordic style */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover" />}
          <div>
            <h1 className="text-[20px] font-light tracking-wide text-gray-800">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && <p className="text-[11px] font-medium tracking-wider uppercase text-gray-400 mt-1">{personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="mt-4 pt-3" style={{ borderTop: `0.5px solid ${primaryColor}20` }}>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[9px] text-gray-400 tracking-wide">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
            {personalInfo.github && <span>{personalInfo.github}</span>}
          </div>
        </div>
      </div>

      {/* Content - lots of breathing room */}
      {sectionOrder.map((s) => renderSection(s))}
    </div>
  );
}
