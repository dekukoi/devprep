# Skill Bank

Frame: `Screen — Skill Bank`

## Goal
The single source of truth for a user's skills. Must keep matching exact (closed taxonomy) while still letting a user express nuance about how/where they used a skill.

## End-to-end user flow
1. Click a category tab (Languages, Frameworks, Tools, Soft Skills, Domain Knowledge) → table filters to that category; tab shows a live count badge.
2. Click "+ Add skill" → the right-hand panel opens for a new entry.
3. In the Add/Edit panel, pick a skill from a **searchable dropdown restricted to the seeded taxonomy** for the selected category (not free text — this keeps job-post matching exact).
4. Pick a proficiency level and optional years of experience, then Save → the entry appears in the table and the category count updates immediately.
5. Click an existing row → the right-hand panel opens pre-filled for editing that entry.
6. On an entry that's linked to one or more Experience records, see a read-only **"Used in"** chip list (e.g. "Backend Engineer — Lumen Systems", "Contractor — Corebit") pulled from the existing Skill↔Experience relation — this is how "TypeScript for frontend vs. backend" nuance gets expressed, instead of a free-text tag/notes field.
7. Click delete on a row → confirmation dialog → entry removed, count updates.
8. Sort the table by proficiency, years, or last-used; type in a search box to filter within the active category.
9. On an empty account, see a prominent "Import from existing CV" call to action that starts the CV-parsing bootstrap flow (a new flow, not yet designed).
10. Approaching the free-tier cap of 30 entries, see a progress indicator (e.g. "27/30"); at the cap, "+ Add skill" shows a lock badge and an upgrade prompt instead of opening the panel.

## States & edge cases
- A category with zero entries: empty table state + "+ Add skill" CTA, no import prompt (that's account-level, not category-level)
- An entry with no linked Experience: "Used in" section simply doesn't render (not an empty state — just absent)

## Pencil Prompt

> On the `Screen — Skill Bank` frame, finish these end-to-end: (1) change the Add/Edit panel's "Skill name" field from a free-text input to a searchable combobox/dropdown, populated only with the seeded skills for the currently selected category — show it with a dropdown open showing 4-5 matching options; (2) remove the "Tags" and "Notes" fields from that panel entirely; (3) in their place, add a read-only "Used in" section showing 1-2 small chips/rows referencing linked Experience entries (e.g. company + title), for an entry that has them — and confirm the panel simply omits that section when an entry has none; (4) add table sort controls (Proficiency, Years, Last used) and a search input above the table; (5) design the empty-category table state ("No skills added in this category yet" + "+ Add skill"); (6) design an account-level empty state (zero total entries) with a prominent "Import from existing CV" primary action distinct from "+ Add skill"; (7) add a small usage indicator near "+ Add skill" showing entries used vs. the free-tier cap (e.g. "27/30"), and a locked/upgrade variant of that button once at the cap. Keep the existing dark theme, proficiency-bar styling, and category icon set unchanged.
