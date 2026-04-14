import React from "react";

interface GameOverOverlayProps {
    won: boolean;
    onRestart: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ won, onRestart }) => {
    return (
        <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm z-[4000] flex items-center justify-center">
            <div className="text-center p-8 bg-panel border-y border-border w-full">
                <h2 className={`font-display font-bold text-5xl mb-4 ${won ? 'text-accent' : 'text-danger'}`}>
                    {won ? "VICTORY" : "DEFEAT"}
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto font-mono">
                    {won 
                        ? "Enemy forces have been neutralized. Strategic dominance achieved."
                        : "Your forces have been overwhelmed. Strategic failure."}
                </p>
                <button
                    onClick={onRestart}
                    className="btn-action px-8 py-3 bg-accent text-bg font-display font-bold rounded hover:bg-accent/80 transition-shadow shadow-[0_0_20px_rgba(0,212,170,0.3)]"
                >
                    RESTART MISSION
                </button>
            </div>
        </div>
    );
};

export default GameOverOverlay;
