'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { TEMPLATES, DEFAULT_COLORS, sampleResumeData } from '@/types/resume';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, RotateCcw } from 'lucide-react';
import { getTemplateComponent } from '@/components/templates';
import { FONT_OPTIONS, DEFAULT_STYLE_OPTIONS } from '@/components/templates/TemplateWrapper';

export default function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate, primaryColor, setPrimaryColor, styleOptions, updateStyleOptions } = useResumeStore();

  return (
    <div className="space-y-6">
      {/* ---- TEMPLATES ---- */}
      <section>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Template</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {TEMPLATES.map((t) => {
            const TemplateComponent = getTemplateComponent(t.name);
            const isSelected = selectedTemplate === t.name;
            return (
              <button
                key={t.name}
                className={`group relative rounded-lg overflow-hidden border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary shadow-md ring-1 ring-primary/20'
                    : 'border-transparent hover:border-muted-foreground/20 hover:shadow-sm'
                }`}
                onClick={() => setSelectedTemplate(t.name)}
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
                    }}
                  >
                    <TemplateComponent
                      data={sampleResumeData}
                      primaryColor={isSelected ? primaryColor : t.primaryColor}
                    />
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="px-1.5 py-1 bg-muted/50">
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
                </div>
              </button>
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
            <span className="text-[9px] text-muted-foreground">+</span>
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
                  className="text-[9px] text-muted-foreground block mt-0.5"
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
    </div>
  );
}
