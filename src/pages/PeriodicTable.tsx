import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { ELEMENTS } from '../data/elements';
import { BohrModel } from '../components/BohrModel';
import { getElementHistory } from '../data/elementHistory';
import { generateRecentIncident } from '../utils/elementIncidents';
import { elementsData } from '../data/elementsData';
import { X, Volume2, VolumeX, ArrowRight, ArrowLeft, Bookmark, History, FlaskConical, Maximize2, Zap, Atom, Layers, Sparkles, User, BookOpen, Compass } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export type ChemElement = typeof ELEMENTS[0];

/* ------------------------------------------------------------------ */
/*  Category legend                                                    */
/* ------------------------------------------------------------------ */
const CATEGORY_META: Record<string, { label: string; color: string }> = {
  'nonmetal':          { label: 'Non-metal',        color: '#22d3ee' },
  'noble-gas':         { label: 'Noble Gas',        color: '#a78bfa' },
  'alkali-metal':      { label: 'Alkali Metal',     color: '#f472b6' },
  'alkaline-earth':    { label: 'Alkaline Earth',   color: '#fb923c' },
  'transition-metal':  { label: 'Transition Metal', color: '#60a5fa' },
  'post-transition':   { label: 'Post-transition',  color: '#38bdf8' },
  'metalloid':         { label: 'Metalloid',        color: '#a3e635' },
  'halogen':           { label: 'Halogen',          color: '#facc15' },
  'lanthanide':        { label: 'Lanthanide',       color: '#f9a8d4' },
  'actinide':          { label: 'Actinide',         color: '#fca5a5' },
  'unknown':           { label: 'Unknown',          color: '#94a3b8' },
};

/* ------------------------------------------------------------------ */
/*  Voice narration hook (Web Speech API + word tracking)               */
/* ------------------------------------------------------------------ */
const useElementNarration = () => {
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [currentText, setCurrentText] = useState('');

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentCharIndex(-1);
  }, []);

  const speak = useCallback((text: string) => {
    stop();
    if (!text) return;
    setCurrentText(text);
    setCurrentCharIndex(0);
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utter.voice = preferred;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => { setIsSpeaking(false); setCurrentCharIndex(-1); };
    utter.onerror = () => { setIsSpeaking(false); setCurrentCharIndex(-1); };
    // Track word boundaries for highlighting
    utter.onboundary = (e: SpeechSynthesisEvent) => {
      if (e.name === 'word') {
        setCurrentCharIndex(e.charIndex);
      }
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [stop]);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    return () => stop();
  }, [stop]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) stop();
      return !prev;
    });
  }, [stop]);

  return { speak, stop, isSpeaking, isMuted, toggleMute, currentCharIndex, currentText };
};

/* ------------------------------------------------------------------ */
/*  Narration script builders                                          */
/* ------------------------------------------------------------------ */
const SHELL_NAMES_SPOKEN = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

/** Narration when element modal first opens — overview + fun character example */
function buildElementOverviewScript(el: ChemElement): string {
  const history = getElementHistory(el.number);
  const stateWord = el.state === 'solid' ? 'a solid' : el.state === 'liquid' ? 'a liquid' : el.state === 'gas' ? 'a gas' : 'in an unknown state';

  let script = `This is ${el.name}, element number ${el.number}, with the symbol ${el.symbol}. `;
  script += `It has an atomic mass of ${el.mass} atomic mass units, and at room temperature it is ${stateWord}. `;
  script += `It belongs to the ${(CATEGORY_META[el.category]?.label || el.category)} group. `;

  if (history) {
    script += `Here's how it's used in real life: ${history.detailedUse} `;
    script += `A fun fact: ${history.funFact} `;
  } else {
    script += `It is commonly used for: ${el.real_world_use}. `;
  }

  return script;
}

/** Narration for the fullscreen Bohr model — atomic structure details */
function buildAtomicStructureScript(el: Element): string {
  const totalElectrons = el.shells.reduce((a, b) => a + b, 0);
  const history = getElementHistory(el.number);

  let script = `Let's explore the atomic structure of ${el.name}. `;
  script += `${el.name} has ${totalElectrons} electron${totalElectrons !== 1 ? 's' : ''} arranged in ${el.shells.length} shell${el.shells.length !== 1 ? 's' : ''}. `;

  el.shells.forEach((count, i) => {
    script += `The ${SHELL_NAMES_SPOKEN[i]} shell holds ${count} electron${count !== 1 ? 's' : ''}. `;
  });

  // Valence electron insight
  const valence = el.shells[el.shells.length - 1];
  script += `The outermost shell has ${valence} valence electron${valence !== 1 ? 's' : ''}, `;
  if (valence <= 3) {
    script += `which means ${el.name} tends to lose electrons and form positive ions. `;
  } else if (valence >= 5 && valence <= 7) {
    script += `which means ${el.name} tends to gain electrons and form negative ions. `;
  } else if (valence === 8) {
    script += `giving it a completely full outer shell, making it very stable and unreactive. `;
  } else {
    script += `giving it interesting bonding properties. `;
  }

  if (history) {
    script += `This element was discovered by ${history.discoverer}. ${history.experiment} `;
  }

  return script;
}

/** Short narration when exiting Bohr fullscreen — use-case story with character */
function buildUseCaseStoryScript(el: Element): string {
  const history = getElementHistory(el.number);
  if (!history) return `${el.name} is used for ${el.real_world_use}.`;

  // Character-based real-life scenario
  const stories: Record<string, string> = {
    'nonmetal': `Imagine a student named Priya studying chemistry. She takes a deep breath — and 78% of that breath is nitrogen, a nonmetal just like ${el.name}. ${history.detailedUse}`,
    'noble-gas': `Picture an engineer named Alex designing a sign for a new restaurant. Alex fills the glass tubes with ${el.name} gas and switches on the power — the tube lights up brilliantly! ${history.detailedUse}`,
    'alkali-metal': `Think of a scientist named Dr. Chen in her lab. She carefully drops a tiny piece of ${el.name} into water — it fizzes and reacts instantly! Alkali metals are incredibly reactive. ${history.detailedUse}`,
    'alkaline-earth': `Imagine a doctor named Raj checking a patient's bone density scan. The calcium and ${el.name} in our bones keeps our skeleton strong. ${history.detailedUse}`,
    'transition-metal': `Picture a blacksmith named Sofia heating metal in her forge. Transition metals like ${el.name} are the backbone of modern industry. ${history.detailedUse}`,
    'post-transition': `Imagine an engineer named Wei designing an aircraft. Post-transition metals like ${el.name} are lightweight yet incredibly useful. ${history.detailedUse}`,
    'metalloid': `Think of a tech entrepreneur named Maya building a new smartphone. The chip inside relies on metalloids like ${el.name} to function. ${history.detailedUse}`,
    'halogen': `Picture a lifeguard named Sam testing the pool water. Halogens like ${el.name} keep swimming pools safe by killing dangerous bacteria. ${history.detailedUse}`,
    'lanthanide': `Imagine a wind farm engineer named Lena checking her turbines. The powerful magnets inside use rare earth elements like ${el.name}. ${history.detailedUse}`,
    'actinide': `Think of a nuclear physicist named Dr. Tanaka monitoring a reactor. Actinides like ${el.name} release enormous energy from their atoms. ${history.detailedUse}`,
  };

  return stories[el.category] || `Here is how ${el.name} is used: ${history.detailedUse}`;
}

/** Dynamic Narration for the 4 Index Chapters */
function buildChapterScript(el: Element, chapterIdx: number): string {
  const richData = elementsData.find(d => d.symbol === el.symbol);
  
  if (richData) {
    if (chapterIdx === 0) return richData.rightPage.chapter1_Origins;
    if (chapterIdx === 1) return richData.rightPage.chapter2_Architecture;
    if (chapterIdx === 2) return richData.rightPage.chapter3_Applications;
    if (chapterIdx === 3) {
      return richData.rightPage.chapter4_Curiosities;
    }
    if (chapterIdx === 4) {
      if (richData.rightPage.chapter5_Reactions) {
        return `Welcome to the Major Reactions chapter. Here is an amazing reaction involving ${el.name}: ${richData.rightPage.chapter5_Reactions.title}. ${richData.rightPage.chapter5_Reactions.description} The equation is: ${richData.rightPage.chapter5_Reactions.equation}.`;
      } else {
        return `Major Reactions involving ${el.name}. While specific equations are not listed here, ${el.name} participates in many fascinating chemical reactions in both nature and industry.`;
      }
    }
  }

  // Fallback for elements without richData
  if (chapterIdx === 0) return `The discovery and origins of ${el.name}. ${buildElementOverviewScript(el)}`;
  if (chapterIdx === 1) return buildAtomicStructureScript(el);
  if (chapterIdx === 2) return buildUseCaseStoryScript(el);
  if (chapterIdx === 3) {
    const history = getElementHistory(el.number);
    return `Some fun facts about ${el.name}. ${history?.funFact || 'It is an amazing element with many unique properties.'}`;
  }
  if (chapterIdx === 4) {
    return `Major Reactions involving ${el.name}. While specific equations are not listed here, ${el.name} participates in many fascinating chemical reactions in both nature and industry.`;
  }
  return '';
}

/* ------------------------------------------------------------------ */
/*  Narration PiP – segmented overlay with zoom + subtitle             */
/* ------------------------------------------------------------------ */
interface NarrationSegment {
  subtitle: string;
  visual: string; // 'element-card'|'properties'|'category'|'shell-N'|'valence'|'bohr-overview'|'uses'|'funfact'|'discovery'|'story'
  durationMs: number;
}

function estimateDuration(text: string): number {
  return Math.max(2500, text.split(/\s+/).length * 420);
}

function buildOverviewSegments(el: Element): NarrationSegment[] {
  const history = getElementHistory(el.number);
  const stateWord = el.state === 'solid' ? 'a solid' : el.state === 'liquid' ? 'a liquid' : el.state === 'gas' ? 'a gas' : 'unknown state';
  const segs: NarrationSegment[] = [];

  const s1 = `This is ${el.name}, element number ${el.number}, with the symbol ${el.symbol}.`;
  segs.push({ subtitle: s1, visual: 'element-card', durationMs: estimateDuration(s1) });

  const s2 = `It has an atomic mass of ${el.mass} u, and at room temperature it is ${stateWord}.`;
  segs.push({ subtitle: s2, visual: 'properties', durationMs: estimateDuration(s2) });

  const s3 = `It belongs to the ${CATEGORY_META[el.category]?.label || el.category} group.`;
  segs.push({ subtitle: s3, visual: 'category', durationMs: estimateDuration(s3) });

  if (history) {
    segs.push({ subtitle: history.detailedUse, visual: 'uses', durationMs: estimateDuration(history.detailedUse) });
    segs.push({ subtitle: history.funFact, visual: 'funfact', durationMs: estimateDuration(history.funFact) });
  }
  return segs;
}

function buildStructureSegments(el: Element): NarrationSegment[] {
  const total = el.shells.reduce((a, b) => a + b, 0);
  const history = getElementHistory(el.number);
  const segs: NarrationSegment[] = [];

  const intro = `Let's explore the atomic structure of ${el.name}. It has ${total} electrons in ${el.shells.length} shells.`;
  segs.push({ subtitle: intro, visual: 'bohr-overview', durationMs: estimateDuration(intro) });

  el.shells.forEach((c, i) => {
    const t = `The ${SHELL_NAMES_SPOKEN[i]} shell holds ${c} electron${c !== 1 ? 's' : ''}.`;
    segs.push({ subtitle: t, visual: `shell-${i}`, durationMs: estimateDuration(t) });
  });

  const v = el.shells[el.shells.length - 1];
  let vt = `The outermost shell has ${v} valence electron${v !== 1 ? 's' : ''}, `;
  if (v <= 3) vt += `meaning ${el.name} tends to lose electrons and form positive ions.`;
  else if (v >= 5 && v <= 7) vt += `meaning ${el.name} tends to gain electrons.`;
  else if (v === 8) vt += `a full shell, making it very stable and unreactive.`;
  else vt += `giving it interesting bonding properties.`;
  segs.push({ subtitle: vt, visual: 'valence', durationMs: estimateDuration(vt) });

  if (history) {
    const d = `Discovered by ${history.discoverer}. ${history.experiment}`;
    segs.push({ subtitle: d, visual: 'discovery', durationMs: estimateDuration(d) });
  }
  return segs;
}

function buildStorySegments(el: Element): NarrationSegment[] {
  const script = buildUseCaseStoryScript(el);
  // Split into ~2 sentences each
  const sentences = script.match(/[^.!?]+[.!?]+/g) || [script];
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' ').trim());
  }
  return chunks.map((c, i) => ({
    subtitle: c,
    visual: i === 0 ? 'story' : 'uses',
  }));
}

function buildChapterSegments(el: Element, chapterIdx: number): NarrationSegment[] {
  const script = buildChapterScript(el, chapterIdx);
  
  // Decide which visual to show based on the chapter
  let visualType = 'element-card';
  if (chapterIdx === 0) visualType = 'discovery';
  if (chapterIdx === 1) visualType = 'bohr-overview';
  if (chapterIdx === 2) visualType = 'uses';
  if (chapterIdx === 3) visualType = 'funfact';
  if (chapterIdx === 4) visualType = 'reaction';

  return [{
    subtitle: script,
    visual: visualType,
    durationMs: estimateDuration(script),
  }];
}

/* Mini Bohr SVG for PiP – highlights a specific shell */
const MiniBohrSVG = ({ shells, color, highlightShell }: { shells: number[]; color: string; highlightShell?: number }) => {
  const size = 220;
  const cx = size / 2;
  const maxR = cx - 14;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Nucleus */}
      <circle cx={cx} cy={cx} r={10} fill={color} opacity={0.8}>
        <animate attributeName="r" values="9;11;9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cx} r={14} fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
      {/* Shells + electrons */}
      {shells.map((count, i) => {
        const r = 22 + i * ((maxR - 22) / Math.max(shells.length, 1));
        const isHL = highlightShell === i;
        return (
          <g key={i}>
            <circle cx={cx} cy={cx} r={r} fill="none"
              stroke={isHL ? color : 'rgba(255,255,255,0.1)'}
              strokeWidth={isHL ? 2.5 : 0.7}
              opacity={isHL ? 1 : 0.4}
              strokeDasharray={isHL ? 'none' : '3 3'}
            />
            {Array.from({ length: count }).map((_, j) => {
              const a = (j / count) * Math.PI * 2 - Math.PI / 2;
              return (
                <circle key={j} cx={cx + r * Math.cos(a)} cy={cx + r * Math.sin(a)}
                  r={isHL ? 5 : 3} fill={isHL ? color : 'rgba(255,255,255,0.5)'}
                  opacity={isHL ? 1 : 0.35}
                >
                  {isHL && <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />}
                </circle>
              );
            })}
            {isHL && (
              <text x={cx + r + 8} y={cx - 4} fill={color} fontSize="13" fontWeight="bold">{SHELL_NAMES_SPOKEN[i]}: {count}e⁻</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* The floating PiP overlay component */
const NarrationPiP = ({
  el,
  segments,
  isActive,
}: {
  el: Element;
  segments: NarrationSegment[];
  isActive: boolean;
}) => {
  const [idx, setIdx] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isActive || segments.length === 0) { setIdx(0); return; }
    let elapsed = 0;
    const ts: ReturnType<typeof setTimeout>[] = [];
    segments.forEach((_, i) => {
      if (i === 0) return;
      elapsed += segments[i - 1].durationMs;
      ts.push(setTimeout(() => setIdx(i), elapsed));
    });
    timersRef.current = ts;
    return () => { ts.forEach(clearTimeout); setIdx(0); };
  }, [isActive, segments]);

  if (!isActive || segments.length === 0) return null;
  const seg = segments[Math.min(idx, segments.length - 1)];
  const history = getElementHistory(el.number);
  const shellMatch = seg.visual.match(/^shell-(\d+)$/);
  const hl = shellMatch ? parseInt(shellMatch[1]) : seg.visual === 'valence' ? el.shells.length - 1 : undefined;

  return (
    <div
      className="fixed bottom-6 left-6 z-[350] rounded-2xl overflow-hidden"
      style={{
        width: 400,
        background: 'rgba(12,12,18,0.94)',
        border: `1px solid ${el.color}25`,
        backdropFilter: 'blur(24px)',
        boxShadow: `0 8px 40px rgba(0,0,0,0.7), 0 0 24px ${el.color}12`,
        animation: 'fadeSlideIn 0.5s ease-out',
      }}
    >
      {/* Top accent */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${el.color}, ${el.color}40, transparent)` }} />

      {/* Visual area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 240, background: `radial-gradient(circle at center, ${el.color}06, transparent)` }}
      >
        {/* Element card */}
        {seg.visual === 'element-card' && (
          <div className="flex flex-col items-center gap-1" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            <div className="w-24 h-24 rounded-xl flex flex-col items-center justify-center"
              style={{ background: `${el.color}15`, border: `2px solid ${el.color}40`, boxShadow: `0 0 30px ${el.color}20` }}
            >
              <span className="text-xs text-zinc-500 font-mono">{el.number}</span>
              <span className="text-4xl font-black" style={{ color: el.color }}>{el.symbol}</span>
            </div>
            <span className="text-base font-bold text-white">{el.name}</span>
          </div>
        )}

        {/* Properties */}
        {seg.visual === 'properties' && (
          <div className="flex gap-3" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            {[{ l: 'Mass', v: `${el.mass} u` }, { l: 'State', v: el.state }, { l: 'Shells', v: String(el.shells.length) }].map(p => (
              <div key={p.l} className="flex flex-col items-center px-4 py-3 rounded-lg" style={{ background: `${el.color}10` }}>
                <span className="text-[10px] text-zinc-500 uppercase">{p.l}</span>
                <span className="text-lg font-bold" style={{ color: el.color }}>{p.v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Category */}
        {seg.visual === 'category' && (
          <div className="flex flex-col items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            <div className="px-5 py-2.5 rounded-full text-base font-bold"
              style={{ background: `${el.color}20`, color: el.color, border: `1px solid ${el.color}40` }}
            >{CATEGORY_META[el.category]?.label || el.category}</div>
            <span className="text-xs text-zinc-500">Element Category</span>
          </div>
        )}

        {/* Bohr model visuals */}
        {(seg.visual === 'bohr-overview' || shellMatch || seg.visual === 'valence') && (
          <div style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            <MiniBohrSVG shells={el.shells} color={el.color} highlightShell={hl} />
          </div>
        )}

        {/* Uses image */}
        {seg.visual === 'uses' && history?.useImage && (
          <div className="w-full h-full p-2 bg-black/20 flex items-center justify-center">
            <img src={history.useImage} alt={`${el.name} use`}
              className="w-full h-full object-contain rounded-md"
              style={{ animation: 'fadeSlideIn 0.4s ease-out', filter: 'brightness(0.8)' }}
            />
          </div>
        )}

        {/* Fun fact icon */}
        {seg.visual === 'funfact' && (
          <div className="flex flex-col items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            <Sparkles className="w-14 h-14" style={{ color: el.color, animation: 'sparkleRotate 2s ease-in-out infinite' }} />
            <span className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Fun Fact</span>
          </div>
        )}

        {/* Discovery visual */}
        {seg.visual === 'discovery' && (
          <div className="flex flex-col items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: `${el.color}15`, border: `2px solid ${el.color}30` }}
            ><User className="w-10 h-10" style={{ color: el.color }} /></div>
            <span className="text-sm text-zinc-300 font-semibold">{history?.discoverer}</span>
          </div>
        )}

        {/* Story character visual */}
        {seg.visual === 'story' && (
          <div className="flex flex-col items-center gap-2" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
            <div className="w-18 h-18 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400/30" style={{ width: 72, height: 72 }}>
              <BookOpen className="w-9 h-9 text-indigo-300" />
            </div>
            <span className="text-sm text-indigo-300 font-semibold">Real-Life Scenario</span>
          </div>
        )}

        {/* Segment progress dots */}
        <div className="absolute top-2 right-2 flex gap-0.5">
          {segments.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 10 : 4, height: 4,
                background: i === idx ? el.color : 'rgba(255,255,255,0.18)',
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* LIVE badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
          <div className="w-2 h-2 rounded-full bg-red-400" style={{ animation: 'gentlePulse 1s ease-in-out infinite' }} />
          <span className="text-[9px] font-bold text-red-300 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Subtitle area */}
      <div className="px-4 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-start gap-3">
          <div className="flex gap-0.5 mt-2 shrink-0">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-1 rounded-full"
                style={{ background: el.color, animation: `narrationBar 0.6s ease-in-out ${i * 0.12}s infinite alternate`, height: 14 }}
              />
            ))}
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed font-medium line-clamp-3"
            key={idx} style={{ animation: 'fadeSlideIn 0.3s ease-out' }}
          >{seg.subtitle}</p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Element Card                                                       */
/* ------------------------------------------------------------------ */
const ElementCard = ({
  el,
  onClick,
}: {
  el: ChemElement;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const spring = useSpring({
    transform: hovered ? 'scale(1.25)' : 'scale(1)',
    boxShadow: hovered
      ? `0 0 20px ${el.color}44, 0 0 40px ${el.color}18`
      : '0 0 0px transparent',
    borderColor: hovered ? `${el.color}70` : 'rgba(255,255,255,0.05)',
    zIndex: hovered ? 30 : 1,
    config: config.wobbly,
  });

  return (
    <animated.button
      style={{
        ...spring,
        gridRow: el.row,
        gridColumn: el.col,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative flex flex-col items-center justify-center rounded-md cursor-pointer bg-white/[0.03] border aspect-square min-w-0 p-0.5"
    >
      <span className="absolute top-[1px] left-[3px] text-[6px] font-mono text-zinc-600 leading-none">
        {el.number}
      </span>
      <span
        className="text-[11px] sm:text-sm font-extrabold leading-none"
        style={{ color: el.color }}
      >
        {el.symbol}
      </span>
      <span className="text-[5px] sm:text-[6px] text-zinc-500 font-medium truncate w-full text-center leading-none mt-[1px]">
        {el.name}
      </span>
    </animated.button>
  );
};

/* ------------------------------------------------------------------ */
/*  Lanthanide / Actinide row label                                    */
/* ------------------------------------------------------------------ */
const RowLabel = ({
  row,
  col,
  label,
  color,
}: {
  row: number;
  col: number;
  label: string;
  color: string;
}) => (
  <div
    style={{ gridRow: row, gridColumn: `${col} / span 2` }}
    className="flex items-center justify-end pr-2 text-[7px] sm:text-[9px] font-bold tracking-wider uppercase"
  >
    <span style={{ color }}>{label}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  State badge                                                        */
/* ------------------------------------------------------------------ */
const STATE_EMOJI: Record<string, string> = {
  solid: '�ite',
  liquid: '💧',
  gas: '💨',
  unknown: '❓',
};

/* ------------------------------------------------------------------ */
/*  Fullscreen Bohr Model Modal                                        */
/* ------------------------------------------------------------------ */
const SHELL_NAMES_FULL = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

const SHELL_MAX_CAP    = [2, 8, 18, 32, 32, 18, 8];

const FullscreenBohrModal = ({
  el,
  onClose,
  narration,
}: {
  el: Element;
  onClose: () => void;
  narration: {
    speak: (text: string) => void;
    stop: () => void;
    isSpeaking: boolean;
    isMuted: boolean;
    toggleMute: () => void;
  };
}) => {
  const structureSegs = useRef(buildStructureSegments(el));

  const backdrop = useSpring({
    from: { opacity: 0 },
    to:   { opacity: 1 },
    config: { duration: 200 },
  });

  const panel = useSpring({
    from: { opacity: 0, transform: 'scale(0.85)' },
    to:   { opacity: 1, transform: 'scale(1)' },
    config: config.gentle,
  });

  const totalElectrons = el.shells.reduce((a, b) => a + b, 0);

  // Auto-narrate atomic structure when this modal opens
  useEffect(() => {
    if (!narration.isMuted) {
      narration.speak(buildAtomicStructureScript(el));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <animated.div
      style={backdrop}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <animated.div
        style={panel}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
      >
        {/* Top gradient accent */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${el.color}, ${el.color}60, transparent)` }}
        />

        <div className="bg-zinc-900/98 border border-white/10 rounded-b-2xl">
          {/* Close + Volume buttons */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {/* Speaking indicator */}
            {narration.isSpeaking && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'gentlePulse 1s ease-in-out infinite' }} />
                <span className="text-[9px] font-medium text-emerald-400">Speaking</span>
              </div>
            )}
            {/* Volume toggle */}
            <button
              onClick={narration.toggleMute}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all ${
                narration.isMuted
                  ? 'bg-zinc-700/60 text-zinc-400 hover:text-white'
                  : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
              }`}
            >
              {narration.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[9px] font-medium">{narration.isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors bg-zinc-800/80 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header */}
          <div className="pt-5 px-6 pb-2">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                style={{ background: `${el.color}15`, border: `1px solid ${el.color}30` }}
              >
                <span
                  className="text-xl font-black leading-none"
                  style={{ color: el.color }}
                >
                  {el.symbol}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  {el.name}
                  <span className="text-zinc-500 text-base font-medium ml-2">Atomic Structure</span>
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {totalElectrons} electron{totalElectrons !== 1 ? 's' : ''} · {el.shells.length} shell{el.shells.length !== 1 ? 's' : ''} · Atomic number {el.number}
                </p>
              </div>
            </div>
          </div>

          {/* Bohr Model – large and detailed */}
          <div className="flex justify-center py-4 px-6">
            <div
              className="rounded-2xl p-4"
              style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.04) 0%, transparent 70%)' }}
            >
              <BohrModel
                shells={el.shells}
                symbol={el.symbol}
                color={el.color}
                size={460}
                detailed={true}
                atomicNumber={el.number}
              />
            </div>
          </div>

          {/* Electron Configuration Legend */}
          <div className="px-6 pb-5">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-3">Electron Configuration</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {el.shells.map((count, i) => {
                const pct = (count / SHELL_MAX_CAP[i]) * 100;
                const shellHue = i * 30;
                const sColor = `hsl(${230 + shellHue}, 70%, 70%)`;
                return (
                  <div
                    key={i}
                    className="rounded-lg p-3 flex flex-col gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: sColor }}>{SHELL_NAMES_FULL[i]} Shell</span>
                      <span className="text-xs font-mono text-zinc-400">{count}/{SHELL_MAX_CAP[i]}</span>
                    </div>
                    {/* Capacity bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${sColor}, ${el.color})`,
                          boxShadow: `0 0 8px ${sColor}40`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500">{count} electron{count !== 1 ? 's' : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </animated.div>
    </animated.div>

    {/* PiP overlay for atomic structure narration */}
    <NarrationPiP el={el} segments={structureSegs.current} isActive={narration.isSpeaking} />
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Word-by-word highlighted text                                       */
/* ------------------------------------------------------------------ */
const WordHighlightText = ({
  text,
  charIndex,
  color,
}: {
  text: string;
  charIndex: number;
  color: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll to keep highlighted word visible
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [charIndex]);

  if (!text) return null;

  // 1. First split the entire text into tokens while preserving EXACT character indices
  // We use a regex that matches words or non-words (whitespace/punctuation) globally
  const matches = Array.from(text.matchAll(/(\s+)|([^\s]+)/g));
  
  // 2. Group tokens into sentences. We break a sentence after a token containing . ! or ? 
  // followed immediately by whitespace, or at the very end.
  const sentences: { tokens: { text: string; start: number; end: number; isWhitespace: boolean }[] }[] = [];
  let currentSentence: { text: string; start: number; end: number; isWhitespace: boolean }[] = [];
  
  for (const match of matches) {
    const tokenText = match[0];
    const start = match.index!;
    const end = start + tokenText.length;
    const isWhitespace = /^\s+$/.test(tokenText);
    
    currentSentence.push({ text: tokenText, start, end, isWhitespace });
    
    // If this token had end-of-sentence punctuation, and the NEXT token is whitespace (or it's the last token),
    // we close the sentence AFTER adding the next whitespace.
    // To simplify: we just close the sentence if the CURRENT token has punctuation and isn't whitespace.
    // The whitespace will just start the next sentence, which is fine visually.
    if (!isWhitespace && /[.!?]+$/.test(tokenText)) {
      sentences.push({ tokens: currentSentence });
      currentSentence = [];
    }
  }
  
  if (currentSentence.length > 0) {
    sentences.push({ tokens: currentSentence });
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '100%' }}>
      <ul className="text-lg leading-relaxed font-medium text-zinc-500 tracking-wide space-y-4 pl-2 pb-8">
        {sentences.map((sentence, sIdx) => {
          // A sentence is active if the current charIndex falls within its start and end bounds
          const firstToken = sentence.tokens[0];
          const lastToken = sentence.tokens[sentence.tokens.length - 1];
          const isSentenceActive = charIndex >= firstToken.start && charIndex < lastToken.end;
          const isSentencePast = charIndex >= lastToken.end;
          const bulletOpacity = isSentenceActive || isSentencePast ? 1 : 0.3;

          return (
            <li key={sIdx} className="flex items-start gap-3">
              <span 
                className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 transition-opacity duration-300" 
                style={{ background: color, opacity: bulletOpacity }} 
              />
              <div className="flex-1">
                {sentence.tokens.map((token, i) => {
                  if (token.isWhitespace) return <span key={i}>{token.text}</span>;
                  
                  // For word tokens, check if the current charIndex is inside this token
                  const isActive = charIndex >= token.start && charIndex < token.end;
                  const isPast = charIndex >= token.end;
                  
                  return (
                    <span
                      key={i}
                      ref={isActive ? activeRef : undefined}
                      className={isActive ? 'word-highlight' : ''}
                      style={{
                        color: isActive ? 'white' : isPast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                        transition: 'color 0.2s ease',
                        ...(isActive ? { textShadow: `0 0 20px ${color}50` } : {}),
                      }}
                    >
                      {token.text}
                    </span>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Book Modal — fullscreen interactive book                           */
/* ------------------------------------------------------------------ */
const ElementModal = ({
  el,
  onClose,
}: {
  el: Element;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0); // 0 = Index/Discovery, 1 = Content/Narration
  const [bohrFullscreen, setBohrFullscreen] = useState(false);
  const [chapterSelected, setChapterSelected] = useState<number | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);
  const [pageFlipped, setPageFlipped] = useState(false);
  const history = getElementHistory(el.number);
  const recentIncident = generateRecentIncident(el.symbol, el.name, el.category);
  const narration = useElementNarration();
  const [activeSegments, setActiveSegments] = useState<NarrationSegment[]>([]);

  const catMeta = CATEGORY_META[el.category] || { label: el.category, color: el.color };

  // Open the book cover after a brief delay
  useEffect(() => {
    const t = setTimeout(() => setIsOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Auto-narrate specific chapter after book opens AND we reach page 1
  useEffect(() => {
    if (!isOpen || bookPage !== 1 || activeChapterIndex === null || pageFlipped) return;
    const t = setTimeout(() => {
      if (!narration.isMuted) {
        narration.speak(buildChapterScript(el, activeChapterIndex));
        setActiveSegments(buildChapterSegments(el, activeChapterIndex));
      }
    }, 400); // Shorter delay when turning the page
    return () => { clearTimeout(t); narration.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookPage, activeChapterIndex, pageFlipped]);

  const handleBohrClose = useCallback(() => {
    setBohrFullscreen(false);
    if (!narration.isMuted) {
      narration.speak(buildUseCaseStoryScript(el));
      setActiveSegments(buildStorySegments(el));
    }
  }, [el, narration]);

  const handleBohrOpen = useCallback(() => {
    setBohrFullscreen(true);
  }, []);

  const handleClose = useCallback(() => {
    narration.stop();
    onClose();
  }, [narration, onClose]);

  const handleChapterSelect = useCallback((idx: number) => {
    if (chapterSelected !== null) return;
    setChapterSelected(idx);
    // Wait for the user to read the chapter front, then flip
    setTimeout(() => {
      setBookPage(1); // Instantly update the page underneath so it's ready when revealed
      setActiveChapterIndex(idx);
      setActiveSegments(buildChapterSegments(el, idx)); // Instantly set visuals
      setPageFlipped(true);
      // Wait for flip animation to finish (1.2s), then reset overlay state which allows narration to start
      setTimeout(() => {
        setChapterSelected(null);
        setPageFlipped(false);
      }, 1200);
    }, 1500); 
  }, [chapterSelected, el]);

  // Determine current segment for left-page visual
  const segIdx = useRef(0);
  const [currentVisual, setCurrentVisual] = useState<NarrationSegment | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    if (!narration.isSpeaking || activeSegments.length === 0) {
      setCurrentVisual(activeSegments[0] || null);
      return;
    }
    setCurrentVisual(activeSegments[0]);
    segIdx.current = 0;
    let elapsed = 0;
    const ts: ReturnType<typeof setTimeout>[] = [];
    activeSegments.forEach((seg, i) => {
      if (i === 0) return;
      elapsed += activeSegments[i - 1].durationMs;
      ts.push(setTimeout(() => { segIdx.current = i; setCurrentVisual(seg); }, elapsed));
    });
    timersRef.current = ts;
    return () => ts.forEach(clearTimeout);
  }, [narration.isSpeaking, activeSegments]);

  // Current visual info
  const vis = currentVisual;
  const shellMatch = vis?.visual.match(/^shell-(\d+)$/);
  const hl = shellMatch ? parseInt(shellMatch[1]) : vis?.visual === 'valence' ? el.shells.length - 1 : undefined;

  return (
    <>
      {/* Fullscreen backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center">
        {/* Book wrapper with perspective */}
        <div 
          className="book-wrapper relative transition-all duration-[1200ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] flex items-center justify-center p-4 sm:p-8 w-full max-w-[1200px] h-[85vh]"
          style={{
            transform: isOpen ? 'translateX(0) scale(1)' : 'translateX(-25%) scale(0.6)',
          }}
        >
          {/* Main book container that preserves the 8/5 aspect ratio of a wide open book */}
          <div className="relative w-full h-full max-h-[800px] aspect-[8/5]">
            {/* ═══ ANCIENT ROCK BOOK COVER ═══ */}
            <div
              className="book-cover ancient-rock-cover absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center cursor-pointer z-[110] rounded-r-2xl"
              style={{ 
                backgroundColor: el.color,
                backgroundImage: `linear-gradient(145deg, rgba(10,10,15,0.9), rgba(15,15,20,0.95)), radial-gradient(circle at 60% 40%, ${el.color}40, transparent 60%)`,
                '--glow-color': `${el.color}80`,
                transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                transformOrigin: 'left center'
              } as React.CSSProperties}
              onClick={() => setIsOpen(true)}
            >
            {/* Element Name on Top */}
            <h1 
              className="engraved-text text-4xl sm:text-5xl font-extrabold tracking-[0.15em] mb-8 uppercase text-center px-4" 
              style={{ color: el.color, textShadow: `-2px -2px 4px rgba(0,0,0,0.9), 2px 2px 4px rgba(255,255,255,0.1), 0 0 50px ${el.color}90` }}
            >
              {el.name}
            </h1>

            {/* Engraved element symbol box */}
            <div
              className="engraved-box w-36 h-36 rounded-2xl flex flex-col items-center justify-center mb-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ background: `radial-gradient(circle at 50% 50%, ${el.color}, transparent 70%)` }} />
              <div className="absolute inset-0 opacity-20" style={{ boxShadow: `inset 0 0 30px ${el.color}` }} />
              <span className="engraved-text text-sm font-mono relative z-10" style={{ color: 'rgba(255,255,255,0.4)' }}>{el.number}</span>
              <span className="engraved-text text-7xl font-black relative z-10" style={{ color: el.color, textShadow: `-2px -2px 4px rgba(0,0,0,0.9), 2px 2px 4px rgba(255,255,255,0.1), 0 0 35px ${el.color}` }}>{el.symbol}</span>
              <span className="engraved-text text-[10px] font-medium relative z-10" style={{ color: 'rgba(255,255,255,0.3)' }}>{el.mass} u</span>
            </div>
            
            <span 
              className="engraved-box text-xs font-bold px-6 py-2 rounded-sm uppercase tracking-[0.2em]" 
              style={{ color: catMeta.color, opacity: 0.9, borderBottom: `2px solid ${catMeta.color}50` }}
            >
              {catMeta.label}
            </span>
            
            <p className="engraved-text text-zinc-600 text-[10px] mt-12 tracking-[0.3em] uppercase opacity-60 animate-pulse">
              Translating Ancient Runes...
            </p>
          </div>


          {/* ═══ BOOK PAGES ═══ */}
          <div
            className="book-pages book-spread absolute inset-0 w-full h-full"
          >
            {/* ─── LEFT PAGE ─── */}
            <div 
              className="book-page-left absolute top-0 left-0 w-1/2 h-full flex flex-col overflow-hidden rounded-l-2xl z-40 transition-transform duration-[1200ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]"
              style={{
                background: 'rgba(15,15,20,0.98)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '-20px 20px 60px rgba(0,0,0,0.8)',
                transformOrigin: 'right center',
                transform: isOpen ? 'rotateY(0deg)' : 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Common Left Page Header / Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 z-20 text-zinc-500 hover:text-white transition-colors bg-zinc-800/60 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              {bookPage === 1 && (
                <button
                  onClick={narration.toggleMute}
                  className={`absolute top-4 right-4 z-20 rounded-full p-2 transition-all ${
                    narration.isMuted
                      ? 'bg-zinc-700/60 text-zinc-400'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {narration.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              )}

              {/* Element header - shared across both pages */}
              <div className="pt-14 px-8 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl flex flex-col items-center justify-center"
                    style={{ background: `${el.color}12`, border: `1px solid ${el.color}30` }}
                  >
                    <span className="text-2xl font-black" style={{ color: el.color }}>{el.symbol}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{el.name}</h2>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: catMeta.color, background: `${catMeta.color}15` }}>{catMeta.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">{el.state} · {el.year}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col px-8 pb-4 relative overflow-hidden">
                {bookPage === 0 ? (
                  /* PAGE 0 LEFT: History & Discovery */
                  <div className="flex-1 flex flex-col gap-6" style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <History className="w-4 h-4" style={{ color: el.color }} />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Discovery & Origins</h3>
                      </div>
                      <ul className="text-zinc-300 text-sm leading-relaxed space-y-3 pl-2">
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: el.color }} />
                          <span>
                            <strong className="text-white">{el.name}</strong> was first identified or isolated in <strong style={{ color: el.color }}>{history?.year || el.year}</strong>.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: el.color }} />
                          <span>
                            The primary credit for this discovery historically goes to <strong className="text-white">{history?.discoverer || 'Unknown scientists'}</strong>.
                          </span>
                        </li>
                        {history?.discovererBio && (
                          <li className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: el.color }} />
                            <span className="text-zinc-400 italic">{history.discovererBio}</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative flex-1 flex flex-col">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Bookmark className="w-24 h-24" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <FlaskConical className="w-4 h-4" style={{ color: el.color }} />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Developments</h3>
                      </div>
                      <ul className="text-zinc-400 text-sm leading-relaxed space-y-3 pl-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {recentIncident.split(/(?<=[.!?])\s+(?=[A-Z"])/).map((sentence, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: el.color }} />
                            <span>{sentence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  /* PAGE 1 LEFT: Visual Content Area & Bohr Model */
                  <div className="flex-1 flex flex-col items-center justify-center pb-12 min-h-0 w-full relative">
                    {(!vis || vis.visual === 'element-card' || shellMatch || vis.visual === 'valence') && (
                      <div
                        className="flex flex-col items-center gap-3 cursor-pointer group"
                        onClick={handleBohrOpen}
                        style={{ animation: 'fadeSlideIn 0.5s ease-out' }}
                      >
                        {shellMatch || vis?.visual === 'valence' ? (
                          <MiniBohrSVG shells={el.shells} color={el.color} highlightShell={hl} />
                        ) : (
                          <BohrModel
                            shells={el.shells}
                            symbol={el.symbol}
                            color={el.color}
                            size={280}
                            onClick={handleBohrOpen}
                          />
                        )}
                        <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" /> Click to expand
                        </span>
                      </div>
                    )}

                    {vis?.visual === 'properties' && (
                      <div className="flex gap-4" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        {[{ icon: Zap, l: 'Atomic No.', v: String(el.number) }, { icon: Atom, l: 'Mass', v: `${el.mass} u` }, { icon: Layers, l: 'Shells', v: String(el.shells.length) }].map(p => (
                          <div key={p.l} className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl" style={{ background: `${el.color}08`, border: `1px solid ${el.color}15` }}>
                            <p.icon className="w-5 h-5" style={{ color: el.color }} />
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{p.l}</span>
                            <span className="text-2xl font-bold" style={{ color: el.color }}>{p.v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {vis?.visual === 'category' && (
                      <div className="flex flex-col items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <div className="px-6 py-3 rounded-full text-lg font-bold" style={{ background: `${el.color}20`, color: el.color, border: `1px solid ${el.color}40` }}>
                          {catMeta.label}
                        </div>
                      </div>
                    )}

                    {vis?.visual === 'uses' && history?.useImage && (
                      <div className="w-full h-full min-h-0 rounded-2xl overflow-hidden flex items-center justify-center p-3 sm:p-5 bg-black/20 relative" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <img src={history.useImage} alt={`${el.name} use`} className="w-full h-full object-contain rounded-lg drop-shadow-2xl" style={{ filter: 'brightness(0.85)' }} />
                        <div className="absolute top-4 left-4 z-10">
                          <span className="text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg" style={{ background: `${el.color}30`, color: el.color, backdropFilter: 'blur(8px)', border: `1px solid ${el.color}40` }}>
                            {el.symbol} in action
                          </span>
                        </div>
                      </div>
                    )}

                    {vis?.visual === 'funfact' && (
                      <div className="flex flex-col items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <Sparkles className="w-16 h-16" style={{ color: el.color, animation: 'sparkleRotate 2s ease-in-out infinite' }} />
                        <span className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">Fun Fact</span>
                      </div>
                    )}

                    {vis?.visual === 'bohr-overview' && (
                      <div className="flex flex-col items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20" style={{ animation: 'gentlePulse 2s infinite' }} />
                          <div className="absolute inset-1 rounded-full border border-indigo-500/30" style={{ animation: 'spin 6s linear infinite' }} />
                          <Atom className="w-12 h-12 text-indigo-300 relative z-10" style={{ filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.5))', animation: 'sparkleRotate 4s ease-in-out infinite' }} />
                        </div>
                        <span className="text-sm text-indigo-300 font-bold uppercase tracking-widest mt-2">Quantum Realm</span>
                        <span className="text-xs text-indigo-400/50 italic flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Visualizing the invisible
                        </span>
                      </div>
                    )}

                    {vis?.visual === 'discovery' && (
                      <div className="flex flex-col items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-t-2 border-r-2" style={{ borderColor: el.color, animation: 'spin 4s linear infinite' }} />
                          <div className="absolute inset-2 rounded-full border-b-2 border-l-2" style={{ borderColor: `${el.color}80`, animation: 'spin 3s linear infinite reverse' }} />
                          <Compass className="w-10 h-10" style={{ color: el.color, filter: `drop-shadow(0 0 10px ${el.color})` }} />
                        </div>
                        <span className="text-sm text-zinc-300 font-bold uppercase tracking-widest mt-2">{history?.discoverer || 'Mysterious Origin'}</span>
                        <span className="text-xs text-zinc-500 italic flex items-center gap-1">
                          <Sparkles className="w-3 h-3" style={{ color: el.color }} /> Journey of the mind
                        </span>
                      </div>
                    )}

                    {vis?.visual === 'story' && (
                      <div className="flex flex-col items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400/30">
                          <BookOpen className="w-10 h-10 text-indigo-300" />
                        </div>
                        <span className="text-sm text-indigo-300 font-semibold">Real-Life Scenario</span>
                      </div>
                    )}

                    {vis?.visual === 'reaction' && (
                      <div className="flex flex-col items-center gap-3" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/30">
                          <FlaskConical className="w-10 h-10 text-emerald-300" />
                        </div>
                        <span className="text-sm text-emerald-300 font-semibold">Major Reaction</span>
                      </div>
                    )}

                    {/* Content Segments Pagination indicator */}
                    {activeSegments.length > 0 && (
                      <div className="absolute bottom-2 left-6 right-6 flex gap-1 z-20">
                        {activeSegments.map((_, i) => (
                          <div
                            key={i}
                            className="h-1.5 rounded-full flex-1 transition-all duration-500"
                            style={{
                              background: i <= segIdx.current ? el.color : 'rgba(255,255,255,0.08)',
                              opacity: i === segIdx.current ? 1 : i < segIdx.current ? 0.5 : 0.2,
                              boxShadow: i <= segIdx.current ? `0 0 8px ${el.color}80` : 'none'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {bookPage === 1 && (
                <div className="px-8 py-4 border-t border-white/5 flex items-center justify-start">
                  <button
                    onClick={() => {
                      if (activeChapterIndex !== null && activeChapterIndex > 0) {
                        handleChapterSelect(activeChapterIndex - 1);
                      } else {
                        setBookPage(0);
                        setActiveChapterIndex(null);
                        narration.stop();
                      }
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Page
                  </button>
                </div>
              )}
            </div>
            
            {/* ─── SPINE SHADOW ─── */}
            <div className="book-spine absolute top-0 bottom-0 left-1/2 -mb-0.5 transform -translate-x-1/2 w-6 bg-gradient-to-r from-transparent via-black/80 to-transparent z-50 pointer-events-none" />

            {/* ─── RIGHT PAGE ─── */}
            <div 
              className="book-page-right absolute top-0 right-0 w-1/2 h-full flex flex-col overflow-hidden rounded-r-2xl z-30"
              style={{
                background: 'rgba(15,15,20,0.98)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '20px 20px 60px rgba(0,0,0,0.8)'
              }}
            >
              
              {bookPage === 0 ? (
                /* PAGE 0 RIGHT: Table of Contents */
                <div className="flex-1 flex flex-col p-8 overflow-hidden" style={{ animation: 'fadeSlideIn 0.6s ease-out' }}>
                  <h2 className="text-3xl font-extrabold text-white mb-2 uppercase tracking-wide shrink-0">Index</h2>
                  <div className="w-12 h-1 mb-6 rounded-full shrink-0" style={{ background: el.color }} />
                  
                  <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-4">
                    {[
                      { num: "01", title: "Origins & Discovery", desc: "How it was found", img: "https://images.unsplash.com/photo-1532153975070-2e9ab71f2b62?auto=format&fit=crop&q=80&w=800" },
                      { num: "02", title: "Atomic Architecture", desc: "Properties & Bohr Model", img: "https://images.unsplash.com/photo-1614728263692-8c5ee5a73616?auto=format&fit=crop&q=80&w=800" },
                      { num: "03", title: "Modern Applications", desc: "Real-world uses today", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" },
                      { num: "04", title: "Curiosities", desc: "Fun facts & trivia", img: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800" },
                      { num: "05", title: "Major Reactions", desc: "Chemical equations", img: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800" }
                    ].map((ch, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleChapterSelect(idx)}
                        className="flex items-start gap-4 group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors -ml-3 shrink-0"
                      >
                        <span className="text-2xl font-mono font-bold opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: el.color }}>{ch.num}</span>
                        <div>
                          <h4 className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">{ch.title}</h4>
                          <span className="text-xs text-zinc-500">{ch.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 flex justify-end shrink-0 border-t border-white/5">
                    <button
                      onClick={() => handleChapterSelect(0)}
                      className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:brightness-110 flex items-center gap-2 shadow-lg"
                      style={{ background: el.color, boxShadow: `0 10px 30px ${el.color}40` }}
                    >
                      Begin Chapter <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* PAGE 1 RIGHT: Narration Text */
                <div className="flex-1 flex flex-col w-full h-full" style={{ animation: 'fadeSlideIn 0.6s ease-out' }}>
                  {/* Header */}
                  <div className="pt-6 px-8 pb-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                      {narration.isSpeaking && (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[0, 1, 2, 3, 4].map(i => (
                              <div key={i} className="w-1 rounded-full bg-indigo-400"
                                style={{ animation: `narrationBar 0.6s ease-in-out ${i * 0.1}s infinite alternate`, height: 16 }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-indigo-300 font-medium">Narrating</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      {el.name} · Element {el.number}
                    </span>
                  </div>

                  {/* Word-highlighted text area */}
                  <div className="flex-1 px-8 py-6 overflow-hidden">
                    <WordHighlightText
                      text={narration.currentText}
                      charIndex={narration.currentCharIndex}
                      color={el.color}
                    />
                  </div>

                  {/* Bottom controls */}
                  <div className="px-8 py-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBohrOpen}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                      >
                        <Atom className="w-3.5 h-3.5" /> Atomic Structure
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      {activeChapterIndex !== null && activeChapterIndex < 4 && (
                        <button
                          onClick={() => handleChapterSelect(activeChapterIndex + 1)}
                          className="text-xs px-4 py-1.5 rounded-lg font-semibold text-white transition-all hover:brightness-110 flex items-center gap-1.5"
                          style={{ background: `${el.color}40`, border: `1px solid ${el.color}80` }}
                        >
                          Next Page <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={handleClose}
                        className="text-xs px-4 py-1.5 rounded-lg font-semibold text-white transition-all hover:brightness-110"
                        style={{ background: el.color }}
                      >
                        Close Book
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── 3D PAGE TURN CONTAINER ─── */}
            {chapterSelected !== null && (
              <div className={`page-flip-container ${pageFlipped ? 'is-flipped' : ''}`}>
                
                {/* Front side (faces right, shows chapter intro) */}
                <div className="page-3d-face page-front flex flex-col items-center justify-center p-8">
                  <img 
                    src={[
                       "https://images.unsplash.com/photo-1532153975070-2e9ab71f2b62?auto=format&fit=crop&q=80&w=800",
                       "https://images.unsplash.com/photo-1614728263692-8c5ee5a73616?auto=format&fit=crop&q=80&w=800",
                       "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
                       "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800",
                       "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800"
                    ][chapterSelected]}
                    alt="Chapter Background"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-screen"
                    style={{ filter: `sepia(1) hue-rotate(${el.color === '#22d3ee' ? -150 : 0}deg) saturate(3)` }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                    <span className="text-7xl font-black font-mono" style={{ color: el.color, textShadow: `0 0 40px ${el.color}80` }}>
                      0{chapterSelected + 1}
                    </span>
                    <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase">
                      {[ "Origins & Discovery", "Atomic Architecture", "Modern Applications", "Curiosities", "Major Reactions" ][chapterSelected]}
                    </h2>
                    <div className="w-16 h-1 mt-4 rounded-full" style={{ background: el.color }} />
                  </div>
                </div>

                {/* Back side (faces left as it flips, blank texture to match the left page) */}
                <div className="page-3d-face page-back flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full opacity-10 animate-pulse bg-white" />
                </div>
                
              </div>
            )}
            
          </div>
        </div>
      </div>
      </div>

      {/* Fullscreen Bohr Model */}
      {bohrFullscreen && (
        <FullscreenBohrModal el={el} onClose={handleBohrClose} narration={narration} />
      )}
    </>
  );
};




/* ------------------------------------------------------------------ */
/*  Legend                                                              */
/* ------------------------------------------------------------------ */
const LEGEND_ITEMS = Object.entries(CATEGORY_META).map(([, v]) => v);

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export const PeriodicTable = () => {
  const [selected, setSelected] = useState<ChemElement | null>(null);
  const markStepVisited = useGameStore((s: any) => s.markStepVisited);

  useEffect(() => {
    markStepVisited(3);
  }, [markStepVisited]);

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-3 sm:px-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            <span className="gradient-text">Periodic Table of Elements</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1">All 118 elements · Click any to explore</p>
        </div>

        {/* Compact legend */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {LEGEND_ITEMS.map((l) => (
            <span key={l.label} className="flex items-center gap-1 text-[8px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main periodic table grid ── */}
      <div
        className="grid gap-[3px] sm:gap-1 w-full mb-2"
        style={{
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
        }}
      >
        {/* Lanthanide / Actinide placeholder markers */}
        <div
          style={{ gridRow: 6, gridColumn: 3 }}
          className="flex items-center justify-center rounded-md bg-pink-500/10 border border-pink-500/20 text-[7px] sm:text-[8px] font-bold text-pink-300"
        >
          57-71
        </div>
        <div
          style={{ gridRow: 7, gridColumn: 3 }}
          className="flex items-center justify-center rounded-md bg-red-500/10 border border-red-500/20 text-[7px] sm:text-[8px] font-bold text-red-300"
        >
          89-103
        </div>

        {/* Main-table elements (rows 1–7) */}
        {(ELEMENTS as ChemElement[])
          .filter((el) => el.row <= 7)
          .map((el) => (
            <ElementCard key={el.number} el={el} onClick={() => setSelected(el)} />
          ))}
      </div>

      {/* ── Spacer ── */}
      <div className="h-3" />

      {/* ── Lanthanides & Actinides ── */}
      <div
        className="grid gap-[3px] sm:gap-1 w-full"
        style={{
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        {/* Row labels */}
        <RowLabel row={1} col={1} label="Lanthanides" color="#f9a8d4" />
        <RowLabel row={2} col={1} label="Actinides" color="#fca5a5" />

        {/* Lanthanide elements — remap row 9→1, col stays 4-18 */}
        {(ELEMENTS as ChemElement[])
          .filter((el) => el.row === 9)
          .map((el) => (
            <ElementCard
              key={el.number}
              el={{ ...el, row: 1 }}
              onClick={() => setSelected(el)}
            />
          ))}

        {/* Actinide elements — remap row 10→2, col stays 4-18 */}
        {(ELEMENTS as ChemElement[])
          .filter((el) => el.row === 10)
          .map((el) => (
            <ElementCard
              key={el.number}
              el={{ ...el, row: 2 }}
              onClick={() => setSelected(el)}
            />
          ))}
      </div>

      {/* Footer */}
      <p className="text-center text-zinc-600 text-[10px] mt-4 font-mono">
        118 elements · Hover to highlight · Click to explore
      </p>

      {/* Modal */}
      {selected && <ElementModal el={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
