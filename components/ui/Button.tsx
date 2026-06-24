// import { cva, type VariantProps } from "class-variance-authority";
// import Link from "next/link";
// import type { ComponentPropsWithoutRef } from "react";
// import { cn } from "@/lib/utils/helpers";

// export const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         primary: "bg-ink-950 text-cream-50 hover:bg-ink-900",
//         accent: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
//         outline:
//           "border border-ink-950 bg-transparent text-ink-950 hover:bg-ink-950 hover:text-cream-50",
//         soft: "bg-red-50 text-red-700 hover:bg-red-100",
//         ghost: "bg-transparent text-ink-950 hover:bg-ink-950/5",
//         light: "bg-white text-ink-950 hover:bg-cream-100",
//       },
//       size: {
//         sm: "px-4 py-2 text-sm",
//         md: "px-5 py-2.5 text-sm",
//         lg: "px-6 py-3 text-base",
//       },
//     },
//     defaultVariants: {
//       variant: "primary",
//       size: "md",
//     },
//   },
// );

// export interface ButtonProps
//   extends ComponentPropsWithoutRef<"button">,
//     VariantProps<typeof buttonVariants> {}

// export function Button({ className, variant, size, ...props }: ButtonProps) {
//   return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
// }

// export interface ButtonLinkProps
//   extends ComponentPropsWithoutRef<typeof Link>,
//     VariantProps<typeof buttonVariants> {}

// export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
//   return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
// }



import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/helpers";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink-950 text-cream-50 hover:bg-ink-900",
        accent: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline:
          "border border-ink-950 bg-transparent text-ink-950 hover:bg-ink-950 hover:text-cream-50",
        "outline-light":
          "border border-white/40 bg-transparent text-white hover:bg-white hover:text-ink-950",
        soft: "bg-red-50 text-red-700 hover:bg-red-100",
        ghost: "bg-transparent text-ink-950 hover:bg-ink-950/5",
        light: "bg-white text-ink-950 hover:bg-cream-100",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export interface ButtonLinkProps
  extends ComponentPropsWithoutRef<typeof Link>,
    VariantProps<typeof buttonVariants> {}

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}