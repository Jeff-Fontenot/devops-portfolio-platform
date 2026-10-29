// Geometry and typography shared by <FlowDiagram> and the layout checker
// (scripts/check-flows.mjs). Kept free of React so plain Node can import it.
// The design rules these numbers encode are written up in docs/flow-diagrams.md.

import type { FlowDiagramData, FlowNode } from "./FlowDiagram";

// Node coordinates live on a fixed 160x100 grid. The container holds the same
// 16:10 aspect ratio, so the grid scales uniformly at any rendered size.
export const GRID_W = 160;
export const GRID_H = 100;
export const CQW_PER_UNIT = 100 / GRID_W;

// Tile edge length, in grid units.
export const TILE = 14;
// Gap between a tile's border and the start or end of its wires.
export const WIRE_GAP = 1.5;

// Label typography. FlowDiagram builds its font sizes from these; the
// tracking values mirror its Tailwind classes, which must stay literal.
export const NAME_FONT = { min: 10, cqw: 2, max: 11 };
export const DETAIL_FONT = { min: 7, cqw: 1.55, max: 9 };
export const GROUP_FONT_PX = 10;
export const NAME_GAP_CQW = 1.1;
export const DETAIL_GAP_CQW = 0.5;
// Below this diagram width (the @sm container query, 24rem) letter-spacing
// tightens and details hide. Details also hide below a 640px viewport.
export const ROOMY_WIDTH = 384;
export const NAME_TRACKING = { narrow: 0.04, roomy: 0.12 };
export const GROUP_TRACKING = { narrow: 0.06, roomy: 0.16 };
export const GROUP_LABEL_INSET_CQW = 2;
export const GROUP_LABEL_PAD_CQW = 0.8;
// Geist Mono advances every glyph by 0.6em, so label widths can be computed.
const MONO_ADVANCE = 0.6;

export const fontCss = (f: { min: number; cqw: number; max: number }) => `clamp(${f.min}px, ${f.cqw}cqw, ${f.max}px)`;

export type Point = { x: number; y: number };
export type Curve = [Point, Point, Point, Point];

// Wires leave and enter tiles on the sides facing each other, along the
// dominant axis, so a fan-in converges on one side of the target tile.
export function wireBetween(a: Point, b: Point): Curve {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const inset = TILE / 2 + WIRE_GAP;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const s = Math.sign(dx);
    const p0 = { x: a.x + s * inset, y: a.y };
    const p3 = { x: b.x - s * inset, y: b.y };
    const mid = (p3.x - p0.x) / 2;
    return [p0, { x: p0.x + mid, y: p0.y }, { x: p3.x - mid, y: p3.y }, p3];
  }
  const s = Math.sign(dy);
  const p0 = { x: a.x, y: a.y + s * inset };
  const p3 = { x: b.x, y: b.y - s * inset };
  const mid = (p3.y - p0.y) / 2;
  return [p0, { x: p0.x, y: p0.y + mid }, { x: p3.x, y: p3.y - mid }, p3];
}

export function pointOnCurve([p0, p1, p2, p3]: Curve, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

// ---- Layout checking ----

type Rect = { left: number; top: number; right: number; bottom: number };

const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));
const textWidth = (text: string, fontPx: number, trackingEm: number) =>
  text.length * (MONO_ADVANCE + trackingEm) * fontPx;
const gapBetween = (a: Rect, b: Rect) =>
  Math.max(Math.max(b.left - a.right, a.left - b.right), Math.max(b.top - a.bottom, a.top - b.bottom));
const inside = (r: Rect, box: Rect) => r.left >= box.left && r.right <= box.right && r.top >= box.top && r.bottom <= box.bottom;
const apart = (r: Rect, box: Rect) => r.right <= box.left || r.left >= box.right || r.bottom <= box.top || r.top >= box.bottom;
const contains = (r: Rect, p: Point) => p.x > r.left && p.x < r.right && p.y > r.top && p.y < r.bottom;

// Minimum clear space, in px, between unrelated tiles and labels.
const MIN_GAP = 3;
// Minimum clear space, in px, between a label and the diagram's edge.
const EDGE_MARGIN = 2;

function nodeRects(node: FlowNode, widthPx: number, showDetails: boolean) {
  const u = widthPx / GRID_W;
  const cqw = widthPx / 100;
  const roomy = widthPx >= ROOMY_WIDTH;
  const half = (TILE / 2) * u;
  const tile = { left: node.x * u - half, right: node.x * u + half, top: node.y * u - half, bottom: node.y * u + half };

  const nameFont = clamp(NAME_FONT.min, NAME_FONT.cqw * cqw, NAME_FONT.max);
  let labelWidth = textWidth(node.label, nameFont, roomy ? NAME_TRACKING.roomy : NAME_TRACKING.narrow);
  let bottom = tile.bottom + NAME_GAP_CQW * cqw + nameFont;
  if (showDetails && node.detail) {
    const detailFont = clamp(DETAIL_FONT.min, DETAIL_FONT.cqw * cqw, DETAIL_FONT.max);
    labelWidth = Math.max(labelWidth, textWidth(node.detail, detailFont, 0));
    bottom += DETAIL_GAP_CQW * cqw + detailFont;
  }
  const label = { left: node.x * u - labelWidth / 2, right: node.x * u + labelWidth / 2, top: tile.bottom, bottom };
  return { tile, label };
}

// Every problem this diagram has when rendered `widthPx` wide, in plain words.
export function checkFlowLayout(data: FlowDiagramData, widthPx: number, showDetails: boolean): string[] {
  const issues: string[] = [];
  const u = widthPx / GRID_W;
  const cqw = widthPx / 100;
  const frame = { left: 0, top: 0, right: widthPx, bottom: (widthPx * GRID_H) / GRID_W };
  const rects = new Map(data.nodes.map((n) => [n.id, nodeRects(n, widthPx, showDetails)]));
  const groups = (data.groups ?? []).map((g) => ({
    g,
    box: { left: g.x * u, top: g.y * u, right: (g.x + g.w) * u, bottom: (g.y + g.h) * u },
  }));

  for (const n of data.nodes) {
    const { tile, label } = rects.get(n.id)!;
    for (const [part, r] of [["tile", tile], ["label", label]] as const) {
      if (
        r.left < frame.left + EDGE_MARGIN ||
        r.right > frame.right - EDGE_MARGIN ||
        r.top < frame.top + EDGE_MARGIN ||
        r.bottom > frame.bottom - EDGE_MARGIN
      ) {
        issues.push(`"${n.label}" ${part} runs off the diagram edge`);
      }
      for (const { g, box } of groups) {
        if (!inside(r, box) && !apart(r, box)) issues.push(`"${n.label}" ${part} crosses the "${g.label}" box border`);
      }
    }
  }

  for (let i = 0; i < data.nodes.length; i++) {
    for (let j = i + 1; j < data.nodes.length; j++) {
      const a = rects.get(data.nodes[i].id)!;
      const b = rects.get(data.nodes[j].id)!;
      for (const ra of [a.tile, a.label]) {
        for (const rb of [b.tile, b.label]) {
          if (gapBetween(ra, rb) < MIN_GAP) {
            issues.push(`"${data.nodes[i].label}" and "${data.nodes[j].label}" are closer than ${MIN_GAP}px`);
          }
        }
      }
    }
  }

  for (const { g, box } of groups) {
    const tracking = widthPx >= ROOMY_WIDTH ? GROUP_TRACKING.roomy : GROUP_TRACKING.narrow;
    const left = box.left + GROUP_LABEL_INSET_CQW * cqw;
    const right = left + textWidth(g.label.toUpperCase(), GROUP_FONT_PX, tracking) + 2 * GROUP_LABEL_PAD_CQW * cqw;
    if (right > box.right - MIN_GAP) issues.push(`"${g.label}" box label is wider than its box`);
    const tag = { left, right, top: box.top - GROUP_FONT_PX / 2, bottom: box.top + GROUP_FONT_PX / 2 };
    for (const n of data.nodes) {
      const { tile, label } = rects.get(n.id)!;
      if (gapBetween(tag, tile) < MIN_GAP || gapBetween(tag, label) < MIN_GAP) {
        issues.push(`"${g.label}" box label collides with "${n.label}"`);
      }
    }
  }

  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  for (const e of data.edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) continue;
    const curve = wireBetween(a, b);
    const hit = new Set<string>();
    for (let k = 1; k < 40; k++) {
      const p = pointOnCurve(curve, k / 40);
      const px = { x: p.x * u, y: p.y * u };
      for (const n of data.nodes) {
        if (n.id === e.from || n.id === e.to || hit.has(n.id)) continue;
        const { tile, label } = rects.get(n.id)!;
        if (contains(tile, px) || contains(label, px)) hit.add(n.id);
      }
    }
    for (const id of hit) issues.push(`wire ${e.from} -> ${e.to} runs through "${byId.get(id)!.label}"`);
  }

  return [...new Set(issues)];
}

// Problems with the data itself, independent of rendered size.
export function checkFlowData(data: FlowDiagramData): string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const n of data.nodes) {
    if (ids.has(n.id)) issues.push(`duplicate node id "${n.id}"`);
    ids.add(n.id);
    if (n.x < 0 || n.x > GRID_W || n.y < 0 || n.y > GRID_H) issues.push(`"${n.id}" sits outside the ${GRID_W}x${GRID_H} grid`);
  }
  const edgeKeys = new Set<string>();
  for (const e of data.edges) {
    if (!ids.has(e.from) || !ids.has(e.to)) issues.push(`edge ${e.from} -> ${e.to} names a missing node`);
    edgeKeys.add(`${e.from}>${e.to}`);
  }
  if (data.steps) {
    const stepped = new Set(data.steps.flat().map(([from, to]) => `${from}>${to}`));
    for (const key of stepped) if (!edgeKeys.has(key)) issues.push(`step ${key.replace(">", " -> ")} is not an edge`);
    for (const key of edgeKeys) if (!stepped.has(key)) issues.push(`edge ${key.replace(">", " -> ")} is in no step, so no packet travels it`);
  }
  const linked = new Set(data.edges.flatMap((e) => [e.from, e.to]));
  for (const id of ids) if (!linked.has(id)) issues.push(`"${id}" has no wires`);

  const description = data.description?.trim() ?? "";
  if (!description) issues.push("missing a description for screen readers");
  else if (!/[.]$/.test(description) || /[.!?]\s+[A-Z]/.test(description)) {
    issues.push("description should be exactly one sentence");
  }
  const copy = [
    description,
    ...data.nodes.flatMap((n) => [n.label, n.detail ?? ""]),
    ...(data.groups ?? []).map((g) => g.label),
  ];
  if (copy.some((text) => text.includes("\u2014"))) issues.push("copy contains an em dash");
  return issues;
}
