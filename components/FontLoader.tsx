'use client';

import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';

const FONT_URL_MAP: Record<string, string> = {
  'Inter, system-ui, sans-serif': 'Inter:wght@300;400;500;600;700',
  'Roboto, Arial, sans-serif': 'Roboto:wght@300;400;500;700',
  '"Open Sans", Arial, sans-serif': 'Open+Sans:wght@300;400;600;700',
  'Lato, Arial, sans-serif': 'Lato:wght@300;400;700',
  'Merriweather, Georgia, serif': 'Merriweather:wght@300;400;700',
  '"Playfair Display", Georgia, serif': 'Playfair+Display:wght@400;500;600;700',
  '"Source Sans 3", Arial, sans-serif': 'Source+Sans+3:wght@300;400;600;700',
  'Nunito, Arial, sans-serif': 'Nunito:wght@300;400;600;700',
};

export default function FontLoader() {
  const fontFamily = useResumeStore((s) => s.styleOptions.fontFamily);
  const loadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const googleFont = FONT_URL_MAP[fontFamily];
    if (!googleFont || loadedRef.current.has(googleFont)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${googleFont}&display=swap`;
    document.head.appendChild(link);
    loadedRef.current.add(googleFont);
  }, [fontFamily]);

  return null;
}
