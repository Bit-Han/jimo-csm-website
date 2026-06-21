// src/components/shared/FilterBar.tsx
// Horizontal row of filter inputs that sit above the DataTable on list pages
// Matches the filter rows seen in screenshots: Projects, Leads, Landing Pages, etc.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2.5 border-b border-gray-200 bg-white px-5 py-3",
        className
      )}
    >
      {children}
    </div>
  );
}

// A pre-styled text search input for use inside FilterBar
interface FilterSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function FilterSearch({ value, onChange, placeholder = "Search...", className }: FilterSearchProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800",
        "placeholder:text-gray-400 min-w-[160px]",
        "focus:outline-none focus:border-jimo-gold focus:ring-1 focus:ring-jimo-gold/30",
        "transition-colors",
        className
      )}
    />
  );
}

// A pre-styled select filter for use inside FilterBar
interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export function FilterSelect({ value, onChange, options, className }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-8 rounded-lg border border-gray-200 bg-white pl-3 pr-7 text-sm text-gray-700",
        "appearance-none cursor-pointer",
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")] bg-no-repeat bg-[position:right_8px_center]",
        "focus:outline-none focus:border-jimo-gold focus:ring-1 focus:ring-jimo-gold/30",
        "transition-colors",
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}