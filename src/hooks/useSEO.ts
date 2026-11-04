import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
}

/**
 * Hook to dynamically update SEO tags (title, description, OpenGraph, Twitter)
 * based on the current page view.
 */
export const useSEO = ({
  title,
  description,
  canonicalUrl,
}: SEOProps): void => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (
      selector: string,
      attributeName: string,
      attributeValue: string,
      content: string
    ): void => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update or create link tags (e.g., canonical)
    const setLinkTag = (rel: string, href: string): void => {
      let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Standard Meta Description
    setMetaTag('meta[name="description"]', "name", "description", description);

    // 3. OpenGraph + Twitter Card tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:type"]', "property", "og:type", "website");
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "JÁ Benefícios");
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);

    // 4. Canonical URL if provided or derived from window location
    const url = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (url) {
      setLinkTag("canonical", url);
      setMetaTag('meta[property="og:url"]', "property", "og:url", url);
    }
  }, [title, description, canonicalUrl]);
};
