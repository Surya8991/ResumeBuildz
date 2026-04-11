'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function CompactTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>Summary</h2>
            <p className="text-[9px] leading-snug text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[10px] font-bold">{exp.position}</h3>
                  <span className="text-[8px] text-gray-500 shrink-0 ml-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[9px] text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-0.5 space-y-0">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[9px] text-gray-700 pl-2 relative before:content-['·'] before:absolute before:left-0 before:font-bold" style={{ '--tw-before-color': primaryColor } as React.CSSProperties}>
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
          <div key={key} className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-1.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[10px] font-bold">{edu.institution}</h3>
                  <span className="text-[8px] text-gray-500 shrink-0 ml-2">{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="text-[9px] text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>Skills</h2>
            <div className="space-y-0.5">
              {skills.map((skill) => (
                <div key={skill.id} className="text-[9px]">
                  <span className="font-semibold">{skill.category}: </span>
                  <span className="text-gray-700">{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-1.5">
                <h3 className="text-[10px] font-bold">{proj.name}</h3>
                {proj.description && <p className="text-[9px] text-gray-600">{proj.description}</p>}
                {proj.technologies.length > 0 && <p className="text-[8px] text-gray-500 mt-0.5">Tech: {proj.technologies.join(', ')}</p>}
              </div>
            ))}
          </div>
        ) : null;

      case 'certifications':
        return certifications.length > 0 ? (
          <div key={key} className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="text-[9px] mb-0.5">
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                {cert.date && <span className="text-gray-400 text-[8px]"> ({cert.date})</span>}
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b" style={{ color: primaryColor, borderColor: primaryColor }}>Languages</h2>
            <div className="flex flex-wrap gap-x-4 text-[9px]">
              {languages.map((lang) => (
                <span key={lang.id}>{lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  return (
    <div className="bg-white text-black p-6" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'system-ui, sans-serif' }}>
      {/* Compact header */}
      <div className="mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor }}>
        <div className="flex items-center gap-3">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />}
          <div>
            <h1 className="text-[18px] font-black uppercase tracking-wide" style={{ color: primaryColor }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && <p className="text-[10px] font-medium text-gray-700 mt-0.5">{personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-2 mt-1 text-[8px] text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>| {personalInfo.github}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>
      </div>

      {sectionOrder.map((section) => renderSection(section))}
    </div>
  );
}
