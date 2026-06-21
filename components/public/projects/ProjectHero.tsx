// components/public/projects/detail/ProjectHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, FileDown, Play } from "lucide-react";
import {
	type SeedProject,
	formatNaira,
	getListingLabel,
	getConstructionLabel,
} from "@/lib/data/seed-projects";

type Props = { project: SeedProject };

export default function ProjectHero({ project }: Props) {
	const listingLabel = getListingLabel(project.listingType);
	const constructionLabel = getConstructionLabel(project.constructionStatus);

	function handleWhatsApp() {
		const msg = encodeURIComponent(
			`Hi, I'm interested in ${project.name}. Please share more details.`,
		);
		window.open(
			`https://wa.me/${project.whatsappNumber.replace(/\D/g, "")}?text=${msg}`,
			"_blank",
		);
	}

	function handleCall() {
		window.location.href = `tel:${project.callNumber}`;
	}

	return (
		<section className="relative w-full min-h-[560px] md:min-h-[680px] overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0">
				<Image
					src={project.heroImageUrl}
					alt={project.name}
					fill
					priority
					className="object-cover object-center"
					sizes="100vw"
				/>
				{/* Dark gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
					{/* Left — Project Info */}
					<div className="flex flex-col justify-center min-h-[400px] md:min-h-[500px] py-4">
						{/* Status badges */}
						<div className="flex items-center gap-2 mb-5">
							<span className="px-3 py-1 bg-gray-900/80 text-white text-xs font-semibold uppercase tracking-wider rounded-sm">
								{constructionLabel}
							</span>
							<span className="px-3 py-1 bg-gray-900/80 text-white text-xs font-semibold uppercase tracking-wider rounded-sm">
								{listingLabel}
							</span>
						</div>

						{/* Project Name */}
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight max-w-xl">
							{project.name}
						</h1>

						{/* Location */}
						<div className="flex items-center gap-2 mt-4">
							<MapPin className="h-4 w-4 text-white/70 flex-shrink-0" />
							<span className="text-white/80 text-sm">{project.location}</span>
						</div>

						{/* Short description */}
						<p className="mt-4 text-white/75 text-sm md:text-base leading-relaxed max-w-lg">
							{project.heroSubtext}
						</p>

						{/* CTA Buttons */}
						<div className="mt-8 flex flex-wrap gap-3">
							<button
								onClick={() => {
									document
										.getElementById("enquiry-form")
										?.scrollIntoView({ behavior: "smooth" });
								}}
								className="inline-flex items-center gap-2 px-6 py-3 bg-[#CC1718] text-white text-sm font-semibold rounded-sm hover:bg-[#b01415] transition-colors"
							>
								Register Interest <span aria-hidden="true">→</span>
							</button>

							{project.videoUrl && (
								<button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white text-sm font-medium rounded-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
									<Play className="h-4 w-4" />
									Watch Project Video
								</button>
							)}
						</div>

						{/* Stats bar */}
						<div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/20">
							<div>
								<p className="text-white/50 text-xs uppercase tracking-wider">
									Starting From
								</p>
								<p className="text-white font-bold text-base md:text-lg mt-1">
									{formatNaira(project.startingPriceKobo)}
								</p>
							</div>
							<div>
								<p className="text-white/50 text-xs uppercase tracking-wider">
									Delivery
								</p>
								<p className="text-white font-bold text-base md:text-lg mt-1">
									{project.deliveryTimeline}
								</p>
							</div>
							<div>
								<p className="text-white/50 text-xs uppercase tracking-wider">
									Total Units
								</p>
								<p className="text-white font-bold text-base md:text-lg mt-1">
									{project.totalUnits}
								</p>
							</div>
							<div>
								<p className="text-white/50 text-xs uppercase tracking-wider">
									Available Units
								</p>
								<p className="text-white font-bold text-base md:text-lg mt-1">
									{project.availableUnits}
								</p>
							</div>
						</div>
					</div>

					{/* Right — Floating Info Card */}
					<div className="bg-white rounded-sm shadow-2xl p-6 space-y-5 lg:mt-8 self-start">
						{/* Price */}
						<div>
							<p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
								Starting Price
							</p>
							<p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
								{formatNaira(project.startingPriceKobo)}
							</p>
							<p className="text-xs text-gray-500 mt-0.5">
								Flexible payment plan available
							</p>
						</div>

						{/* Details list */}
						<div className="space-y-3 border-t border-gray-100 pt-4">
							<DetailRow icon="📍" label="Location" value={project.location} />
							<DetailRow
								icon="🏗️"
								label="Project Type"
								value={
									project.type.charAt(0).toUpperCase() +
									project.type.slice(1).replace("_", " ")
								}
							/>
							<DetailRow
								icon="📄"
								label="Title Document"
								value={project.titleDocument}
							/>
							<DetailRow
								icon="🔨"
								label="Construction Status"
								value={getConstructionLabel(project.constructionStatus)}
							/>
							<DetailRow
								icon="📅"
								label="Delivery Timeline"
								value={project.deliveryTimeline}
							/>
							<DetailRow
								icon="🏢"
								label="Total Units"
								value={String(project.totalUnits)}
							/>
							<DetailRow
								icon="✅"
								label="Available Units"
								value={String(project.availableUnits)}
							/>
						</div>

						{/* Payment Plan */}
						{project.paymentPlanDetails && (
							<div className="border-t border-gray-100 pt-4">
								<p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
									Payment Plan
								</p>
								<p className="text-xs text-gray-500 mt-1">
									{project.paymentPlanDetails.description}
								</p>
								<div className="mt-3 space-y-2.5">
									{project.paymentPlanDetails.milestones.map((m) => (
										<div key={m.label} className="flex items-center gap-3">
											<span className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#CC1718] flex items-center justify-center text-xs font-bold text-[#CC1718]">
												{m.percentageValue}%
											</span>
											<span className="text-sm text-gray-700">{m.label}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div className="border-t border-gray-100 pt-4 space-y-2.5">
							<button
								onClick={handleWhatsApp}
								className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-sm hover:bg-gray-800 transition-colors"
							>
								<MessageCircle className="h-4 w-4" />
								Chat on WhatsApp
							</button>

							<button
								onClick={handleCall}
								className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-900 text-gray-900 text-sm font-semibold rounded-sm hover:bg-gray-50 transition-colors"
							>
								<Phone className="h-4 w-4" />
								Call Sales Team
							</button>

							<Link
								href="#brochure"
								className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#CC1718] text-[#CC1718] text-sm font-semibold rounded-sm hover:bg-red-50 transition-colors"
							>
								<FileDown className="h-4 w-4" />
								Download Brochure
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function DetailRow({
	icon,
	label,
	value,
}: {
	icon: string;
	label: string;
	value: string | null | undefined;
}) {
	if (!value) return null;
	return (
		<div className="flex items-start justify-between gap-3">
			<div className="flex items-center gap-2 flex-shrink-0">
				<span className="text-sm">{icon}</span>
				<span className="text-xs text-gray-400">{label}</span>
			</div>
			<span className="text-xs font-medium text-gray-900 text-right">
				{value}
			</span>
		</div>
	);
}
