// import { CtaBanner } from "./CtaBanner";
// import { siteConfig } from "@/lib/data/site";

// export function CtaSection() {
// 	return (
// 		<CtaBanner
// 			eyebrow="Start a Conversation"
// 			title="Interested in buying, investing or partnering with Jimo?"
// 			description="Our team is available to discuss current projects, upcoming developments, and partnership opportunities."
// 			primaryCta={{
// 				label: "Register Interest",
// 				href: siteConfig.registerInterestHref,
// 			}}
// 			secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
// 		/>
// 	);
// }

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