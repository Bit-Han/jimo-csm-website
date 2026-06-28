import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/helpers";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        completed: "bg-emerald-50 text-emerald-700",
        "under-development": "bg-red-50 text-red-700",
        concept: "bg-amber-50 text-amber-700",
        dark: "bg-white/10 text-white",
      },
      size: {
        sm: "px-3 py-1",
        md: "px-3.5 py-1.5",
      },
    },
    defaultVariants: {
      variant: "completed",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}