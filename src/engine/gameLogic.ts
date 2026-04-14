import type { PlayerState, Target } from "../types/game";

export const calculateTargetDestroyedEffect = (target: Target): Partial<PlayerState> => {
  switch (target.type) {
    case "electric":
      return {
        power: -20,
        productionCapacity: -20,
      };
    case "water":
      return {
        population: -10,
        morale: -5,
      };
    case "military":
      return {
        productionCapacity: -20,
      };
    case "barrack":
      return {
        morale: -25,
      };
    default:
      return {};
  }
};

export const applyDamageToTargets = (
  targets: Target[],
  targetId: string,
  damage: number,
  onTargetDestroyed: (target: Target) => void
): Target[] => {
  return targets.map((t) => {
    if (t.id === targetId) {
      const newHp = Math.max(0, t.hp - damage);
      if (newHp === 0 && t.hp > 0) {
        onTargetDestroyed(t);
      }
      return { ...t, hp: newHp };
    }
    return t;
  });
};
