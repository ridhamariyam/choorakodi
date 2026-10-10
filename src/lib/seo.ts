import type { Metadata } from "next";
import { siteLocale, siteUrl, type Site } from "@/data/site";

export type PageSeo = {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. "/about". */
  path: string;
  /** Path to a page-specific OG image. Falls back to the site default. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /**
   * Set for pages built on unreviewed placeholder content. Keeping drafts out
   * of the index matters more than the extra impressions.
   */
  noindex?: boolean;
};

/**
 * Builds a complete metadata object: canonical, Open Graph and Twitter in one
 * place so no route can quietly ship without them.
 */
export function buildMetadata(
  { title, description, path, image, type = "website", publishedTime, modifiedTime, noindex = false }: PageSeo,
  site: Pick<Site, "name">,
): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const ogImageUrl = image ?? "/opengraph-image";

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title,
      description,
      locale: siteLocale,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/** Consistent "<page> — Choorakkodi Martial Arts Academy" titles. */
export function pageTitle(title: string, site: Pick<Site, "name">): string {
  return `${title} — ${site.name}`;
}
