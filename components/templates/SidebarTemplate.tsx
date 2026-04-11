'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function SidebarTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const mainSections = ['summary', 'experience', 'projects'];
  const sidebarSections = ['skills', 'education', 'certifications', 'languages'];

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Summary
            </h2>
            <p className="text-[11px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[9px] text-gray-500 shrink-0 ml-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[10px] text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:font-bold" style={{ color: undefined }}>
                        <span className="text-gray-700">{formatBullet(h)}</span>
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white/90">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="text-[11px] font-bold text-white">{edu.degree}</h3>
                {edu.field && <p className="text-[10px] text-white/80">{edu.field}</p>}
                <p className="text-[10px] text-white/70">{edu.institution}</p>
                <p className="text-[9px] text-white/60">{edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p className="text-[9px] text-white/60">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white/90">Skills</h2>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-3">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wide">{skill.category}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.items.map((item, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 bg-white/15 text-white rounded-sm">
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
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.link && <span className="text-[9px] text-gray-400 ml-2">{proj.link}</span>}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] mt-0.5" style={{ color: primaryColor }}>{proj.technologies.join(' / ')}</p>
                )}
                {proj.description && <p className="text-[10px] text-gray-600 mt-0.5">{proj.description}</p>}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0">
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white/90">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="text-[10px] font-semibold text-white">{cert.name}</p>
                <p className="text-[9px] text-white/70">{cert.issuer}</p>
                <p className="text-[9px] text-white/60">{cert.date}</p>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white/90">Languages</h2>
            {languages.map((lang) => (
              <div key={lang.id} className="mb-1.5">
                <div className="flex justify-between">
                  <span className="text-[10px] text-white">{lang.name}</span>
                  <span className="text-[9px] text-white/60">{lang.proficiency}</span>
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full mt-0.5">
                  <div
                    className="h-full bg-white/70 rounded-full"
                    style={{
                      width: lang.proficiency === 'Native' ? '100%' :
                        lang.proficiency === 'Fluent' ? '90%' :
                        lang.proficiency === 'Advanced' ? '75%' :
                        lang.proficiency === 'Intermediate' ? '55%' :
                        lang.proficiency === 'Basic' ? '30%' : '0%'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  return (
    <div className="bg-white text-black flex" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Main Content - Left 70% */}
      <div className="w-[70%] p-8">
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
          <div className="flex items-center gap-4">
            {personalInfo.photo && (
              <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover" />
            )}
            <div>
              <h1 className="text-[24px] font-bold text-gray-900 leading-tight">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              {personalInfo.jobTitle && (
                <p className="text-[13px] mt-1" style={{ color: primaryColor }}>{personalInfo.jobTitle}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 text-[10px] text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {/* Main sections */}
        {sectionOrder.filter((s) => mainSections.includes(s) || s.startsWith('custom-')).map((section) => renderSection(section))}
      </div>

      {/* Sidebar - Right 30% */}
      <div className="w-[30%] p-5 min-h-full" style={{ backgroundColor: primaryColor }}>
        {/* Contact links in sidebar */}
        <div className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white/90">Links</h2>
          <div className="space-y-1 text-[9px] text-white/80">
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
            {personalInfo.github && <p>{personalInfo.github}</p>}
          </div>
        </div>

        {/* Sidebar sections */}
        {sectionOrder.filter((s) => sidebarSections.includes(s)).map((section) => renderSection(section))}
      </div>
    </div>
  );
}
