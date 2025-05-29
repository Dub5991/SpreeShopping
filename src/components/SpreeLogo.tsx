import React from "react";

// Animated Spree Logo component
const SpreeLogo: React.FC<{ size?: number; className?: string }> = ({ size = 72, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Spree Logo"
    className={className}
    style={{
      display: "block",
      background: "linear-gradient(135deg, #f0fdfa 0%, #fef9c3 100%)",
      borderRadius: "18px",
    }}
  >
    {/* S Shape: Green to Blue, symbolizing trust & growth */}
    <path
      d="M35 40 Q35 25 60 25 Q85 25 85 40 Q85 55 60 55 Q35 55 35 70 Q35 85 60 85 Q85 85 85 70"
      stroke="url(#sGradientEcom)"
      strokeWidth="12"
      strokeLinecap="round"
      fill="none"
      filter="url(#sShadowEcom)"
    />
    {/* Dot: Yellow/Gold, symbolizing value */}
    <ellipse
      cx="100"
      cy="38"
      rx="7"
      ry="5"
      fill="url(#dotGradientEcom)"
      filter="url(#dotShadowEcom)"
    />
    {/* Sparkle: Blue, trust & digital */}
    <g>
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
    </g>
    {/* Floating Orbs: Green & Blue, commerce & trust */}
    <circle
      cx="18"
      cy="90"
      r="5"
      fill="url(#orb1GradientEcom)"
      filter="url(#orbShadowEcom)"
    />
    <circle
      cx="105"
      cy="80"
      r="3"
      fill="url(#orb2GradientEcom)"
      filter="url(#orbShadowEcom)"
    />
    {/* "Spree" text: Blue to Green, modern e-commerce */}
    <g>
      <text
        x="60"
        y="110"
        textAnchor="middle"
        fontFamily="'Montserrat', 'Segoe UI', Arial, sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="url(#textGradientEcom)"
        filter="url(#textShadowEcom)"
        letterSpacing="2"
        style={{
          textShadow:
            "0 4px 0 #bdbdbd,0 8px 18px rgba(34,197,94,0.14),0 0 8px #34d399",
          paintOrder: "stroke fill",
        }}
      >
        Spree
      </text>
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
        style={{ filter: "blur(2px)" }}
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
  </svg>
);

export default SpreeLogo;