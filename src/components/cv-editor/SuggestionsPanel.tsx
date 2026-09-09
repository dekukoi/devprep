import { ArrowUpDown, Check, PartyPopper, Plus, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CVSuggestion } from "@/types/cv";

const SUGGESTION_ICON = {
  sparkles: { Icon: Sparkles, color: "text-accent" },
  plus: { Icon: Plus, color: "text-sev-met" },
  "arrow-up-down": { Icon: ArrowUpDown, color: "text-accent" },
} as const;

interface SuggestionsPanelProps {
  suggestions: CVSuggestion[];
  onAccept: (suggestion: CVSuggestion) => void;
  onReject: (suggestion: CVSuggestion) => void;
}

export function SuggestionsPanel({ suggestions, onAccept, onReject }: SuggestionsPanelProps) {
  return (
    <div className="flex w-full shrink-0 flex-col">
      <div className="flex w-full shrink-0 items-start gap-5 border-b border-border-subtle px-4">
        <div className="flex shrink-0 items-center gap-1.5 border-b-2 border-accent py-3.5">
          <span className="text-[13px] font-semibold whitespace-nowrap text-text-primary">Suggestions</span>
          {suggestions.length > 0 && (
            <span className="flex shrink-0 items-center rounded-lg bg-accent px-1.5 py-px">
              <span className="text-[10px] font-bold whitespace-nowrap text-white">{suggestions.length}</span>
            </span>
          )}
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 p-8">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft">
            <PartyPopper className="size-[22px] text-sev-met" />
          </span>
          <span className="text-sm font-semibold whitespace-nowrap text-text-primary">You&rsquo;re all caught up</span>
          <p className="w-[260px] text-center text-[12.5px] leading-[19px] text-text-muted">
            No pending suggestions right now. New ones will appear here as we compare your CV against job posts.
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2.5 p-4">
          {suggestions.map((suggestion) => {
            const { Icon, color } = SUGGESTION_ICON[suggestion.icon];
            return (
              <div
                key={suggestion.id}
                className="flex w-full flex-col gap-2.5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-2 p-3"
              >
                <div className="flex shrink-0 items-center gap-2">
                  <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-accent-soft">
                    <Icon className={cn("size-3", color)} />
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.3px] whitespace-nowrap text-text-muted">
                    {suggestion.targetLabel}
                  </span>
                </div>
                <p className="w-full text-[12.5px] leading-[18px] text-text-secondary">{suggestion.description}</p>
                <div className="flex w-full shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReject(suggestion)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-sm)] bg-bg-elevated py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <X className="size-[13px] text-sev-missing" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => onAccept(suggestion)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-sm)] bg-accent py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Check className="size-[13px]" />
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
