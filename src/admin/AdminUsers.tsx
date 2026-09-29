import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  Users, Download, Search, RefreshCw, ShieldCheck, UserCheck, KeyRound, 
  Store, Monitor, Smartphone, Copy, Check, ExternalLink, Activity, X, Mail
} from "lucide-react"
import { getUserLogins, exportUsersCSV, getUserActivityHistory } from "@/lib/blogStore"
import type { UserLoginRecord, UserActivityLog } from "@/lib/blogStore"
import { AdminLayout } from "./AdminLayout"

function formatRelativeTime(isoString: string): string {
  if (!isoString) return "Recently"
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return "Recently"
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function AdminUsers() {
  const [users, setUsers]                 = useState<UserLoginRecord[]>([])
  const [loading, setLoading]             = useState(true)
  const [refreshing, setRefreshing]       = useState(false)
  const [search, setSearch]               = useState("")

  // Selected Merchant Modal & Timeline State
  const [selectedUser, setSelectedUser]   = useState<UserLoginRecord | null>(null)
  const [userLogs, setUserLogs]           = useState<UserActivityLog[]>([])
  const [logsLoading, setLogsLoading]     = useState(false)
  const [copiedField, setCopiedField]     = useState<string | null>(null)

  const loadData = async () => {
    setRefreshing(true)
    const data = await getUserLogins()
    setUsers(data)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenTimeline = async (user: UserLoginRecord) => {
    setSelectedUser(user)
    setLogsLoading(true)
    const logs = await getUserActivityHistory(user.email)
    setUserLogs(logs)
    setLogsLoading(false)
  }

  const copyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u => 
      u.email.toLowerCase().includes(q) || 
      (u.name || "").toLowerCase().includes(q) ||
      (u.provider || "").toLowerCase().includes(q) ||
      (u.shopUrl || "").toLowerCase().includes(q) ||
      (u.timezone || "").toLowerCase().includes(q)
    )
  }, [users, search])

  const stats = useMemo(() => {
    const total = users.length
    const googleUsers = users.filter(u => u.provider === "google").length
    const emailUsers = users.filter(u => u.provider === "email").length
    const storesLinked = users.filter(u => u.shopUrl && u.shopUrl.trim().length > 0).length
    return { total, googleUsers, emailUsers, storesLinked }
  }, [users])

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Users className="w-6 h-6 text-white" /> Logged-In Merchants &amp; Lead Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold">
                {users.length} Merchants
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">Real-time merchant profile logs, connected Shopify stores, browser specs &amp; behavioral activity history</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Data
            </button>

            <button
              type="button"
              onClick={() => exportUsersCSV()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Marketing CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Merchants</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Stores Connected</span>
              <Store className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">{stats.storesLinked}</p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Google OAuth</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">{stats.googleUsers}</p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Email Signups</span>
              <KeyRound className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1">{stats.emailUsers}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, store domain, or timezone..."
            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Table Container */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-12 gap-3 px-6 py-3.5 border-b border-zinc-800/80 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-950/60">
            <div className="col-span-4">Merchant Profile</div>
            <div className="col-span-3">Linked Shopify Store</div>
            <div className="col-span-2">Browser &amp; Device</div>
            <div className="col-span-2">Last Active</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-zinc-500 flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
              <p className="text-zinc-500 text-sm font-semibold">Loading logged-in merchants...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm text-zinc-400">No merchant login records found.</p>
              <p className="text-xs text-zinc-600 mt-1">Users will automatically appear here as soon as they log into the app.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/40">
              <AnimatePresence>
                {filtered.map((usr, i) => (
                  <motion.div
                    key={usr.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="grid grid-cols-12 gap-3 items-center px-6 py-4 hover:bg-zinc-800/20 transition-all group"
                  >
                    {/* Column 1: Profile */}
                    <div className="col-span-4 flex items-center gap-3">
                      {usr.picture ? (
                        <img 
                          src={usr.picture} 
                          alt={usr.name || usr.email} 
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-800 shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/60 flex items-center justify-center text-white text-xs font-black shrink-0">
                          {(usr.name || usr.email).substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-bold truncate">{usr.name || 'Shopify Merchant'}</p>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase border ${
                            usr.provider === 'google' 
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800/80' 
                              : 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                          }`}>
                            {usr.provider}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5">
                          <span className="truncate">{usr.email}</span>
                          <button 
                            type="button" 
                            onClick={() => copyText(usr.email, `em-${usr.id}`)}
                            className="hover:text-white transition-colors" 
                            title="Copy Email"
                          >
                            {copiedField === `em-${usr.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Connected Store */}
                    <div className="col-span-3">
                      {usr.shopUrl ? (
                        <a 
                          href={usr.shopUrl.startsWith('http') ? usr.shopUrl : `https://${usr.shopUrl}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-all max-w-full"
                        >
                          <Store className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                          <span className="truncate">{usr.shopUrl.replace("https://", "").replace("http://", "")}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-500 text-xs font-medium">
                          <Store className="w-3.5 h-3.5 text-zinc-600" /> Not linked yet
                        </span>
                      )}
                    </div>

                    {/* Column 3: Browser & Device */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
                        {usr.deviceType === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-purple-400" /> : <Monitor className="w-3.5 h-3.5 text-blue-400" />}
                        <span className="truncate">{usr.browserOs || 'Desktop'}</span>
                      </div>
                      <p className="text-zinc-600 text-[10px] font-mono truncate mt-0.5">{usr.timezone || 'Asia/Kolkata'}</p>
                    </div>

                    {/* Column 4: Last Active */}
                    <div className="col-span-2">
                      <p className="text-zinc-200 text-xs font-bold">{formatRelativeTime(usr.lastLogin)}</p>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-bold border border-zinc-800/80 inline-block mt-0.5">
                        {usr.loginCount || 1} logins
                      </span>
                    </div>

                    {/* Column 5: Action Button */}
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenTimeline(usr)}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all inline-flex items-center justify-center cursor-pointer shadow-sm"
                        title="View Full Activity Timeline"
                      >
                        <Activity className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Merchant Activity & Behavioral Timeline Modal ───────────────────── */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    {selectedUser.picture ? (
                      <img src={selectedUser.picture} alt={selectedUser.name} className="w-12 h-12 rounded-2xl object-cover border border-zinc-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-black text-sm">
                        {(selectedUser.name || selectedUser.email).substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-white">{selectedUser.name || 'Merchant Account'}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase">
                          Active Lead
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs">{selectedUser.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-zinc-900/60 border border-zinc-800/60 p-3.5 rounded-2xl">
                  <div>
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Shopify Store</span>
                    <span className="text-white font-bold truncate block">{selectedUser.shopUrl || 'Not connected'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Device / Browser</span>
                    <span className="text-white font-bold truncate block">{selectedUser.browserOs || 'Desktop'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-bold block text-[10px] uppercase">Timezone / Location</span>
                    <span className="text-white font-bold truncate block">{selectedUser.timezone || 'UTC'}</span>
                  </div>
                </div>

                {/* Quick Action Toolbar */}
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedUser.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> Direct Email
                  </a>
                  <button
                    onClick={() => copyText(selectedUser.email, 'modal-email')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    {copiedField === 'modal-email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} Copy Email
                  </button>
                </div>

                {/* Real-Time Activity History Feed */}
                <div className="flex flex-col gap-3 flex-grow overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" /> Behavioral Activity Stream ({userLogs.length})
                    </h3>
                  </div>

                  {logsLoading ? (
                    <div className="py-12 text-center text-zinc-500 flex flex-col items-center gap-2">
                      <div className="w-5 h-5 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
                      <p className="text-xs">Fetching user activity stream...</p>
                    </div>
                  ) : userLogs.length === 0 ? (
                    <div className="py-10 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800/40">
                      <p className="text-xs font-semibold text-zinc-400">No specific activity logged for this session yet.</p>
                      <p className="text-[10px] text-zinc-600 mt-1">Actions like page navigation, app clicks, and store syncs will appear here live.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-800">
                      {userLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 relative z-10">
                          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-bold">
                            •
                          </div>
                          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-3 flex-grow text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-black text-white text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/60">
                                {log.actionType}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {formatRelativeTime(log.createdAt)}
                              </span>
                            </div>
                            <p className="text-zinc-300 font-semibold mt-1.5">{log.description}</p>
                            {log.pageUrl && (
                              <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                                Path: {log.pageUrl}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
