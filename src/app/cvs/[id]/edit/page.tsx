import { notFound } from "next/navigation";
import { CvEditorView } from "@/components/cv-editor";
import { cvStaleSkillDetails, cvSuggestions, cvVersions, cvs, jobPosts, skillBankEntries, skills } from "@/lib/mock-data";

function titleCase(value: string) {
  return value[0] + value.slice(1).toLowerCase();
}

interface CvEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CvEditPage({ params }: CvEditPageProps) {
  const { id } = await params;
  const cv = cvs.find((c) => c.id === id);
  if (!cv) notFound();

  const jobPost = cv.jobPostId ? jobPosts.find((job) => job.id === cv.jobPostId) : undefined;
  const jobPostLabel = jobPost ? `Tailored to ${jobPost.company ?? jobPost.title}${cv.draftContent.role ? ` · ${cv.draftContent.role}` : ""}` : null;
  const jobPostHref = jobPost ? `/job-posts/${jobPost.id}` : null;

  const versions = cvVersions.filter((v) => v.cvId === cv.id);
  const suggestions = cvSuggestions.filter((s) => s.cvId === cv.id);

  const staleSkillDetail = cvStaleSkillDetails.find((d) => d.cvId === cv.id);
  let staleSkillTooltip: string | null = null;
  if (staleSkillDetail) {
    const skill = skills.find((s) => s.name === staleSkillDetail.skillName);
    const entry = skill ? skillBankEntries.find((e) => e.skillId === skill.id) : undefined;
    if (entry) {
      const level = titleCase(entry.proficiencyLevel);
      const years = entry.yearsOfExperience ? ` (${entry.yearsOfExperience} yr${entry.yearsOfExperience === 1 ? "" : "s"})` : "";
      staleSkillTooltip = `Your Skill Bank currently lists ${staleSkillDetail.skillName} as ${level}${years}. This CV's Skills section hasn't synced since. Sync to update.`;
    }
  }

  return (
    <CvEditorView
      cv={{ id: cv.id, title: cv.title, draftContent: cv.draftContent }}
      jobPostLabel={jobPostLabel}
      jobPostHref={jobPostHref}
      jobPostCompany={jobPost?.company ?? null}
      versions={versions}
      suggestions={suggestions}
      staleSkillName={staleSkillDetail?.skillName ?? null}
      staleSkillTooltip={staleSkillTooltip}
      lastSavedAt={cv.updatedAt}
    />
  );
}
