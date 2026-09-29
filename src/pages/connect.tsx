import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { SocialConnect } from "@/components/ui/connect-with-us"
import { useSEO } from "@/lib/useSEO"

export function ConnectPage() {
  useSEO({
    title: "Connect With Mitul Zalavadiya — Social Media & Community",
    description: "Follow Mitul Zalavadiya on YouTube, LinkedIn, Instagram, X (Twitter) and Reddit. Stay updated on Shopify app development, AI Section Hub tutorials, and developer insights.",
    canonical: "https://klenzo.app/connect",
    keywords: "Mitul Zalavadiya social media, AI Section Hub YouTube, Mitul LinkedIn, Shopify developer community",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://klenzo.app/connect#webpage",
      "url": "https://klenzo.app/connect",
      "name": "Connect With Mitul Zalavadiya",
      "description": "Follow Mitul Zalavadiya across social media platforms for Shopify development tips, app updates, and developer resources.",
      "isPartOf": { "@id": "https://klenzo.app/#website" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://klenzo.app/" },
          { "@type": "ListItem", "position": 2, "name": "Connect", "item": "https://klenzo.app/connect" }
        ]
      }
    },
  })
  return (
    <div className="relative min-h-screen bg-black text-white">
      <Header1 />
      <main className="pt-24 md:pt-32">
        <SocialConnect />
      </main>
      <MinimalFooter />
    </div>
  )
}
