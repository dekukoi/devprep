# DevPrep

![Status](https://img.shields.io/badge/status-in%20development-orange)
[![License](https://img.shields.io/github/license/dekukoi/devprep)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma%207-4169e1?logo=postgresql&logoColor=white)

[![Stars](https://img.shields.io/github/stars/dekukoi/devprep?style=social)](https://github.com/dekukoi/devprep/stargazers)
[![Forks](https://img.shields.io/github/forks/dekukoi/devprep?style=social)](https://github.com/dekukoi/devprep/network/members)
[![Issues](https://img.shields.io/github/issues/dekukoi/devprep)](https://github.com/dekukoi/devprep/issues)
![Last commit](https://img.shields.io/github/last-commit/dekukoi/devprep)

Keep a structured record of your experience as a developer and turn it into a CV tailored to a specific job posting, with a gap analysis between what you have done and what a role asks for.

## What it does

DevPrep maintains a **Skill Bank** — your skills (with proficiency and years), work experience, projects, and certifications — as structured data rather than free text. You paste in a job description, mark which skills it requires, and DevPrep produces a comparison report: a fit score, a list of gaps (missing / below level / met), and rule-based advice on what to address first. When you generate a CV, it ranks your Experience and Project entries by how well they match the target role, you pick which ones to include, and it assembles a draft you can edit inline.

This is an in-development prototype. The full screen flow is built and works against a seeded sample dataset, and three screens (Skill Bank, Experience, Projects) read from a real PostgreSQL database. The deterministic comparison engine that is the core idea is not implemented yet — see [Limitations](#limitations--whats-next).

## Why I built this

Two reasons at once. It is a testbed for running an AI-assisted development workflow end to end — the `context/` specs, per-feature planning docs, and design files are part of that experiment. And it is a tool I wanted: one structured record of what I have done, that generates a targeted CV from it, instead of rewriting the same document by hand for every application.

## Features

Working today:

- **Career data** — Skill Bank (proficiency, years, tags, "used in which roles"), Experience, Projects (standalone or attached to a role), Certifications (active / expiring / expired status). Skill Bank, Experience, and Projects are served from PostgreSQL; Certifications and every screen below are served from in-repo sample fixtures.
- **Job posts** — paste a description; manually add structured requirements (required level, must-have vs. nice-to-have); map free-text phrases to taxonomy skills.
- **Comparison report** — fit-score ring, gap list grouped by severity, and numbered rule-based advice cards. The advice cards and severity coloring are computed from the gap data; the fit score and gap list themselves are seeded values, not yet calculated from your Skill Bank.
- **CV flow** — choose a template (3 families x 2 layouts), curate which Experience/Project entries populate the draft (ranked by skill overlap with a chosen job post), generate a draft, then edit it inline with accept/reject suggestions and a version-history panel.
- **App shell** — collapsible sidebar (state persisted to `localStorage`), global search, notifications panel, dark/light theme (dark by default), responsive to mobile widths.
- Empty, loading, and error/retry states across all screens.

> **Note:** create / edit / delete actions in every screen currently update React state only. They are not saved — a page refresh resets them.

## Tech stack

- **Framework** — Next.js 16 (App Router, Server Components), React 19
- **Language** — TypeScript
- **Database** — PostgreSQL (developed against [Neon](https://neon.tech)), Prisma 7 with the `pg` driver adapter
- **Styling** — Tailwind CSS v4 (CSS-based config), Radix UI primitives with shadcn-style wrappers, Lucide icons
- **Other** — `next-themes`, `sonner` (toasts), `tsx` (scripts), ESLint 9 (flat config)

Planned but not wired up: NextAuth (auth), an AI provider (bullet rewriting, gap explanations, cover letters), Stripe (billing), a PDF/DOCX renderer for CV export.

## Setup

**Prerequisites:** Node.js 20+, npm, and a PostgreSQL database. The Prisma config expects a Neon-style split between a pooled and a direct connection URL; with plain PostgreSQL, set both to the same string.

1. Clone and install:

   ```bash
   git clone https://github.com/dekukoi/devprep.git
   cd devprep
   npm install
   ```

2. Create `.env.local` in the project root:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
   ```

   `DATABASE_URL` is used by the app at runtime; `DATABASE_URL_UNPOOLED` is used by the Prisma CLI for migrations. On Neon, use the pooled host for the first and the direct host for the second.

3. Apply migrations and seed the sample dataset:

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

   `prisma migrate dev` also generates the Prisma client into `src/generated/prisma` (gitignored), so run this before starting the app. The seed is idempotent.

4. (Optional) Verify the seed:

   ```bash
   npm run db:test
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open <http://localhost:3000>.

There is no login — the app resolves a single seeded demo user (`demo@devprep.io`) for all data. `npm run build` and `npm run lint` both pass if you want to check the production build.

## Project structure

```
src/
  app/            Routes (App Router), one page.tsx per screen
  components/     Feature-grouped React components + shared UI primitives
  lib/
    db/           Prisma-backed data loaders (Skill Bank, Experience, Projects)
    mock-data/    Sample fixtures for screens not yet migrated to the DB
    *-data.ts     Per-screen data shaping (types + joins)
prisma/
  schema.prisma   Data model
  migrations/      3 migrations
  seed.ts          Seeds a demo user + full sample dataset from src/lib/mock-data
context/          Planning docs, per-feature specs, design references
scripts/test-db.ts  Seed verification
```

`context/features/db-migration/` holds the chunked plan for moving the remaining screens from mock fixtures to the database; chunks 00–03 are done.

## Limitations / what's next

- **No persistence or auth.** Every create/edit/delete is local React state and resets on refresh; a single demo user is hard-coded. Next step: move writes to the database via Server Actions, then add NextAuth. The read-path migration is already in progress in `context/features/db-migration/`.
- **The comparison is not computed.** Fit scores, gap lists, and advice text are seeded sample data; only the advice-card rules and severity coloring run for real. Building the deterministic gap engine — a SQL join of Skill Bank proficiency against job-post requirements that produces the score and gap list — is the core remaining work.
- **No CV export, no job-description parsing.** The editor works on an in-memory draft with no PDF/DOCX output, and job requirements are entered by hand. The planned direction is a separate service that parses job posts and CVs and runs the comparison, with AI features layered on top using an AI model you configure rather than a bundled provider.
