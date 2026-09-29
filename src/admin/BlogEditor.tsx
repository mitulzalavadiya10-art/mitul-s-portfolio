import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  Save, Send, Clock, Eye, Trash2,
  Image, Tag, AlertCircle, Upload, X as XIcon,
  CheckCircle2, ArrowLeft, Info, Sparkles,
  Globe, Calendar, Type
} from "lucide-react"
import {
  savePost, deletePost, getPostBySlug, createEmptyPost, calculateReadTime, TEAM_AUTHORS, getAllCategories, DEFAULT_CATEGORIES, SHOPIFY_APPS
} from "@/lib/blogStore"
import type { BlogPost, BlogStatus, ThumbnailSize } from "@/lib/blogStore"
import { AdminLayout } from "./AdminLayout"
import { RichTextEditor } from "@/components/ui/RichTextEditor"

function toLocalDatetime(isoString?: string): string {
  if (!isoString) return ""
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromLocalDatetime(localString?: string): string {
  if (!localString) return ""
  const d = new Date(localString)
  return isNaN(d.getTime()) ? "" : d.toISOString()
}

const THUMBNAIL_SIZES: { value: ThumbnailSize; label: string; ratio: string }[] = [
  { value: "landscape", label: "Landscape", ratio: "16:9" },
  { value: "square",    label: "Square",    ratio: "1:1" },
  { value: "portrait",  label: "Portrait",  ratio: "3:4" },
]

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">{children}</label>
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-zinc-500 text-[11px] font-semibold mt-1 flex items-center gap-1.5"><Info className="w-3 h-3 text-zinc-600 shrink-0" />{children}</p>
}

function Input({ value, onChange, placeholder, maxLength, className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; className?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full bg-zinc-950/90 border border-zinc-800/90 focus:border-white focus:ring-1 focus:ring-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all shadow-inner ${className}`}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3, maxLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="w-full bg-zinc-950/90 border border-zinc-800/90 focus:border-white focus:ring-1 focus:ring-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none resize-none transition-all shadow-inner leading-relaxed"
    />
  )
}

// ── Image Compressor Helper ───────────────────────────────────────────────────
function compressImageFile(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new window.Image()
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(e.target?.result as string)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const mime = file.type === "image/png" ? "image/webp" : file.type || "image/jpeg"
        resolve(canvas.toDataURL(mime, quality))
      }
      img.onerror = () => resolve(e.target?.result as string)
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Image Uploader ─────────────────────────────────────────────────────────────
function ThumbnailUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef                  = useRef<HTMLInputElement>(null)
  const [dragging, setDragging]   = useState(false)
  const [error, setError]         = useState("")
  const [uploading, setUploading] = useState(false)

  const MAX_SIZE_MB = 10

  const processFile = useCallback(async (file: File) => {
    setError("")
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported (JPG, PNG, WebP, GIF).")
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds limit (${MAX_SIZE_MB} MB max).`)
      return
    }

    setUploading(true)
    try {
      const compressedDataUrl = await compressImageFile(file)
      onChange(compressedDataUrl)
    } catch {
      setError("Failed to process image file.")
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  if (value) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-zinc-700/80 group bg-zinc-950 shadow-xl">
        <img
          src={value}
          alt="Thumbnail"
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-black rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer shadow-lg active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" /> Replace Image
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-950/80 text-red-300 text-xs font-black rounded-xl border border-red-900/80 hover:bg-red-900 transition-colors cursor-pointer active:scale-95"
          >
            <XIcon className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/85 rounded-lg text-[10px] text-zinc-300 font-black border border-white/10 backdrop-blur-md">
          {value.startsWith("data:") ? "Custom Image Uploaded" : "External Image URL"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 w-full aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          dragging
            ? "border-white bg-zinc-800/80"
            : "border-zinc-800 bg-zinc-950/80 hover:border-zinc-600 hover:bg-zinc-900/50"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
            <p className="text-zinc-400 text-xs font-black">Uploading image...</p>
          </div>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              dragging ? "bg-white text-black" : "bg-zinc-900 border border-zinc-800 text-zinc-400"
            }`}>
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center px-4">
              <p className="text-white text-xs font-black">
                {dragging ? "Drop image to upload" : "Click or Drag & Drop Cover Image"}
              </p>
              <p className="text-zinc-500 text-[11px] mt-1 font-semibold">
                JPG, PNG, WebP, GIF (Max {MAX_SIZE_MB} MB)
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-red-400 text-xs font-bold mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

// ── Main Studio Blog Editor ───────────────────────────────────────────────────
export function BlogEditor() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [post, setPost]                     = useState<BlogPost>(createEmptyPost())
  const [activeTab, setActiveTab]           = useState<"write" | "seo" | "preview">("write")
  const [tagInput, setTagInput]             = useState("")
  const [categoriesList, setCategoriesList] = useState<string[]>(DEFAULT_CATEGORIES)
  const [customCatInput, setCustomCatInput] = useState("")
  const [saving, setSaving]                 = useState(false)
  const [toast, setToast]                   = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm]   = useState(false)

  // Load categories from DB
  useEffect(() => {
    getAllCategories().then(cats => {
      const filtered = cats.filter(c => c && c.toLowerCase() !== "all")
      setCategoriesList(Array.from(new Set([...DEFAULT_CATEGORIES, ...filtered])))
    })
  }, [])

  useEffect(() => {
    if (post.category && post.category.toLowerCase() !== "all" && !categoriesList.includes(post.category)) {
      setCategoriesList(prev => [...prev, post.category])
    }
  }, [post.category, categoriesList])

  const addCustomCategory = () => {
    const trimmed = customCatInput.trim()
    if (!trimmed) return
    if (!categoriesList.includes(trimmed)) {
      setCategoriesList(prev => [...prev, trimmed])
    }
    setPost(prev => ({ ...prev, category: trimmed }))
    setCustomCatInput("")
  }

  const removeCustomCategory = (catToRemove: string) => {
    setCategoriesList(prev => prev.filter(c => c !== catToRemove))
    if (post.category === catToRemove) {
      setPost(prev => ({ ...prev, category: DEFAULT_CATEGORIES[0] || "Shopify Tips" }))
    }
  }

  const summaryLen  = post.summary.length
  const seoTitleLen = (post.seoTitle || post.title).length
  const seoDescLen  = (post.seoDescription || post.summary).length

  useEffect(() => {
    if (isEdit && id) {
      getPostBySlug(id).then(found => {
        if (found) setPost(found)
        else navigate("/admin/blog", { replace: true })
      })
    }
  }, [id, isEdit, navigate])

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const seoAudit = useMemo(() => {
    let score = 0
    const tasks: { label: string; passed: boolean }[] = []

    const titleLen = post.title.length
    const titlePassed = titleLen >= 30 && titleLen <= 70
    if (titlePassed) score += 25
    tasks.push({ label: `Title Length (30-70 chars): ${titleLen} chars`, passed: titlePassed })

    const summaryLen = post.summary.length
    const summaryPassed = summaryLen >= 60 && summaryLen <= 180
    if (summaryPassed) score += 25
    tasks.push({ label: `Summary Excerpt (60-180 chars): ${summaryLen} chars`, passed: summaryPassed })

    const text = Array.isArray(post.content) ? post.content.join(" ") : String(post.content || "")
    const wordCount = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length
    const wordPassed = wordCount >= 100
    if (wordPassed) score += 25
    tasks.push({ label: `Article Word Count (>100 words): ${wordCount} words`, passed: wordPassed })

    const imagePassed = Boolean(post.thumbnail)
    if (imagePassed) score += 25
    tasks.push({ label: "Cover Thumbnail Set", passed: imagePassed })

    return { score, tasks }
  }, [post.title, post.summary, post.content, post.thumbnail])

  const update = <K extends keyof BlogPost>(key: K, val: BlogPost[K]) =>
    setPost(prev => ({ ...prev, [key]: val }))

  const handleSave = async (status: BlogStatus) => {
    if (!post.title.trim()) { showToast("error", "Article title is required."); return }
    if (!post.summary.trim()) { showToast("error", "Article excerpt is required."); return }
    
    const contentText = (post.content[0] || "").replace(/<[^>]*>/g, "").trim()
    if (!contentText) { showToast("error", "Article body content is required."); return }
    
    if (!post.thumbnail.trim()) { showToast("error", "Cover image is required."); return }
    if (status === "scheduled" && !post.scheduledAt) { showToast("error", "Please select a target schedule date and time."); return }

    setSaving(true)
    try {
      const saved = await savePost({ ...post, status })
      setPost(saved)
      setSaving(false)
      showToast("success", status === "published" ? "Article published live!" : status === "scheduled" ? "Article scheduled!" : "Draft saved.")
      if (!isEdit) navigate(`/admin/blog/edit/${saved.id}`, { replace: true })
    } catch (err) {
      console.error(err)
      setSaving(false)
      showToast("error", "Failed to save article. Try again.")
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return }
    await deletePost(post.id)
    navigate("/admin/blog", { replace: true })
  }

  const handleContentChange = (html: string) => {
    update("content", [html])
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !post.tags.includes(t) && post.tags.length < 10) {
      update("tags", [...post.tags, t])
      setTagInput("")
    }
  }
  const removeTag = (t: string) => update("tags", post.tags.filter(x => x !== t))

  const previewReadTime = calculateReadTime(post.content)
  const contentText = (post.content[0] || "").replace(/<[^>]*>/g, "").trim()
  const wordCount = contentText ? contentText.split(/\s+/).filter(Boolean).length : 0

  return (
    <AdminLayout>
      {/* Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl border text-xs font-black shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-800 text-emerald-300"
                : "bg-red-950/90 border-red-800 text-red-300"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto pb-16">

        {/* Floating Studio Action Bar Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap bg-zinc-950/90 border border-zinc-800/90 p-4 rounded-3xl backdrop-blur-2xl sticky top-2 z-30 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/blog")}
              className="p-2.5 rounded-2xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              title="Back to Blog Manager"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">
                  {isEdit ? "Article Studio Editor" : "Create New Post"}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  post.status === "published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : post.status === "scheduled" ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}>
                  {post.status}
                </span>
              </div>
              <p className="text-zinc-500 text-[11px] font-semibold mt-0.5 flex items-center gap-2">
                <span>{previewReadTime}</span>
                <span>·</span>
                <span>{wordCount} words</span>
              </p>
            </div>
          </div>

          {/* Mode Tabs (Write vs SEO vs Preview) */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <button
              onClick={() => setActiveTab("write")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "write" ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "seo" ? "bg-white text-black shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> SEO Preview
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {isEdit && (
              <>
                <a
                  href={`/blog/${post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-zinc-400 hover:text-white text-xs font-bold border border-zinc-800 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Live
                </a>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                    deleteConfirm
                      ? "bg-red-600 text-white border-red-500 animate-pulse"
                      : "bg-red-950/40 text-red-400 border-red-900/60 hover:bg-red-900/50"
                  }`}
                  title={deleteConfirm ? "Click again to confirm deletion" : "Delete post"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleteConfirm ? "Confirm Delete?" : "Delete"}
                </button>
              </>
            )}
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-extrabold border border-zinc-700 rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>
            <button
              onClick={() => handleSave("scheduled")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-extrabold border border-amber-800/60 rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Clock className="w-3.5 h-3.5" /> Schedule
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-white hover:bg-zinc-100 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Publish Article
            </button>
          </div>
        </div>

        {/* STUDIO LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: Editor & SEO Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* TAB 1: WRITE & FORMAT */}
            {activeTab === "write" && (
              <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 md:p-8 flex flex-col gap-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <h2 className="text-white font-black text-base tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Article Content Studio
                  </h2>
                  <span className="text-zinc-500 text-xs font-semibold">Auto-Draft active</span>
                </div>

                {/* Hero Title */}
                <div>
                  <Label>Article Title *</Label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={e => update("title", e.target.value)}
                    placeholder="Enter an intriguing, keyword-rich article title..."
                    className="w-full bg-transparent text-2xl md:text-3xl font-black text-white placeholder-zinc-700 outline-none border-b border-zinc-800 focus:border-white transition-colors pb-3"
                  />
                  <p className="text-zinc-500 text-xs font-mono mt-2">
                    Slug: <span className="text-zinc-400">klenzo.app/blog/{post.slug || post.id || "your-title"}</span>
                  </p>
                </div>

                {/* Summary / Excerpt with Visual Meter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label>Summary / Excerpt *</Label>
                    <span className={`text-[10px] font-black ${summaryLen > 160 ? "text-red-400" : "text-zinc-400"}`}>
                      {summaryLen}/160 chars
                    </span>
                  </div>
                  <Textarea
                    value={post.summary}
                    onChange={v => update("summary", v)}
                    placeholder="Provide a concise teaser excerpt that appears on article index cards and Google snippets..."
                    rows={3}
                    maxLength={200}
                  />
                  {/* Visual Meter Bar */}
                  <div className="w-full h-1 bg-zinc-900 rounded-full mt-2 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (summaryLen / 160) * 100)}%` }}
                      className={`h-full transition-all duration-300 ${summaryLen > 160 ? "bg-red-500" : "bg-emerald-400"}`}
                    />
                  </div>
                </div>

                {/* Body Content — Rich Text Editor */}
                <div>
                  <Label>Article Body *</Label>
                  <RichTextEditor
                    value={post.content[0] || ""}
                    onChange={handleContentChange}
                    placeholder="Write your article content here... Format text with headings, blockquotes, lists, links, and code blocks using the toolbar above."
                    minHeight="520px"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SEO PREVIEW & META */}
            {(activeTab === "seo" || activeTab === "write") && (
              <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 md:p-8 flex flex-col gap-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <h2 className="text-white font-black text-base tracking-tight flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" /> Search Engine Optimization (SEO)
                  </h2>
                  <span className="text-zinc-500 text-xs font-semibold">Google &amp; Social Previews</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label>SEO Meta Title</Label>
                    <span className={`text-[10px] font-black ${seoTitleLen > 60 ? "text-red-400" : "text-zinc-400"}`}>
                      {seoTitleLen}/60 chars
                    </span>
                  </div>
                  <Input
                    value={post.seoTitle}
                    onChange={v => update("seoTitle", v)}
                    placeholder={post.title || "Custom SEO title (defaults to article title)"}
                    maxLength={70}
                  />
                  <FieldHint>Target 50–60 characters. Shows as the main clickable link in Google.</FieldHint>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label>SEO Meta Description</Label>
                    <span className={`text-[10px] font-black ${seoDescLen > 160 ? "text-red-400" : "text-zinc-400"}`}>
                      {seoDescLen}/160 chars
                    </span>
                  </div>
                  <Textarea
                    value={post.seoDescription}
                    onChange={v => update("seoDescription", v)}
                    placeholder={post.summary || "Custom meta description (defaults to summary)"}
                    rows={2}
                    maxLength={180}
                  />
                  <FieldHint>Target 150–160 characters with a clear call-to-action.</FieldHint>
                </div>

                {/* Google SERP Live Snippet Box */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-inner">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-black mb-3 flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-blue-400" /> Google Search Live Result
                  </p>
                  <p className="text-blue-400 text-base font-bold leading-snug line-clamp-1 hover:underline cursor-pointer">
                    {post.seoTitle || post.title || "Article Title Preview — Klenzo"}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1 font-mono">https://klenzo.app › blog › {post.id || "article-slug"}</p>
                  <p className="text-zinc-300 text-xs mt-2 leading-relaxed line-clamp-2">
                    {post.seoDescription || post.summary || "Article summary snippet will appear here in search engine queries."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Studio Settings Sidebar */}
          <div className="flex flex-col gap-6">

            {/* Status & Schedule Box */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-4 backdrop-blur-xl shadow-2xl">
              <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" /> Publishing Settings
              </h2>

              <div>
                <Label>Current State</Label>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                  post.status === "published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : post.status === "scheduled" ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800"
                }`}>
                  {post.status === "published" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {post.status === "scheduled" && <Clock className="w-3.5 h-3.5" />}
                  {post.status}
                </div>
              </div>

              <div>
                <Label>Publish Date &amp; Time</Label>
                <input
                  type="datetime-local"
                  value={toLocalDatetime(post.publishedAt)}
                  onChange={e => update("publishedAt", fromLocalDatetime(e.target.value))}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-zinc-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors cursor-pointer"
                />
              </div>

              <div>
                <Label>Target Schedule Time</Label>
                <input
                  type="datetime-local"
                  value={toLocalDatetime(post.scheduledAt)}
                  onChange={e => update("scheduledAt", fromLocalDatetime(e.target.value))}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-zinc-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors cursor-pointer"
                />
              </div>

              {/* Featured Article Switch */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                <div>
                  <p className="text-white text-xs font-black">Pin as Hero Featured</p>
                  <p className="text-zinc-500 text-[10px] font-semibold">Highlight at top of blog index</p>
                </div>
                <button
                  type="button"
                  onClick={() => update("featured", !post.featured)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${post.featured ? "bg-white" : "bg-zinc-800"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black transition-transform ${post.featured ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </div>

            {/* Featured Shopify App Selection */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-3 backdrop-blur-xl shadow-2xl">
              <div>
                <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                  📱 Featured Shopify App Link
                </h2>
                <p className="text-zinc-500 text-[11px] font-semibold mt-0.5">Attach store app promo box to article</p>
              </div>

              <div className="flex flex-col gap-2">
                {SHOPIFY_APPS.map(app => {
                  const isSelected = (post.targetAppId || "none") === app.id
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => update("targetAppId", app.id)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white text-black border-white shadow-lg"
                          : "bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{app.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-black truncate ${isSelected ? "text-black" : "text-white"}`}>
                            {app.heading}
                          </p>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-black shrink-0" />}
                        </div>
                        <p className={`text-[11px] mt-0.5 leading-snug line-clamp-1 ${isSelected ? "text-zinc-700 font-medium" : "text-zinc-500"}`}>
                          {app.subheading}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Category Selector & Custom Builder */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-3 backdrop-blur-xl shadow-2xl">
              <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                🏷️ Category
              </h2>
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                {categoriesList.map(cat => {
                  const isDefault  = DEFAULT_CATEGORIES.includes(cat)
                  const isSelected = post.category === cat
                  return (
                    <div key={cat} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => update("category", cat)}
                        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white text-black font-black shadow-sm"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        {cat}
                      </button>
                      {!isDefault && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCustomCategory(cat)
                          }}
                          className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                          title={`Delete "${cat}" category`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-800/80">
                <input
                  type="text"
                  value={customCatInput}
                  onChange={e => setCustomCatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomCategory())}
                  placeholder="+ Add Custom Category..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={addCustomCategory}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Team Author Picker */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-3 backdrop-blur-xl shadow-2xl">
              <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                ✍️ Team Author
              </h2>
              <div className="flex flex-col gap-2">
                {TEAM_AUTHORS.map(a => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => update("author", a)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs transition-all cursor-pointer ${
                      post.author.name === a.name
                        ? "bg-zinc-900 border border-zinc-700 text-white"
                        : "hover:bg-zinc-900/60 border border-transparent text-zinc-400"
                    }`}
                  >
                    <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full border border-zinc-700 object-cover shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-white text-xs font-black truncate">{a.name}</p>
                      <p className="text-zinc-500 text-[10px] font-medium">{a.title}</p>
                    </div>
                    {post.author.name === a.name && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Cover Image Studio */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-3 backdrop-blur-xl shadow-2xl">
              <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                <Image className="w-4 h-4 text-zinc-400" /> Cover Thumbnail Image
              </h2>

              <ThumbnailUploader
                value={post.thumbnail}
                onChange={v => update("thumbnail", v)}
              />

              <div>
                <Label>Aspect Ratio Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  {THUMBNAIL_SIZES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => update("thumbnailSize", s.value)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                        (post.thumbnailSize ?? "landscape") === s.value
                          ? "bg-white text-black border-white font-black shadow-sm"
                          : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <span className="font-black">{s.label}</span>
                      <span className="text-[9px] opacity-60 font-semibold">{s.ratio}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags Manager */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-3 backdrop-blur-xl shadow-2xl">
              <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2"><Tag className="w-4 h-4" /> Tags</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-300 font-extrabold">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-red-400 cursor-pointer ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ⚡ Real-Time SEO Audit Score (0 - 100%) */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-4 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                    ⚡ SEO Health Score
                  </h2>
                  <p className="text-zinc-500 text-[10px] font-semibold mt-0.5">Real-time search engine readability audit</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-black border ${
                  seoAudit.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                  seoAudit.score >= 50 ? "bg-amber-500/10 text-amber-300 border-amber-500/25" :
                  "bg-red-500/10 text-red-400 border-red-500/25"
                }`}>
                  {seoAudit.score}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    seoAudit.score >= 80 ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" :
                    seoAudit.score >= 50 ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]" :
                    "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                  }`}
                  style={{ width: `${seoAudit.score}%` }}
                />
              </div>

              {/* Task Checklist */}
              <div className="flex flex-col gap-2 pt-1">
                {seoAudit.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {task.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                    <span className={task.passed ? "text-zinc-300 font-medium" : "text-zinc-500"}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 📱 Social Media Share Card Live Preview */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 flex flex-col gap-4 backdrop-blur-xl shadow-2xl">
              <div>
                <h2 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                  📱 Social Media Live Card Preview
                </h2>
                <p className="text-zinc-500 text-[10px] font-semibold mt-0.5">How your blog card looks when shared on social apps</p>
              </div>

              {/* Card Preview Container */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="h-36 bg-zinc-950 relative overflow-hidden border-b border-zinc-800">
                  {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Cover Image</div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-wider border border-white/10">
                    klenzo.app
                  </span>
                </div>
                <div className="p-3.5 flex flex-col gap-1">
                  <p className="text-xs font-black text-white line-clamp-1">
                    {post.title || "Untitled Blog Post"}
                  </p>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-tight">
                    {post.summary || "Summary excerpt will appear here when shared on LinkedIn, X, or WhatsApp."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
