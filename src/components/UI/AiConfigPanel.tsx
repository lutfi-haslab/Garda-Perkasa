import React from "react";
import type { AiEngineType } from "../../types/game";

interface AiConfigPanelProps {
    engine: AiEngineType;
    apiKey: string;
    onEngineChange: (engine: AiEngineType) => void;
    onApiKeyChange: (key: string) => void;
    onClose: () => void;
}

const AiConfigPanel: React.FC<AiConfigPanelProps> = ({ engine, apiKey, onEngineChange, onApiKeyChange, onClose }) => {
    return (
        <div className="absolute top-0 right-0 m-4 w-72 bg-panel/95 border border-border rounded-lg p-4 z-[3000] shadow-2xl backdrop-blur">
            <h3 className="font-display text-sm text-accent mb-4">AI CONFIGURATION</h3>
            <div className="space-y-4 font-mono">
                <div>
                    <label className="text-xs text-muted block mb-1">SELECT ENGINE</label>
                    <select 
                        value={engine} 
                        onChange={(e) => onEngineChange(e.target.value as AiEngineType)}
                        className="w-full bg-card border border-border p-2 text-xs rounded text-white"
                    >
                        <option value="deepseek">DeepSeek AI</option>
                        <option value="local">Local Intelligent Engine</option>
                    </select>
                </div>
                {engine === "deepseek" && (
                    <div>
                        <label className="text-xs text-muted block mb-1">API KEY</label>
                        <input 
                            type="password" 
                            placeholder="Enter DeepSeek API Key..."
                            value={apiKey}
                            onChange={(e) => onApiKeyChange(e.target.value)}
                            className="w-full bg-card border border-border p-2 text-xs rounded text-white"
                        />
                    </div>
                )}
                <button 
                    onClick={onClose}
                    className="w-full py-2 bg-accent/20 border border-accent text-accent text-xs rounded font-bold"
                >
                    APPLY SETTINGS
                </button>
            </div>
        </div>
    );
};

export default AiConfigPanel;
