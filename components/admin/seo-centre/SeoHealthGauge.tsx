import { cn } from "@/lib/utils/helpers";

export function SeoHealthGauge({ score }: { score: number }) {
	const radius = 40;
	const circumference = 2 * Math.PI * radius;
	const filled = circumference * (score / 100);

	const label =
		score >= 90
			? "Excellent — keep it up!"
			: score >= 75
				? "Your site is in good shape. Keep fixing issues to reach excellent."
				: "Several issues need attention.";

	const colorClass =
		score >= 90
			? "text-emerald-600"
			: score >= 75
				? "text-emerald-500"
				: "text-amber-500";

	const strokeColor =
		score >= 90 ? "#10b981" : score >= 75 ? "#34d399" : "#f59e0b";

	return (
		<div className="flex items-center gap-6">
			<div className="relative shrink-0">
				<svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						stroke="#f0ede8"
						strokeWidth="10"
					/>
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						stroke={strokeColor}
						strokeWidth="10"
						strokeLinecap="round"
						strokeDasharray={`${filled} ${circumference}`}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className={cn("text-2xl font-bold", colorClass)}>{score}%</span>
				</div>
			</div>
			<div>
				<p className="text-base font-bold text-ink-950">SEO Health Score</p>
				<p className="mt-1 max-w-[180px] text-xs leading-relaxed text-stone-500">
					{label}
				</p>
			</div>
		</div>
	);
}
