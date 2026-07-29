# Designing with Pencil (.pen) — AI Interaction Guidelines

`context/designs/devprep-design.pen` is the **single source of truth** for every screen, panel, and reusable
component's visuals (colors, spacing, type, icons, states). It is the reference for *all* UI work in this
project, not just for building new frames — use it when converting a design to React components, when
extending an already-implemented screen, and when reviewing whether an implementation still matches the design.

`.pen` files are encrypted — **never** `Read` or `Grep` them directly. Only the `pencil` MCP tools can access
them (`get_editor_state`, `batch_get`, `get_variables`, `get_screenshot`, `snapshot_layout`, etc.).

## Reading and updating `current-feature.md` is mandatory, every time

Screens get built incrementally across many separate conversations — **never assume a screen is being built from
a blank slate, and never try to build every screen from the `.pen` file in one conversation.** Before writing any
code:

1. Read `context/current-feature.md`, especially the **History** section — it records what was already built,
   in which files, and any rough edges or deferred pieces from prior sessions.
2. Skim the actual codebase for related, already-built pieces (`src/components/shared/`, `src/components/layout/`,
   `src/components/ui/`, and any feature folder matching the screen you're about to touch) — reuse and extend
   existing components rather than creating near-duplicates. If a `PageHeader`, `EmptyState`, `ListRow`, etc.
   already exists and fits, use it instead of hand-rolling another version.
3. **Only build what was explicitly asked for in this conversation.** Seeing other unbuilt frames in the `.pen`
   file while you're in there is not an invitation to build them too — flag them in the end-of-turn summary
   (see below) instead, and let the user decide when to tackle them.
4. When you finish, **update `context/current-feature.md`** the same way prior sessions did (Status, History
   entry with file paths and what's still deferred) so the *next* conversation's step 1 actually has something
   accurate to read. Treat this as a required part of the task, not an optional wrap-up.

## Workflow for "build Screen — XYZ"

1. **Locate the frame(s).** Check `context/designs/README.md` for the file-to-frame mapping, then read the
   matching `context/designs/NN-*.md` prompt doc if one exists — it documents the intended end-to-end user
   flow, edge cases (empty/loading/error/populated), and any notes from the design discussion that the `.pen`
   file alone won't show.
2. **Pull the full frame tree.** Use `batch_get` with the frame's node ID(s) and enough `readDepth` to see every
   descendant (colors, text content, icon names, spacing, layout) — shallow reads miss detail that matters for
   fidelity. Also fetch the **reusable components** (`reusable: true`) the frame instances, since those carry
   the canonical styling.
3. **Pull every finished state variant**, not just the primary populated frame. Per `context/designs/00-general.md`,
   each list/table/panel should have Empty / Loading / Error / Populated states, plus any interaction-specific
   frames (dropdowns, drawers, modals) — these usually exist as separate sibling frames named
   `Screen — XYZ — <State>` or similar. Search by name pattern (e.g. `{name: "XYZ"}` in `batch_get`) to find
   them all before writing code, so nothing gets missed or invented from scratch.
4. **Match exactly, don't reinterpret.** Use the design's literal color/spacing/font-size values — reuse the
   Tailwind tokens already wired in `src/app/globals.css` (`bg-bg-surface`, `text-text-muted`, `--radius-*`,
   `sev-*`, etc.) since they map 1:1 to the `.pen` file's variables. When the design uses a non-Tailwind-scale
   number (e.g. `13px` text, `18px` icon), use an arbitrary value (`text-[13px]`) rather than rounding to the
   nearest Tailwind step.
5. **Implement, then verify in the browser** per the existing `<preview_tools>` workflow — click through every
   state you built, not just the happy path.
6. **Report back** — see below.

## After finishing a "Screen — XYZ" build

Always close out with a bullet-point summary of exactly which `.pen` frames were implemented, mapped to the
component/file that implements them. Example shape:

- `Screen — Job Posts` (populated) → `src/components/job-posts/JobPostList.tsx`
- `Job Posts — Empty` → same component, `items.length === 0` branch
- `Add Job Post Modal` → `src/components/job-posts/AddJobPostModal.tsx`

Call out any frame from the `.pen` file or the prompt doc's flow that was **not** built (e.g. deferred, or the
frame doesn't exist yet in Pencil) so it's visible what's left rather than silently skipped.

## Other guidelines picked up building the App Shell

- **Don't pass icon/component references as props from a Server Component into a Client Component** — Next.js's
  RSC serialization rejects functions, which breaks the build (not just a runtime warning). When a server
  component (e.g. `page.tsx`) needs to hand a client component data that includes "which icon", pass a string
  key (matching the `.pen` file's own Lucide icon names, e.g. `"file-text"`, `"trending-up"`) and resolve it to
  the actual component via a small registry (see `src/lib/constants/icons.ts`) inside the client component.
- **Avoid `setState` synchronously inside `useEffect` on mount** — this repo's ESLint config
  (`react-hooks/set-state-in-effect`) treats it as an error, not a style nit. For state that mirrors an external
  source (`matchMedia`, `localStorage`, any browser API), use `useSyncExternalStore` instead — it's also the
  more correct tool for this exact case (SSR-safe via `getServerSnapshot`, no extra render needed).
- **No `shadcn` CLI access offline** — when a needed primitive (`popover`, `dropdown-menu`, etc.) doesn't exist
  yet in `src/components/ui/`, hand-write it as a thin wrapper around the matching `radix-ui` export, following
  the existing pattern in `src/components/ui/tooltip.tsx` (same prop-forwarding style, same `data-slot` and
  `cn()` conventions).
- **Screenshots may be unavailable** in this environment (Browser pane not displayed to the user) — don't block
  verification on `computer{action:"screenshot"}` succeeding. Fall back to `read_page` (accessibility tree),
  `get_page_text`, and `javascript_tool` (computed styles, `outerHTML`, `localStorage`, etc.) to confirm behavior
  and structure.
- **For controlled Radix `Popover`s anchored without a `Trigger`** (e.g. a search box that opens a dropdown while
  typing), don't assume Escape closes it automatically — wire an explicit `onKeyDown` handler that closes the
  controlled `open` state, and verify Escape-to-close for every dismissible panel per `00-general.md`'s a11y
  rules rather than trusting the default.
