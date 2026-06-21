// src/components/ui/Select.tsx
// Pure Tailwind — uses the native <select> element for simplicity and reliability
import { cn } from "@/lib/utils/helpers";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
          "appearance-none bg-no-repeat",
          "focus:outline-none focus:ring-2 focus:ring-jimo-gold/40 focus:border-jimo-gold",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "transition-colors cursor-pointer",
          // Chevron arrow via background SVG
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")] bg-[position:right_12px_center]",
          "pr-9",
          error && "border-red-400 focus:ring-red-200 focus:border-red-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";