"use client"
import { useEffect, useRef } from "react"

export default function ParticleSphereAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const COUNT = 700
    type P = { px: number; py: number; pz: number; alpha: number; size: number }
    const pts: P[] = []

    // Fibonacci lattice — best uniform sphere distribution
    const goldenRatio = Math.PI * (Math.sqrt(5) - 1)
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenRatio * i
      pts.push({
        px: Math.cos(theta) * r,
        py: y,
        pz: Math.sin(theta) * r,
        alpha: 0.3 + Math.random() * 0.65,
        size: 0.5 + Math.random() * 1.6,
      })
    }

    let angle = 0
    let raf = 0
    const TILT_COS = Math.cos(0.28)
    const TILT_SIN = Math.sin(0.28)

    const frame = () => {
      const W = canvas.width
      const H = canvas.height
      if (!W || !H) { raf = requestAnimationFrame(frame); return }

      const R = Math.min(W, H) * 0.46
      const cx = W / 2
      const cy = H / 2
      const FOV = 820

      ctx.clearRect(0, 0, W, H)
      angle += 0.0038

      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)

      const projected = pts.map(p => {
        // Rotate Y-axis
        const x1 = p.px * cosA + p.pz * sinA
        const z1 = -p.px * sinA + p.pz * cosA
        // Tilt X-axis
        const y2 = p.py * TILT_COS - z1 * TILT_SIN
        const z2 = p.py * TILT_SIN + z1 * TILT_COS
        const sc = FOV / (FOV + z2 * R)
        return {
          sx: cx + x1 * R * sc,
          sy: cy + y2 * R * sc,
          scale: sc,
          depth: (z2 + 1) / 2,
          alpha: p.alpha,
          size: p.size,
        }
      }).sort((a, b) => a.depth - b.depth)

      for (const p of projected) {
        const a = p.alpha * (0.06 + p.depth * 0.94)
        const r = Math.max(0.3, p.size * p.scale)
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(190, 215, 255, ${a})`
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    frame()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  )
}
