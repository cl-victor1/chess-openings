// Copies the Stockfish 18 "lite-single" (single-threaded) engine + wasm out of
// node_modules into public/engine so Next.js / Vercel serve them as static assets.
// Single-threaded build needs no SharedArrayBuffer and no COOP/COEP headers.
// Resilient by design: never fail `pnpm install` if the source isn't there yet.
import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules", "stockfish", "bin");
const outDir = join(root, "public", "engine");

// We want the lite single-threaded flavor. File names look like:
//   stockfish-17-lite-single.js / .wasm   (version digits may change)
const wanted = /^stockfish-\d+(?:\.\d+)?-lite-single(?:-[0-9a-f]+)?\.(js|wasm)$/;

try {
  if (!existsSync(srcDir)) {
    console.warn(`[copy-engine] ${srcDir} not found yet — skipping (run again after install).`);
    process.exit(0);
  }
  mkdirSync(outDir, { recursive: true });
  const files = readdirSync(srcDir).filter((f) => wanted.test(f));
  if (files.length === 0) {
    console.warn(`[copy-engine] no lite-single engine files in ${srcDir}. Contents:`,
      readdirSync(srcDir).join(", "));
    process.exit(0);
  }
  for (const f of files) {
    copyFileSync(join(srcDir, f), join(outDir, f));
    console.log(`[copy-engine] copied ${f}`);
  }
} catch (err) {
  console.warn("[copy-engine] skipped due to error:", err?.message ?? err);
  process.exit(0);
}
