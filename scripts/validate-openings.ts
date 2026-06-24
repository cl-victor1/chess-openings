/**
 * Replays every opening's SAN line through chess.js to guarantee legality.
 * Also asserts exactly 50 entries, unique ids, and unique names.
 * Run with: pnpm run validate:openings
 */
import { Chess } from "chess.js";
import { OPENINGS } from "../lib/openings";

let failures = 0;
const ids = new Set<string>();
const names = new Set<string>();

function fail(msg: string) {
  failures++;
  console.error("  ✗ " + msg);
}

for (const op of OPENINGS) {
  if (ids.has(op.id)) fail(`duplicate id: ${op.id}`);
  ids.add(op.id);
  if (names.has(op.name)) fail(`duplicate name: ${op.name}`);
  names.add(op.name);

  const chess = new Chess();
  let ply = 0;
  for (const san of op.line) {
    try {
      const move = chess.move(san);
      if (!move) {
        fail(`${op.id}: illegal move "${san}" at ply ${ply + 1}`);
        break;
      }
    } catch {
      fail(`${op.id}: illegal/unparseable move "${san}" at ply ${ply + 1} (fen: ${chess.fen()})`);
      break;
    }
    ply++;
  }
  if (op.line.length < 6) fail(`${op.id}: line is suspiciously short (${op.line.length} plies)`);
}

if (OPENINGS.length !== 50) {
  fail(`expected exactly 50 openings, found ${OPENINGS.length}`);
}

if (failures === 0) {
  console.log(`✓ All ${OPENINGS.length} openings valid: every line is legal, ids and names unique.`);
  process.exit(0);
} else {
  console.error(`\n${failures} validation failure(s).`);
  process.exit(1);
}
