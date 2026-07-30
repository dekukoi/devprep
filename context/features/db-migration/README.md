# DevPrep Mock-Data → Real-Data Migration Specs

This folder holds one file per screen for migrating DevPrep off `src/lib/mock-data/*.ts`
and onto real Prisma/Neon queries — same spirit as `context/designs/` (one file per
screen, ready to implement) and modeled directly on three example specs a mentor wrote
for a sibling project (DevStash's `dashboard-collections-spec.md` /
`dashboard-items-spec.md` / `stats-sidebar-spec.md`), scaled up to DevPrep's larger
screen count.

The database side is already done: the full Prisma schema and a complete demo dataset
(`demo@devprep.io`, mirroring every mock-data record 1:1) landed in the Seed Data
feature (see `context/features/seed-spec.md` and `context/current-feature.md`'s
2026-07-30 history entries). What's still mock is everything *above* the database —
every `page.tsx` reads from `src/lib/mock-data/*.ts` (via a `src/lib/*-data.ts` join
file, or sometimes directly), and every Add/Edit/Delete action in every screen's
client `*View.tsx` component is local `useState` only, with zero persistence.

## Two waves

**Wave 1 — Reads** (the specs in this folder): swap each screen's data source from
mock arrays to a real Prisma query. Design/layout/component props stay the same —
this is a data-source swap, not a UI change, exactly like the three DevStash examples.
Mutations (Add/Edit/Delete) are explicitly **out of scope** for every spec below; they
keep working against local state until Wave 2.

**Wave 2 — Mutations** (not written yet, deliberately deferred): once every screen
reads real data, a second round of specs converts each screen's local-state
Add/Edit/Delete into `src/actions/<feature>.ts` Server Actions
(`{success, data, error}` per `context/coding-standards.md`), replacing local array
splicing with `revalidatePath`. Same screen order applies again. Also address, in that
wave: several screens currently pass in-progress selections through `router.push`
query strings instead of a persisted record (Dashboard→Templates via `?cvId=`,
Experience→Projects via `?experienceId=`, Comparison Report→Templates via
`?jobPostId=`, Templates→Curate via `?jobPostId=&templateId=`, and
Curate→`/cvs/draft/edit?...`, which is currently a **dead link** — no such route
exists yet). Once CV drafts get a real persisted row, that last hop should become
"create a draft `CV` row via Server Action, redirect to `/cvs/[id]/edit`".

## Order (dependency-based, not build/visibility order)

| # | File | New file | Screen(s) |
|---|---|---|---|
| 00 | `00-current-user-resolver.md` | `src/lib/db/current-user.ts` | none (prerequisite, no UI) |
| 01 | `01-skill-bank-data.md` | `src/lib/db/skill-bank.ts` | `/skill-bank`, `/skill-bank/[category]` |
| 02 | `02-experience-data.md` | `src/lib/db/experience.ts` | `/experience` |
| 03 | `03-projects-data.md` | `src/lib/db/projects.ts` | `/projects` |
| 04 | `04-certifications-data.md` | `src/lib/db/certifications.ts` | `/certifications` |
| 05 | `05-job-posts-data.md` | `src/lib/db/job-posts.ts` | `/job-posts`, `/job-posts/[id]` |
| 06 | `06-comparisons-data.md` | `src/lib/db/comparisons.ts` | `/comparisons`, `/comparisons/[id]` |
| 07 | `07-cv-templates-data.md` | `src/lib/db/cv-templates.ts` | `/cvs/templates` |
| 08 | `08-cv-editor-curate-data.md` | `src/lib/db/cvs.ts` | `/cvs/[id]/edit`, `/cvs/curate` |
| 09 | `09-dashboard-data.md` | `src/lib/db/dashboard.ts` | `/` (dashboard root) |
| 10 | `10-app-shell-data.md` | `src/lib/db/app-shell.ts` | Sidebar/Topbar (every route) |

Skill Bank goes first because Experience/Projects/Certifications/Job Posts/CVs all
render skill chips sourced from it. Comparisons depend on Skill Bank + Job Posts.
CVs depend on Experience/Projects/Templates/Job Posts. Dashboard assembles
Comparisons + CVs. App Shell (search + notifications) needs real rows from every
entity type to be meaningful, so it's the capstone — the same role
`stats-sidebar-spec.md` played for DevStash, tying together `collections.ts` +
`items.ts`.

## Shared conventions across every spec in this folder

- **New files live in `src/lib/db/`**, parallel to the existing `src/lib/*-data.ts`
  join files (which live directly in `src/lib/`) — this makes it visually obvious at
  a glance which join files are still mock-backed and which are real, until the old
  ones are deleted.
- **Keep exported function names, parameter shapes, and return-type interfaces
  identical** to the mock-backed join file being replaced, wherever practical. The
  `*View.tsx` client components and their prop types should need **zero changes** —
  only the `page.tsx` import path and the join file's internals change. Where a
  return shape must change (e.g. a mock-only field with no DB column), call it out
  explicitly in that spec's Requirements section rather than silently dropping it.
- **Server components fetch directly** — call the new `src/lib/db/*.ts` function
  straight from `page.tsx`, per `context/coding-standards.md`'s data-fetching rule.
  No API routes for these reads.
- **Every query is scoped to the current user** via `src/lib/db/current-user.ts`
  (spec 00) — every model with a `userId` column must filter on it, both because
  it's correct and because it's the only thing standing in for real auth right now.
- **No mutation logic.** If a spec's screen has Add/Edit/Delete buttons, they keep
  calling local `setState` exactly as today — do not wire them to Prisma in this
  wave, even opportunistically.
- **Verification**: run the dev server, click through the target screen's
  populated/empty/loading/error states (all already built per
  `context/designs/00-general.md`) and confirm the values now match what
  `npm run db:test` reports for the demo user, then `npm run lint` and
  `npm run build`. No test suite exists yet, so this is the same manual-verification
  bar every prior DevPrep feature has used (see `context/current-feature.md` History).
- **Delete the now-unused mock import** from the file(s) being replaced, but leave
  `src/lib/mock-data/*.ts` itself alone — other not-yet-migrated screens still read
  it directly until their own spec lands.
