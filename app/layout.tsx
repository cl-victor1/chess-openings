import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
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
