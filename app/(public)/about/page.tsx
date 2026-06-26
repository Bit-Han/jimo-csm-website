import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { HowWeWorkSection } from "@/components/public/HowWeWorkSection";
import { WhyChooseSection } from "@/components/public/WhyChooseSection";
import { TeamSection } from "@/components/public/about/TeamSection";
import { CtaBanner } from "@/components/public/CtaBanner";
import { coreValues, companyMissionVision } from "@/lib/data/company";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Jimo Property Development Limited builds premium residential, hospitality, and investment-led real estate with structure, insight, and long-term value.",
};

export default function AboutPage() {
  return (
		<>
			<section className="bg-cream-100 py-20">
				<Container className="max-w-3xl">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						About Jimo Development
					</p>
					<h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
						We build with integrity, precision, and long-term thinking.
					</h1>
					<p className="mt-4 text-base leading-relaxed text-stone-600">
						At Jimo Property Development Limited, every project is built on a
						foundation of integrity, precision, and long-term thinking. We do
						not just build structures; we create spaces that serve real people,
						support modern lifestyles, and generate lasting value for buyers,
						investors, and communities.
					</p>
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

			<section className="bg-cream-50 py-20">
				<Container className="grid gap-6 sm:grid-cols-2">
					<div className="rounded-3xl border border-stone-200 bg-white p-8">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
							Our Mission
						</p>
						<p className="mt-4 text-base leading-relaxed text-stone-600">
							{companyMissionVision.mission}
						</p>
					</div>
					<div className="rounded-3xl border border-stone-200 bg-white p-8">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
							Our Vision
						</p>
						<p className="mt-4 text-base leading-relaxed text-stone-600">
							{companyMissionVision.vision}
						</p>
					</div>
				</Container>
			</section>
			<TeamSection />
			<div id="why-choose-us">
				<WhyChooseSection />
			</div>

			<section className="bg-cream-100 py-20">
				<Container>
					<SectionHeading
						align="center"
						eyebrow="Core Values"
						title="What guides every development"
						className="mx-auto"
					/>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{coreValues.map(({ id, icon: Icon, title, description }) => (
							<div
								key={id}
								className="rounded-2xl border border-stone-200 bg-white p-6"
							>
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
									<Icon className="h-5 w-5" />
								</span>
								<h3 className="mt-5 text-base font-bold text-ink-950">
									{title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-stone-600">
									{description}
								</p>
							</div>
						))}
					</div>
				</Container>
			</section>

			<HowWeWorkSection />

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