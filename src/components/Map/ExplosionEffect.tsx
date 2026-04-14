import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

interface Explosion {
  id: string;
  lat: number;
  lng: number;
}

const ExplosionMarker = ({ lat, lng }: { lat: number, lng: number }) => {
  const icon = L.divIcon({
    className: "explosion-marker",
    html: `
        <div class="explosion-container">
            <svg viewBox="0 0 100 100" class="explosion-svg">
              <!-- Outer Red Spikes -->
              <path d="M50 5 L60 35 L95 20 L80 45 L100 65 L75 70 L80 95 L55 80 L45 95 L30 75 L5 85 L20 60 L0 35 L30 35 L15 5 L45 25 Z" fill="#ff0000" />
              <!-- Middle Orange Spikes -->
              <path d="M50 20 L58 40 L85 35 L75 50 L90 65 L70 65 L72 85 L55 75 L45 85 L35 70 L15 75 L25 55 L10 40 L35 45 L25 20 L45 35 Z" fill="#ff7000" />
              <!-- Inner Yellow Spikes -->
              <path d="M50 35 L55 45 L75 45 L65 55 L75 70 L55 65 L50 80 L45 65 L25 70 L35 55 L25 45 L45 45 Z" fill="#ffff00" />
              <!-- Center Black Dot -->
              <circle cx="50" cy="50" r="4" fill="black" />
            </svg>
            <div class="explosion-smoke"></div>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <Marker position={[lat, lng]} icon={icon} interactive={false} />
  );
};

interface ExplosionEffectProps {
  explosions: Explosion[];
}

const ExplosionEffect: React.FC<ExplosionEffectProps> = ({ explosions }) => {
  return (
    <>
      {explosions.map((exp) => (
        <ExplosionMarker key={exp.id} lat={exp.lat} lng={exp.lng} />
      ))}
    </>
  );
};

export default ExplosionEffect;
