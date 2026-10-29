import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

/**
 * Hook to dynamically update SEO tags (title, description, OpenGraph, Twitter)
 * based on the current page view.
 */
export const useSEO = ({
  title,
  description,
  ogTitle,
  ogDescription,
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

    const effectiveOgTitle = ogTitle || title;
    const effectiveOgDesc = ogDescription || description;

    // 2. Standard Meta Description
    setMetaTag('meta[name="description"]', "name", "description", description);

    // 3. OpenGraph Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", effectiveOgTitle);
    setMetaTag(
      'meta[property="og:description"]',
      "property",
      "og:description",
      effectiveOgDesc
    );
    setMetaTag('meta[property="og:type"]', "property", "og:type", "website");
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "JÁ Benefícios");

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", effectiveOgTitle);
    setMetaTag(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      effectiveOgDesc
    );

    // 5. Canonical URL if provided or derived from window location
    const url = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (url) {
      setLinkTag("canonical", url);
      setMetaTag('meta[property="og:url"]', "property", "og:url", url);
    }
  }, [title, description, ogTitle, ogDescription, canonicalUrl]);
};
