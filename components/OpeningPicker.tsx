"use client";

import { useMemo, useState } from "react";
import type { Opening, OpeningGroup } from "@/lib/openings.types";

type Props = {
  openings: Opening[];
  selectedId: string | null;
  onSelect: (opening: Opening) => void;
};

const GROUP_ORDER: OpeningGroup[] = [
  "Open Games (1.e4 e5)",
  "Sicilian Defense",
  "Semi-Open Games (1.e4)",
  "Closed Games (1.d4 d5)",
  "Indian Defenses",
  "Flank Openings",
];

export default function OpeningPicker({ openings, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? openings.filter(
          (o) =>
            o.name.toLowerCase().includes(q) ||
            o.eco.toLowerCase().includes(q) ||
            o.group.toLowerCase().includes(q),
        )
      : openings;
    const map = new Map<OpeningGroup, Opening[]>();
    for (const o of filtered) {
      const arr = map.get(o.group) ?? [];
      arr.push(o);
      map.set(o.group, arr);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({ group: g, items: map.get(g)! }));
  }, [openings, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-stone-700">Openings</h2>
        <span className="text-xs text-stone-400">{openings.length} total</span>
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name, ECO, group…"
        className="mb-3 w-full rounded border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-500"
      />
      <div className="-mr-1 flex-1 space-y-3 overflow-y-auto pr-1">
        {grouped.map(({ group, items }) => (
          <div key={group}>
            <div className="sticky top-0 bg-stone-50 py-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
              {group}
            </div>
            <ul className="space-y-1">
              {items.map((o) => {
                const active = o.id === selectedId;
                return (
                  <li key={o.id}>
                    <button
                      onClick={() => onSelect(o)}
                      className={
                        "flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm transition " +
                        (active
                          ? "bg-stone-800 text-white"
                          : "hover:bg-stone-200 text-stone-700")
                      }
                    >
                      <span className="truncate">{o.name}</span>
                      <span
                        className={
                          "shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] " +
                          (active ? "bg-white/20 text-white" : "bg-stone-200 text-stone-500")
                        }
                      >
                        {o.eco}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="px-2 py-4 text-sm text-stone-400">No openings match “{query}”.</p>
        )}
      </div>
    </div>
  );
}
