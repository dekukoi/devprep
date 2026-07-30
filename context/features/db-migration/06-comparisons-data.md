# Comparisons Data Spec

## Overview

Replace the mock data behind both the Comparisons List screen
(`src/lib/comparisons-list-data.ts`) and the Comparison Report screen
(`src/lib/comparison-report-data.ts`) with real queries against `Comparison`
(joined to `JobPost`). One join file covers both, same precedent DevStash used by
not splitting list vs. detail for collections — it's the same underlying entity.
Keep both screens identical — list search/sort/fit-badge/top-gap-chip, report's
score ring, Met/Below/Missing tiles, gap panel, advice column, re-run trend pill.
Data-source swap only.

Depends on specs 01 (Skill Bank) and 05 (Job Posts) — comparison gaps are computed
against real `SkillBankEntry` rows and real `JobPost`/`JobPostRequirement` rows.

Do not touch "Re-run comparison" — `ComparisonReportView.tsx`'s re-run still
fabricates a local, non-persisted `Comparison` object via `setTimeout` until the
mutation wave (that's also where a *real* re-run — actually recomputing gaps
against live Skill Bank data and persisting a new `Comparison` row — belongs, not
here).

## Requirements

- Create `src/lib/db/comparisons.ts` exporting:
  - `getComparisonsListData(): Promise<ComparisonListItem[]>` — same shape as
    today. `prisma.comparison.findMany({ where: { userId }, include: { jobPost: true }, orderBy: { createdAt: "desc" } })`.
    `gaps` is stored as `Json` on the `Comparison` row (already computed correctly
    at seed time per `context/features/seed-spec.md` — no live recompute needed
    for a simple list read); parse/cast it back to `ComparisonGap[]` to find
    `topGapLabel` the same way the mock version does (`gaps.find(g => g.severity !== "met") ?? gaps[0] ?? null`).
  - `getNewComparisonJobPosts(): Promise<NewComparisonJobPost[]>` —
    `prisma.jobPost.findMany({ where: { userId } })`, mapped to `{ id, company: company ?? title, role: title }`.
  - `getComparisonIdByJobId(): Promise<Record<string, string>>` —
    `prisma.comparison.findMany({ where: { userId }, select: { id: true, jobPostId: true } })`,
    reduced into the same `Record<jobPostId, comparisonId>` shape. Note: unlike the
    mock version (one comparison per job post), the real schema allows multiple
    `Comparison` rows per `JobPost` (history) — pick the most recent per job post
    (`orderBy: { createdAt: "desc" }`, keep first occurrence per `jobPostId`) so
    this stays a 1:1 map like today's contract.
  - `getComparisonReportData(comparisonId): Promise<ComparisonReportData | null>` —
    same shape as today (`job: JobPost`, `history: Comparison[]`).
    `prisma.comparison.findUnique({ where: { id: comparisonId, userId } })` to get
    the target comparison and its `jobPostId`, then `prisma.jobPost.findUnique(...)`
    for `job` and `prisma.comparison.findMany({ where: { jobPostId, userId }, orderBy: { createdAt: "asc" } })`
    for `history`. Return `null` if either lookup misses (matches today's
    `notFound()`-driving contract in `comparisons/[id]/page.tsx`).
  - **Extract the gap-severity-computation helper** (`LEVEL_RANK` map +
    `computeSeverity`) out of `prisma/seed.ts` into a shared, importable location
    (e.g. `src/lib/comparison-gaps.ts`) so both `seed.ts` and any future real
    "re-run" Server Action (Wave 2) call the same logic instead of two forks. Not
    strictly required for this spec's own reads (seeded `gaps` JSON is already
    correct), but flag it now since spec 06 is the natural place to notice the
    duplication risk before Wave 2 needs the same computation for a real re-run.
- Import `getCurrentUserId` from `src/lib/db/current-user.ts`.
- Update `src/app/page.tsx` (dashboard, partial — see spec 09), `src/app/comparisons/page.tsx`,
  and `src/app/comparisons/[id]/page.tsx` to await these functions from the new
  file instead of the mock-backed ones.

## Non-Goals

- No real re-run/recompute logic yet — `ComparisonReportView`'s re-run stays a
  local fabricated object until Wave 2.
- No changes to `AdviceColumn`'s rule-based copy generation (`src/lib/comparison-advice.ts`'s
  `buildAdviceItems`) — it already operates on a `gaps` array regardless of where
  that array came from, so it needs zero changes.

## References

- `src/lib/comparisons-list-data.ts`, `src/lib/comparison-report-data.ts` — the two
  mock-backed files being merged/replaced.
- `prisma/seed.ts` (around `LEVEL_RANK`/`computeSeverity`, lines ~35–53) — the
  gap-recompute logic to extract into a shared helper.
- `context/features/seed-spec.md` — confirms 6 seeded `Comparison` rows (one per
  job post, `fitScore` 79/64/91/43/73/88 for Acme/Globex/Initech/Umbrella/Stark/
  Wayne) with `gaps` computed fresh against live seeded Skill Bank data, not copied
  verbatim from mock JSON.

## Verification

- `/comparisons` list shows all 6 real comparisons, sorted/searchable, matching
  `npm run db:test`'s fit scores.
- `/comparisons/[id]` for each of the 6 shows the correct score ring, tier copy,
  Met/Below/Missing tiles, and gap panel contents against real `gaps` JSON; history
  array has exactly one entry per job post (no synthetic re-run rows yet since
  Wave 1 doesn't persist re-runs).
- Dashboard's Recent Comparisons cards and New Comparison modal's job-post list
  still populate correctly (cross-check against spec 09 once that lands, but this
  spec's exports should already work with the current dashboard page.tsx).
- `npm run lint` / `npm run build` pass.
