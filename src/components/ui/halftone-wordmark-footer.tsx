"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

export interface HalftonePalette {
  background: string
  ink: string
  warm: string
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt"

export interface FooterLink {
  label: string
  href?: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface HalftoneWordmarkFooterProps {
  /** The giant word printed in dots. Lowercase reads best. */
  wordmark?: string
  /** Top-left studio line. */
  label?: string
  /** The muted line under it. */
  meta?: string
  /** Link columns along the top. */
  columns?: FooterColumn[]
  /** Show the back-to-top link. It scrolls the window to 0. Defaults to true. */
  backToTop?: boolean
  /** Starting colours. Defaults to "night". */
  preset?: HalftonePreset
  /** Colour overrides, merged over the preset. */
  palette?: { background?: string; ink?: string; warm?: string }
  /** Distance between dot centres, in CSS px. Defaults to 6. */
  dotGap?: number
  /** How far the pointer pushes, in CSS px. Defaults to 90. */
  radius?: number
  /** How much of the word's cap height hangs below the bottom edge, 0–0.6. Defaults to 0.22. */
  crop?: number
  /** Print grain over everything, 0–1. Defaults to 0.45. */
  grain?: number
  /** Pointer and click response. Defaults to true. */
  interactive?: boolean
  /** Face for the wordmark. Heavy grotesks print best. */
  fontFamily?: string
  /** Weight of the wordmark. Defaults to 900. */
  fontWeight?: number
  /** Optional custom canvas stage height. */
  height?: string
  /** Extra root class names. */
  className?: string
}

const PRESETS: { [K in HalftonePreset]: HalftonePalette } = {
  night: { background: "#050505", ink: "#ffffff", warm: "#10b981" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#0c0a09", ink: "#f4f4f5", warm: "#f97316" },
  cobalt: { background: "#090d16", ink: "#e0e7ff", warm: "#38bdf8" },
}

export const MITUL_DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Products & Apps",
    links: [
      { label: "AI Section Hub (700+ Sections)", href: "https://apps.shopify.com/ai-section-hub" },
      { label: "Variant Swatch App", href: "https://apps.shopify.com/klenzo-product-variant-swatch" },
      { label: "Shopify 3D Websites", href: "/shopify-website" },
      { label: "Shopify Apps Page", href: "/shopify-apps" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "About Mitul", href: "/about" },
      { label: "Video Tutorials", href: "/guide" },
      { label: "Merchant FAQs", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Connect & Direct",
    links: [
      { label: "mitulzalavadiya11@gmail.com", href: "mailto:mitulzalavadiya11@gmail.com" },
      { label: "+91 90991 05448", href: "tel:+919099105448" },
      { label: "LinkedIn Profile", href: "https://www.linkedin.com/in/mitul-zalavadiya-784873369?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
      { label: "YouTube Tutorials", href: "https://youtube.com/@ai-section-hub?si=Rop3U0a3xRipzLpX" },
      { label: "Instagram", href: "https://www.instagram.com/_mitulzalavadiya_" },
    ],
  },
]

const SANS_STACK = '"Plus Jakarta Sans", "Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

// #region halftone helpers
export function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function hwfRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage
  return Math.sqrt(c) * gap * 0.58
}

export function hwfStep(
  x: number, y: number, vx: number, vy: number,
  hx: number, hy: number, px: number, py: number, r: number,
) {
  const dx = x - px
  const dy = y - py
  const d2 = dx * dx + dy * dy
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001
    const f = (1 - d / r) * 2.8
    vx += (dx / d) * f
    vy += (dy / d) * f
  }
  vx = (vx + (hx - x) * 0.05) * 0.84
  vy = (vy + (hy - y) * 0.05) * 0.84
  return [x + vx, y + vy, vx, vy]
}

export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const d = Math.hypot(x - hx, y - hy)
  return span > 0 ? Math.min(1, d / span) : 0
}

export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0
}
// #endregion

const HWF_CSS = `
.hwf-wrapper {
  position: relative;
  width: 100%;
  background: var(--hwf-bg);
  color: #fff;
  overflow: hidden;
}
.hwf-top-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(36px, 4vw, 56px) clamp(20px, 4vw, 48px) 0;
}
.hwf-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: 36px;
}
.hwf-brand h4 {
  font-family: var(--font-headings), "Plus Jakarta Sans", sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
}
.hwf-brand p {
  font-family: var(--font-sans), "Inter", sans-serif;
  font-size: 13.5px;
  color: #a1a1aa;
  margin: 6px 0 16px 0;
  line-height: 1.6;
}
.hwf-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 9999px;
  background: rgba(24, 24, 27, 0.7);
  border: 1px solid rgba(63, 63, 70, 0.6);
  font-size: 11.5px;
  font-weight: 600;
  color: #e4e4e7;
}
.hwf-col h3 {
  font-family: var(--font-headings), "Plus Jakarta Sans", sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #71717a;
  margin: 0 0 16px 0;
}
.hwf-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hwf-col li {
  margin-bottom: 9px;
}
.hwf-col a {
  font-family: var(--font-sans), "Inter", sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: #d4d4d8;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.hwf-col a:hover {
  color: #ffffff;
  transform: translateX(3px);
}
.hwf-stage {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  cursor: crosshair;
  user-select: none;
  background: var(--hwf-bg);
  margin-top: 28px;
}
@media (min-width: 640px) {
  .hwf-stage { height: 320px; }
}
@media (min-width: 1024px) {
  .hwf-stage { height: 380px; }
}
.hwf-stage canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.hwf-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 860px) {
  .hwf-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    row-gap: 28px;
  }
  .hwf-brand {
    grid-column: 1 / -1;
  }
}
@media (max-width: 520px) {
  .hwf-grid {
    grid-template-columns: 1fr;
    row-gap: 24px;
  }
}
`

export default function HalftoneWordmarkFooter({
  wordmark = "mitul",
  label = "Mitul Zalavadiya",
  meta = "Shopify Developer at Solvifytech • Surat, India",
  columns = MITUL_DEFAULT_COLUMNS,
  preset = "night",
  palette,
  dotGap = 6,
  radius = 90,
  crop = 0.22,
  grain = 0.45,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 900,
  className = "",
}: HalftoneWordmarkFooterProps) {
  const colors = { ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) }
  const stageRef = React.useRef(null as HTMLDivElement | null)
  const canvasRef = React.useRef(null as HTMLCanvasElement | null)
  const opts = React.useRef({ colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark })
  opts.current = { colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark }
  const key = [wordmark, dotGap, crop, grain, fontFamily, fontWeight, colors.background, colors.ink, colors.warm].join("|")

  React.useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0
    let h = 0
    let dpr = 1
    let px = -1e5
    let py = -1e5
    let raf = 0
    let visible = true
    let awake = true
    let ring = { x: 0, y: 0, t: -1 }
    let dots = new Float32Array(0)
    let count = 0
    let grainTile = null as HTMLCanvasElement | null
    const ink = hwfHex(opts.current.colors.ink) || [255, 255, 255]
    const warm = hwfHex(opts.current.colors.warm) || [16, 185, 129]

    const layout = () => {
      const o = opts.current
      const rect = stage.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const mask = document.createElement("canvas")
      mask.width = w
      mask.height = h
      const m = mask.getContext("2d", { willReadFrequently: true })
      if (!m) return
      const face = o.fontWeight + " 100px " + o.fontFamily
      m.font = face
      const word = o.wordmark || " "
      // Size the wordmark to span the width of the canvas stage
      const fit = hwfFitSize(m.measureText(word).width, w * 0.98)
      m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
      const box = m.measureText(word)
      const cap = box.actualBoundingBoxAscent || fit * 0.72
      const c = Math.max(0, Math.min(0.6, o.crop))
      m.fillStyle = "#000"
      m.textBaseline = "alphabetic"
      // Position wordmark cleanly anchored at the bottom
      m.fillText(word, (w - box.width) / 2, h + cap * c)
      const img = m.getImageData(0, 0, w, h).data

      const gap = Math.max(3, o.dotGap)
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const tmp = []
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3))
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3))
              sum += img[(y * w + x) * 4 + 3]
            }
          }
          const cov = sum / (9 * 255)
          if (cov < 0.06) continue
          const hx = gx * gap + gap / 2
          const hy = gy * gap + gap / 2
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap))
        }
      }
      dots = new Float32Array(tmp)
      count = tmp.length / 7

      grainTile = document.createElement("canvas")
      grainTile.width = 256
      grainTile.height = 256
      const g = grainTile.getContext("2d")
      if (g) {
        const id = g.createImageData(256, 256)
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        g.putImageData(id, 0, 0)
      }
      awake = true
    }

    const draw = (now: number) => {
      const o = opts.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = o.colors.background
      ctx.fillRect(0, 0, w, h)

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t
      const ringR = ringAge * 0.9
      let moving = false
      for (let i = 0; i < count; i++) {
        const j = i * 7
        let x = dots[j]
        let y = dots[j + 1]
        let vx = dots[j + 2]
        let vy = dots[j + 3]
        const hx = dots[j + 4]
        const hy = dots[j + 5]
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x
            const dy = hy - ring.y
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26)
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900)
              vx += (dx / d) * f
              vy += (dy / d) * f
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r)
          x = s[0]
          y = s[1]
          vx = s[2]
          vy = s[3]
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true
          else {
            x = hx
            y = hy
            vx = 0
            vy = 0
          }
          dots[j] = x
          dots[j + 1] = y
          dots[j + 2] = vx
          dots[j + 3] = vy
        }
        const k = hwfWarmth(x, y, hx, hy, 28)
        ctx.fillStyle =
          k > 0.02
            ? "rgb(" +
              Math.round(ink[0] + (warm[0] - ink[0]) * k) + "," +
              Math.round(ink[1] + (warm[1] - ink[1]) * k) + "," +
              Math.round(ink[2] + (warm[2] - ink[2]) * k) + ")"
            : o.colors.ink
        ctx.beginPath()
        ctx.arc(x, y, dots[j + 6], 0, 6.2832)
        ctx.fill()
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.09
        ctx.globalCompositeOperation = "overlay"
        const pattern = ctx.createPattern(grainTile, "repeat")
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }
      awake = moving || ringAge < 900 || px > -1e4
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (awake) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      awake = true
      if (!raf && visible) raf = requestAnimationFrame(loop)
    }

    const toLocal = (e: PointerEv) => {
      const b = canvas.getBoundingClientRect()
      return [e.clientX - b.left, e.clientY - b.top]
    }
    const onMove = (e: PointerEv) => {
      if (!opts.current.interactive) return
      const p = toLocal(e)
      px = p[0]
      py = p[1]
      wake()
    }
    const onLeave = () => {
      px = -1e5
      py = -1e5
      wake()
    }
    const onDown = (e: PointerEv) => {
      if (!opts.current.interactive || reduced) return
      if ((e.target as HTMLElement).closest("a,button")) return
      const p = toLocal(e)
      ring = { x: p[0], y: p[1], t: performance.now() }
      wake()
    }

    layout()
    draw(performance.now())
    wake()

    stage.addEventListener("pointermove", onMove)
    stage.addEventListener("pointerleave", onLeave)
    stage.addEventListener("pointerdown", onDown)
    const ro = new ResizeObserver(() => {
      layout()
      wake()
    })
    ro.observe(stage)
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true
      if (visible) wake()
    })
    io.observe(stage)

    let alive = true
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return
        layout()
        wake()
      })
    }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerleave", onLeave)
      stage.removeEventListener("pointerdown", onDown)
    }
  }, [key])

  return (
    <footer
      className={"hwf-wrapper " + className}
      style={{ "--hwf-bg": colors.background } as React.CSSProperties}
    >
      <style>{HWF_CSS}</style>

      {/* ── Top Link Columns Section (100% Clear, Crisp & Unobstructed) ── */}
      <div className="hwf-top-content">
        <div className="hwf-grid">
          {/* Brand & Studio Line */}
          <div className="hwf-brand">
            <h4>{label}</h4>
            <p>{meta}</p>
            <div className="hwf-badge">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Shopify Themes &amp; Apps</span>
            </div>
          </div>

          {/* Nav Columns */}
          {columns.map((col) => (
            <nav className="hwf-col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => {
                  const isInternal = l.href?.startsWith("/")
                  return (
                    <li key={l.label}>
                      {isInternal ? (
                        <Link to={l.href || "/"}>{l.label}</Link>
                      ) : (
                        <a
                          href={l.href || "#"}
                          target={l.href?.startsWith("http") ? "_blank" : undefined}
                          rel={l.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {l.label}
                          {l.href?.startsWith("http") && (
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 ml-0.5 inline" />
                          )}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Dedicated Halftone Wordmark Stage (Separated Below Links) ── */}
      <div ref={stageRef} className="hwf-stage" aria-label="Interactive Wordmark">
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="hwf-sr">{wordmark}</span>
      </div>
    </footer>
  )
}

type PointerEv = PointerEvent
