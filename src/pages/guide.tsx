import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Play, Search, ExternalLink, Film, CheckCircle2, ArrowUpRight } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { useSEO } from "@/lib/useSEO"

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

interface VideoTutorial {
  id: string
  title: string
  category: "Carousels & Sliders" | "Heroes & Headers" | "Sticky & Grids" | "Popups & Badges" | "Templates & Sections"
  duration?: string
  description?: string
}

const AI_SECTION_HUB_VIDEOS: VideoTutorial[] = [
  {
    id: "lbqSRyhXL4o",
    title: "How to Add Product Trust Badges in Shopify | AI Section Hub Tutorial",
    category: "Popups & Badges",
    duration: "Quick Guide",
    description: "Build buyer confidence by embedding clean, customizable SVG & icon trust badges anywhere on your product pages."
  },
  {
    id: "js8_R-g0QU0",
    title: "How to Add a Curved Scroll Carousel in Shopify | AI Section Hub Tutorial",
    category: "Carousels & Sliders",
    duration: "Step-by-step",
    description: "Install an eye-catching 3D curved scroll carousel slider for collections and featured products with zero code."
  },
  {
    id: "mXTKDJB9gBI",
    title: "How to Add a Sticky Layered Hero & Product Grid in Shopify | AI Section Hub Tutorial",
    category: "Sticky & Grids",
    duration: "Full Walkthrough",
    description: "Transform your hero section with sticky layered scrolling and high-converting modern product grid layouts."
  },
  {
    id: "o9k3lGN_STU",
    title: "How to Add an Expandable Marquee Hero in Shopify | AI Section Hub Tutorial",
    category: "Heroes & Headers",
    duration: "Tutorial",
    description: "Create interactive expandable marquee hero banners that dynamically resize as customers scroll and hover."
  },
  {
    id: "2VlBOka0E7E",
    title: "How to Add a Floating Sticky Animated Header in Shopify | AI Section Hub Tutorial",
    category: "Heroes & Headers",
    duration: "Quick Guide",
    description: "Add a floating glassmorphic sticky header with smooth reveal animations on scroll up and down."
  },
  {
    id: "2n2vIlX-sO4",
    title: "How to Add WhatsApp Chat to Shopify | AI Section Hub Tutorial",
    category: "Popups & Badges",
    duration: "Step-by-step",
    description: "Connect direct WhatsApp customer support with a branded floating chat bubble on your Shopify storefront."
  },
  {
    id: "TRER0Wkg7eg",
    title: "How to Add Égoïste Duo Floating in Shopify | AI Section Hub Tutorial",
    category: "Carousels & Sliders",
    duration: "Full Walkthrough",
    description: "Add a luxury aesthetic Égoïste duo floating showcase section with subtle parallax and fluid animations."
  },
  {
    id: "KRP8EZ5gOcY",
    title: "How to Add an Egoiste 3D Lookbook in Shopify | AI Section Hub Tutorial",
    category: "Sticky & Grids",
    duration: "Tutorial",
    description: "Build an interactive 3D shoppable lookbook with pinned hotspots and instant cart drawer triggers."
  },
  {
    id: "ba1VMRFpOSg",
    title: "How to Add Helix Stacking Cards in Shopify | AI Section Hub Tutorial",
    category: "Sticky & Grids",
    duration: "Step-by-step",
    description: "Implement stacking card decks that smoothly layer over each other as visitors scroll down the page."
  },
  {
    id: "TdvYDkXpKyQ",
    title: "How to Add a Helix Showcase Carousel in Shopify | AI Section Hub Tutorial",
    category: "Carousels & Sliders",
    duration: "Full Walkthrough",
    description: "Showcase bestselling products and customer reviews in a continuous fluid helix-motion carousel."
  },
  {
    id: "1OoBvQmzIzc",
    title: "How to Add a Duo Media Spotlight Section in Shopify | AI Section Hub Tutorial",
    category: "Heroes & Headers",
    duration: "Quick Guide",
    description: "Display side-by-side high-resolution video and photo spotlights to tell your brand story effectively."
  },
  {
    id: "SBoWcBvsZw8",
    title: "How to Add a Product Comparison Table in Shopify | AI Section Hub Tutorial",
    category: "Templates & Sections",
    duration: "Tutorial",
    description: "Create feature-by-feature side comparison tables to highlight why your brand is superior to competitors."
  },
  {
    id: "tf28h9pPvB4",
    title: "How to Add a Stacked Card Deck Section in Shopify | AI Section Hub Tutorial",
    category: "Sticky & Grids",
    duration: "Step-by-step",
    description: "Add a tactile stacked card deck layout for collections, benefit highlights, and merchant story chapters."
  },
  {
    id: "JL3Pn7tEov8",
    title: "How to Add a Sticky Review Grid in Shopify | AI Section Hub Tutorial",
    category: "Sticky & Grids",
    duration: "Quick Guide",
    description: "Display photo and video customer reviews in a sticky masonry grid to boost conversion rates."
  },
  {
    id: "8XnERcd7Sj0",
    title: "How to Add a Modern Brand Footer in Shopify | AI Section Hub Tutorial",
    category: "Templates & Sections",
    duration: "Full Walkthrough",
    description: "Upgrade your default theme footer with a modern multi-column newsletter and brand navigation section."
  },
  {
    id: "-jfDcq2pXec",
    title: "How to Add a Sticky Collection Reveal Section in Shopify | AI Section Hub Tutorial",
    category: "Sticky & Grids",
    duration: "Tutorial",
    description: "Pin the left title column while collection images elegantly transition on scroll with subtle fades."
  },
  {
    id: "nI5UNIQyiX8",
    title: "How to Add Shoppable Lookbook Hotspots Section in Shopify | AI Section Hub",
    category: "Templates & Sections",
    duration: "Step-by-step",
    description: "Tag multiple products on a single lifestyle image so shoppers can click dots and view variant popups."
  },
  {
    id: "yh8a2T-7KzU",
    title: "How to Add Beauty Essentials Accordion Section in Shopify | AI Section Hub",
    category: "Templates & Sections",
    duration: "Quick Guide",
    description: "Organize ingredients, instructions, and FAQs into a sleek interactive horizontal accordion section."
  },
  {
    id: "-eH6hSBWMpA",
    title: "How to Add Botanical Routine Showcase Section in Shopify | AI Section Hub",
    category: "Templates & Sections",
    duration: "Full Walkthrough",
    description: "Guide customers through a numbered 3-step or 4-step daily skincare and beauty routine."
  },
  {
    id: "XwfYuGbSOtw",
    title: "How to Add Luxury Category Grid Section in Shopify | AI Section Hub",
    category: "Sticky & Grids",
    duration: "Tutorial",
    description: "Clean asymmetrical category grids with elegant hover zooms and typography overlays."
  },
  {
    id: "5CzwHF_Hd8g",
    title: "How to Add Spa Beauty Service Section in Shopify | AI Section Hub",
    category: "Templates & Sections",
    duration: "Step-by-step",
    description: "Highlight spa packages, service menus, and booking options with interactive price cards."
  },
  {
    id: "kpn1cFIIXTs",
    title: "How to Add Luxury Expandable Banner Grid Section in Shopify | AI Section Hub",
    category: "Heroes & Headers",
    duration: "Full Walkthrough",
    description: "Banner tiles that seamlessly expand on hover to reveal collection previews and CTA buttons."
  },
  {
    id: "nx7W7wbZv_0",
    title: "How to Add Arch Category Showcase Section in Shopify | AI Section Hub",
    category: "Carousels & Sliders",
    duration: "Quick Guide",
    description: "Trendy architectural arched frames for showcasing seasonal collections and popular categories."
  },
  {
    id: "HcqY-1YAZN8",
    title: "How to Add Luxury Deals Countdown Section in Shopify | AI Section Hub",
    category: "Popups & Badges",
    duration: "Tutorial",
    description: "Urgency-driven countdown timer banner with flash sale product carousel and inventory stock bars."
  },
  {
    id: "sYugfSNSIWs",
    title: "How to Add Editorial Beauty Trio Section in Shopify | AI Section Hub",
    category: "Templates & Sections",
    duration: "Step-by-step",
    description: "Magazine editorial layout spotlighting 3 flagship products with testimonials and bundle discounts."
  },
  {
    id: "tlOrOKZCkHo",
    title: "How to Add Nature Care About Us Section in Shopify | AI Section Hub",
    category: "Templates & Sections",
    duration: "Full Walkthrough",
    description: "Tell your brand founding story with image splits, milestone counters, and founder signature."
  },
  {
    id: "dkQzx344Whk",
    title: "How to Add Scratch Card Modal Popup in Shopify | AI Section Hub",
    category: "Popups & Badges",
    duration: "Interactive",
    description: "Gamified scratch-and-win discount card popup to capture customer emails and increase conversions."
  },
  {
    id: "dsNNWYILRFo",
    title: "How to Install a Complete Shopify Homepage Template | AI Section Hub Tutorial",
    category: "Templates & Sections",
    duration: "Masterclass",
    description: "Step-by-step complete guide on assembling a high-converting store homepage from scratch in 10 minutes."
  },
  {
    id: "ohLiypQ-Qa8",
    title: "How to Add Luxury Story Parallax Section in Shopify | AI Section Hub",
    category: "Heroes & Headers",
    duration: "Full Walkthrough",
    description: "Smooth multi-layered parallax backgrounds for luxury fashion and jewelry brand storytelling."
  },
  {
    id: "gfp0sTAKhy8",
    title: "How to Add Buccellati Categories Section in Shopify | AI Section Hub",
    category: "Carousels & Sliders",
    duration: "Step-by-step",
    description: "High-end jewelry & fashion category slider inspired by Buccellati luxury design patterns."
  }
]

const CATEGORIES = [
  "All Videos",
  "Heroes & Headers",
  "Carousels & Sliders",
  "Sticky & Grids",
  "Popups & Badges",
  "Templates & Sections"
] as const

const YOUTUBE_CHANNEL_URL = "https://youtube.com/@ai-section-hub?si=Rop3U0a3xRipzLpX"

export function GuidePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Videos")
  const [activeVideoId, setActiveVideoId] = useState<string | null>(AI_SECTION_HUB_VIDEOS[0].id)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useSEO({
    title: "AI Section Hub Video Tutorials — Official Step-by-Step Shopify Guides",
    description: "Watch 30+ official video tutorials for AI Section Hub. Learn how to install premium Shopify sections, sticky heroes, curved sliders, trust badges and lookbooks with zero code.",
    canonical: "https://klenzo.app/guide",
    keywords: "AI Section Hub tutorials, Shopify section videos, AI Section Hub youtube, Shopify theme section setup, no-code Shopify sections",
  })

  const filteredVideos = useMemo(() => {
    return AI_SECTION_HUB_VIDEOS.filter((v) => {
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCat =
        selectedCategory === "All Videos" || v.category === selectedCategory

      return matchesSearch && matchesCat
    })
  }, [searchQuery, selectedCategory])

  const activeVideo = useMemo(() => {
    return (
      AI_SECTION_HUB_VIDEOS.find((v) => v.id === activeVideoId) ||
      AI_SECTION_HUB_VIDEOS[0]
    )
  }, [activeVideoId])

  const playVideo = (id: string) => {
    setActiveVideoId(id)
    setIsModalOpen(true)
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <CursorFollower />
      <Header1 />

      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[140px]" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-zinc-800/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[30%] w-[500px] h-[500px] rounded-full bg-red-950/15 blur-[140px]" />
      </div>

      <main className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-28">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur text-red-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <YoutubeIcon className="w-4 h-4 text-red-500" />
            Official YouTube Video Tutorials
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-5"
          >
            Master <span className="bg-gradient-to-r from-red-500 via-rose-400 to-white bg-clip-text text-transparent">AI Section Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8"
          >
            Complete library of hands-on video tutorials for installing and styling 700+ premium Shopify sections, sliders, lookbooks, and high-converting templates without writing any code.
          </motion.p>

          {/* YouTube Channel CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_45px_rgba(220,38,38,0.6)] cursor-pointer group"
            >
              <YoutubeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Subscribe on YouTube
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="/docs.html"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white font-extrabold text-xs uppercase tracking-wider border border-zinc-800 hover:border-zinc-700 transition-all duration-300 cursor-pointer"
            >
              <Film className="w-4 h-4 text-zinc-400" />
              Browse Documentation
            </a>
          </motion.div>
        </div>

        {/* Featured Video Player Box */}
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-16 bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Responsive Video Frame */}
              <div className="lg:col-span-8 relative aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-inner group">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.id}?rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Info Details */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full py-2">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest">
                      {activeVideo.category}
                    </span>
                    <span className="text-zinc-500 text-xs font-semibold">
                      Featured Tutorial
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                    {activeVideo.title}
                  </h2>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {activeVideo.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No theme coding required — 100% theme safe</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Works on all Shopify 2.0 Free & Premium themes</span>
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    Open on YouTube
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-900">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-white text-black shadow-md"
                    : "bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800/80"
                }`}
              >
                {cat}
                {cat === "All Videos" && ` (${AI_SECTION_HUB_VIDEOS.length})`}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] md:min-w-[300px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials (e.g. hero, carousel)..."
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-red-500/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Video Gallery Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-24 bg-zinc-950/50 border border-zinc-900 rounded-3xl">
            <Film className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No tutorials found</h3>
            <p className="text-zinc-500 text-xs">Try searching for a different keyword or select "All Videos".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVideos.map((video, idx) => {
              const isCurrent = activeVideoId === video.id
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4) }}
                  onClick={() => playVideo(video.id)}
                  className={`group bg-zinc-950/70 border rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:scale-[1.01] ${
                    isCurrent
                      ? "border-red-500/60 shadow-[0_0_25px_rgba(220,38,38,0.2)]"
                      : "border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  <div>
                    {/* Thumbnail with hover play overlay */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-900 mb-4">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 flex items-center justify-center border border-red-400/40 shadow-xl group-hover:scale-110 transition-all duration-300">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-black text-zinc-300 border border-zinc-800">
                        {video.category}
                      </span>

                      {video.duration && (
                        <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-zinc-400 border border-zinc-800">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-sm sm:text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
                      {video.title}
                    </h3>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4">
                      {video.description}
                    </p>
                  </div>

                  {/* Card Bottom bar */}
                  <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1.5 text-zinc-400 group-hover:text-white font-semibold">
                      <Play className="w-3 h-3 text-red-500 fill-current" />
                      Watch Tutorial
                    </span>
                    <span className="text-[11px] text-zinc-500">AI Section Hub</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Bottom Channel Banner Callout */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 border border-zinc-800/90 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500">
              <YoutubeIcon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Want more sections & video walkthroughs?
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Subscribe to the official <strong>@ai-section-hub</strong> YouTube channel for weekly drops of brand new Shopify sections, animations, and conversion tips.
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl cursor-pointer"
            >
              <YoutubeIcon className="w-4 h-4 text-red-600" />
              Visit @ai-section-hub on YouTube
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </main>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-black"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors text-sm font-bold"
              >
                ✕
              </button>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MinimalFooter />
    </div>
  )
}
