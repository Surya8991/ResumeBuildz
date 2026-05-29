'use client';

import { forwardRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import ResumePreview from '@/components/preview/ResumePreview';

interface PrintableResumeProps {
  /** When true and the resume has a non-empty coverLetter, render it as a cover page before the resume. */
  includeCoverLetter: boolean;
}

/**
 * Wraps ResumePreview with an optional cover-letter cover page that lands on
 * page 1 of the printed PDF. The wrapping div is what react-to-print uses as
 * the print target, so the ref must point at it (not at ResumePreview).
 *
 * On screen we hide the cover-letter block (it would otherwise distract from
 * the live preview). It re-appears in @media print via `print-cover-letter`.
 */
const PrintableResume = forwardRef<HTMLDivElement, PrintableResumeProps>(({ includeCoverLetter }, ref) => {
  const { resumeData, primaryColor } = useResumeStore();
  const coverLetter = resumeData.coverLetter?.trim();
  const showCoverLetter = includeCoverLetter && coverLetter;

  return (
    <div ref={ref} className="printable-doc">
      {showCoverLetter && (
        <section
          className="print-cover-letter"
          style={{
            pageBreakAfter: 'always',
            breakAfter: 'page',
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
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{resumeData.personalInfo.fullName || 'Cover Letter'}</h1>
            {resumeData.personalInfo.jobTitle && (
              <p style={{ margin: '4px 0 0', color: '#555', fontSize: 13 }}>{resumeData.personalInfo.jobTitle}</p>
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
            {coverLetter}
          </pre>
        </section>
      )}
      <ResumePreview />
    </div>
  );
});

PrintableResume.displayName = 'PrintableResume';
export default PrintableResume;
