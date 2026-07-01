// "use client";

// import { useEffect, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import { Download, MessageCircle } from "lucide-react";
// import { ButtonLink } from "@/components/ui/Button";
// import { cn } from "@/lib/utils/helpers";

// export interface MobileBottomDockProps {
// 	whatsappHref: string;
// 	brochureHref: string;
// 	/** The body content the bar should float above while scrolling through it. */
// 	children: ReactNode;
// 	/** The page's closing section — once this scrolls into view, the bar hides. */
// 	closingContent: ReactNode;
// }

// export function MobileBottomDock({
// 	whatsappHref,
// 	brochureHref,
// 	children,
// 	closingContent,
// }: MobileBottomDockProps) {
// 	const startRef = useRef<HTMLDivElement>(null);
// 	const endRef = useRef<HTMLDivElement>(null);
// 	const [isPastStart, setIsPastStart] = useState(false);
// 	const [isPastEnd, setIsPastEnd] = useState(false);

// 	useEffect(() => {
// 		const startSentinel = startRef.current;
// 		const endSentinel = endRef.current;

// 		if (!startSentinel || !endSentinel) {
// 			return;
// 		}

// 		const startObserver = new IntersectionObserver(
// 			([entry]) => setIsPastStart(entry.boundingClientRect.top <= 0),
// 			{ threshold: 0 },
// 		);
// 		const endObserver = new IntersectionObserver(
// 			([entry]) => setIsPastEnd(entry.boundingClientRect.top <= 0),
// 			{ threshold: 0 },
// 		);

// 		startObserver.observe(startSentinel);
// 		endObserver.observe(endSentinel);

// 		return () => {
// 			startObserver.disconnect();
// 			endObserver.disconnect();
// 		};
// 	}, []);

// 	const isVisible = isPastStart && !isPastEnd;

// 	return (
// 		<>
// 			<div ref={startRef} />
// 			{children}
// 			<div ref={endRef} />
// 			{closingContent}

// 			<div
// 				aria-hidden={!isVisible}
// 				className={cn(
// 					"fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
// 					isVisible ? "translate-y-0" : "translate-y-full pointer-events-none",
// 				)}
// 			>
// 				<ButtonLink
// 					href={whatsappHref}
// 					target="_blank"
// 					rel="noopener noreferrer"
// 					variant="accent"
// 					size="md"
// 					className="flex-1"
// 				>
// 					<MessageCircle className="h-4 w-4" />
// 					WhatsApp
// 				</ButtonLink>
// 				<ButtonLink
// 					href={brochureHref}
// 					variant="outline"
// 					size="md"
// 					className="flex-1"
// 				>
// 					<Download className="h-4 w-4" />
// 					Brochure
// 				</ButtonLink>
// 			</div>
// 		</>
// 	);
// }

"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Download, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils/helpers";

export interface MobileBottomDockProps {
	whatsappHref: string;
	brochureHref: string;
	/** The body content the bar should float above while scrolling through it. */
	children: ReactNode;
	/** The page's closing section — rendered after children, no longer a hide trigger. */
	closingContent: ReactNode;
}

export function MobileBottomDock({
	whatsappHref,
	brochureHref,
	children,
	closingContent,
}: MobileBottomDockProps) {
	const startRef = useRef<HTMLDivElement>(null);
	const [isPastStart, setIsPastStart] = useState(false);

	useEffect(() => {
		const startSentinel = startRef.current;

		if (!startSentinel) {
			return;
		}

		const startObserver = new IntersectionObserver(
			([entry]) => setIsPastStart(entry.boundingClientRect.top <= 0),
			{ threshold: 0 },
		);

		startObserver.observe(startSentinel);

		return () => startObserver.disconnect();
	}, []);

	return (
		<>
			<div ref={startRef} />
			{children}
			{closingContent}

			{/* Once visible, stays fixed through the rest of the page — including over the footer — on mobile only. */}
			<div
				aria-hidden={!isPastStart}
				className={cn(
					"fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
					isPastStart
						? "translate-y-0"
						: "translate-y-full pointer-events-none",
				)}
			>
				<ButtonLink
					href={whatsappHref}
					target="_blank"
					rel="noopener noreferrer"
					variant="accent"
					size="md"
					className="flex-1"
				>
					<MessageCircle className="h-4 w-4" />
					WhatsApp
				</ButtonLink>
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