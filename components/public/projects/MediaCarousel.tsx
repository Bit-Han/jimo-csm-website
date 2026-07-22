// @components/public/projects/MediaCarousel.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { ProjectMediaItem } from "@/lib/types/project-detail";

const AUTOPLAY_INTERVAL_MS = 5000;
const RESUME_DELAY_MS = 4000;

export interface MediaCarouselProps {
	items: ProjectMediaItem[];
}

export function MediaCarousel({ items }: MediaCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Any interaction — arrow, dot, or just touching/clicking the carousel —
	// pauses autoplay, then resumes it after a few seconds of inactivity.
	function pauseThenResume() {
		setIsPaused(true);

		if (resumeTimeoutRef.current) {
			clearTimeout(resumeTimeoutRef.current);
		}

		resumeTimeoutRef.current = setTimeout(() => {
			setIsPaused(false);
		}, RESUME_DELAY_MS);
	}

	useEffect(() => {
		if (isPaused || items.length <= 1) {
			return;
		}

		const interval = setInterval(() => {
			setActiveIndex((current) => (current + 1) % items.length);
		}, AUTOPLAY_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [isPaused, items.length]);

	useEffect(() => {
		return () => {
			if (resumeTimeoutRef.current) {
				clearTimeout(resumeTimeoutRef.current);
			}
		};
	}, []);

	if (items.length === 0) {
		return null;
	}

	const activeItem = items[activeIndex];

	function goTo(index: number) {
		setActiveIndex((index + items.length) % items.length);
		pauseThenResume();
	}

	return (
		<div
			onPointerDown={pauseThenResume}
			className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm sm:aspect-[16/9]"
		>
			{activeItem.type === "video" ? (
				<video
					key={activeItem.id}
					src={activeItem.src}
					poster={activeItem.poster}
					controls
					className="h-full w-full bg-ink-950 object-cover"
				/>
			) : (
				<Image
					key={activeItem.id}
					src={activeItem.src}
					alt={activeItem.alt}
					fill
					sizes="(min-width: 1024px) 700px, 100vw"
					className="object-cover"
				/>
			)}

			{items.length > 1 ? (
				<>
					<button
						type="button"
						aria-label="Previous slide"
						onClick={() => goTo(activeIndex - 1)}
						className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-md transition-colors hover:bg-white"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						type="button"
						aria-label="Next slide"
						onClick={() => goTo(activeIndex + 1)}
						className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-950 shadow-md transition-colors hover:bg-white"
					>
						<ChevronRight className="h-5 w-5" />
					</button>

					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/50 to-transparent" />
					<div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
						{items.map((item, index) => (
							<button
								key={item.id}
								type="button"
								aria-label={`Go to slide ${index + 1}`}
								onClick={() => goTo(index)}
								className={cn(
									"h-1.5 rounded-full transition-all",
									index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/50",
								)}
							/>
						))}
					</div>
				</>
			) : null}
		</div>
	);
}