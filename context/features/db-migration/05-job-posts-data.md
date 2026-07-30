# Job Posts Data Spec

## Overview

Replace the mock data behind the Job Posts screen (`src/lib/job-posts-data.ts`)
with real queries against `JobPost`, `JobPostRequirement`, and
`UnresolvedRequirement`, plus each post's latest `Comparison` fit score. Keep the
screen identical — list panel with search/sort, detail panel, Confirmed
(Must-have/Nice-to-have)/Unresolved requirement chips, empty state for posts with
no detected requirements. Data-source swap only.

Depends on spec 01 (Skill Bank) for the skill taxonomy used in `skillOptions` and
the "+ Add requirement" picker.

Do not touch Add/Edit/Delete job post, requirement level/must-have toggles, or the
Unresolved "Assign to skill"/dismiss actions — `JobPostsView.tsx`'s mutations stay
local `useState` until the mutation wave.

## Requirements

- Create `src/lib/db/job-posts.ts` exporting `getJobPostsData(): Promise<JobPostsData>`,
  same shape as today's `JobPostsData` (`items: JobPostListItem[]`,
  `detailsById: Record<string, JobPostFull>`, `skillOptions: SkillOption[]`):
  - `skillOptions` — `prisma.skill.findMany({ include: { category: true } })`,
    system-wide, mapped to `{ id, name, categoryName: category.name }`.
  - Fetch all of the user's job posts once:
    `prisma.jobPost.findMany({ where: { userId }, include: { requirements: { include: { skill: true } }, comparisons: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" } })`.
    Note: `JobPost` has no direct `unresolvedRequirements` relation in the schema
    shown in `project-overview.md`'s ER diagram/Prisma block — confirm during
    implementation whether the `add-seed-supporting-fields` migration (per
    `context/features/seed-spec.md`) added a `JobPost.unresolvedRequirements
    UnresolvedRequirement[]` back-relation; if not, query
    `prisma.unresolvedRequirement.findMany({ where: { jobPostId: { in: jobIds } } })`
    separately and group in memory.
  - `items` — map each job post to `{ id, company: company ?? title, role: title, createdAt, fitScore: comparisons[0]?.fitScore ?? null }` (using the single most-recent included comparison instead of a separate `.find()` against a flat array).
  - `detailsById` — for each job post, map `requirements` from the included
    relation (`skillName` from `requirement.skill.name`, `mustHave`,
    `requiredLevel` straight from columns) and `unresolved` from whichever query
    path above surfaces `UnresolvedRequirement` rows, plus `comparisonId:
    comparisons[0]?.id ?? null`.
- Import `getCurrentUserId` from `src/lib/db/current-user.ts`.
- Update `src/app/job-posts/page.tsx` and `src/app/job-posts/[id]/page.tsx` to
  `await getJobPostsData()` from the new file.

## Non-Goals

- No changes to `AddJobPostDialog`, `DeleteJobPostDialog`, `RequirementChip`,
  `SkillPickerPopover`, `UnresolvedItem` handlers — still local state, addressed in
  the mutation wave.
- `handleRunComparison`'s navigation-only-if-a-comparison-already-exists behavior
  is unchanged here (it's a client-side check against `comparisonId`, not a data
  source) — real "run a fresh comparison" logic is Wave 2 + spec 06's concern.

## References

- `src/lib/job-posts-data.ts` — the mock-backed file being replaced.
- `context/features/seed-spec.md` — confirms 6 seeded `JobPost` rows (Acme,
  Globex, Initech, Umbrella, Stark, Wayne), with `JobPostRequirement` (9 rows) and
  `UnresolvedRequirement` (3 rows) attached **only to Acme** — the other 5 posts
  intentionally have zero requirement rows, preserving the "Couldn't detect
  requirements" empty state as a real, reachable condition. Don't be surprised only
  one post shows populated requirements.

## Verification

- `/job-posts` list shows all 6 real posts with correct fit-score badges; selecting
  Acme shows populated Confirmed (Must-have/Nice-to-have groups) + Unresolved
  panels; selecting any other post shows the real empty "Couldn't detect
  requirements" state.
- Search/sort (Fit % / Date added / Company) work against real data.
- Loading/Error/Empty-account states still render correctly (temporarily forced,
  then reverted).
- `npm run lint` / `npm run build` pass.
