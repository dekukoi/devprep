# General Design Rules (apply to every screen)

These aren't a standalone frame — they're the shared rules every per-screen prompt in this folder assumes. Repeat the relevant bullets inline in a Pencil prompt if a single-screen session needs reminding.

## States every list/table/panel needs
- **Empty** — first-run/zero-data state with a short explanatory line + a primary CTA (e.g. "No job posts yet — paste your first one")
- **Loading** — skeleton placeholders matching the eventual layout, not a spinner
- **Error** — inline message + retry action, never a silent failure
- **Populated** — the normal case already mocked

## Feedback
- Toast notifications for: save, delete, comparison run completed, export ready, skill-bank sync, error
- 150–200ms transitions on state changes (panel open/close, accept/reject, hover)

## Pro gating (visual only for now — everything stays clickable during development)
- Lock icon + "Upgrade to Pro" tooltip/CTA on: CV templates 2–6, Skill Bank entries beyond 30, job posts/comparisons beyond 5, all AI features
- Same lock-badge visual treatment everywhere it appears — don't invent a new pattern per screen

## Accessibility
- Visible focus ring on every interactive element
- Escape closes any open panel/modal/drawer
- Logical tab order through forms

## Responsive
- Sidebar becomes a drawer below 1024px, triggered by a hamburger icon in the Topbar (currently missing — needs to be added)
- Mobile: stacked cards, CV Editor goes full-screen

## Design tokens (already defined — reuse exactly, don't reinterpret)
- Gap severity: Missing `#ef4444` (red) · Below required `#f59e0b` (amber) · Met `#10b981` (green) · Stale `#eab308` (yellow)
- Skill category icons (Lucide): Languages `Code2` · Frameworks `Boxes` · Tools `Wrench` · Soft Skills `MessageSquare` · Domain Knowledge `BookOpen`
- These two token sets must look identical wherever they recur across screens (sidebar, Skill Bank table, Job Post requirement chips, Comparison Report, CV Editor stale markers)
