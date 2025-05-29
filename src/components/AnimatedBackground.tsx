// src/components/AnimatedBackground.tsx
// Enhanced animated background with more shapes, parallax, and subtle effects

import React from "react";
import { motion } from "framer-motion";

// Array of shape definitions for the animated background
const shapes = [
  // Main accent shapes
  {
    size: 180,
    color: "linear-gradient(135deg, #6366f1 0%, #f59e42 100%)",
    top: "8%",
    left: "5%",
    delay: 0,
    duration: 12,
    blur: 2,
    opacity: 0.18,
    rotate: 0,
  },
  {
    size: 120,
    color: "linear-gradient(135deg, #10b981 0%, #818cf8 100%)",
    top: "70%",
    left: "12%",
    delay: 1.2,
    duration: 14,
    blur: 2,
    opacity: 0.18,
    rotate: 0,
  },
  {
    size: 220,
    color: "linear-gradient(135deg, #f59e42 0%, #6366f1 100%)",
    top: "60%",
    left: "80%",
    delay: 0.7,
    duration: 16,
    blur: 2,
    opacity: 0.18,
    rotate: 0,
  },
  {
    size: 90,
    color: "linear-gradient(135deg, #ef4444 0%, #6366f1 100%)",
    top: "30%",
    left: "85%",
    delay: 2,
    duration: 10,
    blur: 2,
    opacity: 0.18,
    rotate: 0,
  },
  // Subtle background orbs
  {
    size: 300,
    color: "linear-gradient(135deg, #818cf8 0%, #f472b6 100%)",
    top: "50%",
    left: "40%",
    delay: 0.5,
    duration: 22,
    blur: 8,
    opacity: 0.10,
    rotate: 0,
  },
  {
    size: 160,
    color: "linear-gradient(135deg, #f59e42 0%, #10b981 100%)",
    top: "20%",
    left: "60%",
    delay: 1.5,
    duration: 18,
    blur: 4,
    opacity: 0.13,
    rotate: 0,
  },
  {
    size: 110,
    color: "linear-gradient(135deg, #6366f1 0%, #f472b6 100%)",
    top: "80%",
    left: "70%",
    delay: 2.3,
    duration: 13,
    blur: 2,
    opacity: 0.15,
    rotate: 0,
  },
  {
    size: 70,
    color: "linear-gradient(135deg, #f59e42 0%, #ef4444 100%)",
    top: "10%",
    left: "75%",
    delay: 0.9,
    duration: 11,
    blur: 2,
    opacity: 0.16,
    rotate: 0,
  },
  // Parallax "glow" shapes
  {
    size: 400,
    color: "radial-gradient(circle at 30% 30%, #818cf8 0%, transparent 80%)",
    top: "60%",
    left: "10%",
    delay: 0,
    duration: 40,
    blur: 24,
    opacity: 0.08,
    rotate: 0,
  },
  {
    size: 350,
    color: "radial-gradient(circle at 70% 70%, #f59e42 0%, transparent 80%)",
    top: "10%",
    left: "60%",
    delay: 0,
    duration: 38,
    blur: 20,
    opacity: 0.07,
    rotate: 0,
  },
];

// Animation variants for floating and rotating shapes
const floatAnim = {
  animate: (i: number) => ({
    y: [0, -30, 0, 30, 0], // Vertical floating
    x: [0, 20, 0, -20, 0], // Horizontal floating
    rotate: [0, 10, 0, -10, 0], // Subtle rotation
    transition: {
      repeat: Infinity,
      duration: shapes[i].duration,
      delay: shapes[i].delay,
      ease: "easeInOut",
    },
  }),
};

// Custom hook for tracking mouse position and calculating parallax offset
const useParallax = () => {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const handle = (e: MouseEvent) => {
      // Normalize mouse position to range [-1, 1]
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return offset;
};

// Main animated background component
const AnimatedBackground: React.FC = () => {
  const parallax = useParallax();
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden
    >
      {/* Render all animated shapes */}
      {shapes.map((shape, i) => {
        // Parallax intensity: closer shapes move more
        const parallaxIntensity = i < 4 ? 30 : i < 8 ? 15 : 8;
        return (
          <motion.div
            key={i}
            custom={i}
            animate="animate"
            variants={floatAnim}
            style={{
              position: "absolute",
              top: shape.top,
              left: shape.left,
              width: shape.size,
              height: shape.size,
              background: shape.color,
              borderRadius: "50%",
              opacity: shape.opacity,
              filter: `blur(${shape.blur}px)`,
              zIndex: 0,
              willChange: "transform",
              mixBlendMode: "lighten",
              // Apply parallax transform based on mouse movement
              transform: `translate3d(${parallax.x * parallaxIntensity}px, ${parallax.y * parallaxIntensity}px, 0)`,
              boxShadow:
                i < 4
                  ? "0 8px 32px 0 rgba(99,102,241,0.12)"
                  : undefined,
            }}
          />
        );
      })}
      {/* Optional: subtle animated gradient overlay for extra depth */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(120deg, rgba(245,158,66,0.04) 0%, rgba(99,102,241,0.04) 100%)",
          mixBlendMode: "screen",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;