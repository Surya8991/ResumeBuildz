'use client';

import { TemplateProps, formatBullet, renderCustomSection, ensureUrl } from './TemplateWrapper';

export default function MonochromeTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  // This template deliberately ignores primaryColor - pure black and white only
  const _ = primaryColor; // acknowledge prop to avoid lint warnings

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Profile
            </h2>
            <p className="text-[10.5px] leading-[1.7] text-black" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {summary}
            </p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={exp.id} className={`mb-5 ${idx > 0 ? 'pt-4 border-t border-gray-200' : ''}`}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-black">{exp.position}</h3>
                  <span className="text-[9px] text-gray-600 italic shrink-0 ml-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-[10px] text-gray-700 font-medium mt-0.5">
                  {exp.company}{exp.location ? ` - ${exp.location}` : ''}
                </p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-black leading-[1.6] pl-4 relative" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                        <span className="absolute left-0 text-gray-400">·</span>
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
          <div key={key} className="mb-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-bold text-black">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </h3>
                  <span className="text-[9px] text-gray-600 italic shrink-0 ml-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-[10px] text-gray-700">{edu.institution}</p>
                {edu.gpa && <p className="text-[9px] text-gray-500 mt-0.5">GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[9px] text-gray-700 italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
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
          <div key={key} className="mb-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Skills
            </h2>
            <div className="space-y-2.5">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">{skill.category}</h4>
                  <p className="text-[10px] text-gray-700 mt-0.5 leading-[1.6]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {skill.items.join('  /  ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Projects
            </h2>
            {projects.map((proj, idx) => (
              <div key={proj.id} className={`mb-4 ${idx > 0 ? 'pt-3 border-t border-gray-200' : ''}`}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-bold text-black">{proj.name}</h3>
                  {proj.link && <span className="text-[8px] text-gray-500 italic ml-2">{proj.link}</span>}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] text-gray-500 mt-0.5 italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.description && (
                  <p className="text-[10px] text-gray-700 mt-1 leading-[1.6]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {proj.description}
                  </p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[10px] text-black leading-[1.6] pl-4 relative" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                        <span className="absolute left-0 text-gray-400">·</span>
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
          <div key={key} className="mb-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="text-[10px] text-black" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  <span className="font-bold">{cert.name}</span>
                  <span className="text-gray-500"> · {cert.issuer}, {cert.date}</span>
                </p>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-7">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Languages
            </h2>
            <div className="flex gap-6">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <span className="text-[10px] font-bold text-black">{lang.name}</span>
                  <span className="text-[9px] text-gray-500 italic ml-1.5" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    ({lang.proficiency})
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, '#000000');
    }
  };

  return (
    <div className="bg-white text-black" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="px-10 py-10">
        {/* Header - typographic contrast only */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              {personalInfo.photo && (
                <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover grayscale mb-3" />
              )}
              <h1 className="text-[32px] font-extralight text-black leading-none tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                {personalInfo.fullName || 'Your Name'}
              </h1>
              {personalInfo.jobTitle && (
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-black mt-2">
                  {personalInfo.jobTitle}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-black border-b pb-4 flex flex-wrap gap-x-5 gap-y-0.5 text-[9px] text-gray-600" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>}
            {personalInfo.phone && <a href={`tel:${personalInfo.phone}`} className="hover:underline">{personalInfo.phone}</a>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.linkedin}</a>}
            {personalInfo.website && <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a>}
            {personalInfo.github && <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.github}</a>}
          </div>
        </div>

        {/* Sections */}
        {sectionOrder.map((s) => renderSection(s))}
      </div>
    </div>
  );
}
