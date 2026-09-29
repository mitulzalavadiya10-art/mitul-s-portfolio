import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { ChevronUp, Sparkles } from "lucide-react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { pathname } = useLocation()

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Track scroll position & calculate scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight
      
      if (scrollY > 250) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      if (scrollTotal > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / scrollTotal) * 100))
        setScrollProgress(progress)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // SVG Circle Ring calculations
  const radius = 22
  const circumference = 2 * Math.PI * radius // ~138.23
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3">
          {/* Hover Tooltip Pill */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800/90 text-white text-[11px] font-black uppercase tracking-widest backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] pointer-events-none"
              >
                <Sparkles className="w-3 h-3 text-zinc-400 animate-pulse" />
                <span>Top · {Math.round(scrollProgress)}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Floating Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 30, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 30, rotate: 15 }}
            whileHover={{ scale: 1.12, y: -4 }}
            whileTap={{ scale: 0.92 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 22,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-black/85 border border-zinc-800 text-white shadow-[0_10px_35px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-shadow duration-500 cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:border-zinc-500 group overflow-hidden"
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Circular Progress SVG Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 56 56">
              <defs>
                <linearGradient id="scrollProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#71717a" />
                </linearGradient>
              </defs>
              
              {/* Background Track Ring */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-zinc-800/60"
                strokeWidth="2.5"
                fill="none"
              />
              
              {/* Animated Progress Fill Ring */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="url(#scrollProgressGradient)"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: "stroke-dashoffset 0.15s ease-out" }}
              />
            </svg>

            {/* Center Animated Chevron Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <ChevronUp className="w-5 h-5 text-zinc-300 group-hover:text-white transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
            </div>

            {/* Micro Particle Accent */}
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
