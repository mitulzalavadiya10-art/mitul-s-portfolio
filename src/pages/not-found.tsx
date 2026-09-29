import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { Home, Search } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { useSEO } from "@/lib/useSEO"

export function NotFoundPage() {
  useSEO({
    title: "404 — Page Not Found | Klenzo",
    description: "This page doesn't exist. Go back to the Klenzo homepage to explore our AI-powered Shopify apps.",
    canonical: "https://klenzo.app/404",
    noIndex: true,
  })

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col">
      <Header1 />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-zinc-800/10 blur-[130px]" />
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-32 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-lg mx-auto flex flex-col items-center gap-8"
        >
          {/* 404 badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 text-xs uppercase tracking-widest font-bold">
            <Search className="w-3.5 h-3.5" />
            404 — Page Not Found
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
            Oops.
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-sm">
            We couldn't find the page you're looking for. It may have moved, been deleted, or never existed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-colors shadow-lg"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-900 text-white font-bold text-sm rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-colors"
            >
              Browse FAQs
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-4 pt-8 border-t border-zinc-900 w-full">
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider mb-4">Popular pages</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "AI Section Hub", href: "https://apps.shopify.com/ai-section-hub", external: true },
                { label: "Klenzo: Variant Swatch", href: "https://apps.shopify.com/klenzo-product-variant-swatch", external: true },
                { label: "User Guide", href: "/guide" },
                { label: "Contact", href: "/contact" },
              ].map((link) => 
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-semibold transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-semibold transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <MinimalFooter />
    </div>
  )
}
