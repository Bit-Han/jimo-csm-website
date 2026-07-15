// import type { Metadata } from "next";
// import { Check } from "lucide-react";
// import { Container } from "@/components/ui/Container";
// import { CtaBanner } from "@/components/public/CtaBanner";
// import {
// 	companyPromise,
// 	companyServices,
// 	propertyTypeCategories,
// } from "@/lib/data/company";
// import { siteConfig } from "@/lib/data/site";

// export const metadata: Metadata = {
// 	title: "Our Services",
// 	description:
// 		"Real estate development, joint venture partnerships, development management, and investment structuring from Jimo Property Development Limited.",
// };

// export default function ServicesPage() {
// 	return (
// 		<>
// 			<section className="bg-cream-100 py-20">
// 				<Container className="max-w-3xl">
// 					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
// 						Our Services
// 					</p>
// 					<h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
// 						What we do
// 					</h1>
// 					<p className="mt-4 text-base leading-relaxed text-stone-600">
// 						From land partnerships to full project delivery, here is how we take
// 						a development from concept to handover.
// 					</p>
// 				</Container>
// 			</section>

// 			<section className="bg-cream-50 py-20">
// 				<Container>
// 					<div className="grid gap-6 lg:grid-cols-2">
// 						{companyServices.map(
// 							({ id, icon: Icon, title, description, bullets }) => (
// 								<div
// 									key={id}
// 									className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
// 								>
// 									<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
// 										<Icon className="h-5 w-5" />
// 									</span>
// 									<h3 className="mt-5 text-lg font-bold text-ink-950">
// 										{title}
// 									</h3>
// 									<p className="mt-2 text-sm leading-relaxed text-stone-600">
// 										{description}
// 									</p>

// 									<ul className="mt-5 space-y-2.5">
// 										{bullets.map((bullet) => (
// 											<li
// 												key={bullet.id}
// 												className="flex items-start gap-2.5 text-sm text-stone-600"
// 											>
// 												<Check className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
// 												<span>{bullet.label}</span>
// 											</li>
// 										))}
// 									</ul>
// 								</div>
// 							),
// 						)}
// 					</div>
// 				</Container>
// 			</section>

// 			<section className="bg-cream-100 py-20">
// 				<Container>
// 					<p className="mx-auto max-w-2xl text-center text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
// 						What We Develop
// 					</p>
// 					<h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
// 						Property types we focus on
// 					</h2>

// 					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
// 						{propertyTypeCategories.map(
// 							({ id, icon: Icon, title, description }) => (
// 								<div
// 									key={id}
// 									className="rounded-2xl border border-stone-200 bg-white p-6"
// 								>
// 									<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
// 										<Icon className="h-5 w-5" />
// 									</span>
// 									<h3 className="mt-5 text-base font-bold text-ink-950">
// 										{title}
// 									</h3>
// 									<p className="mt-2 text-sm leading-relaxed text-stone-600">
// 										{description}
// 									</p>
// 								</div>
// 							),
// 						)}
// 					</div>
// 				</Container>
// 			</section>

// 			<section className="bg-ink-950 py-16">
// 				<Container className="max-w-2xl text-center">
// 					{companyPromise.lines.map((line) => (
// 						<p key={line} className="text-2xl font-bold text-white sm:text-3xl">
// 							{line}
// 						</p>
// 					))}
// 					<p className="mt-4 text-base text-white/60">
// 						{companyPromise.description}
// 					</p>
// 				</Container>
// 			</section>

// 			<CtaBanner
// 				eyebrow="Start a Conversation"
// 				title="Have a project, land, or partnership in mind?"
// 				description="Tell us what you are working on and our team will help you figure out the right structure."
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
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/public/CtaBanner";
import { getCompanyContent } from "@/lib/db/queries/content";
import { companyIconMap } from "@/lib/data/company-icons";
import { siteConfig } from "@/lib/data/site";
import type { CompanyIconKey } from "@/lib/data/company-icons";

import {
	companyServices as fallbackServices,
	propertyTypeCategories as fallbackPropertyTypes,
	companyPromise as fallbackPromise,
} from "@/lib/data/company";

export const metadata: Metadata = {
	title: "Our Services",
	description:
		"Real estate development, joint venture partnerships, development management, and investment structuring from Jimo Property Development Limited.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
	const companyData = await getCompanyContent();

	// Resolve DB data with fallbacks
	const services =
		companyData?.services ??
		fallbackServices.map((s) => ({
			id: s.id,
			icon: "building2",
			title: s.title,
			description: s.description,
			bullets: s.bullets,
		}));

	const propertyTypes =
		companyData?.propertyTypes ??
		fallbackPropertyTypes.map((p) => ({
			id: p.id,
			icon: "home",
			title: p.title,
			description: p.description,
		}));

	const promise = companyData?.companyPromise ?? fallbackPromise;

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
						From land partnerships to full project delivery, here is how we take
						a development from concept to handover.
					</p>
				</Container>
			</section>

			<section className="bg-cream-50 py-20">
				<Container>
					<div className="grid gap-6 lg:grid-cols-2">
						{services.map((service) => {
							const Icon =
								companyIconMap[service.icon as CompanyIconKey] ??
								companyIconMap["building2"];
							return (
								<div
									key={service.id}
									className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
								>
									<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
										<Icon className="h-5 w-5" />
									</span>
									<h3 className="mt-5 text-lg font-bold text-ink-950">
										{service.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-stone-600">
										{service.description}
									</p>
									<ul className="mt-5 space-y-2.5">
										{service.bullets.map((bullet) => (
											<li
												key={bullet.id}
												className="flex items-start gap-2.5 text-sm text-stone-600"
											>
												<Check className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
												<span>{bullet.label}</span>
											</li>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				</Container>
			</section>

			<section className="bg-cream-100 py-20">
				<Container>
					<p className="mx-auto max-w-2xl text-center text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
						What We Develop
					</p>
					<h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
						Property types we focus on
					</h2>

					<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{propertyTypes.map((type) => {
							const Icon =
								companyIconMap[type.icon as CompanyIconKey] ??
								companyIconMap["home"];
							return (
								<div
									key={type.id}
									className="rounded-2xl border border-stone-200 bg-white p-6"
								>
									<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
										<Icon className="h-5 w-5" />
									</span>
									<h3 className="mt-5 text-base font-bold text-ink-950">
										{type.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-stone-600">
										{type.description}
									</p>
								</div>
							);
						})}
					</div>
				</Container>
			</section>

			{/* Company promise */}
			<section className="bg-ink-950 py-16">
				<Container className="max-w-2xl text-center">
					{promise.lines.map((line) => (
						<p key={line} className="text-2xl font-bold text-white sm:text-3xl">
							{line}
						</p>
					))}
					<p className="mt-4 text-base text-white/60">{promise.description}</p>
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