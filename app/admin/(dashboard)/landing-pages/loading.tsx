// app/admin/(dashboard)/landing-pages/loading.tsx
export default function LandingPagesLoading() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<div className="h-6 w-48 animate-pulse rounded bg-stone-200" />
					<div className="h-4 w-96 max-w-full animate-pulse rounded bg-stone-100" />
				</div>
				<div className="h-10 w-44 animate-pulse rounded-xl bg-stone-200" />
			</div>

			<div className="flex flex-wrap gap-3">
				<div className="h-9 w-56 animate-pulse rounded-lg bg-stone-100" />
				<div className="h-9 w-32 animate-pulse rounded-lg bg-stone-100" />
				<div className="h-9 w-32 animate-pulse rounded-lg bg-stone-100" />
				<div className="h-9 w-32 animate-pulse rounded-lg bg-stone-100" />
			</div>

			<div className="space-y-3 md:hidden">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="h-28 animate-pulse rounded-2xl border border-stone-200 bg-stone-50"
					/>
				))}
			</div>

			<div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white md:block">
				<div className="h-11 border-b border-stone-100 bg-stone-50/60" />
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className="flex h-16 items-center gap-6 border-b border-stone-100 px-6 last:border-none"
					>
						<div className="h-4 w-44 animate-pulse rounded bg-stone-200" />
						<div className="h-4 w-24 animate-pulse rounded bg-stone-100" />
						<div className="h-4 w-32 animate-pulse rounded bg-stone-100" />
						<div className="h-5 w-16 animate-pulse rounded-full bg-stone-100" />
					</div>
				))}
			</div>
		</div>
	);
}
