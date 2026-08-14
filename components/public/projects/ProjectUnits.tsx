// // components/public/projects/detail/ProjectCTABar.tsx
import { Building2, Home } from "lucide-react";
import type { ProjectUnit } from "@/lib/types/project-detail";

const unitIcons = {
  home: Home,
  building: Building2,
} as const;

export interface ProjectUnitsProps {
  units: ProjectUnit[];
}

export function ProjectUnits({ units }: ProjectUnitsProps) {
  return (
    <div className="space-y-4">
      {units.map((unit) => {
        const Icon = unitIcons[unit.icon];

        return (
          <div
            key={unit.id}
            className="flex flex-col gap-3 rounded-2xl border border-stone-200 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-red-600">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-base font-semibold text-ink-950">{unit.name}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-stone-600 sm:items-end">
              <span className="font-semibold text-ink-950">{unit.priceLabel}</span>
              <span>{unit.availabilityLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}