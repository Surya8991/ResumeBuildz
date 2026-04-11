'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function InfographicTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  // Helper to lighten a hex color
  const lighten = (hex: string, amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + Math.round(amount * 255));
    const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(amount * 255));
    const b = Math.min(255, (num & 0x0000FF) + Math.round(amount * 255));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const proficiencyPercent = (prof: string) => {
    switch (prof) {
      case 'Native': return 100;
      case 'Fluent': return 88;
      case 'Advanced': return 72;
      case 'Intermediate': return 52;
      case 'Basic': return 28;
      default: return 0;
    }
  };

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-6">
            {/* Metric highlights row */}
            <div className="flex gap-3 mb-4">
              {experience.length > 0 && (
                <div className="flex-1 rounded-lg p-3 text-center text-white" style={{ backgroundColor: primaryColor }}>
                  <div className="text-[18px] font-black">{experience.length}+</div>
                  <div className="text-[9px] uppercase tracking-wider opacity-80">Roles</div>
                </div>
              )}
              {projects.length > 0 && (
                <div className="flex-1 rounded-lg p-3 text-center text-white" style={{ backgroundColor: lighten(primaryColor, 0.1) }}>
                  <div className="text-[18px] font-black">{projects.length}</div>
                  <div className="text-[9px] uppercase tracking-wider opacity-80">Projects</div>
                </div>
              )}
              {skills.length > 0 && (
                <div className="flex-1 rounded-lg p-3 text-center text-white" style={{ backgroundColor: lighten(primaryColor, 0.2) }}>
                  <div className="text-[18px] font-black">{skills.reduce((sum, s) => sum + s.items.length, 0)}</div>
                  <div className="text-[9px] uppercase tracking-wider opacity-80">Skills</div>
                </div>
              )}
              {certifications.length > 0 && (
                <div className="flex-1 rounded-lg p-3 text-center text-white" style={{ backgroundColor: lighten(primaryColor, 0.15) }}>
                  <div className="text-[18px] font-black">{certifications.length}</div>
                  <div className="text-[9px] uppercase tracking-wider opacity-80">Certs</div>
                </div>
              )}
            </div>
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-1.5" style={{ color: primaryColor }}>
              About Me
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-600">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-3" style={{ borderLeftWidth: '3px', borderLeftColor: primaryColor }}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-700 flex items-start gap-1.5">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
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
          <div key={key} className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}08` }}>
                <h3 className="text-[11px] font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <p className="text-[10px] text-gray-600">{edu.institution}</p>
                <div className="flex gap-3 mt-1 text-[9px] text-gray-500">
                  <span>{edu.startDate} - {edu.endDate}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {edu.highlights.map((h, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200">
                        {formatBullet(h)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: primaryColor }} />
                    {skill.category}
                  </h4>
                  <div className="space-y-1">
                    {skill.items.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[9px] mb-0.5">
                          <span className="text-gray-700">{item}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: primaryColor,
                              width: `${85 - (i * 8) + Math.random() * 5}%`,
                              opacity: 0.7 + (0.3 * (1 - i / skill.items.length)),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-lg border" style={{ borderColor: `${primaryColor}30` }}>
                  <h3 className="text-[11px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {proj.highlights.map((h, i) => (
                        <li key={i} className="text-[9px] text-gray-600">{formatBullet(h)}</li>
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
          <div key={key} className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: `${primaryColor}40` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: primaryColor }}>
                    {cert.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-[8px] text-gray-500">{cert.issuer} | {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>
              Languages
            </h2>
            <div className="flex gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className="text-center">
                  <div className="relative w-14 h-14 mx-auto">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                      <circle
                        cx="28" cy="28" r="24"
                        stroke={primaryColor}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(proficiencyPercent(lang.proficiency) / 100) * 150.8} 150.8`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: primaryColor }}>
                      {proficiencyPercent(lang.proficiency)}%
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-800 mt-1">{lang.name}</p>
                  <p className="text-[8px] text-gray-500">{lang.proficiency}</p>
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
      {/* Header - full width colored banner */}
      <div className="p-8 text-white relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px, 60px 60px',
        }} />
        <div className="relative flex items-center gap-5">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/30" />
          )}
          <div className="flex-1">
            <h1 className="text-[26px] font-black leading-tight tracking-tight">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-[13px] font-light mt-1 opacity-90">{personalInfo.jobTitle}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[9px] opacity-80">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
              {personalInfo.github && <span>{personalInfo.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        {sectionOrder.map((s) => renderSection(s))}
      </div>
    </div>
  );
}
