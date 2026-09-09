# Projects Bank Data Spec

## Overview

Replace the mock data behind the Projects Bank screen (`src/lib/projects-data.ts`)
with real queries against `Project`, joined to its linked `Skill`s and optional
`Experience`. Keep the screen identical — filter chips (All/Standalone/Linked),
sort, cards, "Link to an Experience" option list. Data-source swap only.

Depends on spec 02 (Experience) landing first for the `experienceOptions` dropdown
this join needs.

Do not touch Add/Edit/Delete/drag-reorder — `ProjectsBankView.tsx`'s mutations stay
local `useState` until the mutation wave.

## Requirements

- Create `src/lib/db/projects.ts` exporting `getProjectsData(): Promise<ProjectsData>`,
  same shape as today's `ProjectsData` (`projects: ProjectView[]`,
  `allSkills: SkillOptionView[]`, `experienceOptions: ProjectExperienceOption[]`):
  - `projects` — `prisma.project.findMany({ where: { userId }, include: { linkedSkills: true, experience: true } })`.
    Map `experienceId`/`experienceLabel` from the included `experience` relation
    (`null` when standalone). Map `linkedSkillIds`/`linkedSkillNames` from the
    included `linkedSkills` relation directly (no separate lookup needed).
    `startDate`/`endDate`/`createdAt`/`updatedAt` — convert Prisma `Date`/`Date?` to
    `string`/`string | null` via `.toISOString()`, matching `ProjectView`'s existing
    field types.
  - `allSkills` — same system-wide `Skill` query as spec 02.
  - `experienceOptions` — `prisma.experience.findMany({ where: { userId } })`,
    mapped to `{ id, label: \`${title} — ${company}\` }`.
- Import `getCurrentUserId` from `src/lib/db/current-user.ts`.
- Update `src/app/projects/page.tsx` to `await getProjectsData()` from the new file
  (it also reads an `experienceId` search param for the Experience→Projects
  prefill handoff — that param-reading logic itself doesn't change, only the data
  source).

## Non-Goals

- No changes to `ProjectEntryPanel`, `DeleteProjectDialog`, or the skill-combobox/
  Link-to-Experience popover interactions — still local state, addressed in the
  mutation wave.

## References

- `src/lib/projects-data.ts` — the mock-backed file being replaced.
- `context/features/seed-spec.md` — confirms 2 seeded `Project` rows for the demo
  user (Internal Status Page → linked to the Lumen `Experience`, sqlfmt-go →
  standalone, `experienceId: null`) — enough to exercise both the Standalone and
  Linked filter states.

## Verification

- `/projects` shows the same 2 real cards `npm run db:test` reports; the
  Standalone/Linked filter chips and Most-recent/Title-A–Z sort work against real
  data; the Link-to-Experience popover lists the real Experience rows from spec 02.
- Loading/Error/Empty states still render correctly (temporarily forced, then
  reverted).
- `npm run lint` / `npm run build` pass.
