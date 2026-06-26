"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import { OPENINGS } from "@/lib/openings";
import type { Opening } from "@/lib/openings.types";
import { useTrainer, type Side } from "@/lib/useTrainer";
import { useStockfish, type EngineEval } from "@/lib/useStockfish";
import { generatePgn, downloadPgn, copyPgn, pgnFilename } from "@/lib/pgn";
import OpeningPicker from "@/components/OpeningPicker";
import TrainerPanel from "@/components/TrainerPanel";
import EnginePanel from "@/components/EnginePanel";

// react-chessboard touches the DOM on import — load it client-only.
const Board = dynamic(() => import("@/components/Board"), {
  ssr: false,
  loading: () => <div className="aspect-square w-full animate-pulse rounded bg-stone-200" />,
});

const ENGINE_MOVE_DEPTH = 12;
const ENGINE_EVAL_DEPTH = 10;

/** Convert an engine UCI move to SAN for display, against a FEN. */
function uciToSan(fen: string, uci: string): string | null {
  try {
    const c = new Chess(fen);
    const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined });
    return m?.san ?? null;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const t = useTrainer();
  const engine = useStockfish();
  const [evaluation, setEvaluation] = useState<EngineEval | null>(null);
  const [lastHint, setLastHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // A throwaway Chess built from the live FEN, for computing legal target squares.
  const probe = useMemo(() => new Chess(t.fen), [t.fen]);
  const legalMovesFor = useCallback(
    (square: string) =>
      probe
        .moves({ square: square as never, verbose: true })
        .map((m) => (m as { to: string }).to),
    [probe],
  );

  const handleSelectOpening = useCallback(
    (opening: Opening) => {
      setEvaluation(null);
      setLastHint(null);
      t.startOpening(opening, opening.recommendedSide);
    },
    [t],
  );

  const handleSetSide = useCallback(
    (side: Side) => {
      setEvaluation(null);
      setLastHint(null);
      if (t.opening) t.startOpening(t.opening, side);
    },
    [t],
  );

  // Stable refs to the (otherwise per-render) callbacks, so the effects below can
  // depend ONLY on primitive trigger values. Depending on the `t`/`engine` objects
  // would re-run + cancel the effect on every render (e.g. each setThinking), so the
  // resolved engine move would always be discarded and never committed.
  const analyseRef = useRef(engine.analyse);
  analyseRef.current = engine.analyse;
  const applyUciRef = useRef(t.applyUciMove);
  applyUciRef.current = t.applyUciMove;

  // Engine plays its move in free mode. Guard against firing twice for one FEN.
  const lastEngineFenRef = useRef<string>("");
  useEffect(() => {
    if (!t.isEngineTurn) return;
    if (lastEngineFenRef.current === t.fen) return;
    lastEngineFenRef.current = t.fen;
    let cancelled = false;
    (async () => {
      const res = await analyseRef.current(t.fen, { depth: ENGINE_MOVE_DEPTH });
      if (cancelled || !res?.bestMove) return;
      setEvaluation(res);
      applyUciRef.current(res.bestMove);
    })();
    return () => {
      cancelled = true;
    };
  }, [t.isEngineTurn, t.fen]);

  // Keep the eval bar fresh on the user's turn while playing the engine.
  const lastEvalFenRef = useRef<string>("");
  useEffect(() => {
    if (!t.vsEngine || t.isEngineTurn || t.isGameOver) return;
    if (lastEvalFenRef.current === t.fen) return;
    lastEvalFenRef.current = t.fen;
    let cancelled = false;
    (async () => {
      const res = await analyseRef.current(t.fen, { depth: ENGINE_EVAL_DEPTH });
      if (!cancelled && res) setEvaluation(res);
    })();
    return () => {
      cancelled = true;
    };
  }, [t.vsEngine, t.isEngineTurn, t.fen, t.isGameOver]);

  const handleHint = useCallback(async () => {
    if (t.expectedMove) {
      setLastHint(t.expectedMove);
      return;
    }
    const best = await engine.getBestMove(t.fen, { depth: ENGINE_MOVE_DEPTH });
    if (best) setLastHint(uciToSan(t.fen, best) ?? best);
  }, [t.expectedMove, t.fen, engine]);

  const handleDownloadPgn = useCallback(() => {
    const pgn = generatePgn(t.history, { opening: t.opening, userSide: t.userSide, vsEngine: t.vsEngine });
    downloadPgn(pgn, pgnFilename(t.opening));
  }, [t.history, t.opening, t.userSide, t.vsEngine]);

  const handleCopyPgn = useCallback(async () => {
    const pgn = generatePgn(t.history, { opening: t.opening, userSide: t.userSide, vsEngine: t.vsEngine });
    const ok = await copyPgn(pgn);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [t.history, t.opening, t.userSide, t.vsEngine]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Chess Openings Trainer</h1>
        <p className="mt-1 text-sm text-stone-500">
          Practice the 50 most classic openings against the book lines. Stockfish runs entirely in your
          browser for hints and free-play — nothing is sent to a server.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        {/* Left: opening list */}
        <aside className="lg:max-h-[80vh] lg:overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-3">
          <OpeningPicker openings={OPENINGS} selectedId={t.opening?.id ?? null} onSelect={handleSelectOpening} />
        </aside>

        {/* Center: board */}
        <section className="mx-auto w-full max-w-[560px] self-start">
          <Board
            position={t.fen}
            boardOrientation={t.orientation}
            onMove={(from, to) => t.onDrop({ sourceSquare: from, targetSquare: to })}
            legalMovesFor={legalMovesFor}
            interactive={t.isUserTurn && !t.isGameOver && !!t.opening}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
            <span>
              {t.opening
                ? `${t.turn === "w" ? "White" : "Black"} to move`
                : "No opening selected"}
            </span>
            <span>{t.mode === "book" ? "Book mode" : "Free play"}</span>
          </div>
        </section>

        {/* Right: trainer + engine */}
        <aside className="rounded-lg border border-stone-200 bg-white p-4">
          <TrainerPanel
            opening={t.opening}
            userSide={t.userSide}
            onSetSide={handleSetSide}
            status={copied ? { text: "PGN copied to clipboard.", tone: "good" } : t.status}
            history={t.history}
            mode={t.mode}
            bookProgress={t.bookProgress}
            expectedMove={t.expectedMove}
            canUndo={t.history.length > 0}
            onFlip={t.flipBoard}
            onUndo={t.undo}
            onReset={t.reset}
            onFreePlay={t.freePlayFromHere}
            onShowHint={handleHint}
            onDownloadPgn={handleDownloadPgn}
            onCopyPgn={handleCopyPgn}
          />
          <EnginePanel
            supported={engine.supported}
            thinking={engine.thinking}
            vsEngine={t.vsEngine}
            onToggleVsEngine={t.toggleVsEngine}
            evaluation={evaluation}
            lastHint={lastHint}
            disabled={t.mode !== "free"}
          />
        </aside>
      </div>

      <footer className="mt-8 text-center text-xs text-stone-400">
        Built with Next.js · chess.js · react-chessboard · Stockfish 18 (WASM, client-side)
      </footer>
    </main>
  );
}
