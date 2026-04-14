import React from "react";
import type { PlayerState, Target } from "../../types/game";
import { TARGET_TYPES } from "../../constants/gameConstants";

interface SidePanelProps {
  title: string;
  side: "player" | "enemy";
  state: PlayerState;
  targets: Target[];
  aiEngine?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ title, side, state, targets, aiEngine }) => {
  const isPlayer = side === "player";
  const iconColor = isPlayer ? "text-player" : "text-enemy";
  const iconBorder = isPlayer ? "border-player" : "border-enemy";
  const iconBg = isPlayer ? "bg-player/20" : "bg-enemy/20";

  return (
    <aside className={`flex-shrink-0 lg:w-72 bg-panel/60 backdrop-blur p-4 h-full flex flex-col z-20 ${isPlayer ? "border-r" : "border-l"} border-border`}>
      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className={`w-10 h-10 rounded ${iconBg} border ${iconBorder} flex items-center justify-center`}>
            <span className={`font-display font-bold ${iconColor}`}>{isPlayer ? "P" : "A"}</span>
          </div>
          <div>
            <h2 className={`font-display font-bold ${iconColor} uppercase`}>{title}</h2>
            <span className="text-xs text-muted">{isPlayer ? "PLAYER SIDE" : "AI OPPONENT"}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {[
            { label: "POPULATION", val: state.population, color: "bg-accent" },
            { label: "POWER", val: state.power, color: "bg-warning" },
            { label: "MORALE", val: state.morale, color: isPlayer ? "bg-player" : "bg-enemy" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">{stat.label}</span>
                <span className="font-display text-white">{stat.val}%</span>
              </div>
              <div className="status-bar">
                <div className={`status-fill ${stat.color}`} style={{ width: `${stat.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Arsenal */}
        <div className="pt-3 border-t border-border">
          <h3 className="text-xs text-muted mb-2">ARSENAL</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card rounded p-2 border border-border">
                <div className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <div>
                  <div className="text-xs text-muted leading-none">MISSILE</div>
                  <div className="font-display font-bold text-white mt-1">{state.missileStock}</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded p-2 border border-border">
                <div className="flex items-center gap-2">
                <span className="text-lg">🛸</span>
                <div>
                  <div className="text-xs text-muted leading-none">DRONE</div>
                  <div className="font-display font-bold text-white mt-1">{state.droneStock}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="pt-3 border-t border-border flex-1 flex flex-col min-h-0">
          <h3 className="text-xs text-muted mb-2">FACILITIES STATUS</h3>
          <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {targets.map(t => (
              <div key={t.id} className={`flex items-center gap-2 p-1.5 rounded bg-card/50 border border-border/30 ${t.hp <= 0 ? "opacity-40" : ""}`}>
                <span className="text-sm">{TARGET_TYPES[t.type].icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-muted truncate uppercase">{TARGET_TYPES[t.type].name}</div>
                  <div className="h-1 bg-bg rounded mt-1 overflow-hidden">
                    <div 
                        className={`h-full transition-all ${t.hp > 50 ? 'bg-accent' : t.hp > 25 ? 'bg-warning' : 'bg-danger'}`} 
                        style={{ width: `${t.hp}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-[10px] font-display">{t.hp}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Extra Info */}
        {!isPlayer && aiEngine && (
            <div className="pt-3 border-t border-border">
                <h3 className="text-xs text-muted mb-2">AI STATUS</h3>
                <div className="bg-card/50 border border-border/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-enemy animate-pulse"></div>
                        <span className="text-xs font-display text-enemy">ACTIVE - {aiEngine.toUpperCase()}</span>
                    </div>
                    <p className="text-[10px] text-muted uppercase leading-relaxed">
                        Analyzing player weaknesses...
                    </p>
                </div>
            </div>
        )}
      </div>
    </aside>
  );
};

export default SidePanel;
