import type { MetadataRoute } from "next";

// Same canonical host as app/sitemap.ts.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chess-mate.ai";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Static export with a single page: nothing private to hide. /cdn-cgi/ is
    // Cloudflare's zone-level endpoint (email decoding, challenges, beacons).
    rules: { userAgent: "*", allow: "/", disallow: "/cdn-cgi/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
