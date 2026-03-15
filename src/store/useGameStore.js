import { create } from 'zustand';

/**
 * Gamified progression store.
 * Tracks level, points, unlocked elements, completed missions, and unlocked equipment.
 */

// ── Mission definitions ──────────────────────────────────────────────
export const MISSIONS = [
  {
    id: 'culinary_chemist',
    title: 'The Culinary Chemist',
    subtitle: 'Make Bread Rise',
    description: 'Combine Baking Soda and Vinegar in the Sandbox to trigger a fizzy eruption — the same CO₂ gas that makes bread dough rise!',
    requiredReaction: 'fizzy_eruption',
    requiredChemicals: ['baking_soda', 'vinegar'],
    reward: { points: 100, equipment: 'safety_goggles' },
    tier: 1,
  },
  {
    id: 'explosive_encounter',
    title: 'Explosive Encounter',
    subtitle: 'Alkali Metal Mayhem',
    description: 'Drop Sodium into Water and witness a violent exothermic reaction. Handle with care!',
    requiredReaction: 'explosion',
    requiredChemicals: ['sodium', 'water'],
    reward: { points: 150, equipment: 'lab_coat' },
    tier: 2,
  },
  {
    id: 'solution_master',
    title: 'Solution Master',
    subtitle: 'Dissolve & Observe',
    description: 'Dissolve Baking Soda in Water and learn how ionic compounds separate in a solvent.',
    requiredReaction: 'dissolve',
    requiredChemicals: ['baking_soda', 'water'],
    reward: { points: 120, equipment: 'microscope' },
    tier: 2,
  },
];

// ── Equipment catalogue ──────────────────────────────────────────────
export const EQUIPMENT = {
  safety_goggles: { label: 'Safety Goggles', emoji: '🥽' },
  lab_coat:       { label: 'Lab Coat',       emoji: '🥼' },
  microscope:     { label: 'Microscope',     emoji: '🔬' },
};

// ── Level thresholds ─────────────────────────────────────────────────
function getLevel(points) {
  if (points >= 300) return 4;
  if (points >= 200) return 3;
  if (points >= 100) return 2;
  return 1;
}

// ── Store ────────────────────────────────────────────────────────────
export const useGameStore = create((set, get) => ({
  points: 0,
  level: 1,
  completedMissions: [],   // mission ids
  unlockedEquipment: [],   // equipment keys
  unlockedElements: [],    // element symbols unlocked via progression
  visitedSteps: [],        // learning journey steps the student has visited (1, 2, 3)

  /** Call after a successful reaction in the Sandbox. */
  completeMission: (missionId) => {
    const state = get();
    if (state.completedMissions.includes(missionId)) return false; // already done

    const mission = MISSIONS.find((m) => m.id === missionId);
    if (!mission) return false;

    const newPoints = state.points + mission.reward.points;
    set({
      points: newPoints,
      level: getLevel(newPoints),
      completedMissions: [...state.completedMissions, missionId],
      unlockedEquipment: [...state.unlockedEquipment, mission.reward.equipment],
    });
    return true;
  },

  /** Unlock element symbols as they are explored */
  unlockElement: (symbol) => {
    const state = get();
    if (!state.unlockedElements.includes(symbol)) {
      set({ unlockedElements: [...state.unlockedElements, symbol] });
    }
  },

  resetProgress: () =>
    set({
      points: 0,
      level: 1,
      completedMissions: [],
      unlockedEquipment: [],
      unlockedElements: [],
      visitedSteps: [],
    }),

  markStepVisited: (step) => {
    const state = get();
    if (!state.visitedSteps.includes(step)) {
      set({ visitedSteps: [...state.visitedSteps, step] });
    }
  },

  addPoints: (amount) => {
    const state = get();
    const newPoints = state.points + amount;
    set({ points: newPoints, level: getLevel(newPoints) });
  },
}));
