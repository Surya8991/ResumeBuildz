'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function ModernTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const leftSections = ['summary', 'experience', 'projects'];
  const rightSections = ['skills', 'education', 'certifications', 'languages'];

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-gray-800">Profile</h2>
            <p className="text-[11px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-gray-800">Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <h3 className="text-[12px] font-bold text-gray-900">{exp.position}</h3>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</span>
                  <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['▸'] before:absolute before:left-0" style={{ '--tw-before-color': primaryColor } as React.CSSProperties}>
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: 'white' }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="text-[11px] font-bold text-white">{edu.degree}</h3>
                {edu.field && <p className="text-[10px] text-white/80">{edu.field}</p>}
                <p className="text-[10px] text-white/70">{edu.institution}</p>
                <p className="text-[10px] text-white/60">{edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p className="text-[10px] text-white/60">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white">Skills</h2>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-2">
                <h4 className="text-[10px] font-bold text-white/90 uppercase">{skill.category}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.items.map((item, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/20 text-white rounded">
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
            <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 text-gray-800">Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <h3 className="text-[12px] font-bold text-gray-900">{proj.name}</h3>
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] text-gray-500">{proj.technologies.join(' | ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['▸'] before:absolute before:left-0">
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
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1.5">
                <p className="text-[10px] font-semibold text-white">{cert.name}</p>
                <p className="text-[9px] text-white/70">{cert.issuer} | {cert.date}</p>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white">Languages</h2>
            {languages.map((lang) => (
              <div key={lang.id} className="mb-1 flex justify-between">
                <span className="text-[10px] text-white">{lang.name}</span>
                <span className="text-[9px] text-white/70">{lang.proficiency}</span>
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
      {/* Sidebar */}
      <div className="w-[72mm] p-6" style={{ backgroundColor: primaryColor }}>
        {/* Name in sidebar */}
        <div className="mb-6">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mb-2" />}
          <h1 className="text-[20px] font-bold text-white leading-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && <p className="text-[11px] text-white/80 mt-1">{personalInfo.jobTitle}</p>}
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-2 text-white">Contact</h2>
          <div className="space-y-1.5 text-[10px] text-white/90">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
            {personalInfo.github && <p>{personalInfo.github}</p>}
          </div>
        </div>

        {/* Right-side sections in sidebar */}
        {sectionOrder.filter((s) => rightSections.includes(s)).map((section) => renderSection(section))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {sectionOrder.filter((s) => leftSections.includes(s)).map((section) => renderSection(section))}
      </div>
    </div>
  );
}
