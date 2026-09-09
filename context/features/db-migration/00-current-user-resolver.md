# Current User Resolver Spec

## Overview

Prerequisite for every other spec in this folder. NextAuth isn't wired up yet
(`project-overview.md` Next Steps item 6 — no `getServerSession`/`auth()` call
exists anywhere in `src/`), so there is no real notion of "the logged-in user" to
scope queries by. Every `src/lib/db/*.ts` file this migration adds needs a "who is
this data for" answer, and needs the *same* answer, so add one tiny resolver now
instead of letting each later spec invent its own user lookup.

This is not a screen and has no UI. It exists purely so specs 01–10 have something
to import.

## Requirements

- Add `src/lib/db/current-user.ts` with:
  - `getCurrentUserId(): Promise<string>` — looks up the seeded demo user by its
    fixed, known email (`demo@devprep.io`, per `prisma/seed.ts`) via `prisma.user.findUniqueOrThrow({ where: { email: "demo@devprep.io" }, select: { id: true } })`, and returns its `id`.
  - `getCurrentUser(): Promise<User>` — same lookup, no `select`, for the few
    call sites that need more than the id (e.g. `name`/`role`/`location`/`phone`/
    `links` for CV draft generation in spec 08).
- Import `prisma` from `src/lib/prisma.ts` (already set up, pooled Neon connection
  via `@prisma/adapter-pg` — do not create a second client instance).
- Do **not** cache the result across requests (no module-level singleton) — each
  call should re-query, since this will be deleted/replaced wholesale once real
  sessions exist and caching now would just be code to later throw away.
- Add a code comment on the file marking it a temporary shim, explicitly naming
  what replaces it: once NextAuth is wired up, every call site swaps this import for
  the real session lookup, and this file gets deleted.

## Non-Goals

- No new Prisma model, no schema change — the demo `User` row already exists.
- No actual authentication, session cookies, or login UI. That's Next Steps item 6,
  a separate, much larger feature.
- No error handling beyond letting `findUniqueOrThrow` throw if the demo user is
  somehow missing (e.g. `db:seed` never ran) — that's a legitimate "your dev
  environment isn't set up" failure, not a case to handle gracefully.

## References

- `src/lib/prisma.ts` — existing Prisma client singleton to import.
- `prisma/seed.ts` — where `demo@devprep.io` is created; the source of truth for
  the fixed email this resolver looks up.
- `context/features/seed-spec.md` — background on why the demo user's identity is
  fixed rather than mirroring the mock `mockUser` fixture's email.

## Verification

- `npx tsx -e "import('./src/lib/db/current-user').then(m => m.getCurrentUserId()).then(console.log)"`
  (or a small scratch script) returns the seeded demo user's real `id` — cross-check
  against `npm run db:test`'s output for the same row.
- `npm run lint` / `npm run build` pass (this file has no consumers yet until spec
  01 lands, so build should be unaffected either way).
