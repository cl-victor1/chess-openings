import type { Opening } from "./openings.types";

/**
 * The 50 most classic chess openings, each with its canonical main line in SAN.
 * Lines are kept to the recognizable, well-trodden main variation (~8–14 plies).
 * Every line is replayed through chess.js in scripts/validate-openings.ts and in
 * the unit test, so an illegal/typo move cannot ship.
 */
export const OPENINGS: Opening[] = [
  // ───────────────────────────── Open Games (1.e4 e5) ─────────────────────────────
  {
    id: "ruy-lopez",
    name: "Ruy Lopez (Spanish)",
    eco: "C60",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "w",
    description:
      "White pins the knight defending e5 with Bb5, pressuring Black's center. One of the oldest and most respected openings.",
    line: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1", "b5", "Bb3", "d6", "c3", "O-O"],
  },
  {
    id: "italian-game",
    name: "Italian Game (Giuoco Piano)",
    eco: "C53",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "w",
    description:
      "The bishop targets f7 with Bc4. A classical, principled development that leads to rich middlegame play.",
    line: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d3", "d6", "O-O", "O-O"],
  },
  {
    id: "two-knights-defense",
    name: "Two Knights Defense",
    eco: "C57",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "b",
    description:
      "Black answers Bc4 with the aggressive Nf6, inviting sharp lines like the Fried Liver after Ng5.",
    line: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Na5", "Bb5+", "c6", "dxc6", "bxc6"],
  },
  {
    id: "evans-gambit",
    name: "Evans Gambit",
    eco: "C51",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "w",
    description:
      "A romantic-era gambit: White offers the b-pawn to gain time and build a strong center against the Italian.",
    line: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4", "Bxb4", "c3", "Ba5", "d4", "exd4", "O-O"],
  },
  {
    id: "scotch-game",
    name: "Scotch Game",
    eco: "C45",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "w",
    description:
      "White strikes the center immediately with d4, opening lines early and avoiding heavy Ruy Lopez theory.",
    line: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Nf6", "Nxc6", "bxc6", "e5", "Qe7"],
  },
  {
    id: "petrov-defense",
    name: "Petrov (Russian) Defense",
    eco: "C42",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "b",
    description:
      "Instead of defending e5, Black counterattacks e4 with Nf6. A solid, symmetrical defense favored at the top level.",
    line: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5", "Bd3", "Nc6"],
  },
  {
    id: "four-knights-game",
    name: "Four Knights Game",
    eco: "C49",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "w",
    description:
      "Both sides develop all four knights symmetrically. A sound, classical opening with clear development.",
    line: ["e4", "e5", "Nf3", "Nc6", "Nc3", "Nf6", "Bb5", "Bb4", "O-O", "O-O", "d3", "d6"],
  },
  {
    id: "kings-gambit",
    name: "King's Gambit",
    eco: "C37",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "w",
    description:
      "White sacrifices the f-pawn to seize the center and open the f-file for attack. The quintessential romantic gambit.",
    line: ["e4", "e5", "f4", "exf4", "Nf3", "g5", "h4", "g4", "Ne5", "Nf6"],
  },
  {
    id: "vienna-game",
    name: "Vienna Game",
    eco: "C25",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "w",
    description:
      "White develops the knight to c3 first, often preparing an f4 push for a delayed King's Gambit feel.",
    line: ["e4", "e5", "Nc3", "Nf6", "f4", "d5", "fxe5", "Nxe4", "Nf3", "Be7"],
  },
  {
    id: "philidor-defense",
    name: "Philidor Defense",
    eco: "C41",
    group: "Open Games (1.e4 e5)",
    recommendedSide: "b",
    description:
      "Black supports e5 with d6, choosing a solid but somewhat passive setup that is very hard to break down.",
    line: ["e4", "e5", "Nf3", "d6", "d4", "exd4", "Nxd4", "Nf6", "Nc3", "Be7"],
  },

  // ───────────────────────────── Sicilian Defense ─────────────────────────────
  {
    id: "sicilian-najdorf",
    name: "Sicilian Najdorf",
    eco: "B90",
    group: "Sicilian Defense",
    recommendedSide: "b",
    description:
      "The most famous Sicilian. With a6 Black prepares ...e5/...b5 and flexible piece play. A favorite of Fischer and Kasparov.",
    line: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
  },
  {
    id: "sicilian-dragon",
    name: "Sicilian Dragon",
    eco: "B70",
    group: "Sicilian Defense",
    recommendedSide: "b",
    description:
      "Black fianchettoes the dark-squared bishop on g7, aiming it at White's queenside. Famous for razor-sharp opposite-side attacks.",
    line: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
  },
  {
    id: "sicilian-scheveningen",
    name: "Sicilian Scheveningen",
    eco: "B80",
    group: "Sicilian Defense",
    recommendedSide: "b",
    description:
      "Black builds the classic 'small center' with pawns on d6 and e6, a flexible and resilient pawn structure.",
    line: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "e6"],
  },
  {
    id: "sicilian-sveshnikov",
    name: "Sicilian Sveshnikov",
    eco: "B33",
    group: "Sicilian Defense",
    recommendedSide: "b",
    description:
      "Black plays an early ...e5, accepting a backward d-pawn and a hole on d5 in return for active piece play.",
    line: ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "e5"],
  },
  {
    id: "sicilian-classical",
    name: "Sicilian Classical",
    eco: "B56",
    group: "Sicilian Defense",
    recommendedSide: "b",
    description:
      "Black develops naturally with ...Nc6 and ...d6, keeping options open between many Sicilian setups.",
    line: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "Nc6"],
  },
  {
    id: "sicilian-taimanov",
    name: "Sicilian Taimanov",
    eco: "B46",
    group: "Sicilian Defense",
    recommendedSide: "b",
    description:
      "A flexible ...e6 and ...Nc6 system that avoids early commitment and is hard for White to attack directly.",
    line: ["e4", "c5", "Nf3", "e6", "d4", "cxd4", "Nxd4", "Nc6", "Nc3", "a6"],
  },
  {
    id: "sicilian-kan",
    name: "Sicilian Kan",
    eco: "B41",
    group: "Sicilian Defense",
    recommendedSide: "b",
    description:
      "Black plays an early ...a6 and ...e6, a very flexible, low-theory Sicilian that delays committing the knights.",
    line: ["e4", "c5", "Nf3", "e6", "d4", "cxd4", "Nxd4", "a6"],
  },
  {
    id: "sicilian-closed",
    name: "Closed Sicilian",
    eco: "B23",
    group: "Sicilian Defense",
    recommendedSide: "w",
    description:
      "White declines to open the center, instead building a kingside attack with Nc3, g3 and f4. Low-theory and strategic.",
    line: ["e4", "c5", "Nc3", "Nc6", "g3", "g6", "Bg2", "Bg7", "d3", "d6"],
  },
  {
    id: "sicilian-alapin",
    name: "Sicilian Alapin",
    eco: "B22",
    group: "Sicilian Defense",
    recommendedSide: "w",
    description:
      "White plays c3 to support a big d4 center, a popular and solid anti-Sicilian that sidesteps mainline theory.",
    line: ["e4", "c5", "c3", "Nf6", "e5", "Nd5", "d4", "cxd4", "Nf3", "Nc6"],
  },
  {
    id: "smith-morra-gambit",
    name: "Smith-Morra Gambit",
    eco: "B21",
    group: "Sicilian Defense",
    recommendedSide: "w",
    description:
      "White sacrifices a pawn with c3 and Nxc3 to gain rapid development and open lines against the Sicilian.",
    line: ["e4", "c5", "d4", "cxd4", "c3", "dxc3", "Nxc3", "Nc6", "Nf3", "d6"],
  },

  // ───────────────────────────── Semi-Open Games (1.e4) ─────────────────────────────
  {
    id: "french-winawer",
    name: "French Defense: Winawer",
    eco: "C18",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "Black pins the c3-knight with Bb4 and trades it for the pawn structure, leading to sharp, imbalanced positions.",
    line: ["e4", "e6", "d4", "d5", "Nc3", "Bb4", "e5", "c5", "a3", "Bxc3+", "bxc3"],
  },
  {
    id: "french-advance",
    name: "French Defense: Advance",
    eco: "C02",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "White grabs space with e5 and Black counters the d4/e5 chain with ...c5 and pressure on the base. A classic pawn-chain battle.",
    line: ["e4", "e6", "d4", "d5", "e5", "c5", "c3", "Nc6", "Nf3", "Qb6"],
  },
  {
    id: "french-tarrasch",
    name: "French Defense: Tarrasch",
    eco: "C03",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "White develops the knight to d2 (the Tarrasch) to avoid the Winawer pin, keeping a flexible and solid structure.",
    line: ["e4", "e6", "d4", "d5", "Nd2", "Nf6", "e5", "Nfd7", "Bd3", "c5"],
  },
  {
    id: "french-classical",
    name: "French Defense: Classical",
    eco: "C11",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "Black develops ...Nf6 and meets Bg5 with ...Be7; White advances e5 to gain space in a rich strategic fight.",
    line: ["e4", "e6", "d4", "d5", "Nc3", "Nf6", "Bg5", "Be7", "e5", "Nfd7"],
  },
  {
    id: "caro-kann-classical",
    name: "Caro-Kann: Classical",
    eco: "B18",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "Black develops the light bishop outside the pawn chain with ...Bf5 before ...e6. Solid and reliable.",
    line: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5", "Ng3", "Bg6"],
  },
  {
    id: "caro-kann-advance",
    name: "Caro-Kann: Advance",
    eco: "B12",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "White plays e5 to gain space; Black gets the bishop out to f5 first and undermines with ...c5 and ...e6.",
    line: ["e4", "c6", "d4", "d5", "e5", "Bf5", "Nf3", "e6", "Be2", "c5"],
  },
  {
    id: "caro-kann-panov",
    name: "Caro-Kann: Panov Attack",
    eco: "B14",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "w",
    description:
      "White plays an early c4 to create an isolated queen's-pawn position with active piece play. IQP structures arise.",
    line: ["e4", "c6", "d4", "d5", "exd5", "cxd5", "c4", "Nf6", "Nc3", "e6"],
  },
  {
    id: "scandinavian-defense",
    name: "Scandinavian Defense",
    eco: "B01",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "Black challenges e4 immediately with ...d5. After recapturing the queen retreats and Black gets a solid structure.",
    line: ["e4", "d5", "exd5", "Qxd5", "Nc3", "Qa5", "d4", "Nf6", "Nf3", "c6"],
  },
  {
    id: "pirc-defense",
    name: "Pirc Defense",
    eco: "B07",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "Black cedes the center temporarily, fianchettoes the bishop and strikes back later. A flexible hypermodern defense.",
    line: ["e4", "d6", "d4", "Nf6", "Nc3", "g6", "Nf3", "Bg7", "Be2", "O-O"],
  },
  {
    id: "modern-defense",
    name: "Modern Defense",
    eco: "B06",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "Black fianchettoes immediately with ...g6 and ...Bg7, inviting White to overextend before counterattacking the center.",
    line: ["e4", "g6", "d4", "Bg7", "Nc3", "d6", "f4", "Nf6", "Nf3", "O-O"],
  },
  {
    id: "alekhine-defense",
    name: "Alekhine's Defense",
    eco: "B03",
    group: "Semi-Open Games (1.e4)",
    recommendedSide: "b",
    description:
      "Black provokes White's pawns forward with ...Nf6, planning to undermine the overextended center later.",
    line: ["e4", "Nf6", "e5", "Nd5", "d4", "d6", "c4", "Nb6", "exd6", "cxd6"],
  },

  // ───────────────────────────── Closed Games (1.d4 d5) ─────────────────────────────
  {
    id: "queens-gambit-declined",
    name: "Queen's Gambit Declined",
    eco: "D37",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "b",
    description:
      "Black supports d5 with ...e6 rather than capturing on c4. One of the most solid and classical defenses to 1.d4.",
    line: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5", "Be7", "e3", "O-O"],
  },
  {
    id: "queens-gambit-accepted",
    name: "Queen's Gambit Accepted",
    eco: "D20",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "b",
    description:
      "Black takes the c4-pawn and aims to free the position with ...c5 and ...e6, returning the pawn for development.",
    line: ["d4", "d5", "c4", "dxc4", "Nf3", "Nf6", "e3", "e6", "Bxc4", "c5"],
  },
  {
    id: "slav-defense",
    name: "Slav Defense",
    eco: "D10",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "b",
    description:
      "Black supports d5 with ...c6, keeping the light-squared bishop's diagonal open. Extremely solid and popular.",
    line: ["d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "dxc4", "a4", "Bf5"],
  },
  {
    id: "semi-slav-defense",
    name: "Semi-Slav Defense",
    eco: "D45",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "b",
    description:
      "Black combines ...e6 and ...c6, a robust structure that can lead to the sharp Meran or solid lines.",
    line: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Nf3", "c6", "e3", "Nbd7"],
  },
  {
    id: "tarrasch-defense",
    name: "Tarrasch Defense",
    eco: "D32",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "b",
    description:
      "Black plays an early ...c5, accepting an isolated queen's pawn in return for free, active piece development.",
    line: ["d4", "d5", "c4", "e6", "Nc3", "c5", "cxd5", "exd5", "Nf3", "Nc6"],
  },
  {
    id: "albin-countergambit",
    name: "Albin Countergambit",
    eco: "D08",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "b",
    description:
      "Black answers the Queen's Gambit with ...e5, sacrificing a pawn for a dangerous advanced d4-pawn and active play.",
    line: ["d4", "d5", "c4", "e5", "dxe5", "d4", "Nf3", "Nc6", "g3", "Be6"],
  },
  {
    id: "london-system",
    name: "London System",
    eco: "D02",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "w",
    description:
      "White builds a solid, easy-to-learn setup with Bf4, e3 and c3. Reliable system play with little theory to memorize.",
    line: ["d4", "d5", "Bf4", "Nf6", "e3", "e6", "Nf3", "c5", "c3", "Nc6"],
  },
  {
    id: "colle-system",
    name: "Colle System",
    eco: "D05",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "w",
    description:
      "White sets up a compact pawn triangle (d4-e3-c3) and Bd3, planning a central e4 break. A clean, system-based opening.",
    line: ["d4", "d5", "Nf3", "Nf6", "e3", "e6", "Bd3", "c5", "c3", "Nc6"],
  },
  {
    id: "trompowsky-attack",
    name: "Trompowsky Attack",
    eco: "A45",
    group: "Closed Games (1.d4 d5)",
    recommendedSide: "w",
    description:
      "White pins the knight with Bg5 on move two, avoiding mainstream Indian theory and steering into fresh positions.",
    line: ["d4", "Nf6", "Bg5", "Ne4", "Bf4", "c5", "f3", "Qa5+", "c3", "Nf6"],
  },

  // ───────────────────────────── Indian Defenses ─────────────────────────────
  {
    id: "nimzo-indian-defense",
    name: "Nimzo-Indian Defense",
    eco: "E32",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black pins the c3-knight with ...Bb4, fighting for the center with pieces rather than pawns. Strategically rich and respected.",
    line: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4", "Qc2", "O-O", "a3", "Bxc3+", "Qxc3"],
  },
  {
    id: "queens-indian-defense",
    name: "Queen's Indian Defense",
    eco: "E15",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black fianchettoes the light-squared bishop with ...b6 and ...Bb7 (or ...Ba6), controlling the long diagonal and e4.",
    line: ["d4", "Nf6", "c4", "e6", "Nf3", "b6", "g3", "Ba6", "b3", "Bb4+"],
  },
  {
    id: "bogo-indian-defense",
    name: "Bogo-Indian Defense",
    eco: "E11",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black checks with ...Bb4+ to ease development and reach solid, low-theory positions. A practical Nimzo cousin.",
    line: ["d4", "Nf6", "c4", "e6", "Nf3", "Bb4+", "Bd2", "Qe7", "g3", "Nc6"],
  },
  {
    id: "kings-indian-defense",
    name: "King's Indian Defense",
    eco: "E60",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black lets White build a big center, then strikes back with ...e5 or ...c5 and a kingside pawn storm. Dynamic and double-edged.",
    line: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "Nf3", "O-O", "Be2", "e5"],
  },
  {
    id: "grunfeld-defense",
    name: "Grünfeld Defense",
    eco: "D85",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black challenges the center with ...d5, then targets White's big pawn center from the flank. A hypermodern classic.",
    line: ["d4", "Nf6", "c4", "g6", "Nc3", "d5", "cxd5", "Nxd5", "e4", "Nxc3", "bxc3", "Bg7"],
  },
  {
    id: "catalan-opening",
    name: "Catalan Opening",
    eco: "E04",
    group: "Indian Defenses",
    recommendedSide: "w",
    description:
      "White combines a Queen's Gambit center with a kingside fianchetto, exerting long-term pressure down the long diagonal.",
    line: ["d4", "Nf6", "c4", "e6", "g3", "d5", "Bg2", "Be7", "Nf3", "O-O", "O-O", "dxc4"],
  },
  {
    id: "benoni-defense",
    name: "Benoni Defense (Modern)",
    eco: "A70",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black accepts a space disadvantage for a queenside pawn majority and active play on the half-open e-file and long diagonal.",
    line: ["d4", "Nf6", "c4", "c5", "d5", "e6", "Nc3", "exd5", "cxd5", "d6"],
  },
  {
    id: "benko-gambit",
    name: "Benko (Volga) Gambit",
    eco: "A57",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black sacrifices a wing pawn with ...b5 to open the a- and b-files and generate lasting queenside pressure.",
    line: ["d4", "Nf6", "c4", "c5", "d5", "b5", "cxb5", "a6", "bxa6", "Bxa6"],
  },
  {
    id: "dutch-defense",
    name: "Dutch Defense (Classical)",
    eco: "A96",
    group: "Indian Defenses",
    recommendedSide: "b",
    description:
      "Black stakes a claim on e4 with ...f5, fighting for kingside space and attacking chances in an asymmetrical battle.",
    line: ["d4", "f5", "g3", "Nf6", "Bg2", "e6", "Nf3", "Be7", "O-O", "O-O", "c4", "d6"],
  },

  // ───────────────────────────── Flank Openings ─────────────────────────────
  {
    id: "english-opening",
    name: "English Opening",
    eco: "A20",
    group: "Flank Openings",
    recommendedSide: "w",
    description:
      "White opens on the flank with c4, controlling d5 and keeping the structure flexible. Transposes to many systems.",
    line: ["c4", "e5", "Nc3", "Nf6", "Nf3", "Nc6", "g3", "d5", "cxd5", "Nxd5"],
  },
];
