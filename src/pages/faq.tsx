import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, Search, Mail, Phone, ArrowRight, UserCheck } from "lucide-react"
import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { useSEO } from "@/lib/useSEO"

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

interface FaqItem {
  id: string
  category: "About Mitul" | "Shopify & Liquid" | "AI Section Hub" | "Mobile & Tech Stack" | "Hiring & Process"
  question: string
  answer: string
}

const PORTFOLIO_FAQS: FaqItem[] = [
  {
    id: "who-is-mitul",
    category: "About Mitul",
    question: "Who is Mitul Zalavadiya and what is your core expertise?",
    answer: "I am a Shopify Developer and Shopify App Architect based in Surat, Gujarat, holding a Bachelor of Computer Applications (BCA) from GLS University, Ahmedabad. My core expertise lies in developing custom high-converting Shopify storefronts, bespoke Online Store 2.0 Liquid sections, and full-featured public/custom Shopify apps such as AI Section Hub (700+ theme sections). I also build cross-platform mobile apps using React Native."
  },
  {
    id: "education-experience",
    category: "About Mitul",
    question: "What is your educational background and work experience?",
    answer: "I completed my Bachelor of Computer Applications (BCA) at GLS University, Ahmedabad (2022–2025). Professionally, I work as a Shopify Developer & App Developer at Solvifytech (2026–Present), building custom e-commerce websites and developing the AI Section Hub app. Previously, I worked as a React Native Developer at Identiq Infotech (2025–2026), building cross-platform mobile applications with Redux, Firebase, and native device integrations."
  },
  {
    id: "shopify-services",
    category: "Shopify & Liquid",
    question: "What specific Shopify development services do you offer?",
    answer: "I offer end-to-end Shopify engineering services:\n• Custom Theme Development: Pixel-perfect builds from Figma, Adobe XD, or custom design concepts.\n• Reusable Online Store 2.0 Sections: Drag-and-drop Liquid sections (heroes, interactive sliders, shoppable video reels, lookbooks, sticky grids).\n• Performance & Speed Optimization: Achieving 90+ Google Lighthouse scores with clean native code.\n• Shopify App Architecture: Building custom apps using Shopify Admin/Storefront APIs, Node.js, and React.\n• Theme Migrations: Upgrading vintage themes to modular Online Store 2.0 architecture."
  },
  {
    id: "speed-liquid-vs-builders",
    category: "Shopify & Liquid",
    question: "Why choose custom Liquid sections over page builders like PageFly or GemPages?",
    answer: "Third-party page builders often inject hundreds of kilobytes of render-blocking JavaScript and external CSS that drastically degrade mobile page load speeds and SEO rankings. In contrast, I write lightweight, native Shopify Liquid code directly into your theme. My sections integrate seamlessly into your native Shopify Theme Customizer, require zero third-party script overhead, and compile natively on Shopify's lightning-fast edge servers."
  },
  {
    id: "os2-compatibility",
    category: "Shopify & Liquid",
    question: "Are your custom sections compatible with Shopify Online Store 2.0 and free themes?",
    answer: "Yes, 100%. All sections and components are architected following Shopify's official theme architecture guidelines. They work out of the box with Dawn, Sense, Refresh, Craft, Prestige, Impulse, and any custom or headless Shopify theme without breaking existing styles."
  },
  {
    id: "ai-section-hub-role",
    category: "AI Section Hub",
    question: "What is AI Section Hub and what was your role in building it?",
    answer: "AI Section Hub is a flagship Shopify app offering merchants over 700+ pre-built, conversion-boosting theme sections (curved carousels, 3D lookbooks, sticky layered heroes, WhatsApp chat, and flash sale countdowns). At Solvifytech, I built and actively maintain the app using Shopify APIs, Liquid, React, and JavaScript. I also authored 30+ hands-on tutorial videos on our official YouTube channel (@ai-section-hub)."
  },
  {
    id: "tech-stack-details",
    category: "Mobile & Tech Stack",
    question: "What technologies and frameworks do you use in your development stack?",
    answer: "My core technical toolbox includes:\n• Web & E-commerce: Shopify Liquid, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS, React, Vite\n• Mobile Apps: React Native, Redux, Redux Persist, AsyncStorage, Firebase\n• Backend & APIs: Shopify Storefront & Admin REST/GraphQL APIs, Node.js, PostgreSQL, Supabase\n• Tools & Workflows: Git, GitHub, Theme Kit / Shopify CLI, Figma, VS Code"
  },
  {
    id: "react-native-skills",
    category: "Mobile & Tech Stack",
    question: "Can you build cross-platform mobile apps for iOS and Android?",
    answer: "Yes. From my experience at Identiq Infotech, I have hands-on experience building production React Native apps with smooth navigation, persistent Redux state management, Firebase backend integration, contact management, camera integration, and push notification systems."
  },
  {
    id: "project-turnaround",
    category: "Hiring & Process",
    question: "What is your typical project timeline and workflow?",
    answer: "My workflow is structured and transparent:\n1. Discovery & Scope: Reviewing your requirements, Figma designs, or reference stores.\n2. Sandbox Development: Developing inside a private development or duplicate theme to ensure zero downtime on your live store.\n3. Responsive QA: Rigorous testing across mobile, tablet, and desktop on Safari, Chrome, and Firefox.\n4. Handover & Walkthrough: Deploying the code and providing a walkthrough on how to customize settings via the theme editor.\nIndividual sections typically take 24–48 hours, while full store setups take 1–2 weeks."
  },
  {
    id: "availability-contact",
    category: "Hiring & Process",
    question: "Are you available for freelance projects, contract roles, or full-time opportunities?",
    answer: "Yes! I am actively available for freelance projects, ongoing store retainers, and full-time software engineering roles. You can reach out directly via email at mitulzalavadiya10@gmail.com, connect on LinkedIn (linkedin.com/in/mitul-zalavadiya-784873369), or call/WhatsApp me at +91 9099105448."
  }
]

const CATEGORIES = [
  "All",
  "About Mitul",
  "Shopify & Liquid",
  "AI Section Hub",
  "Mobile & Tech Stack",
  "Hiring & Process"
] as const

const LINKEDIN_URL = "https://www.linkedin.com/in/mitul-zalavadiya-784873369?utm_source=share_via&utm_content=profile&utm_medium=member_android"

export function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [openIndex, setOpenIndex] = useState<string | null>(PORTFOLIO_FAQS[0].id)

  useSEO({
    title: "FAQ — Mitul Zalavadiya | Shopify Developer & App Architect",
    description: "Frequently Asked Questions about Mitul Zalavadiya — Shopify developer, creator of AI Section Hub, custom Liquid theme specialist, and React Native engineer based in Surat, Gujarat.",
    canonical: "https://klenzo.app/faq",
    keywords: "Mitul Zalavadiya FAQ, hire Shopify developer, Shopify freelance developer Surat, AI Section Hub developer, custom Shopify liquid developer",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://klenzo.app/faq#webpage",
      "url": "https://klenzo.app/faq",
      "name": "Mitul Zalavadiya — Frequently Asked Questions",
      "description": "Answers to common questions about hiring Mitul Zalavadiya for Shopify development, custom themes, app development, and React Native mobile apps.",
      "mainEntity": PORTFOLIO_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  })

  const filteredFaqs = useMemo(() => {
    return PORTFOLIO_FAQS.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCat = selectedCategory === "All" || faq.category === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [searchQuery, selectedCategory])

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id)
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <CursorFollower />
      <Header1 />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-5%] left-[20%] w-[600px] h-[600px] rounded-full bg-zinc-800/20 blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-zinc-900/30 blur-[130px]" />
      </div>

      <main className="relative z-10 container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-36 pb-32">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur text-zinc-300 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <UserCheck className="w-3.5 h-3.5 text-zinc-300" />
            Developer FAQ &amp; Capabilities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-5"
          >
            Got Questions?{" "}
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Here Are the Answers.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            Everything you need to know about my background, Shopify expertise, technical stack, app development achievements, and how we can work together.
          </motion.p>

          {/* Quick Contact Links Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-3 flex-wrap text-xs font-bold"
          >
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
            >
              <LinkedinIcon className="w-3.5 h-3.5 fill-current" />
              LinkedIn Profile
              <ArrowRight className="w-3 h-3" />
            </a>

            <a
              href="mailto:mitulzalavadiya10@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all duration-200 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              mitulzalavadiya10@gmail.com
            </a>

            <a
              href="tel:9099105448"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all duration-200 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              +91 9099105448
            </a>
          </motion.div>
        </div>

        {/* Quick Highlights Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur text-center">
            <span className="text-xl sm:text-2xl font-black text-white block">1+ Year</span>
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mt-1 block">Shopify Experience</span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur text-center">
            <span className="text-xl sm:text-2xl font-black text-white block">700+</span>
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mt-1 block">Liquid Sections Built</span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur text-center">
            <span className="text-xl sm:text-2xl font-black text-white block">BCA</span>
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mt-1 block">GLS University</span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur text-center">
            <span className="text-xl sm:text-2xl font-black text-white block">AI App</span>
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mt-1 block">AI Section Hub</span>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-900">
          {/* Categories */}
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
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] md:min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. Liquid, app, fee)..."
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-white rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
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

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/40 border border-zinc-900 rounded-3xl">
            <p className="text-zinc-400 text-sm">No questions matching your search. Feel free to contact me directly!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === faq.id
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-zinc-700 bg-zinc-950/90 shadow-xl"
                      : "border-zinc-850/80 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-900/30"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="w-fit px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        {faq.category}
                      </span>
                      <span className="text-white font-bold text-base sm:text-lg leading-snug">
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 border-white text-white" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-900 text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Bottom Callout / Contact Box */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-800 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 inline-flex items-center justify-center mb-4 text-white">
              <Mail className="w-6 h-6" />
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Have a question not listed here?
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              I'm always happy to talk about store architectures, custom liquid sections, or full-time opportunities. Drop me a line directly.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href="mailto:mitulzalavadiya10@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Email Me Directly
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-850 transition-all cursor-pointer"
              >
                <LinkedinIcon className="w-4 h-4 fill-current text-blue-400" />
                Message on LinkedIn
              </a>
            </div>
          </div>
        </div>

      </main>

      <MinimalFooter />
    </div>
  )
}
