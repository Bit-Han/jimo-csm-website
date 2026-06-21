// src/components/ui/Textarea.tsx
import { cn } from "@/lib/utils/helpers";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
          "placeholder:text-gray-400 resize-none",
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
Textarea.displayName = "Textarea";