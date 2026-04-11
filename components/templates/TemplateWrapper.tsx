'use client';

import { ResumeData } from '@/types/resume';

export interface StyleOptions {
  fontFamily: string;
  fontSize: number; // base font size in px (default ~11)
  lineHeight: number; // multiplier (default 1.4)
  sectionSpacing: number; // px between sections (default 16)
  pageMargin: number; // px page margin (default 32)
}

export const DEFAULT_STYLE_OPTIONS: StyleOptions = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 11,
  lineHeight: 1.4,
  sectionSpacing: 16,
  pageMargin: 32,
};

export const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", Arial, sans-serif' },
  { label: 'Lato', value: 'Lato, Arial, sans-serif' },
  { label: 'Merriweather', value: 'Merriweather, Georgia, serif' },
  { label: 'Playfair Display', value: '"Playfair Display", Georgia, serif' },
  { label: 'Source Sans 3', value: '"Source Sans 3", Arial, sans-serif' },
  { label: 'Nunito', value: 'Nunito, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
];

export interface TemplateProps {
  data: ResumeData;
  primaryColor: string;
  styleOptions?: StyleOptions;
}

export function formatBullet(text: string): string {
  return text.replace(/^[•\-\*]\s*/, '');
}

export function ContactSeparator({ color }: { color: string }) {
  return <span style={{ color, opacity: 0.5 }} className="mx-1.5">|</span>;
}

/**
 * Render a custom section. Used by all templates in their renderSection switch default case.
 */
export function renderCustomSection(data: ResumeData, sectionKey: string, primaryColor: string) {
  if (!sectionKey.startsWith('custom-')) return null;
  const customId = sectionKey.replace('custom-', '');
  const section = data.customSections.find(s => s.id === customId);
  if (!section || section.items.length === 0) return null;

  return (
    <div key={sectionKey} className="mb-5">
      <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
        {section.title}
      </h2>
      {section.items.map(item => (
        <div key={item.id} className="mb-2">
          <div className="flex justify-between items-baseline">
            <h3 className="text-[11px] font-bold text-gray-900">{item.title}</h3>
            {item.date && <span className="text-[9px] text-gray-500 shrink-0 ml-2">{item.date}</span>}
          </div>
          {item.subtitle && <p className="text-[10px] text-gray-600">{item.subtitle}</p>}
          {item.description && <p className="text-[10px] text-gray-700 mt-0.5">{item.description}</p>}
        </div>
      ))}
    </div>
  );
}
