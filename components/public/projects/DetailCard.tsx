import type { ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

export interface DetailCardProps {
	title: string;
	children: ReactNode;
	className?: string;
}

export function DetailCard({ title, children, className }: DetailCardProps) {
	return (
		<section
			className={cn(
				"rounded-3xl border border-stone-200 bg-white p-6 sm:p-8",
				className,
			)}
		>
			<h2 className="text-xl font-bold text-ink-950">{title}</h2>
			<div className="mt-4">{children}</div>
		</section>
	);
}
