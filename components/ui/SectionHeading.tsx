import { cn } from "@/lib/utils/helpers";

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          tone === "light" ? "text-red-600" : "text-red-400",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 text-3xl font-bold tracking-tight sm:text-4xl",
          tone === "light" ? "text-ink-950" : "text-white",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            tone === "light" ? "text-stone-600" : "text-white/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}