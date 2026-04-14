import React from "react";
import { TileLayer, ZoomControl, Polygon, Marker } from "react-leaflet";
import type { Target } from "../../types/game";
import { createTargetIcon } from "./TargetMarker";
import AttackTrajectory from "./AttackTrajectory";
import ExplosionEffect from "./ExplosionEffect";

interface MapViewProps {
  playerTargets: Target[];
  enemyTargets: Target[];
  activeAttacks: any[];
  activeExplosions: any[];
  onTargetClick: (target: Target) => void;
}

const MapView: React.FC<MapViewProps> = ({ playerTargets, enemyTargets, activeAttacks, activeExplosions, onTargetClick }) => {
  return (
    <>
      <AttackTrajectory attacks={activeAttacks} />
      <ExplosionEffect explosions={activeExplosions} />
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
      />
      <ZoomControl position="bottomright" />

      {/* Markers */}
      {playerTargets.map(t => (
        <Marker key={t.id} position={[t.lat, t.lng]} icon={createTargetIcon(t)} />
      ))}
      {enemyTargets.map(t => (
        <Marker 
          key={t.id} 
          position={[t.lat, t.lng]} 
          icon={createTargetIcon(t)} 
          eventHandlers={{ click: () => onTargetClick(t) }}
        />
      ))}
    </>
  );
};

export default MapView;
