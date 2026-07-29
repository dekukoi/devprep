# DevPrep

A platform for developers to prepare for technical interviews.

## Context Files

Read the following to get the full context of the project:
@AGENTS.md

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/ai-design-with-pen-interactions.md
- @context/current-feature.md

## Commands

- `npm run dev` — start the dev server (Turbopack, the Next 16 default) at http://localhost:3000
- `npm run build` — production build (also Turbopack by default; a custom `webpack` config in `next.config.ts` will fail the build unless run with `--webpack`)
- `npm run start` — serve the production build
- `npm run lint` — ESLint via the flat config in `eslint.config.mjs`

There is no test suite configured in this project yet.
