import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Same canonical host as app/sitemap.ts and app/robots.ts.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chess-mate.ai";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  // The site is a single page, so "/" resolves against metadataBase to the
  // home page's own absolute URL: a self canonical.
  alternates: { canonical: "/" },
  title: "Chess Openings Trainer — Practice 50 Classic Openings",
  description:
    "Practice the 50 most classic chess openings against their book lines, then play on against Stockfish — all running in your browser. Save your games as PGN. No login required.",
  keywords: [
    "chess openings",
    "opening trainer",
    "Ruy Lopez",
    "Sicilian Defense",
    "Queen's Gambit",
    "Stockfish",
    "PGN",
    "chess practice",
  ],
  openGraph: {
    title: "Chess Openings Trainer",
    description: "Practice 50 classic chess openings with book lines and in-browser Stockfish.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-stone-900 antialiased">
        {children}
        {/* Vercel Web Analytics only exists on Vercel. VERCEL_ENV is set during
            Vercel builds and never on the Cloudflare build, so the static export
            for Workers carries no /_vercel/insights script (it would 404 there).
            Cloudflare Web Analytics is injected by the zone instead. */}
        {process.env.VERCEL_ENV ? <Analytics /> : null}
      </body>
    </html>
  );
}
