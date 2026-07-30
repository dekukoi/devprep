# CV Templates Data Spec

## Overview

Replace the direct mock reads in `src/app/cvs/templates/page.tsx` (`cvs`,
`cvTemplates` imported straight from `@/lib/mock-data` — there's no dedicated join
file today) with real queries against `CVTemplate` (system-wide, 6 seeded rows) and
the single `CV` row being re-templated, if any. Keep the screen identical — filter
chips (All/Modern/Classic/Minimal), template cards, enlarged preview modal,
retemplate confirm dialog. Data-source swap only.

Small, low-risk, independent of specs 02–06 — the only cross-entity read is looking
up one `CV` by id when arriving in re-template mode (`?cvId=`).

Do not touch "Apply template"/"Continue" (retemplate confirm) — still local state
until the mutation wave; applying a template doesn't persist anywhere yet in Wave 1
either way (the mock version never did).

## Requirements

- Create `src/lib/db/cv-templates.ts` exporting `getCvTemplates(): Promise<CVTemplate[]>` —
  `prisma.cVTemplate.findMany()`, all 6 rows, system-wide (not user-scoped).
- In `src/app/cvs/templates/page.tsx`, replace the direct `cvTemplates` import with
  `await getCvTemplates()`, and replace the direct `cvs.find(...)` lookup (for the
  `?cvId=` re-template flow) with `prisma.cV.findUnique({ where: { id: cvId, userId } })`
  scoped via `getCurrentUserId()` — inline in the page, or add a one-off
  `getCvSummary(id)` helper to `src/lib/db/cvs.ts` if spec 08 has already landed by
  the time this is implemented (check build order; if 07 lands first, keep the
  lookup here and let spec 08 absorb it later without re-litigating this spec).

## Non-Goals

- No changes to `TemplateCard`, `CvPreviewThumbnail`, `TemplatePreviewModal`,
  `RetemplateConfirmDialog` — purely presentational, already take props.
- No persistence of the applied template selection — that's Wave 2 (needs a real
  `CV.templateId` update, which doesn't exist as a mutation path yet regardless of
  data source).

## References

- `src/app/cvs/templates/page.tsx` — the direct mock-data bypass being replaced (no
  existing join file to reference here, unlike every other spec in this folder).
- `src/lib/constants/cv-templates.ts` — `TEMPLATE_FAMILY`/`TEMPLATE_VARIANT_LABEL`
  maps used for the filter chips; unaffected by this spec (pure lookup tables keyed
  by template `name`, not DB-backed).

## Verification

- `/cvs/templates` (fresh-creation mode, no `cvId`) shows all 6 real `CVTemplate`
  rows with correct filter-chip counts.
- `/cvs/templates?cvId=<a real seeded CV id>` (re-template mode) shows the correct
  CV title/current-template "Selected" badge sourced from a real `CV` row.
- `npm run lint` / `npm run build` pass.
