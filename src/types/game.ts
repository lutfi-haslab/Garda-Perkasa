export const GAME_TYPES_VERSION = "1.0.0";

export interface Target {
  id: string;
  type: TargetType;
  hp: number;
  maxHp: number;
  side: "player" | "enemy";
  lat: number;
  lng: number;
}

export type TargetType = "electric" | "water" | "military" | "defense" | "barrack";

export type GameMode = "PvP" | "PvA" | "AvA";

export interface GameState {
  day: number;
  speed: number;
  paused: boolean;
  gameOver: boolean;
  selectedTarget: Target | null;
  aiEngine: AiEngineType;
  gameMode: GameMode;
  apiKey: string;
}

export type AiEngineType = "deepseek" | "local";

export interface PlayerState {
  population: number;
  power: number;
  morale: number;
  missileStock: number;
  droneStock: number;
  productionCapacity: number;
}

export interface BattleLogEntry {
  msg: string;
  type: string;
  day: number;
}

export interface TargetTypeInfo {
  name: string;
  icon: string;
  color: string;
}
