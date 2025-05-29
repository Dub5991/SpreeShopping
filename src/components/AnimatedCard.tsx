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
      "0 2px 16px 0 rgba(99,102,241,0.18), 0 0 0 0px #f43f5e",
      "0 6px 32px 0 rgba(244,63,94,0.18), 0 0 0 6px #6366f1",
      "0 2px 16px 0 rgba(99,102,241,0.18), 0 0 0 0px #f43f5e",
    ],
    scale: [1, 1.025, 1],
    filter: [
      "brightness(1) saturate(1)",
      "brightness(1.08) saturate(1.15)",
      "brightness(1) saturate(1)",
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
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
        borderRadius: "1.5rem",
        border: "1.5px solid #6366f1",
        outline: "none",
        background: "linear-gradient(120deg, #6366f1 0%, #f43f5e 100%)",
        color: "#fff",
        padding: "1.75rem",
        boxShadow: "0 2px 16px 0 rgba(99,102,241,0.18)",
        fontWeight: 600,
        letterSpacing: "0.01em",
        fontSize: "1.1rem",
        backdropFilter: "blur(2px)",
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
          scale: 1.07,
          boxShadow: "0 10px 40px 0 rgba(99,102,241,0.28), 0 0 0 10px #f43f5e",
          background: "linear-gradient(120deg, #f43f5e 0%, #6366f1 100%)",
          filter: "brightness(1.12) saturate(1.25)",
        }}
        transition={{ duration: 0.45, ease: [0.23, 1.01, 0.32, 1] }}
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