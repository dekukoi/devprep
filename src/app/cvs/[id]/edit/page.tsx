import { notFound } from "next/navigation";
import { CvEditorView } from "@/components/cv-editor";
import { buildDraftCvContent } from "@/lib/cv-curate-data";
import { cvStaleSkillDetails, cvSuggestions, cvVersions, cvs, jobPosts, skillBankEntries, skills } from "@/lib/mock-data";
import type { CVVersion } from "@/types/cv";

function titleCase(value: string) {
  return value[0] + value.slice(1).toLowerCase();
}

interface CvEditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ jobPostId?: string; exp?: string; proj?: string }>;
}

export default async function CvEditPage({ params, searchParams }: CvEditPageProps) {
  const { id } = await params;

  if (id === "draft") {
    const { jobPostId, exp, proj } = await searchParams;
    const draft = jobPostId
      ? buildDraftCvContent(jobPostId, exp ? exp.split(",").filter(Boolean) : [], proj ? proj.split(",").filter(Boolean) : [])
      : null;
    if (!draft) notFound();

    const now = new Date().toISOString();
    const version: CVVersion = {
      id: "cvv-draft-1",
      cvId: "draft",
      versionNumber: 1,
      content: draft.draftContent,
      contentHash: "hash-draft-1",
      renderedFileUrl: null,
      note: "Initial draft curated from Experience & Projects",
      createdAt: now,
    };

    return (
      <CvEditorView
        cv={{ id: "draft", title: draft.title, draftContent: draft.draftContent }}
        jobPostLabel={`Tailored to ${draft.jobPost.company ?? draft.jobPost.title}`}
        jobPostHref={`/job-posts/${draft.jobPost.id}`}
        jobPostCompany={draft.jobPost.company}
        versions={[version]}
        suggestions={[]}
        staleSkillName={null}
        staleSkillTooltip={null}
        lastSavedAt={now}
      />
    );
  }

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
