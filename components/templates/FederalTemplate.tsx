'use client';

import { TemplateProps, formatBullet, renderCustomSection } from './TemplateWrapper';

export default function FederalTemplate({ data, primaryColor }: TemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, sectionOrder } = data;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return summary ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              PROFESSIONAL SUMMARY
            </h2>
            <hr className="border-t-2 border-black mb-2" />
            <p className="text-[11px] leading-[1.6] text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              {summary}
            </p>
          </div>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            <hr className="border-t-2 border-black mb-3" />
            {experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  <h3 className="text-[12px] font-bold text-black uppercase">{exp.position}</h3>
                  <p className="text-[11px] text-black font-semibold">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <p className="text-[11px] text-black">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.description && (
                    <p className="text-[11px] text-black mt-1 leading-[1.6]">{exp.description}</p>
                  )}
                </div>
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-black leading-[1.6] pl-5 relative" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                        <span className="absolute left-0">-</span>
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
            <h2 className="text-[14px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              EDUCATION
            </h2>
            <hr className="border-t-2 border-black mb-3" />
            {education.map((edu) => (
              <div key={edu.id} className="mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <h3 className="text-[12px] font-bold text-black">
                  {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                </h3>
                <p className="text-[11px] text-black">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                <p className="text-[11px] text-black">{edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p className="text-[11px] text-black">GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-black pl-5 relative leading-[1.6]">
                        <span className="absolute left-0">-</span>
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
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              KNOWLEDGE, SKILLS, AND ABILITIES
            </h2>
            <hr className="border-t-2 border-black mb-3" />
            {skills.map((skill) => (
              <div key={skill.id} className="mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <h4 className="text-[11px] font-bold text-black uppercase">{skill.category}:</h4>
                <p className="text-[11px] text-black leading-[1.6]">{skill.items.join(', ')}</p>
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              KEY PROJECTS AND ACCOMPLISHMENTS
            </h2>
            <hr className="border-t-2 border-black mb-3" />
            {projects.map((proj) => (
              <div key={proj.id} className="mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <h3 className="text-[12px] font-bold text-black">{proj.name}</h3>
                {proj.technologies.length > 0 && (
                  <p className="text-[11px] text-black">Technologies: {proj.technologies.join(', ')}</p>
                )}
                {proj.description && (
                  <p className="text-[11px] text-black mt-1 leading-[1.6]">{proj.description}</p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-black pl-5 relative leading-[1.6]">
                        <span className="absolute left-0">-</span>
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
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              CERTIFICATIONS AND LICENSES
            </h2>
            <hr className="border-t-2 border-black mb-3" />
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <p className="text-[11px] text-black">
                  <span className="font-bold">{cert.name}</span>, {cert.issuer}, {cert.date}
                  {cert.credentialId && ` (Credential ID: ${cert.credentialId})`}
                </p>
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return languages.length > 0 ? (
          <div key={key} className="mb-6">
            <h2 className="text-[14px] font-bold uppercase tracking-widest mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              LANGUAGE PROFICIENCY
            </h2>
            <hr className="border-t-2 border-black mb-3" />
            {languages.map((lang) => (
              <p key={lang.id} className="text-[11px] text-black leading-[1.6]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <span className="font-bold">{lang.name}</span>: {lang.proficiency}
              </p>
            ))}
          </div>
        ) : null;

      default:
        return renderCustomSection(data, key, primaryColor);
    }
  };

  return (
    <div className="bg-white text-black" style={{ width: '210mm', minHeight: '297mm', fontFamily: '"Times New Roman", Times, serif' }}>
      <div className="px-10 py-8">
        {/* Header - very formal, centered */}
        <div className="text-center mb-6 pb-4 border-b-2 border-black">
          <div className="flex justify-center mb-2">
            {personalInfo.photo && (
              <img src={personalInfo.photo} alt="" className="w-14 h-14 rounded-full object-cover" />
            )}
          </div>
          <h1 className="text-[22px] font-bold uppercase tracking-widest text-black">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-[12px] text-black mt-1 uppercase tracking-wide">{personalInfo.jobTitle}</p>
          )}
          <div className="mt-2 text-[10px] text-black space-y-0.5">
            <p>
              {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}
            </p>
            {(personalInfo.linkedin || personalInfo.website || personalInfo.github) && (
              <p>
                {[personalInfo.linkedin, personalInfo.website, personalInfo.github].filter(Boolean).join(' | ')}
              </p>
            )}
          </div>
        </div>

        {/* Sections */}
        {sectionOrder.map((s) => renderSection(s))}
      </div>
    </div>
  );
}
