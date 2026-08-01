
// "use client";

// import { useEffect, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import { Download, MessageCircle } from "lucide-react";
// // import { getPublicSiteSettings } from "@/lib/db/queries/site-settings";
// import { TrackedLink } from "@/components/public/tracking/TrackedLink";
// import { ButtonLink } from "@/components/ui/Button";
// import { cn } from "@/lib/utils/helpers";

// export interface MobileBottomDockProps {
// 	whatsappHref: string;
// 	brochureHref: string;
// 	/** The body content the bar should float above while scrolling through it. */
// 	children: ReactNode;
// 	/** The page's closing section — rendered after children, no longer a hide trigger. */
// 	closingContent: ReactNode;
// }

// export function MobileBottomDock({
// 	whatsappHref,
// 	brochureHref,
// 	children,
// 	closingContent,
// }: MobileBottomDockProps) {
// 	const startRef = useRef<HTMLDivElement>(null);
// 	const [isPastStart, setIsPastStart] = useState(false);

// 	useEffect(() => {
// 		const startSentinel = startRef.current;

// 		if (!startSentinel) {
// 			return;
// 		}

// 		const startObserver = new IntersectionObserver(
// 			([entry]) => setIsPastStart(entry.boundingClientRect.top <= 0),
// 			{ threshold: 0 },
// 		);

// 		startObserver.observe(startSentinel);

// 		return () => startObserver.disconnect();
// 	}, []);

// 	return (
// 		<>
// 			<div ref={startRef} />
// 			{children}
// 			{closingContent}

// 			{/* Once visible, stays fixed through the rest of the page — including over the footer — on mobile only. */}
// 			<div
// 				aria-hidden={!isPastStart}
// 				className={cn(
// 					"fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
// 					isPastStart
// 						? "translate-y-0"
// 						: "translate-y-full pointer-events-none",
// 				)}
// 			>
// 				{/* <ButtonLink
// 					href={whatsappHref}
// 					target="_blank"
// 					rel="noopener noreferrer"
// 					variant="accent"
// 					size="md"
// 					className="flex-1"
// 				>
// 					<MessageCircle className="h-4 w-4" />
// 					WhatsApp
// 				</ButtonLink> */}
// 				<ButtonLink href={whatsappHref}>
// 					<TrackedLink
// 						href={whatsappHref}
// 						eventName="whatsapp_click"
// 						metadata={{ sourcePage: "/contact" }}
// 						className="font-medium text-ink-950 hover:text-red-600"
// 					>
// 						<MessageCircle className="h-4 w-4" />
// 						WhatsApp
// 					</TrackedLink>
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


// "use client";

// import { useEffect, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import { Download, MessageCircle } from "lucide-react";
// import { TrackedLink } from "@/components/public/tracking/TrackedLink";
// import { ButtonLink, ButtonDesign } from "@/components/ui/Button";
// import { cn } from "@/lib/utils/helpers";

// export interface MobileBottomDockProps {
// 	whatsappHref: string;
// 	brochureHref: string;
// 	children: ReactNode;
// 	closingContent: ReactNode;
// }

// export function MobileBottomDock({
// 	whatsappHref,
// 	brochureHref,
// 	children,
// 	closingContent,
// }: MobileBottomDockProps) {
// 	const startRef = useRef<HTMLDivElement>(null);
// 	const [isVisible, setIsVisible] = useState(false);

// 	useEffect(() => {
// 		const sentinel = startRef.current;
// 		if (!sentinel) return;

// 		// Clean modern fix: Check if the top of the sentinel left the screen
// 		const observer = new IntersectionObserver(
// 			([entry]) => setIsVisible(entry.boundingClientRect.top <= 0),
// 			{ threshold: 0 },
// 		);

// 		observer.observe(sentinel);
// 		return () => observer.disconnect();
// 	}, []);

// 	return (
// 		<>
// 			<div ref={startRef} className="h-px w-full pointer-events-none" />
// 			{children}
// 			{closingContent}

// 			<div
// 				aria-hidden={!isVisible}
// 				className={cn(
// 					"fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
// 					isVisible ? "translate-y-0" : "translate-y-full pointer-events-none",
// 				)}
// 			>
// 				{/* SMART FIX: Replaced nested nested anchor tags with one clean tracking link */}
				
// 					<ButtonDesign
// 						variant="accent"
// 						size="md"
// 						className="flex-1"
// 					>
// 					<TrackedLink
// 					href={whatsappHref}
// 					eventName="whatsapp_click"
// 					metadata={{ sourcePage: "/project" }}
					
// 				>
// 					<MessageCircle className="h-4 w-4" />
// 						WhatsApp
// 					</TrackedLink>
// 					</ButtonDesign>
				
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
				<ButtonDesign
					variant="accent"
					size="md"
					className="flex-1 p-0" // Removed inner padding here so TrackedLink can safely fill the space
				>
					{/* FIX: Made this a flex container to align items perfectly on the same line */}
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
