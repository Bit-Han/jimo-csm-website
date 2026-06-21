// components/public/home/about-teaser-section.tsx
import Image from "next/image";
import type { AboutTeaserContent } from "@/lib/types/public-content";

export function AboutTeaserSection({
	content,
}: {
	content: AboutTeaserContent;
}) {
	return (
		<section className="bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
				<div>
					<h2 className="text-3xl font-extrabold text-brand-red leading-tight">
						{content.heading}
					</h2>
					<p className="text-gray-500 mt-4 max-w-md whitespace-pre-line">
						{content.body}
					</p>
				</div>
				<div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden">
					{content.imageUrl && (
						<Image
							src={content.imageUrl}
							alt=""
							fill
							className="object-cover"
						/>
					)}
				</div>
			</div>
		</section>
	);
}
