import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Mail, Download, Search } from "lucide-react"
import { getLeads, exportLeadsCSV, getAppInfo } from "@/lib/blogStore"
import type { NewsletterLead } from "@/lib/blogStore"
import { AdminLayout } from "./AdminLayout"

export function AdminLeads() {
  const [leads, setLeads]       = useState<NewsletterLead[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState("")

  useEffect(() => {
    getLeads().then(data => {
      setLeads(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return leads
    const q = search.toLowerCase()
    return leads.filter(l => l.email.toLowerCase().includes(q) || (l.sourceAppId || "").toLowerCase().includes(q))
  }, [leads, search])

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Mail className="w-6 h-6 text-white" /> Newsletter Leads &amp; Merchant Subscribers
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold">
                {leads.length} Subscribers
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">Export merchant email leads captured from blog subscription forms</p>
          </div>

          <button
            type="button"
            onClick={() => exportLeadsCSV()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Leads CSV
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search email subscribers..."
            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Table Container */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-zinc-800/80 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-950/60">
            <div className="col-span-5">Merchant Email</div>
            <div className="col-span-4">Source App Referral</div>
            <div className="col-span-3 text-right">Subscribed Date</div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-zinc-500 flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
              <p className="text-zinc-500 text-sm font-semibold">Loading subscribers from cloud...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm text-zinc-400">No email subscribers found.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/40">
              <AnimatePresence>
                {filtered.map((lead, i) => {
                  const app = getAppInfo(lead.sourceAppId)
                  return (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-zinc-800/20 transition-all"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <p className="text-white text-sm font-bold truncate">{lead.email}</p>
                      </div>

                      <div className="col-span-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${app.badgeColor}`}>
                          <span>{app.icon}</span> {app.name}
                        </span>
                      </div>

                      <div className="col-span-3 text-right text-zinc-400 text-xs font-semibold">
                        {new Date(lead.subscribedAt || lead.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
