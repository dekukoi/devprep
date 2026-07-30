# Dashboard Data Spec

## Overview

Replace the direct mock reads in `src/app/page.tsx` (the dashboard root — `cvs`,
`cvVersions`, `dashboardStats`, `jobPosts` imported straight from `@/lib/mock-data`,
plus calls into the now-real `getComparisonsListData`/`getNewComparisonJobPosts`/
`getComparisonIdByJobId` from spec 06) with a single assembling query layer. Keep
the screen identical — stat tiles, Recent Comparisons cards, My CVs rows, New
Comparison modal, onboarding checklist. Data-source swap only.

This is the capstone read chunk: it assembles specs 01–08 (Skill Bank counts for
stats, spec 06's Comparisons, spec 07/08's CVs) into one screen, the same role
`stats-sidebar-spec.md` played for DevStash tying together `collections.ts` +
`items.ts`. Do this only after those land.

Do not touch Rename/Duplicate/Delete CV, Run Comparison, or the New Comparison
modal's run flow — `DashboardView.tsx`'s mutations stay local `useState` until the
mutation wave.

## Requirements

- Create `src/lib/db/dashboard.ts` exporting `getDashboardStats(): Promise<DashboardStats>`
  and `getDashboardCvs(): Promise<DashboardCvItem[]>` (or fold both into the page
  directly if that reads cleaner — this chunk has less pre-existing join-file
  structure to preserve than others, since `dashboardStats` was always a flat mock
  object with no join file of its own).
  - **`DashboardStats` — compute live, don't seed as a table** (per
    `context/features/seed-spec.md`'s explicit Non-Goal: "not a real entity...
    numbers don't even reconcile with the other mock arrays' real counts... should
    compute these live from seeded rows, never seeded as a standalone table").
    Concretely: skill count (`prisma.skillBankEntry.count({ where: { userId } })`),
    CV count (`prisma.cV.count({ where: { userId } })`), job post count
    (`prisma.jobPost.count({ where: { userId } })`), average fit score
    (`prisma.comparison.aggregate({ where: { userId }, _avg: { fitScore: true } })`)
    — match whichever fields the existing `DashboardStats` type
    (`src/lib/mock-data/dashboard.ts`) actually declares; if any field has no
    obvious live equivalent (the mock's numbers were already known not to
    reconcile), decide its real computation here rather than carrying over a
    hardcoded placeholder.
  - `dashboardCvs` — port the existing inline mapping in `page.tsx` (title, role
    from `title.split(" - ")[0]`, `targetCompany` from the linked job post,
    `version` from the CV's latest `CVVersion.versionNumber`, `editedRelative` via
    `formatRelativeDate`, `isStale` from `staleFields.length > 0`) to query
    `prisma.cV.findMany({ where: { userId }, include: { jobPost: true, versions: { orderBy: { versionNumber: "desc" }, take: 1 } } })`
    instead of the mock `cvs`/`cvVersions`/`jobPosts` arrays.
- Import `getCurrentUserId` from `src/lib/db/current-user.ts`.
- Update `src/app/page.tsx` to await these alongside the already-real
  `getComparisonsListData()`/`getNewComparisonJobPosts()`/`getComparisonIdByJobId()`
  calls from spec 06.

## Non-Goals

- No changes to `DashboardStatCard`, `RecentComparisonsSection`, `MyCvsSection`,
  `NewComparisonModal`, `OnboardingChecklist` — purely presentational, already take
  props.
- No changes to the onboarding checklist's completion-detection logic beyond
  whatever naturally follows from real counts being non-zero (it already reads off
  counts/lengths, not a special mock flag).

## References

- `src/app/page.tsx` — the direct mock-data bypass being replaced.
- `src/lib/mock-data/dashboard.ts` — the current flat `DashboardStats` type/mock
  object, for the exact field list to reproduce with live queries.
- `context/features/seed-spec.md`'s Non-Goals section — the explicit rationale for
  computing stats live rather than seeding a stats table.

## Verification

- `/` shows real stat tiles matching `npm run db:test`'s counts, real Recent
  Comparisons cards (from spec 06), real My CVs rows (correct version numbers,
  stale badge on `cv-acme` only) — full-account and per-section empty states still
  reachable (temporarily zero the query results, then revert, per the pattern the
  original Dashboard feature already used).
- New Comparison modal's job-post list and Recent Comparison cards' click-through
  still resolve to the correct real comparison report.
- `npm run lint` / `npm run build` pass.
