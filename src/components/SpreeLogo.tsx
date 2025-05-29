import React from "react";
import { motion } from "framer-motion";

// Redesigned Spree Logo: E-commerce vibes, color theory applied
const SpreeLogo: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: "block",
      filter: "drop-shadow(0 6px 24px rgba(34,197,94,0.18))",
      background: "linear-gradient(135deg, #f0fdfa 0%, #fef9c3 100%)",
      borderRadius: "18px",
    }}
    initial={{ rotateY: -30, scale: 0.7, opacity: 0 }}
    animate={{
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: { type: "spring", duration: 1.2, bounce: 0.4 },
    }}
  >
    {/* S Shape: Green to Blue, symbolizing trust & growth */}
    <motion.path
      d="M35 40 Q35 25 60 25 Q85 25 85 40 Q85 55 60 55 Q35 55 35 70 Q35 85 60 85 Q85 85 85 70"
      stroke="url(#sGradientEcom)"
      strokeWidth="12"
      strokeLinecap="round"
      fill="none"
      filter="url(#sShadowEcom)"
      initial={{ pathLength: 0, filter: "blur(2px)" }}
      // FIX: Only two keyframes for filter
      animate={{
        pathLength: 1,
        filter: ["blur(2px)", "drop-shadow(0 0 12px #34d399)"],
      }}
      transition={{
        duration: 1.2,
        delay: 0.1,
        type: "spring",
        bounce: 0.5,
      }}
    />
    {/* Dot: Yellow/Gold, symbolizing value */}
    <motion.ellipse
      cx="100"
      cy="38"
      rx="7"
      ry="5"
      fill="url(#dotGradientEcom)"
      filter="url(#dotShadowEcom)"
      initial={{ scale: 0, opacity: 0, cy: 30 }}
      // FIX: Only two keyframes for filter
      animate={{
        scale: [0, 1],
        opacity: [0, 1],
        cy: [30, 38],
        filter: ["blur(2px)", "drop-shadow(0 0 10px #fde047)"],
      }}
      transition={{
        delay: 1,
        duration: 0.7,
        type: "spring",
        bounce: 0.7,
      }}
    />
    {/* Sparkle: Blue, trust & digital */}
    <motion.g
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{
        scale: [0, 1],
        opacity: [0, 1],
        rotate: [0, 0],
      }}
      transition={{ delay: 1.4, duration: 1, type: "tween" }}
    >
      <ellipse
        cx="25"
        cy="25"
        rx="4"
        ry="4"
        fill="url(#sparkleGradientEcom)"
        filter="url(#sparkleShadowEcom)"
      />
      <rect
        x="24.5"
        y="19"
        width="1"
        height="12"
        rx="0.5"
        fill="#38bdf8"
        opacity="0.7"
      />
      <rect
        x="19"
        y="24.5"
        width="12"
        height="1"
        rx="0.5"
        fill="#38bdf8"
        opacity="0.7"
      />
    </motion.g>
    {/* Floating Orbs: Green & Blue, commerce & trust */}
    <motion.circle
      cx="18"
      cy="90"
      r="5"
      fill="url(#orb1GradientEcom)"
      initial={{ opacity: 0, cy: 100, scale: 0.7 }}
      animate={{
        opacity: [0, 1],
        cy: [100, 88],
        scale: [0.7, 1],
      }}
      transition={{ delay: 1.6, duration: 1.1, type: "spring" }}
      filter="url(#orbShadowEcom)"
    />
    <motion.circle
      cx="105"
      cy="80"
      r="3"
      fill="url(#orb2GradientEcom)"
      initial={{ opacity: 0, cy: 90, scale: 0.5 }}
      animate={{
        opacity: [0, 1],
        cy: [90, 78],
        scale: [0.5, 1],
      }}
      transition={{ delay: 1.9, duration: 1, type: "spring" }}
      filter="url(#orbShadowEcom)"
    />
    {/* "Spree" text: Blue to Green, modern e-commerce */}
    <g>
      <motion.text
        x="60"
        y="110"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Segoe UI', Arial, sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="url(#textGradientEcom)"
        filter="url(#textShadowEcom)"
        initial={{ opacity: 0, y: 20, letterSpacing: 0 }}
        animate={{
          opacity: 1,
          y: 0,
          letterSpacing: 2,
        }}
        transition={{ delay: 2, duration: 1, type: "spring" }}
        style={{
          textShadow:
            "0 4px 0 #bdbdbd, 0 8px 18px rgba(34,197,94,0.14), 0 0 8px #34d399",
          paintOrder: "stroke fill",
        }}
      >
        Spree
      </motion.text>
      {/* Shimmer overlay */}
      {/* (No animation for shimmer to avoid filter keyframe errors) */}
      {/* Extrusion */}
      <text
        x="60"
        y="113"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Segoe UI', Arial, sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="#38bdf8"
        opacity="0.18"
        style={{
          filter: "blur(2px)",
        }}
      >
        Spree
      </text>
    </g>
    {/* Gradients and shadows */}
    <defs>
      {/* S gradient: Green to Blue */}
      <linearGradient id="sGradientEcom" x1="35" y1="25" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22c55e" />
        <stop offset="0.5" stopColor="#38bdf8" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
      {/* Dot gradient: Gold */}
      <radialGradient id="dotGradientEcom" cx="100" cy="38" r="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#fbbf24" />
      </radialGradient>
      {/* Sparkle gradient: Blue */}
      <radialGradient id="sparkleGradientEcom" cx="25" cy="25" r="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#2563eb" />
      </radialGradient>
      {/* Orbs gradients */}
      <radialGradient id="orb1GradientEcom" cx="18" cy="90" r="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22c55e" />
        <stop offset="1" stopColor="#bbf7d0" />
      </radialGradient>
      <radialGradient id="orb2GradientEcom" cx="105" cy="80" r="6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#bae6fd" />
      </radialGradient>
      {/* Text gradient: Blue to Green */}
      <linearGradient id="textGradientEcom" x1="40" y1="110" x2="80" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563eb" />
        <stop offset="0.5" stopColor="#38bdf8" />
        <stop offset="1" stopColor="#22c55e" />
      </linearGradient>
      {/* Shimmer gradient */}
      <linearGradient id="shimmerGradientEcom" x1="30" y1="104" x2="90" y2="104" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff" stopOpacity="0" />
        <stop offset="50%" stopColor="#fff" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {/* Shadows */}
      <filter id="sShadowEcom" x="0" y="0" width="120" height="120">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#22c55e" floodOpacity="0.18" />
      </filter>
      <filter id="dotShadowEcom" x="90" y="30" width="20" height="20">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#fde047" floodOpacity="0.18" />
      </filter>
      <filter id="sparkleShadowEcom" x="20" y="20" width="12" height="12">
        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.18" />
      </filter>
      <filter id="textShadowEcom" x="40" y="100" width="40" height="20">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.18" />
      </filter>
      <filter id="orbShadowEcom" x="0" y="0" width="120" height="120">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#22c55e" floodOpacity="0.12" />
      </filter>
    </defs>
  </motion.svg>
);

export default SpreeLogo;