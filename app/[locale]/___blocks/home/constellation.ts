import { seededRandom } from "@lib/seeded-random";

export type Star = { id: number; x: number; y: number; size: number; bright: boolean; desktopOnly: boolean; isSquare: boolean };
export type StarLink = { a: number; b: number };

const SEED = 20260906;
const STAR_COUNT = 44;
const BRIGHT_COUNT = 6;

/** The travelling square settles here: up and to the end side of the headline, inside a constellation. */
const SQUARE_STAR = { x: 76, y: 22 };

/** Keep the headline band clear so the statement stays readable. */
function inTextBand(x: number, y: number) {
  return x > 12 && x < 88 && y > 34 && y < 66;
}

/**
 * Deterministic starfield in percentages of the section box. The same seed renders identically on
 * the server and the client, so there is no hydration mismatch and the composition is stable.
 */
export function buildConstellation() {
  const rand = seededRandom(SEED);
  const stars: Star[] = [{ id: 0, x: SQUARE_STAR.x, y: SQUARE_STAR.y, size: 6, bright: true, desktopOnly: false, isSquare: true }];

  let guard = 0;
  while (stars.length < STAR_COUNT && guard++ < 2000) {
    const x = 3 + rand() * 94;
    const y = 4 + rand() * 92;
    if (inTextBand(x, y)) continue;
    // Spread them out a little: reject points too close to an existing star (aspect-corrected).
    if (stars.some((s) => Math.hypot((s.x - x) * 1.8, s.y - y) < 7)) continue;
    const bright = stars.length < BRIGHT_COUNT;
    stars.push({
      id: stars.length,
      x,
      y,
      size: bright ? 5 + rand() * 3 : 2.5 + rand() * 2.5,
      bright,
      desktopOnly: !bright && stars.length % 2 === 0,
      isSquare: false,
    });
  }

  // Constellation lines: each bright star (the square included) reaches for its nearest neighbours.
  const links: StarLink[] = [];
  const seen = new Set<string>();
  for (const s of stars.filter((star) => star.bright)) {
    const nearest = stars
      .filter((o) => o.id !== s.id && !o.desktopOnly)
      .map((o) => ({ o, d: Math.hypot((o.x - s.x) * 1.8, o.y - s.y) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, s.isSquare ? 3 : 2);
    for (const { o } of nearest) {
      const key = [Math.min(s.id, o.id), Math.max(s.id, o.id)].join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({ a: s.id, b: o.id });
    }
  }

  return { stars, links };
}
