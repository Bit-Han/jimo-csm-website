// "use client";

// import { useEffect, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import { Download } from "lucide-react";
// import { ButtonLink } from "@/components/ui/Button";
// import { cn } from "@/lib/utils/helpers";

// export interface MobileBottomDockProps {
// 	registerHref: string;
// 	brochureHref: string;
// 	/** Body content rendered between the hero and the closing CTA (Overview, Pricing, etc.). */
// 	middleContent: ReactNode;
// 	/** The page's final section — once this scrolls into view, the dock hands off to the facts panel. */
// 	closingContent: ReactNode;
// 	factsPanel: ReactNode;
// }

// export function MobileBottomDock({
// 	registerHref,
// 	brochureHref,
// 	middleContent,
// 	closingContent,
// 	factsPanel,
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

// 	const showActionBar = isPastStart && !isPastEnd;
// 	const showFactsPanel = isPastEnd;

// 	return (
// 		<>
// 			<div ref={startRef} />
// 			{middleContent}
// 			<div ref={endRef} />
// 			{closingContent}

// 			{/* Sticky CTA bar — visible while scrolling through the body sections, mobile only */}
// 			<div
// 				aria-hidden={!showActionBar}
// 				className={cn(
// 					"fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
// 					showActionBar
// 						? "translate-y-0"
// 						: "translate-y-full pointer-events-none",
// 				)}
// 			>
// 				<ButtonLink
// 					href={registerHref}
// 					variant="accent"
// 					size="md"
// 					className="flex-1"
// 				>
// 					Register Interest
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

// 			{/* Project Facts panel — takes over once the closing CTA is reached, mobile only */}
// 			<div
// 				aria-hidden={!showFactsPanel}
// 				className={cn(
// 					"fixed inset-x-0 bottom-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-3xl border-t border-stone-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
// 					showFactsPanel
// 						? "translate-y-0"
// 						: "translate-y-full pointer-events-none",
// 				)}
// 			>
// 				<span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-stone-200" />
// 				{factsPanel}
// 			</div>
// 		</>
// 	);
// }

"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils/helpers";

export interface MobileBottomDockProps {
	registerHref: string;
	brochureHref: string;
	/** The body content the bar should float above while scrolling through it. */
	children: ReactNode;
	/** The page's closing section — once this scrolls into view, the bar hides. */
	closingContent: ReactNode;
}

export function MobileBottomDock({
	registerHref,
	brochureHref,
	children,
	closingContent,
}: MobileBottomDockProps) {
	const startRef = useRef<HTMLDivElement>(null);
	const endRef = useRef<HTMLDivElement>(null);
	const [isPastStart, setIsPastStart] = useState(false);
	const [isPastEnd, setIsPastEnd] = useState(false);

	useEffect(() => {
		const startSentinel = startRef.current;
		const endSentinel = endRef.current;

		if (!startSentinel || !endSentinel) {
			return;
		}

		const startObserver = new IntersectionObserver(
			([entry]) => setIsPastStart(entry.boundingClientRect.top <= 0),
			{ threshold: 0 },
		);
		const endObserver = new IntersectionObserver(
			([entry]) => setIsPastEnd(entry.boundingClientRect.top <= 0),
			{ threshold: 0 },
		);

		startObserver.observe(startSentinel);
		endObserver.observe(endSentinel);

		return () => {
			startObserver.disconnect();
			endObserver.disconnect();
		};
	}, []);

	const isVisible = isPastStart && !isPastEnd;

	return (
		<>
			<div ref={startRef} />
			{children}
			<div ref={endRef} />
			{closingContent}

			<div
				aria-hidden={!isVisible}
				className={cn(
					"fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
					isVisible ? "translate-y-0" : "translate-y-full pointer-events-none",
				)}
			>
				<ButtonLink
					href={registerHref}
					variant="accent"
					size="md"
					className="flex-1"
				>
					Register Interest
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