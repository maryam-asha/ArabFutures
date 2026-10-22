/**
 * Geometry for the five project compositions (read from the Figma "Main Page" export).
 *
 * Every composition is built from the same pool of shapes, so moving between projects is a
 * real transformation of the same elements rather than a cross-fade. The single gold element
 * of each composition is the travelling square itself (rendered by the journey overlay), so it
 * is described separately as `gold`.
 *
 * Coordinates are in a 620 × 500 design box and converted to percentages, which keeps the
 * compositions proportional at every stage size.
 */

export const STAGE_W = 620;
export const STAGE_H = 500;

export type Box = { x: number; y: number; w: number; h: number; r?: number; o?: number };

export type ShapeId = "outline" | "pale" | "white" | "bar0" | "bar1" | "bar2" | "bar3" | "bar4" | "bar5" | "line0" | "line1" | "line2" | "line3" | "line4";

export const SHAPE_IDS: ShapeId[] = ["outline", "pale", "white", "bar0", "bar1", "bar2", "bar3", "bar4", "bar5", "line0", "line1", "line2", "line3", "line4"];

/** Visual style of each pool shape. */
export const SHAPE_STYLE: Record<ShapeId, "outline" | "pale" | "white" | "line"> = {
  outline: "outline",
  pale: "pale",
  white: "white",
  bar0: "white",
  bar1: "pale",
  bar2: "pale",
  bar3: "pale",
  bar4: "pale",
  bar5: "pale",
  line0: "line",
  line1: "line",
  line2: "line",
  line3: "line",
  line4: "line",
};

export type ProjectId = "library" | "lexicon" | "network" | "diploma" | "children";

export type ProjectLayout = { gold: Box; shapes: Partial<Record<ShapeId, Box>> };

const LINE = 1.5;

export const PROJECT_LAYOUTS: Record<ProjectId, ProjectLayout> = {
  // Gold square low-left, outline square up and to the right.
  library: {
    gold: { x: 10, y: 222, w: 200, h: 200 },
    shapes: { outline: { x: 410, y: 78, w: 200, h: 200 } },
  },
  // Fanned stack: outline at the back, pale in the middle, gold in front.
  lexicon: {
    gold: { x: 110, y: 170, w: 200, h: 200 },
    shapes: {
      outline: { x: 190, y: 118, w: 200, h: 200, r: 45 },
      pale: { x: 158, y: 140, w: 200, h: 200, r: 20 },
    },
  },
  // Gold square beside a list: one white bar and five pale lines.
  network: {
    gold: { x: 100, y: 150, w: 200, h: 200 },
    shapes: {
      bar0: { x: 316, y: 186, w: 200, h: 24 },
      bar1: { x: 316, y: 226, w: 200, h: 8 },
      bar2: { x: 316, y: 248, w: 177, h: 8 },
      bar3: { x: 316, y: 270, w: 200, h: 8 },
      bar4: { x: 316, y: 292, w: 163, h: 8 },
      bar5: { x: 316, y: 314, w: 200, h: 8 },
    },
  },
  // Three small squares joined by thin gold circuit lines.
  diploma: {
    gold: { x: 100, y: 130, w: 80, h: 80 },
    shapes: {
      white: { x: 436, y: 130, w: 80, h: 80 },
      pale: { x: 278, y: 285, w: 80, h: 80 },
      line0: { x: 180, y: 170 - LINE / 2, w: 256, h: LINE },
      line1: { x: 140 - LINE / 2, y: 210, w: LINE, h: 115 },
      line2: { x: 140, y: 325 - LINE / 2, w: 138, h: LINE },
      line3: { x: 358, y: 325 - LINE / 2, w: 118, h: LINE },
      line4: { x: 476 - LINE / 2, y: 210, w: LINE, h: 115 },
    },
  },
  // Graduation cap: a tilted white board over a pale base, the gold square as the tassel knot.
  children: {
    gold: { x: 293, y: 214, w: 20, h: 20, r: 0 },
    shapes: {
      pale: { x: 236, y: 250, w: 140, h: 58 },
      white: { x: 218, y: 134, w: 170, h: 170, r: 30 },
      bar1: { x: 296, y: 232, w: 3, h: 40, r: 10 },
      bar2: { x: 302, y: 232, w: 3, h: 44, r: 0 },
      bar3: { x: 308, y: 232, w: 3, h: 40, r: -10 },
    },
  },
};

export const PROJECT_ORDER: ProjectId[] = ["library", "lexicon", "network", "diploma", "children"];

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(4)}%`;

/** Percent-based placement for a box inside the stage. */
export function boxToCss(b: Box) {
  return {
    left: pct(b.x, STAGE_W),
    top: pct(b.y, STAGE_H),
    width: pct(b.w, STAGE_W),
    height: pct(b.h, STAGE_H),
    rotation: b.r ?? 0,
    opacity: b.o ?? 1,
  };
}

/** Where an unused shape hides: collapsed into the centre of the gold square, invisible. */
export function hiddenBox(gold: Box): Box {
  return { x: gold.x + gold.w / 2, y: gold.y + gold.h / 2, w: 0, h: 0, r: gold.r ?? 0, o: 0 };
}

export function shapeBox(project: ProjectId, id: ShapeId): Box {
  const layout = PROJECT_LAYOUTS[project];
  return layout.shapes[id] ?? hiddenBox(layout.gold);
}
