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
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        width: 20,
        height: 20,
        backgroundColor: "white",
        // Position offset to center the element on cursor point
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: !isMoving ? 0 : (isHovered ? 3.5 : 1),
        opacity: !isMoving ? 0 : 1,
        // When hovered, the circle turns outline or filled to invert colors underneath
        backgroundColor: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 1)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
        mass: 0.5,
      }}
    >
      {/* Tiny descriptive text rendered inside inverting cursor */}
      {isHovered && hoverText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[3px] font-black tracking-widest text-black uppercase select-none font-mono"
        >
          {hoverText}
        </motion.span>
      )}
    </motion.div>
  );
}
