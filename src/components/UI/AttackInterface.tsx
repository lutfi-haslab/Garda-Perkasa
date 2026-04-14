import React from "react";
import type { Target, PlayerState } from "../../types/game";
import { TARGET_TYPES } from "../../constants/gameConstants";

interface AttackInterfaceProps {
    selectedTarget: Target;
    playerState: PlayerState;
    onAttack: (weapon: "missile" | "drone") => void;
    onCancel: () => void;
}

const AttackInterface: React.FC<AttackInterfaceProps> = ({ selectedTarget, playerState, onAttack, onCancel }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-panel/95 backdrop-blur border border-border rounded-lg p-4 shadow-2xl z-[1000] flex items-center gap-6 animate-slideUp">
            <div className="text-center">
                <div className="text-[10px] text-muted mb-1 uppercase tracking-tighter">SELECTED TARGET</div>
                <div className="font-display font-bold text-enemy text-sm">{TARGET_TYPES[selectedTarget.type].name}</div>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex gap-2">
                <button
                    disabled={playerState.missileStock <= 0}
                    onClick={() => onAttack('missile')}
                    className="btn-action px-4 py-2 bg-danger/20 border border-danger text-danger rounded font-display text-xs hover:bg-danger/30 transition-colors disabled:opacity-30"
                >
                    🚀 MISSILE (30 DMG)
                </button>
                <button
                    disabled={playerState.droneStock <= 0}
                    onClick={() => onAttack('drone')}
                    className="btn-action px-4 py-2 bg-warning/20 border border-warning text-warning rounded font-display text-xs hover:bg-warning/30 transition-colors disabled:opacity-30"
                >
                    🛸 DRONE (10 DMG)
                </button>
            </div>
            <button
                onClick={onCancel}
                className="px-3 py-2 bg-card border border-border rounded text-muted hover:text-white text-xs"
            >
                CANCEL
            </button>
        </div>
    );
};

export default AttackInterface;
