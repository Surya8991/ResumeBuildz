'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function CreativeTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const lightenColor = (hex: string, amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * amount));
    const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * amount));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5 p-4 rounded-lg" style={{ backgroundColor: `${primaryColor}08` }}>
            <p className="text-[11px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primaryColor }}>W</span>
              Work Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-2" style={{ borderColor: lightenColor(primaryColor, 0.6) }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[12px] font-bold">{exp.position}</h3>
                    <p className="text-[11px] font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-[10px] text-gray-400">{exp.location}</p>}
                {exp.highlights.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative">
                        <span className="absolute left-0 top-[5px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
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
            <h2 className="text-[13px] font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primaryColor }}>E</span>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: lightenColor(primaryColor, 0.6) }}>
                <h3 className="text-[12px] font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <p className="text-[11px]" style={{ color: primaryColor }}>{edu.institution}</p>
                <p className="text-[10px] text-gray-500">{edu.startDate} - {edu.endDate}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primaryColor }}>S</span>
              Skills
            </h2>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-2">
                <h4 className="text-[10px] font-bold uppercase mb-1" style={{ color: primaryColor }}>{skill.category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: primaryColor, color: primaryColor }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primaryColor }}>P</span>
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3 pl-4 border-l-2" style={{ borderColor: lightenColor(primaryColor, 0.6) }}>
                <h3 className="text-[12px] font-bold">{proj.name}</h3>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {proj.technologies.map((t, i) => (
                      <span key={i} className="text-[8px] px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: primaryColor }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative">
                        <span className="absolute left-0 top-[5px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
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
            <h2 className="text-[13px] font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primaryColor }}>C</span>
              Certifications
            </h2>
            <div className="space-y-1">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between text-[11px] pl-4">
                  <span className="font-medium">{cert.name} — <span className="text-gray-500">{cert.issuer}</span></span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: primaryColor }}>L</span>
              Languages
            </h2>
            <div className="flex flex-wrap gap-2 pl-4">
              {languages.map((lang) => (
                <span key={lang.id} className="text-[10px] px-3 py-1 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
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
      <div className="p-8 pb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: primaryColor }} />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ backgroundColor: primaryColor, transform: 'translate(30%, -50%)' }} />
        <div className="flex items-center gap-4 mt-2">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />}
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: primaryColor }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-[13px] text-gray-600 mt-0.5 font-medium">{personalInfo.jobTitle}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
          {personalInfo.email && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{personalInfo.email}</span>}
          {personalInfo.phone && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{personalInfo.phone}</span>}
          {personalInfo.location && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{personalInfo.website}</span>}
          {personalInfo.github && <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{personalInfo.github}</span>}
        </div>
      </div>

      <div className="px-8 pb-8">
        {sectionOrder.map((section) => renderSection(section))}
      </div>
    </div>
  );
}
