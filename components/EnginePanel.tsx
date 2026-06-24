"use client";

import type { EngineEval } from "@/lib/useStockfish";

type Props = {
  supported: boolean;
  thinking: boolean;
  vsEngine: boolean;
  onToggleVsEngine: () => void;
  evaluation: EngineEval | null;
  lastHint: string | null;
  disabled: boolean;
};

/** Format an eval from White's perspective, e.g. "+0.84" or "M3" / "-M2". */
function formatEval(e: EngineEval | null): string {
  if (!e) return "—";
  if (e.mate !== null) return (e.mate > 0 ? "M" : "-M") + Math.abs(e.mate);
  if (e.scoreCp === null) return "—";
  const pawns = e.scoreCp / 100;
  return (pawns >= 0 ? "+" : "") + pawns.toFixed(2);
}

/** White-advantage percentage for the eval bar (0–100). */
function whiteShare(e: EngineEval | null): number {
  if (!e) return 50;
  if (e.mate !== null) return e.mate > 0 ? 100 : 0;
  if (e.scoreCp === null) return 50;
  const clamped = Math.max(-1000, Math.min(1000, e.scoreCp));
  return 50 + (clamped / 1000) * 50;
}

export default function EnginePanel(p: Props) {
  if (!p.supported) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Stockfish (Web Worker) isn’t available in this browser. The book trainer still works fully.
      </div>
    );
  }

  const share = whiteShare(p.evaluation);

  return (
    <div className="space-y-3 border-t border-stone-200 pt-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Stockfish 18</h3>
        {p.thinking && <span className="animate-pulse text-xs text-stone-400">thinking…</span>}
      </div>

      {/* Eval bar */}
      <div>
        <div className="flex items-center gap-2">
          <div
            className="relative h-3 flex-1 overflow-hidden rounded-full border border-stone-300 bg-stone-800"
            title="Evaluation (White's perspective)"
          >
            <div className="h-full bg-stone-100 transition-all" style={{ width: `${share}%` }} />
          </div>
          <span className="w-12 text-right font-mono text-xs text-stone-600">{formatEval(p.evaluation)}</span>
        </div>
        {p.evaluation && (
          <div className="mt-1 text-right text-[10px] text-stone-400">depth {p.evaluation.depth}</div>
        )}
      </div>

      {/* Hint readout */}
      {p.lastHint && (
        <div className="rounded border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
          💡 Engine suggests <span className="font-mono font-semibold">{p.lastHint}</span>
        </div>
      )}

      {/* vs engine toggle */}
      <label
        className={
          "flex cursor-pointer items-center justify-between rounded border px-3 py-2 text-sm transition " +
          (p.disabled
            ? "cursor-not-allowed border-stone-200 text-stone-400"
            : "border-stone-300 text-stone-700 hover:bg-stone-50")
        }
      >
        <span>Play vs Stockfish</span>
        <input
          type="checkbox"
          checked={p.vsEngine}
          disabled={p.disabled}
          onChange={p.onToggleVsEngine}
          className="h-4 w-4 accent-stone-700"
        />
      </label>
      {p.disabled && (
        <p className="text-[11px] text-stone-400">
          Available after the book line ends (or use “Free play from here”).
        </p>
      )}
    </div>
  );
}
