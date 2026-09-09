# Skill Bank Data Spec

## Overview

Replace the mock data powering the Skill Bank screen (`src/lib/mock-data/skills.ts`
via `src/lib/skill-bank-data.ts`) with real queries against `SkillBankEntry` /
`Skill` / `SkillCategory`, scoped to the current user. Keep the screen looking
exactly how it does now — category tabs, table rows, proficiency meters, "Used in"
chips, Free-tier cap banner. This is a data-source swap, not a UI change.

Foundational: this is the first read-migration chunk because Experience, Projects,
Certifications, Job Posts, and CVs all render skill names/chips sourced from the
taxonomy this spec touches. Do it before those.

Do not touch Add/Edit/Delete — `SkillBankView.tsx`'s mutations stay local `useState`
until the later mutation wave (see this folder's `README.md`).

## Requirements

- Create `src/lib/db/skill-bank.ts` exporting `getSkillBankData(): Promise<SkillBankData>`,
  same return shape as today's `SkillBankData` in `src/lib/skill-bank-data.ts`
  (`categories`, `entries`, `skillsByCategory`, `usedInBySkillId`, `cap`) — no
  interface changes needed, every field maps directly to a real column:
  - `categories` — `prisma.skillCategory.findMany()`, ordered however the taxonomy
    is already ordered (all 5 categories, system-wide, not user-scoped).
  - `skillsByCategory` — `prisma.skill.findMany({ where: { categoryId } })` per
    category, or one query grouped in memory — all skills are system-wide, not
    user-scoped.
  - `entries` — `prisma.skillBankEntry.findMany({ where: { userId }, include: { skill: { include: { category: true } } } })`.
    Map `lastUsedAt` (a real `DateTime?` column) to the same string-or-fallback
    shape the UI expects (check `formatLastUsed` in `src/lib/format.ts` for the
    exact null-handling contract already in place). `tags` maps straight from the
    `String[]` column.
  - `usedInBySkillId` — for each skill, which of the user's `Experience` rows link
    to it. Query `prisma.experience.findMany({ where: { userId }, include: { linkedSkills: true } })`
    once and build the map in memory (same approach the mock join file already
    uses) rather than N+1 querying per skill.
  - `cap` — stays the existing `FREE_TIER_SKILL_BANK_CAP` constant (30), unrelated
    to the DB.
  - `slugify`/icon lookups (`SKILL_CATEGORY_ICON_NAMES`) are pure functions, reuse
    them unchanged from `src/lib/constants/icons.ts` / `src/lib/utils.ts`.
- Import `getCurrentUserId` from `src/lib/db/current-user.ts` (spec 00) to scope
  `entries`/`usedInBySkillId` to the real user — `categories`/`skillsByCategory` are
  never user-scoped (they're the fixed taxonomy).
- Update `src/app/skill-bank/[category]/page.tsx` and `src/app/skill-bank/page.tsx`
  to `await getSkillBankData()` from the new file instead of the old
  `skill-bank-data.ts` (the function becomes `async` — every call site needs
  `await`).
- `SkillBankView.tsx` currently imports `mockUser` directly from `@/lib/mock-data`
  for the `isPro` upsell flag (the only client component doing this) — replace with
  a real `isPro: boolean` prop threaded down from the server component
  (`prisma.user.findUniqueOrThrow` via `getCurrentUser()`), since a client component
  can't call Prisma itself.

## Non-Goals

- No changes to `SkillEntryPanel`, `DeleteSkillDialog`, or any Add/Edit/Delete
  handler — still local state.
- No changes to the Free-tier cap *enforcement* logic, only where `cap`'s value
  and the current count come from.

## References

- `src/lib/skill-bank-data.ts` — the mock-backed file being replaced (read this
  first; the new file's shape should be a near-line-for-line Prisma translation).
- `src/lib/format.ts` — `formatLastUsed` for the `lastUsedAt` display contract.
- `src/lib/constants/icons.ts` — `SKILL_CATEGORY_ICON_NAMES`.
- `context/features/seed-spec.md` — confirms `SkillBankEntry` has 23 seeded rows for
  the demo user (GraphQL and Kubernetes deliberately left unclaimed — don't be
  surprised those two don't show up).

## Verification

- `/skill-bank` redirects to the first category; `/skill-bank/[category]` for all 5
  categories shows the same 23 real entries (spread across categories) that
  `npm run db:test` reports for the demo user, with correct proficiency meters,
  years, tags, and "Used in" chips (PostgreSQL should show both seeded Experience
  rows).
- Category badge counts match real per-category entry counts.
- Loading/Error/Empty states still render correctly (force them the same way prior
  features did — temporarily swap in a rejected/slow promise, then revert).
- `npm run lint` / `npm run build` pass.
