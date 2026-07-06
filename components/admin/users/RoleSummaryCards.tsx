import { cn } from "@/lib/utils/helpers";
import type { RoleSummaryCard } from "@/lib/types/admin/users-roles";

export function RoleSummaryCards({ cards }: { cards: RoleSummaryCard[] }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{cards.map((card) => (
				<div
					key={card.role}
					className={cn("rounded-2xl border p-5", card.colorClass)}
				>
					<span
						className={cn(
							"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
							card.colorClass,
							card.textClass,
						)}
					>
						{card.label}
					</span>
					<p className="mt-3 text-4xl font-bold text-ink-950">{card.count}</p>
					<p className="mt-1 text-xs text-stone-500">{card.description}</p>
				</div>
			))}
		</div>
	);
}
