/** A single classic chess opening, with its canonical main line. */
export type Opening = {
  /** kebab-case unique id, used in URLs / storage keys. */
  id: string;
  /** Display name, e.g. "Ruy Lopez". */
  name: string;
  /** ECO classification code, e.g. "C60". */
  eco: string;
  /** Grouping bucket used for the picker's section headers. */
  group: OpeningGroup;
  /**
   * The side that "owns" / characteristically plays this opening — used as the
   * default practice side. The user can still choose either side in the UI.
   */
  recommendedSide: "w" | "b";
  /** One or two sentence plain-English summary. */
  description: string;
  /**
   * Main-line moves in SAN (Standard Algebraic Notation), starting from the
   * initial position, e.g. ["e4", "e5", "Nf3", "Nc6", "Bb5"]. Every line is
   * validated for legality against chess.js (see scripts/validate-openings.ts).
   */
  line: string[];
};

export type OpeningGroup =
  | "Open Games (1.e4 e5)"
  | "Sicilian Defense"
  | "Semi-Open Games (1.e4)"
  | "Closed Games (1.d4 d5)"
  | "Indian Defenses"
  | "Flank Openings";
