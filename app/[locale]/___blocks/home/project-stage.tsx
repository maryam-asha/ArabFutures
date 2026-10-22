import { cn } from "@lib/utils";
import type { CSSProperties } from "react";

import { type Box, PROJECT_LAYOUTS, PROJECT_ORDER, type ProjectId, SHAPE_IDS, SHAPE_STYLE, STAGE_H, STAGE_W, boxToCss, shapeBox } from "./project-layouts";

const SHAPE_CLASS = {
  outline: "border border-light/90",
  pale: "bg-gold-pale",
  white: "bg-light",
  line: "bg-gold",
} as const;

function boxStyle(b: Box): CSSProperties {
  const css = boxToCss(b);
  return { left: css.left, top: css.top, width: css.width, height: css.height, opacity: css.opacity, transform: `rotate(${css.rotation}deg)` };
}

/**
 * The geometric composition for a project.
 *
 * `shared` renders one stage for the pinned desktop presenter: every pool shape (placed for the
 * first project, morphed by GSAP) plus an invisible gold anchor per project for the journey square.
 * Otherwise it renders a single static composition with its gold square in the flow.
 */
export function ProjectStage({ project, shared = false, className }: { project: ProjectId; shared?: boolean; className?: string }) {
  const layout = PROJECT_LAYOUTS[project];

  return (
    <div aria-hidden data-project-stage={shared ? "" : undefined} className={cn("relative w-full rtl:-scale-x-100", className)} style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
      {SHAPE_IDS.map((id) => {
        const box = shapeBox(project, id);
        if (!shared && !layout.shapes[id]) return null;
        return <span key={id} data-shape={id} className={cn("absolute block origin-center", SHAPE_CLASS[SHAPE_STYLE[id]])} style={boxStyle(box)} />;
      })}

      {shared ? (
        PROJECT_ORDER.map((id, index) => (
          <span
            key={id}
            data-square-anchor={`project-${index}`}
            data-rot={PROJECT_LAYOUTS[id].gold.r ?? 0}
            data-color="#cea864"
            className={cn("bg-gold absolute block origin-center", index > 0 && "invisible")}
            style={boxStyle(PROJECT_LAYOUTS[id].gold)}
          />
        ))
      ) : (
        <span data-shape-gold className="bg-gold absolute block origin-center" style={boxStyle(layout.gold)} />
      )}
    </div>
  );
}

export function ProgressDashes({ active, total, className }: { active: number; total: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex gap-2", className)}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} data-dash className={cn("block h-[3px] w-5", i === active ? "bg-gold" : "bg-light/40")} />
      ))}
    </div>
  );
}
