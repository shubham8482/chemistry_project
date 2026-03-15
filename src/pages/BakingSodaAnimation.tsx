import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './BakingSodaAnimation.css';

const SCENE_COUNT = 4;
const AUTO_ADVANCE_MS = 12000;

/* ---------- Scene meta ---------- */
const sceneMeta = [
  { badge: 'Scene 1 · Macro', title: 'The Kitchen Counter', desc: 'A hand pours acidic liquid into a bowl of thick cake batter…' },
  { badge: 'Scene 2 · Transition', title: 'Zooming In', desc: 'A magnifying glass reveals the microscopic world inside the batter.' },
  { badge: 'Scene 3 · Micro', title: 'Molecular Collision', desc: 'Acid meets baking soda — crystals shatter and CO₂ bubbles are born.' },
  { badge: 'Scene 4 · Macro', title: 'The Cake Rises', desc: 'Trapped bubbles push the batter upward — hello, fluffy cake!' },
];

/* ---------- Voiceover narration scripts ---------- */
const narrationScripts = [
  `Imagine you're in a kitchen, about to bake a cake. You've mixed your dry ingredients — flour, sugar, and a secret weapon: baking soda, also known as sodium bicarbonate. Now, you pour in something acidic, like buttermilk or lemon juice. The moment that acid hits the batter, something incredible begins.`,
  `Let's zoom in. Way, way in — past the batter, past the grains of flour, down to the molecular level. Inside this thick mixture, tiny white crystalline structures of sodium bicarbonate sit peacefully, waiting. But not for long.`,
  `Here come the acid molecules — fast, energetic hydrogen ions — crashing into the baking soda crystals! On contact, the crystals shatter apart. The reaction produces sodium ions, water, and most importantly — carbon dioxide gas! Thousands of tiny CO2 bubbles burst into existence. The chemical equation: sodium bicarbonate plus acid yields sodium ions, water, and carbon dioxide gas.`,
  `Now zoom back out. All those tiny CO2 bubbles are trapped inside the thick, sticky batter. As heat from the oven expands them further, they push the batter upward, creating an airy, spongy structure. The proteins in the flour set around these air pockets, locking them in place. And that — is what makes your cake fluffy instead of a flat, dense brick!`,
];

/* ---------- Narration hook (Web Speech API) ---------- */
function useNarration() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const speak = useCallback((text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsPaused(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to pick a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural'))
    ) || voices.find((v) => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  return { speak, pause, resume, stop, isSpeaking, isPaused };
}

/* =================================================================
   Scene 1 – Macro Kitchen
   ================================================================= */
const Scene1 = () => (
  <div style={{ position: 'absolute', inset: 0 }}>
    {/* Wall + tiles */}
    <div className="kitchen-wall" />
    <div className="kitchen-tiles" />

    {/* Shelf */}
    <div className="kitchen-shelf">
      <div className="shelf-jar" />
      <div className="shelf-jar" />
      <div className="shelf-jar" />
    </div>

    {/* Counter */}
    <div className="kitchen-counter" />

    {/* Bowl */}
    <div className="bowl">
      <div className="bowl-body">
        <div className="batter">
          <div className="batter-surface" />
        </div>
      </div>
    </div>

    {/* Pouring hand */}
    <div className="pouring-hand">
      <div className="hand-shape">
        <div className="bottle">
          <div className="bottle-cap" />
          <div className="bottle-label">ACID</div>
        </div>
        <div className="pour-stream">
          <div className="pour-splash">
            <div className="splash-drop" />
            <div className="splash-drop" />
            <div className="splash-drop" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* =================================================================
   Scene 2 – Magnifying Glass Transition
   ================================================================= */
const Scene2 = () => (
  <div className="scene2-bowl-bg">
    {/* Bowl (background) */}
    <div className="scene2-bowl">
      <div className="scene2-batter" />
    </div>

    {/* Magnifying glass */}
    <div className="magnifying-glass">
      <div className="mag-lens">
        <div className="mag-inner">
          <div className="mag-crystal-preview" />
          <div className="mag-crystal-preview" />
          <div className="mag-crystal-preview" />
        </div>
        <div className="mag-glare" />
      </div>
      <div className="mag-handle" />
    </div>
  </div>
);

/* =================================================================
   Scene 3 – Micro Collision
   ================================================================= */

/* Crystal positions */
const crystals = [
  { id: 1, left: '30%', top: '25%', size: 48, delay: 0 },
  { id: 2, left: '45%', top: '35%', size: 56, delay: 0.3 },
  { id: 3, left: '38%', top: '50%', size: 42, delay: 0.6 },
  { id: 4, left: '52%', top: '22%', size: 36, delay: 0.15 },
  { id: 5, left: '25%', top: '42%', size: 32, delay: 0.45 },
];

/* Acid molecule start positions (off-screen right) */
const acids = [
  { id: 1, top: '20%', delay: 0.8 },
  { id: 2, top: '32%', delay: 1.0 },
  { id: 3, top: '45%', delay: 1.2 },
  { id: 4, top: '28%', delay: 1.4 },
  { id: 5, top: '55%', delay: 0.9 },
  { id: 6, top: '38%', delay: 1.6 },
  { id: 7, top: '15%', delay: 1.1 },
  { id: 8, top: '50%', delay: 1.3 },
];

/* CO₂ bubble positions */
const bubbles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${15 + Math.random() * 65}%`,
  top: `${15 + Math.random() * 55}%`,
  size: 12 + Math.random() * 28,
  delay: 2.2 + Math.random() * 1.5,
}));

const Scene3 = ({ active }: { active: boolean }) => {
  const [phase, setPhase] = useState<'peaceful' | 'colliding' | 'bubbling'>('peaceful');

  useEffect(() => {
    if (!active) {
      setPhase('peaceful');
      return;
    }
    const t1 = setTimeout(() => setPhase('colliding'), 1800);
    const t2 = setTimeout(() => setPhase('bubbling'), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);

  return (
    <div className="micro-world">
      <div className="micro-grid" />

      {/* Crystals */}
      {crystals.map((c) => (
        <div
          key={c.id}
          className={`crystal ${phase === 'bubbling' ? 'shatter' : 'peaceful'}`}
          style={{
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            animationDelay: `${c.delay}s`,
          }}
        >
          <span className="crystal-label">NaHCO₃</span>
        </div>
      ))}

      {/* Acid molecules */}
      {(phase === 'colliding' || phase === 'bubbling') &&
        acids.map((a) => (
          <div
            key={a.id}
            className="acid-molecule"
            style={{ top: a.top, right: 0, animationDelay: `${a.delay - 0.8}s` }}
          >
            <div className="acid-shape" />
            <span className="acid-label">H⁺</span>
          </div>
        ))}

      {/* Collision flashes */}
      {phase === 'bubbling' &&
        crystals.slice(0, 3).map((c) => (
          <div
            key={`flash-${c.id}`}
            className="collision-flash"
            style={{
              left: `calc(${c.left} - 20px)`,
              top: `calc(${c.top} - 20px)`,
              animationDelay: `${c.delay * 0.5}s`,
            }}
          />
        ))}

      {/* CO₂ bubbles */}
      {phase === 'bubbling' &&
        bubbles.map((b) => (
          <div
            key={b.id}
            className="co2-bubble"
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay - 2.2}s`,
            }}
          >
            <span className="co2-label">CO₂</span>
          </div>
        ))}

      {/* Equation */}
      <div className="equation-overlay" style={{ animationDelay: phase === 'bubbling' ? '0.5s' : '99s' }}>
        <span className="reactant">NaHCO₃</span>
        <span className="arrow"> + </span>
        <span className="reactant">H⁺</span>
        <span className="arrow"> → </span>
        <span className="product">Na⁺</span>
        <span className="arrow"> + </span>
        <span className="product">H₂O</span>
        <span className="arrow"> + </span>
        <span className="product">CO₂↑</span>
      </div>
    </div>
  );
};

/* =================================================================
   Scene 4 – Cake Rising
   ================================================================= */
const cakeBubblePockets = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${8 + Math.random() * 84}%`,
  bottom: `${5 + Math.random() * 80}%`,
  size: 6 + Math.random() * 18,
  delay: 0.5 + Math.random() * 2.5,
}));

const heatLines = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${i * 25 + Math.random() * 15}px`,
  height: `${20 + Math.random() * 30}px`,
  delay: Math.random() * 2,
}));

const Scene4 = ({ active }: { active: boolean }) => (
  <div className="oven-window">
    <div className="oven-glow" />
    <div className="oven-frame" />

    {/* Heat waves */}
    <div className="heat-wave">
      {heatLines.map((h) => (
        <div
          key={h.id}
          className="heat-line"
          style={{ left: h.left, height: h.height, animationDelay: `${h.delay}s` }}
        />
      ))}
    </div>

    {/* Oven rack */}
    <div className="oven-rack" />

    {/* Cake pan */}
    <div className="cake-pan">
      <div className="cake-batter-rising" style={{ animationPlayState: active ? 'running' : 'paused' }}>
        <div className="cake-cross-section">
          {cakeBubblePockets.map((p) => (
            <div
              key={p.id}
              className="cake-bubble-pocket"
              style={{
                left: p.left,
                bottom: p.bottom,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationPlayState: active ? 'running' : 'paused',
              }}
            />
          ))}
        </div>

        {/* Steam */}
        {[15, 45, 75, 110, 145, 180].map((x, i) => (
          <div
            key={i}
            className="cake-steam"
            style={{ left: `${x}px`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

/* =================================================================
   Main Component
   ================================================================= */
export const BakingSodaAnimation = () => {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());
  const narration = useNarration();
  const { speak, stop, isSpeaking, isPaused } = narration;
  const hasInteractedRef = useRef(false);

  const goTo = useCallback((idx: number) => {
    setScene(((idx % SCENE_COUNT) + SCENE_COUNT) % SCENE_COUNT);
    setProgress(0);
    startRef.current = Date.now();
  }, []);

  const next = useCallback(() => goTo(scene + 1), [scene, goTo]);
  const prev = useCallback(() => goTo(scene - 1), [scene, goTo]);

  /* Narration: speak when scene changes (if not muted) */
  useEffect(() => {
    if (muted) {
      stop();
      return;
    }
    if (hasInteractedRef.current) {
      speak(narrationScripts[scene]);
    }
  }, [scene, muted, speak, stop]);

  /* Track user interaction (browsers require a gesture before TTS) */
  const handleUserInteraction = useCallback(() => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      // Load voices (some browsers lazy-load them)
      window.speechSynthesis.getVoices();
      if (!muted) {
        speak(narrationScripts[scene]);
      }
    }
  }, [muted, scene, speak]);

  /* Auto-advance */
  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / AUTO_ADVANCE_MS) * 100, 100);
      setProgress(pct);
      if (elapsed >= AUTO_ADVANCE_MS) {
        setScene((s) => (s + 1) % SCENE_COUNT);
        startRef.current = Date.now();
        setProgress(0);
      }
    }, 50);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, scene]);

  return (
    <div className="bsa-page" onClick={handleUserInteraction}>
      {/* Header */}
      <div className="bsa-header">
        <h1>
          <span className="gradient-text">What Makes a Cake Fluffy?</span>
        </h1>
        <p>The chemistry behind baking soda &amp; leavening</p>
      </div>

      {/* Stage */}
      <div className="bsa-stage">
        {/* Scene info badge */}
        <div className="bsa-info">
          <div className="bsa-scene-badge">{sceneMeta[scene].badge}</div>
          <div className="bsa-scene-title">{sceneMeta[scene].title}</div>
          <div className="bsa-scene-desc">{sceneMeta[scene].desc}</div>
        </div>

        {/* Scenes */}
        <div className={`bsa-scene ${scene === 0 ? 'active' : ''}`}>
          <Scene1 />
        </div>
        <div className={`bsa-scene ${scene === 1 ? 'active' : ''}`}>
          <Scene2 />
        </div>
        <div className={`bsa-scene ${scene === 2 ? 'active' : ''}`}>
          <Scene3 active={scene === 2} />
        </div>
        <div className={`bsa-scene ${scene === 3 ? 'active' : ''}`}>
          <Scene4 active={scene === 3} />
        </div>

        {/* Progress bar */}
        <div className="bsa-progress" style={{ width: `${progress}%` }} />
      </div>

      {/* Controls */}
      <div className="bsa-controls">
        <button className="bsa-arrow" onClick={prev} aria-label="Previous scene">
          <ChevronLeft size={20} />
        </button>

        {Array.from({ length: SCENE_COUNT }).map((_, i) => (
          <button
            key={i}
            className={`bsa-dot ${scene === i ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to scene ${i + 1}`}
          />
        ))}

        <button
          className="bsa-arrow"
          onClick={() => {
            setPlaying((p) => {
              if (p) {
                narration.pause();
              } else {
                narration.resume();
              }
              return !p;
            });
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button className="bsa-arrow" onClick={next} aria-label="Next scene">
          <ChevronRight size={20} />
        </button>

        <div className="bsa-separator" />

        <button
          className={`bsa-arrow ${isSpeaking ? 'speaking' : ''}`}
          onClick={() => { handleUserInteraction(); setMuted((m) => !m); }}
          aria-label={muted ? 'Unmute narration' : 'Mute narration'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Narration subtitle bar */}
      {(isSpeaking || isPaused) && !muted && (
        <div className="bsa-subtitle">
          <div className={`bsa-subtitle-pulse ${isPaused ? 'opacity-50' : ''}`} style={{ animationPlayState: isPaused ? 'paused' : 'running' }} />
          <span>{isPaused ? '⏸️ Paused...' : '🎙️ Narrating…'}</span>
        </div>
      )}
    </div>
  );
};
