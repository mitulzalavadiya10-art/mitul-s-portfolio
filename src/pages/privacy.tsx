import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Shield, Lock, FileText, CheckCircle2, AlertCircle, Eye, RefreshCw, Scale, HelpCircle } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
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

export function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("intro")

  useSEO({
    title: "Privacy Policy — Mitul Zalavadiya Shopify Apps | Data Protection",
    description: "Privacy policy explains what data our Shopify apps collect, how it's stored securely, and your full rights as a merchant. Last updated July 2026.",
    canonical: "https://klenzo.app/privacy",
    keywords: "Mitul Zalavadiya privacy policy, Shopify app data protection, GDPR Shopify app",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://klenzo.app/privacy#webpage",
      "url": "https://klenzo.app/privacy",
      "name": "Mitul Zalavadiya Privacy Policy",
      "description": "Privacy policy for AI Section Hub and Variant Swatch Shopify apps by Mitul Zalavadiya.",
      "isPartOf": { "@id": "https://klenzo.app/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://klenzo.app/" },
          { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://klenzo.app/privacy" }
        ]
      }
    },
  })

  const sections = [
    { id: "intro", label: "Introduction", icon: FileText },
    { id: "data-collection", label: "Data Collection", icon: Eye },
    { id: "data-usage", label: "Data Usage", icon: RefreshCw },
    { id: "security", label: "Data Security", icon: Lock },
    { id: "third-party", label: "Third-Party Sharing", icon: Shield },
    { id: "rights", label: "Merchant Rights", icon: Scale },
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

  return (
    <div className="relative min-h-screen bg-black text-white">
      <CursorFollower />
      <Header1 />

      {/* Background Orbs (Clipped inside overflow-hidden box to protect sticky scroll container) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <GlowingOrb size={600} color="bg-zinc-900" x="70%" y="-10%" delay={0} />
        <GlowingOrb size={500} color="bg-zinc-900" x="-10%" y="25%" delay={2} />
        <GlowingOrb size={400} color="bg-zinc-900" x="40%" y="60%" delay={4} />
      </div>

      <main className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 pt-36 pb-32">
        {/* Header Section */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeUp>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-850 bg-zinc-900/60 backdrop-blur text-zinc-400 text-xs uppercase tracking-widest font-bold mb-6">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              Privacy Assurance
            </span>
          </FadeUp>
          
          <FadeUp delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-6">
              Privacy{" "}
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl font-medium">
              Last updated: July 2026. This policy outlines how our applications collect, protect, and use shop information to deliver lightning-fast store customization sections.
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
            {/* Introduction */}
            <FadeUp delay={0.3} className="scroll-mt-28" id="intro">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <FileText className="w-5.5 h-5.5 text-zinc-400" />
                  1. Introduction
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    Welcome. We design high-performance, intelligent applications for Shopify stores. We understand how crucial data privacy is to our merchants and their buyers.
                  </p>
                  <p>
                    This Privacy Policy covers the operations of our apps <strong>AI Section Hub</strong> and <strong>Variant Swatch</strong>. It explains what data we capture when you install our apps, how that data is stored, and the strict guidelines we follow to ensure complete protection.
                  </p>
                  <p>
                    By installing and using our apps, you agree to the collection and use of information in accordance with this policy. If you have any concerns, you can contact our core engineering team directly.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Data Collection */}
            <FadeUp delay={0.35} className="scroll-mt-28" id="data-collection">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Eye className="w-5.5 h-5.5 text-zinc-400" />
                  2. Data Collection
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    To deliver our visual builder and swatch variants, we only collect the minimum amount of shop metadata required. We strictly avoid collecting unnecessary merchant data.
                  </p>
                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-zinc-300">Information We Collect:</span>
                    <ul className="list-disc list-inside flex flex-col gap-2.5 text-xs text-zinc-400">
                      <li>Shopify store domain name (e.g. <code>yourstore.myshopify.com</code>) to register billing.</li>
                      <li>Merchant email address linked to the store for urgent technical notices.</li>
                      <li>Theme templates layout settings (only the sections styling configurations configured by you).</li>
                      <li>Public variant properties metadata for swatches rendering.</li>
                      <li>Shopify API Access Token (encrypted) to sync settings and templates.</li>
                    </ul>
                  </div>

                  <p className="mt-2">
                    Our apps request the following minimal Shopify API scopes:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-zinc-400">
                    <li className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-850 px-4 py-2.5 rounded-lg">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full shrink-0" />
                      <code>read_themes</code> & <code>write_themes</code>: To add widgets.
                    </li>
                    <li className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-850 px-4 py-2.5 rounded-lg">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full shrink-0" />
                      <code>read_products</code>: To read public variant info.
                    </li>
                  </ul>

                  <div className="border border-zinc-800 bg-zinc-900/60 rounded-2xl p-5 flex items-start gap-3 mt-4">
                    <AlertCircle className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">Zero Customer Personal Data Collected</span>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                        Our applications do NOT collect, read, or store any Personal Identifiable Information (PII) of your end-customers. We do not read buyer emails, phone numbers, billing addresses, or checkout histories.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Data Usage */}
            <FadeUp delay={0.4} className="scroll-mt-28" id="data-usage">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5.5 h-5.5 text-zinc-400" />
                  3. Data Usage
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    The collected configuration details are strictly used to render widgets and customize theme templates layout:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      Rendering native Liquid sections on theme layouts
                    </li>
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      Syncing custom color values for variant swatches
                    </li>
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      Validating subscription status through Shopify billing
                    </li>
                    <li className="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl flex gap-2.5 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      Providing custom layout shift resolution support
                    </li>
                  </ul>
                  <p className="mt-2 text-zinc-500 text-xs">
                    We only use this data to perform core app operations. We do not engage in any analytics profiling, advertising targeting, or automatic marketing automation using your merchant email or store configurations.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Data Security */}
            <FadeUp delay={0.45} className="scroll-mt-28" id="security">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Lock className="w-5.5 h-5.5 text-zinc-400" />
                  4. Data Security
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    Security is central to our tech stack. We use industry-leading standards to safeguard the configurations of your store:
                  </p>
                  <p>
                    All configurations are stored in secure Postgres databases hosted with top-tier database providers. Communication between Shopify storefronts and our application core is fully encrypted using SSL/TLS protocols.
                  </p>
                  <p>
                    Access to app database backends is restricted only to authorized developers for technical maintenance tasks.
                  </p>
                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-zinc-300">Infrastructure Details:</span>
                    <ul className="list-disc list-inside flex flex-col gap-1 text-xs text-zinc-500">
                      <li>Database hosting: Encrypted AWS RDS PostgreSQL / Supabase storage.</li>
                      <li>Server hosting: Secure Vercel endpoints with DDoS protection.</li>
                      <li>Access tokens: AES-256-GCM symmetric key encryption at rest.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Third-Party Sharing */}
            <FadeUp delay={0.5} className="scroll-mt-28" id="third-party">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Shield className="w-5.5 h-5.5 text-zinc-400" />
                  5. Third-Party Sharing
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    <strong>We do not sell, rent, or lease your store data to third parties.</strong>
                  </p>
                  <p>
                    Data is only shared when absolutely required by system providers to deliver services (e.g. database host, Shopify platform checkouts, billing gateways). All third-party tools are compliant with GDPR and Shopify API platform guidelines.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Merchant Rights */}
            <FadeUp delay={0.55} className="scroll-mt-28" id="rights">
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-8 backdrop-blur hover:border-zinc-700/50 transition-colors duration-300">
                <h2 className="text-white text-2xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
                  <Scale className="w-5.5 h-5.5 text-zinc-400" />
                  6. Merchant Rights
                </h2>
                <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-4">
                  <p>
                    You have complete authority over your store data. Under Shopify platform guidelines, you can request details of the data we hold or request data erasure at any time:
                  </p>
                  <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-zinc-300">Data Deletion on Uninstall:</span>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      When you uninstall AI Section Hub or Variant Swatch from your Shopify dashboard, our system triggers an automated webhook. All cached settings are scheduled for absolute data deletion within 48 hours.
                    </p>
                  </div>

                  {/* Manual Request Contact Box */}
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4 mt-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5 text-zinc-200" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Have a deletion request?</p>
                      <p className="text-zinc-500 text-[11px] mt-0.5">
                        Send a message to{" "}
                        <a href="mailto:mitulzalavadiya10@gmail.com" className="text-white font-semibold underline">
                          mitulzalavadiya10@gmail.com
                        </a>.
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
