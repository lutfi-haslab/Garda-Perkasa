import React, { useState, useEffect, useCallback } from "react";
import type {
  GameState,
  PlayerState,
  Target,
  BattleLogEntry,
  AiEngineType,
  TargetType,
} from "../types/game";
import {
  INITIAL_PLAYER_STATE,
  INITIAL_ENEMY_STATE,
  TARGET_TYPES,
} from "../constants/gameConstants";
import {
  calculateTargetDestroyedEffect,
  applyDamageToTargets,
} from "../engine/gameLogic";

const generateRandomTargets = (
  side: "player" | "enemy",
  count: number,
): Target[] => {
  const types: TargetType[] = [
    "electric",
    "water",
    "military",
    "defense",
    "barrack",
  ];
  const targets: Target[] = [];

  // Iran (Player) bounds
  const pBounds = { lat: [27, 37], lng: [45, 61] };
  
  // Alliance regions (Enemy)
  const eRegions = [
    { name: "Israel", lat: [30, 33], lng: [34, 36] },
    { name: "UAE (Al Dhafra)", lat: [24, 25], lng: [54, 55] },
    { name: "Qatar (Al Udeid)", lat: [25, 26], lng: [51, 52] },
    { name: "Kuwait (Ali Al Salem)", lat: [29, 30], lng: [47, 48] },
    { name: "Jordan (Muwaffaq Salti)", lat: [31, 32], lng: [36, 37] }
  ];

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const region = side === "player" ? { lat: pBounds.lat, lng: pBounds.lng } : eRegions[i % eRegions.length];
    
    targets.push({
      id: `${side}_${type}_${i}`,
      type,
      hp: 100,
      maxHp: 100,
      side,
      lat: region.lat[0] + Math.random() * (region.lat[1] - region.lat[0]),
      lng: region.lng[0] + Math.random() * (region.lng[1] - region.lng[0]),
    });
  }
  return targets;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    speed: 4, // 1X
    paused: true,
    gameOver: false,
    selectedTarget: null,
    aiEngine: "local",
    gameMode: "AvA",
    apiKey: "",
  });

  const [isStarted, setIsStarted] = useState(false);

  const [playerState, setPlayerState] =
    useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [enemyState, setEnemyState] =
    useState<PlayerState>(INITIAL_ENEMY_STATE);

  const [playerTargets, setPlayerTargets] = useState<Target[]>(
    generateRandomTargets("player", 15),
  );
  const [enemyTargets, setEnemyTargets] = useState<Target[]>(
    generateRandomTargets("enemy", 15),
  );

  const [activeAttacks, setActiveAttacks] = useState<
    {
      id: string;
      from: [number, number];
      to: [number, number];
      type: "missile" | "drone";
    }[]
  >([]);
  const [activeExplosions, setActiveExplosions] = useState<
    { id: string; lat: number; lng: number }[]
  >([]);
  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>([]);

  const addAttack = useCallback(
    (
      from: [number, number],
      to: [number, number],
      type: "missile" | "drone",
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      setActiveAttacks((prev) => [...prev, { id, from, to, type }]);
      setTimeout(
        () => setActiveAttacks((prev) => prev.filter((a) => a.id !== id)),
        2000,
      );
    },
    [],
  );

  const addExplosion = useCallback((lat: number, lng: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setActiveExplosions((prev) => [...prev, { id, lat, lng }]);
    setTimeout(
      () => setActiveExplosions((prev) => prev.filter((e) => e.id !== id)),
      1000,
    );
  }, []);

  const addLog = useCallback(
    (msg: string, type: string = "default") => {
      setBattleLogs((prev) =>
        [{ msg, type, day: gameState.day }, ...prev].slice(0, 10),
      );
    },
    [gameState.day],
  );

  const updateSideState = (
    side: "player" | "enemy",
    effects: Partial<PlayerState>,
  ) => {
    const setter = side === "player" ? setPlayerState : setEnemyState;
    setter((prev) => ({ ...prev, 
        population: Math.max(0, prev.population + (effects.population || 0)),
        power: Math.max(0, prev.power + (effects.power || 0)),
        morale: Math.max(0, prev.morale + (effects.morale || 0)),
        productionCapacity: Math.max(0, prev.productionCapacity + (effects.productionCapacity || 0)),
    }));
  };

  const startSimulation = () => {
    setIsStarted(true);
    setGameState(prev => ({ ...prev, paused: false }));
    addLog("SIMULATION STARTED: All batteries green.", "accent");
  };

  const applyDamage = (
    targetId: string,
    damage: number,
    side: "player" | "enemy",
  ) => {
    const isPlayerTarget = side === "player";
    const targetsSetter = isPlayerTarget ? setPlayerTargets : setEnemyTargets;
    const targets = isPlayerTarget ? playerTargets : enemyTargets;

    // Tactical Check: Air Defense Interception
    const activeDefenses = targets.filter(
      (t) => t.type === "defense" && t.hp > 0,
    );
    const interceptionChance = activeDefenses.length * 0.15; // 15% per active battery

    if (Math.random() < interceptionChance) {
      addLog(
        `INTERCEPTED: ${side === "player" ? "Iran" : "Israel"} Air Defense neutralized an incoming strike!`,
        "accent",
      );
      return;
    }

    // Trigger explosion at target location
    const target = targets.find((t) => t.id === targetId);
    if (target) {
        addExplosion(target.lat, target.lng);
        addLog(`DIRECT HIT: ${TARGET_TYPES[target.type].name} at ${target.lat.toFixed(2)}, ${target.lng.toFixed(2)} [HP -${damage}]`, isPlayerTarget ? "enemy" : "player");
    }

    targetsSetter((prev) =>
      applyDamageToTargets(prev, targetId, damage, (destroyedTarget) => {
        const effects = calculateTargetDestroyedEffect(destroyedTarget);
        addLog(`TARGET DESTROYED: ${TARGET_TYPES[destroyedTarget.type].name}. Secondary effects impacting strategic metrics.`, "danger");
        updateSideState(side, effects);
      }),
    );
  };

  const launchAttack = (weapon: "missile" | "drone") => {
    if (!gameState.selectedTarget) return;

    const target = gameState.selectedTarget;
    const isAttackerPlayer = target.side === "enemy";
    const attackerState = isAttackerPlayer ? playerState : enemyState;
    const attackerTargets = isAttackerPlayer ? playerTargets : enemyTargets;

    if (attackerState[`${weapon}Stock` as keyof PlayerState] <= 0) return;

    const stateSetter = isAttackerPlayer ? setPlayerState : setEnemyState;
    
    stateSetter((prev) => ({
      ...prev,
      [`${weapon}Stock`]: Math.max(0, (prev[`${weapon}Stock` as keyof PlayerState] as number) - 1),
    }));

    const launchPoint =
      attackerTargets.find((t) => t.type === "military" && t.hp > 0) ||
      attackerTargets[0];
    addAttack(
      [launchPoint.lat, launchPoint.lng],
      [target.lat, target.lng],
      weapon,
    );

    addLog(
      `${isAttackerPlayer ? "Iran" : "Israel"} launching ${weapon} at ${TARGET_TYPES[target.type].name}`,
      isAttackerPlayer ? "player" : "enemy",
    );

    setTimeout(() => {
      applyDamage(target.id, weapon === "missile" ? 40 : 25, target.side);
      setGameState((prev) => ({ ...prev, selectedTarget: null }));
    }, 1500);
  };

  // Sophisticated Tactical AI Logic with Salvo Support
  const executeSideTurn = useCallback(
    async (side: "player" | "enemy") => {
      if (gameState.gameOver || gameState.paused) return;

      const myTargets = side === "player" ? playerTargets : enemyTargets;
      const opponentTargets = side === "player" ? enemyTargets : playerTargets;
      const myState = side === "player" ? playerState : enemyState;
      const opponentState = side === "player" ? enemyState : playerState;

      const availableTargets = opponentTargets.filter((t) => t.hp > 0);
      if (availableTargets.length === 0) return;

      if (myState.missileStock <= 0 && myState.droneStock <= 0) return;

      // Local stock tracking for this salvo
      let currentMissileStock = myState.missileStock;
      let currentDroneStock = myState.droneStock;

      // Launch a SALVO of 1-3 projectiles
      const salvoSize = Math.min(
        Math.floor(Math.random() * 3) + 1,
        currentMissileStock + currentDroneStock,
      );

      for (let i = 0; i < salvoSize; i++) {
        let target: Target;
        let weapon: "missile" | "drone";

        // Priority Logic
        const adBatteries = availableTargets.filter(
          (t) => t.type === "defense" && t.hp > 0,
        );
        if (adBatteries.length > 0 && currentMissileStock > 0) {
          target = adBatteries[Math.floor(Math.random() * adBatteries.length)];
          weapon = "missile";
        } else if (opponentState.power > 30 && currentMissileStock > 0) {
          target =
            availableTargets.find((t) => t.type === "electric") ||
            availableTargets[0];
          weapon = "missile";
        } else {
          target =
            availableTargets[
              Math.floor(Math.random() * availableTargets.length)
            ];
          weapon = currentDroneStock > 0 ? "drone" : "missile";
        }

        // Final safety check
        if (weapon === "missile" && currentMissileStock <= 0 && currentDroneStock > 0) weapon = "drone";
        if (weapon === "drone" && currentDroneStock <= 0 && currentMissileStock > 0) weapon = "missile";
        
        if (weapon === "missile" && currentMissileStock <= 0) break;
        if (weapon === "drone" && currentDroneStock <= 0) break;

        // Decrement local tracking
        if (weapon === "missile") currentMissileStock--;
        else currentDroneStock--;

        const stateSetter = side === "player" ? setPlayerState : setEnemyState;
        stateSetter((prev) => ({
          ...prev,
          missileStock: Math.max(0, prev.missileStock - (weapon === "missile" ? 1 : 0)),
          droneStock: Math.max(0, prev.droneStock - (weapon === "drone" ? 1 : 0)),
        }));

        const launchPoint =
          myTargets.find((t) => t.type === "military" && t.hp > 0) ||
          myTargets[0];

        // Staggered launch within the salvo
        const delay = i * 400;
        setTimeout(() => {
          addAttack(
            [launchPoint.lat, launchPoint.lng],
            [target.lat, target.lng],
            weapon,
          );
          addLog(
            `${side === "player" ? "Iran" : "Israel"} AI Salvo [${i + 1}]: ${weapon} at ${TARGET_TYPES[target.type].name}`,
            side,
          );

          setTimeout(() => {
            applyDamage(
              target.id,
              weapon === "missile" ? 40 : 25,
              side === "player" ? "enemy" : "player",
            );
          }, 1500);
        }, delay);
      }
    },
    [
      gameState,
      playerTargets,
      enemyTargets,
      playerState,
      enemyState,
      addLog,
      addAttack,
      addExplosion,
    ],
  );

  // Combined AI Loop
  useEffect(() => {
    if (gameState.paused || gameState.gameOver) return;

    const thinker = setInterval(() => {
      if (gameState.gameMode === "AvA") {
        executeSideTurn("player");
        setTimeout(() => executeSideTurn("enemy"), 3000);
      } else if (gameState.gameMode === "PvA") {
        executeSideTurn("enemy");
      }
      // PvP has no AI turns
    }, 10000 / gameState.speed);

    const dayInterval = setInterval(() => {
      setGameState((prev) => ({ ...prev, day: prev.day + 1 }));
      setPlayerState((prev) => ({
        ...prev,
        missileStock:
          prev.missileStock + Math.floor(prev.productionCapacity * 0.05) + 1,
        droneStock:
          prev.droneStock + Math.floor(prev.productionCapacity * 0.03) + 1,
      }));
      setEnemyState((prev) => ({
        ...prev,
        missileStock:
          prev.missileStock + Math.floor(prev.productionCapacity * 0.05) + 1,
        droneStock:
          prev.droneStock + Math.floor(prev.productionCapacity * 0.03) + 1,
      }));
      addLog("Daily production completed", "accent");
    }, 20000 / gameState.speed);

    return () => {
      clearInterval(thinker);
      clearInterval(dayInterval);
    };
  }, [
    gameState.paused,
    gameState.gameOver,
    gameState.speed,
    gameState.gameMode,
    executeSideTurn,
    addLog,
  ]);

  // Game over check
  useEffect(() => {
    if (
      playerState.population <= 0 ||
      playerState.power <= 0 ||
      playerState.morale <= 0
    ) {
      setGameState((prev) => ({ ...prev, gameOver: true }));
      addLog("MISSION FAILED: Strategic Collapse", "danger");
    } else if (
      enemyState.population <= 0 ||
      enemyState.power <= 0 ||
      enemyState.morale <= 0
    ) {
      setGameState((prev) => ({ ...prev, gameOver: true }));
      addLog("MISSION SUCCESS: Strategic Dominance", "accent");
    }
  }, [playerState, enemyState, addLog]);

  return {
    gameState,
    setGameState,
    playerState,
    enemyState,
    playerTargets,
    enemyTargets,
    battleLogs,
    activeAttacks,
    activeExplosions,
    isStarted,
    startSimulation,
    launchAttack,
    addLog,
  };
};
