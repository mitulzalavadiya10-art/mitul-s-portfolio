import { useEffect, useRef } from "react"
import { motion, useInView, animate } from "motion/react"
import { ArrowUpRight, Zap, Layers, Sparkles, Globe, Star, Briefcase, GraduationCap, Code2, MapPin } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import GlobeScrollDemo from "@/components/ui/landing-page"
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

/* ─── Page ───────────────────────────────────────────────── */
export function AboutPage() {

  useSEO({
    title: "About Mitul Zalavadiya — Shopify Apps Engineer & Creator",
    description: "Mitul Zalavadiya is a Shopify app engineer and creator. Building production-grade apps — AI Section Hub and Variant Swatch — to help 2,300+ merchants boost conversions without code.",
    canonical: "https://klenzo.app/about",
    keywords: "Mitul Zalavadiya, Shopify app developer, Shopify engineer portfolio, AI Section Hub, Variant Swatch",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://klenzo.app/about#webpage",
        "url": "https://klenzo.app/about",
        "name": "About Mitul Zalavadiya",
        "description": "Learn about Mitul Zalavadiya, Shopify apps engineer helping 2,300+ merchants boost conversions.",
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

      {/* ══ INTERACTIVE SCROLL GLOBE (TOP SECTION) ════════ */}
      <GlobeScrollDemo />

      {/* ══ STATS HIGHLIGHT ═════════════════════════════════ */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/60 relative overflow-hidden">
        <FloatingOrb size={400} color="bg-zinc-900" x="50%" y="20%" delay={0} />
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
      </section>

      {/* ══ EXPERIENCE & EDUCATION ═════════════════════════ */}
      <section className="py-24 border-t border-zinc-900 bg-black relative">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-4">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              Career &amp; Background
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Experience &amp; Expertise
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Shopify Developer with hands-on experience building high-quality websites, custom themes, and production-grade apps like AI Section Hub.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Work Experience (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" /> Work Experience
              </h3>

              {/* Solvifytech */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white">Shopify Developer &amp; App Engineer</h4>
                    <span className="text-sm text-emerald-400 font-semibold">Solvifytech</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium">
                    2026 – Present
                  </span>
                </div>
                <ul className="space-y-2 mt-4 text-xs md:text-sm text-zinc-400 leading-relaxed list-disc list-inside">
                  <li>Building and maintaining <span className="text-white font-medium">AI Section Hub</span>, a Shopify app for ready-made sections and custom storefront solutions using Shopify APIs, Liquid, React, and JavaScript.</li>
                  <li>Creating custom Shopify sections, templates, and theme components with focus on responsive design, customization, and reusable solutions.</li>
                  <li>Developing and customizing high-converting Shopify websites with custom themes, responsive storefronts, and dynamic product experiences.</li>
                </ul>
              </div>

              {/* Identiq Infotech */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white">React Native Developer</h4>
                    <span className="text-sm text-blue-400 font-semibold">Identiq Infotech</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium">
                    2025 – 2026
                  </span>
                </div>
                <ul className="space-y-2 mt-4 text-xs md:text-sm text-zinc-400 leading-relaxed list-disc list-inside">
                  <li>Developed cross-platform mobile applications using React Native, Redux, Redux Persist, and AsyncStorage.</li>
                  <li>Integrated REST APIs, Firebase backend services, camera features, contact management, and advertising systems.</li>
                </ul>
              </div>

            </div>

            {/* Education & Skills (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Education */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" /> Education
                </h3>

                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-base font-bold text-white">GLS University, Ahmedabad</h4>
                    <span className="text-xs text-zinc-400 font-medium">2022 – 2025</span>
                  </div>
                  <p className="text-sm text-zinc-300 font-medium">Bachelor of Computer Applications (BCA)</p>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur hover:border-zinc-700 transition-colors">
                  <h4 className="text-base font-bold text-white">Aspire Public School</h4>
                  <p className="text-sm text-zinc-400">Higher Secondary — Commerce (12th)</p>
                  <p className="text-xs text-zinc-500 mt-2">P. P. Savani Vidhyabhavan — Secondary School (10th)</p>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-400" /> Core Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Shopify Website Development",
                    "Shopify App Development",
                    "Shopify Liquid & OS 2.0",
                    "Custom Themes & Sections",
                    "React & JavaScript",
                    "Responsive Storefront Design",
                    "Shopify APIs",
                    "React Native & Redux",
                    "Firebase",
                  ].map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:border-zinc-700 hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location Badge */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3 text-xs text-zinc-400">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>Mota Varachha, Surat, Gujarat, India • Available for global Shopify projects</span>
              </div>

            </div>

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
                  Join 2,300+ merchants using our apps to grow faster, convert more, and sell smarter.
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
                    href="mailto:mitulzalavadiya11@gmail.com"
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
