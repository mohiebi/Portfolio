import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { BriefStep } from "@/lib/brief";

type StepProgressProps = {
  steps: BriefStep[];
  current: number;
  onGo: (index: number) => void;
};

export function StepProgress({ steps, current, onGo }: StepProgressProps) {
  const percentage = Math.round(((current + 1) / steps.length) * 100);

  return (
    <div className="grid gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">
          Step {current + 1} of {steps.length}
        </p>
        <p className="text-sm text-muted-foreground">{steps[current].title}</p>
      </div>

      <Progress value={percentage} aria-label={`Brief progress: step ${current + 1} of ${steps.length}`} />

      <ol className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;

          return (
            <li key={step.id} className="min-w-0">
              <button
                type="button"
                onClick={() => onGo(index)}
                disabled={index > current}
                aria-current={active ? "step" : undefined}
                aria-label={`${step.title}${done ? " (completed)" : ""}`}
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
                  {done ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={`hidden w-full truncate text-xs sm:block ${active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
