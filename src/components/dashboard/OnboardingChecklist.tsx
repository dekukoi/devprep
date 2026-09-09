import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface OnboardingStep {
  number: number;
  title: string;
  description: string;
  href: string;
}

const STEPS: OnboardingStep[] = [
  {
    number: 1,
    title: "Add your skills",
    description: "Populate your Skill Bank so we know what you bring to the table.",
    href: "/skill-bank/languages",
  },
  {
    number: 2,
    title: "Paste a job post",
    description: "Drop in a job description and we'll extract its requirements.",
    href: "/job-posts",
  },
  {
    number: 3,
    title: "Generate a CV",
    description: "Get a tailored CV built from your matched skills.",
    href: "/cvs",
  },
];

export function OnboardingChecklist() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-[640px] flex-col gap-6 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-8">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-semibold text-text-primary">Welcome to DevPrep</h2>
          <p className="text-sm text-text-secondary">Finish these steps to unlock your first fit comparison.</p>
        </div>
        <div className="flex flex-col gap-3">
          {STEPS.map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className="flex items-center gap-4 rounded-[var(--radius-md)] bg-bg-surface-2 p-4 transition-colors hover:bg-border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent text-[15px] font-bold text-accent">
                {step.number}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-text-primary">{step.title}</span>
                <span className="text-xs text-text-secondary">{step.description}</span>
              </div>
              <ChevronRight className="size-[18px] shrink-0 text-text-muted" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
