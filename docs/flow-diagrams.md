# Project flow diagrams

Each featured project card opens with an animated diagram of the workflow at the heart of the project. This document is the spec for making a new one that matches the existing four. Follow it in order; the last step is a check that fails when a diagram breaks the layout rules.

| Piece | Where |
| --- | --- |
| Component | `src/components/FlowDiagram.tsx` |
| Shared geometry, typography and layout checks | `src/components/flow-layout.ts` |
| Diagram data, one `flow` per project | `src/components/projects-data.ts` |
| Layout checker | `npm run check:flows` (`scripts/check-flows.mjs`) |
| Card cover panel | `src/components/Projects.tsx` |

The visual language lives in the component and is the same for every diagram. A new diagram is only data: nodes, edges, optional boundary boxes, optional step order and a one-sentence description. Never restyle the component for one project.

## 1. Research the flow

Read two sources before drawing anything:

1. **The case study** on `/projects/<slug>` (written in Notion; the built page under `.next/server/app/projects/` has the text if the site has been built).
2. **The repository**: README, the entry points, CI/CD workflows, and the configuration that wires services together.

Pick the **one** workflow the project card's description promises: the path data or work takes through the system. Every node must map to something real you can point at in the repo or case study (a file, a service, a command). Write those references down; they belong in a short code comment above the `flow` entry.

## 2. Honesty rules

The diagrams sit on a hiring portfolio, so they must not overstate the work.

- Show only what exists. A stage that is planned but not built gets `planned: true` (dashed, dimmed tile), the word `planned` in its detail line, and the description says so. See Ops-Status.
- Don't draw a dependency as traffic, or traffic as causation. If the case study hedges (WakeTrail: "a clue, not proof"), the labels must not claim more.
- Measured numbers (RTO 3:55) only when the case study reports them.

## 3. Choose a shape

A straight line of six tiles looks plain. Use one of these proven shapes; each fills the 16:10 frame and gives the loop a story.

| Shape | Use when | Example |
| --- | --- | --- |
| Fan-in, spine, fan-out | Several inputs become several outputs | WakeTrail |
| Fan-in, then chain | Many sources feed one pipeline | Cloud-Native Homelab |
| Chain, then fan-out | One artifact goes to several places | Ops-Status |
| Two phases in two boxes | A before/after or primary/recovery story | Hybrid Cloud DR |

Use a dashed boundary box (`groups`) to mark the part that matters most: the core of the tool, a VM, an on-prem site, a cloud account. A wire crossing a box border reads as data leaving or entering that place.

## 4. Lay it out

Coordinates are on a 160 x 100 grid. A tile is 14 units square, centered on its `x, y`.

**Columns.** Space columns about 30 units apart. These positions are known to work:

| Column | x |
| --- | --- |
| 1 | 18 to 21 |
| 2 | 50 to 52 |
| 3 | 80 to 84 |
| 4 | 110 to 112 |
| 5 | 136 to 144 |

**Rows.** One node in a column: `y: 50`. Two: `y: 26` to `28` and `72` to `76`. Three: `y: 18, 50, 82`.

**Limits.**

- At most 7 nodes, and at most 3 in one column.
- Node names: 10 characters or fewer. Two long names (9 or 10 characters) side by side in the same row need at least 30 units between them.
- Detail lines: about 16 characters or fewer; up to about 22 in the outer columns only if the checker passes.
- Box labels: short, lowercase, 14 characters or fewer.
- A box must fully contain, or fully exclude, each tile and label, including the detail line.

You don't need to do this math by hand. `npm run check:flows` tests every width the cards render at (276px to 660px, with and without detail lines) and names each collision with the widths where it happens. Labels use Geist Mono, whose glyphs are all 0.6em wide, so the checker's text widths match the browser to within 0.1px.

## 5. Tell the story

Packets travel the edges in steps over a 6 second loop. Each step's packets leave together, the wires light gold behind them and the arriving tile pulses.

- By default, steps are layered by depth: all edges leaving the sources fire together, then the next layer, and so on. Fan-ins and fan-outs fire in parallel. This is usually right.
- Set `steps` when the narrative order differs from the graph. Hybrid Cloud DR runs the backup first, then provisioning, restore and verification, even though Terraform is a source node. Ops-Status promotes to one environment at a time.
- Keep it to 6 steps or fewer, so each step gets at least a second.

## 6. Write the copy

| Field | Style | Examples |
| --- | --- | --- |
| `label` | Short noun, rendered uppercase | `SQLite`, `Prometheus`, `pg_dump` |
| `detail` | Lowercase specifics joined with ` · ` | `exit · cwd · git`, `staging · planned` |
| `groups[].label` | Lowercase place or role | `waketrail core`, `services vm`, `on-prem` |
| `description` | Exactly one sentence describing the whole flow, for screen readers | See any existing entry |

No em dashes anywhere in the copy; the checker enforces it.

## 7. Pick icons

Icons come from `lucide-react`. Pass the component itself (`icon: Database`). Confirm a name exists before using it:

```bash
grep -q "declare const Funnel:" node_modules/lucide-react/dist/lucide-react.d.ts && echo ok
```

Icons already in use, to keep meanings consistent across cards:

| Concept | Icon |
| --- | --- |
| Shell, terminal | `Terminal` |
| Collectors, scrapers | `Radar` |
| Security, redaction | `ShieldCheck` |
| Database | `Database` |
| Backup | `DatabaseBackup` |
| Object storage | `Archive` |
| Correlation, routing | `Waypoints` |
| Timeline, history | `History` |
| Document, export | `FileText` |
| Host, VM | `Server` |
| Provisioned instance | `ServerCog` |
| Container, Compose | `Container` |
| Kubernetes, k3s | `ShipWheel` |
| Metrics (Prometheus) | `Flame` |
| Filtering, federation | `Funnel` |
| Cloud service | `Cloud` |
| Dashboard, telemetry | `Gauge` |
| Application code | `Code` |
| Tests, CI | `FlaskConical` |
| Build artifact, image | `Package` |
| Infrastructure as code | `FileCode` |
| Verified result | `BadgeCheck` |

## 8. Verify

1. `npm run check:flows` passes.
2. `npx tsc --noEmit -p .` and `npx eslint src/components scripts` pass.
3. In `npm run dev`, watch a full loop at desktop width and at a phone width: the packets should tell the story in the order you intended.
4. With reduced motion turned on (Chrome DevTools, Rendering, "prefers-reduced-motion: reduce"), the diagram is static with every node visible.

## Visual language (shared, do not vary per project)

For reference when reviewing; all of it is implemented once in the component.

| Element | Treatment |
| --- | --- |
| Panel | `#0b0d13`; a full-bleed card cover below 640px, an inset rounded panel from 640px up |
| Backdrop | Hairline grid every 10 units, vignetted, faint blue center glow |
| Tiles | Rounded squares, blue border `rgba(36,175,245,0.3)`, dark gradient fill, icon at 46% |
| Planned tiles | Dashed white border, dimmed icon and name |
| Active tile | Gold `#fde047` border, icon and name, glow, one ring pulse on arrival |
| Wires | Cubic Bezier, white at 16%, non-scaling 1.25px stroke, arrowhead at the target |
| Lit wires | Gold, fill in as the packet travels, fade together at the end of the loop |
| Packets | Pale gold head with glow and a four-particle comet tail |
| Boxes | Dashed white at 13%, turn gold while a packet is inside |
| Names | Geist Mono, uppercase, 10 to 11px, never below 10px |
| Detail lines | Geist Mono, white at 60%, hidden below 640px viewports and on diagrams under 384px wide |
| Motion | 6s loop, 66% of each step travelling and 34% paused; pauses off screen; static with reduced motion |
| Accessibility | Drawing is `aria-hidden`; the one-sentence `description` is read instead |

Changing anything in this table changes every card at once. Do it in the component and `flow-layout.ts`, then rerun `npm run check:flows`, since font sizes and spacing feed its math.
