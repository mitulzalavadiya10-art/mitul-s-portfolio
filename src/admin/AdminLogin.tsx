import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from "lucide-react"
import { adminLogin, isAdminLoggedIn } from "@/lib/blogStore"
import logo1 from "@/app logo/logo1.png"

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAdminLoggedIn()) navigate("/admin", { replace: true })
  }, [navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email address and password.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const ok = adminLogin(email, password)
      setIsLoading(false)
      if (ok) {
        navigate("/admin", { replace: true })
      } else {
        setError("Invalid email or password. Please verify your credentials.")
        setPassword("")
      }
    }, 600)
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden selection:bg-white selection:text-black">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-tr from-zinc-800/30 via-zinc-700/20 to-transparent blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-zinc-800/20 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Outer Glow Wrapper */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/20 via-zinc-800/60 to-white/5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
          
          {/* Inner Glass Card */}
          <div className="bg-zinc-950/85 backdrop-blur-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col gap-6">
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Brand Logo & Title */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-white/20 blur-md opacity-50 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-16 h-16 rounded-2xl bg-black border border-zinc-700/80 flex items-center justify-center shadow-2xl">
                  <img
                    src={logo1}
                    alt="Klenzo"
                    className="h-9 w-auto object-contain"
                    style={{ filter: "invert(1)" }}
                  />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[10px] uppercase tracking-widest font-black mb-2 shadow-inner">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Klenzo Admin Studio
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Welcome Back</h1>
                <p className="text-zinc-400 text-xs mt-1">Enter your admin credentials to access the studio</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-3.5 bg-red-950/40 border border-red-800/60 rounded-2xl text-red-300 text-xs font-bold shadow-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="mitulzalavadiya10@gmail.com"
                    autoComplete="email"
                    required
                    className="w-full bg-zinc-900/70 border border-zinc-800/90 focus:border-white focus:ring-1 focus:ring-white/20 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full bg-zinc-900/70 border border-zinc-800/90 focus:border-white focus:ring-1 focus:ring-white/20 rounded-xl py-3.5 pl-10 pr-12 text-sm text-white placeholder-zinc-600 outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative mt-2 w-full py-4 bg-white hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-50 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Sign In to Admin Studio
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-800/60 text-center">
              <p className="text-zinc-500 text-xs font-semibold">
                Protected Studio Environment · Klenzo Apps
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <p className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
          </a>
        </p>
      </motion.div>
    </div>
  )
}
