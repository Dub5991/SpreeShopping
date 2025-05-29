import { motion, useAnimationFrame } from "framer-motion";
import React, { useState } from "react";

// Height of the wave SVG
const WAVE_HEIGHT = 60;
// Number of bumps (waves) in the path
const WAVE_BUMPS = 6;

// Generates the SVG path for the wave based on phase and width
function getWavePath(phase: number, width: number) {
  const points = [];
  // Calculate points along the wave
  for (let i = 0; i <= WAVE_BUMPS; i++) {
    const x = (i * width) / WAVE_BUMPS;
    // y is calculated using a combination of sine waves for a natural look
    const y =
      36 +
      Math.sin(phase + (i * Math.PI * 2) / WAVE_BUMPS) * 14 +
      Math.sin(phase * 1.7 + (i * Math.PI * 4) / WAVE_BUMPS) * 3;
    points.push({ x, y });
  }
  // Start the SVG path at the first point
  let d = `M${points[0].x} ${points[0].y}`;
  // Create smooth curves between points using cubic Bezier curves
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    // Control points for smoothness
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  // Close the path at the bottom of the SVG
  d += ` V${WAVE_HEIGHT} H0Z`;
  return d;
}

const HeroWave: React.FC = () => {
  // Phase controls the animation of the wave
  const [phase, setPhase] = useState(0);

  // Animate the phase using the current time for smooth motion
  useAnimationFrame((t) => {
    setPhase((t / 1000) * 1.2);
  });

  // Width of the SVG viewBox
  const WAVE_WIDTH = 1000;

  return (
    <svg
      viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
      width="100%"
      height={WAVE_HEIGHT}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: WAVE_HEIGHT,
        display: "block",
        pointerEvents: "none",
        position: "absolute",
        left: 0,
        bottom: 0,
        zIndex: 1,
      }}
      preserveAspectRatio="none"
    >
      {/* Animated wave path */}
      <motion.path
        d={getWavePath(phase, WAVE_WIDTH)}
        fill="url(#waveGradient)"
        opacity="0.85"
        filter="url(#waveBlur)"
        style={{
          transition: "opacity 0.8s cubic-bezier(.4,0,.2,1)",
        }}
      />
      <defs>
        {/* Gradient for the wave fill */}
        <linearGradient id="waveGradient" x1="0" y1="0" x2={WAVE_WIDTH} y2={WAVE_HEIGHT} gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.3" stopColor="#e0e7ff" stopOpacity="0.7" />
          <stop offset="0.7" stopColor="#c7d2fe" stopOpacity="0.5" />
          <stop offset="1" stopColor="#818cf8" stopOpacity="0.3" />
        </linearGradient>
        {/* Blur filter for a soft wave look */}
        <filter id="waveBlur" x="-10%" y="-20%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.9" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};

export default HeroWave;