'use client';

import { TemplateProps, formatBullet, renderCustomSection, ensureUrl } from './TemplateWrapper';

export default function AcademicTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-5">
            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 mb-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-center" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
                Research Interests &amp; Summary
              </h2>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>{summary}</p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 mb-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-center" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
                Professional Experience
              </h2>
            </div>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{exp.position}</h3>
                  <span className="text-[10px] text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>{exp.startDate} to {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[11px] text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
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
            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 mb-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-center" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
                Education
              </h2>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span className="text-[10px] text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>{edu.startDate} to {edu.endDate}</span>
                </div>
                <p className="text-[11px] text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-[10px] text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
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
            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 mb-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-center" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
                Skills &amp; Competencies
              </h2>
            </div>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} style={{ fontFamily: 'Georgia, serif' }}>
                  <span className="text-[11px] font-bold text-gray-800">{skill.category}: </span>
                  <span className="text-[11px] text-gray-700">{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 mb-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-center" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
                Research &amp; Projects
              </h2>
            </div>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>{proj.name}</h3>
                  {proj.startDate && <span className="text-[10px] text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</span>}
                </div>
                {proj.technologies.length > 0 && (
                  <p className="text-[10px] text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>Technologies: {proj.technologies.join(', ')}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
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
            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 mb-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-center" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
                Certifications &amp; Honors
              </h2>
            </div>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 flex justify-between" style={{ fontFamily: 'Georgia, serif' }}>
                <div>
                  <span className="text-[11px] font-bold">{cert.name}</span>
                  <span className="text-[11px] text-gray-600"> &mdash; {cert.issuer}</span>
                </div>
                <span className="text-[10px] text-gray-500 italic">{cert.date}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-5">
            <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 mb-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-center" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
                Languages
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {languages.map((lang) => (
                <span key={lang.id} className="text-[11px]" style={{ fontFamily: 'Georgia, serif' }}>
                  <strong>{lang.name}</strong>{lang.proficiency ? `  -  ${lang.proficiency}` : ''}
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
    <div className="bg-white text-black p-10" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif' }}>
      {/* Header - centered academic style */}
      <div className="text-center mb-5 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
        {personalInfo.photo && <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover mx-auto mb-2 border border-gray-300" />}
        <h1 className="text-[22px] font-bold tracking-wide" style={{ color: primaryColor, fontFamily: 'Georgia, serif' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && <p className="text-[13px] text-gray-600 italic mt-0.5">{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 mt-2 text-[10px] text-gray-600">
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>}
          {personalInfo.phone && <a href={`tel:${personalInfo.phone}`} className="hover:underline">{personalInfo.phone}</a>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <a href={ensureUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.linkedin}</a>}
          {personalInfo.website && <a href={ensureUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.website}</a>}
          {personalInfo.github && <a href={ensureUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personalInfo.github}</a>}
        </div>
      </div>

      {/* Content based on section order */}
      {sectionOrder.map((s) => renderSection(s))}
    </div>
  );
}
