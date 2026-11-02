import { useState, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SiteLoader } from '@/components/ui/site-loader'
import { Header1 } from "@/components/ui/header"
import { Hero } from "@/components/ui/hero-1"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { useSEO } from "@/lib/useSEO"

// Lazy load heavy components for better initial load
const AppShowcase = lazy(() => import("@/components/ui/app-showcase").then(m => ({ default: m.AppShowcase })))
const SectionlyShowcase = lazy(() => import("@/components/ui/sectionly-showcase").then(m => ({ default: m.SectionlyShowcase })))
const HomepageTemplatesSection = lazy(() => import("@/components/ui/homepage-templates").then(m => ({ default: m.HomepageTemplatesSection })))
const AnimatedCarousel = lazy(() => import("@/components/ui/logo-carousel").then(m => ({ default: m.AnimatedCarousel })))
const HeroScrollDemo = lazy(() => import("@/components/ui/hero-scroll-demo").then(m => ({ default: m.HeroScrollDemo })))
const FeedbackSection = lazy(() => import("@/components/ui/feedback-section").then(m => ({ default: m.FeedbackSection })))
const Demo = lazy(() => import("@/components/ui/demo"))
const TechStackSection = lazy(() => import("@/components/ui/tech-stack-section").then(m => ({ default: m.TechStackSection })))

// Lazy load pages
const AboutPage = lazy(() => import("@/pages/about").then(m => ({ default: m.AboutPage })))
const ConnectPage = lazy(() => import("@/pages/connect").then(m => ({ default: m.ConnectPage })))
const ContactPage = lazy(() => import("@/pages/contact").then(m => ({ default: m.ContactPage })))
const PrivacyPage = lazy(() => import("@/pages/privacy").then(m => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import("@/pages/terms").then(m => ({ default: m.TermsPage })))
const GuidePage = lazy(() => import("@/pages/guide").then(m => ({ default: m.GuidePage })))
const FaqPage = lazy(() => import("@/pages/faq").then(m => ({ default: m.FaqPage })))
const ShopifyWebsitePage = lazy(() => import("@/pages/shopify-website").then(m => ({ default: m.ShopifyWebsitePage })))
const ShopifyAppsPage = lazy(() => import("@/pages/shopify-apps").then(m => ({ default: m.ShopifyAppsPage })))
const NotFoundPage = lazy(() => import("@/pages/not-found").then(m => ({ default: m.NotFoundPage })))
const LoginPage = lazy(() => import("@/pages/login").then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import("@/pages/dashboard").then(m => ({ default: m.DashboardPage })))

// Auth + protected
import { AuthProvider }    from "@/context/AuthContext"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ProtectedRoute }  from "@/components/ui/ProtectedRoute"
import { AnalyticsTracker } from "@/components/ui/AnalyticsTracker"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
)

function HomePage() {
  useSEO({
    title: "Mitul Zalavadiya — Shopify Apps & High-Converting Storefronts",
    description: "Explore Shopify apps and custom engineering by Mitul Zalavadiya. AI Section Hub (700+ sections) and Variant Swatch (smart swatches) trusted by 2,300+ merchants.",
    canonical: "https://klenzo.app/",
    keywords: "Mitul Zalavadiya, Shopify apps, AI Section Hub, Variant Swatch, Shopify sections, color swatches, product variants, conversion booster",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://klenzo.app/#webpage",
        "url": "https://klenzo.app/",
        "name": "Mitul Zalavadiya — Shopify Apps & Engineering",
        "isPartOf": { "@id": "https://klenzo.app/#website" },
        "about": { "@id": "https://klenzo.app/#organization" },
        "description": "Mitul Zalavadiya builds AI-powered Shopify apps and custom storefronts that elevate store design and conversions for merchants worldwide.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://klenzo.app/" }]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Section Hub",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Shopify",
        "url": "https://apps.shopify.com/ai-section-hub",
        "description": "700+ premium native Shopify sections, FAQ accordions, shoppable Instagram reels and AI widgets — installed in one click. No code required.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "2300" },
        "author": { "@id": "https://klenzo.app/#organization" }
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Variant Swatch",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Shopify",
        "url": "https://apps.shopify.com/klenzo-product-variant-swatch",
        "description": "Replace native Shopify variant dropdowns with AI-powered color and image swatches. Auto-detects variants — no coding needed.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "author": { "@id": "https://klenzo.app/#organization" }
      }
    ],
  })

  const partnerLogos = [
    "https://cdn.simpleicons.org/react/000000",
    "https://cdn.simpleicons.org/nextdotjs/000000",
    "https://cdn.simpleicons.org/vercel/000000",
    "https://cdn.simpleicons.org/typescript/000000",
    "https://cdn.simpleicons.org/tailwindcss/000000",
    "https://cdn.simpleicons.org/stripe/000000",
    "https://cdn.simpleicons.org/notion/000000",
    "https://cdn.simpleicons.org/github/000000",
    "https://cdn.simpleicons.org/figma/000000",
    "https://cdn.simpleicons.org/framer/000000",
    "https://cdn.simpleicons.org/storybook/000000",
    "https://cdn.simpleicons.org/sanity/000000",
  ]

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <CursorFollower />
      <Header1 />
      <main className="pt-0">
        <Hero />
        <Suspense fallback={<div className="h-screen bg-black" />}>
          <Demo />
          <SectionlyShowcase />
          <HomepageTemplatesSection />
          <AppShowcase />
          <AnimatedCarousel
            title="Trusted by Modern Shopify Teams"
            logos={partnerLogos}
            autoPlay={true}
            autoPlayInterval={3000}
            itemsPerViewMobile={3}
            itemsPerViewDesktop={5}
            logoContainerWidth="w-40"
            logoContainerHeight="h-20"
            logoImageWidth="w-auto"
            logoImageHeight="h-8"
            padding="pt-12 lg:pt-16 pb-0"
          />
          <HeroScrollDemo />
          <FeedbackSection />
          <TechStackSection />
        </Suspense>
      </main>
      <MinimalFooter />
    </div>
  )
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id"
  const location = useLocation()
  const [introDone, setIntroDone] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroDone(true), [])
  const showIntro = location.pathname === '/' && !introDone

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AnalyticsTracker />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public ─────────────────────────────────── */}
            <Route path="/"        element={<HomePage />} />
            <Route path="/about"   element={<AboutPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms"   element={<TermsPage />} />
            <Route path="/guide"   element={<GuidePage />} />
            <Route path="/faq"     element={<FaqPage />} />
            <Route path="/shopify-website"  element={<ShopifyWebsitePage />} />
            <Route path="/shopify-websites" element={<ShopifyWebsitePage />} />
            <Route path="/shopify-apps"     element={<ShopifyAppsPage />} />
            <Route path="/shopify-app"      element={<ShopifyAppsPage />} />

            {/* ── Merchant auth ──────────────────────────── */}
            <Route path="/login"   element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* ── 404 ────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        {showIntro && <SiteLoader onComplete={handleIntroComplete} />}
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
