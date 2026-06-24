"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ENGINE_URL = "/engine/stockfish-18-lite-single.js";

export type EngineEval = {
  /** Centipawn score from White's perspective (null if a mate score). */
  scoreCp: number | null;
  /** Mate-in-N from White's perspective; positive = White mates (null if none). */
  mate: number | null;
  /** Best move in UCI form, e.g. "e2e4" or "e7e8q". */
  bestMove: string | null;
  /** Search depth reached. */
  depth: number;
};

type AnalyseOptions = { depth?: number; movetime?: number };

type RunningJob = {
  resolve: (e: EngineEval) => void;
  whiteToMove: boolean;
  scoreCp: number | null;
  mate: number | null;
  depth: number;
};
type QueuedJob = {
  fen: string;
  opts: AnalyseOptions;
  resolve: (e: EngineEval | null) => void;
};

/**
 * Lazily boots the single-threaded Stockfish 18 WASM engine inside a Web Worker.
 * Nothing loads until the first analyse() call — the trainer's core book flow has
 * zero engine cost. All compute happens in the browser; there is no backend.
 *
 * Searches are strictly serialized: at most one search runs at a time, and only
 * the latest pending request is kept (older queued requests resolve to null).
 * This prevents a stopped search's stale `bestmove` from being misattributed to
 * a newer position.
 */
export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const runningRef = useRef<RunningJob | null>(null);
  const queuedRef = useRef<QueuedJob | null>(null);
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [supported, setSupported] = useState(true);

  const send = useCallback((cmd: string) => {
    workerRef.current?.postMessage(cmd);
  }, []);

  // Start the queued search if the engine is idle and ready.
  const pump = useCallback(() => {
    if (!readyRef.current || runningRef.current) return;
    const job = queuedRef.current;
    if (!job) {
      setThinking(false);
      return;
    }
    queuedRef.current = null;
    const whiteToMove = job.fen.split(/\s+/)[1] !== "b";
    runningRef.current = {
      resolve: job.resolve as (e: EngineEval) => void,
      whiteToMove,
      scoreCp: null,
      mate: null,
      depth: 0,
    };
    setThinking(true);
    send("ucinewgame");
    send(`position fen ${job.fen}`);
    if (job.opts.movetime) send(`go movetime ${job.opts.movetime}`);
    else send(`go depth ${job.opts.depth ?? 12}`);
  }, [send]);

  const handleLine = useCallback(
    (line: string) => {
      if (typeof line !== "string") return;

      if (line === "uciok") {
        send("isready");
        return;
      }
      if (line === "readyok") {
        readyRef.current = true;
        setReady(true);
        pump();
        return;
      }

      const job = runningRef.current;
      if (!job) return;

      if (line.startsWith("info")) {
        const depthMatch = line.match(/\bdepth (\d+)/);
        if (depthMatch) job.depth = Number(depthMatch[1]);
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        const sign = job.whiteToMove ? 1 : -1; // normalize to White's perspective
        if (cpMatch) {
          job.scoreCp = sign * Number(cpMatch[1]);
          job.mate = null;
        } else if (mateMatch) {
          job.mate = sign * Number(mateMatch[1]);
          job.scoreCp = null;
        }
        return;
      }

      if (line.startsWith("bestmove")) {
        const best = line.split(/\s+/)[1] ?? null;
        const result: EngineEval = {
          scoreCp: job.scoreCp,
          mate: job.mate,
          bestMove: best === "(none)" ? null : best,
          depth: job.depth,
        };
        runningRef.current = null;
        job.resolve(result);
        pump(); // start the next queued search, if any
      }
    },
    [send, pump],
  );

  const ensureWorker = useCallback((): Worker | null => {
    if (typeof window === "undefined" || typeof Worker === "undefined") {
      setSupported(false);
      return null;
    }
    if (workerRef.current) return workerRef.current;
    try {
      const worker = new Worker(ENGINE_URL);
      worker.onmessage = (e: MessageEvent) => handleLine(e.data as string);
      worker.onerror = () => setSupported(false);
      worker.postMessage("uci");
      workerRef.current = worker;
      return worker;
    } catch {
      setSupported(false);
      return null;
    }
  }, [handleLine]);

  /**
   * Analyse a FEN; resolves with the eval + best move, or null if the request was
   * superseded by a newer analyse() call before it could run.
   */
  const analyse = useCallback(
    (fen: string, opts: AnalyseOptions = {}): Promise<EngineEval | null> => {
      if (!ensureWorker()) return Promise.resolve(null);
      return new Promise<EngineEval | null>((resolve) => {
        // Only the most recent pending request is kept; supersede any older one.
        if (queuedRef.current) queuedRef.current.resolve(null);
        queuedRef.current = { fen, opts, resolve };
        if (runningRef.current) send("stop"); // hurry the in-flight search along
        else pump();
      });
    },
    [ensureWorker, send, pump],
  );

  const getBestMove = useCallback(
    async (fen: string, opts?: AnalyseOptions): Promise<string | null> => {
      const r = await analyse(fen, opts);
      return r?.bestMove ?? null;
    },
    [analyse],
  );

  const stop = useCallback(() => send("stop"), [send]);

  // Tear down the worker on unmount.
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        try {
          workerRef.current.postMessage("quit");
        } catch {
          /* ignore */
        }
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return { ready, thinking, supported, analyse, getBestMove, stop };
}
