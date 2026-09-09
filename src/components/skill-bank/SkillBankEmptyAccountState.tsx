import { Layers, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkillBankEmptyAccountStateProps {
  onImportClick: () => void;
  onAddManuallyClick: () => void;
}

export function SkillBankEmptyAccountState({ onImportClick, onAddManuallyClick }: SkillBankEmptyAccountStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <Layers className="size-14 text-text-muted" />
      <h3 className="text-xl font-semibold text-text-primary">Your Skill Bank is empty</h3>
      <p className="max-w-[420px] text-sm text-text-secondary">
        Import your skills from an existing resume, or add them one at a time to start tracking proficiency and
        experience.
      </p>
      <div className="flex flex-col items-center gap-3">
        <Button size="lg" className="px-7 py-3.5 text-[15px]" onClick={onImportClick}>
          <Upload />
          Import from existing CV
        </Button>
        <button
          type="button"
          onClick={onAddManuallyClick}
          className="flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Plus className="size-3.5" />
          Add skill manually
        </button>
      </div>
    </div>
  );
}
