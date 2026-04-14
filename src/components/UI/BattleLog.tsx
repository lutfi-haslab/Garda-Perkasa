import React from "react";
import type { BattleLogEntry } from "../../types/game";

interface BattleLogProps {
  logs: BattleLogEntry[];
}

const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  return (
    <footer className="flex-shrink-0 bg-panel/80 backdrop-blur border-t border-border z-20">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted font-display whitespace-nowrap">BATTLE LOG</span>
          <div className="flex-1 flex gap-4 overflow-hidden text-[10px] py-1">
            {logs.length === 0 ? (
              <span className="text-muted">System initialized. Awaiting orders...</span>
            ) : (
              logs.map((log, i) => (
                <span key={i} className={`${
                  log.type === 'player' ? 'text-player' : 
                  log.type === 'enemy' ? 'text-enemy' : 
                  log.type === 'accent' ? 'text-accent' : 
                  log.type === 'danger' ? 'text-danger' : 'text-white'
                } whitespace-nowrap opacity-${Math.max(20, 100 - i * 15)}`}>
                  [DAY {log.day}] {log.msg}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BattleLog;
