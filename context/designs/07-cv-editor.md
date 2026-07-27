# CV Editor

Frame: `Screen — CV Editor`

## Goal
The most involved screen in the product — editing, accepting AI/gap-based suggestions, and versioning a CV, ending in an exported document sent to an employer.

## End-to-end user flow
1. Open a CV here (from Dashboard, Comparison Report's "Generate CV," or Template Picker).
2. Edit fields directly inline (confirm this is contentEditable-style editing on the document itself, not a separate structured form).
3. In the Suggestions panel, click Accept or Reject on a suggested change — accepting updates the live draft immediately (visually collapses that suggestion from the panel, counter badge decrements) but does **not** create a new saved version yet.
4. Click a new, explicit **Save** button (distinct from Export PDF) → creates a new immutable `CVVersion` from the current draft state.
5. Click "Export PDF" → if there are unsaved changes, it saves first, then renders and downloads the PDF.
6. Toggle "Stale fields" on/off in the top bar → globally shows/hides the stale-field markers across the whole document.
7. Hover/click a stale-field tooltip → see what changed in the Skill Bank, with a one-click "Sync to Skill Bank" action the user opts into (never automatic).
8. Open Version History → click a past version to see a **read-only preview** of it; click an explicit "Restore" action to copy that version's content into a new version (never silently overwrites the current draft).
9. Click "Tailored to Acme App" → navigate back to that Job Post's detail screen.
10. The Comments tab from the first pass is removed — Suggestions is the only tab; no separate feature there.

## States & edge cases
- No unsaved changes: Save button is disabled/quiet; Export PDF skips the implicit-save step
- Zero pending suggestions: panel shows a quiet "You're all caught up" instead of an empty list
- Skill chip row at the bottom must wrap or scroll fully rather than clip (currently clipped in the mock)

## Pencil Prompt

> On the `Screen — CV Editor` frame, finish these end-to-end: (1) remove the "Comments" tab entirely, leaving "Suggestions" as the only tab; (2) add an explicit "Save" button in the top bar, distinct from "Export PDF" (e.g. next to "Saved just now") — Accept/Reject on a suggestion should only update the live draft, Save is what creates a new version; (3) fix the skill-chip row at the bottom of the document so it wraps onto additional lines or scrolls, instead of getting clipped as it currently is; (4) design the Version History "click a past version" interaction as a read-only preview state with an explicit "Restore" button, rather than instantly swapping content; (5) add a "Sync to Skill Bank" button inside the stale-field tooltip; (6) design an empty/"all caught up" state for the Suggestions panel when there are zero pending suggestions; (7) make the "Tailored to Acme App" label under the CV title a clickable link. Keep the existing document styling, suggestion-card colors, and stale-field yellow treatment unchanged.
