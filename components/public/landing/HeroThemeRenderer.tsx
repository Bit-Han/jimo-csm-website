// components/public/landing/HeroThemeRenderer.tsx
"use client";

import Image from "next/image";
import type { LandingHeroContent } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils/helpers";

const ACCENT_MAP: Record<
	LandingHeroContent["accentColor"],
	{ badge: string; button: string }
> = {
	red: { badge: "bg-red-600", button: "bg-red-600 hover:bg-red-700" },
	gold: { badge: "bg-amber-500", button: "bg-amber-500 hover:bg-amber-600" },
	ink: { badge: "bg-ink-800", button: "bg-ink-800 hover:bg-ink-900" },
};

export interface HeroThemeRendererProps {
	hero: LandingHeroContent;
	onPrimaryCtaClick?: () => void;
	onSecondaryCtaClick?: () => void;
	formOverlay?: React.ReactNode; // rendered floating, mirrors the builder screenshot
}

export function HeroThemeRenderer({
	hero,
	onPrimaryCtaClick,
	onSecondaryCtaClick,
	formOverlay,
}: HeroThemeRendererProps) {
	const accent = ACCENT_MAP[hero.accentColor];
	const isSplit =
		hero.theme === "split-image-left" || hero.theme === "split-image-right";
	const imageOnLeft = hero.theme === "split-image-left";

	const content = (
		<div className="relative z-10 flex flex-1 flex-col justify-center gap-5 px-6 py-16 sm:px-10 lg:py-24">
			{hero.eyebrow ? (
				<p className="text-sm font-semibold uppercase tracking-widest text-white/70">
					{hero.eyebrow}
				</p>
			) : null}
			{hero.badgeText ? (
				<span
					className={cn(
						"inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-white",
						accent.badge,
					)}
				>
					{hero.badgeText}
				</span>
			) : null}
			<h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
				{hero.headline || "Your headline goes here"}
			</h1>
			{hero.subheadline ? (
				<p className="max-w-xl text-base leading-relaxed text-white/80">
					{hero.subheadline}
				</p>
			) : null}
			<div className="mt-2 flex flex-wrap gap-3">
				<button
					type="button"
					onClick={onPrimaryCtaClick}
					className={cn(
						"rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors",
						accent.button,
					)}
				>
					{hero.primaryCta.label || "Register Interest"}
				</button>
				{hero.secondaryCta ? (
					<button
						type="button"
						onClick={onSecondaryCtaClick}
						className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
					>
						{hero.secondaryCta.label}
					</button>
				) : null}
			</div>
		</div>
	);

	return (
		<section className="relative min-h-[480px] w-full overflow-hidden bg-ink-950">
			<div
				className={cn(
					"flex min-h-[480px] w-full flex-col lg:flex-row",
					isSplit && imageOnLeft && "lg:flex-row-reverse",
				)}
			>
				{content}

				{isSplit ? (
					<div className="relative min-h-[280px] flex-1 lg:min-h-[480px]">
						{hero.backgroundImageUrl ? (
							<Image
								src={hero.backgroundImageUrl}
								alt={hero.backgroundImageAlt || ""}
								fill
								className="object-cover"
								sizes="(min-width: 1024px) 50vw, 100vw"
							/>
						) : (
							<div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-950" />
						)}
					</div>
				) : (
					// Centered theme — solid accent-tinted background behind the text,
					// no image slot at all. This is the theme with
					// requiresBackgroundImage: false.
					<div
						className={cn(
							"pointer-events-none absolute inset-0 -z-10 opacity-90",
							hero.accentColor === "red" && "bg-red-700",
							hero.accentColor === "gold" && "bg-amber-600",
							hero.accentColor === "ink" && "bg-ink-900",
						)}
					/>
				)}
			</div>

			{formOverlay ? (
				<div className="absolute right-6 top-1/2 z-20 hidden w-full max-w-sm -translate-y-1/2 lg:block">
					{formOverlay}
				</div>
			) : null}
		</section>
	);
}
