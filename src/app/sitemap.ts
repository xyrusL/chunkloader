import type { MetadataRoute } from "next";
import { getSiteUrl, HOMEPAGE_LAST_MODIFIED } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: HOMEPAGE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/explore`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
