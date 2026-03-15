/**
 * Chemistry Reaction Dictionary
 * Maps pairs of chemical ingredients to reaction outcomes.
 */

const REACTIONS = {
  'baking_soda+vinegar': {
    state: 'fizzy_eruption',
    title: 'Acid-Base Reaction!',
    equation: 'NaHCO₃ + CH₃COOH → CO₂↑ + H₂O + NaCH₃COO',
    description:
      `Baking soda (sodium bicarbonate) is a base, and vinegar (acetic acid) is an acid. When they meet, they neutralise each other and release carbon dioxide gas — that's the fizz you see!`,
    color: '#a78bfa',
  },
  'sodium+water': {
    state: 'explosion',
    title: 'Alkali Metal + Water!',
    equation: '2Na + 2H₂O → 2NaOH + 2H₂↑',
    description:
      'Sodium is an alkali metal that reacts violently with water, producing sodium hydroxide and hydrogen gas. The heat generated can ignite the hydrogen, causing a small explosion!',
    color: '#f97316',
  },
  'water+baking_soda': {
    state: 'dissolve',
    title: 'Dissolving',
    equation: 'NaHCO₃ (s) → Na⁺ (aq) + HCO₃⁻ (aq)',
    description:
      'Baking soda dissolves in water, separating into sodium ions and bicarbonate ions. This is a physical change — no new substance is created, just a solution!',
    color: '#38bdf8',
  },
};

/**
 * Normalise a pair of ingredient IDs into a canonical key.
 * We sort alphabetically so order doesn't matter.
 */
function makeKey(a, b) {
  return [a, b].sort().join('+');
}

/**
 * Look up the reaction for two ingredients.
 * @param {string} ingredientA - id of the first ingredient
 * @param {string} ingredientB - id of the second ingredient
 * @returns {{ state: string, title: string, equation: string, description: string, color: string }}
 */
export function getReaction(ingredientA, ingredientB) {
  const key = makeKey(ingredientA, ingredientB);
  if (REACTIONS[key]) return REACTIONS[key];

  // Fallback — unknown / incompatible pair
  return {
    state: 'safe_boom',
    title: 'No Reaction… Yet!',
    equation: '??? → 💥',
    description:
      'These two substances don\'t have a notable reaction together. Keep experimenting — real chemistry is all about trial and error!',
    color: '#71717a',
  };
}

/** Master list of available chemicals for the sidebar */
export const CHEMICALS = [
  { id: 'baking_soda', label: 'Baking Soda', formula: 'NaHCO₃', emoji: '🧂', color: '#e2e8f0' },
  { id: 'vinegar',     label: 'Vinegar',     formula: 'CH₃COOH', emoji: '🫗', color: '#fde68a' },
  { id: 'water',       label: 'Water',       formula: 'H₂O',     emoji: '💧', color: '#7dd3fc' },
  { id: 'sodium',      label: 'Sodium',      formula: 'Na',      emoji: '🔶', color: '#fdba74' },
];
