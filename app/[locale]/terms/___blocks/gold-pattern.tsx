import { seededRandom } from "@lib/seeded-random";
import type { ReactNode } from "react";

/**
 * Embossed gold geometric artwork for the "Why it matters" cards (the Figma uses raster artwork of gold kufic/maze
 * motifs). Drawn as deterministic SVG in the AFS square language: no image assets, crisp at any size.
 */

const W = 300;
const H = 400;
const SHADOW = "#a97f3d";
const LIGHT = "#fff3d6";

/** Each motif is drawn twice: a dark offset stroke for depth, then the light stroke on top. */
function Embossed({ children, width }: { children: ReactNode; width: number }) {
  return (
    <>
      <g transform="translate(2.5 2.5)" stroke={SHADOW} strokeOpacity={0.55} strokeWidth={width + 1} fill="none">
        {children}
      </g>
      <g stroke={LIGHT} strokeOpacity={0.9} strokeWidth={width} fill="none">
        {children}
      </g>
    </>
  );
}

const snap = (v: number, step = 10) => Math.round(v / step) * step;

function Circuit() {
  const rand = seededRandom(11);
  const rects = Array.from({ length: 10 }, () => {
    const w = snap(50 + rand() * 130);
    const h = snap(50 + rand() * 150);
    return { x: snap(rand() * (W - w * 0.6)) - 10, y: snap(rand() * (H - h * 0.6)) - 10, w, h, nested: rand() > 0.45 };
  });
  return (
    <Embossed width={2.5}>
      {rects.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} />
          {r.nested && <rect x={r.x + 9} y={r.y + 9} width={r.w - 18} height={r.h - 18} />}
        </g>
      ))}
    </Embossed>
  );
}

function Cubes() {
  const cells: ReactNode[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 7; col++) {
      const size = 26 + (col + (8 - row)) * 3.4;
      cells.push(<rect key={`${row}-${col}`} x={col * 48 - 20} y={row * 48 - 10} width={size} height={size} />);
    }
  }
  return (
    <g transform="skewY(-14) translate(0 40)">
      <Embossed width={3}>{cells}</Embossed>
    </g>
  );
}

/** Square kufic-style labyrinth, turned 45° like the AFS diamond. */
function Maze() {
  const paths: string[] = [];
  for (let k = 1; k <= 8; k++) {
    const half = k * 22;
    const [x0, y0, x1, y1] = [-half, -half, half, half];
    const gap = 26;
    // An open square: each ring leaves its gap on a different side, which reads as a maze.
    const side = k % 4;
    const d =
      side === 0
        ? `M ${x0 + gap} ${y0} H ${x1} V ${y1} H ${x0} V ${y0}`
        : side === 1
          ? `M ${x1} ${y0 + gap} V ${y1} H ${x0} V ${y0} H ${x1}`
          : side === 2
            ? `M ${x1 - gap} ${y1} H ${x0} V ${y0} H ${x1} V ${y1}`
            : `M ${x0} ${y1 - gap} V ${y0} H ${x1} V ${y1} H ${x0}`;
    paths.push(d);
  }
  return (
    <g transform={`translate(${W / 2} ${H / 2}) rotate(45)`}>
      <Embossed width={9}>
        {paths.map((d, i) => (
          <path key={i} d={d} strokeLinecap="square" />
        ))}
      </Embossed>
    </g>
  );
}

function Weave() {
  const bars = [
    { x: 18, y: -10, w: 26, h: 420 },
    { x: 150, y: 70, w: 26, h: 300 },
    { x: 238, y: -10, w: 26, h: 420 },
    { x: -10, y: 26, w: 320, h: 24 },
    { x: 60, y: 120, w: 190, h: 24 },
    { x: 100, y: 190, w: 140, h: 24 },
    { x: -10, y: 300, w: 320, h: 24 },
    { x: 90, y: 250, w: 24, h: 50 },
  ];
  return (
    <>
      <g filter="url(#afs-gp-glow)" fill={LIGHT} opacity={0.75}>
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} />
        ))}
      </g>
      <Embossed width={2}>
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} />
        ))}
      </Embossed>
    </>
  );
}

const MOTIFS = [Circuit, Cubes, Maze, Weave];

export function GoldPattern({ variant, className }: { variant: number; className?: string }) {
  const Motif = MOTIFS[variant % MOTIFS.length];
  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className}>
      <defs>
        <linearGradient id="afs-gp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d7b06a" />
          <stop offset="1" stopColor="#efd59d" />
        </linearGradient>
        <filter id="afs-gp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#afs-gp-bg)" />
      <Motif />
    </svg>
  );
}
