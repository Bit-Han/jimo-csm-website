// app/admin/(dashboard)/news-insights/new/loading.tsx
export default function ArticleEditorLoading() {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="h-6 w-40 animate-pulse rounded bg-stone-200" />
					<div className="h-4 w-56 animate-pulse rounded bg-stone-100" />
				</div>
				<div className="flex items-center gap-2.5">
					<div className="h-10 w-24 animate-pulse rounded-xl bg-stone-100" />
					<div className="h-10 w-24 animate-pulse rounded-xl bg-red-100" />
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				<div className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6">
					<div className="h-12 w-full animate-pulse rounded-xl bg-stone-100" />
					<div className="h-20 w-full animate-pulse rounded-xl bg-stone-100" />
					<div className="aspect-[16/7] w-full animate-pulse rounded-xl bg-stone-100" />
					<div className="h-80 w-full animate-pulse rounded-xl bg-stone-100" />
				</div>
				<div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="h-10 w-full animate-pulse rounded-lg bg-stone-100"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
