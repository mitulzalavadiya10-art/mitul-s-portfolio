import { Routes, Route } from 'react-router-dom'
import { Header1 } from "@/components/ui/header"
import { Hero } from "@/components/ui/hero-1"
import { CursorFollower } from "@/components/ui/cursor-follower"
import { AppShowcase } from "@/components/ui/app-showcase"
import { CoverflowShowcase } from "@/components/ui/coverflow-showcase"
import { HomepageTemplatesSection } from "@/components/ui/homepage-templates"
import { AnimatedCarousel } from "@/components/ui/logo-carousel"
import { HeroScrollDemo } from "@/components/ui/hero-scroll-demo"
import { FaqSection } from "@/components/ui/faq-section"
import { FeedbackSection } from "@/components/ui/feedback-section"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { useSEO } from "@/lib/useSEO"

// Public pages
import { AboutPage }    from "@/pages/about"
import { ConnectPage }  from "@/pages/connect"
import { ContactPage }  from "@/pages/contact"
import { PrivacyPage }  from "@/pages/privacy"
import { TermsPage }    from "@/pages/terms"
import { GuidePage }    from "@/pages/guide"
import { FaqPage }      from "@/pages/faq"
import { ShopifyWebsitePage } from "@/pages/shopify-website"
import { NotFoundPage } from "@/pages/not-found"

// Auth + protected
import { AuthProvider }    from "@/context/AuthContext"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ProtectedRoute }  from "@/components/ui/ProtectedRoute"
import { LoginPage }       from "@/pages/login"
import { DashboardPage }   from "@/pages/dashboard"
import { AnalyticsTracker } from "@/components/ui/AnalyticsTracker"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { TechStackSection } from "@/components/ui/tech-stack-section"

function HomePage() {
  useSEO({
    title: "Klenzo: AI Shopify Apps — Theme Sections & Variant Swatches",
    description: "Klenzo builds AI-powered Shopify apps trusted by 2,300+ merchants. Install AI Section Hub (700+ sections) and Klenzo: Variant Swatch (smart swatches) — free trial, no code.",
    canonical: "https://klenzo.app/",
    keywords: "Shopify apps, AI Section Hub, Klenzo Variant Swatch, Shopify sections, color swatches, product variants, conversion booster",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://klenzo.app/#webpage",
        "url": "https://klenzo.app/",
        "name": "Klenzo — AI-Powered Shopify Apps",
        "isPartOf": { "@id": "https://klenzo.app/#website" },
        "about": { "@id": "https://klenzo.app/#organization" },
        "description": "Klenzo builds AI-powered Shopify apps that boost store design and conversions for merchants worldwide.",
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
        "name": "Klenzo: Variant Swatch",
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
    <div className="relative min-h-screen bg-background text-foreground">
      <CursorFollower />
      <Header1 />
      <main className="pt-16 md:pt-20">
        <Hero
          title="Boost Shopify Sales with AI-Powered Sections & Templates"
          subtitle="Transform your store design instantly. Add 150+ premium theme sections and replace dropdowns with AI-powered color swatches. No coding required."
          eyebrow="AI-Powered Shopify Apps"
          ctaLabel="Install Free on Shopify"
          ctaHref="https://apps.shopify.com/ai-section-hub"
        />
        {/* <SectionlyShowcase /> */}
        <CoverflowShowcase />
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
        <FaqSection />
        <FeedbackSection />
        <TechStackSection />
      </main>
      <MinimalFooter />
    </div>
  )
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id"

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AnalyticsTracker />
        <ScrollToTop />
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

          {/* ── Merchant auth ──────────────────────────── */}
          <Route path="/login"   element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* ── 404 ────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
