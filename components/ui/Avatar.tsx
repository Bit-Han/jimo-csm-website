// src/components/ui/Avatar.tsx
// Pure Tailwind avatar — shows image if available, else initials on gold background
import { cn } from "@/lib/utils/helpers";
import { getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-full overflow-hidden flex items-center justify-center font-bold",
        "bg-jimo-gold text-jimo-navy",
        SIZE[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}