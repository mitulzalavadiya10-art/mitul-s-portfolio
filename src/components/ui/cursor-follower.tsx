"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isMoving, setIsMoving] = useState(false);

  // Smooth mouse coordinates tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-fidelity spring for premium responsiveness
  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let timeoutId: number | undefined;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      
      setIsMoving(true);
      if (timeoutId) window.clearTimeout(timeoutId);
      
      timeoutId = window.setTimeout(() => {
        setIsMoving(false);
      }, 1000);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsMoving(false);
      if (timeoutId) window.clearTimeout(timeoutId);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over clickable elements
      const interactiveEl =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button";

      if (interactiveEl) {
        setIsHovered(true);
        // Custom text depending on element type
        const textAttr = target.getAttribute("data-cursor-text") || "";
        if (textAttr) {
          setHoverText(textAttr);
        } else if (target.closest("a")?.href.includes("apps.shopify.com")) {
          setHoverText("INSTALL");
        } else if (target.closest("#app-showcase") || target.closest("#-showcase")) {
          setHoverText("VIEW");
        } else {
          setHoverText("");
        }
      } else {
        setIsHovered(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center backdrop-blur-[1px]"
      style={{
        x: cursorX,
        y: cursorY,
        width: 24,
        height: 24,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: !isMoving ? 0 : (isHovered ? 1.4 : 1),
        opacity: !isMoving ? 0 : (isHovered ? 0.95 : 0.6),
        backgroundColor: isHovered ? "rgba(16, 185, 129, 0.12)" : "rgba(24, 24, 27, 0.15)",
        borderColor: isHovered ? "rgba(16, 185, 129, 0.85)" : "rgba(161, 161, 170, 0.6)",
        borderWidth: isHovered ? 2 : 1.5,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 25,
        mass: 0.4,
      }}
    >
      {/* Tiny inner center dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
          isHovered ? "bg-emerald-500" : "bg-zinc-700 dark:bg-zinc-200"
        }`}
      />
      {/* Tiny descriptive text rendered inside cursor when hover text is provided */}
      {isHovered && hoverText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-6 text-[9px] font-bold tracking-widest text-emerald-400 bg-zinc-950/90 px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase select-none font-mono whitespace-nowrap"
        >
          {hoverText}
        </motion.span>
      )}
    </motion.div>
  );
}
