import Link from "next/link";
import { cn } from "@/lib/utils/helpers";

export interface LogoProps {
	className?: string;
	surface?: "on-light" | "on-dark";
}

export function Logo({ className, surface = "on-light" }: LogoProps) {
	return (
		<Link href="/" className={cn("flex items-center gap-3", className)}>
			<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white">
				J
			</span>
			<span className="flex flex-col leading-tight">
				<span
					className={cn(
						"text-base font-bold",
						surface === "on-light" ? "text-ink-950" : "text-white",
					)}
				>
					Jimo
				</span>
				<span
					className={cn(
						"text-xs",
						surface === "on-light" ? "text-stone-600" : "text-white/60",
					)}
				>
					Property Development
				</span>
			</span>
		</Link>
	);
}
