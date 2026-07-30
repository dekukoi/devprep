# CV Editor & Curate Content Data Spec

## Overview

Replace two things with real Prisma queries:

1. The direct mock reads in `src/app/cvs/[id]/edit/page.tsx`'s **existing-CV**
   branch (`cvs`, `cvVersions`, `cvSuggestions`, `cvStaleSkillDetails`, `jobPosts`,
   `skills`, `skillBankEntries` imported straight from `@/lib/mock-data` — no
   dedicated join file today).
2. `src/lib/cv-curate-data.ts`'s `getCvCurateContentData` (the `/cvs/curate`
   ranking screen) and `buildDraftCvContent` (used by the **draft** branch of the
   same `cvs/[id]/edit/page.tsx`, and by the Curate screen's "Generate draft"
   handoff).

One join file, `src/lib/db/cvs.ts`, covers both since they share the same `CV`/
`CVVersion` entities. Keep both screens identical — CV Editor's document view,
Suggestions panel, Version History, stale-skill tooltip; Curate's ranked
Experience/Project columns with pre-checked candidates. Data-source swap only.

Depends on specs 01 (Skill Bank), 02 (Experience), 03 (Projects), 05 (Job Posts),
07 (CV Templates) — this is the most cross-entity chunk in the read wave, which is
why it's sequenced last among the entity-specific chunks, right before the
Dashboard/App Shell capstones.

Do not touch Accept/Reject suggestions, Save, Export, Restore version, inline
`contentEditable` edits, or Curate's checkbox toggles/"Generate draft" — every
`CvEditorView.tsx`/`CvCurateContentView.tsx` mutation stays local state until the
mutation wave. **Important**: this means real `CV`/`CVVersion` rows will not be
created or updated by this spec — reads only, exactly like every other Wave 1
spec — the CV Editor will keep behaving as a local scratchpad on top of real
*initial* data until Wave 2 wires Save/Export to actually persist.

## Requirements

### `getCvForEdit(cvId): Promise<CvEditData | null>` (existing-CV branch)

- `prisma.cV.findUnique({ where: { id: cvId, userId }, include: { versions: { orderBy: { versionNumber: "asc" } }, jobPost: true } })`.
  Return `null` on a miss (matches today's `notFound()` contract).
- Map `versions` (`CVVersion[]`) directly — the schema's `contentHash` and
  `renderedFileUrl` already exist for real (populated at seed time per
  `context/features/seed-spec.md`); `note` also exists as a real column now.
- `jobPostLabel`/`jobPostHref`/`jobPostCompany` — derived the same way as today
  from the included `jobPost` relation (`null` fields when `jobPostId` is null).
- **`suggestions` — flag, don't silently drop.** `CVSuggestion` (the Accept/Reject
  rewrite-suggestion cards) has **no Prisma model** — only `CV.staleFields` exists
  in the schema (confirmed absent from both `project-overview.md`'s ER diagram and
  `context/features/seed-spec.md`'s explicit Non-Goals list, which calls this out
  as intentional: "ephemeral pending-AI-suggestion cards... ok to stay mock-only/
  regenerated at request time once AI features are real"). For this spec, return
  `suggestions: []` for every real CV (matching the already-built "You're all
  caught up" empty state, verified working in the CV Editor feature's own history
  entry) rather than inventing a fake table. Note this explicitly as a deliberate,
  spec'd decision — not a gap this chunk failed to close — since AI features
  (`project-overview.md` Next Steps item 13) are the actual owner of real
  suggestion generation later.
- `staleSkillName`/`staleSkillTooltip` — derive from `CV.staleFields` (real
  `String[]` column) instead of the mock's separate `cvStaleSkillDetails` lookup
  table (which also has no Prisma model, and doesn't need one — `staleFields`
  already stores exactly this). For each field name in `staleFields`, look up the
  matching `SkillBankEntry` (via `skills`/`skillBankEntries` scoped to the user) to
  build the same "Skill Bank currently lists X as {level}" tooltip text the mock
  version builds. If `staleFields` is empty, both are `null`.

### `getCvCurateContentData(jobPostId): Promise<CvCurateData | null>` (Curate screen)

- Port the existing ranking algorithm (`rankCandidates`, `matchSeverity`,
  `recencySortKey` in `src/lib/cv-curate-data.ts`) to run against real data instead
  of mock arrays — the ranking *logic* itself (match-count sort, top-half
  pre-check, severity thresholds) doesn't change, only its inputs:
  - `prisma.jobPostRequirement.findMany({ where: { jobPostId } })` for
    `requiredSkillIds`/`requiredTotal`.
  - `prisma.experience.findMany({ where: { userId }, include: { linkedSkills: true } })`
    and `prisma.project.findMany({ where: { userId }, include: { linkedSkills: true, experience: true } })`
    as the candidate pools, mapping `linkedSkillIds` from each included relation.
- Keep `rankCandidates`/`matchSeverity`/`recencySortKey` as private helpers in the
  new file (or extract to a shared pure-logic module imported by both) — they're
  pure functions with no mock-data dependency already, so this is a straight move.

### `buildDraftCvContent(jobPostId, expIds, projIds): Promise<DraftCvResult | null>`

- Same signature and shape as today. Replace the mock `experiences.find()`/
  `projects.find()`/`skills.find()` lookups with
  `prisma.experience.findMany({ where: { id: { in: expIds }, userId } })` /
  equivalent for projects/skills, preserving the caller-supplied `expIds`/`projIds`
  order (Prisma's `findMany` with `in` doesn't guarantee input order — re-sort the
  results to match `expIds`/`projIds` order after fetching, since the existing
  contract explicitly relies on "the order `expIds`/`projIds` already arrive in").
- Replace `mockUser.name`/`email`/`phone`/`location`/`links` with
  `getCurrentUser()` from `src/lib/db/current-user.ts` (spec 00).

### Wiring

- Import `getCurrentUserId`/`getCurrentUser` from `src/lib/db/current-user.ts`.
- Update `src/app/cvs/[id]/edit/page.tsx` (both branches) and
  `src/app/cvs/curate/page.tsx` to await these functions from
  `src/lib/db/cvs.ts` instead of the mock-backed versions.

## Non-Goals

- No `CVSuggestion` Prisma model added (see above — deliberately out of scope,
  matches `seed-spec.md`'s existing Non-Goals).
- No persistence of a generated draft as a real `CV` row — the `/cvs/draft/edit`
  dead-link gap flagged in this folder's `README.md` stays open until Wave 2.
- No changes to Save/Export/Restore actually writing a new `CVVersion` — still
  local state.

## References

- `src/lib/cv-curate-data.ts` — the mock-backed file being replaced (ranking logic
  to port, not rewrite).
- `src/app/cvs/[id]/edit/page.tsx` — the direct mock-data bypass being replaced.
- `context/features/seed-spec.md` — confirms 3 seeded `CV` rows (`cv-acme` with
  `staleFields: ["skills"]`, `cv-globex`, `cv-initech`) and 7 `CVVersion` rows with
  real `contentHash`/`null renderedFileUrl`/real `note` text; also the source of
  the "no `CVSuggestion` table, ok to stay mock-only" decision this spec continues.
- `context/current-feature.md`'s CV Editor feature history entry — background on
  why `staleFields`/tooltip logic looks the way it does.

## Verification

- `/cvs/[id]/edit` for all 3 real CVs shows correct current-draft version, full
  Version History (real `note` text per row), and `cv-acme` specifically shows the
  stale-skill tooltip sourced from real `SkillBankEntry` data (should reference
  Docker, matching the mock's prior behavior).
- Suggestions panel shows the "You're all caught up" empty state for every real CV
  (expected — `suggestions: []` per this spec's deliberate scope).
- `/cvs/curate?jobPostId=job-acme` shows real ranked candidates (Lumen and Corebit
  Experience rows, Internal Status Page and sqlfmt-go Projects) with correct
  match counts against Acme's real `JobPostRequirement` rows and correct pre-check
  state.
- `npm run lint` / `npm run build` pass.
