'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function TechTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const sidebarSections = ['skills', 'education', 'certifications', 'languages'];
  const mainSections = sectionOrder.filter((s) => !sidebarSections.includes(s));
  const sideItems = sectionOrder.filter((s) => sidebarSections.includes(s));

  const sectionTitle = (title: string) => (
    <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
      <span style={{ color: primaryColor }}>{'//'}</span>
      <span className="text-gray-800">{title}</span>
      <span className="flex-1 h-px bg-gray-200 ml-1" />
    </h2>
  );

  const renderMainSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            {sectionTitle('About')}
            <p className="text-[10px] leading-relaxed text-gray-700">{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            {sectionTitle('Experience')}
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[9px] font-mono shrink-0 ml-2" style={{ color: primaryColor }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-700 pl-3 relative">
                        <span className="absolute left-0 font-mono text-[8px]" style={{ color: primaryColor }}>{'>'}</span>
                        {formatBullet(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            {sectionTitle('Projects')}
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[11px] font-bold text-gray-900">{proj.name}</h3>
                  {proj.link && <span className="text-[8px] font-mono" style={{ color: primaryColor }}>{proj.link}</span>}
                </div>
                {proj.description && <p className="text-[10px] text-gray-600 mt-0.5">{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {proj.technologies.map((t, i) => (
                      <span key={i} className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-gray-700 pl-3 relative">
                        <span className="absolute left-0 font-mono text-[8px]" style={{ color: primaryColor }}>{'>'}</span>
                        {formatBullet(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  const renderSideSection = (key: string) => {
    switch (key) {
      case 'skills':
        return skills.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/90">Skills</h2>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-2">
                <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide mb-0.5">{skill.category}</p>
                <div className="flex flex-wrap gap-1">
                  {skill.items.map((item, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/15 text-white/90">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return education.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/90">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="text-[10px] font-semibold text-white">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <p className="text-[9px] text-white/70">{edu.institution}</p>
                <p className="text-[8px] text-white/50">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        ) : null;

      case 'certifications':
        return certifications.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/90">Certs</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1.5">
                <p className="text-[9px] text-white font-medium">{cert.name}</p>
                {cert.issuer && <p className="text-[8px] text-white/60">{cert.issuer}</p>}
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-white/90">Languages</h2>
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between text-[9px] mb-1">
                <span className="text-white">{lang.name}</span>
                <span className="text-white/60">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  return (
    <div className="bg-white text-black flex" style={{ width: '210mm', minHeight: '297mm', fontFamily: '"Source Code Pro", "Fira Code", monospace' }}>
      {/* Dark sidebar */}
      <div className="w-[68mm] p-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="mb-5">
          {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mb-2" />}
          <h1 className="text-[18px] font-bold text-white leading-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-[10px] mt-1 font-mono" style={{ color: primaryColor }}>{personalInfo.jobTitle}</p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-5 space-y-1.5 text-[9px]">
          {personalInfo.email && <div className="text-white/80"><span className="font-mono" style={{ color: primaryColor }}>@</span> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="text-white/80"><span className="font-mono" style={{ color: primaryColor }}>#</span> {personalInfo.phone}</div>}
          {personalInfo.location && <div className="text-white/80"><span className="font-mono" style={{ color: primaryColor }}>~</span> {personalInfo.location}</div>}
          {personalInfo.linkedin && <div className="text-white/80"><span className="font-mono" style={{ color: primaryColor }}>in</span> {personalInfo.linkedin}</div>}
          {personalInfo.github && <div className="text-white/80"><span className="font-mono" style={{ color: primaryColor }}>gh</span> {personalInfo.github}</div>}
          {personalInfo.website && <div className="text-white/80"><span className="font-mono" style={{ color: primaryColor }}>www</span> {personalInfo.website}</div>}
        </div>

        <div className="h-px bg-white/10 my-3" />

        {sideItems.map((s) => renderSideSection(s))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {mainSections.map((s) => renderMainSection(s))}
      </div>
    </div>
  );
}
