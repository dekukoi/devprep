-- AlterTable
ALTER TABLE "cv_versions" ADD COLUMN     "note" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "cvs" ADD COLUMN     "staleFields" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "job_post_requirements" ADD COLUMN     "mustHave" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "job_posts" ADD COLUMN     "employmentType" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "salaryRange" TEXT,
ADD COLUMN     "seniority" TEXT;

-- AlterTable
ALTER TABLE "skill_bank_entries" ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "unresolved_requirements" (
    "id" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,

    CONSTRAINT "unresolved_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "unresolved_requirements_jobPostId_idx" ON "unresolved_requirements"("jobPostId");

-- AddForeignKey
ALTER TABLE "unresolved_requirements" ADD CONSTRAINT "unresolved_requirements_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "job_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
