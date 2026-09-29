"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { BookOpen, Clock, ArrowRight, Tag, ChevronRight, Sparkles } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { useSEO } from "@/lib/useSEO"
import { getPublishedPosts, getAllCategoriesFromPosts, getAppInfo, getCachedPostsSync, DEFAULT_POSTS } from "@/lib/blogStore"
import type { BlogPost, ThumbnailSize } from "@/lib/blogStore"

export type { BlogPost }

// ── Category badge — black/white only ────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-zinc-900 text-zinc-300 border-zinc-700">
      <Tag className="w-2.5 h-2.5" />
      {category}
    </span>
  )
}

// ── Thumbnail aspect ratio from size setting ──────────────────────────────────
function thumbnailAspect(size: ThumbnailSize | undefined) {
  if (size === "portrait") return "aspect-[3/4]"
  if (size === "square")   return "aspect-square"
  return "aspect-video"   // landscape (default)
}

// ── Main Blog Page ────────────────────────────────────────────────────────────
export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [blogPosts, setBlogPosts]               = useState<BlogPost[]>(() => getCachedPostsSync())
  const [categories, setCategories]             = useState<string[]>(() => getAllCategoriesFromPosts(blogPosts))
  const [loading, setLoading]                   = useState<boolean>(() => blogPosts.length === 0)

  useEffect(() => {
    let isMounted = true
    getPublishedPosts().then(posts => {
      if (!isMounted) return
      setBlogPosts(posts)
      setCategories(getAllCategoriesFromPosts(posts))
      setLoading(false)
    }).catch(() => {
      if (!isMounted) return
      setLoading(false)
    })
    return () => { isMounted = false }
  }, [])

  const activePosts   = blogPosts && blogPosts.length > 0 ? blogPosts : DEFAULT_POSTS
  const featuredPost  = activePosts.find(p => p.featured) ?? activePosts[0]
  const gridPosts     = featuredPost ? activePosts.filter((p: BlogPost) => p.id !== featuredPost.id) : activePosts
  const filteredPosts = gridPosts.filter(
    (p: BlogPost) =>
      selectedCategory.toUpperCase() === "ALL" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase()
  )

  useSEO({
    title: "Klenzo Blog — Shopify Tips, App Updates & Design Guides",
    description: "Shopify tips, app update announcements, and design guides from the Klenzo team. Learn how to boost store speed, UX, and conversions.",
    canonical: "https://klenzo.app/blog",
    keywords: "Shopify tips, Shopify speed optimization, AI Section Hub updates, Klenzo blog, Shopify sections guide",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": "https://klenzo.app/blog#webpage",
        "url": "https://klenzo.app/blog",
        "name": "Klenzo Blog — Shopify Tips & App Updates",
        "description": "Shopify tips, app update announcements, and design guides from the Klenzo team.",
        "publisher": { "@id": "https://klenzo.app/#organization" },
        "isPartOf": { "@id": "https://klenzo.app/#website" },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://klenzo.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://klenzo.app/blog" }
          ]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Klenzo Blog Articles",
        "itemListElement": blogPosts.map((post: BlogPost, i: number) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `https://klenzo.app/blog/${post.id}`,
          "name": post.title
        }))
      }
    ],
  })

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
        <CursorFollower />
        <Header1 />

        {/* Subtle background */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[700px] h-[500px] rounded-full bg-zinc-900/30 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-zinc-900/20 blur-[140px]" />
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <main className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 pt-36 pb-32">
          {/* Hero Header Skeleton */}
          <div className="mb-16 text-center flex flex-col items-center">
            <div className="w-36 h-6 rounded-full bg-zinc-900 border border-zinc-800 animate-pulse mb-6" />
            <div className="w-72 md:w-96 h-12 bg-zinc-900/80 rounded-2xl animate-pulse mb-4" />
            <div className="w-80 md:w-2/3 h-5 bg-zinc-900/50 rounded-xl animate-pulse" />
          </div>

          {/* Featured Article Skeleton */}
          <div className="mb-16">
            <div className="w-36 h-4 bg-zinc-900 rounded animate-pulse mb-5" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden min-h-[360px] animate-pulse">
              <div className="lg:col-span-7 bg-zinc-900/50 min-h-[280px]" />
              <div className="lg:col-span-5 p-8 flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <div className="w-24 h-5 bg-zinc-800/60 rounded-full" />
                  <div className="w-full h-8 bg-zinc-800/60 rounded-xl" />
                  <div className="w-3/4 h-8 bg-zinc-800/60 rounded-xl" />
                  <div className="w-full h-12 bg-zinc-900/80 rounded-lg" />
                </div>
                <div className="w-full h-12 bg-zinc-900/50 rounded-xl border-t border-zinc-800 pt-4" />
              </div>
            </div>
          </div>

          {/* Category Filter Skeleton */}
          <div className="flex items-center gap-3 mb-10 overflow-hidden">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="w-24 h-9 rounded-xl bg-zinc-900/80 border border-zinc-800/80 animate-pulse shrink-0" />
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-zinc-900/20 border border-zinc-800 rounded-2xl h-96 animate-pulse flex flex-col overflow-hidden">
                <div className="w-full h-48 bg-zinc-900/60" />
                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div className="w-full h-5 bg-zinc-800/60 rounded" />
                  <div className="w-3/4 h-4 bg-zinc-900/80 rounded" />
                  <div className="w-full h-8 bg-zinc-900/40 rounded border-t border-zinc-800 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <MinimalFooter />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <CursorFollower />
      <Header1 />

      {/* Subtle background — NO colors, pure black */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[700px] h-[500px] rounded-full bg-zinc-900/30 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-zinc-900/20 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <main className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 pt-36 pb-32">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            Resource Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-5">
            Klenzo{" "}
            <span className="text-zinc-400">Blog</span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Guides, updates &amp; design tips to help you build a lightning-fast,
            high-converting Shopify storefront.
          </p>
        </motion.div>

        {/* ── Featured Post ── */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-5">
              <BookOpen className="w-3.5 h-3.5" /> Featured Article
            </div>
            <Link
              to={`/blog/${featuredPost.slug || featuredPost.id}`}
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-900/20 border border-zinc-800 rounded-3xl overflow-hidden cursor-pointer hover:border-zinc-700 transition-all duration-500 block"
            >
              {/* Image */}
              <div className={`lg:col-span-7 ${thumbnailAspect(featuredPost.thumbnailSize)} lg:aspect-auto lg:min-h-[360px] overflow-hidden relative`}>
                <img
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black">
                    ✦ Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-5 flex flex-col justify-between p-7 md:p-9">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <CategoryBadge category={featuredPost.category} />
                    <span className="text-zinc-600 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                    {featuredPost.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-5 mt-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-9 h-9 rounded-full border border-zinc-700 object-cover"
                    />
                    <div>
                      <p className="text-xs text-white font-bold">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-zinc-500 font-semibold">{featuredPost.author.title}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-zinc-800 bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black text-white transition-all duration-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Category Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-zinc-700 text-xs font-semibold">
            {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* ── Blog Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post: BlogPost, i: number) => (
              <motion.div
                layout
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  to={`/blog/${post.slug || post.id}`}
                  className="group flex flex-col bg-zinc-900/20 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-zinc-700 transition-all duration-300 block"
                >
                {/* Thumbnail — respects thumbnailSize */}
                <div className={`relative ${thumbnailAspect(post.thumbnailSize)} overflow-hidden bg-zinc-950`}>
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-65 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    <CategoryBadge category={post.category} />
                    {post.targetAppId && post.targetAppId !== "none" && (() => {
                      const app = getAppInfo(post.targetAppId)
                      return (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md max-w-[55%] truncate shrink-0 ${app.badgeColor}`}>
                          {app.icon} {app.name}
                        </span>
                      )
                    })()}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h3 className="text-white font-bold text-base leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 flex-1">
                    {post.summary}
                  </p>

                  {/* Card footer */}
                  <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-1">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full border border-zinc-700 object-cover"
                      />
                      <div>
                        <p className="text-[10px] text-zinc-300 font-bold">{post.author.name}</p>
                        <p className="text-[9px] text-zinc-600 font-semibold">{post.author.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-semibold">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </div>
                  </div>
                </div>

                {/* Read More bar */}
                <div className="flex items-center gap-1.5 px-5 py-3 bg-white/[0.02] border-t border-zinc-800 text-zinc-500 group-hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                  Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {loading && blogPosts.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl h-80 animate-pulse flex flex-col p-6 justify-between">
                <div className="w-full h-40 bg-zinc-800/50 rounded-xl" />
                <div className="w-3/4 h-5 bg-zinc-800/50 rounded" />
                <div className="w-1/2 h-4 bg-zinc-800/50 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20 text-zinc-600">
            <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-40" />
            <p className="font-semibold">No articles in this category yet.</p>
          </div>
        )}
      </main>



      <MinimalFooter />
    </div>
  )
}
