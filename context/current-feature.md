# Current Feature
<!-- Feature name and short description -->

Prisma + Neon PostgreSQL Setup — wire up Prisma ORM against a Neon PostgreSQL database, with an initial schema based on the data models in `project-overview.md` (including the NextAuth models), created and applied only via migrations.

## Status
<!-- Not Started | In Progress | Completed -->

Completed

## Goals
<!-- Goals and requirements -->

- Use Neon PostgreSQL (serverless) as the database.
- Create the initial schema based on the data models in `project-overview.md` (schema will evolve — this is a starting point, not final).
- Include the NextAuth models (`Account`, `Session`, `VerificationToken`) alongside the app's own models.
- Add appropriate indexes and cascade deletes.
- Use Prisma 7 — read the full upgrade guide (breaking changes vs earlier Prisma versions) before writing schema/client code.
- Always create and run migrations (`prisma migrate dev`, `prisma migrate deploy`) — never `prisma db push` or direct schema edits against the database.

## Notes
<!-- Any extra notes -->

- Full requirements: `context/features/database-spec.md`.
- We will have a development branch (used via `DATABASE_URL` locally) and a separate production branch in Neon — always create migrations and never push directly unless explicitly told otherwise.
- Prisma 7 upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Prisma Postgres quickstart: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- Next.js 16 / React 19, Turbopack is the default for `dev` and `build`.
- Per `AGENTS.md`: this is a modified Next.js — consult `node_modules/next/dist/docs/` before writing framework code.
- This feature is DB/ORM setup only — no UI work. Builds on the mock-data types/fixtures and component library from the prior feature, which stay in place.

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-07-24** — Bootstrapped the project with `npx create-next-app@latest --src-dir` (Next.js 16.2.11, React 19.2.4, TypeScript, Tailwind CSS v4, App Router). _(commit `6f72a7d` — "Initial commit from Create Next App")_
- **2026-07-24** — Cleaned the boilerplate: removed unused SVG assets from `public/`, stripped `src/app/globals.css` down to `@import "tailwindcss";`, and reduced `layout.tsx` / `page.tsx` to a minimal DevPrep starting point. _(commit `e525617`)_
- **2026-07-24** — Added `LICENSE` (GNU GPL v3). _(commit `f9c65c0`)_
- **2026-07-24** — Added the `context/` planning docs: `project-overview.md`, `architecture-notes.md`, `coding-standards.md`, and this feature doc. _(commit `89917f0`)_
- **2026-07-24** — Reformatted `project-overview.md` doc structure (TOC, ER diagram with attributes, full Prisma schema, seed data, architecture/pricing diagrams, project structure, next steps). _(commit `b31b338`)_
- **2026-07-24** — Filled in this feature doc's goals/notes for the initialization work. _(commit `9e68c20`)_
- **2026-07-27** — Added VS Code color customization settings and a minor `ai-interaction.md` update. _(commit `2d12269`)_
- **2026-07-28** — Added `context/designs/*.md` design prompt docs (per-screen UI/UX specs used to generate the `.pen` file) and updated `project-overview.md` to add Projects as a primary content source alongside Experience. _(commit `fc8c37e`)_
- **2026-07-28** — Marked Project Initialization & Setup complete; the Next.js foundation and context docs are in place. Started this feature (mock data → theme tokens → component library) based on the newly-added `context/designs/devprep-design.pen` UI design.
- **2026-07-28** — Implemented all three phases: (1) `src/types/*.ts` + `src/lib/mock-data/*.ts` fixtures matching the design 1:1 (verified Skill Bank category counts 6/5/8/4/3 against the design's tab badges); (2) `next-themes` + Tailwind v4 `@theme` tokens in `globals.css`, Inter via `next/font`; (3) shadcn/ui initialized (Nova/Radix/Lucide preset) and bridged onto the DevPrep tokens, plus the 18 reusable atoms/molecules from the design (`src/components/shared/`, `src/components/layout/`). Also reconciled `project-overview.md`'s stale CV template naming and skill-taxonomy counts to match the design. Verified via a scratch preview page in the browser (computed-style checks confirmed exact token matches in both dark and light themes, then removed); `lint` and `build` both pass. Noted rough edge: `next-themes`' hydration-guard `<script>` tag triggers a harmless React 19 dev console warning ("Encountered a script tag...") on every page — functionality is unaffected (verified theme toggling works correctly); revisit if `next-themes` ships a fix.
- **2026-07-29** — Marked Mock Data, Theme Tokens & Component Library complete. Started this feature (Prisma + Neon PostgreSQL Setup) per `context/features/database-spec.md`: initial schema from `project-overview.md`'s data models, NextAuth models included, migrations-only workflow, Prisma 7.
- **2026-07-29** — Implemented and verified: linked the repo to the existing Neon "Devprep" project's `development` branch (`neon link`, pulling pooled `DATABASE_URL` + direct `DATABASE_URL_UNPOOLED` into git-ignored `.env.local`); installed Prisma 7.9.1 with the `prisma-client` generator (output `src/generated/prisma`), `@prisma/adapter-pg` driver adapter, `pg`, and `dotenv`; wrote the full schema from `project-overview.md` (all app models + NextAuth's `Account`/`Session`/`VerificationToken`, indexes, cascade deletes); created `prisma.config.ts` and ran `prisma migrate dev --name init` + `prisma generate`; added the runtime client singleton at `src/lib/prisma.ts` using the pooled connection. `npm run build` and `npm run lint` both pass. Confirmed by deliberately breaking each URL in turn that the CLI uses the **direct** connection for migrations while the app singleton uses the **pooled** one. Note: Prisma 7.9.1's actual `prisma.config.ts` `Datasource` type only has `url`/`shadowDatabaseUrl` — no `directUrl` (unlike some docs/skill references) — so `url` is set to the direct URL there, since with driver adapters that config value is CLI-only and the app's runtime client supplies its own pooled connection string independently. Did not touch the Neon `production` branch or seed the taxonomy/CV templates — seeding is `project-overview.md`'s separate Next Steps item 5, out of scope here.
- **2026-07-29** — Added `scripts/test-db.ts` (connects via the `@prisma/adapter-pg` driver adapter, runs `SELECT 1`, prints row counts) and a `db:test` npm script, to sanity-check the Neon connection now that setup is done; installed `tsx` as a dev dependency to run standalone TS scripts (no `ts-node`/native TS execution was in place). Then closed out Next Steps item 5: wrote `prisma/seed.ts` seeding the 5 fixed `SkillCategory` rows and 28 `Skill` rows (matching `src/lib/mock-data/skills.ts` exactly, not the smaller sample list in `project-overview.md` — left a comment to keep the two in sync) plus the 6 `CVTemplate` rows, all via `upsert` so it's safe to re-run; wired `migrations.seed: "tsx prisma/seed.ts"` into `prisma.config.ts` so `prisma migrate dev`/`prisma db seed` picks it up automatically, and added a `db:seed` npm script. Ran it against the Neon `development` branch and verified via `db:test`: 5 categories / 28 skills / 6 templates.
