# Experience Bank

Frame: none yet — new frame, design from scratch (not an existing Pencil mock)

## Goal
Where a user actually enters work history — this is a primary CV content source (see `context/project-overview.md` Feature B), not just data entry. Company, title, dates, and accomplishment bullets live here.

## End-to-end user flow
1. A new sidebar group (e.g. "Career") holds Experience, Projects, and Certifications — alongside the existing Skill Bank / Job Posts / CVs groups.
2. Click "+ Add experience" → a form: company, title, start date, an "I currently work here" toggle (sets end date to null), and a repeatable bullets list (add/remove/reorder lines).
3. Link one or more skills used in this role via a multi-select restricted to the seeded taxonomy — this populates the Skill↔Experience relation that the Skill Bank's "Used in" chips and computed years/recency (per the interaction-audit plan) depend on.
4. Click an existing entry → edit in the same form, pre-filled.
5. See any Projects already linked to this role as a nested chip list beneath it, with a "+ Add project for this role" shortcut that opens the Projects Bank pre-filled with this Experience selected.
6. Delete an entry → confirmation (warns if Projects are linked to it, since deleting nulls out their link rather than deleting them).
7. Empty state for a new account: "No work history yet — add your first role" — this blocks meaningful CV generation, so it should feel like a required early step, not an optional one.

## States & edge cases
- A role with zero linked skills: still valid, just won't surface well in job-post skill-matching later
- A role with zero bullets: valid but flagged lightly (e.g. "Add at least one bullet to use this in a CV")

## Pencil Prompt

> Design a new "Experience Bank" screen from scratch, consistent with the existing DevPrep dark theme, sidebar layout, and component styling already established in the other screens (rounded cards, purple accent, Lucide icons). Include: (1) a list view of Experience entries as cards — company, title, date range (or "Present" for current roles), a preview of 1-2 bullets, and small skill chips for linked skills; (2) an "+ Add experience" button opening a right-hand panel (matching the Skill Bank's Add/Edit panel pattern) with fields: Company, Title, Start date, an "I currently work here" toggle that disables the end date, and a repeatable bullet-point list editor (add/remove/reorder lines); (3) a skill-linking multi-select in that same panel, restricted to the taxonomy, styled like chips/tags; (4) beneath each Experience card in the list, a small nested row showing any linked Projects as chips, with a "+ Add project" shortcut; (5) an empty state ("No work history yet — add your first role" + primary CTA) for new accounts. Add "Experience" as a new sidebar group alongside Skill Bank/Job Posts/CVs.
