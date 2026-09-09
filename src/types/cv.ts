export type CVTemplateName = "Aurora" | "Slate" | "Mono";
export type TemplateVariant = "SINGLE_COLUMN" | "TWO_COLUMN";
export type TemplateFamily = "Modern" | "Classic" | "Minimal";

export interface CVTemplate {
  id: string;
  name: CVTemplateName;
  variant: TemplateVariant;
}

export interface CVContentExperience {
  company: string;
  title: string;
  dateRange: string;
  bullets: string[];
}

export interface CVContentProject {
  title: string;
  dateRange: string | null;
  bullets: string[];
}

export interface CVContent {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
  summary: string;
  experience: CVContentExperience[];
  /** Curated Project entries included in this draft, e.g. via the CV Curate Content step. Absent on older/hand-authored CVs. */
  projects?: CVContentProject[];
  skills: string[];
}

export interface CV {
  id: string;
  userId: string;
  templateId: string;
  jobPostId: string | null;
  title: string;
  draftContent: CVContent;
  latestVersionId: string | null;
  /** Field names in `draftContent` that have diverged from the Skill Bank since the CV was last synced. */
  staleFields?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CVVersion {
  id: string;
  cvId: string;
  versionNumber: number;
  content: CVContent;
  contentHash: string;
  renderedFileUrl: string | null;
  /** Short human-authored description of what changed in this version, shown in Version History. */
  note: string;
  createdAt: string;
}

export type CVSuggestionTarget = "summary" | "experience" | "skills";

/** A pending AI/gap-based suggestion shown in the CV Editor's Suggestions panel. */
export interface CVSuggestion {
  id: string;
  cvId: string;
  target: CVSuggestionTarget;
  /** Right-rail card label, e.g. "SUMMARY" or "EXPERIENCE · LUMEN". */
  targetLabel: string;
  icon: "sparkles" | "plus" | "arrow-up-down";
  description: string;
  /** For target === "experience": which entry (by index into CVContent.experience) the suggested bullet is shown inline under. */
  experienceIndex?: number;
  /** For target === "experience": the suggested bullet text, appended to that entry's bullets on accept. */
  bulletText?: string;
  /** For target === "skills": skill names to move to the front of CVContent.skills on accept. */
  reorderSkillsFirst?: string[];
}
