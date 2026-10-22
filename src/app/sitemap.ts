import type { MetadataRoute } from "next";

import { siteUrl } from "@/data/site";
import { publishableTestimonials } from "@/data/testimonials";
import { getContent } from "@/lib/content";

/**
 * Sitemap.
 *
 * Routes that are served `noindex` are deliberately excluded — listing a
 * noindex URL in a sitemap is a contradictory signal. As placeholder events,
 * draft articles and real testimonials are filled in, the corresponding
 * entries appear here automatically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { events, posts, testimonials } = await getContent();
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: "monthly" | "yearly" | "weekly" }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/kalarippayattu", priority: 0.9, changeFrequency: "monthly" },
    { path: "/disciplines", priority: 0.8, changeFrequency: "monthly" },
    { path: "/kalari-marma-healing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/admissions", priority: 0.9, changeFrequency: "monthly" },
    { path: "/heritage", priority: 0.7, changeFrequency: "yearly" },
    { path: "/gallery", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  if (publishableTestimonials(testimonials).length > 0) {
    entries.push({
      url: `${siteUrl}/testimonials`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  const realEvents = events.filter((event) => !event.isPlaceholder);
  if (realEvents.length > 0) {
    entries.push({
      url: `${siteUrl}/events`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const event of realEvents) {
      entries.push({
        url: `${siteUrl}/events/${event.slug}`,
        lastModified: new Date(`${event.date}T00:00:00Z`),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  const livePosts = posts.filter((post) => !post.isDraft);
  if (livePosts.length > 0) {
    entries.push({
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
    for (const post of livePosts) {
      entries.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
