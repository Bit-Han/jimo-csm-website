//@component/public/WhyChooseSection
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeIconMap } from "@/lib/data/home-icons";
import type { HomeWhyChooseSection } from "@/lib/types/home";

export interface WhyChooseSectionProps {
	data: HomeWhyChooseSection;
}

export function WhyChooseSection({ data }: WhyChooseSectionProps) {
	return (
		<section className="bg-ink-950 py-20">
			<Container>
				<SectionHeading
					align="center"
					tone="dark"
					eyebrow={data.eyebrow}
					title={data.heading}
					description={data.description}
				/>

				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{data.features.map(({ id, icon, title, description }) => {
						const Icon = homeIconMap[icon];
						return (
							<div key={id} className="rounded-2xl bg-white/5 p-6">
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
									<Icon className="h-5 w-5 text-white" />
								</span>
								<h3 className="mt-5 text-base font-bold text-white">{title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-white/60">
									{description}
								</p>
							</div>
						);
					})}
				</div>
			</Container>
		</section>
	);
}