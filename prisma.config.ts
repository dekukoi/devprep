import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// `.env.local` holds the real Neon credentials (pulled via `neon link`/`neon checkout`);
// load it after `.env` so it takes priority without needing to duplicate values.
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // This `url` is only used by the CLI (migrate/introspect/studio) — Prisma 7's
    // `Datasource` type has no `directUrl`. The app's runtime PrismaClient gets its
    // own pooled connection string directly (see src/lib/prisma.ts), independent of
    // this file. Neon recommends bypassing the pooler for schema migrations, so use
    // the direct (unpooled) URL here.
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
