# Projects Bank

Frame: none yet — new frame, design from scratch

## Goal
The second primary CV content source, alongside Experience — covers personal projects, open-source contributions, freelance work, hackathons, or anything spanning multiple roles, plus finer-grained curation within a single job.

## End-to-end user flow
1. "Projects" sits in the same new "Career" sidebar group as Experience and Certifications.
2. Click "+ Add project" → a form: title, description, a repeatable bullets list (same pattern as Experience), optional start/end dates, an optional "Link to an Experience" dropdown (defaults to none/standalone), and a skill multi-select restricted to the taxonomy.
3. A project linked to an Experience appears both in this list and nested under that Experience on the Experience Bank screen.
4. Click an existing project → edit in the same form.
5. Delete a project → confirmation.
6. Filter/sort the list: by linked-experience vs. standalone, by linked skill, by recency.
7. Empty state: "No projects yet — log a side project, open-source contribution, or anything that doesn't fit under one role."

## States & edge cases
- A project with no linked Experience: shown with a "Standalone" tag instead of a company name
- A project with zero linked skills: valid, same low-priority flag as an under-tagged Experience

## Pencil Prompt

> Design a new "Projects Bank" screen from scratch, consistent with the existing DevPrep dark theme and component patterns (rounded cards, purple accent, Lucide icons, right-hand Add/Edit panel like Skill Bank and Experience Bank use). Include: (1) a list/grid of Project cards — title, a "Standalone" tag or the linked Experience's company name, a short description preview, date range if set, and skill chips; (2) an "+ Add project" button opening a right-hand panel with fields: Title, Description, a repeatable bullet-point list editor, optional Start/End date pickers, an optional "Link to an Experience" dropdown (searchable, defaults to "None — standalone"), and a skill multi-select restricted to the taxonomy; (3) filter controls above the list for Standalone vs. Linked, and sort by recency; (4) an empty state ("No projects yet — log a side project, open-source contribution, or anything that doesn't fit under one role" + primary CTA). Add "Projects" as a sidebar item under the same group as Experience.
