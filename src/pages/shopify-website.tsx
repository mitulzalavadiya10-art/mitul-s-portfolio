import { useSEO } from "@/lib/useSEO";
import ReelFlux from "@/components/reel-flux/ReelFlux";

export function ShopifyWebsitePage() {
    useSEO({
        title: "Shopify Website Showcase — 3D Interactive Gallery | Mitul Zalavadiya",
        description: "Explore our interactive 3D gallery of premium Shopify websites, high-converting Liquid themes, and custom ecommerce stores designed and engineered by Mitul Zalavadiya.",
        canonical: "https://klenzo.app/shopify-website",
        keywords: "Shopify website showcase, 3D web gallery, ecommerce portfolio, Shopify store design, Liquid templates",
    });

    return <ReelFlux />;
}

export default ShopifyWebsitePage;
