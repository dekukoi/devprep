# DevPrep Design Prompts

This folder holds one file per screen, each written as a ready-to-paste **Pencil prompt** to take that frame from first-pass mockup to a finished, end-to-end design — every state (empty/loading/populated/error), every interactive element, and every follow-on action a user can take.

These come from the screen audit done after the first Pencil pass (see git history / conversation for the full brainstorm); this folder distills that into action.

## How to use

1. Read `00-general.md` first — rules every screen must follow (only paste this in if Pencil seems to have lost the thread on tokens/patterns; otherwise it's just a reference).
2. Open a screen's file, copy the **Pencil Prompt** block, paste it into Pencil against that screen's existing frame.
3. Check off items in that file's todo list as Pencil finishes them; note anything that needs a follow-up prompt.
4. Once all 7 screens are finished end-to-end in Pencil, move to implementation (Prisma schema → Skill Bank CRUD, per `context/current-feature.md`).

## Files

| File | Frame(s) in Pencil |
|---|---|
| `00-general.md` | Cross-cutting rules (not a standalone frame) |
| `01-app-shell.md` | `Sidebar`, `Topbar` |
| `02-dashboard.md` | `Screen — Dashboard` |
| `03-skill-bank.md` | `Screen — Skill Bank` |
| `04-job-posts.md` | `Screen — Job Posts` |
| `05-comparison-report.md` | `Screen — Comparison Report` |
| `06-cv-template-picker.md` | `Screen — CV Template Picker` |
| `07-cv-editor.md` | `Screen — CV Editor` |
| `08-experience-bank.md` | none yet — new frame |
| `09-projects-bank.md` | none yet — new frame |
| `10-certifications.md` | none yet — new frame |
| `11-cv-curate-content.md` | none yet — new frame, sits between `06` and `07` |

Files `01`–`07` ask Pencil to *finish* an existing mocked frame. Files `08`–`11` ask Pencil to *design from scratch* — these came out of a follow-up discussion (see the plan doc referenced below) that found CVs were spec'd to pull content from the Skill Bank, but the Skill Bank has no narrative content (just proficiency ratings) — the real content lives in Experience and a new `Project` entity, neither of which had a screen yet. `context/project-overview.md`'s data model and Feature A/B text were updated to match (added a `Project` model, corrected how CV generation is described).

Some other new screens were also identified as missing during the audit (Settings, full Comparisons list, full CVs list, Add Job Post modal, Import CV flow) but don't have prompt files yet — see the full gap list in the plan doc.
