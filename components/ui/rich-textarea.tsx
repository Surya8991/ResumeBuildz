'use client';

import { useRef } from 'react';
import { Bold, Italic, List, Minus } from 'lucide-react';

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

function insertAtCursor(textarea: HTMLTextAreaElement, before: string, after: string = '') {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);

  if (selected) {
    // Wrap selected text
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    textarea.value = newText;
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = end + before.length;
  } else {
    // Insert at cursor
    const newText = text.substring(0, start) + before + after + text.substring(end);
    textarea.value = newText;
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length;
  }

  // Trigger React onChange
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
  textarea.focus();
}

function toggleLinePrefix(textarea: HTMLTextAreaElement, prefix: string) {
  const start = textarea.selectionStart;
  const text = textarea.value;

  // Find the start of the current line
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = text.indexOf('\n', start);
  const line = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);

  let newText: string;
  let newCursorPos: number;

  if (line.startsWith(prefix)) {
    // Remove prefix
    newText = text.substring(0, lineStart) + line.substring(prefix.length) + text.substring(lineEnd === -1 ? text.length : lineEnd);
    newCursorPos = start - prefix.length;
  } else {
    // Add prefix
    newText = text.substring(0, lineStart) + prefix + line + text.substring(lineEnd === -1 ? text.length : lineEnd);
    newCursorPos = start + prefix.length;
  }

  textarea.value = newText;
  textarea.selectionStart = textarea.selectionEnd = Math.max(0, newCursorPos);

  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
  textarea.focus();
}

export default function RichTextarea({ value, onChange, placeholder, rows = 5, className = '' }: RichTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleBold = () => {
    if (ref.current) insertAtCursor(ref.current, '**', '**');
  };

  const handleItalic = () => {
    if (ref.current) insertAtCursor(ref.current, '*', '*');
  };

  const handleBullet = () => {
    if (ref.current) toggleLinePrefix(ref.current, '- ');
  };

  const handleDivider = () => {
    if (ref.current) {
      const ta = ref.current;
      const pos = ta.selectionStart;
      const text = ta.value;
      const newText = text.substring(0, pos) + '\n---\n' + text.substring(pos);
      ta.value = newText;
      ta.selectionStart = ta.selectionEnd = pos + 5;
      const event = new Event('input', { bubbles: true });
      ta.dispatchEvent(event);
      ta.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') { e.preventDefault(); handleBold(); }
      if (e.key === 'i') { e.preventDefault(); handleItalic(); }
    }
  };

  return (
    <div className="space-y-1">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-1 border rounded-md bg-muted/30">
        <button
          type="button"
          onClick={handleBold}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={handleBullet}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title="Bullet point"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={handleDivider}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          title="Divider"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="ml-auto text-[9px] text-muted-foreground px-1">Ctrl+B/I</span>
      </div>

      {/* Textarea */}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
      />
    </div>
  );
}
