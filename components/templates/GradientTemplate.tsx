'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function GradientTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5 rounded-lg border border-gray-100 p-4 bg-gray-50/50">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
              Profile
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 rounded-lg border border-gray-100 p-3 bg-white">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['›'] before:absolute before:left-0 before:font-bold" style={{ '--tw-before-color': primaryColor } as React.CSSProperties}>
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 rounded-lg border border-gray-100 p-3 bg-white">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-[10px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['›'] before:absolute before:left-0 before:font-bold">
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Skills
            </h2>
            <div className="rounded-lg border border-gray-100 p-4 bg-gray-50/50">
              {skills.map((skill) => (
                <div key={skill.id} className="mb-2 last:mb-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: primaryColor }}>{skill.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {skill.items.map((item, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border text-gray-700" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}08` }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-4 rounded-lg border border-gray-100 p-3 bg-white">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.startDate && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                      {proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}
                    </span>
                  )}
                </div>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded text-gray-500 bg-gray-100">{tech}</span>
                    ))}
                  </div>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['›'] before:absolute before:left-0 before:font-bold">
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Certifications
            </h2>
            <div className="rounded-lg border border-gray-100 p-3 bg-gray-50/50 space-y-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-800">{cert.name}</span>
                    <span className="text-[10px] text-gray-500"> — {cert.issuer}</span>
                  </div>
                  <span className="text-[9px] text-gray-400">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className="text-[10px] px-3 py-1.5 rounded-full border text-gray-700" style={{ borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}08` }}>
                  <span className="font-semibold">{lang.name}</span>
                  {lang.proficiency && <span className="text-gray-400 ml-1">· {lang.proficiency}</span>}
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
      {/* Gradient Header */}
      <div
        className="px-8 py-7"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}88)`,
        }}
      >
        <div className="flex items-center gap-4">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-lg" />}
          <div>
            <h1 className="text-[24px] font-bold text-white leading-tight">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && <p className="text-[13px] text-white/85 font-medium mt-0.5">{personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 text-[10px] text-white/75">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {sectionOrder.map((s) => renderSection(s))}
      </div>
    </div>
  );
}
