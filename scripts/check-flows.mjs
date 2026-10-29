// Checks every project card's flow diagram for collisions at every width the
// cards render at, using the same geometry as <FlowDiagram>. Run it with
// `npm run check:flows` after adding or editing a diagram; it exits non-zero
// on any problem. The rules are written up in docs/flow-diagrams.md.

import { checkFlowData, checkFlowLayout, ROOMY_WIDTH } from "../src/components/flow-layout.ts";
import { projects } from "../src/components/projects-data.ts";

// Narrowest to widest rendered diagram, measured in the browser: a card in
// the two-column grid at 768px (276px, about the same as a 320px phone's
// full-bleed cover) up to a single-column card just under md.
const MIN_WIDTH = 276;
const MAX_WIDTH = 660;
const STEP = 4;

let failures = 0;
for (const project of projects) {
  if (!project.flow) continue;

  // Each problem, with the range of widths it shows up at.
  const found = new Map();
  for (const issue of checkFlowData(project.flow)) found.set(issue, null);
  for (let width = MIN_WIDTH; width <= MAX_WIDTH; width += STEP) {
    // Sublabels can only appear on diagrams at least ROOMY_WIDTH wide.
    for (const details of width >= ROOMY_WIDTH ? [false, true] : [false]) {
      for (const issue of checkFlowLayout(project.flow, width, details)) {
        const key = details ? `${issue} (with sublabels)` : issue;
        const range = found.get(key) ?? [width, width];
        found.set(key, [Math.min(range[0], width), Math.max(range[1], width)]);
      }
    }
  }

  if (found.size === 0) {
    console.log(`ok    ${project.title}`);
    continue;
  }
  failures += found.size;
  console.log(`FAIL  ${project.title}`);
  for (const [issue, range] of found) {
    console.log(`      - ${issue}${range ? ` at ${range[0]}-${range[1]}px` : ""}`);
  }
}

if (failures > 0) {
  console.log(`\n${failures} problem(s). Adjust node x/y, labels or group boxes in projects-data.ts.`);
  process.exit(1);
}
