import L from "leaflet";
import type { Target } from "../../types/game";
import { TARGET_TYPES } from "../../constants/gameConstants";

export const createTargetIcon = (target: Target) => {
  const typeInfo = TARGET_TYPES[target.type];
  const sideClass = target.side === "player" ? "player" : "enemy";
  const sideColor = target.side === "player" ? "#00b8d4" : "#ff6b35";
  const destroyedClass = target.hp <= 0 ? "destroyed" : "";

  const html = `
    <div class="target-marker-tactical ${sideClass} ${destroyedClass}" style="color: ${sideColor}">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            ${typeInfo.svg}
        </svg>
        <div class="hp-bar-minimal">
            <div class="hp-bar-fill" style="width: ${target.hp}%; background: ${target.hp > 50 ? "#00d4aa" : target.hp > 25 ? "#ffb800" : "#ff3d3d"}"></div>
        </div>
    </div>
  `;

  return L.divIcon({
    className: "custom-marker-tactical",
    html,
    iconSize: [32, 40],
    iconAnchor: [16, 20],
  });
};
