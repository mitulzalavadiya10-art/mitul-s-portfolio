import { Header1 } from "@/components/ui/header"
import { MinimalFooter } from "@/components/ui/minimal-footer"
import { CursorFollower } from "@/components/ui/cursor-follower"
import ContactWithGlobe from "@/components/ui/contact-with-globe"
import { useSEO } from "@/lib/useSEO"

export function ContactPage() {
  useSEO({
    title: "Contact Klenzo — Get in Touch with Our Team",
    description: "Contact the Klenzo engineering team. Have questions about AI Section Hub or Klenzo: Variant Swatch? Reach out today.",
    canonical: "https://klenzo.app/contact",
  })

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <CursorFollower />
      <Header1 />
      <main className="pt-20 md:pt-24">
        <ContactWithGlobe />
      </main>
      <MinimalFooter />
    </div>
  )
}
