import { Chess } from "chess.js";
import type { Opening } from "./openings.types";

type PgnMeta = {
  opening: Opening | null;
  /** The side the human played in this session. */
  userSide: "w" | "b";
  /** Whether Stockfish was the opponent (vs. manual play). */
  vsEngine: boolean;
};

/** PGN date stamp: YYYY.MM.DD. Computed client-side at export time. */
function pgnDate(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

/**
 * Replays a SAN move list into a fresh Chess instance (so the live game is not
 * mutated), attaches descriptive headers, and returns the PGN string.
 */
export function generatePgn(moves: string[], meta: PgnMeta): string {
  const chess = new Chess();
  for (const san of moves) {
    try {
      chess.move(san);
    } catch {
      break; // stop at the first move that no longer parses; export what we have
    }
  }

  const human = meta.vsEngine ? "You" : "You (both sides)";
  const opponent = meta.vsEngine ? "Stockfish 18 (lite)" : "You (both sides)";

  chess.setHeader("Event", "Opening Trainer");
  chess.setHeader("Site", "Chess Openings Trainer");
  chess.setHeader("Date", pgnDate());
  chess.setHeader("White", meta.userSide === "w" ? human : opponent);
  chess.setHeader("Black", meta.userSide === "b" ? human : opponent);
  if (meta.opening) {
    chess.setHeader("Opening", meta.opening.name);
    chess.setHeader("ECO", meta.opening.eco);
  }

  return chess.pgn();
}

/** Triggers a .pgn file download in the browser. */
export function downloadPgn(pgn: string, filenameBase: string): void {
  const blob = new Blob([pgn], { type: "application/x-chess-pgn" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenameBase}.pgn`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Copies PGN text to the clipboard. Returns true on success. */
export async function copyPgn(pgn: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(pgn);
    return true;
  } catch {
    return false;
  }
}

/** Safe filename base from an opening, e.g. "ruy-lopez-spanish-2026-06-23". */
export function pgnFilename(opening: Opening | null): string {
  const slug = (opening?.id ?? "game").replace(/[^a-z0-9-]/gi, "-");
  return `${slug}-${pgnDate().replace(/\./g, "-")}`;
}
