'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function StartupTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5 p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}08` }}>
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              About
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-600">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-white border border-gray-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        <span className="font-semibold" style={{ color: primaryColor }}>{exp.company}</span>
                        {exp.location ? ` | ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-[9px] px-2.5 py-1 rounded-full text-white shrink-0" style={{ backgroundColor: primaryColor }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-[10px] text-gray-600 flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
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
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-xl bg-white border border-gray-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[11px] font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <span className="text-[9px] text-gray-400">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{edu.institution}</p>
                  {edu.gpa && <p className="text-[9px] text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                  {edu.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {edu.highlights.map((h, i) => (
                        <span key={i} className="text-[8px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
                          {formatBullet(h)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              Tech Stack
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="p-3 rounded-xl bg-white border border-gray-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h4 className="text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: primaryColor }}>
                    {skill.category}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {skill.items.map((item, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-2 py-0.5 rounded-md font-medium"
                        style={{
                          backgroundColor: `${primaryColor}12`,
                          color: primaryColor,
                          fontFamily: '"Courier New", monospace',
                        }}
                      >
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
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl border-2" style={{ borderColor: `${primaryColor}25` }}>
                  <h3 className="text-[11px] font-bold text-gray-900 flex items-center gap-1">
                    {proj.name}
                  </h3>
                  {proj.link && (
                    <p className="text-[8px] mt-0.5 font-mono" style={{ color: primaryColor }}>{proj.link}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {proj.highlights.map((h, i) => (
                        <li key={i} className="text-[9px] text-gray-500 flex items-start gap-1">
                          <span className="mt-1 w-1 h-1 rounded-full shrink-0 bg-gray-300" />
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
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="px-3 py-2 rounded-xl bg-white border border-gray-100 flex items-center gap-2" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: primaryColor }}>
                    {cert.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-[8px] text-gray-400">{cert.issuer} | {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: primaryColor }} />
              Languages
            </h2>
            <div className="flex gap-3">
              {languages.map((lang) => (
                <div key={lang.id} className="px-4 py-2 rounded-xl bg-white border border-gray-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <span className="text-[10px] font-bold text-gray-800">{lang.name}</span>
                  <span className="text-[9px] text-gray-400 ml-2">{lang.proficiency}</span>
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
    <div className="bg-gray-50 text-black" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="p-6 rounded-2xl bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-4">
            {personalInfo.photo && (
              <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-offset-2" style={{ ringColor: primaryColor } as React.CSSProperties} />
            )}
            <div className="flex-1">
              <h1 className="text-[26px] font-black text-gray-900 leading-tight">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              {personalInfo.jobTitle && (
                <p className="text-[14px] font-semibold mt-0.5" style={{ color: primaryColor }}>
                  {personalInfo.jobTitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4">
            {personalInfo.email && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600">{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600">{personalInfo.phone}</span>
            )}
            {personalInfo.location && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600">{personalInfo.location}</span>
            )}
            {personalInfo.linkedin && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600">{personalInfo.linkedin}</span>
            )}
            {personalInfo.website && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600">{personalInfo.website}</span>
            )}
            {personalInfo.github && (
              <span className="text-[9px] px-2.5 py-1 rounded-lg font-mono text-gray-600" style={{ backgroundColor: `${primaryColor}10` }}>
                {personalInfo.github}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 pb-8">
        {sectionOrder.map((s) => renderSection(s))}
      </div>
    </div>
  );
}
