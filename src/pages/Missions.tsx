import React from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated, config } from '@react-spring/web';
import { useGameStore, MISSIONS, EQUIPMENT } from '../store/useGameStore';
import { Trophy, Lock, CheckCircle, ChevronRight, Sparkles, Rocket } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Mission Card                                                       */
/* ------------------------------------------------------------------ */
const MissionCard = ({
  mission,
  isCompleted,
  isLocked,
  index,
}: {
  mission: typeof MISSIONS[0];
  isCompleted: boolean;
  isLocked: boolean;
  index: number;
}) => {
  const spring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: index * 120,
    config: config.gentle,
  });

  const equip = EQUIPMENT[mission.reward.equipment as keyof typeof EQUIPMENT];

  return (
    <animated.div style={spring} className="relative">
      {/* Connector line to next mission */}
      {index < MISSIONS.length - 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-px h-8 bg-gradient-to-b from-white/15 to-transparent z-0" />
      )}

      <div
        className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
          isLocked ? 'opacity-50 grayscale' : 'hover:border-indigo-500/40'
        } ${isCompleted ? 'border-emerald-500/30' : ''}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono text-zinc-500">#{index + 1}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{mission.title}</h3>
              <p className="text-xs text-zinc-500">{mission.subtitle}</p>
            </div>
          </div>
          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <CheckCircle className="w-3.5 h-3.5" /> Done
            </span>
          ) : isLocked ? (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
              <Lock className="w-3.5 h-3.5" /> Locked
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Active
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{mission.description}</p>

        {/* Reward bar */}
        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 px-4 py-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-semibold">+{mission.reward.points} pts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">{equip?.emoji}</span>
            <span className="text-zinc-300 font-medium">{equip?.label}</span>
          </div>
        </div>

        {/* Action */}
        {!isLocked && !isCompleted && (
          <Link
            to="/sandbox"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
          >
            Go to Sandbox <ChevronRight className="w-4 h-4" />
          </Link>
        )}
        {isCompleted && (
          <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 font-semibold text-sm border border-emerald-500/20">
            <CheckCircle className="w-4 h-4" /> Mission Complete
          </div>
        )}
      </div>
    </animated.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Equipment Shelf                                                    */
/* ------------------------------------------------------------------ */
const EquipmentShelf = () => {
  const unlockedEquipment = useGameStore((s) => s.unlockedEquipment);

  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center gap-2">
        🧪 Your Lab Equipment
      </h3>
      {unlockedEquipment.length === 0 ? (
        <p className="text-xs text-zinc-500">Complete missions to unlock equipment</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {unlockedEquipment.map((key: string) => {
            const equip = EQUIPMENT[key as keyof typeof EQUIPMENT];
            return equip ? (
              <div key={key} className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2">
                <span className="text-xl">{equip.emoji}</span>
                <span className="text-xs text-zinc-300 font-medium">{equip.label}</span>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export const Missions = () => {
  const { completedMissions, points, level } = useGameStore();

  return (
    <div className="w-full min-h-screen pt-24 pb-16 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Rocket className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="gradient-text">Skill Tree</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500">Complete missions to level up and unlock lab gear</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-zinc-500">Level</p>
            <p className="text-2xl font-black text-white">{level}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-right">
            <p className="text-xs text-zinc-500">Points</p>
            <p className="text-2xl font-black text-amber-400">{points}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skill Tree (missions) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {MISSIONS.map((mission, i) => {
            const isCompleted = completedMissions.includes(mission.id);
            // A mission is locked if the previous tier mission is not yet completed
            const isLocked = i > 0 && !completedMissions.includes(MISSIONS[i - 1].id);
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                isCompleted={isCompleted}
                isLocked={isLocked}
                index={i}
              />
            );
          })}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-6">
          <EquipmentShelf />
        </div>
      </div>
    </div>
  );
};
