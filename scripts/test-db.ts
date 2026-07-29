import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connected to the database successfully.");

    const [userCount, skillCategoryCount, skillCount, cvTemplateCount] = await Promise.all([
      prisma.user.count(),
      prisma.skillCategory.count(),
      prisma.skill.count(),
      prisma.cVTemplate.count(),
    ]);

    console.log({ userCount, skillCategoryCount, skillCount, cvTemplateCount });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Database test failed:", error);
  process.exit(1);
});
