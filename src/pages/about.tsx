import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useSpring, animate } from "motion/react"
import { ArrowUpRight, Zap, Users, Shield, Code2, Layers, Sparkles, Globe, ChevronRight, Star } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { useSEO } from "@/lib/useSEO"

/* ─── Animated Counter ─────────────────────────────────── */
function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix
      },
    })
    return controls.stop
  }, [inView, to, suffix, duration])
  return <span ref={ref}>0{suffix}</span>
}

/* ─── Magnetic Tilt Card ───────────────────────────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(x, { stiffness: 300, damping: 30 })
  const ry = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set(((e.clientY - cy) / rect.height) * 8)
    y.set(-((e.clientX - cx) / rect.width) * 8)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Floating Orb ─────────────────────────────────────── */
function FloatingOrb({ size, color, x, y, delay = 0 }: { size: number; color: string; x: string; y: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] opacity-30 pointer-events-none ${color}`}
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -30, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

/* ─── Section Fade In ──────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Stats ─────────────────────────────────────────────── */
const stats = [
  { value: 2300, suffix: "+", label: "Stores Served", icon: Globe, color: "text-zinc-200" },
  { value: 2, suffix: "", label: "AI-Powered Apps", icon: Zap, color: "text-zinc-200" },
  { value: 4, suffix: ".9★", label: "Average Rating", icon: Star, color: "text-zinc-200" },
  { value: 700, suffix: "+", label: "Premium Sections", icon: Layers, color: "text-zinc-200" },
]

/* ─── Values ─────────────────────────────────────────────── */
const values = [
  {
    icon: Zap,
    gradient: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    glow: "shadow-zinc-900/10",
    iconBg: "bg-zinc-800 border-zinc-700",
    iconColor: "text-white",
    title: "Ship Fast",
    desc: "We move with urgency. Every feature we build delivers instant value to your store — zero friction, zero waiting.",
  },
  {
    icon: Users,
    gradient: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    glow: "shadow-zinc-900/10",
    iconBg: "bg-zinc-800 border-zinc-700",
    iconColor: "text-white",
    title: "Merchant First",
    desc: "Every decision starts with the merchant. We listen closely, iterate fast, and build exactly what stores need.",
  },
  {
    icon: Shield,
    gradient: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    glow: "shadow-zinc-900/10",
    iconBg: "bg-zinc-800 border-zinc-700",
    iconColor: "text-white",
    title: "Zero Complexity",
    desc: "No developers. No settings nightmares. Our apps are built for real store owners who just want things to work.",
  },
  {
    icon: Code2,
    gradient: "from-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    glow: "shadow-zinc-900/10",
    iconBg: "bg-zinc-800 border-zinc-700",
    iconColor: "text-white",
    title: "AI at the Core",
    desc: "Every product we build is powered by artificial intelligence — from smart section recommendations to auto variant detection.",
  },
]

/* ─── Apps ───────────────────────────────────────────────── */
const apps = [
  {
    name: "AI Section Hub",
    tagline: "Your store. Beautifully built.",
    desc: "700+ premium native Shopify sections, FAQ accordions, shoppable Instagram reels and volume widgets — installed in one click. No code, ever.",
    href: "https://apps.shopify.com/ai-section-hub",
    tag: "2,300+ Installs",
    gradient: "from-zinc-900/50 via-zinc-950/20 to-transparent",
    border: "border-zinc-800",
    glow: "hover:shadow-[0_0_60px_rgba(255,255,255,0.05)]",
    icon: Layers,
    iconGradient: "from-zinc-700 to-zinc-800",
    features: ["700+ Sections", "AI Recommendations", "One-Click Install"],
  },
  {
    name: "Klenzo: Variant Swatch",
    tagline: "Swatches that convert.",
    desc: "Replace boring Shopify dropdowns with beautiful AI-powered color & image swatches. Boost conversions and make product pages stunning.",
    href: "https://apps.shopify.com/klenzo-product-variant-swatch",
    tag: "New App",
    gradient: "from-zinc-900/50 via-zinc-950/20 to-transparent",
    border: "border-zinc-800",
    glow: "hover:shadow-[0_0_60px_rgba(255,255,255,0.05)]",
    icon: Zap,
    iconGradient: "from-zinc-700 to-zinc-800",
    features: ["AI Detection", "Color & Image Swatches", "Conversion Boost"],
  },
]

/* ─── Timeline ───────────────────────────────────────────── */
const timeline = [
  { year: "2022", title: "The Beginning", desc: "Klenzo was born out of a simple frustration — why don't Shopify merchants have access to the same tools as enterprise brands?" },
  { year: "2023", title: "First App Live", desc: "AI Section Hub launched on the Shopify App Store and quickly became a top-rated app for no-code store customization." },
  { year: "2024", title: "Expanding the Suite", desc: "Klenzo: Variant Swatch launched, bringing intelligent product display to stores of all sizes with zero setup needed." },
  { year: "2025", title: "2,300+ Merchants", desc: "Today, thousands of merchants across the globe trust Klenzo apps to run their stores better, faster, and smarter." },
]

/* ─── Page ───────────────────────────────────────────────── */
export function AboutPage() {
  const [hoveredApp, setHoveredApp] = useState<number | null>(null)

  useSEO({
    title: "About Klenzo — AI Shopify App Studio | Our Story & Mission",
    description: "Klenzo is a Shopify app studio built by a team of engineers. We build AI-powered apps — AI Section Hub and Klenzo: Variant Swatch — to help 2,300+ merchants boost conversions without code.",
    canonical: "https://klenzo.app/about",
    keywords: "about Klenzo, Mitul Zalavadiya, Shopify app studio, AI Section Hub about, Klenzo team",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://klenzo.app/about#webpage",
        "url": "https://klenzo.app/about",
        "name": "About Klenzo",
        "description": "Learn about Klenzo, the AI-powered Shopify app studio helping 2,300+ merchants boost conversions.",
        "isPartOf": { "@id": "https://klenzo.app/#website" },
        "about": { "@id": "https://klenzo.app/#organization" },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://klenzo.app/" },
            { "@type": "ListItem", "position": 2, "name": "About", "item": "https://klenzo.app/about" }
          ]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://klenzo.app/#founder",
        "name": "Mitul Zalavadiya",
        "jobTitle": "Engineer",
        "worksFor": { "@id": "https://klenzo.app/#organization" },
        "url": "https://klenzo.app/about"
      }
    ],
  })

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <CursorFollower />
      <Header1 />

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:5rem_5rem]" />

        {/* Orbs */}
        <FloatingOrb size={600} color="bg-zinc-900" x="60%" y="-10%" delay={0} />
        <FloatingOrb size={500} color="bg-zinc-900" x="-10%" y="20%" delay={1.5} />
        <FloatingOrb size={400} color="bg-zinc-900" x="40%" y="60%" delay={3} />

        {/* Noise overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 py-32 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-700/60 bg-zinc-900/60 backdrop-blur text-zinc-400 text-xs uppercase tracking-widest font-bold mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            Meet the Team Behind the Magic
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.0] mb-6"
          >
            We build tools{" "}
            <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Shopify loves
              </span>
              {/* Underline animated */}
              <motion.span
                className="absolute -bottom-2 left-0 h-[3px] rounded-full bg-gradient-to-r from-white via-zinc-300 to-zinc-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Klenzo is a Shopify app studio on a mission to give every merchant access to powerful,
            beautiful, and intelligent store tools — with zero code required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-4 mb-20"
          >
            <motion.a
              href="https://apps.shopify.com/ai-section-hub"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-extrabold text-sm rounded-full shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all duration-300"
            >
              Explore Our Apps
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </motion.a>
            <motion.a
              href="mailto:mitulzalavadiya10@gmail.com"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900/80 text-white font-bold text-sm rounded-full border border-zinc-700 hover:border-zinc-500 backdrop-blur transition-all duration-300"
            >
              Contact Us
            </motion.a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-zinc-900/60 border border-zinc-800 backdrop-blur rounded-2xl px-5 py-6 flex flex-col items-center gap-2 hover:border-zinc-600 transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <s.icon className={`w-5 h-5 ${s.color} mb-1`} />
                <span className={`text-3xl md:text-4xl font-black ${s.color}`}>
                  <Counter to={s.value} suffix={s.suffix} duration={2} />
                </span>
                <span className="text-zinc-500 text-xs font-semibold text-center">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
        </motion.div>
      </section>

      {/* ══ MISSION ═══════════════════════════════════════ */}
      <section className="py-32 border-t border-zinc-900 relative overflow-hidden">
        <FloatingOrb size={500} color="bg-zinc-900" x="-15%" y="10%" delay={2} />
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeUp>
              <span className="inline-flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold mb-5">
                <span className="w-6 h-[2px] bg-zinc-400 rounded-full" />
                Our Mission
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-tight mb-6">
                Empowering every merchant to{" "}
                <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  build a better store
                </span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-5">
                We believe great Shopify stores shouldn't require a developer. We build AI-powered tools
                that give independent merchants the same capabilities as enterprise brands.
              </p>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Klenzo was built out of frustration with the lack of smart,
                no-code tools in the Shopify ecosystem. Today, we serve thousands of stores worldwide.
              </p>
            </FadeUp>

            {/* Team Klenzo note card */}
            <FadeUp delay={0.15}>
              <TiltCard>
                <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 overflow-hidden group hover:border-zinc-700 transition-colors duration-500">
                  {/* Animated glow top-right */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-800/20 rounded-full blur-3xl group-hover:bg-zinc-800/30 transition-colors duration-700" />

                  <div className="relative flex items-center gap-3 mb-8">
                    <div className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-zinc-400 opacity-40"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-zinc-500"></span>
                    </div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Why We Started Klenzo</span>
                  </div>

                  <blockquote className="relative text-zinc-200 text-base md:text-lg leading-relaxed font-medium mb-8">
                    <span className="text-5xl text-zinc-500/30 font-serif absolute -top-3 -left-1">"</span>
                    <span className="relative z-10 ml-4">
                      We built Klenzo because every Shopify merchant — not just big brands — deserves access
                      to powerful, beautiful store tools. No developers. No complexity. Just results that grow your business.
                    </span>
                    <span className="text-5xl text-zinc-500/30 font-serif">"</span>
                  </blockquote>

                  <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-zinc-800/30">
                      K
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-zinc-400 rounded-full border-2 border-zinc-900" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Team Klenzo</p>
                      <p className="text-zinc-500 text-xs mt-0.5">Engineering Team, Klenzo</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══════════════════════════════════════ */}
      <section className="py-28 border-t border-zinc-900 relative">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          <FadeUp className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">
              <span className="w-6 h-[2px] bg-zinc-400 rounded-full" />
              Our Journey
              <span className="w-6 h-[2px] bg-zinc-400 rounded-full" />
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              How we got here
            </h2>
          </FadeUp>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-zinc-700/60 via-zinc-800/40 to-transparent md:-translate-x-[1px]" />

            <div className="flex flex-col gap-12">
              {timeline.map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className={`relative flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-start md:items-center`}>
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 w-4 h-4 -translate-x-1/2 mt-1.5 md:mt-0">
                      <span className="block w-4 h-4 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 shadow-lg shadow-zinc-800/40 ring-4 ring-black" />
                    </div>

                    {/* Content */}
                    <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:pl-10"}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="inline-block bg-zinc-900/80 border border-zinc-800 rounded-2xl px-6 py-5 backdrop-blur hover:border-zinc-700 transition-colors duration-300"
                      >
                        <span className="text-xs font-black text-zinc-400 tracking-widest uppercase block mb-1">{item.year}</span>
                        <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                      </motion.div>
                    </div>

                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════ */}
      <section className="py-28 border-t border-zinc-900 relative overflow-hidden">
        <FloatingOrb size={450} color="bg-zinc-900" x="70%" y="20%" delay={1} />
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8">
          <FadeUp className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">
              <span className="w-6 h-[2px] bg-zinc-400 rounded-full" />
              What We Stand For
              <span className="w-6 h-[2px] bg-zinc-400 rounded-full" />
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Our core values</h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <TiltCard>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative h-full flex flex-col gap-5 bg-gradient-to-br ${v.gradient} border ${v.border} rounded-2xl p-6 backdrop-blur hover:shadow-xl ${v.glow} transition-all duration-500 overflow-hidden group`}
                  >
                    {/* Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                    <div className={`w-12 h-12 rounded-2xl ${v.iconBg} border flex items-center justify-center`}>
                      <v.icon className={`w-6 h-6 ${v.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-base mb-2">{v.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </motion.div>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ APPS ══════════════════════════════════════════ */}
      <section className="py-28 border-t border-zinc-900 relative overflow-hidden">
        <FloatingOrb size={400} color="bg-zinc-900" x="10%" y="30%" delay={2.5} />
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8">
          <FadeUp className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">
              <span className="w-6 h-[2px] bg-zinc-400 rounded-full" />
              Our Products
              <span className="w-6 h-[2px] bg-zinc-400 rounded-full" />
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">Apps we've built</h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
              Two powerful AI apps helping Shopify merchants sell more — without writing a single line of code.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <TiltCard>
                  <motion.a
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onHoverStart={() => setHoveredApp(i)}
                    onHoverEnd={() => setHoveredApp(null)}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`group relative flex flex-col gap-6 bg-gradient-to-br ${app.gradient} border ${app.border} rounded-3xl p-8 cursor-pointer overflow-hidden transition-all duration-500 ${app.glow} backdrop-blur`}
                  >
                    {/* Animated glow bg */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-3xl"
                      transition={{ duration: 0.4 }}
                    />

                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.iconGradient} flex items-center justify-center shadow-lg`}>
                        <app.icon className="w-7 h-7 text-white" />
                      </div>
                      <motion.div
                        animate={hoveredApp === i ? { x: 3, y: -3 } : { x: 0, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors duration-200" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-white font-extrabold text-2xl tracking-tight">{app.name}</h3>
                        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700">{app.tag}</span>
                      </div>
                      <p className="text-zinc-400 text-sm font-semibold mb-3">{app.tagline}</p>
                      <p className="text-zinc-400 text-sm leading-relaxed">{app.desc}</p>
                    </div>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {app.features.map((f, j) => (
                        <span key={j} className="text-xs font-semibold text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-full backdrop-blur">
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1.5 pt-4 border-t border-white/5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-white text-white" />
                      ))}
                      <span className="text-zinc-500 text-xs ml-1.5 font-medium">Shopify App Store</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 ml-auto group-hover:text-zinc-400 transition-colors" />
                    </div>
                  </motion.a>
                </TiltCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════ */}
      <section className="py-28 border-t border-zinc-900 relative overflow-hidden">
        <FloatingOrb size={600} color="bg-zinc-900" x="30%" y="0%" delay={0.5} />
        <FloatingOrb size={400} color="bg-zinc-900" x="60%" y="40%" delay={2} />
        <div className="relative z-10 container mx-auto max-w-4xl px-6 md:px-8 text-center">
          <FadeUp>
            <motion.div
              className="relative bg-zinc-900/70 border border-zinc-800 rounded-3xl px-8 py-16 md:py-24 backdrop-blur overflow-hidden"
              whileHover={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
              transition={{ duration: 0.4 }}
            >
              {/* Animated gradient border top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-transparent to-zinc-900/10 pointer-events-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-400 text-xs uppercase tracking-widest font-bold mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  Get Started Free
                </span>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.05] mb-5">
                  Ready to supercharge{" "}
                  <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    your store?
                  </span>
                </h2>
                <p className="text-zinc-400 text-base md:text-lg max-w-lg mx-auto mb-10">
                  Join 2,300+ merchants using Klenzo apps to grow faster, convert more, and sell smarter.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.a
                    href="https://apps.shopify.com/ai-section-hub"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-extrabold text-sm rounded-full shadow-[0_0_40px_rgba(255,255,255,0.12)] hover:shadow-[0_0_60px_rgba(255,255,255,0.22)] transition-all duration-300"
                  >
                    Install AI Section Hub
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.a>
                  <motion.a
                    href="mailto:mitulzalavadiya10@gmail.com"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold text-sm rounded-full border border-zinc-700 hover:border-zinc-400 backdrop-blur transition-all duration-300"
                  >
                    Talk to Us
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      <MinimalFooter />
    </div>
  )
}
