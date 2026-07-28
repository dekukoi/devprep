# Current Feature
<!-- Feature name and short description -->

Mock Data, Theme Tokens & Component Library — turn the `context/designs/devprep-design.pen` UI design into a working frontend foundation: typed mock data, the dark/light theme token system, and the 18 reusable atom/molecule components, in that order. Full page assembly and Prisma/DB wiring are out of scope for this feature.

## Status
<!-- Not Started | In Progress | Completed -->

In Progress

## Goals
<!-- Goals and requirements -->

- Mock data: `src/types/*.ts` shapes mirroring the Prisma models in `project-overview.md`, plus `src/lib/mock-data/*.ts` fixtures matching the content already visible in the design (user, skill taxonomy, experience, CVs, job posts, a comparison).
- Theme tokens: install `next-themes`, wire a `ThemeProvider` (dark default), load Inter, and define the 16 color tokens + radii from the `.pen` file's variables in `globals.css` via Tailwind v4's `@theme`.
- Component library: init shadcn/ui, add `lucide-react`, and build the 18 reusable components (buttons, badges, chips, inputs, card, stat tile, list row, empty state, panel shell, segmented control, page header, sidebar, topbar, toast, pro-lock badge) styled from the new tokens.
- Reconcile `project-overview.md`'s stale CV template naming (`Minimal/Classic/Modern`, `NO_IMAGE/IMAGE_PLACEHOLDER`) and skill-taxonomy counts with what the design actually shows (`Aurora/Slate/Mono` × `Single/Two Column`; 6/5/8/4/3 skills per category).

## Notes
<!-- Any extra notes -->

- Next.js 16 / React 19, Turbopack is the default for `dev` and `build`.
- Per `AGENTS.md`: this is a modified Next.js — consult `node_modules/next/dist/docs/` before writing framework code.
- Design source of truth: `context/designs/devprep-design.pen` (read only via the Pencil MCP tools — never Read/Grep directly, it's encrypted). The `context/designs/*.md` prompt docs (added in commit `fc8c37e`) are what generated it.
- The exported CV document itself (`CV Paper` in the CV Editor design) stays hardcoded light/print-styled regardless of app theme — do not theme it with the new tokens.
- No Prisma/database work in this feature — mock data is plain TypeScript fixtures, not a seed script.

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-07-24** — Bootstrapped the project with `npx create-next-app@latest --src-dir` (Next.js 16.2.11, React 19.2.4, TypeScript, Tailwind CSS v4, App Router). _(commit `6f72a7d` — "Initial commit from Create Next App")_
- **2026-07-24** — Cleaned the boilerplate: removed unused SVG assets from `public/`, stripped `src/app/globals.css` down to `@import "tailwindcss";`, and reduced `layout.tsx` / `page.tsx` to a minimal DevPrep starting point. _(commit `e525617`)_
- **2026-07-24** — Added `LICENSE` (GNU GPL v3). _(commit `f9c65c0`)_
- **2026-07-24** — Added the `context/` planning docs: `project-overview.md`, `architecture-notes.md`, `coding-standards.md`, and this feature doc. _(commit `89917f0`)_
- **2026-07-24** — Reformatted `project-overview.md` doc structure (TOC, ER diagram with attributes, full Prisma schema, seed data, architecture/pricing diagrams, project structure, next steps). _(commit `b31b338`)_
- **2026-07-24** — Filled in this feature doc's goals/notes for the initialization work. _(commit `9e68c20`)_
- **2026-07-27** — Added VS Code color customization settings and a minor `ai-interaction.md` update. _(commit `2d12269`)_
- **2026-07-28** — Added `context/designs/*.md` design prompt docs (per-screen UI/UX specs used to generate the `.pen` file) and updated `project-overview.md` to add Projects as a primary content source alongside Experience. _(commit `fc8c37e`)_
- **2026-07-28** — Marked Project Initialization & Setup complete; the Next.js foundation and context docs are in place. Started this feature (mock data → theme tokens → component library) based on the newly-added `context/designs/devprep-design.pen` UI design.
- **2026-07-28** — Implemented all three phases: (1) `src/types/*.ts` + `src/lib/mock-data/*.ts` fixtures matching the design 1:1 (verified Skill Bank category counts 6/5/8/4/3 against the design's tab badges); (2) `next-themes` + Tailwind v4 `@theme` tokens in `globals.css`, Inter via `next/font`; (3) shadcn/ui initialized (Nova/Radix/Lucide preset) and bridged onto the DevPrep tokens, plus the 18 reusable atoms/molecules from the design (`src/components/shared/`, `src/components/layout/`). Also reconciled `project-overview.md`'s stale CV template naming and skill-taxonomy counts to match the design. Verified via a scratch preview page in the browser (computed-style checks confirmed exact token matches in both dark and light themes, then removed); `lint` and `build` both pass. Noted rough edge: `next-themes`' hydration-guard `<script>` tag triggers a harmless React 19 dev console warning ("Encountered a script tag...") on every page — functionality is unaffected (verified theme toggling works correctly); revisit if `next-themes` ships a fix.
