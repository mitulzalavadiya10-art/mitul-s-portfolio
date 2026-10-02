import { useState, useMemo, useEffect } from "react"
import type { FC, SVGProps } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import {
  FileText, CheckCircle2, Clock, Edit3,
  PenLine, ArrowUpRight, TrendingUp, Eye, Layers,
  Activity, Zap, Tag, Compass
} from "lucide-react"
import { getAllPosts, getAdminSession, exportAllDataJSON, importAllDataJSON, getCachedPostsSync } from "@/lib/blogStore"
import type { BlogPost } from "@/lib/blogStore"
import { AdminLayout } from "./AdminLayout"

// Sparkline SVG Visualizer
function MiniSparkline({ color }: { color: string }) {
  return (
    <svg className="w-20 h-8 opacity-70" viewBox="0 0 100 40" fill="none">
      <path
        d="M0 30 Q 25 10, 50 22 T 100 5"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M0 30 Q 25 10, 50 22 T 100 5 L 100 40 L 0 40 Z"
        fill={color}
        fillOpacity="0.15"
      />
    </svg>
  )
}

function StatCard({
  label, value, icon: Icon, badge, color, sparkColor, delay
}: {
  label: string
  value: number | string
  icon: FC<SVGProps<SVGSVGElement>>
  badge?: string
  color: string
  sparkColor: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-5 md:p-6 flex flex-col justify-between gap-5 backdrop-blur-xl group hover:border-zinc-700 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color} shadow-lg border border-white/10`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <MiniSparkline color={sparkColor} />
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-300 text-[10px] font-black uppercase tracking-wider border border-zinc-800 shadow-inner">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{value}</p>
        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mt-1">{label}</p>
      </div>
    </motion.div>
  )
}

export function AdminDashboard() {
  const session = getAdminSession()
  const [posts, setPosts] = useState<BlogPost[]>(() => getCachedPostsSync())
  const [loading, setLoading] = useState<boolean>(() => posts.length === 0)

  useEffect(() => {
    getAllPosts().then(data => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const published = posts.filter(p => p.status === "published")
    const drafts    = posts.filter(p => p.status === "draft")
    const scheduled = posts.filter(p => p.status === "scheduled" && p.scheduledAt && new Date(p.scheduledAt) > now)
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
    return { total: posts.length, published: published.length, drafts: drafts.length, scheduled: scheduled.length, totalViews }
  }, [posts])

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const statusBadge = (p: BlogPost) => {
    const base = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
    if (p.status === "published") return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]`
    if (p.status === "scheduled") return `${base} bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]`
    return `${base} bg-zinc-900 text-zinc-400 border-zinc-800`
  }

  const pubPct   = stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0
  const draftPct = stats.total > 0 ? Math.round((stats.drafts / stats.total) * 100) : 0
  const schedPct = stats.total > 0 ? 100 - pubPct - draftPct : 0

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16">

        {/* Hero Banner with Mesh Background */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 border border-zinc-800/90 rounded-3xl p-6 md:p-8 backdrop-blur-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[300px] rounded-full bg-gradient-to-l from-white/10 via-white/5 to-transparent blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-widest shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Studio Operational
                </span>
                <span className="text-zinc-500 text-xs font-semibold">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Welcome, <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">{session?.email?.split("@")[0] || "Admin"}</span>
              </h1>
              <p className="text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed">
                Manage your blog articles, track reader engagements, and launch new Shopify growth guides.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-100 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer active:scale-95"
              >
                <PenLine className="w-4 h-4" />
                Create New Post
              </Link>
            </div>
          </div>

          {/* Visual Distribution Ratio Bar */}
          {stats.total > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold mb-2.5">
                <span className="flex items-center gap-2 text-white"><Layers className="w-4 h-4 text-zinc-400" /> Content Status Ratio</span>
                <span>{stats.published} Published ({pubPct}%) · {stats.drafts} Drafts ({draftPct}%) · {stats.scheduled} Scheduled ({schedPct}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-950 overflow-hidden flex gap-1 p-0.5 border border-zinc-800 shadow-inner">
                <div style={{ width: `${pubPct}%` }} className="h-full bg-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]" title={`Published: ${pubPct}%`} />
                <div style={{ width: `${draftPct}%` }} className="h-full bg-zinc-600 rounded-full transition-all duration-700" title={`Drafts: ${draftPct}%`} />
                <div style={{ width: `${schedPct}%` }} className="h-full bg-amber-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(245,158,11,0.5)]" title={`Scheduled: ${schedPct}%`} />
              </div>
            </div>
          )}
        </motion.div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <StatCard label="Total Articles"   value={loading ? "—" : stats.total}     icon={FileText}     badge="All Time" color="bg-zinc-800 text-white" sparkColor="#ffffff"             delay={0.05} />
          <StatCard label="Published"     value={loading ? "—" : stats.published} icon={CheckCircle2} badge={`${pubPct}%`} color="bg-emerald-950 text-emerald-400" sparkColor="#10b981" delay={0.1}  />
          <StatCard label="Drafts"        value={loading ? "—" : stats.drafts}    icon={Edit3}        badge={`${draftPct}%`} color="bg-zinc-800 text-zinc-300" sparkColor="#71717a"          delay={0.15} />
          <StatCard label="Scheduled"     value={loading ? "—" : stats.scheduled} icon={Clock}        badge={`${schedPct}%`} color="bg-amber-950 text-amber-300" sparkColor="#f59e0b"     delay={0.2}  />
        </div>

        {/* Analytics Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left 2 Cols: Recent Posts Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-2 bg-zinc-950/80 border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-zinc-900/40">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-white font-black text-sm tracking-tight">Recent Article Activity</h2>
                </div>
                <Link
                  to="/admin/blog"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-bold transition-all"
                >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-800/50">
                {loading && (
                  <div className="text-center py-12 text-zinc-600 text-sm font-semibold">Loading articles...</div>
                )}
                {!loading && recentPosts.length === 0 && (
                  <div className="text-center py-12 text-zinc-600 text-sm font-semibold">No posts found. Write your first article!</div>
                )}
                {recentPosts.map(post => (
                  <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-900/50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 group-hover:border-zinc-700 transition-colors">
                      {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700"><FileText className="w-5 h-5" /></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate group-hover:text-zinc-200 transition-colors">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                        <span className="font-bold text-zinc-400">{post.category}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                        {post.views > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-zinc-300 font-semibold"><Eye className="w-3 h-3 text-zinc-500" /> {post.views} views</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span className={statusBadge(post)}>
                      {post.status}
                    </span>

                    <Link
                      to={`/admin/blog/edit/${post.id}`}
                      className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-sm shrink-0"
                      title="Edit post"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/60 text-center">
              <Link to="/admin/blog" className="text-zinc-400 hover:text-white text-xs font-bold transition-colors">
                Manage all {posts.length} articles in Studio Manager →
              </Link>
            </div>
          </motion.div>

          {/* Right 1 Col: Quick Actions Hub & Shortcuts */}
          <div className="flex flex-col gap-5">

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-white font-black text-sm tracking-tight">Quick Actions Studio</h2>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  to="/admin/blog/new"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-white text-xs font-extrabold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black">
                      <PenLine className="w-4 h-4" />
                    </div>
                    <span>Write New Article</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  to="/admin/blog"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-white text-xs font-extrabold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center font-black">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span>Manage Categories &amp; Tags</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </Link>

                <a
                  href="/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-white text-xs font-extrabold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center font-black">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span>View Public Blog</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              </div>
            </motion.div>

            {/* SEO & Backup System Controls Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white text-xs font-black uppercase tracking-wider">System Backup &amp; Data Tools</h3>
              </div>

              <p className="text-zinc-500 text-xs">Export or restore system data including blog posts, subscriber leads, and analytics logs.</p>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => exportAllDataJSON()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  📥 Export Full Backup (.JSON)
                </button>

                <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                  📤 Import System Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const text = await file.text()
                      const success = await importAllDataJSON(text)
                      if (success) {
                        alert("System backup imported successfully! Reloading...")
                        window.location.reload()
                      } else {
                        alert("Failed to parse JSON backup file.")
                      }
                    }}
                  />
                </label>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
