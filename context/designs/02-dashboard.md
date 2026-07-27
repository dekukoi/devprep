# Dashboard

Frame: `Screen — Dashboard`

## Goal
Landing screen after login — gives an at-a-glance read on fit across postings and quick access into CVs, and is the jumping-off point for starting a new comparison.

## End-to-end user flow
1. Land on the Dashboard and see stat tiles (Total comparisons, Average fit, CVs, Postings tracked) — clicking a tile navigates to a filtered list view for that metric.
2. Click "+ New comparison" → a flow starts: pick a Job Post (required) → it runs against the current Skill Bank → lands on that comparison's Report screen.
3. Click a Recent Comparison card → go to its Comparison Report.
4. Click "View all" above Recent Comparisons → go to a full **Comparisons list** screen (not yet designed — new frame needed).
5. In My CVs, click the pencil icon on a row → open that CV in the CV Editor.
6. Click the copy icon on a CV row → duplicate that CV (new CV, same content, prompts for a new title).
7. Click "..." on a CV row → a menu opens: Rename, Change template, Export PDF, View versions, Delete (with confirmation).
8. Click "View all" above My CVs → go to a full **CVs list** screen (not yet designed — new frame needed).
9. Click a "Stale field" badge on a CV row → jump directly into that CV in the Editor, scrolled to the stale field.
10. First-run/new account: instead of stat tiles and empty lists, see an onboarding checklist ("Add your skills → Paste a job post → Generate a CV").

## States & edge cases
- Zero comparisons and zero CVs → full onboarding empty state, not just empty cards
- Some comparisons but zero CVs (or vice versa) → each section handles its own empty state independently

## Pencil Prompt

> On the `Screen — Dashboard` frame, finish these end-to-end: (1) make the four stat tiles (Total comparisons, Average fit, CVs, Postings tracked) look clickable (hover state) since they'll link to filtered views; (2) design the "+ New comparison" flow as a modal: a searchable list to pick one Job Post, a primary "Run comparison" button, and a loading state while it calculates; (3) add "..." dropdown menu content for each CV row in My CVs with items: Rename, Change template, Export PDF, View versions, Delete (Delete should show a confirm sub-state); (4) design a first-run/empty-account variant of this whole screen: replace the stat tiles and lists with a 3-step onboarding checklist ("Add your skills", "Paste a job post", "Generate a CV"), each step linking out; (5) design a lightweight loading-skeleton variant of the Recent Comparisons and My CVs sections (card-shaped placeholders, no data). Keep score-ring colors, the stale-field badge styling, and all icons consistent with the existing frame.
