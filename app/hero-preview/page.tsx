'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, MousePointer2, Sparkles as SparklesIcon } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import {
  Tilt1_Classic,
  Tilt2_Parallax,
  Tilt3_Aurora,
  Tilt4_MagneticBadge,
  Tilt5_WakeTriple,
  Fill1_Skeletal,
  Fill2_CharacterTyping,
  Fill3_ScoreClimb,
  Fill4_HighlightSweep,
  Fill5_SuggestionPopups,
  Fill6_Combined,
} from '@/components/HeroOptions';

type Family = 'tilt' | 'fill' | 'combined';

interface OptionMeta {
  id: number;
  name: string;
  family: Family;
  component: React.ComponentType;
  inspiration: string;
  description: string;
  innovation: string;
  complexity: 'Low' | 'Medium' | 'High';
  vibe: string[];
  featured?: boolean;
}

const OPTIONS: OptionMeta[] = [
  // COMBINED (featured)
  {
    id: 11,
    name: 'Combined: Score Climb + Suggestions',
    family: 'combined',
    component: Fill6_Combined,
    inspiration: 'Grammarly + Duolingo + Notion AI',
    description:
      'The full AI workflow in one animation. The resume fills in section by section. As each section completes, a coaching chip pops in beside it ("+ metric", "Use action verb", "Quantify this"). A few steps later, each chip resolves to a green check with improved wording ("Metric added", "Strong verb", "Quantified") — and the ATS score chip in the corner climbs in lock-step from 0% → 94% with an "ATS-READY" badge at the end.',
    innovation:
      'Tells the complete product story in one loop: the AI writes, the AI coaches, the user improves, the score rises. No other hero in the resume category demonstrates write → review → improve → prove value in a single animation.',
    complexity: 'High',
    vibe: ['Full workflow', 'Value-proving', 'Featured'],
    featured: true,
  },
  // TILT FAMILY
  {
    id: 1,
    name: 'Classic Tilt',
    family: 'tilt',
    component: Tilt1_Classic,
    inspiration: 'Apple product pages, Linear.app',
    description:
      'A single card that rotates in 3D based on cursor position, with a soft radial specular highlight that tracks the mouse across the surface.',
    innovation: 'The industry baseline. Instantly recognisable, works everywhere, zero friction.',
    complexity: 'Low',
    vibe: ['Classic', 'Premium', 'Familiar'],
  },
  {
    id: 2,
    name: 'Parallax Tilt',
    family: 'tilt',
    component: Tilt2_Parallax,
    inspiration: 'Stripe docs, Arc browser homepage',
    description:
      'Multi-layer 3D: the card, an "ATS Score 94" pill, and a green checkmark badge all sit at different translateZ depths. When the card tilts, foreground elements move differently than the card itself — genuine parallax, not flat rotation.',
    innovation: 'True 3D depth with floating product proof-points embedded in the hero. The ATS badge and check mark communicate value without a single word of copy.',
    complexity: 'Medium',
    vibe: ['Depth', 'Product-proof', 'Magical'],
  },
  {
    id: 3,
    name: 'Aurora Sweep',
    family: 'tilt',
    component: Tilt3_Aurora,
    inspiration: 'Vercel AI demos, Linear "AI" tab',
    description:
      'Card tilts + a conic-gradient aurora (blue → purple → pink → teal) sweeps across the surface in sync with the cursor, blurred and blended in color-dodge mode. Creates a holographic foil effect.',
    innovation: 'First resume builder to use an AI-era aurora gradient as the hero. Signals "cutting-edge AI" without saying the word.',
    complexity: 'Medium',
    vibe: ['AI-forward', 'Holographic', 'Futuristic'],
  },
  {
    id: 4,
    name: 'Magnetic Badges',
    family: 'tilt',
    component: Tilt4_MagneticBadge,
    inspiration: 'Framer motion demos, Awwwards SOTD winners',
    description:
      'Card tilts, plus two floating chips ("AI Rewrite" and "ATS 94%") that are magnetically pulled toward the cursor with a spring-like lag. The chips move opposite directions, doubling the sense of aliveness.',
    innovation: 'The cursor effectively "interacts" with the product features, not just the card. Teaches the core value prop while the user plays.',
    complexity: 'Medium',
    vibe: ['Playful', 'Interactive', 'Feature-forward'],
  },
  {
    id: 5,
    name: 'Wake-Effect Triple',
    family: 'tilt',
    component: Tilt5_WakeTriple,
    inspiration: 'Apple Vision Pro launch page, Rauno.me experiments',
    description:
      'Three stacked templates respond to the same cursor, but each back card lags progressively behind the front, creating a visible "wake" as you move the mouse. The top card leads, the bottom cards catch up.',
    innovation: 'Uses motion latency as a design element. No one in the resume space does this; it makes the hero memorably strange in a good way.',
    complexity: 'High',
    vibe: ['Memorable', 'Unique', 'Technically impressive'],
  },
  // FILL FAMILY
  {
    id: 6,
    name: 'Skeletal Fill',
    family: 'fill',
    component: Fill1_Skeletal,
    inspiration: 'ChatGPT loading state, Linear skeleton loaders',
    description:
      'An empty resume frame with skeletal bars that fade in section by section on a 6-second loop: header → contact → summary → experience heading → experience items → skills heading → skill pills. The most minimal "AI is writing" animation.',
    innovation: 'Minimalist reference point. Focuses attention on the process without visual noise.',
    complexity: 'Low',
    vibe: ['Minimal', 'Clean', 'Honest'],
  },
  {
    id: 7,
    name: 'Character Typing',
    family: 'fill',
    component: Fill2_CharacterTyping,
    inspiration: 'ChatGPT streaming output, Jasper AI, Copy.ai demos',
    description:
      'Real resume text is typed out character by character with a blinking blue caret. The user sees "Sarah Mitchell" appear one letter at a time, then "Senior Product Manager", then full summary and experience bullets. Loops every ~12 seconds.',
    innovation: 'Literally dramatizes the AI writing assistant. No abstraction — users see real content being produced, which converts better than skeletal loaders.',
    complexity: 'Medium',
    vibe: ['Literal', 'AI demo', 'Convincing'],
  },
  {
    id: 8,
    name: 'ATS Score Climb',
    family: 'fill',
    component: Fill3_ScoreClimb,
    inspiration: 'Duolingo score-up, Notion progress UI',
    description:
      'Resume fills in while an ATS Score chip in the top-right corner climbs from 0% → 18% → 42% → 71% → 94%. The score color transitions from gray to amber to green. The chip has its own progress bar.',
    innovation: 'Turns the loading animation into a gamified value demonstration. Users see both "AI is building" AND "my resume is getting stronger" simultaneously.',
    complexity: 'Medium',
    vibe: ['Gamified', 'Value-first', 'Quantified'],
  },
  {
    id: 9,
    name: 'Highlight Sweep Review',
    family: 'fill',
    component: Fill4_HighlightSweep,
    inspiration: 'Grammarly review animation, Notion AI',
    description:
      'Two-phase animation: (1) resume fills in section by section, then (2) each section is sequentially highlighted with a pulsing blue ring as if being "reviewed", followed by a green check badge that pops in when review completes.',
    innovation: 'Shows the full AI workflow — write, then review. Signals rigor and quality control in a way no other builder does.',
    complexity: 'High',
    vibe: ['Rigorous', 'Two-phase', 'Quality-forward'],
  },
  {
    id: 10,
    name: 'Suggestion Popups',
    family: 'fill',
    component: Fill5_SuggestionPopups,
    inspiration: 'GitHub Copilot inline hints, Grammarly tooltips',
    description:
      'Resume fills in, then contextual AI suggestion chips pop in alongside each section: "Strong headline ✓" in green, "+ metric" in blue, "Use action verb" in amber, "Quantify this" in blue. Each chip slides in from its respective side.',
    innovation: 'Users see the AI actively coaching — not just writing. This is the only option that demonstrates the ongoing improvement loop.',
    complexity: 'Medium',
    vibe: ['Coaching', 'Actionable', 'Shows value'],
  },
];

export default function HeroPreviewPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [familyFilter, setFamilyFilter] = useState<Family | 'all'>('all');

  useEffect(() => {
    document.title = 'Hero Preview Gallery (internal) - ResumeForge';
  }, []);

  const visibleOptions = familyFilter === 'all' ? OPTIONS : OPTIONS.filter((o) => o.family === familyFilter);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <SiteNavbar />

      {/* Hero intro */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition">
            <ArrowLeft className="h-4 w-4" /> Back to homepage
          </Link>
          <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
            Internal preview — pick one
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">10 Hero Variations</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Two families of 5: <span className="text-blue-400 font-semibold">Mouse-Tracked Tilt</span> (move your cursor over the preview to see it respond) and <span className="text-blue-400 font-semibold">AI-Fill Animation</span> (watch the resume build itself). Each variation adds a specific innovation on top of the baseline.
          </p>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setFamilyFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${familyFilter === 'all' ? 'bg-white text-gray-900' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              All 10
            </button>
            <button
              onClick={() => setFamilyFilter('tilt')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition ${familyFilter === 'tilt' ? 'bg-white text-gray-900' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              <MousePointer2 className="h-3 w-3" /> Tilt family (5)
            </button>
            <button
              onClick={() => setFamilyFilter('fill')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition ${familyFilter === 'fill' ? 'bg-white text-gray-900' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
            >
              <SparklesIcon className="h-3 w-3" /> Fill family (5)
            </button>
          </div>

          {selected !== null && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-500/15 text-green-400 text-sm font-semibold px-4 py-2 rounded-full border border-green-500/30">
              <Check className="h-4 w-4" /> Selected: Option {selected} — {OPTIONS.find((o) => o.id === selected)?.name}
            </div>
          )}
        </div>
      </section>

      {/* Options grid */}
      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {visibleOptions.map((opt) => {
            const Comp = opt.component;
            const isSelected = selected === opt.id;
            const familyLabel = opt.family === 'tilt' ? 'Tilt' : 'Fill';
            const familyColor = opt.family === 'tilt' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700';
            return (
              <div
                key={opt.id}
                id={`option-${opt.id}`}
                className={`bg-white rounded-3xl overflow-hidden shadow-2xl ${isSelected ? 'ring-4 ring-green-400' : ''}`}
              >
                <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0">
                  {/* Info panel */}
                  <div className="p-8 md:p-10 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-5xl font-black text-gray-200">{String(opt.id).padStart(2, '0')}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${familyColor}`}>
                            {familyLabel}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{opt.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">Inspired by: {opt.inspiration}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed text-sm">{opt.description}</p>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-5">
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">The innovation</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{opt.innovation}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                          opt.complexity === 'Low'
                            ? 'bg-green-100 text-green-700'
                            : opt.complexity === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {opt.complexity}
                      </span>
                      {opt.vibe.map((v) => (
                        <span key={v} className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {v}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelected(opt.id)}
                      className={`mt-auto w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm transition inline-flex items-center justify-center gap-2 ${
                        isSelected ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-4 w-4" /> Selected
                        </>
                      ) : (
                        <>Select Option {opt.id}</>
                      )}
                    </button>
                  </div>

                  {/* Preview stage */}
                  <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black p-8 md:p-12 flex items-center justify-center min-h-[600px] overflow-hidden">
                    <Comp />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick jump */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick jump</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {OPTIONS.map((opt) => (
                <a
                  key={opt.id}
                  href={`#option-${opt.id}`}
                  className={`text-xs p-3 rounded-lg border transition ${
                    selected === opt.id
                      ? 'bg-green-50 border-green-300 text-green-700 font-semibold'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span className="block font-bold">#{opt.id}</span>
                  <span className="block">{opt.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
