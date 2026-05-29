'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/useResumeStore';
import { TEMPLATES, DEFAULT_COLORS, ATS_RISK_META, sampleResumeData, TemplateName } from '@/types/resume';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, RotateCcw, Eye, X } from 'lucide-react';
import { getTemplateComponent } from '@/components/templates';
import { FONT_OPTIONS, DEFAULT_STYLE_OPTIONS } from '@/components/templates/TemplateWrapper';
import { HelpTip } from '@/components/ui/help-tip';

export default function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate, primaryColor, setPrimaryColor, styleOptions, updateStyleOptions, resumeData } = useResumeStore();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* ---- TEMPLATES ---- */}
      <section>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">Template <HelpTip text="Choose from 20 ATS-friendly templates. Each template is optimized for different industries and styles. Click to preview instantly." /></h3>
        <div className="grid grid-cols-2 gap-1.5">
          {TEMPLATES.map((t) => {
            const TemplateComponent = getTemplateComponent(t.name);
            const isSelected = selectedTemplate === t.name;
            return (
              <motion.div
                key={t.name}
                className={`group relative rounded-lg overflow-hidden border-2 transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'border-primary shadow-md ring-1 ring-primary/20'
                    : 'border-transparent hover:border-muted-foreground/20 hover:shadow-sm'
                }`}
                onClick={() => setSelectedTemplate(t.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedTemplate(t.name); }}
                whileTap={{ scale: 0.97 }}
                animate={isSelected ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Mini preview */}
                <div className="relative bg-white overflow-hidden" style={{ height: '100px' }}>
                  <div
                    style={{
                      transform: 'scale(0.13)',
                      transformOrigin: 'top left',
                      width: '210mm',
                      minHeight: '297mm',
                      pointerEvents: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    <TemplateComponent
                      data={sampleResumeData}
                      primaryColor={isSelected ? primaryColor : t.primaryColor}
                    />
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewTemplate(t.name); }}
                    className="absolute top-1.5 left-1.5 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-background"
                    title="Preview template"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                </div>
                <div className="px-1.5 py-1 bg-muted/50 flex items-center justify-between gap-1">
                  <span className={`text-xs font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${ATS_RISK_META[t.atsRisk].classes}`}
                    title={ATS_RISK_META[t.atsRisk].tooltip}
                  >
                    {t.atsRisk === 'safe' ? '✓ ATS' : t.atsRisk === 'caution' ? '△ ATS' : '✗ ATS'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* ---- ACCENT COLOR ---- */}
      <section>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Accent Color</h3>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              className={`w-7 h-7 rounded-full transition-all ${
                primaryColor === color ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setPrimaryColor(color)}
            />
          ))}
          <label className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:border-muted-foreground transition-colors overflow-hidden relative">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">+</span>
          </label>
        </div>
      </section>

      <Separator />

      {/* ---- FONT FAMILY ---- */}
      <section>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Font</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {FONT_OPTIONS.map((font) => {
            const isSelected = styleOptions.fontFamily === font.value;
            return (
              <button
                key={font.value}
                onClick={() => updateStyleOptions({ fontFamily: font.value })}
                className={`px-2.5 py-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-muted-foreground/40'
                }`}
              >
                <span
                  className={`text-xs font-medium block ${isSelected ? 'text-primary' : 'text-foreground'}`}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </span>
                <span
                  className="text-[10px] text-muted-foreground block mt-0.5"
                  style={{ fontFamily: font.value }}
                >
                  Aa Bb 123
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* ---- SIZING & SPACING ---- */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Layout</h3>
          <button
            onClick={() => updateStyleOptions({ ...DEFAULT_STYLE_OPTIONS })}
            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-2.5 w-2.5" /> Reset
          </button>
        </div>

        <div className="space-y-4">
          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs">Font Size</Label>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{styleOptions.fontSize}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={14}
              step={0.5}
              value={styleOptions.fontSize}
              onChange={(e) => updateStyleOptions({ fontSize: parseFloat(e.target.value) })}
              className="w-full accent-primary h-1.5"
            />
          </div>

          {/* Line Height */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs">Line Spacing</Label>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{styleOptions.lineHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={2.0}
              step={0.1}
              value={styleOptions.lineHeight}
              onChange={(e) => updateStyleOptions({ lineHeight: parseFloat(e.target.value) })}
              className="w-full accent-primary h-1.5"
            />
          </div>

          {/* Section Spacing */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs">Section Gap</Label>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{styleOptions.sectionSpacing}px</span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              step={2}
              value={styleOptions.sectionSpacing}
              onChange={(e) => updateStyleOptions({ sectionSpacing: parseInt(e.target.value) })}
              className="w-full accent-primary h-1.5"
            />
          </div>

          {/* Page Margin */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs">Page Margins</Label>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{styleOptions.pageMargin}px</span>
            </div>
            <input
              type="range"
              min={16}
              max={56}
              step={4}
              value={styleOptions.pageMargin}
              onChange={(e) => updateStyleOptions({ pageMargin: parseInt(e.target.value) })}
              className="w-full accent-primary h-1.5"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <Label className="text-xs text-muted-foreground mb-2 block">Quick Presets</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Compact', fontSize: 9.5, lineHeight: 1.2, sectionSpacing: 8, pageMargin: 20 },
              { label: 'Default', fontSize: 11, lineHeight: 1.4, sectionSpacing: 16, pageMargin: 32 },
              { label: 'Comfort', fontSize: 11.5, lineHeight: 1.6, sectionSpacing: 24, pageMargin: 40 },
              { label: 'Roomy', fontSize: 12, lineHeight: 1.8, sectionSpacing: 28, pageMargin: 48 },
            ].map((preset) => {
              const isActive =
                styleOptions.fontSize === preset.fontSize &&
                styleOptions.lineHeight === preset.lineHeight &&
                styleOptions.sectionSpacing === preset.sectionSpacing &&
                styleOptions.pageMargin === preset.pageMargin;
              return (
                <button
                  key={preset.label}
                  onClick={() => updateStyleOptions(preset)}
                  className={`py-1.5 rounded-md border text-[10px] font-medium transition-all ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {previewTemplate && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-background rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <h3 className="text-sm font-semibold">{TEMPLATES.find(t => t.name === previewTemplate)?.label} Template</h3>
                <p className="text-xs text-muted-foreground">Preview with your resume data</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSelectedTemplate(previewTemplate as TemplateName); setPreviewTemplate(null); }} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
                  Select Template
                </button>
                <button onClick={() => setPreviewTemplate(null)} className="p-1.5 rounded-full hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-auto p-4 bg-gray-100 dark:bg-gray-900 max-h-[calc(90vh-60px)]">
              <div className="mx-auto" style={{ width: '210mm', transform: 'scale(0.55)', transformOrigin: 'top center', height: 'calc(297mm * 0.55)' }}>
                {(() => { const TC = getTemplateComponent(previewTemplate as TemplateName); return <TC data={resumeData || sampleResumeData} primaryColor={primaryColor} />; })()}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
