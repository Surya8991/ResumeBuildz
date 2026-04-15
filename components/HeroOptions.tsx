'use client';

// 10 hero-image treatments for the homepage — focused on two families:
//   - Options 1-5: Mouse-Tracked Tilt variations (3D cards that respond to cursor)
//   - Options 6-10: Typing / AI-Fill animation variations
//
// All use existing template PNGs from /public/templates/ and no new deps.

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Sparkles, CheckCircle2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// MOUSE-TRACKED TILT FAMILY (5 variations)
// ═══════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────
// Option 1 — Classic Tilt with Specular Highlight
// Card tilts in 3D based on cursor, radial highlight follows the cursor.
// The baseline that everyone knows from Apple product pages.
// ───────────────────────────────────────────────────────────
export function Tilt1_Classic() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, x: 50, y: 50 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({
      rx: -(yPct - 50) / 4,
      ry: (xPct - 50) / 4,
      x: xPct,
      y: yPct,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, x: 50, y: 50 });

  return (
    <div className="w-[360px] h-[480px] mx-auto" style={{ perspective: '1500px' }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onLeave}
        className="w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-blue-500/30 transition-transform duration-200 ease-out relative"
        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transformStyle: 'preserve-3d' }}
      >
        <Image src="/templates/modern.png" alt="Modern template" fill className="object-cover object-top" sizes="360px" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${tilt.x}% ${tilt.y}%, rgba(255,255,255,0.35), transparent 55%)`,
          }}
        />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 2 — Parallax Tilt (Multi-Layer Depth)
// The header, body, and accent shapes all tilt with slightly different
// translateZ depths, creating genuine parallax instead of flat tilt.
// ───────────────────────────────────────────────────────────
export function Tilt2_Parallax() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 18, ry: x * 22 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div className="w-[360px] h-[480px] mx-auto" style={{ perspective: '1400px' }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onLeave}
        className="relative w-full h-full rounded-2xl transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* Base card */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl" style={{ transform: 'translateZ(0px)' }}>
          <Image src="/templates/modern.png" alt="" fill className="object-cover object-top" sizes="360px" />
        </div>
        {/* Floating accent pill above card */}
        <div
          className="absolute top-6 left-6 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl"
          style={{ transform: 'translateZ(60px)' }}
        >
          ATS Score 94
        </div>
        {/* Floating check badge */}
        <div
          className="absolute bottom-8 right-8 h-14 w-14 rounded-full bg-green-500 shadow-2xl flex items-center justify-center"
          style={{ transform: 'translateZ(80px)' }}
        >
          <CheckCircle2 className="h-7 w-7 text-white" />
        </div>
        {/* Subtle highlight stripe */}
        <div
          className="absolute top-1/3 left-0 right-0 h-16 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
          style={{ transform: 'translateZ(30px)' }}
        />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 3 — Aurora Sweep Tilt
// Card tilts + a soft aurora gradient sweeps across the surface based
// on cursor position. Feels like holographic foil.
// ───────────────────────────────────────────────────────────
export function Tilt3_Aurora() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ rx: 0, ry: 0, x: 50, y: 50 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setState({ rx: -((yPct - 50) / 5), ry: (xPct - 50) / 5, x: xPct, y: yPct });
  };
  const onLeave = () => setState({ rx: 0, ry: 0, x: 50, y: 50 });

  return (
    <div className="w-[360px] h-[480px] mx-auto" style={{ perspective: '1500px' }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onLeave}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${state.rx}deg) rotateY(${state.ry}deg)`, transformStyle: 'preserve-3d' }}
      >
        <Image src="/templates/tech.png" alt="Tech template" fill className="object-cover object-top" sizes="360px" />
        {/* Aurora gradient — follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-80"
          style={{
            background: `conic-gradient(from ${(state.x + state.y) * 2}deg at ${state.x}% ${state.y}%, #3b82f6, #a855f7, #ec4899, #14b8a6, #3b82f6)`,
            filter: 'blur(28px)',
          }}
        />
        {/* Glare */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${state.x}% ${state.y}%, rgba(255,255,255,0.3), transparent 45%)`,
          }}
        />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 4 — Magnetic Badges (Card + Floating Chip)
// Card tilts + a "New AI" badge floats above the card and is gently
// magnetically pulled toward the cursor with lag (spring-like).
// ───────────────────────────────────────────────────────────
export function Tilt4_MagneticBadge() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ rx: 0, ry: 0, bx: 0, by: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setState({
      rx: -y * 15,
      ry: x * 18,
      bx: x * 40,
      by: y * 40,
    });
  };
  const onLeave = () => setState({ rx: 0, ry: 0, bx: 0, by: 0 });

  return (
    <div className="relative w-[360px] h-[480px] mx-auto" style={{ perspective: '1500px' }}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onLeave}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-indigo-500/30 transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${state.rx}deg) rotateY(${state.ry}deg)`, transformStyle: 'preserve-3d' }}
      >
        <Image src="/templates/creative.png" alt="Creative template" fill className="object-cover object-top" sizes="360px" />
      </div>
      {/* Magnetic badge — outside tilt container, follows cursor with lag */}
      <div
        className="absolute top-4 right-4 pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: `translate(${state.bx}px, ${state.by}px)` }}
      >
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-2xl shadow-orange-500/40 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          AI Rewrite
        </div>
      </div>
      {/* Second magnetic badge on opposite corner */}
      <div
        className="absolute bottom-6 left-4 pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${-state.bx * 0.7}px, ${-state.by * 0.7}px)` }}
      >
        <div className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          ATS 94%
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 5 — Wake-Effect Triple Tilt
// Three stacked cards that all respond to the cursor, but with a small
// delay each — creating a "wake" where the back cards lag behind.
// ───────────────────────────────────────────────────────────
export function Tilt5_WakeTriple() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const templates = ['classic', 'professional', 'modern'];

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 18, ry: x * 20 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onLeave} className="relative w-[420px] h-[500px] mx-auto" style={{ perspective: '1600px' }}>
      {templates.map((t, i) => {
        // Back cards lag via progressively longer transition
        const lag = (templates.length - 1 - i) * 100;
        const depth = i * 40;
        const isTop = i === templates.length - 1;
        return (
          <div
            key={t}
            className="absolute top-0 left-1/2 w-[280px] h-[380px] -translate-x-1/2 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xl"
            style={{
              transform: `translate(-50%, 0) translateZ(${depth}px) rotateX(${tilt.rx * (isTop ? 1 : 0.6)}deg) rotateY(${tilt.ry * (isTop ? 1 : 0.6)}deg)`,
              transition: `transform ${200 + lag}ms ease-out`,
              transformStyle: 'preserve-3d',
              top: `${(templates.length - 1 - i) * 20}px`,
            }}
          >
            <Image src={`/templates/${t}.png`} alt="" fill className="object-cover object-top" sizes="280px" />
            {!isTop && <div className="absolute inset-0 bg-black/30" />}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TYPING / AI-FILL FAMILY (5 variations)
// ═══════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────
// Option 6 — Classic Skeletal Fill
// Empty resume bars fill in section by section on a loop.
// The baseline "AI is writing" animation.
// ───────────────────────────────────────────────────────────
export function Fill1_Skeletal() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % 8), 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[360px] h-[480px] mx-auto rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-blue-500/20 p-8">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className={`h-6 bg-gray-900 rounded transition-all duration-500 ${step >= 1 ? 'w-40 opacity-100' : 'w-0 opacity-0'}`} />
        <div className={`h-3 bg-gray-400 rounded transition-all duration-500 ${step >= 2 ? 'w-56 opacity-100' : 'w-0 opacity-0'}`} />
      </div>
      {/* Summary */}
      <div className="space-y-1.5 mb-6">
        <div className={`h-3 bg-gray-300 rounded transition-all duration-500 ${step >= 3 ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
        <div className={`h-3 bg-gray-300 rounded transition-all duration-500 ${step >= 3 ? 'w-[90%] opacity-100' : 'w-0 opacity-0'}`} />
        <div className={`h-3 bg-gray-300 rounded transition-all duration-500 ${step >= 3 ? 'w-[75%] opacity-100' : 'w-0 opacity-0'}`} />
      </div>
      {/* Experience heading */}
      <div className={`h-4 bg-blue-500 rounded mb-3 transition-all duration-500 ${step >= 4 ? 'w-32 opacity-100' : 'w-0 opacity-0'}`} />
      <div className="space-y-4 mb-6">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className={`h-3 bg-gray-800 rounded transition-all duration-500 ${step >= 5 ? 'w-48 opacity-100' : 'w-0 opacity-0'}`} />
            <div className={`h-2.5 bg-gray-300 rounded transition-all duration-500 ${step >= 5 ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
            <div className={`h-2.5 bg-gray-300 rounded transition-all duration-500 ${step >= 5 ? 'w-[85%] opacity-100' : 'w-0 opacity-0'}`} />
          </div>
        ))}
      </div>
      <div className={`h-4 bg-blue-500 rounded mb-3 transition-all duration-500 ${step >= 6 ? 'w-24 opacity-100' : 'w-0 opacity-0'}`} />
      <div className="flex flex-wrap gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-6 bg-blue-100 rounded-full transition-all duration-500 ${step >= 7 ? 'w-14 opacity-100' : 'w-0 opacity-0'}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 7 — Character Typing (ChatGPT style)
// Real text typed out character by character with a blinking caret.
// Dramatizes the AI writing assistant literally.
// ───────────────────────────────────────────────────────────
export function Fill2_CharacterTyping() {
  const SCRIPT = [
    'Sarah Mitchell',
    'Senior Product Manager | SF Bay Area',
    '',
    'SUMMARY',
    'Product leader with 7 years scaling B2B SaaS products from 0 to $12M ARR. Expert in customer discovery, roadmap prioritisation, and data-driven experimentation.',
    '',
    'EXPERIENCE',
    '— Led product strategy for growth team of 6 engineers',
    '— Shipped 14 features, increasing weekly active users 2.1x',
    '— Reduced churn 34% via onboarding redesign',
  ];
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const caret = setInterval(() => setShowCaret((c) => !c), 500);
    return () => clearInterval(caret);
  }, []);

  useEffect(() => {
    const line = SCRIPT[lineIdx];
    if (line === undefined) {
      // Restart
      const restart = setTimeout(() => {
        setLineIdx(0);
        setCharIdx(0);
      }, 2000);
      return () => clearTimeout(restart);
    }
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 25);
      return () => clearTimeout(t);
    }
    const next = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, 300);
    return () => clearTimeout(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIdx, charIdx]);

  return (
    <div className="w-[360px] h-[480px] mx-auto rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-blue-500/20 p-7 font-sans text-[11px] text-gray-800">
      {SCRIPT.slice(0, lineIdx + 1).map((line, i) => {
        const text = i === lineIdx ? line.slice(0, charIdx) : line;
        const isHeader = ['SUMMARY', 'EXPERIENCE'].includes(line);
        const isTitle = i === 0;
        const isSubtitle = i === 1;
        return (
          <div
            key={i}
            className={`${isTitle ? 'text-xl font-bold text-gray-900 mb-1' : ''} ${isSubtitle ? 'text-sm text-gray-500 mb-4' : ''} ${
              isHeader ? 'text-[10px] uppercase tracking-widest font-bold text-blue-600 mt-4 mb-2' : ''
            } ${!isTitle && !isSubtitle && !isHeader ? 'leading-relaxed mb-1' : ''}`}
          >
            {text}
            {i === lineIdx && showCaret && <span className="inline-block w-0.5 h-3 bg-blue-500 translate-y-0.5 ml-0.5" />}
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 8 — Gamified ATS Score Climb
// Resume fills in while an ATS score dial climbs from 0% to 94%.
// Left side is the resume, right side (floating chip) is the score.
// ───────────────────────────────────────────────────────────
export function Fill3_ScoreClimb() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => setStep((s) => (s + 1) % 8), 600);
    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    const target = step >= 7 ? 94 : step >= 5 ? 71 : step >= 3 ? 42 : step >= 1 ? 18 : 0;
    const id = setInterval(() => {
      setScore((s) => {
        if (s === target) return s;
        return s < target ? s + 1 : s - 1;
      });
    }, 15);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div className="relative w-[400px] h-[480px] mx-auto">
      {/* Resume card */}
      <div className="w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-blue-500/20 p-8">
        <div className="space-y-2 mb-5">
          <div className={`h-6 bg-gray-900 rounded transition-all duration-500 ${step >= 1 ? 'w-40' : 'w-0'}`} />
          <div className={`h-3 bg-gray-400 rounded transition-all duration-500 ${step >= 2 ? 'w-56' : 'w-0'}`} />
        </div>
        <div className="space-y-1.5 mb-5">
          <div className={`h-2.5 bg-gray-300 rounded transition-all duration-500 ${step >= 3 ? 'w-full' : 'w-0'}`} />
          <div className={`h-2.5 bg-gray-300 rounded transition-all duration-500 ${step >= 3 ? 'w-[88%]' : 'w-0'}`} />
        </div>
        <div className={`h-3 bg-blue-500 rounded mb-3 transition-all duration-500 ${step >= 4 ? 'w-24' : 'w-0'}`} />
        <div className="space-y-3 mb-5">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-1">
              <div className={`h-2.5 bg-gray-800 rounded transition-all duration-500 ${step >= 5 ? 'w-40' : 'w-0'}`} />
              <div className={`h-2 bg-gray-300 rounded transition-all duration-500 ${step >= 5 ? 'w-full' : 'w-0'}`} />
              <div className={`h-2 bg-gray-300 rounded transition-all duration-500 ${step >= 5 ? 'w-[75%]' : 'w-0'}`} />
            </div>
          ))}
        </div>
        <div className={`h-3 bg-blue-500 rounded mb-2 transition-all duration-500 ${step >= 6 ? 'w-20' : 'w-0'}`} />
        <div className="flex flex-wrap gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-5 bg-blue-100 rounded-full transition-all duration-500 ${step >= 7 ? 'w-12' : 'w-0'}`} style={{ transitionDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>

      {/* Score chip */}
      <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-36">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">ATS Score</p>
        <div className="flex items-end gap-1 mb-2">
          <span className={`text-4xl font-black tabular-nums ${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-gray-400'}`}>{score}</span>
          <span className="text-sm text-gray-400 mb-1">%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 9 — Highlight Sweep Review
// Resume fills, then a blue highlight sweep moves down through each
// section as if an AI is "reviewing" each block. Reviewed sections
// get a green check.
// ───────────────────────────────────────────────────────────
export function Fill4_HighlightSweep() {
  const [phase, setPhase] = useState<'filling' | 'reviewing' | 'done'>('filling');
  const [fillStep, setFillStep] = useState(0);
  const [reviewStep, setReviewStep] = useState(-1);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (phase === 'filling') {
      timer = setInterval(() => {
        setFillStep((s) => {
          if (s >= 4) {
            setPhase('reviewing');
            return 4;
          }
          return s + 1;
        });
      }, 500);
    } else if (phase === 'reviewing') {
      timer = setInterval(() => {
        setReviewStep((s) => {
          if (s >= 3) {
            setPhase('done');
            return 3;
          }
          return s + 1;
        });
      }, 700);
    } else {
      timer = setTimeout(() => {
        setPhase('filling');
        setFillStep(0);
        setReviewStep(-1);
      }, 1800) as unknown as ReturnType<typeof setInterval>;
    }
    return () => {
      if (phase === 'done') clearTimeout(timer as unknown as number);
      else clearInterval(timer);
    };
  }, [phase]);

  const sections = [
    { key: 'header', height: 'h-12' },
    { key: 'summary', height: 'h-16' },
    { key: 'experience', height: 'h-24' },
    { key: 'skills', height: 'h-16' },
  ];

  return (
    <div className="w-[360px] h-[480px] mx-auto rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-blue-500/20 p-7 space-y-4">
      {sections.map((s, i) => {
        const filled = fillStep > i;
        const reviewing = reviewStep === i;
        const reviewed = reviewStep > i || phase === 'done';
        return (
          <div key={s.key} className="relative">
            <div className={`${s.height} rounded-lg transition-all duration-500 ${filled ? 'bg-gray-100' : 'bg-gray-50'} ${reviewing ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/30' : reviewed ? 'ring-2 ring-green-500/50' : ''}`}>
              {filled && (
                <div className="p-3 space-y-2">
                  <div className="h-2 bg-gray-300 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  {i >= 2 && <div className="h-2 bg-gray-200 rounded w-[80%]" />}
                  {i >= 2 && <div className="h-2 bg-gray-200 rounded w-[65%]" />}
                </div>
              )}
              {reviewing && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0 animate-pulse" />
              )}
            </div>
            {reviewed && (
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-scale-in">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 10 — AI Suggestion Popups
// Resume fills, then contextual suggestion chips pop in next to each
// section ("add a metric", "strong verb", "quantify this"). Feels like
// the AI is actively coaching the user.
// ───────────────────────────────────────────────────────────
export function Fill5_SuggestionPopups() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((s) => (s + 1) % 10), 600);
    return () => clearInterval(timer);
  }, []);

  const suggestions = [
    { top: '14%', side: 'right', text: 'Strong headline ✓', color: 'green' },
    { top: '34%', side: 'left', text: '+ metric', color: 'blue' },
    { top: '52%', side: 'right', text: 'Use action verb', color: 'amber' },
    { top: '74%', side: 'left', text: 'Quantify this', color: 'blue' },
  ];

  return (
    <div className="relative w-[420px] h-[520px] mx-auto">
      <div className="w-[360px] h-[480px] mx-auto rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-blue-500/20 p-8">
        <div className="space-y-2 mb-6">
          <div className={`h-6 bg-gray-900 rounded transition-all duration-500 ${step >= 1 ? 'w-40' : 'w-0'}`} />
          <div className={`h-3 bg-gray-400 rounded transition-all duration-500 ${step >= 2 ? 'w-56' : 'w-0'}`} />
        </div>
        <div className="space-y-1.5 mb-6">
          <div className={`h-3 bg-gray-300 rounded transition-all duration-500 ${step >= 3 ? 'w-full' : 'w-0'}`} />
          <div className={`h-3 bg-gray-300 rounded transition-all duration-500 ${step >= 3 ? 'w-[85%]' : 'w-0'}`} />
        </div>
        <div className={`h-4 bg-blue-500 rounded mb-3 transition-all duration-500 ${step >= 4 ? 'w-32' : 'w-0'}`} />
        <div className="space-y-4 mb-6">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className={`h-3 bg-gray-800 rounded transition-all duration-500 ${step >= 5 ? 'w-48' : 'w-0'}`} />
              <div className={`h-2.5 bg-gray-300 rounded transition-all duration-500 ${step >= 5 ? 'w-full' : 'w-0'}`} />
              <div className={`h-2.5 bg-gray-300 rounded transition-all duration-500 ${step >= 5 ? 'w-[85%]' : 'w-0'}`} />
            </div>
          ))}
        </div>
        <div className={`h-4 bg-blue-500 rounded mb-3 transition-all duration-500 ${step >= 6 ? 'w-24' : 'w-0'}`} />
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-6 bg-blue-100 rounded-full transition-all duration-500 ${step >= 7 ? 'w-14' : 'w-0'}`} style={{ transitionDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
      {/* Suggestion popups — appear on a delay after resume fills */}
      {suggestions.map((s, i) => {
        const visible = step >= 6 + Math.min(i, 3);
        const colorClasses = s.color === 'green' ? 'bg-green-500 text-white' : s.color === 'amber' ? 'bg-amber-400 text-gray-900' : 'bg-blue-500 text-white';
        return (
          <div
            key={i}
            className={`absolute text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl transition-all duration-500 ${colorClasses} ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0'
            }`}
            style={{
              top: s.top,
              [s.side]: '0',
              transform: visible ? 'translateX(0)' : s.side === 'right' ? 'translateX(20px)' : 'translateX(-20px)',
            }}
          >
            {s.text}
          </div>
        );
      })}
    </div>
  );
}
