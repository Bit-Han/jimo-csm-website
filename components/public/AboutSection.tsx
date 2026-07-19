//components/public/AboutSection
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { HomeAboutSection } from "@/lib/types/home";

export interface AboutSectionProps {
	data: HomeAboutSection;
}

export function AboutSection({ data }: AboutSectionProps) {
	return (
		<section className="bg-cream-100 py-20">
			<Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						{data.eyebrow}
					</p>
					<h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
						{data.heading}
					</h2>
				</div>
				<div>
					<p className="text-base leading-relaxed text-stone-600">
						{data.description}
					</p>
					<ButtonLink
						href={data.cta.href}
						variant="ghost"
						size="sm"
						className="mt-4 px-0 text-red-600 hover:bg-transparent hover:text-red-700"
					>
						{data.cta.label}
						<ArrowRight className="h-4 w-4" />
					</ButtonLink>
				</div>
			</Container>
		</section>
	);
}