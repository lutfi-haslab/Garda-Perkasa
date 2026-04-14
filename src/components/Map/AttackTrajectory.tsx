import React, { useState, useEffect } from "react";
import { Polyline, Marker } from "react-leaflet";
import L from "leaflet";

interface Attack {
  id: string;
  from: [number, number];
  to: [number, number];
  type: "missile" | "drone";
}

const Projectile = ({ from, to, type }: { from: [number, number], to: [number, number], type: "missile" | "drone" }) => {
  const [pos, setPos] = useState<[number, number]>(from);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Calculate initial rotation
    const angle = (Math.atan2(to[0] - from[0], to[1] - from[1]) * 180) / Math.PI;
    setRotation(90 - angle); // Adjust for SVG orientation

    let startTime: number;
    const duration = 1500;

    const animate = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const p = Math.min(elapsed / duration, 1);
        
        setProgress(p);

        let lat = from[0] + (to[0] - from[0]) * p;
        const lng = from[1] + (to[1] - from[1]) * p;

        if (type === "missile") {
            const arcHeight = 2.0; 
            lat += Math.sin(p * Math.PI) * arcHeight;
        }

        setPos([lat, lng]);

        if (p < 1) {
            requestAnimationFrame(animate);
        }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [from, to, type]);

  const color = type === "missile" ? "#ff3d3d" : "#ffb800";
  const iconHtml = type === "missile" 
    ? `<svg viewBox="0 0 24 24" fill="${color}" style="transform: rotate(${rotation}deg); filter: drop-shadow(0 0 5px ${color})">
         <!-- Realistic Ballistic Missile -->
         <path d="M12 2L10 6V18L8 20V22H16V20L14 18V6L12 2Z" />
         <path d="M10 14L8 16V18H10V14ZM14 14L16 16V18H14V14Z" opacity="0.8" />
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="${color}" style="transform: rotate(${rotation}deg); filter: drop-shadow(0 0 5px ${color})">
         <!-- Realistic Fixed-Wing Drone (Reaper style) -->
         <path d="M12 4L11 8H2L3 10H11L12 12L13 10H21L22 8H13L12 4Z" />
         <path d="M11 12L10 16L9 16L10 18H14L15 16L14 16L13 12Z" opacity="0.8" />
         <path d="M11 18L10 21H14L13 18Z" opacity="0.6" />
       </svg>`;

  const icon = L.divIcon({
    className: "projectile-icon",
    html: iconHtml,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <>
        <Polyline 
            positions={[from, to]} 
            pathOptions={{ 
                color, 
                weight: 1, 
                dashArray: "5, 10",
                opacity: 0.3 
            }} 
        />
        {progress < 1 && (
            <Marker position={pos} icon={icon} interactive={false} />
        )}
    </>
  );
};

interface AttackTrajectoryProps {
  attacks: Attack[];
}

const AttackTrajectory: React.FC<AttackTrajectoryProps> = ({ attacks }) => {
  return (
    <>
      {attacks.map((attack) => (
        <Projectile key={attack.id} from={attack.from} to={attack.to} type={attack.type} />
      ))}
    </>
  );
};

export default AttackTrajectory;
