// src/components/shared/PageHeader.tsx
// Used at the top of every CMS page — title, subtitle, and optional action buttons
// Matches the pattern seen in all 19 design screenshots
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500 max-w-xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}