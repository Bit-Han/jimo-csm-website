import Link from "next/link";
import { cn } from "@/lib/utils/helpers";
import { BookOpen, FileSearch, LayoutDashboard } from "lucide-react";
import type { AdminProjectSummaryStats } from "@/lib/types/admin/project";

interface SummaryCardConfig {
	title: string;
	count: number;
	note: string;
	href: string;
	Icon: typeof BookOpen;
	iconBgClass: string;
	iconColorClass: string;
}

export function ProjectSummaryCards({
	stats,
}: {
	stats: AdminProjectSummaryStats;
}) {
	const cards: SummaryCardConfig[] = [
		{
			title: "Projects Missing Brochure",
			count: stats.missingBrochure,
			note: stats.missingBrochureNote,
			href: "/admin/brochures",
			Icon: BookOpen,
			iconBgClass: "bg-orange-50",
			iconColorClass: "text-orange-500",
		},
		{
			title: "Projects Missing SEO",
			count: stats.missingSeo,
			note: stats.missingSeoNote,
			href: "/admin/seo-centre",
			Icon: FileSearch,
			iconBgClass: "bg-violet-50",
			iconColorClass: "text-violet-500",
		},
		{
			title: "Draft Projects",
			count: stats.draftProjects,
			note: stats.draftProjectsNote,
			href: "/admin/projects",
			Icon: LayoutDashboard,
			iconBgClass: "bg-stone-100",
			iconColorClass: "text-stone-500",
		},
	];

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			{cards.map(
				({ title, count, note, href, Icon, iconBgClass, iconColorClass }) => (
					<Link
						key={title}
						href={href}
						className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-sm"
					>
						<span
							className={cn(
								"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
								iconBgClass,
							)}
						>
							<Icon className={cn("h-5 w-5", iconColorClass)} />
						</span>
						<div>
							<p className="text-xs font-medium text-stone-500">{title}</p>
							<p className="mt-0.5 text-3xl font-bold text-ink-950">{count}</p>
							<p className="mt-0.5 text-xs text-stone-400">{note}</p>
						</div>
					</Link>
				),
			)}
		</div>
	);
}
