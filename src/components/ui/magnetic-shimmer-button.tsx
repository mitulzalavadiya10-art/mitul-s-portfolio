"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface MagneticShimmerButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: string; // e.g. "emerald", "red", "purple", "white"
  badgeText?: string;
}

export function MagneticShimmerButton({
  children = "View Websites & Work",
  onClick,
  className = "",
  glowColor = "emerald",
}: MagneticShimmerButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isNear, setIsNear] = useState(false);

  // Magnetic spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 160, mass: 0.6 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  // Text parallax springs (moves slightly more for 3D depth)
  const textSpringConfig = { damping: 20, stiffness: 200, mass: 0.4 };
  const textX = useSpring(useMotionValue(0), textSpringConfig);
  const textY = useSpring(useMotionValue(0), textSpringConfig);

  // Spot highlight coordinates inside button
  const [spotPosition, setSpotPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    // Check if device supports fine mouse pointer
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
      const triggerRadius = 140; // Detection radius around button

      if (dist < triggerRadius) {
        setIsNear(true);
        // Magnetic pull toward cursor (max 18px offset)
        const pull = (1 - dist / triggerRadius);
        const offsetX = (e.clientX - btnCenterX) * 0.28 * pull;
        const offsetY = (e.clientY - btnCenterY) * 0.28 * pull;

        mouseX.set(offsetX);
        mouseY.set(offsetY);

        textX.set(offsetX * 0.5);
        textY.set(offsetY * 0.5);
      } else {
        if (isNear) setIsNear(false);
        mouseX.set(0);
        mouseY.set(0);
        textX.set(0);
        textY.set(0);
      }

      // Calculate spot coordinates when hovering directly inside button
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const spotX = ((e.clientX - rect.left) / rect.width) * 100;
        const spotY = ((e.clientY - rect.top) / rect.height) * 100;
        setSpotPosition({ x: spotX, y: spotY });
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [isNear, mouseX, mouseY, textX, textY]);

  // Glow palettes
  const glowGradients: Record<string, { border: string; ambient: string; particle: string }> = {
    emerald: {
      border: "linear-gradient(90deg, #10b981, #34d399, #059669, #10b981)",
      ambient: "rgba(16, 185, 129, 0.4)",
      particle: "#10b981",
    },
    red: {
      border: "linear-gradient(90deg, #ef4444, #f87171, #dc2626, #ef4444)",
      ambient: "rgba(239, 68, 68, 0.45)",
      particle: "#ef4444",
    },
    white: {
      border: "linear-gradient(90deg, #ffffff, #a1a1aa, #ffffff, #71717a)",
      ambient: "rgba(255, 255, 255, 0.35)",
      particle: "#ffffff",
    },
  };

  const activeGlow = glowGradients[glowColor] || glowGradients.emerald;

  return (
    <div className="relative inline-flex items-center justify-center p-1 group">
      {/* ── Ambient Underglow Aura (Blooms smoothly on approach) ── */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-1 rounded-full blur-xl opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at center, ${activeGlow.ambient} 0%, transparent 75%)`,
          x: magneticX,
          y: magneticY,
        }}
      />

      {/* ── Main Magnetic Button Container ── */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
        style={{
          x: magneticX,
          y: magneticY,
        }}
        className={`
          relative z-10 inline-flex items-center justify-center gap-2.5
          h-13 sm:h-14 px-8 sm:px-9 rounded-full
          bg-zinc-950 text-white font-semibold text-sm sm:text-base tracking-tight
          shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]
          cursor-pointer select-none overflow-hidden
          transition-colors duration-300
          ${className}
        `}
      >
        {/* ── Traveling Border Beam (Continuous Laser Streak around perimeter) ── */}
        <span
          className="absolute -inset-[1px] rounded-full p-[1.5px] pointer-events-none overflow-hidden"
          style={{
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        >
          <span
            className="absolute inset-[-100%] rounded-full animate-[spin_3.5s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0 340deg, ${glowColor === "red" ? "#ef4444" : "#10b981"} 360deg)`,
            }}
          />
        </span>

        {/* ── Interactive Cursor Spotlight Inside Button ── */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(130px circle at ${spotPosition.x}% ${spotPosition.y}%, rgba(255, 255, 255, 0.16), transparent 75%)`,
          }}
        />

        {/* ── Glass Top Gloss Highlight ── */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/25 via-white/5 to-transparent blur-[0.5px]"
        />

        {/* ── Shimmer Sweep Wave (Glides across on hover) ── */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-45 translate-x-[-150%] transition-transform duration-1000 ease-out group-hover:translate-x-[150%]"
        />

        {/* ── Parallax Button Content (Text + Animated Icon) ── */}
        <motion.span
          style={{
            x: textX,
            y: textY,
          }}
          className="relative z-10 inline-flex items-center gap-2.5 font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle glowing sparkles badge icon */}
          <Sparkles className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-12 ${
            glowColor === "red" ? "text-red-400" : "text-emerald-400"
          }`} />

          <span>{children}</span>

          {/* Animated Interactive Diagonal Arrow */}
          <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-inner">
            <ArrowUpRight className="w-3.5 h-3.5 text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" />
          </span>
        </motion.span>
      </motion.button>
    </div>
  );
}

export default MagneticShimmerButton;

