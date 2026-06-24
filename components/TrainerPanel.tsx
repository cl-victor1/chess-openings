"use client";

import type { Opening } from "@/lib/openings.types";
import type { Side, TrainerStatus, Mode } from "@/lib/useTrainer";

type Props = {
  opening: Opening | null;
  userSide: Side;
  onSetSide: (side: Side) => void;
  status: TrainerStatus;
  history: string[];
  mode: Mode;
  bookProgress: { played: number; total: number } | null;
  expectedMove: string | null;
  canUndo: boolean;
  onFlip: () => void;
  onUndo: () => void;
  onReset: () => void;
  onFreePlay: () => void;
  onShowHint: () => void;
  onDownloadPgn: () => void;
  onCopyPgn: () => void;
};

const TONE: Record<TrainerStatus["tone"], string> = {
  good: "bg-green-50 text-green-800 border-green-200",
  bad: "bg-red-50 text-red-800 border-red-200",
  neutral: "bg-stone-50 text-stone-700 border-stone-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

export default function TrainerPanel(p: Props) {
  return (
    <div className="space-y-3">
      {/* Opening header */}
      {p.opening ? (
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-800">{p.opening.name}</h2>
            <span className="rounded bg-stone-200 px-1.5 py-0.5 font-mono text-[11px] text-stone-600">
              {p.opening.eco}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">{p.opening.description}</p>
        </div>
      ) : (
        <p className="text-sm text-stone-500">Select an opening from the list to begin.</p>
      )}

      {/* Side selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-stone-500">You play</span>
        <div className="inline-flex overflow-hidden rounded border border-stone-300">
          {(["w", "b"] as Side[]).map((s) => (
            <button
              key={s}
              onClick={() => p.onSetSide(s)}
              className={
                "px-3 py-1 text-sm transition " +
                (p.userSide === s ? "bg-stone-800 text-white" : "bg-white text-stone-600 hover:bg-stone-100")
              }
            >
              {s === "w" ? "White" : "Black"}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className={"rounded border px-3 py-2 text-sm " + TONE[p.status.tone]}>{p.status.text}</div>

      {/* Book progress */}
      {p.bookProgress && (
        <div>
          <div className="mb-1 flex justify-between text-xs text-stone-500">
            <span>{p.mode === "book" ? "Book line" : "Book line complete"}</span>
            <span>
              {p.bookProgress.played} / {p.bookProgress.total}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-stone-700 transition-all"
              style={{
                width: `${p.bookProgress.total ? (p.bookProgress.played / p.bookProgress.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Move list */}
      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Moves</h3>
        <div className="max-h-40 overflow-y-auto rounded border border-stone-200 bg-white p-2 font-mono text-sm leading-6">
          {p.history.length === 0 ? (
            <span className="text-stone-400">No moves yet.</span>
          ) : (
            <MoveList history={p.history} bookCount={p.bookProgress?.total ?? 0} mode={p.mode} />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Btn onClick={p.onUndo} disabled={!canUndoSafe(p)}>↶ Undo</Btn>
        <Btn onClick={p.onFlip}>⇅ Flip board</Btn>
        <Btn onClick={p.onReset} disabled={!p.opening}>↺ Restart</Btn>
        <Btn onClick={p.onShowHint} disabled={!p.opening}>💡 Hint</Btn>
        {p.mode === "book" && (
          <Btn onClick={p.onFreePlay} disabled={!p.opening} className="col-span-2">
            Free play from here →
          </Btn>
        )}
      </div>

      {/* PGN export */}
      <div className="border-t border-stone-200 pt-3">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Save game</h3>
        <div className="grid grid-cols-2 gap-2">
          <Btn onClick={p.onDownloadPgn} disabled={p.history.length === 0}>⬇ Download PGN</Btn>
          <Btn onClick={p.onCopyPgn} disabled={p.history.length === 0}>⧉ Copy PGN</Btn>
        </div>
      </div>
    </div>
  );
}

function canUndoSafe(p: Props) {
  return p.canUndo;
}

function MoveList({ history, bookCount, mode }: { history: string[]; bookCount: number; mode: Mode }) {
  const pairs: { no: number; white?: string; black?: string; wPly: number; bPly: number }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      no: i / 2 + 1,
      white: history[i],
      black: history[i + 1],
      wPly: i,
      bPly: i + 1,
    });
  }
  const inBook = (ply: number) => mode === "book" || ply < bookCount;
  return (
    <span>
      {pairs.map((pr) => (
        <span key={pr.no} className="mr-2 inline-block">
          <span className="text-stone-400">{pr.no}.</span>{" "}
          {pr.white && <span className={inBook(pr.wPly) ? "text-stone-800" : "text-stone-500"}>{pr.white}</span>}{" "}
          {pr.black && <span className={inBook(pr.bPly) ? "text-stone-800" : "text-stone-500"}>{pr.black}</span>}
        </span>
      ))}
    </span>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        "rounded border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 " +
        className
      }
    >
      {children}
    </button>
  );
}
