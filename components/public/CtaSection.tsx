import { CtaBanner } from "@/components/public/CtaBanner";
import type { HomeCtaSection } from "@/lib/types/home";

export interface CtaSectionProps {
	data: HomeCtaSection;
}

export function CtaSection({ data }: CtaSectionProps) {
	return (
		<CtaBanner
			eyebrow={data.eyebrow}
			title={data.heading}
			description={data.description}
			primaryCta={data.primaryCta}
			secondaryCta={data.secondaryCta}
		/>
	);
}