'use client';

// Compact autosave indicator for the builder header. Shows an indigo pulsing
// dot + "Saving..." while writes are in flight, and a green dot +
// "Saved <relative>" once the debounce settles. Replaces the old static
// "Saved" text that gave no feedback on active writes.

import { Check, Loader2 } from 'lucide-react';

export default function SaveStateChip({
  saving,
  label,
}: {
  saving: boolean;
  label: string;
}) {
  if (saving) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] text-indigo-400"
        aria-live="polite"
        aria-atomic="true"
      >
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        Saving...
      </span>
    );
  }
  if (!label) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400"
      aria-live="polite"
      aria-atomic="true"
      title={label}
    >
      <Check className="h-3 w-3" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">Saved</span>
    </span>
  );
}
