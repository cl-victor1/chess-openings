import type { MetadataRoute } from "next";

// Set NEXT_PUBLIC_SITE_URL in Vercel to your deployed domain for accurate URLs.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chess-openings-trainer.vercel.app";

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
