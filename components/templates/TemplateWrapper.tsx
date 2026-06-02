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

/**
 * Ensure a URL has a protocol prefix.
 * If it already starts with http:// or https://, return as-is.
 * Otherwise prepend https://.
 */
export function ensureUrl(url: string): string {
  if (/^(javascript|data|vbscript):/i.test(url)) return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

/** Only allow data-URL photos. Remote URLs leak user IP / enable SSRF. */
export function safePhotoSrc(src: string): string {
  if (!src) return '';
  if (src.startsWith('data:image/')) return src;
  return '';
}

/** Validate hex color to prevent CSS injection via primaryColor. */
export function safePrimaryColor(color: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#2563eb';
}

/** Pick #fff or #111 for legible text on a given background using WCAG relative luminance.
 *  Used in templates where header/sidebar text sits on top of primaryColor — a pale primary
 *  would otherwise hide white text. */
export function readableOn(hex: string): '#ffffff' | '#111111' {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  const srgb = [r, g, b].map(v => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return L > 0.55 ? '#111111' : '#ffffff';
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
