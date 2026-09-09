# App Shell Data Spec

## Overview

Replace the mock data behind the Sidebar and Topbar — `src/lib/app-shell-data.ts`,
consumed by literally every route — with real queries: sidebar nav counts per
skill category, sidebar Job Post/CV link lists, Topbar global search index (Job
Posts/CVs/Skills groups), notifications, and user initials. Keep both components
identical — collapsible sidebar, tooltip-on-collapse, search popover with grouped
results, notification read/unread styling. Data-source swap only.

True capstone of the read wave: needs real rows from every entity type
(skills, job posts, CVs, comparisons) to be meaningful, so it's sequenced last —
doing it earlier would mean search/notifications mixing real and still-mock data
mid-migration. Depends on specs 01, 05, 06, 08/09 all landing first.

Do not touch mark-all-read or any notification-dismiss interaction —
`Topbar.tsx`'s notification state stays local `useState` until the mutation wave
(notifications have no Prisma model at all yet, mock or otherwise — see Non-Goals).

## Requirements

- Create `src/lib/db/app-shell.ts` exporting `getAppShellData(): Promise<AppShellData>`,
  same shape as today (`skillCategories`, `jobPosts`, `cvs`, `searchGroups`,
  `notifications`, `userInitials`):
  - `skillCategories` (sidebar counts) — `prisma.skillCategory.findMany()` joined
    against `prisma.skillBankEntry.count({ where: { userId, skill: { categoryId } } })`
    per category (or one grouped query) — same computation as spec 01's category
    badge counts, just reused here for the sidebar instead of the Skill Bank
    screen's tabs.
  - `jobPosts`/`cvs` (sidebar link lists) — `prisma.jobPost.findMany({ where: { userId }, select: { id: true, company: true, title: true } })`
    and `prisma.cV.findMany({ where: { userId }, select: { id: true, title: true } })`,
    mapped to `{ id, label }` same as today.
  - `searchGroups` — three groups, each a real query:
    - Job Posts: `prisma.jobPost.findMany({ where: { userId }, include: { comparisons: { orderBy: { createdAt: "desc" }, take: 1 } } })`,
      `meta` built from the most recent comparison's `fitScore` when present.
    - CVs: `prisma.cV.findMany({ where: { userId } })`, `meta` from
      `formatRelativeDate(updatedAt)`.
    - Skills: `prisma.skillBankEntry.findMany({ where: { userId }, include: { skill: { include: { category: true } } } })`,
      `meta` from category name + proficiency, `href` via the same `slugify`
      helper already used elsewhere.
  - `notifications` — **flag, don't silently drop.** There is no `Notification`
    Prisma model (confirmed absent from `project-overview.md`'s schema and never
    flagged as a gap in `context/features/seed-spec.md` either — it's simply never
    been modeled). Two honest options for this spec to choose between during
    implementation: (a) keep `notifications` hardcoded/derived-on-the-fly from
    recent real activity (e.g. "most recent comparison" → a synthesized
    "Comparison finished" notification, similar to today's mock shape but built
    from real rows instead of `comparisons[0]`), with no read/unread persistence
    since there's nowhere to store it; or (b) return an empty array and let the
    Topbar's existing empty-state handle it. Do not add a `Notification` table in
    this spec — that's a real schema/product decision (what generates a
    notification, retention, mark-read persistence) out of scope for a read-only
    data-source swap.
  - `userInitials` — `getCurrentUser()` from spec 00, same `initials()` helper.
- Import `getCurrentUserId`/`getCurrentUser` from `src/lib/db/current-user.ts`.
- Update every `page.tsx` currently calling `getAppShellData()` (all of them) to
  await the new file instead — this is the widest blast-radius spec in the
  read wave purely by touch-count, even though the change per file is one import
  line + one `await`.

## Non-Goals

- No `Notification` Prisma model or persistence — see above.
- No changes to `Sidebar.tsx`/`Topbar.tsx` component internals, search
  popover/keyboard nav, or notification mark-all-read UI — purely presentational,
  already take props.

## References

- `src/lib/app-shell-data.ts` — the mock-backed file being replaced.
- `src/lib/format.ts` — `formatRelativeDate`.
- `src/lib/utils.ts` — `slugify`.
- Every `page.tsx` under `src/app/` — all are consumers; grep for
  `getAppShellData` to get the exact list before starting so none are missed.

## Verification

- Every route's Sidebar shows real per-category skill counts and real Job Post/CV
  link lists; Topbar search returns real, correctly-grouped results for a query
  matching a real skill/job/CV name; avatar shows real user initials.
- Notifications render whichever of the two Non-Goals options was chosen, with no
  console errors and no dangling mock references.
- `npm run lint` / `npm run build` pass — this is the spec most likely to surface a
  missed call site if `getAppShellData` isn't updated everywhere, so a clean build
  is the real signal this chunk is complete, not just spot-checking a few routes.
