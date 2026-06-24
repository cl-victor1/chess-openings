"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import type { Opening } from "./openings.types";

export type Side = "w" | "b";
export type Mode = "book" | "free";
type StatusTone = "good" | "bad" | "neutral" | "info";
export type TrainerStatus = { text: string; tone: StatusTone };

const START_FEN = new Chess().fen();
const OPPONENT_MOVE_DELAY_MS = 450;

/** Compare two SAN strings ignoring check/mate/annotation glyphs. */
function sanEqual(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/[+#!?]/g, "");
  return norm(a) === norm(b);
}

/**
 * Core opening-trainer state machine. Wraps a single chess.js game.
 *
 * - In `book` mode it auto-plays the opponent's book moves and validates the
 *   user's moves against the opening's main line.
 * - When the book line is exhausted (or the user opts to free-play) it switches
 *   to `free` mode where any legal move is accepted. Engine moves in free mode
 *   are applied by the page via `applyUciMove` (the engine lives in useStockfish).
 */
export function useTrainer() {
  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(START_FEN);
  const [history, setHistory] = useState<string[]>([]);
  const [opening, setOpening] = useState<Opening | null>(null);
  const [userSide, setUserSide] = useState<Side>("w");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [plyIndex, setPlyIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("book");
  const [vsEngine, setVsEngine] = useState(false);
  const [status, setStatus] = useState<TrainerStatus>({
    text: "Pick an opening and a side to start practicing.",
    tone: "info",
  });

  const sync = useCallback(() => {
    setFen(chessRef.current.fen());
    setHistory(chessRef.current.history());
  }, []);

  /** Begin practicing an opening from the chosen side. */
  const startOpening = useCallback((next: Opening, side: Side) => {
    chessRef.current = new Chess();
    setOpening(next);
    setUserSide(side);
    setOrientation(side === "w" ? "white" : "black");
    setPlyIndex(0);
    setMode("book");
    setVsEngine(false);
    setFen(chessRef.current.fen());
    setHistory([]);
    setStatus({
      text: `${next.name} — you play ${side === "w" ? "White" : "Black"}. Play the book moves!`,
      tone: "info",
    });
  }, []);

  // Auto-play the opponent's book moves while in book mode.
  useEffect(() => {
    if (!opening || mode !== "book") return;
    if (plyIndex >= opening.line.length) {
      setMode("free");
      setStatus({
        text: "Book line complete! Keep playing freely, or turn on Stockfish.",
        tone: "good",
      });
      return;
    }
    const expectedSide: Side = plyIndex % 2 === 0 ? "w" : "b";
    if (expectedSide === userSide) return; // user's turn — wait for their move

    const san = opening.line[plyIndex];
    const timer = setTimeout(() => {
      try {
        const move = chessRef.current.move(san);
        if (move) {
          sync();
          setPlyIndex((p) => p + 1);
          setStatus({ text: `Opponent played ${move.san}. Your move.`, tone: "neutral" });
        }
      } catch {
        // Should never happen (lines are validated), but fail safe to free mode.
        setMode("free");
      }
    }, OPPONENT_MOVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [opening, mode, plyIndex, userSide, sync]);

  const expectedMove = useMemo(() => {
    if (mode !== "book" || !opening || plyIndex >= opening.line.length) return null;
    return opening.line[plyIndex];
  }, [mode, opening, plyIndex]);

  const isUserTurn = useMemo(() => {
    if (chessRef.current.isGameOver()) return false;
    if (mode === "book") {
      const expectedSide: Side = plyIndex % 2 === 0 ? "w" : "b";
      return expectedSide === userSide;
    }
    return !vsEngine || chessRef.current.turn() === userSide;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, plyIndex, userSide, vsEngine, fen]);

  const isEngineTurn = useMemo(() => {
    if (mode !== "free" || !vsEngine) return false;
    if (chessRef.current.isGameOver()) return false;
    return chessRef.current.turn() !== userSide;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, vsEngine, userSide, fen]);

  /** Handle a drag-and-drop move from the board. Returns true if accepted. */
  const onDrop = useCallback(
    ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
      if (!targetSquare || !opening) return false;
      const chess = chessRef.current;
      if (chess.isGameOver()) return false;

      if (mode === "book") {
        const expectedSide: Side = plyIndex % 2 === 0 ? "w" : "b";
        if (expectedSide !== userSide || chess.turn() !== userSide) return false;

        let move;
        try {
          move = chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
        } catch {
          return false;
        }
        if (!move) return false;

        const expected = opening.line[plyIndex];
        if (sanEqual(move.san, expected)) {
          sync();
          setPlyIndex((p) => p + 1);
          setStatus({ text: `✓ ${move.san} — book move!`, tone: "good" });
          return true;
        }
        chess.undo();
        setStatus({
          text: `✗ ${move.san} is not the book move. Expected ${expected}.`,
          tone: "bad",
        });
        return false;
      }

      // free mode
      if (vsEngine && chess.turn() !== userSide) return false;
      let move;
      try {
        move = chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      } catch {
        return false;
      }
      if (!move) return false;
      sync();
      setStatus(gameOverStatus(chess) ?? { text: `${move.san}`, tone: "neutral" });
      return true;
    },
    [opening, mode, plyIndex, userSide, vsEngine, sync],
  );

  /** Apply an engine move (UCI form like "e2e4" / "e7e8q"). Free mode only. */
  const applyUciMove = useCallback(
    (uci: string) => {
      const chess = chessRef.current;
      if (chess.isGameOver()) return;
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      try {
        const move = chess.move({ from, to, promotion });
        if (move) {
          sync();
          setStatus(gameOverStatus(chess) ?? { text: `Stockfish played ${move.san}.`, tone: "neutral" });
        }
      } catch {
        /* ignore illegal engine suggestion */
      }
    },
    [sync],
  );

  /** Switch to free play from the current position (e.g. to deviate from the book). */
  const freePlayFromHere = useCallback(() => {
    setMode("free");
    setStatus({ text: "Free play enabled — any legal move is allowed.", tone: "info" });
  }, []);

  const flipBoard = useCallback(() => {
    setOrientation((o) => (o === "white" ? "black" : "white"));
  }, []);

  const reset = useCallback(() => {
    if (!opening) return;
    startOpening(opening, userSide);
  }, [opening, userSide, startOpening]);

  /** Undo back to the user's previous decision point. */
  const undo = useCallback(() => {
    const chess = chessRef.current;
    if (chess.history().length === 0) return;
    // Drop any trailing opponent move(s)...
    while (chess.history().length > 0 && chess.turn() === userSide) chess.undo();
    // ...then the user's own last move.
    if (chess.history().length > 0) chess.undo();
    sync();
    if (mode === "book") setPlyIndex(chess.history().length);
    setStatus({ text: "Took back your last move.", tone: "info" });
  }, [userSide, mode, sync]);

  const toggleVsEngine = useCallback(() => {
    setVsEngine((v) => {
      const next = !v;
      setStatus({
        text: next ? "Stockfish will now reply." : "Stockfish opponent off.",
        tone: "info",
      });
      return next;
    });
  }, []);

  return {
    // state
    fen,
    history,
    opening,
    userSide,
    orientation,
    mode,
    vsEngine,
    status,
    plyIndex,
    expectedMove,
    isUserTurn,
    isEngineTurn,
    bookComplete: mode === "free" && !!opening,
    bookProgress: opening ? { played: Math.min(plyIndex, opening.line.length), total: opening.line.length } : null,
    isGameOver: chessRef.current.isGameOver(),
    turn: chessRef.current.turn(),
    // actions
    startOpening,
    onDrop,
    applyUciMove,
    freePlayFromHere,
    flipBoard,
    reset,
    undo,
    toggleVsEngine,
  };
}

function gameOverStatus(chess: Chess): TrainerStatus | null {
  if (!chess.isGameOver()) return null;
  if (chess.isCheckmate()) {
    const winner = chess.turn() === "w" ? "Black" : "White";
    return { text: `Checkmate — ${winner} wins.`, tone: "good" };
  }
  if (chess.isStalemate()) return { text: "Stalemate — draw.", tone: "info" };
  if (chess.isThreefoldRepetition()) return { text: "Draw by repetition.", tone: "info" };
  if (chess.isInsufficientMaterial()) return { text: "Draw — insufficient material.", tone: "info" };
  if (chess.isDraw()) return { text: "Draw (50-move rule).", tone: "info" };
  return { text: "Game over.", tone: "info" };
}
