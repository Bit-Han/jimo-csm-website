//@component/public/HowWeWorkSection
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { HomeHowWeWorkSection } from "@/lib/types/home";

export interface HowWeWorkSectionProps {
	data: HomeHowWeWorkSection;
}

export function HowWeWorkSection({ data }: HowWeWorkSectionProps) {
	return (
		<section className="bg-cream-50 py-20">
			<Container>
				<SectionHeading
					align="center"
					eyebrow={data.eyebrow}
					title={data.heading}
					description={data.description}
				/>

				<div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{data.steps.map((step) => (
						<div
							key={step.id}
							className="rounded-2xl border border-stone-200 bg-white p-6"
						>
							<p className="text-sm font-bold text-red-600">{step.number}</p>
							<p className="mt-2 text-base font-semibold text-ink-950">
								{step.title}
							</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}