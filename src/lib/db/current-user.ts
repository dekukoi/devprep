import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

/**
 * Temporary shim standing in for a real session lookup — NextAuth isn't wired up
 * yet (`project-overview.md` Next Steps item 6), so every server-side data read
 * that needs "the current user" resolves to the seeded demo account instead.
 * Delete this file and swap every call site for the real session lookup once
 * NextAuth lands.
 */
const DEMO_USER_EMAIL = "demo@devprep.io";

export async function getCurrentUser(): Promise<User> {
  return prisma.user.findUniqueOrThrow({ where: { email: DEMO_USER_EMAIL } });
}

export async function getCurrentUserId(): Promise<string> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
  return user.id;
}
