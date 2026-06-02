'use client';

import { forwardRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';

/**
 * Standalone, printable cover-letter document — used by the "Cover Letter (PDF)"
 * export option. Independent of the resume render so users can ship the letter
 * on its own without dragging the resume along.
 */
const PrintableCoverLetter = forwardRef<HTMLDivElement>((_, ref) => {
  const { resumeData, primaryColor } = useResumeStore();
  const coverLetter = resumeData.coverLetter?.trim();

  return (
    <div ref={ref} className="printable-doc">
      <section
        className="print-cover-letter"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '48px 56px',
          background: 'white',
          color: '#111',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        <header style={{ borderBottom: `2px solid ${primaryColor}`, paddingBottom: 16, marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            {resumeData.personalInfo.fullName || 'Cover Letter'}
          </h1>
          {resumeData.personalInfo.jobTitle && (
            <p style={{ margin: '4px 0 0', color: '#555', fontSize: 13 }}>
              {resumeData.personalInfo.jobTitle}
            </p>
          )}
        </header>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            fontSize: 12,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {coverLetter || ''}
        </pre>
      </section>
    </div>
  );
});

PrintableCoverLetter.displayName = 'PrintableCoverLetter';
export default PrintableCoverLetter;
