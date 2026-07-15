// import type { Metadata } from "next";
// import { Container } from "@/components/ui/Container";
// import { ButtonLink } from "@/components/ui/Button";
// import { TeamSection } from "@/components/public/about/TeamSection";

// import { CtaBanner } from "@/components/public/CtaBanner";
// import { coreValues, whoWeAre } from "@/lib/data/company";
// import { siteConfig } from "@/lib/data/site";

// export const metadata: Metadata = {
// 	title: "About Us",
// 	description: whoWeAre.highlight,
// };

// export default function AboutPage() {
// 	return (
// 		<>
// 			<section className="bg-cream-100 py-20">
// 				<Container className="max-w-3xl">
// 					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
// 						{whoWeAre.eyebrow}
// 					</p>
// 					<h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
// 						{whoWeAre.heading}
// 					</h1>

// 					<div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-base font-medium leading-relaxed text-red-800">
// 						{whoWeAre.highlight}
// 					</div>

// 					<div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600">
// 						{whoWeAre.paragraphs.map((paragraph) => (
// 							<p key={paragraph}>{paragraph}</p>
// 						))}
// 					</div>

// 					<ButtonLink
// 						href="/services"
// 						variant="outline"
// 						size="md"
// 						className="mt-6"
// 					>
// 						View Our Services
// 					</ButtonLink>
// 				</Container>
// 			</section>

// 			<TeamSection />

// 			{/* <div id="why-choose-us">
// 				<WhyChooseSection data={whyChoose} />
// 			</div> */}

// 			<section className="bg-cream-100 py-20">
// 				<Container>
// 					<p className="mx-auto max-w-2xl text-center text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
// 						Our Values
// 					</p>
// 					<h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
// 						What guides every development
// 					</h2>

// 					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
// 						{coreValues.map(({ id, icon: Icon, title, description }) => (
// 							<div
// 								key={id}
// 								className="rounded-2xl border border-stone-200 bg-white p-6"
// 							>
// 								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
// 									<Icon className="h-5 w-5" />
// 								</span>
// 								<h3 className="mt-5 text-base font-bold text-ink-950">
// 									{title}
// 								</h3>
// 								<p className="mt-2 text-sm leading-relaxed text-stone-600">
// 									{description}
// 								</p>
// 							</div>
// 						))}
// 					</div>
// 				</Container>
// 			</section>

// 			{/* <HowWeWorkSection data={howWeWork} /> */}

// 			<CtaBanner
// 				eyebrow="Start a Conversation"
// 				title="Want to learn more about how we work?"
// 				description="Speak with our team about current projects, partnership opportunities, or how we structure a development from start to finish."
// 				primaryCta={{
// 					label: "Register Interest",
// 					href: siteConfig.registerInterestHref,
// 				}}
// 				secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
// 			/>
// 		</>
// 	);
// }

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { TeamSection } from "@/components/public/about/TeamSection";
import { HowWeWorkSection } from "@/components/public/HowWeWorkSection";
import { WhyChooseSection } from "@/components/public/WhyChooseSection";
import { CtaBanner } from "@/components/public/CtaBanner";
import {
	getCompanyContent,
	getHomePageContent,
} from "@/lib/db/queries/content";
import { companyIconMap } from "@/lib/data/company-icons";
import { siteConfig } from "@/lib/data/site";
import type { CompanyIconKey } from "@/lib/data/company-icons";

// Fallback data in case DB is not yet seeded
import {
	coreValues as fallbackCoreValues,
	whoWeAre as fallbackWhoWeAre,
} from "@/lib/data/company";

export const metadata: Metadata = {
	title: "About Us",
	description:
		"Jimo Property Development Limited builds premium residential, hospitality, and investment-led real estate with structure, insight, and long-term value.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
	const [companyData, homeData] = await Promise.all([
		getCompanyContent(),
		getHomePageContent(),
	]);

	const whoWeAre = companyData?.whoWeAre ?? fallbackWhoWeAre;
	const coreValues =
		companyData?.coreValues ??
		fallbackCoreValues.map((v) => ({
			id: v.id,
			icon: "compass",
			title: v.title,
			description: v.description,
		}));
	const teamMembers = companyData?.teamMembers ?? [];

	return (
		<>
			<section className="bg-cream-100 py-20">
				<Container className="max-w-3xl">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						{whoWeAre.eyebrow}
					</p>
					<h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
						{whoWeAre.heading}
					</h1>

					<div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-base font-medium leading-relaxed text-red-800">
						{whoWeAre.highlight}
					</div>

					<div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600">
						{whoWeAre.paragraphs.map((paragraph, i) => (
							<p key={i}>{paragraph}</p>
						))}
					</div>

					<ButtonLink
						href="/services"
						variant="outline"
						size="md"
						className="mt-6"
					>
						View Our Services
					</ButtonLink>
				</Container>
			</section>

			{/* Team section — driven by company_content.teamMembers */}
			{teamMembers.length > 0 ? (
				<TeamSection
					members={teamMembers.map((m) => ({
						id: m.id,
						name: m.name,
						role: m.role,
						bio: m.bio,
						photo: m.photo,
					}))}
				/>
			) : null}

			<div id="why-choose-us">
				<WhyChooseSection data={homeData.whyChoose} />
			</div>

			{/* Core values — icons resolved from string keys */}
			<section className="bg-cream-100 py-20">
				<Container>
					<p className="mx-auto max-w-2xl text-center text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						Our Values
					</p>
					<h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
						What guides every development
					</h2>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{coreValues.map((value) => {
							const Icon =
								companyIconMap[value.icon as CompanyIconKey] ??
								companyIconMap["compass"];
							return (
								<div
									key={value.id}
									className="rounded-2xl border border-stone-200 bg-white p-6"
								>
									<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
										<Icon className="h-5 w-5" />
									</span>
									<h3 className="mt-5 text-base font-bold text-ink-950">
										{value.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-stone-600">
										{value.description}
									</p>
								</div>
							);
						})}
					</div>
				</Container>
			</section>

			<HowWeWorkSection data={homeData.howWeWork} />

			<CtaBanner
				eyebrow="Start a Conversation"
				title="Want to learn more about how we work?"
				description="Speak with our team about current projects, partnership opportunities, or how we structure a development from start to finish."
				primaryCta={{
					label: "Register Interest",
					href: siteConfig.registerInterestHref,
				}}
				secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
			/>
		</>
	);
}