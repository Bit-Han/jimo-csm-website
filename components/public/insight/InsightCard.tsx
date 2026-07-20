import Image from "next/image";
import Link from "next/link";
import { AuthorAvatar } from "@/components/admin/ui/AuthorAvatar";
import { formatDate } from "@/lib/utils/helpers";
import type { InsightSummary } from "@/lib/types/insight";

export interface InsightCardProps {
	insight: InsightSummary;
}

export function InsightCard({ insight }: InsightCardProps) {
	return (
		<article className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
			<Link
				href={`/insights/${insight.slug}`}
				className="relative block aspect-[16/10] overflow-hidden bg-stone-100"
			>
				{insight.coverImage.src ? (
					<Image
						src={insight.coverImage.src}
						alt={insight.coverImage.alt}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
						No cover image
					</div>
				)}
			</Link>

			<div className="flex flex-1 flex-col gap-3 p-6">
				<span className="inline-flex w-fit rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
					{insight.categoryLabel}
				</span>
				<h3 className="text-lg font-bold text-ink-950">
					<Link
						href={`/insights/${insight.slug}`}
						className="hover:text-red-600"
					>
						{insight.title}
					</Link>
				</h3>
				<p className="text-sm leading-relaxed text-stone-600">
					{insight.excerpt}
				</p>

				<div className="mt-auto flex items-center gap-2 pt-1">
					<AuthorAvatar
						name={insight.author.name}
						avatarUrl={insight.author.avatarUrl}
						size={40}
					/>
					<p className="text-xs font-medium text-stone-500">
						{insight.author.name}
					</p>
				</div>
				<p className="text-xs font-medium text-stone-500">
					{formatDate(insight.publishedAt)} &middot; {insight.readTimeMinutes}{" "}
					min read
				</p>
			</div>
		</article>
	);
}


