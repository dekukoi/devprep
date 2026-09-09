# Experience Bank Data Spec

## Overview

Replace the mock data behind the Experience Bank screen
(`src/lib/experience-data.ts`) with real queries against `Experience`, joined to
its linked `Skill`s and any `Project` rows that reference it. Keep the screen
identical — cards, bullet previews, skill chips, linked-project chips. Data-source
swap only.

Depends on spec 01 (Skill Bank) landing first for the taxonomy/skill-name lookups
this join needs.

Do not touch Add/Edit/Delete/drag-reorder — `ExperienceBankView.tsx`'s mutations
stay local `useState` until the mutation wave.

## Requirements

- Create `src/lib/db/experience.ts` exporting `getExperienceData(): Promise<ExperienceData>`,
  same shape as today's `ExperienceData` (`experiences: ExperienceView[]`,
  `allSkills: SkillOptionView[]`):
  - `experiences` — `prisma.experience.findMany({ where: { userId }, include: { linkedSkills: true, projects: true }, orderBy: { startDate: "desc" } })`.
    Map `linkedSkillIds`/`linkedSkillNames` from the included `linkedSkills` relation
    (no separate skill-name lookup needed, unlike the mock version which cross-refs
    a flat `skills` array). Map `projects` (the `ExperienceProjectChip[]`) directly
    from the included `projects` relation (`id`, `title`).
  - `allSkills` — same as spec 01's `skillsByCategory`, flattened: all `Skill` rows
    system-wide (`prisma.skill.findMany()`), not user-scoped.
  - `startDate`/`endDate` — Prisma returns `Date`, the existing `ExperienceView`
    type has them as `string`; convert with `.toISOString()` to match what
    `formatMonthYear`/`formatDateRange` (`src/lib/format.ts`) already expect, same
    contract the mock data used.
- Import `getCurrentUserId` from `src/lib/db/current-user.ts`.
- Update `src/app/experience/page.tsx` to `await getExperienceData()` from the new
  file.

## Non-Goals

- No changes to `ExperienceEntryPanel`, `DeleteExperienceDialog`, or the
  Experience→Projects `router.push('/projects?experienceId=...')` handoff — still
  local state / query-param passing, addressed in the mutation wave per this
  folder's `README.md`.

## References

- `src/lib/experience-data.ts` — the mock-backed file being replaced.
- `src/lib/format.ts` — `formatMonthYear`, `formatDateRange`.
- `context/features/seed-spec.md` — confirms 2 seeded `Experience` rows (Lumen
  Systems, Corebit) for the demo user, each with `linkedSkills` and at least one
  with a linked `Project` (Lumen → Internal Status Page) — enough to exercise both
  the linked-project and "None linked yet" states.

## Verification

- `/experience` shows the same 2 real cards `npm run db:test` reports, with correct
  bullets, skill chips, and the Lumen card's linked-project chip (Corebit shows
  "None linked yet").
- Loading/Error/Empty states still render correctly (temporarily forced, then
  reverted, per the established pattern).
- `npm run lint` / `npm run build` pass.
