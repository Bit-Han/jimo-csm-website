import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { ProjectProgressStep } from "@/lib/types/project-detail";

export interface ProgressStepperProps {
  steps: ProjectProgressStep[];
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <ol className="grid gap-6 sm:grid-cols-5">
      {steps.map((step) => (
        <li key={step.stage} className="flex flex-col items-center gap-2 text-center">
          {step.isComplete ? (
            <CheckCircle2 className="h-6 w-6 text-red-600" />
          ) : (
            <Circle className="h-6 w-6 text-stone-300" />
          )}
          <span
            className={cn(
              "text-xs font-semibold",
              step.isComplete ? "text-ink-950" : "text-stone-400",
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}