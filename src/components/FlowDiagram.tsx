"use client";

import { useEffect, useMemo, useRef, type ComponentType } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import {
  CQW_PER_UNIT,
  DETAIL_FONT,
  DETAIL_GAP_CQW,
  GRID_H,
  GRID_W,
  NAME_FONT,
  NAME_GAP_CQW,
  TILE,
  fontCss,
  pointOnCurve,
  wireBetween,
  type Curve,
} from "./flow-layout";

// Tiles, the backdrop and the trail are sized in container units (cqw)
// against the grid in flow-layout.ts, so the whole drawing scales together
// like an SVG would, while the labels stay real HTML text with a readable
// minimum size.

const LOOP_SECONDS = 6;
// Share of each step spent travelling; the rest is the pause at the arrival.
const TRAVEL_SHARE = 0.66;
// How far behind the packet each comet-tail particle sits, in curve progress.
const TRAIL = [0.045, 0.09, 0.135, 0.18];

export type FlowNode = {
  id: string;
  label: string;
  // Short second line under the label, shown when the diagram has room.
  detail?: string;
  icon?: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  // Drawn with a dashed, dimmer tile for stages that aren't built yet.
  planned?: boolean;
  x: number;
  y: number;
};

export type FlowEdge = { from: string; to: string };

// A dashed boundary drawn behind the nodes, in grid units. It lights while a
// packet is at any of the listed nodes.
export type FlowGroup = { label: string; x: number; y: number; w: number; h: number; nodes?: string[] };

export type FlowDiagramData = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  groups?: FlowGroup[];
  // Each step lists the [from, to] edges whose packets travel together.
  // Defaults to layering by depth, so fan-ins and fan-outs fire in parallel.
  steps?: [from: string, to: string][][];
  // One-sentence description of the flow for screen readers. Falls back to a
  // sentence built from the steps.
  description?: string;
};

type Wire = FlowEdge & { key: string; curve: Curve; arrow: string; step: number };

function arrowHead([, , p2, p3]: Curve): string {
  const len = Math.hypot(p3.x - p2.x, p3.y - p2.y) || 1;
  const ux = (p3.x - p2.x) / len;
  const uy = (p3.y - p2.y) / len;
  const back = 2.2;
  const wing = 1.5;
  const bx = p3.x - ux * back;
  const by = p3.y - uy * back;
  return `M ${bx - uy * wing} ${by + ux * wing} L ${p3.x} ${p3.y} L ${bx + uy * wing} ${by - ux * wing}`;
}

function curvePath([p0, p1, p2, p3]: Curve): string {
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

// Longest-path depth from the sources; every edge leaving depth d fires in step d.
function layeredSteps(nodes: FlowNode[], edges: FlowEdge[]): FlowEdge[][] {
  const depth = new Map(nodes.map((n) => [n.id, 0]));
  for (let pass = 0; pass < nodes.length; pass++) {
    for (const e of edges) {
      depth.set(e.to, Math.max(depth.get(e.to) ?? 0, (depth.get(e.from) ?? 0) + 1));
    }
  }
  const steps: FlowEdge[][] = [];
  for (const e of edges) (steps[depth.get(e.from) ?? 0] ??= []).push(e);
  return steps.filter(Boolean);
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`;
const edgeKey = (e: FlowEdge) => `${e.from}>${e.to}`;

export default function FlowDiagram({ nodes, edges, groups = [], steps, description }: FlowDiagramData) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const animated = !reduceMotion;

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const { wires, stepCount } = useMemo(() => {
    const order = steps
      ? steps.map((step) => step.map(([from, to]) => ({ from, to })))
      : layeredSteps(nodes, edges);
    const stepOf = new Map<string, number>();
    order.forEach((step, i) => step.forEach((e) => stepOf.set(edgeKey(e), i)));
    const wires = edges.flatMap((edge): Wire[] => {
      const a = nodeById.get(edge.from);
      const b = nodeById.get(edge.to);
      if (!a || !b) return [];
      const curve = wireBetween(a, b);
      return [{ ...edge, key: edgeKey(edge), curve, arrow: arrowHead(curve), step: stepOf.get(edgeKey(edge)) ?? -1 }];
    });
    return { wires, stepCount: order.length };
  }, [steps, nodes, edges, nodeById]);

  const summary =
    description ??
    `Flow diagram: ${Array.from({ length: stepCount }, (_, i) =>
      wires
        .filter((w) => w.step === i)
        .map((w) => `${nodeById.get(w.from)?.label} to ${nodeById.get(w.to)?.label}`)
        .join(" and "),
    ).join(", then ")}.`;

  // Everything that moves is written straight to the DOM from one Motion
  // callback, so packets, lit wires and highlighted tiles change in the same
  // frame without re-rendering React.
  const nodeEls = useRef(new Map<string, HTMLDivElement>());
  const groupEls = useRef(new Map<number, HTMLDivElement>());
  const litEls = useRef(new Map<string, SVGGElement>());
  const packetEls = useRef(new Map<string, HTMLSpanElement[]>());
  const active = useRef(new Set<string>());

  const setActive = (next: Set<string>) => {
    for (const id of active.current) if (!next.has(id)) nodeEls.current.get(id)?.removeAttribute("data-active");
    for (const id of next) if (!active.current.has(id)) nodeEls.current.get(id)?.setAttribute("data-active", "");
    active.current = next;
    groups.forEach((g, i) => {
      const lit = g.nodes?.some((id) => next.has(id));
      groupEls.current.get(i)?.toggleAttribute("data-active", Boolean(lit));
    });
  };

  const paint = (progress: number) => {
    if (!stepCount) return;
    const scaled = (progress % 1) * stepCount;
    const step = Math.min(Math.floor(scaled), stepCount - 1);
    const local = scaled - step;
    const travelling = local < TRAVEL_SHARE;
    const t = travelling ? local / TRAVEL_SHARE : (local - TRAVEL_SHARE) / (1 - TRAVEL_SHARE);
    // The finished trail fades out over the last pause, ready for the next loop.
    const fade = step === stepCount - 1 && !travelling ? 1 - Math.max(0, (t - 0.25) / 0.75) : 1;

    const next = new Set<string>();
    for (const w of wires) {
      const lit = w.step < step ? 1 : w.step === step ? (travelling ? easeInOut(t) : 1) : 0;
      const litEl = litEls.current.get(w.key);
      if (litEl) litEl.style.opacity = String(lit * fade);

      const [head, ...trail] = packetEls.current.get(w.key) ?? [];
      if (!head) continue;
      if (w.step !== step) {
        head.style.opacity = "0";
        trail.forEach((el) => (el.style.opacity = "0"));
        continue;
      }
      next.add(travelling ? w.from : w.to);
      const u = travelling ? easeInOut(t) : 1;
      const at = pointOnCurve(w.curve, u);
      head.style.left = pct(at.x, GRID_W);
      head.style.top = pct(at.y, GRID_H);
      head.style.opacity = String(travelling ? Math.min(1, t * 6) : Math.max(0, 1 - t * 4));
      trail.forEach((el, i) => {
        const back = Math.max(0, u - TRAIL[i]);
        const p = pointOnCurve(w.curve, back);
        el.style.left = pct(p.x, GRID_W);
        el.style.top = pct(p.y, GRID_H);
        el.style.opacity = travelling && back > 0 ? String((1 - (i + 1) / (TRAIL.length + 1)) * 0.7) : "0";
      });
    }
    setActive(next);
  };

  const reset = () => {
    setActive(new Set());
    litEls.current.forEach((el) => (el.style.opacity = "0"));
    packetEls.current.forEach((els) => els.forEach((el) => (el.style.opacity = "0")));
  };

  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  useMotionValueEvent(progress, "change", paint);

  useEffect(() => {
    if (!animated || stepCount === 0) return;
    controls.current = animate(progress, 1, {
      duration: LOOP_SECONDS,
      ease: "linear",
      repeat: Infinity,
    });
    return () => {
      controls.current?.stop();
      controls.current = null;
      reset();
    };
    // reset only touches refs, so it doesn't need to restart the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, stepCount, progress]);

  useEffect(() => {
    if (inView) controls.current?.play();
    else controls.current?.pause();
  }, [inView, animated]);

  const tile = `${TILE * CQW_PER_UNIT}cqw`;
  const gridStep = `${10 * CQW_PER_UNIT}cqw`;

  return (
    <div>
      {/* The drawing is decorative to assistive tech; this sentence carries
          the flow instead of a scatter of tile labels. */}
      <p className="sr-only">{summary}</p>
      <div ref={ref} aria-hidden className="@container relative aspect-[16/10] w-full select-none">
        {/* Blueprint backdrop: a hairline grid on 10-unit squares, vignetted. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: `${gridStep} ${gridStep}`,
            backgroundPosition: "center",
            maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 35%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 35%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(50% 55% at 50% 50%, rgba(36,175,245,0.07), transparent 70%)" }}
        />

        {groups.map((g, i) => (
          <div
            key={g.label}
            ref={(el) => {
              if (el) groupEls.current.set(i, el);
              else groupEls.current.delete(i);
            }}
            className="group/flowgroup absolute rounded-[1.6cqw] border border-dashed border-white/[0.13] transition-colors duration-500 data-[active]:border-[rgba(253,224,71,0.35)]"
            style={{ left: pct(g.x, GRID_W), top: pct(g.y, GRID_H), width: pct(g.w, GRID_W), height: pct(g.h, GRID_H) }}
          >
            {/* Size, inset and tracking mirror GROUP_* in flow-layout.ts. */}
            <span
              className="absolute left-[2cqw] top-0 -translate-y-1/2 bg-[#0b0d13] px-[0.8cqw] font-mono text-[10px] uppercase leading-none tracking-[0.06em] text-white/40 transition-colors duration-500 group-data-[active]/flowgroup:text-[#fde047]/80 @sm:tracking-[0.16em]"
            >
              {g.label}
            </span>
          </div>
        ))}

        <svg
          viewBox={`0 0 ${GRID_W} ${GRID_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          {wires.map((w) => (
            <g key={w.key} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <g stroke="#ffffff" strokeOpacity={0.16} strokeWidth={1.25}>
                <path d={curvePath(w.curve)} vectorEffect="non-scaling-stroke" />
                <path d={w.arrow} vectorEffect="non-scaling-stroke" />
              </g>
              <g
                ref={(el) => {
                  if (el) litEls.current.set(w.key, el);
                  else litEls.current.delete(w.key);
                }}
                stroke="#fde047"
                strokeWidth={1.5}
                style={{ opacity: 0 }}
              >
                <path d={curvePath(w.curve)} strokeOpacity={0.75} vectorEffect="non-scaling-stroke" />
                <path d={w.arrow} vectorEffect="non-scaling-stroke" />
              </g>
            </g>
          ))}
        </svg>

        {animated &&
          wires.map((w) => (
            <span key={w.key} aria-hidden>
              {[0, ...TRAIL].map((_, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    const els = packetEls.current.get(w.key) ?? [];
                    if (el) els[i] = el;
                    packetEls.current.set(w.key, els);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    i === 0 ? "bg-[#fff6c2] shadow-[0_0_8px_2px_rgba(250,204,21,0.75)]" : "bg-[#fde047]"
                  }`}
                  style={{
                    width: `clamp(${4 - i * 0.6}px, ${(1.15 - i * 0.18).toFixed(2)}cqw, ${7 - i}px)`,
                    aspectRatio: "1",
                    opacity: 0,
                  }}
                />
              ))}
            </span>
          ))}

        {nodes.map(({ id, label: text, detail, icon: Icon, planned, x, y }) => (
          <div
            key={id}
            ref={(el) => {
              if (el) nodeEls.current.set(id, el);
              else nodeEls.current.delete(id);
            }}
            className="group/node absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(x, GRID_W), top: pct(y, GRID_H) }}
          >
            <div
              className={`relative grid place-items-center rounded-[24%] border transition-[color,border-color,box-shadow] duration-300 group-data-[active]/node:border-[rgba(253,224,71,0.75)] group-data-[active]/node:text-[#fde047] group-data-[active]/node:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_22px_-3px_rgba(250,204,21,0.55)] ${
                planned
                  ? "border-dashed border-white/25 bg-[#0b0d13] text-white/45"
                  : "border-[rgba(36,175,245,0.3)] bg-[linear-gradient(160deg,#151a26,#0b0d13)] text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_6px_14px_-8px_rgba(0,0,0,0.8)]"
              }`}
              style={{ width: tile, height: tile }}
            >
              {Icon && <Icon className="h-[46%] w-[46%]" strokeWidth={1.6} aria-hidden />}
              {/* Arrival pulse: restarts each time the tile becomes active. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[-1px] rounded-[inherit] border border-[#fde047] opacity-0 group-data-[active]/node:animate-[flow-ping_0.9s_ease-out]"
              />
            </div>
            <div
              className="absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center whitespace-nowrap font-mono leading-none"
              style={{ marginTop: `${NAME_GAP_CQW}cqw`, gap: `${DETAIL_GAP_CQW}cqw` }}
            >
              {/* Tracking mirrors NAME_TRACKING in flow-layout.ts. */}
              <span
                className={`font-medium uppercase tracking-[0.04em] transition-colors duration-300 group-data-[active]/node:text-[#fde047] @sm:tracking-[0.12em] ${
                  planned ? "text-white/50" : "text-white/80"
                }`}
                style={{ fontSize: fontCss(NAME_FONT) }}
              >
                {text}
              </span>
              {detail && (
                // Hidden on phones, and on any diagram too narrow to fit them.
                <span className="hidden text-white/60 sm:@sm:block" style={{ fontSize: fontCss(DETAIL_FONT) }}>
                  {detail}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
