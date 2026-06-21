// components/public/projects/detail/ProjectGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type Props = {
	gallery: string[];
	projectName: string;
};

export default function ProjectGallery({ gallery, projectName }: Props) {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const displayed = gallery.slice(0, 4);
	const remaining = gallery.length - 4;

	return (
		<section className="w-full bg-[#f9f9f9] py-14 md:py-18">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
					Project Gallery
				</h2>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{displayed.map((src, i) => {
						const isLast = i === 3 && remaining > 0;
						return (
							<button
								key={i}
								onClick={() => setLightboxIndex(i)}
								className="relative aspect-[4/3] overflow-hidden rounded-sm group cursor-pointer"
							>
								<Image
									src={src}
									alt={`${projectName} gallery image ${i + 1}`}
									fill
									className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
									sizes="(max-width: 768px) 50vw, 25vw"
								/>
								{isLast && remaining > 0 && (
									<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
										<span className="text-white font-bold text-xl">
											+{remaining}
										</span>
									</div>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Lightbox */}
			{lightboxIndex !== null && (
				<div
					className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
					onClick={() => setLightboxIndex(null)}
				>
					<button
						className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
						onClick={() => setLightboxIndex(null)}
						aria-label="Close"
					>
						<X className="h-8 w-8" />
					</button>

					<div
						className="relative w-full max-w-4xl aspect-[16/10]"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={gallery[lightboxIndex]}
							alt={`${projectName} gallery image ${lightboxIndex + 1}`}
							fill
							className="object-contain"
							sizes="90vw"
						/>
					</div>

					{/* Prev / Next */}
					<div className="absolute bottom-6 flex items-center gap-3">
						{gallery.map((_, i) => (
							<button
								key={i}
								onClick={(e) => {
									e.stopPropagation();
									setLightboxIndex(i);
								}}
								className={`w-2 h-2 rounded-full transition-colors ${
									i === lightboxIndex ? "bg-white" : "bg-white/40"
								}`}
							/>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
