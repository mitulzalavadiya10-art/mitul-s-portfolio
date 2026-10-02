import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noIndex?: boolean;
  schema?: object | object[];
}

const SITE_NAME = "Mitul Zalavadiya";
const DEFAULT_OG_IMAGE = "https://klenzo.app/og-image.png";
const TWITTER_HANDLE = "@mitul1125";

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function injectSchema(schema: object | object[]) {
  // Remove any previously injected per-page schema
  document
    .querySelectorAll('script[data-seo="page-schema"]')
    .forEach((s) => s.remove());

  const schemas = Array.isArray(schema) ? schema : [schema];
  schemas.forEach((s) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "page-schema");
    script.textContent = JSON.stringify(s, null, 0);
    document.head.appendChild(script);
  });
}

export function useSEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  keywords,
  noIndex = false,
  schema,
}: SEOProps) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // ── Robots ─────────────────────────────────────────────
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

    // ── Core meta ──────────────────────────────────────────
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    // ── Canonical ──────────────────────────────────────────
    setLink("canonical", canonical);

    // ── Open Graph ─────────────────────────────────────────
    setMeta("og:type", ogType, true);
    setMeta("og:url", canonical, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", fullTitle, true);
    setMeta("og:locale", "en_US", true);

    // ── Twitter Card ───────────────────────────────────────
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", TWITTER_HANDLE);
    setMeta("twitter:creator", TWITTER_HANDLE);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setMeta("twitter:image:alt", fullTitle);

    // ── JSON-LD Schema ─────────────────────────────────────
    if (schema) {
      injectSchema(schema);
    } else {
      document
        .querySelectorAll('script[data-seo="page-schema"]')
        .forEach((s) => s.remove());
    }
  }, [title, description, canonical, ogImage, ogType, keywords, noIndex, schema]);
}
