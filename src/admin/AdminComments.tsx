import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MessageSquare, CheckCircle2, AlertOctagon, Trash2, Reply, Send, Mail } from "lucide-react"
import { getComments, updateCommentStatus, deleteComment } from "@/lib/blogStore"
import type { BlogComment } from "@/lib/blogStore"
import { AdminLayout } from "./AdminLayout"

type StatusFilter = "all" | "pending" | "approved" | "spam"

export function AdminComments() {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<StatusFilter>("all")
  const [replyId, setReplyId]   = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const reload = async () => {
    setLoading(true)
    const data = await getComments()
    setComments(data)
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  // Re-fetch when other tabs/windows trigger comment events
  useEffect(() => {
    const handler = () => reload()
    window.addEventListener("klenzo_comments_updated", handler)
    return () => window.removeEventListener("klenzo_comments_updated", handler)
  }, [])

  const filtered = useMemo(() => {
    if (filter === "all") return comments
    return comments.filter(c => c.status === filter)
  }, [comments, filter])

  const counts = useMemo(() => ({
    all:      comments.length,
    pending:  comments.filter(c => c.status === "pending").length,
    approved: comments.filter(c => c.status === "approved").length,
    spam:     comments.filter(c => c.status === "spam").length,
  }), [comments])

  const handleApprove = async (id: string) => {
    await updateCommentStatus(id, "approved")
    reload()
  }

  const handleSpam = async (id: string) => {
    await updateCommentStatus(id, "spam")
    reload()
  }

  const handleDelete = async (id: string) => {
    await deleteComment(id)
    reload()
  }

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return
    await updateCommentStatus(id, "approved", replyText.trim())
    setReplyId(null)
    setReplyText("")
    reload()
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-white" /> Merchant Comments &amp; Moderation
              </h1>
              {counts.pending > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black animate-pulse">
                  {counts.pending} Pending Review
                </span>
              )}
            </div>
            <p className="text-zinc-500 text-xs mt-1">Review, approve, reply to, or moderate merchant comments left on blog posts</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl w-fit overflow-x-auto backdrop-blur-md">
          {(["all", "pending", "approved", "spam"] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filter === s ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              {s} <span className="text-[10px] opacity-70 ml-1">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Comments List */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {loading ? (
            <div className="text-center py-16 text-zinc-500 flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
              <p className="text-zinc-500 text-sm font-semibold">Loading comments from cloud...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm text-zinc-400">No comments found in this category.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/40">
              <AnimatePresence>
                {filtered.map(cmt => (
                  <motion.div
                    key={cmt.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="p-6 flex flex-col gap-3 hover:bg-zinc-800/20 transition-all"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {cmt.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-bold">{cmt.authorName}</p>
                            <span className="text-zinc-500 text-xs flex items-center gap-1">
                              <Mail className="w-3 h-3 text-zinc-600" /> {cmt.email || cmt.authorEmail || "Anonymous"}
                            </span>
                          </div>
                          {cmt.postTitle && (
                            <p className="text-zinc-400 text-xs font-semibold mt-0.5">
                              On article: <span className="text-zinc-300">"{cmt.postTitle}"</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          cmt.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                          cmt.status === "pending"  ? "bg-amber-500/10 text-amber-300 border-amber-500/25" :
                          "bg-red-500/10 text-red-400 border-red-500/25"
                        }`}>
                          {cmt.status}
                        </span>
                        <span className="text-zinc-600 text-xs font-semibold">
                          {new Date(cmt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Comment Text */}
                    <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
                      "{cmt.content}"
                    </p>

                    {/* Admin Reply (if exists) */}
                    {cmt.adminReply && (
                      <div className="ml-6 pl-4 border-l-2 border-emerald-500/50 flex flex-col gap-1">
                        <p className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <Reply className="w-3.5 h-3.5" /> Admin Reply:
                        </p>
                        <p className="text-zinc-300 text-xs">{cmt.adminReply}</p>
                      </div>
                    )}

                    {/* Quick Action Bar */}
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/40">
                      {cmt.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleApprove(cmt.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-900/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Comment
                        </button>
                      )}
                      {cmt.status !== "spam" && (
                        <button
                          type="button"
                          onClick={() => handleSpam(cmt.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-900/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <AlertOctagon className="w-3.5 h-3.5" /> Mark Spam
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setReplyId(replyId === cmt.id ? null : cmt.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Reply className="w-3.5 h-3.5" /> Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cmt.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-xl text-xs font-bold transition-all cursor-pointer ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    {/* Inline Reply Input */}
                    {replyId === cmt.id && (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-800">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your official admin reply..."
                          className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(cmt.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-zinc-100 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" /> Reply &amp; Approve
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
