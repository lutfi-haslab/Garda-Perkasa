import React from "react";
import type { BattleLogEntry } from "../../types/game";

interface WarRoomLogProps {
  logs: BattleLogEntry[];
}

const WarRoomLog: React.FC<WarRoomLogProps> = ({ logs }) => {
  return (
    <div className="flex flex-col h-full bg-panel/90 backdrop-blur-md rounded border border-border shadow-2xl overflow-hidden">
      <div className="bg-panel border-b border-border px-3 py-2 flex items-center justify-between">
        <h3 className="text-xs font-display font-bold text-accent tracking-widest">WAR ROOM LOG</h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-muted"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px] custom-scrollbar">
        {logs.length === 0 ? (
          <div className="text-muted italic">System initialized. Awaiting tactical data...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left duration-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              <span className="text-muted/80 whitespace-nowrap font-bold">[{log.day.toString().padStart(3, '0')}]</span>
              <span className={`${
                log.type === 'player' ? 'text-player brightness-150' : 
                log.type === 'enemy' ? 'text-enemy brightness-150' : 
                log.type === 'accent' ? 'text-accent brightness-125' : 
                log.type === 'danger' ? 'text-danger brightness-150' : 'text-slate-100'
              } font-bold`}>
                {log.msg}
              </span>
            </div>
          ))
        )}
      </div>
      
      <div className="bg-black/20 px-3 py-1 text-[8px] text-muted flex justify-between border-t border-border/50">
        <span>ENCRYPTION: AES-256</span>
        <span>STATUS: ACTIVE</span>
      </div>
    </div>
  );
};

export default WarRoomLog;
