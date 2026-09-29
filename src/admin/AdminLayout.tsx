import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  LayoutDashboard, FileText, PenLine, LogOut,
  Menu, ExternalLink, ChevronRight, Sparkles, X, UserCheck, MessageSquare, Mail
} from "lucide-react"
import { adminLogout, getAdminSession, getAllPosts, getPendingCommentsCount } from "@/lib/blogStore"
import logo1 from "@/app logo/logo1.png"

const NAV = [
  { label: "Dashboard",  href: "/admin",          icon: LayoutDashboard, badge: null },
  { label: "Merchants",  href: "/admin/users",    icon: UserCheck,       badge: null },
  { label: "All Posts",  href: "/admin/blog",      icon: FileText,        badge: "posts" },
  { label: "New Post",   href: "/admin/blog/new",  icon: PenLine,         badge: null },
  { label: "Comments",   href: "/admin/comments",  icon: MessageSquare,   badge: "comments" },
  { label: "Leads",      href: "/admin/leads",     icon: Mail,            badge: null },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const session   = getAdminSession()
  const [postCount, setPostCount] = useState<number>(0)
  const [pendingComments, setPendingComments] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    getAllPosts().then(data => setPostCount(data.length))
    const refresh = async () => {
      const count = await getPendingCommentsCount()
      setPendingComments(count)
    }
    refresh()
    window.addEventListener("klenzo_comments_updated", refresh)
    return () => {
      window.removeEventListener("klenzo_comments_updated", refresh)
    }
  }, [location.pathname])

  const handleLogout = () => {
    adminLogout()
    navigate("/admin/login", { replace: true })
  }

  // Helper for page title in topbar breadcrumb
  const getBreadcrumb = () => {
    const p = location.pathname
    if (p === "/admin") return { parent: "Overview", title: "Dashboard" }
    if (p === "/admin/users") return { parent: "Users", title: "Logged-In Merchants" }
    if (p === "/admin/blog") return { parent: "Content", title: "All Posts" }
    if (p === "/admin/blog/new") return { parent: "Content", title: "Create Post" }
    if (p.startsWith("/admin/blog/edit/")) return { parent: "Content", title: "Edit Article" }
    if (p === "/admin/comments") return { parent: "Community", title: "Comments Moderation" }
    if (p === "/admin/leads") return { parent: "Marketing", title: "Subscribers & Leads" }
    return { parent: "Admin", title: "Portal" }
  }

  const breadcrumb = getBreadcrumb()

  const SidebarContent = () => (
    <aside className="flex flex-col h-full w-64 bg-zinc-950/90 border-r border-zinc-800/60 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-800/60">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-black border border-zinc-800 flex items-center justify-center shrink-0 shadow-lg group-hover:border-zinc-700 transition-all duration-300">
            <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={logo1} alt="Klenzo" className="h-5 w-auto object-contain transition-transform duration-300 group-hover:scale-105" style={{ filter: "invert(1)" }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-sm font-black tracking-tight leading-none">Klenzo</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/10 text-[9px] font-extrabold text-zinc-300 uppercase tracking-widest border border-white/10">v2.0</span>
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Admin Studio</p>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex flex-col gap-6 p-3 flex-grow overflow-y-auto">
        <div className="flex flex-col gap-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Navigation</p>
          {NAV.map(({ label, href, icon: Icon, badge }) => {
            const active = href === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(href)
            
            const count = badge === "posts" ? postCount : null
            const isCommentsPending = badge === "comments" && pendingComments > 0

            return (
              <Link
                key={href}
                to={href}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  active
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-black" : "text-zinc-400"}`} />
                <span>{label}</span>
                
                {isCommentsPending ? (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {pendingComments} New
                  </span>
                ) : count !== null ? (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    active ? "bg-black/10 text-black" : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                  }`}>
                    {count}
                  </span>
                ) : null}

                {active && !isCommentsPending && badge !== "posts" && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-black" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Live Site Shortcut */}
        <div className="flex flex-col gap-1 pt-2 border-t border-zinc-800/60">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Quick Link</p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800/60 transition-all group"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              <span>View Storefront</span>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">klenzo.app</span>
          </a>
        </div>
      </div>

      {/* Admin User Footer Card */}
      <div className="p-3 border-t border-zinc-800/60 bg-zinc-950">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-inner">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md">
            {session?.email?.charAt(0)?.toUpperCase() || "A"}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate leading-tight">{session?.email || "Admin User"}</p>
            <p className="text-zinc-500 text-[10px] font-medium flex items-center gap-1 mt-0.5">
              <UserCheck className="w-2.5 h-2.5 text-emerald-400" /> Authorized
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of Admin Studio"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-zinc-900/40 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full bg-zinc-900/20 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full z-20">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        
        {/* Global Topbar Header */}
        <header className="flex items-center justify-between px-4 md:px-8 py-3.5 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-xl border border-zinc-800 bg-zinc-900"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-zinc-500">{breadcrumb.parent}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-white font-bold">{breadcrumb.title}</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>Admin Studio</span>
            </div>

            <Link
              to="/admin/blog/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-zinc-100 transition-all shadow-md active:scale-95"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950/50 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}
