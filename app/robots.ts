import type { MetadataRoute } from "next";

// Same canonical host as app/sitemap.ts.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chess-mate.ai";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
