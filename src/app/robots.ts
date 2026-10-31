import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Uploaded photos stay crawlable; the admin and its API do not.
        allow: ["/", "/api/media/file/"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
