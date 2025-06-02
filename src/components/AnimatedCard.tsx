import React, { useEffect, useMemo, forwardRef } from "react";
import { motion, useAnimation } from "framer-motion";
import clsx from "clsx";

type AnimatedCardProps = React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
  animationDuration?: number;
  tabIndex?: number;
  [key: string]: any;
}>;

const cardVariants = {
  initial: { opacity: 0, y: 32, scale: 0.97 },
  animate: {
    boxShadow: [
      "0 4px 24px 0 rgba(36,37,47,0.10), 0 0 0 0px #6366f1",
      "0 8px 32px 0 rgba(99,102,241,0.12), 0 0 0 8px #6366f1",
      "0 4px 24px 0 rgba(36,37,47,0.10), 0 0 0 0px #6366f1",
    ],
    scale: [1, 1.015, 1],
    filter: [
      "brightness(1) saturate(1)",
      "brightness(1.04) saturate(1.08)",
      "brightness(1) saturate(1)",
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1], // easeInOut
    },
  },
};

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      children,
      className = "",
      style,
      animationDuration = 2.5,
      tabIndex = 0,
      ...rest
    },
    ref
  ) => {
    const controls = useAnimation();

    useEffect(() => {
      controls.start({
        ...cardVariants.animate,
        transition: { ...cardVariants.animate?.transition, duration: animationDuration },
      });
    }, [controls, animationDuration]);

    const baseStyle = useMemo(
      () => ({
        borderRadius: "1.25rem",
        border: "1px solid #e5e7eb",
        outline: "none",
        background: "linear-gradient(120deg, #f8fafc 0%, #eef2ff 100%)",
        color: "#23263b",
        padding: "2rem 2.25rem",
        boxShadow: "0 4px 24px 0 rgba(36,37,47,0.10)",
        fontWeight: 500,
        letterSpacing: "0.01em",
        fontSize: "1.08rem",
        backdropFilter: "blur(3px)",
        transition: "box-shadow 0.5s cubic-bezier(0.42,0,0.58,1), background 0.5s cubic-bezier(0.42,0,0.58,1), filter 0.5s cubic-bezier(0.42,0,0.58,1)",
        ...(className.includes("no-outline") ? { border: "none" } : {}),
      }),
      [className]
    );

    return (
      <motion.div
        ref={ref}
        className={clsx(className, "fade-in-up")}
        role="region"
        tabIndex={tabIndex}
        initial="initial"
        animate={controls}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 12px 48px 0 rgba(99,102,241,0.16), 0 0 0 12px #eef2ff",
          background: "linear-gradient(120deg, #eef2ff 0%, #f8fafc 100%)",
          filter: "brightness(1.08) saturate(1.12)",
          transition: {
            duration: 0.7,
            ease: [0.42, 0, 0.58, 1],
          },
        }}
        transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
        style={{ ...baseStyle, ...style }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";
export default AnimatedCard;