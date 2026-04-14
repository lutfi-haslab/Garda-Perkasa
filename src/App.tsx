import React, { useState } from "react";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Types
import type { AiEngineType } from "./types/game";

// Hooks
import { useGameState } from "./hooks/useGameState";

// UI Components
import Header from "./components/UI/Header";
import SidePanel from "./components/UI/SidePanel";
import BattleLog from "./components/UI/BattleLog";
import AttackInterface from "./components/UI/AttackInterface";
import AiConfigPanel from "./components/UI/AiConfigPanel";
import GameOverOverlay from "./components/UI/GameOverOverlay";

// Map Components
import MapView from "./components/Map/MapView";

const App: React.FC = () => {
  const {
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
  } = useGameState();

  const [isAiConfigOpen, setIsAiConfigOpen] = useState(false);

  return (
    <div className="relative z-10 flex flex-col h-screen bg-bg text-gray-200 overflow-hidden font-mono">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-player/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-enemy/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <Header 
        gameState={gameState} 
        onSpeedChange={(speed) => setGameState(prev => ({ ...prev, speed: speed || 1, paused: speed === 0 }))}
        onAiConfigToggle={() => setIsAiConfigOpen(!isAiConfigOpen)}
        onGameModeChange={(mode) => setGameState(prev => ({ ...prev, gameMode: mode }))}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* AI Config Modal-like Overlay */}
        {isAiConfigOpen && (
          <AiConfigPanel 
            engine={gameState.aiEngine}
            apiKey={gameState.apiKey}
            onEngineChange={(engine) => setGameState(prev => ({ ...prev, aiEngine: engine }))}
            onApiKeyChange={(key) => setGameState(prev => ({ ...prev, apiKey: key }))}
            onClose={() => setIsAiConfigOpen(false)}
          />
        )}

        {/* Left Side: Player Status */}
        <SidePanel 
          title="IRAN" 
          side="player" 
          state={playerState} 
          targets={playerTargets} 
        />

        {/* Center: Map Area */}
        <main className="flex-1 relative border-border/30 border-y lg:border-y-0">
          <MapContainer 
            center={[32.0, 47.0]} 
            zoom={5} 
            className="h-full w-full" 
            zoomControl={false}
          >
            <MapView 
              playerTargets={playerTargets} 
              enemyTargets={enemyTargets} 
              activeAttacks={activeAttacks}
              activeExplosions={activeExplosions}
              onTargetClick={(target) => setGameState(prev => ({ ...prev, selectedTarget: target }))}
            />
          </MapContainer>

          {/* Start Simulation Overlay */}
          {!isStarted && (
            <div className="absolute inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center p-8 bg-panel border-2 border-accent rounded-xl shadow-2xl animate-in fade-in zoom-in duration-500">
                <h2 className="text-4xl font-display font-bold text-accent mb-4 tracking-widest">GARDA PERKASA</h2>
                <p className="text-muted mb-8 max-w-md mx-auto">Tactical Warfare Simulation Engine. All systems initialized. Prepared for strategic engagement.</p>
                <button 
                  onClick={startSimulation}
                  className="px-12 py-4 bg-accent text-bg font-bold rounded-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,212,170,0.5)]"
                >
                  START SIMULATION
                </button>
                <div className="mt-6 flex justify-center gap-6 text-[10px] text-muted uppercase tracking-widest">
                  <span>Mode: {gameState.gameMode}</span>
                  <span>|</span>
                  <span>Engine: Local 1.0</span>
                </div>
              </div>
            </div>
          )}

          {/* Attack interface */}
          {gameState.selectedTarget && (
            (gameState.gameMode === "PvP" || 
             (gameState.gameMode === "PvA" && gameState.selectedTarget.side === "enemy")) && (
              <AttackInterface 
                  selectedTarget={gameState.selectedTarget}
                  playerState={gameState.selectedTarget.side === "enemy" ? playerState : enemyState}
                  onAttack={launchAttack}
                  onCancel={() => setGameState(prev => ({ ...prev, selectedTarget: null }))}
              />
            )
          )}

          {/* Game Over Screen */}
          {gameState.gameOver && (
            <GameOverOverlay 
                won={playerState.population > 0} 
                onRestart={() => window.location.reload()} 
            />
          )}
        </main>

        {/* Right Side: Enemy Status */}
        <SidePanel 
          title="ISRAEL" 
          side="enemy" 
          state={enemyState} 
          targets={enemyTargets}
          aiEngine={gameState.aiEngine}
        />
      </div>

      {/* Footer Log */}
      <BattleLog logs={battleLogs} />
    </div>
  );
};

export default App;
