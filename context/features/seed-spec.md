# Seed Data Specification

## Overview

Two-step spec:

1. **Seed script** — expand `prisma/seed.ts` to populate the database with a full, realistic dev/demo dataset, not just the fixed taxonomy and CV templates it seeds today — so the app can be manually tested and demoed against real database-backed data instead of the frontend's mock fixtures. The single source of truth for record shapes/values is `src/lib/mock-data/*.ts` (already used to build every screen so far); this seed should mirror that data 1:1 wherever the schema allows, not invent new content.
2. **Verification script** — update `scripts/test-db.ts` to fetch and display the newly-seeded demo data (not just row counts of the fixed/system tables it checks today), so running the seed and then the verify script is a complete, self-checking confirmation that everything landed correctly and every relation resolves.

## Step 1: Seed Script (`prisma/seed.ts`)

### Prerequisite: Schema Migration

Several fields already exist in the frontend's type layer (`src/types/*.ts`) and mock data, driving real UI behavior, but have no column on the current `prisma/schema.prisma` models. Add these via a new migration (`npx prisma migrate dev --name add-seed-supporting-fields`) before writing the seed data that depends on them:

- `JobPostRequirement.mustHave Boolean @default(false)` — drives the Job Posts screen's Must-have/Nice-to-have grouping.
- New model `UnresolvedRequirement { id, jobPostId, phrase }` (`jobPostId` FK → `JobPost`, cascade delete, indexed) — the free-text phrases the mock "parser" couldn't map to a taxonomy skill.
- `JobPost.seniority String?`, `location String?`, `employmentType String?`, `salaryRange String?` — power the Job Post detail header's meta tiles.
- `CV.staleFields String[] @default([])` — flat list of top-level `CVContent` field names that have drifted from the Skill Bank (currently just `["skills"]` on the demo CV).
- `SkillBankEntry.lastUsedAt DateTime?` and `tags String[] @default([])` — back the Skill Bank table's "Last used" column/sort and (legacy, read-only) Tags column.
- `CVVersion.note String @default("")` — the human-readable description shown per row in Version History (e.g. "Reordered experience bullets to lead with impact metrics").
- `User.role String?`, `location String?`, `phone String?`, `links String[] @default([])` — the mock `User` type carries a profile (job title, location, phone, links) that the Prisma `User` model didn't have any column for at all.

Do not add `CVSuggestion` or a `DashboardStats` table — see Non-Goals below.

### Requirements

#### Fixed / System Data (already implemented — no change)

- `SkillCategory` (5 rows) and `Skill` (28 rows) — already seeded via `upsert`, keyed by name/`categoryId_name`. Keep as-is; the taxonomy must stay in sync with `src/lib/mock-data/skills.ts`'s category/skill lists per the existing code comment.
- `CVTemplate` (6 rows: Aurora/Slate/Mono × Single/Two Column) — already seeded via `upsert`, keyed by `name_variant`. Keep as-is.

#### Demo User

One `User` row with fixed, known dev-login credentials rather than mirroring `mockUser`'s email/name verbatim:

- `email: "demo@devprep.io"`
- `name: "Demo User"`
- `password`: the literal dev password `12345678`, hashed with `bcryptjs` at 12 salt rounds before insert (never store the plaintext value) — `bcryptjs` is not currently a dependency (`npm install bcryptjs @types/bcryptjs`) and must be added when this spec is implemented.
- `isPro: false`
- `emailVerified`: the current date/time at seed run (`new Date()`), so the account reads as already-verified for local credentials-login testing once NextAuth is wired up.
- Remaining profile fields (`role`, `location`, `phone`, `links`) still carry over from `src/lib/mock-data/user.ts`'s `mockUser` (Backend Engineer, San Francisco, etc.) for realistic demo content — only identity/auth fields are fixed to the values above.
- Every other seeded record's `userId` points at this row.

NextAuth's `Account`/`Session`/`VerificationToken` are still **not** seeded (see Non-Goals) — NextAuth v5 configuration (`project-overview.md` Next Steps item 3) isn't wired up yet. The hashed password above is forward-looking: it makes this user ready for credentials-login testing the moment that feature lands, without needing a seed change at that point.

#### Skill Bank

- `SkillBankEntry` — 23 rows from `src/lib/mock-data/skills.ts`, one per claimed skill (`proficiencyLevel`, `yearsOfExperience`, `lastUsedAt`, `tags`), `@@unique([userId, skillId])` respected. Deliberately leave GraphQL and Kubernetes **unclaimed** (in the taxonomy, no `SkillBankEntry` row) — this is what makes them show up as real gaps in the seeded comparisons/job posts.

#### Career History

- `Experience` — 2 rows (Lumen Systems, Corebit) from `src/lib/mock-data/experience.ts`, with `bullets` and `linkedSkills` (via the `ExperienceSkills` implicit relation) matching the mock's `linkedSkillIds`.
- `Project` — 2 rows (Internal Status Page → linked to the Lumen `Experience`, sqlfmt-go → standalone, `experienceId: null`), with `linkedSkills` via `ProjectSkills`.
- `Certification` — 4 rows (`cert-aws-saa` active/expiring-soon, `cert-terraform-associate` active/far-future, `cert-cka-expired` past expiry, `cert-psm` no expiry date/no linked skills) — deliberately keep all four so the Certifications screen's active/expiring-soon/expired/no-expiry badge states are all exercisable against real data, not just the mock.

#### Job Posts

- `JobPost` — 6 rows (Acme, Globex, Initech, Umbrella, Stark, Wayne) with the new `seniority`/`location`/`employmentType`/`salaryRange` fields populated per `src/lib/mock-data/job-posts.ts`. Only `job-acme`'s `content` is the full multi-section pasted description; the rest keep their single-paragraph mock content.
- `JobPostRequirement` — 9 rows, **all attached to Acme only** (`mustHave`, `requiredLevel`, `weight`) — the other 5 job posts intentionally get zero requirement rows, preserving the "Couldn't detect requirements" empty state as a real, reachable condition.
- `UnresolvedRequirement` — 3 rows, all attached to Acme ("Site reliability practices", "On-call rotations", "Agile ceremonies").

#### Comparisons

- `Comparison` — 6 rows, one per job post, with `fitScore` matching the mock (Acme 79, Globex 64, Initech 91, Umbrella 43, Stark 73, Wayne 88).
- Compute `gaps` (JSON: `[{ skillId, skillName, requiredLevel, currentLevel, severity }]`) **freshly from the just-seeded live data** — join each job post's `JobPostRequirement`s against the demo user's `SkillBankEntry`s to derive `currentLevel`/`severity`, rather than copying the mock's frozen JSON blob verbatim. This keeps the seed honest about what the real deterministic comparison engine (`project-overview.md` Feature D) will actually produce, and self-consistent with whichever `SkillBankEntry` rows actually got seeded.
- `advice` — carry over the mock's free-text paragraph per comparison as a starting value (the doc's `buildAdviceItems` rule-based logic in `src/lib/comparison-advice.ts` already derives structured UI cards from `gaps` directly and doesn't read this field, so its exact wording isn't load-bearing).

#### CVs

- `CV` — 3 rows (`cv-acme` → Aurora Single Column template + `jobPostId: job-acme` + `staleFields: ["skills"]`, `cv-globex`, `cv-initech`), `draftContent` populated as the `CVContent` JSON shape (include the optional `projects` array where the mock has one, so the seed reflects the current full JSON shape, not an older version of it).
- `CVVersion` — 7 rows (5 for `cv-acme`, 1 each for `cv-globex`/`cv-initech`), each with its mock `note` text, a real `contentHash` computed from its `content` (not a placeholder), and `renderedFileUrl: null` — matches `architecture-notes.md`'s "lazy on first export" rule, so no seeded version should have a fake pre-populated R2 URL. `CV.latestVersionId` must point at the highest `versionNumber` row for that CV.

#### Non-Goals (explicitly out of scope for this seed)

- **`CVSuggestion`** — ephemeral pending-AI-suggestion cards for the CV Editor; no Prisma model exists and none should be added here — these are ok to stay mock-only/regenerated at request time once AI features are real.
- **`DashboardStats`** — not a real entity; it's UI-only aggregate copy in the mock layer whose numbers don't even reconcile with the other mock arrays' real counts (e.g. mock `cvCount: 5` vs. only 3 real `CV` rows). A real Dashboard should compute these live from seeded rows (`COUNT`/`AVG` queries), never seeded as a standalone table.
- **NextAuth `Account`/`Session`/`VerificationToken`** — no rows; no OAuth/credentials login flow is wired up yet (`project-overview.md` Next Steps item 3 is still open).

### Implementation Notes (for whoever implements this spec)

- Keep the existing `upsert`-everywhere idempotency pattern from the current `prisma/seed.ts` so the script is safe to re-run against the `development` Neon branch without duplicating rows.
- The mock data's ids (`"skill-typescript"`, `"exp-lumen"`, `"job-acme"`, ...) are not valid `cuid()`s — build an in-memory lookup map (mock id → real created row id) as each entity is inserted, and use that map to resolve every foreign key in later steps (e.g. `Project.experienceId`, `JobPostRequirement.skillId`), rather than trying to force the mock strings into the DB as real primary keys.
- Mock date fields are ISO strings computed relative to "now" (e.g. `SkillBankEntry.lastUsedAt` as "Today/Yesterday/N days ago") — convert to real `Date`/`DateTime` values at seed time, don't hardcode stale absolute dates that will read as increasingly wrong the longer the seed goes unrun.
- This is additive to the existing `main()` in `prisma/seed.ts` — the fixed-taxonomy and CV-template blocks stay first (other seed steps depend on `Skill` rows existing), then the new demo-user block runs after.
- Never use `prisma db push`; the schema-gap fields above go through `prisma migrate dev` like every other schema change in this project (per `coding-standards.md` / `database-spec.md`).

## Step 2: Verify via `scripts/test-db.ts`

Today `scripts/test-db.ts` only does a `SELECT 1` connectivity check plus `count()` on the 4 fixed/system-ish tables (`User`, `SkillCategory`, `Skill`, `CVTemplate`). Once Step 1 lands, extend it so running `npm run db:seed` then `npm run db:test` is a full, self-checking confirmation that every demo record landed correctly and every relation resolves — not just that rows exist.

### Requirements

- **Keep the existing connectivity check and row counts**, but extend the counted tables to include every model touched by Step 1: `SkillBankEntry`, `Experience`, `Project`, `Certification`, `JobPost`, `JobPostRequirement`, `UnresolvedRequirement`, `Comparison`, `CV`, `CVVersion`.
- **Fetch and print the demo user** (`prisma.user.findUnique({ where: { email: "demo@devprep.io" } })`) — log `id`/`name`/`email`/`isPro`/`emailVerified`, and fail loudly (non-zero exit) if it's `null`, since every other check below depends on it existing.
- **Verify the password hash**, not just its presence: `bcryptjs.compareSync("12345678", user.password)` and log pass/fail. Never log the hash or plaintext beyond that boolean — this is a smoke test that Step 1's `bcryptjs` hashing actually round-trips, not a place to expose the credential.
- **Fetch and print one representative sample per major entity**, joined enough to prove relations resolve, e.g.:
  - A few `SkillBankEntry` rows with their `skill.name`/`skill.category.name` included, to confirm the `userId`/`skillId` FKs and the taxonomy join work.
  - The `Experience` rows with their `linkedSkills` names and nested `projects` (proving the `Project.experienceId` link resolves both directions).
  - The `Project` with `experienceId: null` (sqlfmt-go), confirming a standalone project is queryable and distinguishable from a linked one.
  - `Certification` rows with computed expiry status (reuse `getCertificationExpiryStatus` from `src/lib/certifications-data.ts` against the seeded `expiryDate`s), to confirm all four expiry states (active/expiring-soon/expired/no-expiry) are actually present in the DB.
  - The Acme `JobPost` with its `requirements` (including `mustHave`) and `unresolvedRequirements` included, plus one of the other 5 job posts confirmed to have zero requirements — proving the "couldn't detect requirements" condition is real, not just assumed.
  - Each `Comparison`'s `fitScore` and a count of `gaps` by `severity`, to sanity-check the fresh gap computation from Step 1 (e.g. confirm GraphQL/Kubernetes show up as `"missing"` somewhere, since they're deliberately unclaimed).
  - Each `CV` with its `template` (name/variant), `jobPost` title (nullable), and `versions` ordered by `versionNumber`, confirming `latestVersionId` actually matches the highest `versionNumber` row.
- **Print a final pass/fail summary line** (e.g. `"Seed verification: X/Y checks passed"`) so it's obvious at a glance whether re-running the seed is needed, rather than requiring the reader to parse every logged object by hand.
- Keep this a manual diagnostic script in the existing style (plain `console.log`, `process.exit(1)` on failure) — **not** a real test framework (`project-overview.md`/`current-feature.md` confirm none is configured yet); don't introduce Jest/Vitest just for this.

### Implementation Notes

- Structure additions as small named check functions (e.g. `checkDemoUser()`, `checkSkillBank()`, `checkJobPosts()`, `checkComparisons()`, `checkCvs()`) each returning a boolean, so the final summary line can just count `true`s — mirrors the "small independent checks" shape the script already loosely follows with its `Promise.all` count block.
- Reuse existing helpers instead of re-deriving logic: `getCertificationExpiryStatus` (`src/lib/certifications-data.ts`) for the certification check, rather than reimplementing the 60-day-window date math inline.
- This script only ever reads — it must not mutate any seeded row, so re-running `npm run db:test` repeatedly stays side-effect-free.

## References

- `@context/project-overview.md` — canonical data model (Prisma schema block, ER diagram, Feature descriptions D/E referenced above).
- `@context/features/database-spec.md` — the original Prisma + Neon setup spec this seed work extends; same doc pattern/tone to follow.
- `@context/current-feature.md` — History section documents which mock-data fields were added in which feature and why (Job Posts' `mustHave`/`UnresolvedRequirement`/meta fields, Certifications' expiry trio, CV Editor's `staleFields`/`CVVersion.note`, Skill Bank's `lastUsedAt`/`tags`, CV Curate Content's `CVContent.projects`).
- `src/lib/mock-data/*.ts` and `src/types/*.ts` — exact source data/shapes to mirror (`user.ts`, `skills.ts`, `experience.ts`, `job-posts.ts`, `comparisons.ts`, `cv.ts`).
- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma.config.ts` — current schema and seed wiring being extended.
- `scripts/test-db.ts` and the `db:seed`/`db:test` npm scripts — the Step 2 verification script being extended, and how it's invoked.
- `src/lib/certifications-data.ts` (`getCertificationExpiryStatus`) — existing pure helper Step 2's certification check should reuse rather than reimplement.

## Notes

This spec intentionally does not touch `prisma/seed.ts`, `prisma/schema.prisma`, or `scripts/test-db.ts` themselves — it only documents the target state for both steps, matching how `database-spec.md` preceded (rather than performed) the original Prisma setup. Implementing it is a separate future feature and should follow the normal branch → implement Step 1 → implement Step 2 → verify (`npm run db:seed` then `npm run db:test`, confirming the final pass/fail summary is all-pass) → build → commit workflow from `ai-interaction.md`. Step 2 is not optional polish — Step 1 isn't considered done until Step 2 confirms it actually worked end-to-end.

The schema-gap fields called out under "Prerequisite: Schema Migration" are a real, load-bearing part of this spec, not a nice-to-have — several of them (`JobPostRequirement.mustHave`, `UnresolvedRequirement`) are required for the Job Posts screen's Confirmed/Unresolved and Must-have/Nice-to-have grouping to mean anything against real seeded data; skipping them would mean the seed can't actually represent what's already on screen.

The demo user's identity fields (`email`/`name`/`password`) are intentionally fixed, known values rather than mirrored from `mockUser` — this account is meant to be a reusable local-dev login once credentials auth exists, not just a data placeholder. Never log or commit the plaintext password anywhere outside this spec; the seed script must only ever write the bcrypt hash, and Step 2's password check must only ever log a pass/fail boolean, never the hash or plaintext.
