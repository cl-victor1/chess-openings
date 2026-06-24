"use client";

import { useState, type CSSProperties } from "react";
import { Chessboard } from "react-chessboard";

type Props = {
  position: string;
  boardOrientation: "white" | "black";
  /** Attempt a move; returns true if it was accepted. */
  onMove: (from: string, to: string) => boolean;
  /** Legal destination squares for a given square (for click-to-move + dots). */
  legalMovesFor: (square: string) => string[];
  interactive: boolean;
};

const DOT: CSSProperties = {
  background: "radial-gradient(circle, rgba(0,0,0,0.28) 22%, transparent 24%)",
};
const CAPTURE_DOT: CSSProperties = {
  background: "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.28) 56%, rgba(0,0,0,0.28) 64%, transparent 66%)",
};
const SELECTED: CSSProperties = { backgroundColor: "rgba(255, 213, 79, 0.55)" };

/** Plain wood-themed chessboard supporting both drag-and-drop and click-to-move. */
export default function Board({ position, boardOrientation, onMove, legalMovesFor, interactive }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const targets = selected ? legalMovesFor(selected) : [];

  const squareStyles: Record<string, CSSProperties> = {};
  if (selected) {
    squareStyles[selected] = SELECTED;
    for (const t of targets) {
      // crude capture detection: a target occupied in the FEN board gets the ring style
      squareStyles[t] = isOccupied(position, t) ? CAPTURE_DOT : DOT;
    }
  }

  function clear() {
    setSelected(null);
  }

  function handleDrop({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) {
    clear();
    if (!targetSquare) return false;
    return onMove(sourceSquare, targetSquare);
  }

  function handleSquareClick({ square }: { square: string }) {
    if (!interactive) return;
    if (selected) {
      if (square === selected) return clear();
      if (targets.includes(square)) {
        onMove(selected, square);
        return clear();
      }
      // clicked elsewhere: reselect if it has its own moves, else clear
      if (legalMovesFor(square).length > 0) return setSelected(square);
      return clear();
    }
    if (legalMovesFor(square).length > 0) setSelected(square);
  }

  return (
    <Chessboard
      options={{
        id: "trainer-board",
        position,
        boardOrientation,
        onPieceDrop: handleDrop,
        onSquareClick: handleSquareClick,
        squareStyles,
        allowDragging: interactive,
        animationDurationInMs: 200,
        darkSquareStyle: { backgroundColor: "#b58863" },
        lightSquareStyle: { backgroundColor: "#f0d9b5" },
        boardStyle: { borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" },
        dropSquareStyle: { boxShadow: "inset 0 0 0 3px rgba(255,213,79,0.8)" },
      }}
    />
  );
}

/** Is the given algebraic square occupied in this FEN's board field? */
function isOccupied(fen: string, square: string): boolean {
  const board = fen.split(" ")[0];
  const file = square.charCodeAt(0) - 97; // a..h -> 0..7
  const rank = 8 - Number(square[1]); // '8'->0 ... '1'->7
  const rows = board.split("/");
  const row = rows[rank];
  if (!row) return false;
  let col = 0;
  for (const ch of row) {
    if (/\d/.test(ch)) {
      col += Number(ch);
    } else {
      if (col === file) return true;
      col += 1;
    }
    if (col > file) break;
  }
  return false;
}
