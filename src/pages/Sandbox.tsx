import React, { useState, useCallback, useRef } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { CHEMICALS, getReaction } from '../utils/reactionLogic';
import { useGameStore, MISSIONS } from '../store/useGameStore';
import { FlaskConical, X, RotateCcw, Sparkles, Trophy } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Chemical {
  id: string;
  label: string;
  formula: string;
  emoji: string;
  color: string;
}

interface Reaction {
  state: string;
  title: string;
  equation: string;
  description: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Draggable Chip                                                     */
/* ------------------------------------------------------------------ */
const ChemicalChip = ({ chem }: { chem: Chemical }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('chemical_id', chem.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all duration-200 hover:scale-[1.04] hover:shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${chem.color}18, ${chem.color}08)`,
        border: `1px solid ${chem.color}30`,
      }}
    >
      <span className="text-2xl">{chem.emoji}</span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">{chem.label}</span>
        <span className="text-xs text-zinc-400 font-mono">{chem.formula}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Beaker                                                             */
/* ------------------------------------------------------------------ */
const BEAKER_COLORS: Record<string, string> = {
  fizzy_eruption: '#a78bfa',
  explosion: '#f97316',
  dissolve: '#38bdf8',
  safe_boom: '#71717a',
};

const Beaker = ({
  contents,
  reaction,
  isOver,
  onDrop,
}: {
  contents: Chemical[];
  reaction: Reaction | null;
  isOver: boolean;
  onDrop: (e: React.DragEvent) => void;
}) => {
  const beakerRef = useRef<HTMLDivElement>(null);

  const liquidSpring = useSpring({
    height: contents.length === 0 ? '0%' : contents.length === 1 ? '35%' : '65%',
    backgroundColor: reaction
      ? BEAKER_COLORS[reaction.state] || '#6366f1'
      : contents.length > 0
        ? contents[contents.length - 1].color
        : '#6366f1',
    config: config.wobbly,
  });

  const shakeSpring = useSpring({
    from: { x: 0 },
    to: reaction
      ? [
          { x: -6 },
          { x: 6 },
          { x: -4 },
          { x: 4 },
          { x: -2 },
          { x: 2 },
          { x: 0 },
        ]
      : { x: 0 },
    config: { tension: 300, friction: 10 },
  });

  const glowSpring = useSpring({
    boxShadow: isOver
      ? '0 0 40px rgba(99,102,241,0.5), inset 0 0 20px rgba(99,102,241,0.15)'
      : reaction
        ? `0 0 60px ${BEAKER_COLORS[reaction.state] || '#6366f1'}50`
        : '0 0 0px transparent',
    config: config.gentle,
  });

  const showBubbles = reaction && (reaction.state === 'fizzy_eruption' || reaction.state === 'dissolve');

  return (
    <animated.div
      ref={beakerRef}
      style={{ ...shakeSpring, ...glowSpring }}
      onDragOver={(e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={onDrop}
      className="relative w-56 h-72 rounded-b-3xl rounded-t-lg border-2 border-white/15 bg-white/[0.03] backdrop-blur-md flex flex-col justify-end overflow-hidden transition-all"
    >
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[110%] h-3 rounded-t-lg border-t-2 border-x-2 border-white/20 bg-white/[0.06]" />

      <animated.div
        style={liquidSpring}
        className="w-full rounded-b-[20px] relative overflow-hidden"
      >
        {showBubbles && (
          <div className="absolute inset-0">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white/30 animate-bubble"
                style={{
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1.2 + Math.random() * 1.6}s`,
                }}
              />
            ))}
          </div>
        )}

        {reaction?.state === 'explosion' && (
          <div className="absolute inset-0 animate-flash bg-orange-400/60" />
        )}
      </animated.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1 z-10">
        {contents.length === 0 && (
          <span className="text-zinc-500 text-sm font-medium">Drop here</span>
        )}
        {contents.map((c: Chemical) => (
          <span key={c.id} className="text-2xl drop-shadow-lg">{c.emoji}</span>
        ))}
      </div>
    </animated.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Mission Success Banner                                             */
/* ------------------------------------------------------------------ */
const MissionSuccessBanner = ({
  missionTitle,
  pointsEarned,
  equipmentEmoji,
  equipmentLabel,
  onClose,
}: {
  missionTitle: string;
  pointsEarned: number;
  equipmentEmoji: string;
  equipmentLabel: string;
  onClose: () => void;
}) => {
  const spring = useSpring({
    from: { opacity: 0, transform: 'scale(0.8) translateY(30px)' },
    to: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    config: config.gentle,
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={onClose}>
      <animated.div
        style={spring}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative max-w-sm w-full mx-4 rounded-2xl overflow-hidden"
      >
        {/* Gold accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
        <div className="p-6 bg-zinc-900/95 border border-amber-500/20 rounded-b-2xl text-center">
          <div className="text-5xl mb-3 animate-bounce">🏆</div>
          <h2 className="text-xl font-extrabold text-white mb-1">Mission Complete!</h2>
          <p className="text-sm text-zinc-400 mb-5">{missionTitle}</p>

          <div className="flex items-center justify-center gap-6 mb-5">
            <div className="flex flex-col items-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-black text-amber-300">+{pointsEarned}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Points</span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{equipmentEmoji}</span>
              <span className="text-sm font-semibold text-white">{equipmentLabel}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Unlocked</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
          >
            Awesome!
          </button>
        </div>
      </animated.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Reaction Pop-up                                                    */
/* ------------------------------------------------------------------ */
const ReactionPopup = ({
  reaction,
  onClose,
}: {
  reaction: Reaction;
  onClose: () => void;
}) => {
  const spring = useSpring({
    from: { opacity: 0, transform: 'scale(0.85) translateY(20px)' },
    to: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    config: config.gentle,
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <animated.div
        style={spring}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative max-w-md w-full mx-4 rounded-2xl p-6 glass-panel border border-white/10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6" style={{ color: reaction.color }} />
          <h2 className="text-xl font-bold text-white">{reaction.title}</h2>
        </div>

        <div className="rounded-xl px-4 py-2 mb-4 font-mono text-sm tracking-wide text-center" style={{ background: `${reaction.color}15`, color: reaction.color, border: `1px solid ${reaction.color}30` }}>
          {reaction.equation}
        </div>

        <p className="text-zinc-300 text-sm leading-relaxed">{reaction.description}</p>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-lg font-semibold text-white transition-all hover:brightness-110"
          style={{ background: reaction.color }}
        >
          Cool, got it!
        </button>
      </animated.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Active Mission Hint                                                */
/* ------------------------------------------------------------------ */
const ActiveMissionHint = () => {
  const completedMissions = useGameStore((s) => s.completedMissions);
  const activeMission = MISSIONS.find((m) => !completedMissions.includes(m.id));
  if (!activeMission) return null;

  return (
    <div className="glass-panel rounded-xl px-4 py-3 flex items-center gap-3 text-sm max-w-md w-full">
      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
      <div>
        <span className="text-zinc-500">Active mission: </span>
        <span className="text-white font-semibold">{activeMission.title}</span>
        <span className="text-zinc-500"> — Mix </span>
        <span className="text-indigo-300 font-mono">{activeMission.requiredChemicals.join(' + ')}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export const Sandbox = () => {
  const [beakerContents, setBeakerContents] = useState<Chemical[]>([]);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [missionBanner, setMissionBanner] = useState<{
    title: string;
    points: number;
    emoji: string;
    label: string;
  } | null>(null);

  const completeMission = useGameStore((s) => s.completeMission);
  const completedMissions = useGameStore((s) => s.completedMissions);

  const reset = useCallback(() => {
    setBeakerContents([]);
    setReaction(null);
    setShowPopup(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      const chemId = e.dataTransfer.getData('chemical_id');
      const chem = CHEMICALS.find((c: Chemical) => c.id === chemId);
      if (!chem) return;

      if (beakerContents.find((c: Chemical) => c.id === chem.id)) return;

      const next = [...beakerContents, chem];
      setBeakerContents(next);

      if (next.length === 2) {
        const result = getReaction(next[0].id, next[1].id);
        setReaction(result);
        setTimeout(() => setShowPopup(true), 800);

        // Check if this reaction completes any mission
        const chemIds = next.map((c) => c.id).sort();
        const matched = MISSIONS.find(
          (m) =>
            !completedMissions.includes(m.id) &&
            m.requiredReaction === result.state &&
            JSON.stringify([...m.requiredChemicals].sort()) === JSON.stringify(chemIds),
        );

        if (matched) {
          const EQUIPMENT: Record<string, { label: string; emoji: string }> = {
            safety_goggles: { label: 'Safety Goggles', emoji: '🥽' },
            lab_coat: { label: 'Lab Coat', emoji: '🥼' },
            microscope: { label: 'Microscope', emoji: '🔬' },
          };
          const equip = EQUIPMENT[matched.reward.equipment] || { label: 'Item', emoji: '🎁' };

          completeMission(matched.id);

          setTimeout(() => {
            setMissionBanner({
              title: matched.title,
              points: matched.reward.points,
              emoji: equip.emoji,
              label: equip.label,
            });
          }, 2000);
        }
      }
    },
    [beakerContents, completedMissions, completeMission],
  );

  return (
    <div className="w-full min-h-screen pt-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* ---- Side Panel ---- */}
      <aside className="lg:w-72 shrink-0">
        <div className="glass-panel rounded-2xl p-5 sticky top-28">
          <h2 className="text-lg font-bold mb-1 text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-400" />
            Chemicals
          </h2>
          <p className="text-xs text-zinc-500 mb-4">Drag two into the beaker</p>
          <div className="flex flex-col gap-3">
            {CHEMICALS.map((c: Chemical) => (
              <ChemicalChip key={c.id} chem={c} />
            ))}
          </div>
        </div>
      </aside>

      {/* ---- Beaker Area ---- */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span className="gradient-text">The Sandbox</span>
        </h1>

        <ActiveMissionHint />

        <div
          onDragEnter={() => setIsOver(true)}
          onDragLeave={() => setIsOver(false)}
        >
          <Beaker
            contents={beakerContents}
            reaction={reaction}
            isOver={isOver}
            onDrop={handleDrop}
          />
        </div>

        {/* Status pills */}
        {beakerContents.length > 0 && (
          <div className="flex items-center gap-3">
            {beakerContents.map((c: Chemical) => (
              <span
                key={c.id}
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30` }}
              >
                {c.emoji} {c.label}
              </span>
            ))}
            {reaction && (
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{ background: `${reaction.color}20`, color: reaction.color, border: `1px solid ${reaction.color}40` }}
              >
                {reaction.state.replace('_', ' ')}
              </span>
            )}
          </div>
        )}

        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Beaker
        </button>
      </main>

      {/* ---- Popups ---- */}
      {showPopup && reaction && (
        <ReactionPopup reaction={reaction} onClose={() => setShowPopup(false)} />
      )}
      {missionBanner && (
        <MissionSuccessBanner
          missionTitle={missionBanner.title}
          pointsEarned={missionBanner.points}
          equipmentEmoji={missionBanner.emoji}
          equipmentLabel={missionBanner.label}
          onClose={() => setMissionBanner(null)}
        />
      )}
    </div>
  );
};
