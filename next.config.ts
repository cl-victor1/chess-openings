import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pure client-side app: no server routes, no server compute. The Stockfish
  // engine runs in a browser Web Worker from /public/engine. Static export keeps
  // the Vercel deploy 100% static (no serverless functions to spin up).
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
