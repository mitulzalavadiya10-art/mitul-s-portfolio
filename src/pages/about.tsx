import { useState, useEffect, useRef } from "react"
import { motion, useInView, animate } from "motion/react"
import { 
  ArrowUpRight, Zap, Layers, Sparkles, Globe, 
  Briefcase, GraduationCap, Code2, MapPin, PhoneCall, 
  Mail, CheckCircle2, Smartphone, Gauge, Award, Compass,
  Cpu, Terminal, ShieldCheck, TrendingUp, Video, ExternalLink,
  FileCode2, HelpCircle, Check, ChevronDown
} from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import GlobeScrollDemo from "@/components/ui/landing-page"
import RotatingEarth from "@/components/ui/wireframe-dotted-globe"
import { useSEO } from "@/lib/useSEO"

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

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
      className={`absolute rounded-full blur-[90px] opacity-25 pointer-events-none ${color}`}
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
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Stats ─────────────────────────────────────────────── */
const STATS = [
  { value: 2300, suffix: "+", label: "Active Global Merchants", icon: Globe, color: "text-white" },
  { value: 2, suffix: "", label: "Shopify Apps Built Solo", icon: Zap, color: "text-zinc-200" },
  { value: 700, suffix: "+", label: "Native Liquid Sections", icon: Layers, color: "text-zinc-200" },
  { value: 90, suffix: "+", label: "Lighthouse Speed Score", icon: Gauge, color: "text-white" },
  { value: 30, suffix: "+", label: "YouTube Video Tutorials", icon: Video, color: "text-zinc-200" },
  { value: 0, suffix: "ms", label: "External Script Bloat", icon: Cpu, color: "text-white" },
]

/* ─── Flagship Products Built Solo ──────────────────────── */
const FLAGSHIP_PRODUCTS = [
  {
    id: "ai-section-hub",
    title: "AI Section Hub",
    badge: "Solo Engineered & Architected",
    subtitle: "700+ Modular Online Store 2.0 Sections for Any Shopify Theme",
    desc: "Single-handedly architected and coded from scratch. Eliminates the need for recurring monthly page builder apps by giving merchants 700+ native, drag-and-drop Liquid sections directly inside the Shopify Theme Customizer.",
    highlights: [
      "700+ production-ready sections (Shoppable Reels, Sticky Lookbooks, Story Steppers)",
      "Zero external runtime dependencies — pure native Shopify Liquid & CSS",
      "Guaranteed 90+ Lighthouse speed scores with 0ms script overhead",
      "Trusted by over 2,300+ merchants globally across 40+ countries"
    ],
    tech: ["Shopify Liquid", "OS 2.0 Schema", "Vanilla JS", "Tailwind CSS", "CSS3 Animations"],
    link: "https://apps.shopify.com/ai-section-hub",
    buttonLabel: "View on Shopify App Store"
  },
  {
    id: "variant-swatch",
    title: "Variant Swatch App",
    badge: "Solo Built Application",
    subtitle: "High-Converting Visual Product Variant Selectors",
    desc: "Built solo from concept to Shopify App Store deployment. Replaces clunky, conversion-killing dropdown menus with rich, instant visual color swatches, image previews, and grouped pills.",
    highlights: [
      "Instant client-side variant switching with zero page reloads",
      "Custom hex colors, dual-tones, image patterns, and size pills",
      "Direct integration with Shopify Admin GraphQL & Storefront REST APIs",
      "Proven 15% to 25% average lift in product Add-to-Cart conversions"
    ],
    tech: ["React.js", "Shopify GraphQL API", "Storefront API", "Node.js", "Tailwind CSS"],
    link: "https://apps.shopify.com",
    buttonLabel: "Explore App Details"
  }
]

/* ─── Engineering Philosophy & Workflow ─────────────────── */
const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Independent UX & Conversion Research",
    desc: "I don't wait for static Figma handoffs. I analyze top international D2C storefronts, identify conversion drop-offs, and conceptualize interactive shopping UX from scratch based on user psychology.",
    icon: Compass
  },
  {
    step: "02",
    title: "Native Liquid Architecture (0ms Bloat)",
    desc: "Third-party builders load 15+ external tracking scripts. I engineer every section with native Shopify Liquid and JSON schemas, keeping DOM trees light and mobile load times blazing fast.",
    icon: FileCode2
  },
  {
    step: "03",
    title: "Theme Customizer Flexibility",
    desc: "Every section is built with merchant usability in mind. Merchants can change text, images, videos, padding, and layout directly inside Shopify's native editor without writing code.",
    icon: Layers
  },
  {
    step: "04",
    title: "Strict 90+ Speed & Lighthouse Benchmarks",
    desc: "Speed is revenue in e-commerce. I enforce strict performance audits: hardware-accelerated CSS, lazy loading, responsive WebP/AVIF images, and zero layout shifts (CLS 0).",
    icon: Gauge
  },
  {
    step: "05",
    title: "Merchant Education & Support",
    desc: "I've authored 30+ hands-on video tutorials on YouTube showing merchants step-by-step how to configure, customize, and maximize conversions with their new sections.",
    icon: Video
  }
]

/* ─── Specialization Pillars ────────────────────────────── */
const SERVICES = [
  {
    icon: Layers,
    title: "Online Store 2.0 Theme Engineering",
    desc: "Crafting bespoke Shopify themes and modular Liquid sections from scratch. Built natively for Dawn and custom OS 2.0 architectures with seamless drag-and-drop customization.",
    tag: "Native Liquid & OS 2.0"
  },
  {
    icon: Zap,
    title: "Custom Shopify App Architecture",
    desc: "Embedded Shopify applications built using Shopify App Bridge, Admin GraphQL & REST APIs, Storefront API, React, and Node.js backend infrastructure.",
    tag: "Apps & APIs"
  },
  {
    icon: Gauge,
    title: "Page Builder Migration & Speed Optimization",
    desc: "Eliminating heavy page builders like PageFly, GemPages, and Shogun by converting pages into pure native Liquid, boosting mobile Lighthouse scores to 90+.",
    tag: "90+ Lighthouse Speed"
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile Applications",
    desc: "Production-grade iOS and Android mobile apps engineered with React Native, Redux Persist state management, Firebase services, and native device APIs.",
    tag: "React Native"
  }
]

/* ─── Categorized Tech Stack ────────────────────────────── */
const TECH_CATEGORIES = [
  {
    category: "Shopify Ecosystem",
    icon: Terminal,
    skills: [
      "Shopify Liquid",
      "Online Store 2.0",
      "Theme Kit & Shopify CLI",
      "Shopify Admin GraphQL API",
      "Storefront REST API",
      "Checkout Extensibility",
      "Theme Customizer Schemas",
      "Shopify App Bridge"
    ]
  },
  {
    category: "Frontend Engineering",
    icon: Code2,
    skills: [
      "React.js",
      "JavaScript (ES6+)",
      "TypeScript",
      "Tailwind CSS",
      "HTML5 / Semantic Web",
      "CSS3 & Hardware Acceleration",
      "Framer Motion",
      "Mobile-First Responsive Design"
    ]
  },
  {
    category: "Mobile & Backend",
    icon: Smartphone,
    skills: [
      "React Native (iOS & Android)",
      "Redux & Redux Persist",
      "AsyncStorage & Offline State",
      "Node.js & Express",
      "Firebase Auth & Firestore",
      "PostgreSQL",
      "RESTful API Architecture",
      "State Normalization"
    ]
  },
  {
    category: "Performance & Dev Tools",
    icon: Gauge,
    skills: [
      "Google Lighthouse (90+ Scores)",
      "Core Web Vitals (LCP, FID, CLS)",
      "Git & GitHub Version Control",
      "Vite & Webpack",
      "Chrome DevTools Profiling",
      "Postman API Testing",
      "Zero-Bloat Liquid Optimization",
      "Technical Video Tutorials"
    ]
  }
]

/* ─── Why Hire Me ───────────────────────────────────────── */
const WHY_HIRE_ME = [
  {
    title: "Speed Obsessed (90+ Scores)",
    desc: "I treat storefront speed as direct revenue. By replacing slow third-party apps with native Liquid, your store loads sub-second on mobile devices.",
    icon: Gauge
  },
  {
    title: "Self-Directed & Research-Driven",
    desc: "You don't need to micromanage me or supply 50 Figma screens. Give me a goal or reference, and I'll research, design, and code the solution end-to-end.",
    icon: Compass
  },
  {
    title: "Proven Solo Track Record",
    desc: "I have already built 2 production Shopify apps and 700+ sections powering 2,300+ merchants globally. I know production-grade e-commerce inside out.",
    icon: ShieldCheck
  },
  {
    title: "Full Ownership & Communication",
    desc: "From database and API architecture to frontend Liquid and merchant tutorial videos, I take complete responsibility for delivering excellence on time.",
    icon: TrendingUp
  }
]

/* ─── Frequently Asked Questions ────────────────────────── */
const FAQS = [
  {
    q: "What kind of Shopify roles and projects do you take on?",
    a: "I am actively open to full-time software engineering roles (Shopify Developer / Frontend Engineer), long-term contract engagements, and custom freelance theme/app architecture projects for high-growth brands."
  },
  {
    q: "Do you need Figma designs to start building a Shopify theme?",
    a: "No! While I can implement exact Figma or Adobe XD designs pixel-for-pixel, I specialize in independent e-commerce research. I can analyze your brand, research top conversion patterns in your industry, and conceptualize & code high-converting sections from scratch."
  },
  {
    q: "Can you migrate our store away from PageFly or GemPages to increase speed?",
    a: "Yes, this is one of my core specializations. I recode bloated drag-and-drop page builder pages into 100% native Liquid sections that you can edit in the standard Shopify Theme Customizer, eliminating slow scripts and hitting 90+ mobile Lighthouse scores."
  },
  {
    q: "How do your apps and sections achieve zero speed bloat?",
    a: "By leveraging pure Shopify Liquid, clean scoped CSS, and native browser APIs rather than loading heavy external JavaScript bundles, tracking scripts, or redundant CSS frameworks."
  },
  {
    q: "What is your working time zone and communication style?",
    a: "I am based in Surat, Gujarat, India (IST), but I have flexible working hours to overlap with teams in North America (EST/PST), Europe (GMT/CET), Australia (AEST), and India. I communicate proactively via Slack, WhatsApp, email, or video calls."
  }
]

const LINKEDIN_URL = "https://www.linkedin.com/in/mitul-zalavadiya-784873369/"
const PHONE_NUMBER = "+91 9099105448"
const EMAIL_ADDRESS = "mitulzalavadiya10@gmail.com"

export function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useSEO({
    title: "About Mitul Zalavadiya — Shopify Developer & Solo App Creator",
    description: "Mitul Zalavadiya is a Shopify Developer and solo creator of AI Section Hub (700+ sections, 2,300+ merchants) and Variant Swatch based in Surat, India. Specializing in Online Store 2.0, Liquid themes, and speed optimization.",
    canonical: "https://klenzo.app/about",
    keywords: "Mitul Zalavadiya, Shopify developer Surat, AI Section Hub creator, Variant Swatch developer, hire Shopify Liquid developer, Shopify OS 2.0 developer",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://klenzo.app/about#webpage",
        "url": "https://klenzo.app/about",
        "name": "About Mitul Zalavadiya",
        "description": "Learn about Mitul Zalavadiya, Shopify Developer and solo creator of AI Section Hub trusted by 2,300+ global merchants.",
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
        "jobTitle": "Shopify Developer & App Creator",
        "worksFor": { "@id": "https://klenzo.app/#organization" },
        "url": "https://klenzo.app/about",
        "sameAs": [
          "https://www.linkedin.com/in/mitul-zalavadiya-784873369/"
        ]
      }
    ],
  })

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">
      <CursorFollower />
      <Header1 />

      {/* ══ 1. INTERACTIVE SCROLL GLOBE (HERO) ══════════════ */}
      <GlobeScrollDemo />

      {/* ══ 2. STATS HIGHLIGHT ═══════════════════════════════ */}
      <section className="py-16 md:py-20 border-t border-zinc-900 bg-zinc-950/70 relative overflow-hidden">
        <FloatingOrb size={400} color="bg-zinc-900" x="50%" y="20%" delay={0} />
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-5xl mx-auto"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-zinc-900/60 border border-zinc-800 backdrop-blur rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 hover:border-zinc-600 transition-colors duration-300 overflow-hidden shadow-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <s.icon className={`w-4 h-4 ${s.color} mb-0.5`} />
                <span className={`text-2xl md:text-3xl font-black ${s.color}`}>
                  <Counter to={s.value} suffix={s.suffix} duration={2} />
                </span>
                <span className="text-zinc-400 text-[11px] font-semibold leading-tight">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 3. DEVELOPER BIO & PHILOSOPHY ════════════════════ */}
      <section className="py-24 border-t border-zinc-900 bg-black relative overflow-hidden">
        <FloatingOrb size={500} color="bg-zinc-800/20" x="10%" y="30%" delay={1} />
        <div className="container mx-auto max-w-6xl px-6 md:px-8 relative z-10">
          <FadeUp>
            
            {/* Top Introduction Banner */}
            <div className="max-w-4xl mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-300 text-xs uppercase tracking-widest font-semibold mb-4 w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>About My Journey</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-5">
                Hi, I'm Mitul Zalavadiya. <br />
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Shopify Developer &amp; Solo App Creator.
                </span>
              </h2>

              <p className="text-zinc-300 text-sm md:text-base lg:text-lg leading-relaxed mb-6">
                I am a passionate software developer based in Surat, Gujarat. I specialize in crafting custom <strong className="text-white">Shopify Online Store 2.0 themes</strong>, modular Liquid sections, and scalable apps. As a solo creator, I single-handedly designed, coded, and launched <strong className="text-white font-semibold">AI Section Hub (700+ sections)</strong> and <strong className="text-white font-semibold">Variant Swatch</strong> on the official Shopify App Store — now trusted by <strong className="text-white">2,300+ merchants globally</strong>.
              </p>

              {/* Direct Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white text-xs sm:text-sm font-bold transition-all shadow-[0_0_25px_rgba(10,102,194,0.3)] cursor-pointer"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>Connect on LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                </motion.a>

                <motion.a
                  href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs sm:text-sm font-medium transition-all cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Call / WhatsApp</span>
                </motion.a>

                <motion.a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-medium transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Email Me</span>
                </motion.a>
              </div>
            </div>

            {/* Split Bento: Left Philosophy + Right Wireframe Dotted Globe */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (6 Cols): How I Build & Highlights */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                
                {/* How I Build Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center gap-2.5 text-white font-bold text-base">
                    <Compass className="w-5 h-5 text-zinc-300" />
                    <span>How I Build: Self-Driven Research &amp; Zero Bloat</span>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    I don't wait for designer handoffs or rely on heavy, site-slowing page builders like PageFly or GemPages. I independently study top-converting e-commerce storefronts, architect conversion-focused UI/UX from scratch, and engineer pure native Liquid solutions with <strong>0ms script bloat</strong> and consistent <strong>90+ Google Lighthouse speed scores</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800/80">
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                      <span className="block text-xs font-bold text-white mb-0.5">0ms Bloat</span>
                      <span className="text-[11px] text-zinc-400">Zero external builder scripts</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                      <span className="block text-xs font-bold text-white mb-0.5">Self-Designed</span>
                      <span className="text-[11px] text-zinc-400">Independent UX research</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                      <span className="block text-xs font-bold text-white mb-0.5">90+ Speed</span>
                      <span className="text-[11px] text-zinc-400">Google Lighthouse benchmark</span>
                    </div>
                  </div>
                </div>

                {/* Highlights Card */}
                <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs uppercase tracking-widest text-zinc-300 font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-zinc-300" /> Developer Highlights
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold">
                      Verified
                    </span>
                  </div>

                  <ul className="space-y-4 text-xs sm:text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-semibold">2 Production Shopify Apps Built Solo</strong>
                        <span className="text-zinc-400 text-xs">AI Section Hub &amp; Variant Swatch built entirely single-handedly.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-semibold">700+ Native Liquid Sections</strong>
                        <span className="text-zinc-400 text-xs">Zero-bloat modular sections compatible with Dawn &amp; OS 2.0 themes.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-semibold">YouTube Tech Educator</strong>
                        <span className="text-zinc-400 text-xs">Authored 30+ hands-on tutorial videos explaining theme setup &amp; Liquid code.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-semibold">Cross-Platform Mobile Expertise</strong>
                        <span className="text-zinc-400 text-xs">Production React Native, Redux Persist, Firebase, and native APIs.</span>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Surat, Gujarat, India
                    </span>
                    <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Available for Hire
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column (6 Cols): Interactive Wireframe Dotted Earth Globe */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
                  
                  {/* Header info above globe */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-xs uppercase tracking-widest text-zinc-300 font-bold">
                        Global Merchant Footprint
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold font-mono">
                      2,300+ Stores
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 mb-4 leading-relaxed">
                    Stores running my custom themes, modular Liquid sections, and production apps span North America, Europe, Australia, and India.
                  </p>

                  {/* Live Interactive Wireframe Dotted Globe Canvas */}
                  <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 p-2 flex items-center justify-center">
                    <RotatingEarth width={560} height={420} className="w-full" />
                  </div>

                  {/* Footprint Badges */}
                  <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-zinc-800/80 text-center">
                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                      <span className="block text-sm font-black text-white">40+</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Countries</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                      <span className="block text-sm font-black text-white">2.3K+</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Merchants</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                      <span className="block text-sm font-black text-white">90+</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Speed Score</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ 4. FLAGSHIP PRODUCTS BUILT SOLO ═════════════════ */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-950/60 relative overflow-hidden">
        <FloatingOrb size={500} color="bg-zinc-900" x="80%" y="20%" delay={0.5} />
        <div className="container mx-auto max-w-5xl px-6 md:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              Solo Engineering
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              Products I Built Solo
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Every line of code, UI design, and API integration built single-handedly from idea to production on the Shopify App Store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FLAGSHIP_PRODUCTS.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-7 md:p-8 flex flex-col justify-between hover:border-zinc-600 transition-all duration-300 group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold">
                      {prod.badge}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <Zap className="w-3 h-3 text-white" /> Live in Production
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-zinc-200 transition-colors">
                    {prod.title}
                  </h3>
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-400 mb-4">
                    {prod.subtitle}
                  </h4>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {prod.desc}
                  </p>

                  <div className="space-y-2.5 mb-6 pt-4 border-t border-zinc-800/80">
                    {prod.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-zinc-200 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {prod.tech.map((t, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={prod.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
                  >
                    <span>{prod.buttonLabel}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. ENGINEERING WORKFLOW (HOW I WORK) ════════════ */}
      <section className="py-24 border-t border-zinc-900 bg-black relative">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              <Terminal className="w-3.5 h-3.5 text-zinc-300" />
              Developer Process
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              My Engineering Standards
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              How I take an idea from e-commerce conversion research to high-speed Shopify production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORKFLOW_STEPS.map((w, idx) => (
              <motion.div
                key={w.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-zinc-500 group-hover:text-white transition-colors">
                      STEP {w.step}
                    </span>
                    <w.icon className="w-4 h-4 text-zinc-300" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2.5">
                    {w.title}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Final Highlight Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center gap-3"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
              <h3 className="text-base font-bold text-white">90+ Lighthouse Speed Guarantee</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Every theme section and app feature is benchmarked to eliminate bloat, delays, and poor Core Web Vitals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 6. WHAT I SPECIALIZE IN (4 PILLARS) ═════════════ */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950/40 relative">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 text-zinc-300" />
              Developer Specialization
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
              What I Specialize In
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Combining deep Shopify platform architecture with modern frontend performance and native mobile development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICES.map((srv, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 group-hover:scale-105 transition-transform">
                    <srv.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700">
                    {srv.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-zinc-300 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {srv.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. COMPREHENSIVE TECH STACK ═════════════════════ */}
      <section className="py-24 border-t border-zinc-900 bg-black relative">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              <Code2 className="w-3.5 h-3.5 text-zinc-300" />
              Complete Stack
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              Technologies &amp; Tools I Use
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Carefully curated tools for building blazing-fast storefronts, robust apps, and smooth mobile experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TECH_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-7 flex flex-col gap-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{cat.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800/90 text-zinc-300 font-medium hover:border-zinc-500 hover:text-white transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. WORK EXPERIENCE & EDUCATION ══════════════════ */}
      <section id="journey" className="py-24 border-t border-zinc-900 bg-zinc-950/60 relative">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-4">
              <Briefcase className="w-3.5 h-3.5 text-zinc-300" />
              Career &amp; Background
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Experience &amp; Education
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Professional journey building e-commerce software, Shopify apps, and cross-platform mobile apps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Work Experience (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-zinc-300" /> Work Experience
              </h3>

              {/* Solvifytech */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white">Shopify Developer &amp; App Architect</h4>
                    <span className="text-sm text-zinc-300 font-semibold">Solvifytech • Surat, India</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold">
                    Feb 2026 – Present
                  </span>
                </div>
                <ul className="space-y-2 mt-4 text-xs md:text-sm text-zinc-400 leading-relaxed list-disc list-inside">
                  <li>Single-handedly architected and developed <strong className="text-white">AI Section Hub</strong> and <strong className="text-white">Variant Swatch</strong> using Shopify APIs, Liquid, React, and JavaScript.</li>
                  <li>Researched e-commerce UX patterns independently and developed <strong className="text-zinc-200">700+ modular Online Store 2.0 theme sections</strong> (heroes, interactive sliders, shoppable reels, and sticky lookbooks).</li>
                  <li>Focused on high-performance storefront engineering, achieving <strong className="text-zinc-200">90+ Google Lighthouse speed scores</strong> with pure native Liquid code and zero external script overhead.</li>
                  <li>Authored 30+ hands-on tutorial videos on YouTube helping merchants configure and deploy sections.</li>
                </ul>
              </div>

              {/* Identiq Infotech */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white">React Native Mobile Developer</h4>
                    <span className="text-sm text-blue-400 font-semibold">Identiq Infotech • Surat, India</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium">
                    2025
                  </span>
                </div>
                <ul className="space-y-2 mt-4 text-xs md:text-sm text-zinc-400 leading-relaxed list-disc list-inside">
                  <li>Engineered cross-platform mobile applications for iOS and Android using React Native, Redux, Redux Persist, and AsyncStorage.</li>
                  <li>Integrated REST APIs, Firebase backend services, camera features, contact management, and advertising systems.</li>
                  <li>Built persistent state management workflows and smooth native-feel UI animations.</li>
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
                  <p className="text-xs text-zinc-500 mt-1">Core coursework in Software Engineering, Data Structures, Web Technologies, Database Systems.</p>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur hover:border-zinc-700 transition-colors">
                  <h4 className="text-base font-bold text-white">Aspire Public School</h4>
                  <p className="text-sm text-zinc-400">Higher Secondary — Commerce (12th)</p>
                  <p className="text-xs text-zinc-500 mt-2">P. P. Savani Vidhyabhavan — Secondary School (10th)</p>
                </div>
              </div>

              {/* Location & Status Card */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                  <MapPin className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span>Mota Varachha, Surat, Gujarat, India</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Available for global full-time developer roles, contract Shopify theme/app engineering, and high-end freelance storefront performance projects.
                </p>
                <div className="pt-2 flex items-center gap-2 text-zinc-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Actively Accepting Inquiries</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══ 9. WHY MERCHANTS & TEAMS HIRE ME ═══════════════ */}
      <section className="py-24 border-t border-zinc-900 bg-black relative">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
              The Developer Edge
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              Why Work With Me
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              What sets my engineering approach apart from conventional agencies and theme builders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHY_HIRE_ME.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-7 flex gap-4 items-start hover:border-zinc-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 shrink-0 mt-1">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 10. FREQUENTLY ASKED QUESTIONS (FAQ) ════════════ */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-950/60 relative">
        <div className="container mx-auto max-w-4xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
              Questions &amp; Answers
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Common questions about working with me, theme speed, and technical capabilities.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold text-white">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-white" : ""}`} />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ 11. HIRE ME / CONTACT CTA ═══════════════════════ */}
      <section id="contact" className="py-28 border-t border-zinc-900 relative overflow-hidden bg-black">
        <FloatingOrb size={600} color="bg-zinc-900" x="30%" y="0%" delay={0.5} />
        <FloatingOrb size={400} color="bg-zinc-800/20" x="60%" y="40%" delay={2} />
        <div className="relative z-10 container mx-auto max-w-4xl px-6 md:px-8 text-center">
          <FadeUp>
            <motion.div
              className="relative bg-zinc-900/70 border border-zinc-800 rounded-3xl px-8 py-16 md:py-24 backdrop-blur overflow-hidden shadow-2xl"
              whileHover={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />

              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-zinc-900/10 pointer-events-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 text-zinc-300 text-xs uppercase tracking-widest font-bold mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                  Hire Me / Get in Touch
                </span>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.05] mb-5">
                  Looking for a Dedicated{" "}
                  <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    Shopify Developer?
                  </span>
                </h2>
                <p className="text-zinc-400 text-base md:text-lg max-w-lg mx-auto mb-10">
                  Whether you need custom Online Store 2.0 themes, speed optimization, a full-time software engineer, or bespoke Shopify app engineering — I'm ready to build it.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A66C2] text-white font-extrabold text-sm rounded-full shadow-[0_0_35px_rgba(10,102,194,0.35)] hover:shadow-[0_0_50px_rgba(10,102,194,0.5)] transition-all duration-300 cursor-pointer"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    <span>Connect on LinkedIn</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.a>

                  <motion.a
                    href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold text-sm rounded-full border border-zinc-700 hover:border-zinc-500 backdrop-blur transition-all duration-300 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-zinc-300" />
                    <span>Call / WhatsApp</span>
                  </motion.a>

                  <motion.a
                    href={`mailto:${EMAIL_ADDRESS}`}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-zinc-300 hover:text-white font-bold text-sm rounded-full border border-zinc-800 hover:border-zinc-600 backdrop-blur transition-all duration-300 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span>Send Email</span>
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

export default AboutPage
