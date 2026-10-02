import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, Store, Check, Flame } from "lucide-react"
import { addLead } from "@/lib/blogStore"

import img1 from "@/images/images1.jpg"
import img2 from "@/images/images2.jpg"
import img3 from "@/images/images3.jpg"
import img4 from "@/images/images4.jpg"
import img5 from "@/images/images5.jpg"
import img6 from "@/images/images6.jpg"

const POPUP_DISMISSED_KEY = "klenzo_lead_popup_dismissed_v1"
const SHOPIFY_APP_URL = "https://apps.shopify.com/ai-section-hub"

const MARQUEE_IMAGES = [img1, img2, img3, img4, img5, img6]

export function LeadPopupModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "700+ Theme Sections",
    "AI Variant Swatches"
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Check if user has explicitly forced popup test via URL query (?popup=true)
    const forcePopup = typeof window !== "undefined" && (window.location.search.includes("popup=true") || window.location.search.includes("test=popup"))
    const isDismissed = !forcePopup && localStorage.getItem(POPUP_DISMISSED_KEY)
    
    // Strict production behavior: If user closed or submitted popup once, DO NOT show again
    if (isDismissed) return

    // 1. Time-Delayed Trigger (6 Seconds)
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 6000)

    // 2. Exit-Intent Trigger (Cursor leaves top window boundary)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !localStorage.getItem(POPUP_DISMISSED_KEY)) {
        setIsOpen(true)
      }
    }

    // 3. Esc Key Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        localStorage.setItem(POPUP_DISMISSED_KEY, "true")
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(POPUP_DISMISSED_KEY, "true")
  }

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid store email address.")
      return
    }

    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const goalsStr = selectedGoals.length > 0 ? selectedGoals.join(", ") : "General Store Growth"
      await addLead(email, "homepage-popup-modal", `Goals: ${goalsStr}`)

      // Send email alert via Web3Forms
      const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "ef665da4-71c1-4d1d-8de4-b1ab4634d44e"
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: apiKey,
          email: email,
          message: `New Newsletter / Popup Lead: ${email} | Selected Goals: ${goalsStr}`,
          from_name: "Mitul Zalavadiya Portfolio",
          subject: `New Lead Captured: ${email}`,
        }),
      }).catch(err => console.warn("Web3Forms lead email warning:", err))

      setIsSubmitted(true)
      localStorage.setItem(POPUP_DISMISSED_KEY, "true")
    } catch (err) {
      console.error("Popup submit error:", err)
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableGoals = [
    { id: "sections", label: "700+ Theme Sections", icon: "⚡" },
    { id: "swatches", label: "AI Variant Swatches", icon: "🎨" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Animated Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container with Spring Pop Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30, rotateX: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative w-full max-w-4xl bg-black border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.06)] overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 text-white"
          >
            {/* Ambient Background Light Refractions */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"
            />

            {/* Close Button with Rotating Scale Effect */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              type="button"
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all cursor-pointer"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* ── LEFT COLUMN: Animated Visual Showcase ─────────────────── */}
            <div className="md:col-span-5 relative bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800 overflow-hidden">
              {/* Animated Background Mesh Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="relative z-10 space-y-3">
                {/* Pulsing Live Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span>Extended Merchant Offer</span>
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  Supercharge Your Shopify Store
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Join 2,300+ merchants using AI Section Hub &amp; Smart Swatches.
                </p>
              </div>

              {/* Infinite Animated Marquee Image Cards */}
              <div className="relative z-10 my-5 overflow-hidden rounded-2xl border border-zinc-800 bg-black/60 p-2 shadow-inner">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>Included Theme Sections</span>
                  <span className="text-white font-mono">700+ Ready</span>
                </div>

                {/* Endless Smooth Marquee */}
                <div className="overflow-hidden w-full mt-1.5 rounded-xl">
                  <motion.div
                    className="flex gap-2.5 items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ width: "max-content" }}
                  >
                    {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="shrink-0 w-28 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900"
                      >
                        <img
                          src={img}
                          alt="Shopify section preview"
                          className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Animated Floating Feature Cards */}
              <div className="relative z-10 space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-xl bg-black border border-zinc-800 shadow-md transition-transform"
                >
                  <div className="text-xs">
                    <h4 className="font-bold text-white leading-tight">700+ Liquid Sections</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Zero theme code edit required</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-xl bg-black border border-zinc-800 shadow-md transition-transform"
                >
                  <div className="text-xs">
                    <h4 className="font-bold text-white leading-tight">AI Variant Swatches</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Replace boring native dropdowns</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Proof Trust Badge */}
              <div className="relative z-10 pt-3 mt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>2,300+ Brands</span>
                </div>
                <div className="text-white font-bold">★ 4.9/5 Rating</div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Interactive Animated Form ─────────────── */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center relative z-10 bg-black">
              {!isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Glowing Animated Offer Pill */}
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold tracking-wide uppercase mb-3 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: "6s" }} />
                    Special Shopify Merchant Offer
                  </motion.div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    Get <span className="underline decoration-zinc-500 underline-offset-4">30-Day Extended Trial</span> + Free Custom Setup
                  </h2>

                  <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                    Claim your exclusive extended trial key and unlock premium Shopify sections instantly.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Interactive Animated Goal Selector */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-2">
                        What are your main goals for your store?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableGoals.map(goal => {
                          const isSelected = selectedGoals.includes(goal.label)
                          return (
                            <motion.button
                              key={goal.id}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => toggleGoal(goal.label)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-white text-black border-white shadow-lg"
                                  : "bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                              }`}
                            >
                              {isSelected ? (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                                </motion.span>
                              ) : (
                                <span>{goal.icon}</span>
                              )}
                              <span>{goal.label}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Email Input Field */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Your Store or Work Email
                      </label>
                      <div className="relative">
                        <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="e.g. founder@yourbrand.com"
                          className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-white focus:ring-2 focus:ring-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
                        />
                      </div>
                      {errorMessage && (
                        <p className="text-zinc-300 text-xs mt-1.5 font-medium">{errorMessage}</p>
                      )}
                    </div>

                    {/* Animated High-Impact CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group overflow-hidden rounded-xl p-[1px] font-bold text-sm text-black shadow-xl cursor-pointer transition-all"
                    >
                      {/* Animated Shimmer Line */}
                      <span className="absolute inset-0 bg-white group-hover:bg-zinc-200 transition-colors" />
                      <span className="relative block w-full py-3.5 px-6 rounded-[11px] font-black text-black flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Unlocking Offer...</span>
                          </>
                        ) : (
                          <>
                            <span>Claim 30-Day Free Access &amp; Install</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                          </>
                        )}
                      </span>
                    </motion.button>

                    {/* Security Guarantees */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 font-medium">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-white" /> Free 30-Day Extended Access
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-white" /> 1-Click Shopify Install
                      </span>
                    </div>
                  </form>

                  {/* Decline Link */}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs text-zinc-500 hover:text-zinc-300 underline transition-colors cursor-pointer"
                    >
                      No thanks, I'll pay standard price later
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── ANIMATED SUCCESS STATE ────────────────────────────────── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="text-center py-6 sm:py-8 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-2xl"
                  >
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </motion.div>

                  <div className="space-y-1.5">
                    <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold">
                      🎉 Offer Successfully Unlocked!
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight pt-2">
                      Welcome to Mitul's Shopify Apps
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                      We've reserved your <strong className="text-white">30-Day Extended Access</strong> for <span className="text-white font-semibold underline">{email}</span>. Click below to install our apps on your store now.
                    </p>
                  </div>

                  <div className="pt-4 max-w-sm mx-auto space-y-3">
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={SHOPIFY_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-black transition-all shadow-xl cursor-pointer"
                    >
                      <span>Install on Shopify Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.a>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="block w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    >
                      Close and return to site
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
