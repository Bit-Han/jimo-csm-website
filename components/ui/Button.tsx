// src/components/ui/Button.tsx
// Pure Tailwind — no Radix, no shadcn
// Variants match the design: primary (gold), secondary (white/border), danger, ghost, navy
import { cn } from "@/lib/utils/helpers";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "navy";
type Size    = "sm" | "md" | "lg" | "icon";

const VARIANT: Record<Variant, string> = {
  primary:   "bg-jimo-gold text-jimo-navy hover:bg-jimo-gold-dark font-semibold",
  secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-semibold",
  danger:    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold",
  ghost:     "text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium",
  navy:      "bg-jimo-navy text-white hover:bg-jimo-navy-2 font-semibold",
};

const SIZE: Record<Size, string> = {
  sm:   "h-7 px-3 text-xs rounded-md gap-1.5",
  md:   "h-9 px-4 text-sm rounded-lg gap-2",
  lg:   "h-10 px-5 text-sm rounded-lg gap-2",
  icon: "h-9 w-9 rounded-lg justify-center",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-jimo-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
        VARIANT[variant],
        SIZE[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
);
Button.displayName = "Button";