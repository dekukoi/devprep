# Job Posts

Frame: `Screen — Job Posts`

## Goal
Where a user pastes a job description and gets it turned into structured requirements the comparison engine can use — without ever needing to phrase things exactly like the Skill Bank does.

## End-to-end user flow
1. Click "+" in the list header → an "Add Job Post" flow opens (new frame — modal or dedicated page): fields for title, company, and a large paste-in text area for the job description.
2. Submit → the post appears in the list and its detail view opens automatically, showing the pasted text and a **Parsed Requirements** panel the system extracted.
3. The parser matches phrases in the pasted text against the Skill Bank's closed taxonomy using an alias/synonym table (e.g. "ReactJS", "React.js", "React JS" all resolve to the canonical "React") — the user never has to type or paste anything "correctly."
4. Anything the parser detects but can't confidently map to a taxonomy skill shows separately as an **"Unresolved"** item, with actions to either assign it to the closest real skill or dismiss it. Unresolved items never silently count toward a fit score.
5. In the confirmed Parsed Requirements panel, add, remove, or edit a requirement chip directly — adjust its required level and whether it's must-have or nice-to-have.
6. Click "Edit" → edit the raw title/company/description fields (decide whether saving re-triggers a re-parse of requirements).
7. Click "Run comparison" → creates a new Comparison record (never overwrites a prior one — each run is a snapshot) and opens the Comparison Report.
8. Click delete on a job post → confirmation, warns that its comparisons and any CVs tailored to it will also be affected.
9. Sort/filter the list by fit %, date added, or company.
10. On an empty account, see "No job posts yet — paste your first one."

## States & edge cases
- Parser finds zero requirements at all (very short/malformed paste): show a clear "Couldn't detect requirements — add them manually" state instead of an empty panel
- A job post with no comparisons run yet: detail view shows "Run comparison" as the primary action, no fit % badge in the list yet

## Pencil Prompt

> On the `Screen — Job Posts` frame, finish these end-to-end: (1) design a new "Add Job Post" frame/modal reached from the "+" button: title field, company field, and a large paste-in textarea for the job description, with a primary "Add" action; (2) in the existing Parsed Requirements panel, split it into two visual groups: "Confirmed" (the current must-have/nice-to-have chips, now each editable — clicking one reveals inline controls to change required level or must-have/nice-to-have, plus a remove icon) and a new "Unresolved" group below it for phrases the parser couldn't confidently match, each with two small actions ("Assign to skill" opens a taxonomy picker, "Dismiss"); (3) design an empty variant of the whole Parsed Requirements panel for when parsing finds nothing ("Couldn't detect requirements — add them manually" + a manual-add control); (4) add sort/filter controls above the Job Posts list (fit %, date added, company); (5) design the list's zero-state ("No job posts yet — paste your first one" + primary CTA). Keep the existing severity-chip colors, layout split (list + detail), and dark theme consistent.
