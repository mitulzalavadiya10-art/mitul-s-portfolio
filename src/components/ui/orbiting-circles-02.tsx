"use client"

import React from "react"
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear"

interface IconDef {
  src: string
  alt: string
  angle: number
}

interface OrbitConfig {
  smSize: number   // diameter px — mobile
  mdSize: number   // diameter px — desktop (md+)
  duration: number
  cw: boolean
  icons: IconDef[]
}

// ─── Tech icons via simpleicons CDN (already used in this project) ───────────
const ORBITS: OrbitConfig[] = [
  {
    smSize: 360,
    mdSize: 520,
    duration: 20,
    cw: true,
    icons: [
      { src: "https://cdn.simpleicons.org/shopify/96bf48",        alt: "Shopify",        angle: -60  },
      { src: "https://cdn.simpleicons.org/googlegemini/8E75B2",   alt: "Google Gemini",  angle:  60  },
      { src: "https://cdn.simpleicons.org/supabase/3ECF8E",       alt: "Supabase",       angle: 180  },
    ],
  },
  {
    smSize: 460,
    mdSize: 660,
    duration: 27,
    cw: false,
    icons: [
      { src: "https://cdn.simpleicons.org/react/61DAFB",          alt: "React",          angle:  30  },
      { src: "https://cdn.simpleicons.org/tailwindcss/06B6D4",    alt: "Tailwind CSS",   angle: 210  },
    ],
  },
  {
    smSize: 560,
    mdSize: 800,
    duration: 35,
    cw: true,
    icons: [
      { src: "https://cdn.simpleicons.org/typescript/3178C6",     alt: "TypeScript",     angle: -60  },
      { src: "https://cdn.simpleicons.org/figma/F24E1E",          alt: "Figma",          angle:  60  },
      { src: "https://cdn.simpleicons.org/stripe/635BFF",         alt: "Stripe",         angle: 180  },
    ],
  },
]

// ─── CSS keyframes injected once ─────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes orb-cw  { from { transform: rotate(var(--sa)); } to { transform: rotate(calc(var(--sa) + 360deg)); } }
  @keyframes orb-ccw { from { transform: rotate(var(--sa)); } to { transform: rotate(calc(var(--sa) - 360deg)); } }
  @keyframes cnt-cw  { from { transform: rotate(var(--co)); } to { transform: rotate(calc(var(--co) - 360deg)); } }
  @keyframes cnt-ccw { from { transform: rotate(var(--co)); } to { transform: rotate(calc(var(--co) + 360deg)); } }
`

// Icon container size: 56 px wide × 56 px tall  →  half = 28 px
const ICON_HALF = 28   // px — used for centering arm & icon on ring

export default function OrbitingCirclesGlobeDemo() {
  return (
    <div
      className="relative w-full overflow-hidden flex justify-center"
      style={{ height: "clamp(380px, 45vw, 540px)" }}
    >
      <style>{KEYFRAMES}</style>

      {/* ── Particle Globe ── positioned at bottom-center, half hidden ── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none z-10 aspect-square"
        style={{ width: "clamp(190px, 25vw, 310px)" }}
      >
        <ParticleSphereAnimation />
      </div>

      {/* ── Orbiting rings ─────────────────────────────────────────────── */}
      {ORBITS.map((orbit, oi) => {
        const fwd = orbit.cw ? "orb-cw" : "orb-ccw"
        const rev = orbit.cw ? "cnt-cw" : "cnt-ccw"

        // Mirror each icon 180° for visual symmetry
        const icons: IconDef[] = [
          ...orbit.icons,
          ...orbit.icons.map(ic => ({ ...ic, angle: ic.angle + 180, alt: `${ic.alt}-m` })),
        ]

        const wClamp = `clamp(${orbit.smSize}px, ${(orbit.smSize / 1200 * 100).toFixed(1)}vw, ${orbit.mdSize}px)`

        return (
          <div
            key={oi}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-zinc-800/50"
            style={{ width: wClamp, height: wClamp }}
          >
            {icons.map((ic, ii) => (
              /* ── Rotating arm ── */
              <div
                key={ii}
                className="absolute top-0 left-1/2 h-1/2 origin-bottom flex flex-col justify-start items-center"
                style={{
                  marginLeft: `-${ICON_HALF}px`,
                  "--sa": `${ic.angle}deg`,
                  animation: `${fwd} ${orbit.duration}s linear infinite`,
                } as React.CSSProperties}
              >
                {/* ── Counter-rotating icon ── */}
                <div
                  className="w-14 h-14 border border-zinc-700/70 rounded-full bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-black/70 relative z-10 hover:scale-110 transition-transform duration-300"
                  style={{
                    marginTop: `-${ICON_HALF}px`,
                    "--co": `${-ic.angle}deg`,
                    animation: `${rev} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties}
                >
                  <img
                    src={ic.src}
                    alt={ic.alt}
                    width={26}
                    height={26}
                    className="w-[26px] h-[26px] object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
