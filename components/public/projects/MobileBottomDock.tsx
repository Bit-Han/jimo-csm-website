
"use client"

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Download, MessageCircle } from "lucide-react";
import { TrackedLink } from "@/components/public/tracking/TrackedLink";
import { ButtonLink, ButtonDesign } from "@/components/ui/Button";
import { cn } from "@/lib/utils/helpers";

export interface MobileBottomDockProps {
	whatsappHref: string;
	brochureHref: string;
	children: ReactNode;
	closingContent: ReactNode;
}

export function MobileBottomDock({
	whatsappHref,
	brochureHref,
	children,
	closingContent,
}: MobileBottomDockProps) {
	const startRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const sentinel = startRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.boundingClientRect.top <= 0),
			{ threshold: 0 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<div ref={startRef} className="h-px w-full pointer-events-none" />
			{children}
			{closingContent}

			<div
				aria-hidden={!isVisible}
				className={cn(
					"fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
					isVisible ? "translate-y-0" : "translate-y-full pointer-events-none",
				)}
			>
				{/* ButtonDesign handles outer layout spacing */}
				<ButtonDesign variant="accent" size="md" className="flex-1 p-0">
					<TrackedLink
						href={whatsappHref}
						eventName="whatsapp_click"
						metadata={{ sourcePage: "/project" }}
						className="flex h-full w-full items-center justify-center gap-2 px-4 py-2 font-medium"
					>
						<MessageCircle className="h-4 w-4" />{" "}
						{/* Removed flex-1 so it stays icon-sized */}
						WhatsApp
					</TrackedLink>
				</ButtonDesign>

				<ButtonLink
					href={brochureHref}
					variant="outline"
					size="md"
					className="flex-1"
				>
					<Download className="h-4 w-4" />
					Brochure
				</ButtonLink>
			</div>
		</>
	);
}
