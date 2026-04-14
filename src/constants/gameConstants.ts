import type { TargetTypeInfo, TargetType } from "../types/game";

export const TARGET_TYPES: Record<TargetType, TargetTypeInfo & { svg: string }> = {
  electric: { 
    name: "Power Grid", 
    icon: "⚡", 
    svg: `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>`, 
    color: "#ffb800" 
  },
  water: { 
    name: "Water Supply", 
    icon: "💧", 
    svg: `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`, 
    color: "#00b8d4" 
  },
  military: { 
    name: "Command Center", 
    icon: "🏢", 
    svg: `<path d="M12 22v-9h-4v9H2V8l10-5 10 5v14h-6v-9h-4v9z"/>`, 
    color: "#ff6b35" 
  },
  defense: { 
    name: "AD Battery", 
    icon: "🛡️", 
    svg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`, 
    color: "#00d4aa" 
  },
  barrack: { 
    name: "Mobilization Hub", 
    icon: "🪖", 
    svg: `<path d="M21 18V6c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-7V8l4 4-4 4v-3H8v-2h4z"/>`, 
    color: "#ff3d3d" 
  },
};

export const INITIAL_PLAYER_STATE = {
  population: 100,
  power: 100,
  morale: 100,
  missileStock: 15,
  droneStock: 10,
  productionCapacity: 100,
};

export const INITIAL_ENEMY_STATE = {
  population: 100,
  power: 100,
  morale: 100,
  missileStock: 8,
  droneStock: 5,
  productionCapacity: 50,
};
