import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/public/CtaBanner";
import { companyServices } from "@/lib/data/company";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = {
	title: "Our Services",
	description:
		"Real estate development, advisory, project marketing and sales, property management, and joint venture opportunities from Jimo Property Development Limited.",
};

export default function ServicesPage() {
	return (
		<>
			<section className="bg-cream-100 py-20">
				<Container className="max-w-3xl">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						Our Services
					</p>
					<h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
						What we do
					</h1>
					<p className="mt-4 text-base leading-relaxed text-stone-600">
						From site selection to handover and beyond, we offer a structured
						set of services for buyers, investors, landowners, and partners.
					</p>
				</Container>
			</section>

			<section className="bg-cream-50 py-20">
				<Container>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{companyServices.map(({ id, icon: Icon, title, description }) => (
							<div
								key={id}
								className="rounded-3xl border border-stone-200 bg-white p-6"
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

			<CtaBanner
				eyebrow="Start a Conversation"
				title="Have a project, land, or partnership in mind?"
				description="Tell us what you are working on and our team will help you figure out the right structure."
				primaryCta={{
					label: "Register Interest",
					href: siteConfig.registerInterestHref,
				}}
				secondaryCta={{ label: "Speak With Our Team", href: "/contact" }}
			/>
		</>
	);
}
