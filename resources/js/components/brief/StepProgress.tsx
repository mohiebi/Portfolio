import { Check } from "lucide-react";
import { useBrief } from "@/components/brief/BriefProvider";
import { Progress } from "@/components/ui/progress";
import type { BriefStep } from "@/lib/brief";

type StepProgressProps = {
  steps: BriefStep[];
  current: number;
  onGo: (index: number) => void;
};

export function StepProgress({ steps, current, onGo }: StepProgressProps) {
  const { copy, n } = useBrief();
  const percentage = Math.round(((current + 1) / steps.length) * 100);
  const currentTitle = copy.steps[steps[current].id].title;

  return (
    <div className="grid gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary rtl:tracking-normal">
          {copy.progress.stepOf(n(current + 1), n(steps.length))}
        </p>
        <p className="text-sm text-muted-foreground">{currentTitle}</p>
      </div>

      {/* Mirrored in right-to-left pages so the bar fills from the right. */}
      <Progress
        value={percentage}
        className="rtl:-scale-x-100"
        aria-label={copy.progress.ariaLabel(n(current + 1), n(steps.length))}
      />

      <ol className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const title = copy.steps[step.id].title;

          return (
            <li key={step.id} className="min-w-0">
              <button
                type="button"
                onClick={() => onGo(index)}
                disabled={index > current}
                aria-current={active ? "step" : undefined}
                aria-label={done ? `${title} (${copy.progress.completed})` : title}
                className="group flex w-full flex-col items-center gap-1.5 text-center disabled:cursor-default"
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : done
                        ? "border-primary/50 bg-primary/10 text-primary group-hover:bg-primary/20"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden="true" /> : n(index + 1)}
                </span>
                <span
                  className={`hidden w-full truncate text-xs sm:block ${active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
