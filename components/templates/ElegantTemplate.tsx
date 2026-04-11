'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function ElegantTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const sectionTitle = (title: string) => (
    <div className="mb-2.5 flex items-center gap-3">
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap" style={{ color: primaryColor }}>{title}</h2>
      <div className="flex-1 h-px" style={{ backgroundColor: `${primaryColor}30` }} />
    </div>
  );

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            {sectionTitle('Profile')}
            <p className="text-[10.5px] leading-relaxed text-gray-600 italic">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            {sectionTitle('Experience')}
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11.5px] font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-[9px] text-gray-400 shrink-0 ml-2 tracking-wide">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[10px] mt-0.5" style={{ color: primaryColor }}>{exp.company}{exp.location ? `  ·  ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-600 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300">
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
            {sectionTitle('Education')}
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-semibold text-gray-900">{edu.institution}</h3>
                  <span className="text-[9px] text-gray-400 shrink-0 ml-2">{edu.startDate} — {edu.endDate}</span>
                </div>
                <p className="text-[10px] text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? `  ·  GPA: ${edu.gpa}` : ''}</p>
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-500 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300">{formatBullet(h)}</li>
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
            {sectionTitle('Expertise')}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{skill.category}</p>
                  <p className="text-[10px] text-gray-700">{skill.items.join('  ·  ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            {sectionTitle('Projects')}
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <h3 className="text-[11px] font-semibold text-gray-900">{proj.name}</h3>
                {proj.description && <p className="text-[10px] text-gray-600 mt-0.5">{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] mt-1" style={{ color: primaryColor }}>{proj.technologies.join('  ·  ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-600 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300">{formatBullet(h)}</li>
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
            {sectionTitle('Certifications')}
            <div className="space-y-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-baseline gap-2 text-[10px]">
                  <span className="text-gray-800 font-medium">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-400">—</span>}
                  {cert.issuer && <span className="text-gray-500">{cert.issuer}</span>}
                  {cert.date && <span className="text-gray-400 text-[9px]">({cert.date})</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            {sectionTitle('Languages')}
            <div className="flex flex-wrap gap-x-6 text-[10px]">
              {languages.map((lang) => (
                <span key={lang.id} className="text-gray-700">
                  {lang.name}{lang.proficiency ? <span className="text-gray-400 ml-1">({lang.proficiency})</span> : ''}
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
    <div className="bg-white text-black p-10" style={{ width: '210mm', minHeight: '297mm', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
      {/* Elegant header */}
      <div className="text-center mb-6 pb-4" style={{ borderBottom: `1px solid ${primaryColor}30` }}>
        {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mx-auto mb-2" />}
        <h1 className="text-[28px] font-light tracking-[0.15em] uppercase" style={{ color: primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && <p className="text-[11px] text-gray-500 tracking-[0.1em] mt-1">{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 mt-3 text-[9px] text-gray-400 tracking-wide">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {sectionOrder.map((section) => renderSection(section))}
    </div>
  );
}
