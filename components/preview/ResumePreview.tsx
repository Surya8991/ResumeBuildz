'use client';

import { createElement, forwardRef, memo, useId, useMemo, useState, useCallback } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getTemplateComponent } from '@/components/templates';
import { DEFAULT_STYLE_OPTIONS, FONT_OPTIONS } from '@/components/templates/TemplateWrapper';

// Whitelist of allowed font families to prevent CSS injection
const ALLOWED_FONTS = new Set(FONT_OPTIONS.map(f => f.value));

function sanitizeFontFamily(font: string): string {
  if (ALLOWED_FONTS.has(font)) return font;
  return DEFAULT_STYLE_OPTIONS.fontFamily;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** Strip patterns that could escape a <style> tag or execute code. */
function sanitizeCSS(css: string): string {
  return css
    .replace(/<\/?style/gi, '')
    .replace(/<\/?\s*script/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/url\s*\(\s*javascript:/gi, '');
}

const ResumePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { resumeData, selectedTemplate, primaryColor, styleOptions } = useResumeStore();
  const TemplateComponent = getTemplateComponent(selectedTemplate);
  const scopeId = useId().replace(/:/g, '');

  const defaults = DEFAULT_STYLE_OPTIONS;
  const safeFont = sanitizeFontFamily(styleOptions.fontFamily);
  const safeFontSize = clamp(styleOptions.fontSize, 8, 14);
  const safeLineHeight = clamp(styleOptions.lineHeight, 1.0, 2.0);
  const safeMargin = clamp(styleOptions.pageMargin, 16, 56);
  const safeSpacing = clamp(styleOptions.sectionSpacing, 8, 32);

  const fontChanged = safeFont !== defaults.fontFamily;
  const sizeScale = safeFontSize / defaults.fontSize;
  const lineChanged = safeLineHeight !== defaults.lineHeight;
  const marginChanged = safeMargin !== defaults.pageMargin;
  const spacingChanged = safeSpacing !== defaults.sectionSpacing;

  const overrideCSS = useMemo(() => {
    const rules: string[] = [];
    const fontProps: string[] = [];
    if (fontChanged) fontProps.push(`font-family: ${safeFont} !important;`);
    if (lineChanged) fontProps.push(`line-height: ${safeLineHeight} !important;`);
    if (fontProps.length > 0) {
      rules.push(`.rp-${scopeId} * { ${fontProps.join(' ')} }`);
    }
    if (marginChanged) {
      rules.push(`.rp-${scopeId} > div > div:first-child { padding: ${safeMargin}px !important; }`);
    }
    if (spacingChanged) {
      rules.push(`.rp-${scopeId} [class*="mb-5"], .rp-${scopeId} [class*="mb-6"], .rp-${scopeId} [class*="mb-4"] { margin-bottom: ${safeSpacing}px !important; }`);
    }
    return rules.join('\n');
  }, [scopeId, fontChanged, safeFont, lineChanged, safeLineHeight, marginChanged, safeMargin, spacingChanged, safeSpacing]);

  // A4 page height in px (297mm at 96dpi ≈ 1122px), adjusted for zoom/fontSize scale
  const pageHeightPx = 1122;
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);
  const innerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    // Measure actual content height and calculate page breaks
    const measure = () => {
      const h = node.scrollHeight;
      const breaks: number[] = [];
      let y = pageHeightPx;
      while (y < h) {
        breaks.push(y);
        y += pageHeightPx;
      }
      setPageBreaks(breaks);
    };
    // Measure after render settles
    const id = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => { cancelAnimationFrame(id); observer.disconnect(); };
  }, [pageHeightPx]);

  // Merge refs
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    innerRef(node);
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [ref, innerRef]);

  return (
    <div
      ref={setRefs}
      className={`resume-print rp-${scopeId} resume-preview-paged`}
      style={{
        zoom: sizeScale !== 1 ? sizeScale : undefined,
        position: 'relative',
      }}
    >
      {overrideCSS && <style dangerouslySetInnerHTML={{ __html: sanitizeCSS(overrideCSS) }} />}
      {createElement(TemplateComponent, { data: resumeData, primaryColor, styleOptions })}
      {pageBreaks.map((y, i) => (
        <div key={i}>
          <div className="page-break-line" style={{ top: y }} />
          <div className="page-break-label" style={{ top: y }}>Page {i + 2}</div>
        </div>
      ))}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default memo(ResumePreview);
