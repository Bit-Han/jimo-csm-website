// src/components/ui/Input.tsx
// Pure Tailwind form input — matches the light search/filter inputs in screenshots
import { cn } from "@/lib/utils/helpers";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-jimo-gold/40 focus:border-jimo-gold",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "transition-colors",
          error && "border-red-400 focus:ring-red-200 focus:border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";