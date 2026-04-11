'use client';

import { forwardRef, useId, useMemo } from 'react';
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

  return (
    <div
      ref={ref}
      className={`resume-print rp-${scopeId}`}
      style={{
        zoom: sizeScale !== 1 ? sizeScale : undefined,
      }}
    >
      {overrideCSS && <style dangerouslySetInnerHTML={{ __html: overrideCSS }} />}
      <TemplateComponent data={resumeData} primaryColor={primaryColor} styleOptions={styleOptions} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
