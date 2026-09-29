import { useState, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight, Globe, Briefcase, Code2, MessageCircle } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { useSEO } from "@/lib/useSEO"
import { addLead } from "@/lib/blogStore"

/* ─── 3D Rotating Connection Globe ───────────────────────── */
function RotatingGlobe() {
  const pointsRef = useRef<THREE.Points>(null)

  const count = 400
  const tempPositions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2.0 * Math.PI
    const phi = Math.acos(2.0 * v - 1.0)
    const r = 3.2
    tempPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    tempPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    tempPositions[i * 3 + 2] = r * Math.cos(phi)
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05
    }
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[tempPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ffffff"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
        />
      </points>

      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#3f3f46"
          wireframe={true}
          transparent={true}
          opacity={0.12}
        />
      </mesh>
    </group>
  )
}

/* ─── Floating Label Inputs ────────────────────── */
function FloatingInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  const isFilled = value.length > 0

  return (
    <div className="relative w-full group mb-5">
      <motion.div
        className="absolute -inset-1 rounded-xl bg-zinc-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none blur-sm"
        animate={{ opacity: isFocused ? 0.15 : 0 }}
      />
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white rounded-xl px-4 py-4 text-sm text-white outline-none transition-all duration-300 relative z-10"
      />
      <motion.label
        htmlFor={id}
        initial={{ y: 0 }}
        animate={{
          y: isFocused || isFilled ? -28 : 0,
          scale: isFocused || isFilled ? 0.85 : 1,
          color: isFocused ? "#ffffff" : "#71717a",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute left-4 top-4 text-sm font-medium tracking-wide pointer-events-none select-none z-20 origin-left"
      >
        {label} {required && <span className="text-red-400">*</span>}
      </motion.label>
    </div>
  )
}

export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [activeTab, setActiveTab] = useState<"project" | "sections" | "hiring">("project")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useSEO({
    title: "Contact Mitul Zalavadiya — Shopify Developer & App Architect",
    description: "Get in touch with Mitul Zalavadiya for custom Shopify theme development, bespoke Liquid sections, Shopify app engineering, or freelance & full-time roles. Email: mitulzalavadiya10@gmail.com, Phone: +91 9099105448.",
    canonical: "https://klenzo.app/contact",
    keywords: "contact Mitul Zalavadiya, hire Shopify developer Surat, freelance Shopify engineer, custom liquid developer contact, AI Section Hub developer",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": "https://klenzo.app/contact#webpage",
      "url": "https://klenzo.app/contact",
      "name": "Contact Mitul Zalavadiya",
      "description": "Direct contact page for Mitul Zalavadiya — Shopify developer and full-stack software engineer based in Surat, Gujarat.",
      "mainEntity": {
        "@type": "Person",
        "name": "Mitul Zalavadiya",
        "jobTitle": "Shopify Developer & Shopify App Architect",
        "email": "mitulzalavadiya10@gmail.com",
        "telephone": "+919099105448",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Mota Varachha, Surat",
          "addressRegion": "Gujarat",
          "addressCountry": "India"
        }
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setIsSubmitting(true)
    try {
      const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "f99f1a70-4774-46cf-9c2d-b4a712985a9b"
      const tabLabel = activeTab === "project" ? "Shopify Project" : activeTab === "sections" ? "Custom Liquid Section" : "Hiring / Role"
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: apiKey,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          message: formData.message,
          from_name: "Mitul Zalavadiya Portfolio",
          subject: `Portfolio Inquiry from ${formData.name} [${tabLabel}]`,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setIsSuccess(true)
        addLead(formData.email, "portfolio-contact", `Name: ${formData.name} | Phone: ${formData.phone} | Type: ${tabLabel} | Msg: ${formData.message}`)
      } else {
        addLead(formData.email, "portfolio-contact", `Name: ${formData.name} | Phone: ${formData.phone} | Type: ${tabLabel} | Msg: ${formData.message}`)
        setIsSuccess(true)
      }
    } catch (err) {
      console.error("Contact submit error:", err)
      addLead(formData.email, "portfolio-contact", `Name: ${formData.name} | Phone: ${formData.phone} | Msg: ${formData.message}`)
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", message: "" })
    setIsSuccess(false)
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-white selection:text-black">
      <CursorFollower />
      <Header1 />

      {/* Background Visual Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-zinc-800/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] bg-zinc-900/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />
      </div>

      <main className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pt-36 pb-32">
        {/* Page Title & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur shadow-md text-zinc-300 text-[11px] md:text-xs uppercase tracking-widest font-black mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Open for Freelance &amp; Full-Time Opportunities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6"
          >
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent relative">
              Exceptional.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Looking for a custom Shopify theme, bespoke Liquid sections, or app engineering? Reach out directly—I typically respond within 2–3 hours.
          </motion.p>
        </div>

        {/* Dynamic Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: 3D Visual Box & Personal Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* 3D WebGL Canvas Globe */}
            <div className="relative h-[260px] md:h-[300px] bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur flex items-center justify-center shadow-2xl group hover:border-zinc-700 transition-all duration-300">
              <div className="absolute inset-0 z-0">
                <Suspense fallback={
                  <div className="absolute inset-0 flex items-center justify-center text-white/50">
                    <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
                  </div>
                }>
                  <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={1.5} />
                    <RotatingGlobe />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
                  </Canvas>
                </Suspense>
              </div>

              {/* Status Badge overlay */}
              <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-zinc-950/85 border border-zinc-800 px-3.5 py-1.5 rounded-full select-none shadow-md">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-zinc-200 text-xs font-bold uppercase tracking-wider">Mitul Online</span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 z-10 pointer-events-none select-none">
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  Surat, Gujarat, India
                </p>
                <p className="text-white text-base font-bold mt-1">Available for Remote Worldwide &amp; Hybrid</p>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 gap-3.5">
              
              {/* Email Card */}
              <a
                href="mailto:mitulzalavadiya10@gmail.com"
                className="bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 group shadow-sm hover:bg-zinc-900/40"
              >
                <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-zinc-300 group-hover:text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Direct Email</span>
                  <span className="text-white text-sm font-bold truncate block group-hover:text-zinc-200 transition-colors">
                    mitulzalavadiya10@gmail.com
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              </a>

              {/* Phone & WhatsApp Card */}
              <a
                href="tel:9099105448"
                className="bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 group shadow-sm hover:bg-zinc-900/40"
              >
                <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-zinc-300 group-hover:text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Phone &amp; WhatsApp</span>
                  <span className="text-white text-sm font-bold block group-hover:text-zinc-200 transition-colors">
                    +91 9099105448
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    Call / Chat
                  </span>
                </div>
              </a>

              {/* Location Card */}
              <div className="bg-zinc-950/80 border border-zinc-850 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Location</span>
                  <span className="text-zinc-200 text-sm font-bold block">
                    Mota Varachha, Surat, Gujarat
                  </span>
                </div>
              </div>

              {/* Availability & Response Time Card */}
              <div className="bg-zinc-950/70 border border-zinc-850 p-4.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <span className="text-zinc-200 text-xs font-bold block">Rapid Response Guaranteed</span>
                    <span className="text-zinc-500 text-[11px] block mt-0.5">Usually replies within 2–4 hours</span>
                  </div>
                </div>
                <span className="text-zinc-400 text-[11px] font-mono font-medium px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                  IST (UTC+5:30)
                </span>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Interactive Form & Tab Selector */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Interactive Tab Selector */}
            <div className="grid grid-cols-3 gap-2 bg-zinc-950/80 border border-zinc-800 p-1.5 rounded-2xl backdrop-blur relative z-20">
              {(["project", "sections", "hiring"] as const).map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="relative py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer select-none"
                  >
                    <span
                      className={`relative z-20 transition-colors duration-200 block text-center ${
                        isActive ? "text-black font-extrabold" : "text-zinc-400 hover:text-white font-bold"
                      }`}
                    >
                      {tab === "project" ? "Store Project" : tab === "sections" ? "Custom Sections" : "Hire Mitul"}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="contactActiveTabIndicator"
                        className="absolute inset-0 bg-white rounded-xl shadow-lg pointer-events-none"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Form Card */}
            <div className="relative bg-zinc-950/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl overflow-hidden flex-1 flex flex-col justify-center group">
              <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mb-7">
                      <h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-2.5">
                        {activeTab === "project" && <Code2 className="w-5 h-5 text-zinc-300" />}
                        {activeTab === "sections" && <MessageCircle className="w-5 h-5 text-zinc-300" />}
                        {activeTab === "hiring" && <Briefcase className="w-5 h-5 text-zinc-300" />}
                        
                        {activeTab === "project"
                          ? "Discuss Shopify Store Development"
                          : activeTab === "sections"
                          ? "Request Custom Liquid Sections"
                          : "Discuss Hiring & Collaboration"}
                      </h2>
                      <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
                        {activeTab === "project"
                          ? "Share details about your Shopify store redesign, theme development, or performance optimization."
                          : activeTab === "sections"
                          ? "Looking for specific theme sections (sliders, sticky heroes, lookbooks)? Describe your layout needs."
                          : "Reach out regarding full-time roles, contract work, or agency freelancing partnerships."}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <FloatingInput
                          id="name"
                          label="Your Name"
                          required
                          value={formData.name}
                          onChange={(val) => setFormData({ ...formData, name: val })}
                        />

                        <FloatingInput
                          id="email"
                          label="Email Address"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(val) => setFormData({ ...formData, email: val })}
                        />
                      </div>

                      <FloatingInput
                        id="phone"
                        label="Phone / WhatsApp Number (Optional)"
                        type="tel"
                        value={formData.phone}
                        onChange={(val) => setFormData({ ...formData, phone: val })}
                      />

                      <div className="relative w-full group mb-6">
                        <textarea
                          id="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white rounded-xl px-4 py-4 text-sm text-white placeholder-zinc-600 outline-none resize-none transition-all duration-300 relative z-10"
                          placeholder="Tell me about your project, requirements, or timeline..."
                        />
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Direct email dispatched to Mitul</span>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors shadow-lg active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed group"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              Send Message to Mitul
                              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  /* Success State */
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.15 }}
                      className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 shadow-md"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </motion.div>

                    <h2 className="text-white text-3xl font-black tracking-tight mb-2">Message Dispatched!</h2>
                    <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-8">
                      Thank you, {formData.name}! Your inquiry has been sent directly to Mitul Zalavadiya. I will review your requirements and respond shortly at {formData.email}.
                    </p>

                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={resetForm}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                      >
                        Send Another Message
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      <MinimalFooter />
    </div>
  )
}
