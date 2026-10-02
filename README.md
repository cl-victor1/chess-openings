# Chess Openings Trainer

Practice the **50 most classic chess openings** against their book lines, then play on
against **Stockfish 18** — all running entirely in your browser. Save any game as **PGN**.
No login, no database, no backend compute.

## Features

- **50 classic openings** (Ruy Lopez, Sicilian Najdorf, Queen's Gambit, King's Indian, …),
  grouped and searchable, each with a validated main line and a plain-English description.
- **Book trainer** — pick an opening and a side. The app auto-plays the opponent's book
  moves and checks yours. Wrong move? It tells you the expected one. A progress bar tracks
  how far down the line you are.
- **In-browser Stockfish** — once the book line ends (or you click *Free play from here*),
  turn on **Play vs Stockfish** or press **Hint**. The engine is the single-threaded
  Stockfish 18 "lite" WASM build running in a **Web Worker** — zero server compute, and it
  loads lazily so the trainer has no engine cost until you ask for it.
- **PGN export** — download or copy any game as PGN, with `Opening`/`ECO` headers.
- **Plain board UI**, drag-and-drop **and** click-to-move, board flip, undo, restart.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, static export) + TypeScript + Tailwind CSS v4
- [chess.js](https://github.com/jhlywa/chess.js) — move legality, SAN/FEN, PGN
- [react-chessboard](https://github.com/Clariity/react-chessboard) v5 — board UI
- [stockfish](https://github.com/nmrugg/stockfish.js) (Stockfish 18, `lite-single` WASM)

## Local development

```bash
pnpm install        # also copies the Stockfish engine into public/engine (postinstall)
pnpm dev            # http://localhost:3000
```

Other scripts:

```bash
pnpm run validate:openings   # replay all 50 lines through chess.js (legality + uniqueness)
pnpm test                    # vitest unit tests for the openings dataset
pnpm build                   # static production build -> ./out
```

## How the engine is served

`scripts/copy-engine.mjs` (run automatically on `postinstall`, and as part of nothing else)
copies `stockfish-18-lite-single.js` + `.wasm` from `node_modules/stockfish/bin` into
`public/engine/`. They are served as static assets and loaded with
`new Worker("/engine/stockfish-18-lite-single.js")`. The single-threaded build needs **no**
`SharedArrayBuffer` and **no** COOP/COEP headers, so it works on a plain static host.

The engine files are git-ignored (~7 MB) and regenerated on every install, including on
Vercel — so the repo stays lean.

## Deploy to Vercel

This app is a **static export** (`output: "export"` in `next.config.ts`) with no server
functions.

1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the repo. Framework preset: **Next.js** (auto-detected).
   Build command `next build` and install command `pnpm install` are picked up automatically;
   the engine is copied during install via `postinstall`.
3. (Optional) Set `NEXT_PUBLIC_SITE_URL` to override the canonical host in `sitemap.xml` and
   `robots.txt` (default `https://chess-mate.ai`).
4. Deploy. That's it — everything else runs client-side.

Or from the CLI:

```bash
pnpm dlx vercel        # preview deploy
pnpm dlx vercel --prod # production deploy
```

## Deploy to Cloudflare Workers (production)

Production (`chess-mate.ai`) is served by the Cloudflare Worker `chess-openings` on the
account `df09a764c02c8f903af0a0d02cc2aab7`. The Vercel project stays connected to this
repository as the rollback target; nothing in this section changes the Vercel build.

The Worker is **assets-only**: `wrangler.jsonc` has no `main` script and serves `./out`
(the static export) through Workers Static Assets. No OpenNext adapter is needed,
because the app has no server routes, middleware or image optimization.

```bash
pnpm cf:build     # next build + copy cloudflare/_headers into out/
pnpm cf:preview   # wrangler dev on http://localhost:8787, serves ./out
pnpm cf:deploy    # wrangler deploy (needs CLOUDFLARE_API_TOKEN)
```

Build rules:

- Build in a directory without `.env*` files. `next build` inlines every `NEXT_PUBLIC_*`
  value into the static HTML and JavaScript. Use a clean copy of the repository (for
  example `rsync --exclude '.env*' --exclude node_modules`) with the production build
  variables exported in the shell. The app needs no environment variables today.
- Leave `VERCEL_ENV` unset. `app/layout.tsx` renders `<Analytics />` (Vercel Web
  Analytics) only when `VERCEL_ENV` is set at build time, so the Cloudflare build carries
  no `/_vercel/insights` script.
- `cloudflare/_headers` gives `/_next/static/*` an immutable Cache-Control. It lives
  outside `public/` so Vercel never serves it as a file.
- The largest asset is the Stockfish WebAssembly file (about 7.3 MB), under the 25 MiB
  limit for one static asset.

Configuration outside git (set through the Cloudflare application programming interface
at cutover on 2026-10-02):

- Zone routes `chess-mate.ai/*` and `www.chess-mate.ai/*` point at the Worker. Hostnames
  are not in `wrangler.jsonc`, so a deploy never changes routes.
- DNS records `chess-mate.ai` (A `216.150.1.1`) and `www` (CNAME
  `a2e6ec2730959c1c.vercel-dns-016.com`) are proxied. Their content still names the
  Vercel targets, which makes rollback a single toggle.
- Redirect Rules (dynamic redirect phase): http to https with 308 for both hostnames,
  then `www` to the apex with 301. Both keep path and query, as Vercel did.
- Zone settings: SSL mode Full, HTTP Strict Transport Security max-age 63072000 without
  includeSubDomains or preload (the header Vercel sent), Always Use HTTPS off (the
  Redirect Rule does it with 308), Email Obfuscation off, Automatic HTTPS Rewrites off,
  Browser Cache TTL "respect existing headers", HTTP/3 off, minimum TLS 1.2 (was 1.0).
- Cloudflare Web Analytics site for `chess-mate.ai` (site tag
  `b0a4c212e8f140b2928a2f108bbd71dc`) with automatic injection on. The code carries no
  beacon. Cloudflare injects it only for browser User-Agents, so check with
  `curl -A 'Mozilla/5.0 Chrome/130' https://chess-mate.ai/ | grep cloudflareinsights`.
- `workers_dev` and `preview_urls` are off, so no public `*.workers.dev` copy exists.

Rollback to Vercel:

1. Delete the two Worker routes on the `chess-mate.ai` zone.
2. Set the `chess-mate.ai` and `www` DNS records to DNS only (proxied off).
3. Optionally delete the two Redirect Rules; Vercel does the same redirects itself.

Vercel answered `402 DEPLOYMENT_DISABLED` for every request before the cutover, so a
rollback only serves the site again once the Vercel account is back in good standing.
