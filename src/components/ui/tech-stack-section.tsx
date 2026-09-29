import { motion } from "motion/react"
import OrbitingCirclesGlobeDemo from "@/components/ui/orbiting-circles-02"


export function TechStackSection() {
  return (
    <section
      id="tech-stack"
      className="relative w-full bg-black border-t border-zinc-900 overflow-hidden pb-0 pt-20 md:pt-28"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] rounded-full bg-blue-950/10 blur-[160px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-zinc-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-6 md:px-8">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Our Tech Stack
          </span>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white mb-5">
            Built on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-zinc-500">
              World-Class Technology
            </span>
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10">
            Klenzo apps are powered by a modern AI-first stack — from Shopify&apos;s native Liquid engine
            to cutting-edge cloud AI models — delivering the fastest, smartest experience for your store.
          </p>
        </motion.div>

      </div>

      {/* ── Orbiting Globe animation (full-width, no container constraint) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full mt-6"
      >
        <OrbitingCirclesGlobeDemo />
      </motion.div>
    </section>
  )
}
