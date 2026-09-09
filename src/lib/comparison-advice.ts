import type { ComparisonGap, GapSeverity } from "@/types/comparison";

type ActionableSeverity = Extract<GapSeverity, "missing" | "below">;

export interface AdviceItem {
  skillId: string;
  skillName: string;
  severity: ActionableSeverity;
  title: string;
  description: string;
}

interface AdviceCopy {
  title: string;
  description: string;
}

const CURATED: Record<string, Record<ActionableSeverity, AdviceCopy>> = {
  Kubernetes: {
    missing: {
      title: "Learn Kubernetes fundamentals",
      description:
        "Take a container-orchestration course and deploy a sample service to a managed cluster (EKS/GKE), then add it to your CV projects.",
    },
    below: {
      title: "Deepen Kubernetes",
      description: "Practice deploying and scaling a real workload, then document it as a CV project.",
    },
  },
  GraphQL: {
    missing: {
      title: "Add GraphQL to your stack",
      description: "Build a GraphQL layer over an existing REST API to demonstrate schema design and resolver patterns.",
    },
    below: {
      title: "Strengthen GraphQL",
      description: "Practice schema design and resolver patterns on an existing REST API.",
    },
  },
  PostgreSQL: {
    missing: {
      title: "Learn PostgreSQL fundamentals",
      description: "Build a project backed by PostgreSQL covering schema design, indexing, and migrations.",
    },
    below: {
      title: "Deepen PostgreSQL",
      description: "Practice indexing and query optimization; document a project using complex joins and schema migrations.",
    },
  },
  AWS: {
    missing: {
      title: "Learn AWS fundamentals",
      description: "Get hands-on with EC2, S3, and RDS through a personal project, then work toward the Solutions Architect – Associate cert.",
    },
    below: {
      title: "Strengthen AWS",
      description: "Target the Solutions Architect – Associate cert and highlight hands-on EC2 / S3 / RDS work.",
    },
  },
  Docker: {
    missing: {
      title: "Learn Docker fundamentals",
      description: "Containerize a personal project and publish the image to a registry.",
    },
    below: {
      title: "Improve Docker proficiency",
      description: "Containerize a personal project with multi-stage builds and publish the image to a registry.",
    },
  },
  Terraform: {
    missing: {
      title: "Learn Terraform fundamentals",
      description: "Provision a small project's infrastructure with Terraform and document the setup.",
    },
    below: {
      title: "Deepen Terraform",
      description: "Practice modules and remote state on a real project; document the infrastructure-as-code setup.",
    },
  },
  "System Design": {
    missing: {
      title: "Learn System Design fundamentals",
      description: "Practice designing a scalable system end-to-end and document the trade-offs you made.",
    },
    below: {
      title: "Strengthen System Design",
      description: "Practice designing a scalable system end-to-end and document the trade-offs you made.",
    },
  },
  Go: {
    missing: {
      title: "Learn Go fundamentals",
      description: "Build a project focused on concurrency and performance to establish a baseline.",
    },
    below: {
      title: "Deepen Go",
      description: "Build a project focused on concurrency and performance to reach the required depth.",
    },
  },
};

function lookupCurated(skillName: string): Record<ActionableSeverity, AdviceCopy> | null {
  const key = Object.keys(CURATED).find((name) => skillName.startsWith(name));
  return key ? CURATED[key] : null;
}

function genericAdvice(skillName: string, severity: ActionableSeverity): AdviceCopy {
  if (severity === "missing") {
    return {
      title: `Learn ${skillName} fundamentals`,
      description: `This role requires ${skillName} and it's not yet claimed in your Skill Bank — add a project or course that demonstrates hands-on experience.`,
    };
  }
  return {
    title: `Deepen ${skillName}`,
    description: `You're below the required level for ${skillName} — practice a focused project or exercise to close the gap.`,
  };
}

const SEVERITY_ORDER: Record<ActionableSeverity, number> = { missing: 0, below: 1 };

/** Rule-based advice, one card per non-met gap, missing-first then below-required, both sorted stably. */
export function buildAdviceItems(gaps: ComparisonGap[]): AdviceItem[] {
  return gaps
    .filter((gap): gap is ComparisonGap & { severity: ActionableSeverity } => gap.severity !== "met")
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
    .map((gap) => {
      const copy = lookupCurated(gap.skillName)?.[gap.severity] ?? genericAdvice(gap.skillName, gap.severity);
      return { skillId: gap.skillId, skillName: gap.skillName, severity: gap.severity, ...copy };
    });
}
