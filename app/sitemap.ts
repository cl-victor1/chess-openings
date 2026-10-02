import type { MetadataRoute } from "next";

// Canonical production host. NEXT_PUBLIC_SITE_URL overrides it at build time
// (for example for a staging copy).
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chess-mate.ai";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
