import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  PenLine, Trash2, Eye, CheckCircle2, Clock,
  FileText, Search, Filter, ArrowUpRight, Plus,
  Calendar, BarChart2, Tag, LayoutGrid, LayoutList,
  X
} from "lucide-react"
import { getAllPosts, deletePost, savePost, getAllCategories, getAppInfo, getCachedPostsSync } from "@/lib/blogStore"
import type { BlogPost, BlogStatus } from "@/lib/blogStore"
import { AdminLayout } from "./AdminLayout"

type FilterStatus = "all" | BlogStatus

function StatusBadge({ status }: { status: BlogStatus }) {
  const map: Record<BlogStatus, string> = {
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    scheduled:  "bg-amber-500/10  text-amber-300  border-amber-500/30  shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    draft:      "bg-zinc-800/80      text-zinc-400   border-zinc-700/60",
  }
  const icons: Record<BlogStatus, React.ReactNode> = {
    published: <CheckCircle2 className="w-3 h-3" />,
    scheduled:  <Clock className="w-3 h-3" />,
    draft:      <FileText className="w-3 h-3" />,
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${map[status]}`}>
      {icons[status]}
      {status}
    </span>
  )
}

export function BlogList() {
  const [posts, setPosts]               = useState<BlogPost[]>(() => getCachedPostsSync())
  const [loading, setLoading]           = useState<boolean>(true)
  const [search, setSearch]             = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [filterCat, setFilterCat]       = useState("all")
  const [viewMode, setViewMode]         = useState<"table" | "grid">("table")
  const [deleteId, setDeleteId]         = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [categories, setCategories]     = useState<string[]>(["all"])

  const reload = async () => {
    const [data, cats] = await Promise.all([getAllPosts(), getAllCategories()])
    setPosts(data)
    const cleanCats = Array.from(new Set(cats.filter(c => c && c.toLowerCase() !== "all")))
    setCategories(["all", ...cleanCats])
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.summary.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === "all" || p.status === filterStatus
      const matchCat    = filterCat === "all" || p.category.toLowerCase() === filterCat.toLowerCase()
      return matchSearch && matchStatus && matchCat
    })
  }, [posts, search, filterStatus, filterCat])

  const counts = useMemo(() => {
    const now = new Date()
    return {
      all:       posts.length,
      published: posts.filter(p => p.status === "published" || (p.status === "scheduled" && p.scheduledAt && new Date(p.scheduledAt) <= now)).length,
      draft:     posts.filter(p => p.status === "draft").length,
      scheduled: posts.filter(p => p.status === "scheduled" && p.scheduledAt && new Date(p.scheduledAt) > now).length,
    }
  }, [posts])

  const handleDelete = async (id: string) => {
    if (deleteId === id && deleteConfirm) {
      await deletePost(id)
      setDeleteId(null)
      setDeleteConfirm(false)
      reload()
    } else {
      setDeleteId(id)
      setDeleteConfirm(true)
    }
  }

  const cancelDelete = () => { setDeleteId(null); setDeleteConfirm(false) }

  const handleQuickPublish = async (post: BlogPost) => {
    await savePost({ ...post, status: "published", publishedAt: post.publishedAt || new Date().toISOString(), scheduledAt: "" })
    reload()
  }

  const handleUnpublish = async (post: BlogPost) => {
    await savePost({ ...post, status: "draft" })
    reload()
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-16">

        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight">Blog Studio Manager</h1>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-black shadow-inner">
                {loading ? "Loading..." : `${posts.length} ${posts.length === 1 ? "article" : "articles"}`}
              </span>
            </div>
            <p className="text-zinc-400 text-xs mt-1 font-semibold">Manage, edit, schedule, and publish Klenzo articles</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Layout Switcher */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "table" ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white"
                }`}
                title="Table View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/admin/blog/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-zinc-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl w-fit overflow-x-auto backdrop-blur-md">
          {(["all", "published", "draft", "scheduled"] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === s 
                  ? "bg-white text-black shadow-md" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
              }`}
            >
              {s} <span className="text-[10px] opacity-70 ml-1">({loading ? "…" : counts[s] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, excerpt or tags..."
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-zinc-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 outline-none cursor-pointer appearance-none transition-colors"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-zinc-950 text-white">
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State Spinner */}
        {loading && (
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-3xl text-center py-20 text-zinc-500 backdrop-blur-md flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
            <p className="font-bold text-xs text-zinc-400">Loading articles...</p>
          </div>
        )}

        {/* Empty State (Only shown when NOT loading) */}
        {!loading && filtered.length === 0 && (
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-3xl text-center py-20 text-zinc-500 backdrop-blur-md">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold text-sm text-zinc-300">
              {search ? `No articles match "${search}"` : "No articles found."}
            </p>
            {!search && (
              <Link to="/admin/blog/new" className="mt-4 inline-flex items-center gap-1.5 text-black hover:bg-zinc-100 text-xs font-black bg-white px-5 py-2.5 rounded-2xl transition-all shadow-md">
                <Plus className="w-4 h-4" /> Create First Article
              </Link>
            )}
          </div>
        )}

        {/* DATATABLE VIEW MODE */}
        {!loading && viewMode === "table" && filtered.length > 0 && (
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/80 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900/50">
              <div className="col-span-4">Article Title &amp; Details</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date &amp; Views</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-zinc-800/40">
              <AnimatePresence>
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-6 py-4.5 hover:bg-zinc-900/60 transition-all group"
                  >
                    {/* Article Info */}
                    <div className="md:col-span-4 flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 group-hover:border-zinc-700 transition-colors shadow-inner">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700"><FileText className="w-4 h-4" /></div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-bold truncate group-hover:text-zinc-200 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{post.summary}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {post.featured && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                              ✦ Featured
                            </span>
                          )}
                          <span className="text-zinc-600 text-[10px] font-semibold">{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="md:col-span-2">
                      <span className="inline-flex items-center gap-1.5 text-zinc-300 text-xs bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-xl font-bold max-w-full truncate">
                        <Tag className="w-3 h-3 text-zinc-500 shrink-0" />
                        <span className="truncate">{post.category}</span>
                      </span>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
                      <StatusBadge status={post.status} />
                    </div>

                    {/* Date & Engagement */}
                    <div className="md:col-span-2">
                      <p className="text-zinc-400 text-xs flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        {post.status === "scheduled" && post.scheduledAt
                          ? `Sched: ${new Date(post.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                          : post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        }
                      </p>
                      {post.views > 0 && (
                        <p className="text-zinc-400 text-[10px] font-bold flex items-center gap-1 mt-1">
                          <BarChart2 className="w-3 h-3 text-zinc-500" />
                          {post.views} views
                        </p>
                      )}
                    </div>

                    {/* Actions — Unified 4-Button Action Bar for ALL Statuses */}
                    <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                      {/* 1. View / Preview Button */}
                      <a
                        href={`/blog/${post.slug || post.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-sm shrink-0"
                        title={post.status === "published" ? "View live article" : "Preview article"}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>

                      {/* 2. Publish / Unpublish Button */}
                      {post.status === "published" ? (
                        <button
                          type="button"
                          onClick={() => handleUnpublish(post)}
                          className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-amber-950/40 hover:border-amber-800/60 text-zinc-400 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                          title="Unpublish (move to draft)"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickPublish(post)}
                          className="w-8 h-8 rounded-xl bg-emerald-950/40 border border-emerald-900/50 hover:bg-emerald-900/60 text-emerald-400 flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                          title="Publish live now"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* 3. Edit Button */}
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-sm shrink-0"
                        title="Edit article"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                      </Link>

                      {/* 4. Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        onBlur={cancelDelete}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 ${
                          deleteId === post.id && deleteConfirm
                            ? "bg-red-600 border-red-500 text-white animate-pulse"
                            : "bg-red-950/30 border-red-900/50 hover:bg-red-900/60 text-red-400"
                        }`}
                        title={deleteId === post.id && deleteConfirm ? "Click again to confirm delete" : "Delete article"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}


        {/* GRID CARD VIEW MODE */}
        {!loading && viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-zinc-700 transition-all backdrop-blur-xl"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-zinc-900">
                      {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700"><FileText className="w-8 h-8" /></div>
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <StatusBadge status={post.status} />
                      </div>
                      {post.targetAppId && post.targetAppId !== "none" && (() => {
                        const app = getAppInfo(post.targetAppId)
                        return (
                          <div className="absolute top-3 right-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${app.badgeColor}`}>
                              {app.icon} {app.name}
                            </span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
                        <span className="text-zinc-300 font-extrabold">{post.category}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-white font-extrabold text-base leading-snug line-clamp-2 group-hover:text-zinc-200 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 py-4 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      {post.views > 0 ? `${post.views} views` : "0 views"}
                    </span>

                    <div className="flex items-center gap-2">
                      {post.status === "published" && (
                        <a
                          href={`/blog/${post.slug || post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all"
                        >
                          View
                        </a>
                      )}
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-black transition-all hover:bg-zinc-100 shadow-md"
                      >
                        Edit Post
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Summary */}
        {filtered.length > 0 && (
          <p className="text-zinc-600 text-xs font-semibold text-center mt-2">
            Showing {filtered.length} of {posts.length} articles in Studio Manager
          </p>
        )}
      </div>
    </AdminLayout>
  )
}
