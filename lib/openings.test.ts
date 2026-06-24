import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { OPENINGS } from "./openings";

describe("openings dataset", () => {
  it("contains exactly 50 openings", () => {
    expect(OPENINGS.length).toBe(50);
  });

  it("has unique ids", () => {
    const ids = OPENINGS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique names", () => {
    const names = OPENINGS.map((o) => o.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("uses kebab-case ids", () => {
    for (const o of OPENINGS) {
      expect(o.id, o.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it.each(OPENINGS)("$name ($eco) has a fully legal main line", (op) => {
    const chess = new Chess();
    for (const san of op.line) {
      expect(() => chess.move(san), `${op.name}: "${san}"`).not.toThrow();
    }
    expect(op.line.length).toBeGreaterThanOrEqual(6);
  });
});
