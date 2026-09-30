import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"
import { 
  Sparkles, CheckCircle2, ArrowUpRight, Star, 
  ChevronRight, ExternalLink, Check, X
} from "lucide-react"

import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { useSEO } from "@/lib/useSEO"
import { trackAppInstallClick } from "@/components/ui/AnalyticsTracker"
import OrbitDeliveryHero from "@/components/ui/orbit-delivery-hero"

// Assets
import klenzoLogo from "@/images/klenzo logo.jpg"
import klenzoVideo from "@/videos/klenzo ai vriant main video.mp4"

// AI Section Hub Preview Images
import sectionImg1 from "@/ai section hub images/1 line images/Theory Hero Banner.png"
import sectionImg2 from "@/ai section hub images/1 line images/shop-by-category-preview.png"
import sectionImg3 from "@/ai section hub images/2 line images/alo-hero-section.png"
import sectionImg4 from "@/ai section hub images/2 line images/purevea-glass-split.png"

export function ShopifyAppsPage() {
  useSEO({
    title: "Shopify Apps by Mitul Zalavadiya — AI Section Hub & Variant Swatch",
    description: "Discover production-grade Shopify apps built by Mitul Zalavadiya. AI Section Hub (700+ native Liquid sections) and Klenzo: Variant Swatch (AI visual swatches) trusted by 2,300+ merchants.",
    canonical: "https://klenzo.app/shopify-apps",
    keywords: "Shopify apps, AI Section Hub, Klenzo Variant Swatch, Shopify Liquid sections, color swatches, Mitul Zalavadiya apps",
  })

  const [activeAppTab, setActiveAppTab] = useState<"all" | "section-hub" | "variant-swatch">("all")
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const sectionHubFeatures = [
    {
      title: "700+ Native Liquid Sections",
      description: "Curved scroll carousels, 3D lookbooks, sticky layered heroes, WhatsApp chat, and flash sale countdowns."
    },
    {
      title: "Zero Speed Compromise (0ms Impact)",
      description: "Written in native Shopify Liquid and CSS. No render-blocking external scripts or heavy client-side SDKs."
    },
    {
      title: "Shoppable Instagram Reels & Video",
      description: "Embed high-converting shoppable video feeds directly onto product and collection pages."
    },
    {
      title: "1-Click Direct Theme Injection",
      description: "Sections install directly into your native Shopify Theme Customizer with full drag-and-drop support."
    }
  ]

  const variantSwatchFeatures = [
    {
      title: "AI-Powered Variant Detection",
      description: "Automatically analyzes product titles, tags, and images to generate custom color and picture swatches."
    },
    {
      title: "Replaces Native Dropdowns",
      description: "Turns frustrating drop-down select boxes into visual, clickable pills, color chips, and image tiles."
    },
    {
      title: "Dual Collection & Product Support",
      description: "Display swatches on collection grid cards and product detail pages with instant variant image change."
    },
    {
      title: "Theme Independent Architecture",
      description: "Engineered to work seamlessly across Dawn, Prestige, Impulse, Sense, and custom headless themes."
    }
  ]

  const faqs = [
    {
      q: "Do your Shopify apps require coding or Liquid template editing?",
      a: "No! Both AI Section Hub and Klenzo: Variant Swatch feature 1-click zero-code installations. Everything integrates directly into your native Shopify Theme Customizer with simple toggle and styling controls."
    },
    {
      q: "Will installing these apps slow down my store's Google Lighthouse score?",
      a: "No. Unlike traditional page builders that inject megabytes of bloated JavaScript, our apps render lightweight native Liquid templates directly on Shopify's lightning-fast edge CDN servers with 0ms speed impact."
    },
    {
      q: "Are the apps compatible with Shopify Online Store 2.0 (OS 2.0)?",
      a: "Yes, 100%. All apps and sections strictly follow Shopify's official OS 2.0 architecture and theme app extension guidelines."
    },
    {
      q: "Can I request custom Liquid sections or bespoke app features?",
      a: "Absolutely! Mitul Zalavadiya builds bespoke Shopify themes, sections, and private custom apps tailored to individual brand requirements."
    }
  ]

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-zinc-700 selection:text-white">
      <CursorFollower />

      {/* ── ORBIT DELIVERY 3D HERO (full prompt: copy, clouds, drag-to-rotate 3D) ── */}
      <section
        aria-label="Orbit Delivery interactive 3D hero"
        className="relative z-20 w-full overflow-hidden"
      >
        <OrbitDeliveryHero theme="dark" />
      </section>

      <Header1 />

      <main className="relative z-10 pt-28 md:pt-36 pb-24">
        {/* ── HERO SECTION ── */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-20 md:mb-28">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-white/[0.04] to-zinc-500/[0.06] blur-[140px] pointer-events-none rounded-full" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-300 text-xs uppercase tracking-widest font-headings font-semibold mb-6 shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Production-Grade Shopify Ecosystem</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-headings font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6"
          >
            Shopify Apps Built to Scale{" "}
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Store Conversions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Engineered by <span className="text-zinc-100 font-semibold">Mitul Zalavadiya</span>. 
            Native Liquid sections, AI-driven variant swatch selector, and zero-compromise page speed for 2,300+ merchants worldwide.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4"
          >
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">2,300+</div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1">Merchants Trust</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">700+</div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1">Liquid Sections</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-1">
                <span>4.9</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1">Store Rating</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">0ms</div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1">Speed Impact</div>
            </div>
          </motion.div>
        </section>

        {/* ── APP FILTER TABS ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-2 p-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 max-w-md mx-auto backdrop-blur-md">
            <button
              onClick={() => setActiveAppTab("all")}
              className={`flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeAppTab === "all" ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              All Apps (2)
            </button>
            <button
              onClick={() => setActiveAppTab("section-hub")}
              className={`flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeAppTab === "section-hub" ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              AI Section Hub
            </button>
            <button
              onClick={() => setActiveAppTab("variant-swatch")}
              className={`flex-1 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeAppTab === "variant-swatch" ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              Variant Swatch
            </button>
          </div>
        </section>

        {/* ── DETAILED APP CARDS ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 md:space-y-28">

          {/* ════ APP 1: AI SECTION HUB ════ */}
          {(activeAppTab === "all" || activeAppTab === "section-hub") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl bg-zinc-950/70 border border-zinc-800/90 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.02)]"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/20 blur-[100px] pointer-events-none rounded-full" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Column: Info & Action */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-700 text-zinc-300">
                      FLAGSHIP APP • 700+ SECTIONS
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>4.9 / 5.0 (2,300+ merchants)</span>
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-extrabold text-white tracking-tight leading-tight">
                      AI Section Hub
                    </h2>
                    <p className="text-zinc-400 text-base sm:text-lg mt-3 leading-relaxed">
                      Instant library of 700+ premium native Shopify sections, shoppable Instagram reels, lookbooks, sticky grids, and dynamic conversion widgets — zero code required.
                    </p>
                  </div>

                  {/* Feature list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {sectionHubFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">{feat.title}</h4>
                          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{feat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-4">
                    <motion.a
                      href="https://apps.shopify.com/ai-section-hub"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAppInstallClick('AI Section Hub', 'Apps Page Direct Install')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-3.5 rounded-full bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Install Free on Shopify</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.a>

                    <motion.a
                      href="/docs.html"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-semibold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Documentation</span>
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                    </motion.a>

                    <Link
                      to="/guide"
                      className="px-4 py-3.5 rounded-full text-zinc-400 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>30+ Video Tutorials</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Visual Section Showcase Grid */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
                  <div className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 aspect-[4/3] relative">
                    <img 
                      src={sectionImg1} 
                      alt="Theory Hero Banner Section" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-bold text-white">Theory Luxury Hero Banner</span>
                    </div>
                  </div>

                  <div className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 aspect-[4/3] relative">
                    <img 
                      src={sectionImg2} 
                      alt="Shop by Category Preview" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-bold text-white">Interactive Category Slider</span>
                    </div>
                  </div>

                  <div className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 aspect-[4/3] relative">
                    <img 
                      src={sectionImg3} 
                      alt="Alo Yoga Style Hero Section" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-bold text-white">Athletic Hero Layout</span>
                    </div>
                  </div>

                  <div className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 aspect-[4/3] relative">
                    <img 
                      src={sectionImg4} 
                      alt="Glass Split Promo Banner" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-bold text-white">Glassmorphism Split Banner</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ APP 2: KLENZO VARIANT SWATCH ════ */}
          {(activeAppTab === "all" || activeAppTab === "variant-swatch") && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl bg-zinc-950/70 border border-zinc-800/90 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.02)]"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-zinc-800/20 blur-[100px] pointer-events-none rounded-full" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Column: Video Demonstration */}
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                    <video
                      src={klenzoVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live App Preview</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Info & Action */}
                <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-700 text-zinc-300">
                      AI SWATCH TECHNOLOGY
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
                      Free Trial Available
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img 
                      src={klenzoLogo} 
                      alt="Klenzo Variant Swatch Logo" 
                      className="w-12 h-12 rounded-xl object-contain border border-zinc-700" 
                    />
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-headings font-extrabold text-white tracking-tight">
                        Klenzo: Variant Swatch
                      </h2>
                      <p className="text-xs text-zinc-400 font-medium">Auto-Detecting Variant Color & Image Swatches</p>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                    Say goodbye to boring, high-friction dropdown menus. Transform Shopify variant options into sleek color circles, product image swatches, and clickable buttons with zero code.
                  </p>

                  {/* Feature list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {variantSwatchFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">{feat.title}</h4>
                          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{feat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-4">
                    <motion.a
                      href="https://apps.shopify.com/klenzo-product-variant-swatch"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAppInstallClick('Klenzo: Variant Swatch', 'Apps Page Direct Install')}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-3.5 rounded-full bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Install Free on Shopify</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.a>

                    <motion.a
                      href="/klenzo-variant-swatch-doc.html"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-5 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-semibold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>User Documentation</span>
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </section>

        {/* ── ARCHITECTURAL COMPARISON: KLENZO APPS VS BLOATED PAGE BUILDERS ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto my-24 md:my-32">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
              ARCHITECTURAL ADVANTAGE
            </span>
            <h3 className="text-3xl sm:text-5xl font-headings font-extrabold text-white tracking-tight">
              Why Klenzo Apps Outperform Traditional Page Builders
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base mt-3">
              Traditional page builders inject hundreds of kilobytes of render-blocking JavaScript. We build with native Liquid that runs natively on Shopify servers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-300">
                  <th className="py-4 px-6 font-bold">Feature / Performance Metric</th>
                  <th className="py-4 px-6 font-bold text-white bg-zinc-800/40">Klenzo Apps (Native Liquid)</th>
                  <th className="py-4 px-6 font-bold text-zinc-400">Traditional Page Builders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="py-4 px-6 font-medium text-zinc-200">Mobile Speed & Google Lighthouse Impact</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-zinc-800/20 flex items-center gap-2">
                    <Check className="w-4 h-4" /> 0ms impact (90+ Lighthouse Score)
                  </td>
                  <td className="py-4 px-6 text-red-400 font-medium">
                    <span className="flex items-center gap-2"><X className="w-4 h-4" /> Heavy -15 to -30 point drop</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-zinc-200">Native Shopify Theme Customizer Integration</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-zinc-800/20">
                    <span className="flex items-center gap-2"><Check className="w-4 h-4" /> 100% Native OS 2.0 blocks</span>
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    Isolated external iframes & slow sync
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-zinc-200">Clean Theme Uninstall (Zero Orphan Scripts)</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-zinc-800/20">
                    <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Clean removal via Shopify App Embed</span>
                  </td>
                  <td className="py-4 px-6 text-red-400">
                    <span className="flex items-center gap-2"><X className="w-4 h-4" /> Leaves behind orphan code</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-zinc-200">Monthly App Subscription Cost</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold bg-zinc-800/20">
                    Free trial & low transparent pricing
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    Expensive ($29–$199/month tiers)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto my-24">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-zinc-400">FAQ</span>
            <h3 className="text-3xl sm:text-4xl font-headings font-extrabold text-white mt-1">
              Shopify Apps Questions & Answers
            </h3>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-headings font-bold text-white text-base sm:text-lg cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ml-4 ${activeFaq === idx ? "rotate-90 text-white" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-6 sm:px-6 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-zinc-800/60 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CALL TO ACTION ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-28">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-black p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Ready to transform your Shopify store?</span>
            </span>

            <h3 className="text-3xl sm:text-5xl font-headings font-black text-white tracking-tight mb-4">
              Explore Our Apps or Build Bespoke Storefronts
            </h3>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base mb-8">
              Install AI Section Hub and Klenzo: Variant Swatch directly on Shopify, or partner with Mitul Zalavadiya for custom e-commerce engineering.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.a
                href="https://apps.shopify.com/partners/solvify-tech2"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-full bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all shadow-xl inline-flex items-center gap-2 cursor-pointer"
              >
                <span>View All Apps on Shopify</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>

              <Link
                to="/shopify-website"
                className="px-6 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-sm transition-all inline-flex items-center gap-2"
              >
                <span>Explore Shopify Websites (3D Gallery)</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <MinimalFooter />
    </div>
  )
}

export default ShopifyAppsPage
