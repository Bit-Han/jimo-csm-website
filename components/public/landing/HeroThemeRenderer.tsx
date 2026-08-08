// // components/public/landing/HeroThemeRenderer.tsx
// "use client";

// import Image from "next/image";
// import type { LandingHeroContent } from "@/lib/types/landing-page";
// import { cn } from "@/lib/utils/helpers";

// const ACCENT_MAP: Record<
// 	LandingHeroContent["accentColor"],
// 	{ badge: string; button: string }
// > = {
// 	red: { badge: "bg-red-600", button: "bg-red-600 hover:bg-red-700" },
// 	gold: { badge: "bg-amber-500", button: "bg-amber-500 hover:bg-amber-600" },
// 	ink: { badge: "bg-ink-800", button: "bg-ink-800 hover:bg-ink-900" },
// };

// export interface HeroThemeRendererProps {
// 	hero: LandingHeroContent;
// 	onPrimaryCtaClick?: () => void;
// 	onSecondaryCtaClick?: () => void;
// 	formOverlay?: React.ReactNode; // rendered floating, mirrors the builder screenshot
// }

// export function HeroThemeRenderer({
// 	hero,
// 	onPrimaryCtaClick,
// 	onSecondaryCtaClick,
// 	formOverlay,
// }: HeroThemeRendererProps) {
// 	const accent = ACCENT_MAP[hero.accentColor];
// 	const isSplit =
// 		hero.theme === "split-image-left" || hero.theme === "split-image-right";
// 	const imageOnLeft = hero.theme === "split-image-left";

// 	const content = (
// 		<div className="relative z-10 flex flex-1 flex-col justify-center gap-5 px-6 py-16 sm:px-10 lg:py-24">
// 			{hero.eyebrow ? (
// 				<p className="text-sm font-semibold uppercase tracking-widest text-white/70">
// 					{hero.eyebrow}
// 				</p>
// 			) : null}
// 			{hero.badgeText ? (
// 				<span
// 					className={cn(
// 						"inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-white",
// 						accent.badge,
// 					)}
// 				>
// 					{hero.badgeText}
// 				</span>
// 			) : null}
// 			<h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
// 				{hero.headline || "Your headline goes here"}
// 			</h1>
// 			{hero.subheadline ? (
// 				<p className="max-w-xl text-base leading-relaxed text-white/80">
// 					{hero.subheadline}
// 				</p>
// 			) : null}
// 			<div className="mt-2 flex flex-wrap gap-3">
// 				<button
// 					type="button"
// 					onClick={onPrimaryCtaClick}
// 					className={cn(
// 						"rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors",
// 						accent.button,
// 					)}
// 				>
// 					{hero.primaryCta.label || "Register Interest"}
// 				</button>
// 				{hero.secondaryCta ? (
// 					<button
// 						type="button"
// 						onClick={onSecondaryCtaClick}
// 						className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
// 					>
// 						{hero.secondaryCta.label}
// 					</button>
// 				) : null}
// 			</div>
// 		</div>
// 	);

// 	return (
// 		<section className="relative min-h-[480px] w-full overflow-hidden bg-ink-950">
// 			<div
// 				className={cn(
// 					"flex min-h-[480px] w-full flex-col lg:flex-row",
// 					isSplit && imageOnLeft && "lg:flex-row-reverse",
// 				)}
// 			>
// 				{content}

// 				{isSplit ? (
// 					<div className="relative min-h-[280px] flex-1 lg:min-h-[480px]">
// 						{hero.backgroundImageUrl ? (
// 							<Image
// 								src={hero.backgroundImageUrl}
// 								alt={hero.backgroundImageAlt || ""}
// 								fill
// 								className="object-cover"
// 								sizes="(min-width: 1024px) 50vw, 100vw"
// 							/>
// 						) : (
// 							<div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-950" />
// 						)}
// 					</div>
// 				) : (
// 					// Centered theme — solid accent-tinted background behind the text,
// 					// no image slot at all. This is the theme with
// 					// requiresBackgroundImage: false.
// 					<div
// 						className={cn(
// 							"pointer-events-none absolute inset-0 -z-10 opacity-90",
// 							hero.accentColor === "red" && "bg-red-700",
// 							hero.accentColor === "gold" && "bg-amber-600",
// 							hero.accentColor === "ink" && "bg-ink-900",
// 						)}
// 					/>
// 				)}
// 			</div>

// 			{formOverlay ? (
// 				<div className="absolute right-6 top-1/2 z-20 hidden w-full max-w-sm -translate-y-1/2 lg:block">
// 					{formOverlay}
// 				</div>
// 			) : null}
// 		</section>
// 	);
// }


// components/public/landing/HeroThemeRenderer.tsx
"use client";

import Image from "next/image";
import { getSchemeMeta } from "@/lib/types/landing-page";
import type { LandingHeroContent } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils/helpers";

export interface HeroThemeRendererProps {
	hero: LandingHeroContent;
	onPrimaryCtaClick?: () => void;
	onSecondaryCtaClick?: () => void;
	formOverlay?: React.ReactNode;
}

export function HeroThemeRenderer({
	hero,
	onPrimaryCtaClick,
	onSecondaryCtaClick,
	formOverlay,
}: HeroThemeRendererProps) {
	const scheme = getSchemeMeta(hero.accentColor);
	// Defaults guard against pages saved before textColor/ctaPresentation
	// existed — old JSONB rows simply won't have these keys at runtime.
	const textColor = hero.textColor ?? "light";
	const isLight = textColor === "light";

	const headlineClass = isLight ? "text-white" : "text-ink-950";
	const subheadlineClass = isLight ? "text-white/80" : "text-stone-600";
	const eyebrowClass = isLight ? "text-white/70" : "text-stone-500";

	const primaryButtonClass =
		hero.accentColor === "gold"
			? "bg-ink-950 hover:bg-black text-white"
			: "bg-amber-500 hover:bg-amber-600 text-white";

	const secondaryButtonClass = isLight
		? "border border-white/30 text-white hover:bg-white/10"
		: "border border-ink-950/20 text-ink-950 hover:bg-ink-950/5";

	function TextBlock({ align = "left" }: { align?: "left" | "center" }) {
		return (
			<div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center")}>
				{hero.eyebrow ? (
					<p className={cn("text-sm font-semibold uppercase tracking-widest", eyebrowClass)}>
						{hero.eyebrow}
					</p>
				) : null}
				{hero.badgeText ? (
					<span
						className={cn(
							"inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm",
							scheme.badgeClassName,
						)}
					>
						{hero.badgeText}
					</span>
				) : null}
				<h1
					className={cn(
						"text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl",
						headlineClass,
					)}
				>
					{hero.headline || "Your headline goes here"}
				</h1>
				{hero.subheadline ? (
					<p
						className={cn(
							"max-w-xl text-base leading-relaxed sm:text-lg",
							subheadlineClass,
							align === "center" && "mx-auto",
						)}
					>
						{hero.subheadline}
					</p>
				) : null}
				<div className={cn("mt-2 flex flex-wrap gap-3", align === "center" && "justify-center")}>
					<button
						type="button"
						onClick={onPrimaryCtaClick}
						className={cn(
							"rounded-xl px-7 py-3.5 text-sm font-semibold shadow-lg transition-colors sm:text-base",
							primaryButtonClass,
						)}
					>
						{hero.primaryCta.label || "Register Interest"}
					</button>
					{hero.secondaryCta ? (
						<button
							type="button"
							onClick={onSecondaryCtaClick}
							className={cn(
								"rounded-xl px-7 py-3.5 text-sm font-semibold transition-colors sm:text-base",
								secondaryButtonClass,
							)}
						>
							{hero.secondaryCta.label}
						</button>
					) : null}
				</div>
			</div>
		);
	}

	function Orbs() {
		return (
			<>
				<div
					className={cn(
						"pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl sm:h-96 sm:w-96",
						scheme.orbClassNames[0],
					)}
				/>
				<div
					className={cn(
						"pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-30 blur-3xl sm:h-[28rem] sm:w-[28rem]",
						scheme.orbClassNames[1],
					)}
				/>
			</>
		);
	}

	// Mobile: shown in-flow right after the text (only meaningfully visible
	// for "Always Visible" CTA presentation — click-to-open presentations
	// never render a mobile inline block at all, see LandingPageClient).
	// Desktop: absolutely positioned, floating over the hero, position
	// varies per theme below.
	function MobileFormSlot() {
		if (!formOverlay) return null;
		return (
			<div id="lp-inline-form" className="mt-8 w-full lg:hidden">
				{formOverlay}
			</div>
		);
	}

	// ── Centered — no image, gradient + soft glow orbs ────────────────────
	if (hero.theme === "centered") {
		return (
			<section className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-6 py-16 sm:px-10">
				<div className={cn("absolute inset-0 bg-gradient-to-br", scheme.gradientClassName)} />
				<Orbs />
				<div className="relative z-10 w-full max-w-2xl">
					<TextBlock align="center" />
					<MobileFormSlot />
				</div>
				{formOverlay ? (
					<div className="absolute bottom-8 left-1/2 z-20 hidden w-full max-w-sm -translate-x-1/2 lg:block">
						{formOverlay}
					</div>
				) : null}
			</section>
		);
	}

	// ── Bold Gradient — no image, dotted texture + glass card ──────────────
	if (hero.theme === "bold-gradient") {
		return (
			<section className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-6 py-16 sm:px-10">
				<div className={cn("absolute inset-0 bg-gradient-to-br", scheme.gradientClassName)} />
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.08]"
					style={{
						backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<Orbs />
				<div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 px-8 py-10 shadow-2xl backdrop-blur-md sm:px-14 sm:py-16">
					<TextBlock align="center" />
					<MobileFormSlot />
				</div>
				{formOverlay ? (
					<div className="absolute bottom-8 right-8 z-20 hidden w-full max-w-sm lg:block">
						{formOverlay}
					</div>
				) : null}
			</section>
		);
	}

	// ── Fullscreen Photo — full-bleed image, content anchored at base ──────
	if (hero.theme === "fullscreen-image") {
		return (
			<section className="relative flex min-h-dvh w-full items-end overflow-hidden px-6 pb-16 pt-24 sm:px-10 sm:pb-20">
				<div className="absolute inset-0">
					{hero.backgroundImageUrl ? (
						<Image
							src={hero.backgroundImageUrl}
							alt={hero.backgroundImageAlt || ""}
							fill
							priority
							className="object-cover"
							sizes="100vw"
						/>
					) : (
						<div className={cn("h-full w-full bg-gradient-to-br", scheme.gradientClassName)} />
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
				</div>
				<div className="relative z-10 w-full max-w-2xl">
					<TextBlock align="left" />
					<MobileFormSlot />
				</div>
				{formOverlay ? (
					<div className="absolute right-8 top-1/2 z-20 hidden w-full max-w-sm -translate-y-1/2 lg:block">
						{formOverlay}
					</div>
				) : null}
			</section>
		);
	}

	// ── Split themes — gradient text panel + photo panel ───────────────────
	const imageOnLeft = hero.theme === "split-image-left";
	return (
		<section className="relative min-h-dvh w-full overflow-hidden">
			<div className={cn("flex min-h-dvh w-full flex-col lg:flex-row", imageOnLeft && "lg:flex-row-reverse")}>
				<div className="relative flex flex-1 flex-col justify-center overflow-hidden px-6 py-16 sm:px-10 lg:py-24">
					<div className={cn("absolute inset-0 bg-gradient-to-br", scheme.gradientClassName)} />
					<Orbs />
					<div className="relative z-10">
						<TextBlock align="left" />
						<MobileFormSlot />
					</div>
				</div>
				<div className="relative min-h-[280px] flex-1 lg:min-h-dvh">
					{hero.backgroundImageUrl ? (
						<Image
							src={hero.backgroundImageUrl}
							alt={hero.backgroundImageAlt || ""}
							fill
							priority
							className="object-cover"
							sizes="(min-width: 1024px) 50vw, 100vw"
						/>
					) : (
						<div className="h-full w-full bg-gradient-to-br from-ink-800 to-ink-950" />
					)}
				</div>
			</div>
			{formOverlay ? (
				<div className="absolute right-6 top-1/2 z-20 hidden w-full max-w-sm -translate-y-1/2 lg:block">
					{formOverlay}
				</div>
			) : null}
		</section>
	);
}