import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Shield, FileText, CheckCircle2, AlertCircle, Eye, Scale, HelpCircle, BookOpen, CreditCard, Key } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { ClientsSection } from "@/components/ui/testimonial-card"
import type { Stat, Testimonial } from "@/components/ui/testimonial-card"
import { useSEO } from "@/lib/useSEO"

/* ─── Glowing Ambient Orb ───────────────────────────────── */
function GlowingOrb({ size, color, x, y, delay = 0 }: { size: number; color: string; x: string; y: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[120px] opacity-15 pointer-events-none ${color}`}
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -30, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

/* ─── Scroll-Triggered Fade-In ─────────────────────────── */
function FadeUp({ children, delay = 0, className = "", id }: { children: React.ReactNode; delay?: number; className?: string; id?: string }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function TermsPage() {
  const [activeSection, setActiveSection] = useState("agreement")

  useSEO({
    title: "Terms of Service — Mitul Zalavadiya Shopify App Licensing & Use",
    description: "Terms of service cover app licensing, billing, merchant responsibilities, and intellectual property for Shopify apps created by Mitul Zalavadiya.",
    canonical: "https://klenzo.app/terms",
    keywords: "Mitul Zalavadiya terms of service, Shopify app terms, app licensing, billing terms",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://klenzo.app/terms#webpage",
      "url": "https://klenzo.app/terms",
      "name": "Mitul Zalavadiya Terms of Service",
      "description": "Terms of service for AI Section Hub and Variant Swatch Shopify apps by Mitul Zalavadiya.",
      "isPartOf": { "@id": "https://klenzo.app/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://klenzo.app/" },
          { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": "https://klenzo.app/terms" }
        ]
      }
    },
  })

  const sections = [
    { id: "agreement", label: "Agreement to Terms", icon: BookOpen },
    { id: "licensing", label: "App Licensing & Use", icon: Key },
    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
    { id: "responsibilities", label: "Merchant Responsibilities", icon: Eye },
    { id: "intellectual-property", label: "Intellectual Property", icon: Shield },
    { id: "support", label: "Liability & Support", icon: HelpCircle },
  ]

  // Automatically update active section on scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-30% 0px -55% 0px" } // Highlight active section when it is in the center view
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const statsData: Stat[] = [
    { value: "100+", label: "Happy clients" },
    { value: "$250M+", label: "Revenue added" },
    { value: "4.9", label: "Average Rating" },
  ]

  const testimonialsData: Testimonial[] = [
    {
      name: "Will Smith",
      title: "Harper Education",
      quote: "Collaborating with Mitul was seamless. The vision was clearly understood, and the designs genuinely reflect my brand identity.",
      avatarSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&auto=format&fit=crop&q=60",
      rating: 5.0,
    },
    {
      name: "Ikta Sollork",
      title: "PARAL CEO",
      quote: "Working with this process was effortless. The vision was understood perfectly, and the designs truly represent my brand.",
      avatarSrc: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=900&auto=format&fit=crop&q=60",
      rating: 4.7,
    },
    {
      name: "Alex Johnson",
      title: "Innovate Tech",
      quote: "A truly transformative partnership. The end result exceeded all of our expectations and has set a new standard in our industry.",
      avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60",
      rating: 4.9,
    },
  ]

  return (
    <div className="relative min-h-screen bg-black text-white">
      <CursorFollower />
      <Header1 />

      {/* Background Orbs (Clipped inside overflow-hidden wrapper to preserve sticky positioning) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <GlowingOrb size={600} color="bg-zinc-900" x="70%" y="-10%" delay={0} />
        <GlowingOrb size={500} color="bg-zinc-900" x="-10%" y="25%" delay={2} />
        <GlowingOrb size={400} color="bg-zinc-900" x="40%" y="60%" delay={4} />
      </div>

      <main className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 pt-36 pb-32">
        {/* Clients Testimonials Section */}
        <ClientsSection
          tagLabel="Happy Clients"
          title="Merchants Love Our Apps"
          description="Trusted by 100+ happy clients, adding $250M+ in revenue across the Shopify ecosystem."
          stats={statsData}
          testimonials={testimonialsData}
          primaryActionLabel="Contact Support"
          secondaryActionLabel="Explore Apps"
          className="py-0 pb-20 md:pb-28"
        />

        {/* Header Section */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeUp>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-850 bg-zinc-900/60 backdrop-blur text-zinc-400 text-xs uppercase tracking-widest font-bold mb-6">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              Legal Guidelines
            </span>
          </FadeUp>
          
          <FadeUp delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-6">
              Terms of{" "}
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl font-medium">
              Last updated: July 2026. Please read these terms carefully before installing our applications or integrating templates into your Shopify store.
            </p>
          </FadeUp>
        </div>

        {/* Layout: Sidebar Navigation & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky Sidebar Navigation (Desktop) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28">
              <FadeUp delay={0.25}>
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-3 px-3">
                    Document Sections
                  </span>
                  {sections.map((s) => {
                    const Icon = s.icon
                    const isActive = activeSection === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                          ? "bg-zinc-850 text-white border border-zinc-700/65 shadow-md"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border border-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </FadeUp>
            </div>
          </div>

          {/* Policy Text Content (Right Column) */}
          <div className="lg:col-span-8 flex flex-col gap-12 relative">
            {/* Agreement to Terms */}
            <FadeUp delay={0.3} className="scroll-mt-28" id="agreement">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <BookOpen className="w-5.5 h-5.5 text-zinc-400" />
                  1. Agreement to Terms
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    By installing, configuring, or using our applications (including <strong>AI Section Hub</strong> and <strong>Variant Swatch</strong>) from the Shopify App Store, you agree to comply with and be bound by these Terms of Service.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between Mitul Zalavadiya ("we", "our", "us") and the merchant ("you", "your", "store owner") operating the Shopify store. If you do not agree to these terms, you must uninstall our applications immediately.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* App Licensing & Use */}
            <FadeUp delay={0.35} className="scroll-mt-28" id="licensing">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Key className="w-5.5 h-5.5 text-zinc-400" />
                  2. App Licensing & Use
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    Mitul Zalavadiya grants you a non-exclusive, non-transferable, revocable license to install and use our custom Liquid sections on your specific registered Shopify store.
                  </p>
                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-zinc-300">Licensing Guidelines:</span>
                    <ul className="list-disc list-inside flex flex-col gap-2.5 text-xs text-zinc-400">
                      <li>One subscription license is strictly restricted to one single active Shopify store.</li>
                      <li>You may modify the generated Liquid/CSS template code for your own design customization purposes.</li>
                      <li>You are strictly prohibited from redistributing, selling, or repackaging our template codes.</li>
                      <li>You may not use our section assets on third-party, non-Shopify e-commerce platforms.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Subscription & Billing */}
            <FadeUp delay={0.4} className="scroll-mt-28" id="billing">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <CreditCard className="w-5.5 h-5.5 text-zinc-400" />
                  3. Subscription & Billing
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    All billing operations, subscription payments, app trials, and subscription upgrades are managed natively through the official Shopify Billing API system.
                  </p>
                  <p>
                    <strong>Trial Periods:</strong> Some subscription packages include a free trial period. You will be automatically charged standard monthly rates upon trial expiration unless you uninstall the application before the trial ends.
                  </p>
                  <p>
                    <strong>Refunds:</strong> Since operations are handled by the Shopify billing engine, refund requests must be requested through Shopify dashboard policies. We do not process manual payment transfers or store direct merchant credit card profiles.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Merchant Responsibilities */}
            <FadeUp delay={0.45} className="scroll-mt-28" id="responsibilities">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Eye className="w-5.5 h-5.5 text-zinc-400" />
                  4. Merchant Responsibilities
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    As a merchant using our widgets, you carry the responsibility of maintaining your store theme integrity. You agree that:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      You will comply with Shopify's general terms
                    </li>
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      You will not inject malicious codes into widgets
                    </li>
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      You will not scrape sections data catalog
                    </li>
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      You are responsible for variant content assets
                    </li>
                  </ul>
                </div>
              </div>
            </FadeUp>

            {/* Intellectual Property */}
            <FadeUp delay={0.5} className="scroll-mt-28" id="intellectual-property">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Shield className="w-5.5 h-5.5 text-zinc-400" />
                  5. Intellectual Property
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    All app design, layout custom scripts, interactive WebGL components, swatches templates catalog, branding elements, and intellectual property remain the exclusive property of Mitul Zalavadiya.
                  </p>
                  <p>
                    Your license grants you access to use these components, but does not transfer any trademark, patents, copyright, or core intellectual ownership to you or your Shopify store entity.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Liability & Support */}
            <FadeUp delay={0.55} className="scroll-mt-28" id="support">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Scale className="w-5.5 h-5.5 text-zinc-400" />
                  6. Limitation of Liability & Support
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    Our apps are provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for maximum compatibility, we are not liable for any revenue losses, layout shifts, or site downtime caused by template integrations.
                  </p>
                  
                  <div className="border border-zinc-800 bg-zinc-900/60 rounded-2xl p-5 flex items-start gap-3 mt-2">
                    <AlertCircle className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">Direct Support Guarantee</span>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                        If any section breaks your theme, our founder is available to fix it manually. You can reach out directly via our contact form or send a message to <a href="mailto:mitulzalavadiya10@gmail.com" className="text-white font-semibold underline">mitulzalavadiya10@gmail.com</a>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  )
}
