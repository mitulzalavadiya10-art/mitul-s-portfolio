export interface ImageData {
    id: number;
    title: string;
    category?: string;
    src: string;
    url?: string;
}

export const images: ImageData[] = [
    { id: 1, title: "Balloon Showcase", category: "Shopify Store", src: "/images/balloon.jpg" },
    { id: 2, title: "Basket Luxury", category: "Ecommerce Brand", src: "/images/basket.jpg" },
    { id: 3, title: "Clouds Apparel", category: "Fashion Store", src: "/images/clouds.jpg" },
    { id: 4, title: "Dune Aesthetics", category: "Minimal Boutique", src: "/images/dune.jpg" },
    { id: 5, title: "Eye Optics", category: "Eyewear Brand", src: "/images/eye.jpg" },
    { id: 6, title: "Falling Trends", category: "Streetwear", src: "/images/fall.jpg" },
    { id: 7, title: "Field Botanics", category: "Organic Skincare", src: "/images/field.jpg" },
    { id: 8, title: "Fuji Lifestyle", category: "Japanese Goods", src: "/images/fuji.jpg" },
    { id: 9, title: "Snow Peak Gear", category: "Outdoor Apparel", src: "/images/heyoh.jpg" },
    { id: 10, title: "House & Living", category: "Modern Interior", src: "/images/house.jpg" },
    { id: 11, title: "Only Carat", category: "Lab-Grown Diamond Jewelry", src: "/images/onlycarat.png", url: "https://www.onlycarat.com/" },
    { id: 12, title: "Loista Jewels", category: "Fine Diamond & Jewelry", src: "/images/loista-diamond.png", url: "https://loista-diamond.myshopify.com/" },
    { id: 13, title: "Vogue Atelier", category: "High Fashion", src: "/images/img3.jpg" },
    { id: 14, title: "Urban Pulse", category: "Activewear", src: "/images/img4.jpg" },
    { id: 15, title: "Lumina Home", category: "Lighting & Decor", src: "/images/img5.jpg" },
    { id: 16, title: "Nordic Minimal", category: "Furniture Design", src: "/images/img6.jpg" },
    { id: 17, title: "Lighthouse Goods", category: "Coastal Heritage", src: "/images/lighthouse.jpg" },
    { id: 18, title: "Alpine Horizons", category: "Travel Accessories", src: "/images/mt.jpg" },
    { id: 19, title: "Cobalt Studio", category: "Art & Ceramics", src: "/images/spider.jpg" },
    { id: 20, title: "Aqua Essence", category: "Hydration Products", src: "/images/wa.jpg" },
    { id: 21, title: "Golden Harvest", category: "Gourmet Foods", src: "/images/wheat.jpg" },
];

export const imagePaths: string[] = images.map((img) => img.src);
