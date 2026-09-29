import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, ArrowLeft, Tag, ExternalLink } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { useSEO } from "@/lib/useSEO"
import { getPostBySlug, incrementViews, getAppInfo, trackAppConversion, trackFeedback, getPostAnalytics, addLead, getComments, saveComment } from "@/lib/blogStore"
import type { BlogPost, ThumbnailSize, BlogComment } from "@/lib/blogStore"

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-zinc-900 text-zinc-300 border-zinc-700">
      <Tag className="w-2.5 h-2.5" />
      {category}
    </span>
  )
}

function thumbnailAspect(size: ThumbnailSize | undefined) {
  if (size === "portrait") return "aspect-[3/4]"
  if (size === "square")   return "aspect-square"
  return "aspect-video"
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  const [clapCount, setClapCount]       = useState(0)
  const [helpfulYes, setHelpfulYes]     = useState(0)
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [leadEmail, setLeadEmail]       = useState("")
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [comments, setComments]         = useState<BlogComment[]>([])
  const [cmtName, setCmtName]           = useState("")
  const [cmtEmail, setCmtEmail]         = useState("")
  const [cmtContent, setCmtContent]     = useState("")
  const [cmtSubmitted, setCmtSubmitted] = useState(false)

  useEffect(() => {
    if (!slug) return
    let isMounted = true
    setLoading(true)
    getPostBySlug(slug).then(found => {
      if (!isMounted) return
      if (!found) {
        navigate("/not-found", { replace: true })
      } else {
        setPost(found)
        incrementViews(found.id)
        const stats = getPostAnalytics(found.id)
        setClapCount(stats.claps)
        setHelpfulYes(stats.helpfulYes)
        getComments(found.id).then(cmts => {
          if (isMounted) setComments(cmts)
        })
      }
      setLoading(false)
    }).catch(err => {
      console.warn("Failed to load blog post:", err)
      if (isMounted) setLoading(false)
    })
    return () => { isMounted = false }
  }, [slug, navigate])

  useEffect(() => {
    if (!post) return
    const refreshComments = () => getComments(post.id).then(cmts => setComments(cmts))
    window.addEventListener("klenzo_comments_updated", refreshComments)
    return () => {
      window.removeEventListener("klenzo_comments_updated", refreshComments)
    }
  }, [post])

  useSEO({
    title: post?.seoTitle || post?.title || "Blog Post",
    description: post?.seoDescription || post?.summary || "",
    canonical: `https://klenzo.app/blog/${post?.slug || slug}`,
    schema: post ? [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.thumbnail,
        "datePublished": post.publishedAt || post.createdAt,
        "dateModified": post.updatedAt,
        "author": {
          "@type": "Person",
          "name": post.author.name
        },
        "publisher": { "@id": "https://klenzo.app/#organization" },
      }
    ] : [],
  })

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <CursorFollower />
      <Header1 />

      <main className="relative z-10 container mx-auto max-w-6xl px-4 md:px-8 pt-36 pb-32">
        <button 
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-10 transition-colors text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </button>
        
        <article className="w-full mx-auto">
          {/* Header */}
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="mb-6 flex items-center gap-2">
              <CategoryBadge category={post.category} />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-snug mb-6 max-w-5xl">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-3 text-zinc-500 text-xs font-semibold mb-8">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />{post.readTime}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : ""}
              </span>
            </div>
            
            {/* Author */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border border-zinc-800 object-cover"
              />
              <div className="text-left">
                <p className="text-sm text-white font-bold">{post.author.name}</p>
                <p className="text-xs text-zinc-500">{post.author.title}</p>
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className={`relative w-full overflow-hidden rounded-3xl border border-zinc-800 mb-10 max-h-[650px] ${thumbnailAspect(post.thumbnailSize)}`}>
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Featured Shopify App CTA Banner */}
          {post.targetAppId && post.targetAppId !== "none" && (() => {
            const app = getAppInfo(post.targetAppId)
            return (
              <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-3xl shrink-0 shadow-lg">
                    {app.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Featured Shopify App
                    </span>
                    <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                      {app.heading}
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1">
                      {app.subheading}
                    </p>
                  </div>
                </div>

                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAppConversion(post.id, app.id)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-100 text-black text-xs font-bold rounded-2xl transition-all shadow-xl shrink-0 whitespace-nowrap cursor-pointer"
                >
                  Install Free on Shopify <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )
          })()}

          {/* Body */}
          <div className="max-w-5xl mx-auto">
            <div className="prose prose-invert prose-zinc max-w-none prose-p:leading-[1.85] prose-a:text-blue-400 prose-headings:font-black prose-img:rounded-2xl">
              {post.content.length === 1 && post.content[0].includes('<') ? (
                <div dangerouslySetInnerHTML={{ __html: post.content[0] }} />
              ) : (
                <div className="flex flex-col gap-5 text-zinc-300 text-sm md:text-[15px] leading-[1.85]">
                  {post.content.map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-zinc-800">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-xs font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 👍 Merchant Feedback & Claps Widget */}
            <div className="mt-12 p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div>
                <p className="text-white text-sm font-bold">Was this Shopify guide helpful?</p>
                <p className="text-zinc-500 text-xs mt-0.5">Let us know if you enjoyed this content</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    trackFeedback(post.id, "clap")
                    setClapCount(prev => prev + 1)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  👏 Claps ({clapCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    trackFeedback(post.id, "yes")
                    setHelpfulYes(prev => prev + 1)
                    setFeedbackGiven(true)
                  }}
                  disabled={feedbackGiven}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    feedbackGiven 
                      ? "bg-emerald-950/60 border-emerald-800 text-emerald-300 opacity-90"
                      : "bg-emerald-950/40 border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/60"
                  }`}
                >
                  👍 Yes ({helpfulYes})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    trackFeedback(post.id, "no")
                    setFeedbackGiven(true)
                  }}
                  disabled={feedbackGiven}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  👎 Needs Work
                </button>
              </div>
            </div>

            {/* 📧 Newsletter Subscription Form */}
            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 flex flex-col gap-4 text-center md:text-left shadow-2xl">
              <div>
                <h3 className="text-white text-lg font-black tracking-tight">Subscribe for Shopify Growth Hacks</h3>
                <p className="text-zinc-400 text-xs mt-1">Get the latest Liquid section templates, variant swatch tips &amp; CRO strategies delivered to your inbox.</p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!leadEmail.trim()) return
                  const ok = await addLead(leadEmail, post.id, post.targetAppId)
                  if (ok) {
                    setLeadSubmitted(true)
                    setLeadEmail("")
                  }
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-lg"
              >
                <input
                  type="email"
                  value={leadEmail}
                  onChange={e => setLeadEmail(e.target.value)}
                  placeholder="Enter your store email..."
                  required
                  className="flex-1 bg-black border border-zinc-800 focus:border-zinc-500 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-400 outline-none shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-zinc-100 text-black font-extrabold text-xs rounded-2xl transition-all shadow-lg cursor-pointer shrink-0"
                >
                  {leadSubmitted ? "Subscribed! ✓" : "Join Newsletter"}
                </button>
              </form>
            </div>

            {/* 💬 Merchant Comments Section */}
            <div className="mt-12 pt-10 border-t border-zinc-800 flex flex-col gap-6">
              <h3 className="text-white text-xl font-black tracking-tight flex items-center gap-2">
                💬 Merchant Comments ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!cmtName.trim() || !cmtEmail.trim() || !cmtContent.trim()) return
                  try {
                    const newCmt = await saveComment({
                      postId: post.id,
                      postTitle: post.title,
                      authorName: cmtName.trim(),
                      email: cmtEmail.trim(),
                      content: cmtContent.trim(),
                    })
                    setComments(prev => [newCmt, ...prev])
                    setCmtSubmitted(true)
                    setCmtName("")
                    setCmtEmail("")
                    setCmtContent("")
                  } catch {
                    // silently fail
                  }
                }}
                className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col gap-4 shadow-xl"
              >
                <p className="text-white text-xs font-black uppercase tracking-wider">Leave a Response</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cmtName}
                    onChange={e => setCmtName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-400 outline-none"
                  />
                  <input
                    type="email"
                    value={cmtEmail}
                    onChange={e => setCmtEmail(e.target.value)}
                    placeholder="Your Email (kept private)"
                    required
                    className="bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-400 outline-none"
                  />
                </div>
                <textarea
                  value={cmtContent}
                  onChange={e => setCmtContent(e.target.value)}
                  placeholder="Share your thoughts or ask a question..."
                  rows={3}
                  required
                  className="bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-400 outline-none resize-none"
                />
                <div className="flex items-center justify-between gap-4">
                  {cmtSubmitted ? (
                    <p className="text-emerald-400 text-xs font-bold">✓ Comment submitted! Pending admin review.</p>
                  ) : <span />}
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white hover:bg-zinc-100 text-black font-black text-xs rounded-xl transition-all shadow-lg cursor-pointer ml-auto"
                  >
                    Submit Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="flex flex-col gap-4">
                {comments.length === 0 && (
                  <p className="text-zinc-500 text-xs italic">No comments yet. Be the first to leave a response!</p>
                )}
                {comments.map(c => (
                  <div key={c.id} className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800/90 flex flex-col gap-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.authorName.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-white text-xs font-bold">{c.authorName}</p>
                        {c.status === "pending" ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 text-[10px] font-bold animate-pulse">
                            ⌛ Under Admin Review (Visible to you)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
                            ✓ Published Live
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-600 text-[10px] font-medium">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-zinc-300 text-xs leading-relaxed pl-1">"{c.content}"</p>

                    {/* Official Admin Reply Card */}
                    {c.adminReply && (
                      <div className="mt-2 ml-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 flex flex-col gap-1.5 shadow-lg">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <p className="text-emerald-400 text-xs font-black tracking-tight flex items-center gap-1.5">
                            ⚡ Official Klenzo Support Team Reply
                          </p>
                        </div>
                        <p className="text-zinc-200 text-xs leading-relaxed pl-3.5 border-l-2 border-emerald-500/50">{c.adminReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </article>
      </main>

      <MinimalFooter />
    </div>
  )
}
