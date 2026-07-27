# CV Curate Content (new step)

Frame: none yet — new frame, sits between the CV Template Picker (`06-cv-template-picker.md`) and the CV Editor (`07-cv-editor.md`)

## Goal
The step that actually answers "what goes in this CV" — replaces the assumption that a CV is generated straight from the Skill Bank. Instead, it's generated from whichever Experience/Project entries the user picks, ranked by relevance to the target job post.

## End-to-end user flow
1. Reached right after picking a template (or immediately after clicking "Generate CV for this role" from the Comparison Report — template choice can happen before or after this step; recommend after template so the preview already looks like the final CV).
2. Two ranked lists appear: **Experience** entries and **Project** entries, each sorted by how many of the target job post's required skills they match (highest first) — a small match indicator per item (e.g. "4/5 required skills matched").
3. The top matches are pre-checked by default (e.g. enough to fill a reasonable one-page CV); the user can check/uncheck any entry.
4. A running count updates live ("3 experiences, 2 projects selected").
5. Click "Generate draft" → the CV Editor opens with `draftContent` populated from the checked entries' bullets, ordered by relevance to the job post.
6. If the account has zero Experience and zero Project entries: block this step with a message directing the user to the Experience Bank / Projects Bank first — there's nothing to curate yet.

## States & edge cases
- A job post with very few required skills (so most entries "match" equally): fall back to recency as the secondary sort
- User unchecks everything: "Generate draft" stays disabled until at least one entry is selected

## Pencil Prompt

> Design a new "Curate CV Content" screen from scratch, consistent with the existing DevPrep dark theme and component patterns. Include: (1) a header stating which job post this CV is being tailored for (e.g. "Curating content for: Senior Backend Engineer — Acme App"); (2) two side-by-side or stacked sections, "Experience" and "Projects," each listing candidate entries as checkable rows/cards — company/title or project title, a small match badge like "4/5 required skills matched" (color it like the existing fit-score/severity palette), and a checkbox, pre-checked for the top matches; (3) a persistent summary bar showing "X experiences, Y projects selected" and a primary "Generate draft" button, disabled when nothing is selected; (4) an empty/blocked state for accounts with zero Experience and zero Project entries, directing the user to add those first with links to the Experience Bank and Projects Bank screens.
