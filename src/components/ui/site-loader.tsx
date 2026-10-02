"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";

export interface SiteLoaderProps {
  onComplete: () => void;
}

const BRAND = "MITUL";

/**
 * 3D Celestial Lunar Particle Sphere
 * Pure Monochrome (Deep Black & Diamond White)
 * 4,500 starlight particles in Fibonacci spherical distribution + ambient cosmic dust.
 * Reacts with fluid inertia to cursor movement.
 */
function LunarParticleSphereCanvas({
  mouseRef,
  exitRef,
  progressRef,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  exitRef: React.RefObject<{ v: number }>;
  progressRef: React.RefObject<{ v: number }>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Generate Fibonacci Sphere Particles ─────────────────────
    const SPHERE_COUNT = 3800;
    const AMBIENT_COUNT = 900;
    const TOTAL = SPHERE_COUNT + AMBIENT_COUNT;

    const positions = new Float32Array(TOTAL * 3);
    const originalPos = new Float32Array(TOTAL * 3);
    const colors = new Float32Array(TOTAL * 3);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    // 1. Core Sphere
    for (let i = 0; i < SPHERE_COUNT; i++) {
      const idx = i * 3;
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / SPHERE_COUNT);

      // Subtle natural lunar radius jitter
      const radius = 1.45 + (Math.random() - 0.5) * 0.08;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      originalPos[idx] = x;
      originalPos[idx + 1] = y;
      originalPos[idx + 2] = z;

      // Pure monochrome starlight gradient (white to silver)
      const brightness = 0.55 + Math.random() * 0.45;
      colors[idx] = brightness;
      colors[idx + 1] = brightness;
      colors[idx + 2] = brightness;
    }

    // 2. Surrounding Ethereal Space Dust
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const idx = (SPHERE_COUNT + i) * 3;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.7 + Math.cbrt(Math.random()) * 1.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      originalPos[idx] = x;
      originalPos[idx + 1] = y;
      originalPos[idx + 2] = z;

      const brightness = 0.25 + Math.random() * 0.4;
      colors[idx] = brightness;
      colors[idx + 1] = brightness;
      colors[idx + 2] = brightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Anti-aliased soft circular particle texture
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.3, "rgba(255,255,255,0.85)");
        grad.addColorStop(0.7, "rgba(255,255,255,0.2)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    const particleTexture = createCircleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const spherePoints = new THREE.Points(geometry, material);
    scene.add(spherePoints);

    let rafId = 0;
    const clock = new THREE.Clock();
    let currentTiltX = 0;
    let currentTiltY = 0;

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const mx = mouseRef.current?.x ?? 0;
      const my = mouseRef.current?.y ?? 0;
      const exit = exitRef.current?.v ?? 0;
      const progress = (progressRef.current?.v ?? 0) / 100;

      // Smooth cursor parallax tracking
      currentTiltX += (mx - currentTiltX) * 0.05;
      currentTiltY += (my - currentTiltY) * 0.05;

      camera.position.x = currentTiltX * 0.7;
      camera.position.y = -currentTiltY * 0.5;
      camera.lookAt(0, 0, 0);

      // Continuous cosmic orbit rotation (speeds up slightly as progress advances)
      const rotSpeed = 0.12 + progress * 0.18 + exit * 1.5;
      spherePoints.rotation.y += delta * rotSpeed;
      spherePoints.rotation.x = Math.sin(elapsed * 0.25) * 0.08 + currentTiltY * 0.15;

      // Hyperspace camera plunge & supernova particle dispersion on exit
      if (exit > 0) {
        camera.position.z = 3.8 - exit * 2.8;
        const scale = 1 + exit * 4.2;
        spherePoints.scale.set(scale, scale, scale);
        material.opacity = Math.max(0, 0.88 * (1 - exit * 0.95));
        spherePoints.rotation.y += delta * (rotSpeed + exit * 6.0);
      } else {
        camera.position.z = 3.8;
        // Subtle rhythmic cosmic breathing
        const breathe = 1 + Math.sin(elapsed * 1.6) * 0.02;
        spherePoints.scale.set(breathe, breathe, breathe);
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      mount.innerHTML = "";
    };
  }, [mouseRef, exitRef, progressRef]);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

export function SiteLoader({ onComplete }: SiteLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [pct, setPct] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const exitProgress = useRef({ v: 0 });
  const loadProgress = useRef({ v: 0 });
  const exitTriggered = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finish = useCallback(() => {
    setVisible(false);
    document.body.style.overflow = "";
    onCompleteRef.current();
  }, []);

  // ── Multi-Stage 100% Completion & Exit Sequence ─────────────
  const runExit = useCallback(() => {
    if (exitTriggered.current) return;
    exitTriggered.current = true;
    setExiting(true);
    setPct(100);
    loadProgress.current.v = 100;

    const tl = gsap.timeline({
      onComplete: finish,
    });

    // 1. 100% Strike Flash: numeric counter pulses and glows
    tl.to(".hud-counter-num", {
      scale: 1.25,
      color: "#ffffff",
      duration: 0.22,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

    // 2. Hyperspace Warp: camera dives into 3D particle sphere
    tl.to(
      exitProgress.current,
      {
        v: 1,
        duration: 1.15,
        ease: "power3.inOut",
      },
      0.08
    );

    // 3. Cinematic Brand Warp: KLENZO expands forward into camera
    tl.to(
      ".brand-letter",
      {
        scale: 1.35,
        letterSpacing: "0.45em",
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.03,
        duration: 0.85,
        ease: "power3.in",
      },
      0.15
    );

    // 4. Subtle lift and fade for peripheral UI
    tl.to(
      ".fade-meta, .hud-element",
      {
        opacity: 0,
        y: -18,
        duration: 0.45,
        ease: "power2.in",
      },
      0.1
    );

    // 5. Circular Iris Singularity: screen collapses to center point, unveiling the homepage
    tl.to(
      containerRef.current,
      {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1.05,
        ease: "power4.inOut",
      },
      0.2
    );
  }, [finish]);

  const skipIntro = useCallback(() => {
    if (!canSkip || exitTriggered.current) return;
    runExit();
  }, [canSkip, runExit]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";

    const skipTimer = window.setTimeout(() => setCanSkip(true), reducedMotion ? 200 : 500);

    // Smooth counter from 0 to 100% over 3.8s
    const pctObj = { v: 0 };
    const counterTween = gsap.to(pctObj, {
      v: 100,
      duration: reducedMotion ? 0.8 : 3.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.round(pctObj.v);
        setPct(val);
        loadProgress.current.v = val;
      },
      onComplete: runExit,
    });

    // Clean typography entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hud-element",
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.1 }
      );

      gsap.fromTo(
        ".brand-letter",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.07,
          ease: "power4.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        ".fade-meta",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.45 }
      );
    }, containerRef);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        skipIntro();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      ctx.revert();
      counterTween.kill();
      clearTimeout(skipTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [runExit, skipIntro]);

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label={`Loading, ${pct} percent`}
      onPointerMove={onPointerMove}
      onClick={skipIntro}
      style={{ clipPath: "circle(150% at 50% 50%)" }}
      className={`fixed inset-0 z-[99999] overflow-hidden bg-black text-white select-none cursor-pointer ${
        exiting ? "pointer-events-none" : ""
      }`}
    >
      {/* ── 3D Lunar Particle Sphere Canvas ────────────────────── */}
      <LunarParticleSphereCanvas
        mouseRef={mouseRef}
        exitRef={exitProgress}
        progressRef={loadProgress}
      />

      {/* ── Seamless Foreground Editorial Interface ────────────── */}
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col justify-between min-h-[100svh] px-6 sm:px-12 py-8 pointer-events-none"
      >
        {/* Top Header: Clean Skip Button + Architectural Counter */}
        <header className="flex items-start justify-between w-full">
          <div className="hud-element pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                skipIntro();
              }}
              className={`text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 py-1 ${
                canSkip && !exiting ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <span>ENTER</span>
              <span className="text-zinc-400">↵</span>
            </button>
          </div>

          {/* Precision Architectural Numeric Counter */}
          <div className="hud-element font-mono text-right">
            <p className="hud-counter-num text-3xl sm:text-4xl font-extralight tracking-[0.14em] text-white tabular-nums inline-block">
              {pct.toString().padStart(3, "0")}
            </p>
            <p className="text-[9px] uppercase tracking-[0.45em] text-zinc-500 mt-0.5">
              PERCENT
            </p>
          </div>
        </header>

        {/* Center: Iconic KLENZO Typography + Razor Progress Rail */}
        <main className="flex flex-col items-center justify-center my-auto text-center px-4">
          {/* Main Brand Title with Clean Clip-Mask Reveal (NO boxes, NO blur filters) */}
          <div className="overflow-hidden py-2">
            <h1 className="flex items-center justify-center tracking-[0.24em] sm:tracking-[0.32em] text-white font-black pl-3 sm:pl-4 select-none">
              {BRAND.split("").map((letter, i) => (
                <span
                  key={i}
                  className="brand-letter inline-block text-white"
                  style={{
                    fontSize: "clamp(3.8rem, 14vw, 8.8rem)",
                    lineHeight: 1,
                    fontFamily:
                      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>

          {/* Minimalist Subtitle */}
          <div className="fade-meta flex flex-col items-center mt-4">
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.42em] text-zinc-400">
              CRAFTED BY MITUL ZALAVADIYA
            </p>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.38em] text-zinc-500 mt-1">
              PORTFOLIO 2026
            </p>
          </div>

          {/* Sleek 1px White Progress Rail */}
          <div className="fade-meta mt-10 w-full max-w-[220px] sm:max-w-[280px]">
            <div className="relative w-full h-[1px] bg-white/[0.15] overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 bg-white transition-all duration-100 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </main>

        {/* Bottom Status Row */}
        <footer className="fade-meta flex items-center justify-between w-full font-mono text-[10px] tracking-[0.3em] text-zinc-500">
          <div className="hidden sm:block uppercase">
            SHOPIFY APPS · 3D STOREFRONTS · LIQUID OS
          </div>

          <div className="w-full sm:w-auto text-center sm:text-right">
            <span className="text-zinc-500 hover:text-zinc-300 transition-colors">
              CLICK ANYWHERE OR PRESS <kbd className="text-zinc-300 font-semibold">SPACE</kbd>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SiteLoader;
