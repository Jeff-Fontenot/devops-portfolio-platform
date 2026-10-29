---
name: project-flow-diagram
description: Create or update the animated flow diagram on a featured project card so it matches the existing ones. Use when adding a project to the homepage Featured Projects section, when asked for a diagram, cover or workflow animation for a project, or when editing an existing card's diagram.
---

# Project flow diagram

The spec is `docs/flow-diagrams.md`. Read it in full before starting; this skill is the order of work, the spec is the rules.

## Steps

1. **Research.** Read the project's case study (`/projects/<slug>`; built text is under `.next/server/app/projects/<slug>.html` if the site has been built) and clone its repository into the scratchpad. Find the one workflow the card's description promises. Note the file or config behind every node you plan to draw.
2. **Check honesty.** List which stages exist today and which are planned. Planned stages get `planned: true`, "planned" in their detail line a mention in the description, and still dashed wires (packets only travel implemented paths). Keep the card prose honest the same way.
3. **Draft the data.** Add a `flow` entry to the project in `src/components/projects-data.ts`, following the shapes, columns, rows, copy style and icon table in the spec. Put a short comment above it naming what the diagram mirrors.
4. **Check the layout.** Run `npm run check:flows` and fix every problem it reports by moving nodes, shortening copy or resizing boxes. Never loosen the checker or the component to make a diagram pass.
5. **Look at it.** Run the dev server and watch a full loop at desktop and phone widths, and confirm the packet order tells the story.
6. **Review before rollout.** When doing more than one project, finish one and show it to the user before starting the others.

## Constraints

- Change data only. The component's look is shared by every card; restyle it only when the user asks for a change to all of them, then rerun the checker.
- No em dashes in any copy.
- The design was inspired by the project-card covers on sagargupta.online, whose code is GPL-3.0. Never view, copy or adapt that site's code.
