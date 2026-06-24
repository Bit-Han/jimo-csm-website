// import { Container } from "@/components/ui/Container";
// import { ButtonLink } from "@/components/ui/Button";
// import { siteConfig } from "@/lib/data/site";

// export function CtaSection() {
//   return (
//     <section className="relative overflow-hidden bg-ink-950 py-20">
//       <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-maroon-950 via-ink-950 to-ink-950" />
//       <Container className="relative max-w-3xl text-center">
//         <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
//           Start a Conversation
//         </p>
//         <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
//           Interested in buying, investing or partnering with Jimo?
//         </h2>
//         <p className="mt-4 text-base leading-relaxed text-white/60">
//           Our team is available to discuss current projects, upcoming developments, and
//           partnership opportunities.
//         </p>

//         <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
//           <ButtonLink href={siteConfig.registerInterestHref} variant="accent" size="lg">
//             Register Interest
//           </ButtonLink>
//           <ButtonLink href="/contact" variant="light" size="lg">
//             Speak With Our Team
//           </ButtonLink>
//         </div>
//       </Container>
//     </section>
//   );
// }

import { CtaBanner } from "./CtaBanner";
import { siteConfig } from "@/lib/data/site";

export function CtaSection() {
	return (
		<CtaBanner
			eyebrow="Start a Conversation"
			title="Interested in buying, investing or partnering with Jimo?"
			description="Our team is available to discuss current projects, upcoming developments, and partnership opportunities."
			primaryCta={{
				label: "Register Interest",
				href: siteConfig.registerInterestHref,
			}}
			secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
		/>
	);
}