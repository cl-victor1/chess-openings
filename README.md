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
3. (Optional) Set `NEXT_PUBLIC_SITE_URL` to your domain so `sitemap.xml` uses the real URL.
4. Deploy. That's it — everything else runs client-side.

Or from the CLI:

```bash
pnpm dlx vercel        # preview deploy
pnpm dlx vercel --prod # production deploy
```
