# CV Template Picker

Frame: `Screen — CV Template Picker`

## Goal
Choosing a layout — reached both when creating a brand-new CV and when re-templating an existing one — without losing content in the second case.

## End-to-end user flow
1. Reach this screen either (a) fresh, after picking a job post to tailor a CV for, or (b) via "Change template" on an existing CV's "..." menu from the Dashboard.
2. Filter by design (All / Modern / Classic / Minimal) — filtering only, not sorting.
3. Click a template card to preview it larger before committing (current cards are small).
4. Click "Use template" → in flow (a), a new CV draft is created with that template and opens in the CV Editor. In flow (b), the existing CV's content is re-flowed into the new layout (never a silent full reset) and returns to the Editor.
5. See the currently-selected/current template marked with a "Selected" state and checkmark in both entry-point flows.
6. On templates 2–6 (everything but Minimal/no-image), see a Pro lock badge and "Upgrade to Pro" tooltip — cards stay clickable/usable during development per the current dev-access rules.

## States & edge cases
- Flow (b) re-templating: if the new layout can't fit all existing content cleanly, surface that before committing, don't just silently truncate

## Pencil Prompt

> On the `Screen — CV Template Picker` frame, finish these end-to-end: (1) add a lock icon + "Upgrade to Pro" tooltip badge to the 5 templates other than the Minimal/no-image one, while keeping every card visually clickable; (2) add a larger preview state — clicking a card (not the "Use template" button) opens an enlarged preview overlay of that layout before committing; (3) confirm/design the "Selected" checkmark treatment works identically whether this screen was reached from a fresh CV-creation flow or from an existing CV's "Change template" action; (4) for the re-template case, design a brief confirmation state before applying ("Your content will be re-arranged into this layout") rather than an instant silent swap. Keep the existing card grid, filter tabs, and dark theme unchanged.
