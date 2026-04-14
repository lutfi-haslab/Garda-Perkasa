import React from "react";
import type { GameState, GameMode } from "../../types/game";

interface HeaderProps {
  gameState: GameState;
  onSpeedChange: (speed: number) => void;
  onAiConfigToggle: () => void;
  onGameModeChange: (mode: GameMode) => void;
}

const MODES: GameMode[] = ["PvA", "AvA", "PvP"];

const Header: React.FC<HeaderProps> = ({
  gameState,
  onSpeedChange,
  onAiConfigToggle,
  onGameModeChange,
}) => {
  return (
    <header className="flex-shrink-0 bg-panel/80 backdrop-blur border-b border-border px-4 py-3 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <line x1="22" y1="8.5" x2="12" y2="15.5" />
              <line x1="2" y1="8.5" x2="12" y2="15.5" />
            </svg>
            <h1 className="font-display font-bold text-xl tracking-wider text-white uppercase">
              GARDA PERKASA
            </h1>
          </div>
          <div className="hidden sm:block px-3 py-1 bg-card rounded border border-border">
            <span className="text-muted text-xs">DAY</span>
            <span className="font-display font-bold text-accent ml-2">
              {gameState.day}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-card rounded border border-border overflow-hidden">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => onGameModeChange(m)}
                className={`px-3 py-1.5 text-[10px] font-display hover:bg-border transition-colors ${
                  gameState.gameMode === m
                    ? "bg-accent/20 text-accent font-bold"
                    : "text-muted"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={onAiConfigToggle}
            className="px-3 py-1.5 bg-card border border-border rounded text-[10px] hover:border-accent transition-colors"
          >
            AI: {gameState.aiEngine.toUpperCase()}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-muted text-xs hidden sm:block font-mono">
              SPEED:
            </span>
            <div className="flex bg-card rounded border border-border overflow-hidden">
              {[0, 1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    onSpeedChange(s === 1 ? 4 : s === 2 ? 6 : s === 3 ? 8 : 0)
                  }
                  className={`px-3 py-1.5 text-xs font-display hover:bg-border transition-colors ${
                    (
                      s === 0
                        ? gameState.paused
                        : !gameState.paused &&
                          gameState.speed ===
                            (s === 1 ? 4 : s === 2 ? 6 : s === 3 ? 8 : 0)
                    )
                      ? "bg-accent/20 text-accent"
                      : ""
                  }`}
                >
                  {s === 0 ? "PAUSE" : `${s}X`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
