// // app/(public)/projects/[slug]/page.tsx
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import { MapPin, Tag, Award } from "lucide-react";
// import type { Metadata } from "next";
// import { ProjectCard } from "@/components/public/ProjectCard";
// import { EnquiryModal } from "@/components/public/EnquiryModal";
// import {
// 	getProjectBySlug,
// 	getSimilarProjects,
// } from "@/lib/services/projects.service";
// import { getActiveBrochureForProject } from "@/lib/services/brochures.service";
// import { getFormByType, getFormById } from "@/lib/services/forms.service";
// import { formatNaira } from "@/lib/utils/helpers";

// type ProjectDetailPageProps = { params: Promise<{ slug: string }> };

// export async function generateMetadata({
// 	params,
// }: ProjectDetailPageProps): Promise<Metadata> {
// 	const { slug } = await params;
// 	const project = await getProjectBySlug(slug);
// 	if (!project) return {};
// 	return {
// 		title: project.metaTitle ?? project.name,
// 		description: project.metaDescription ?? project.description ?? undefined,
// 	};
// }

// export default async function ProjectDetailPage({
// 	params,
// }: ProjectDetailPageProps) {
// 	const { slug } = await params;
// 	const project = await getProjectBySlug(slug);
// 	if (!project) notFound();

// 	const [similarProjects, brochure, enquiryForm] = await Promise.all([
// 		getSimilarProjects(project.id, project.locationArea, 3),
// 		getActiveBrochureForProject(project.id),
// 		getFormByType("project_enquiry"),
// 	]);

// 	const brochureForm = brochure?.gateFormId
// 		? await getFormById(brochure.gateFormId)
// 		: enquiryForm;

// 	return (
// 		<>
// 			{/* Hero */}
// 			<section className="relative h-[420px] sm:h-[500px]">
// 				{project.heroImageUrl && (
// 					<Image
// 						src={project.heroImageUrl}
// 						alt={project.name}
// 						fill
// 						className="object-cover"
// 						priority
// 					/>
// 				)}
// 				<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-transparent" />
// 				<div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
// 					<h1 className="text-4xl sm:text-6xl font-extrabold text-white max-w-2xl">
// 						{project.name}
// 					</h1>
// 					<p className="text-white/90 mt-4 max-w-lg text-sm sm:text-base">
// 						{project.heroSubtext ?? project.description}
// 					</p>
// 				</div>
// 			</section>

// 			{/* Overview */}
// 			<section className="bg-gray-50">
// 				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-10">
// 					<div className="lg:col-span-2">
// 						<h2 className="text-3xl font-extrabold text-brand-red mb-4">
// 							Project Overview
// 						</h2>
// 						<p className="text-gray-500 whitespace-pre-line">
// 							{project.description}
// 						</p>

// 						<div className="flex flex-wrap gap-3 mt-8">
// 							{brochure && brochureForm && (
// 								<EnquiryModal
// 									triggerLabel="Download Brochure →"
// 									triggerClassName="bg-brand-black text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-black transition"
// 									modalTitle={`Download ${project.name} Brochure`}
// 									form={brochureForm}
// 									context={{
// 										source: "brochure",
// 										sourcePage: `/projects/${project.slug}`,
// 										projectId: project.id,
// 										brochureId: brochure.id,
// 										ctaSource: "brochure_download",
// 									}}
// 								/>
// 							)}
// 							{enquiryForm && (
// 								<EnquiryModal
// 									triggerLabel="Book Inspection"
// 									triggerClassName="bg-brand-red text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-brand-red-dark transition"
// 									modalTitle={`Book an Inspection — ${project.name}`}
// 									form={enquiryForm}
// 									context={{
// 										source: "website",
// 										sourcePage: `/projects/${project.slug}`,
// 										projectId: project.id,
// 										ctaSource: "book_inspection",
// 									}}
// 								/>
// 							)}
// 						</div>
// 					</div>

// 					<div className="bg-white rounded-2xl p-6 space-y-5 self-start">
// 						<div className="flex items-start gap-3">
// 							<MapPin size={18} className="text-brand-red mt-0.5" />
// 							<div>
// 								<p className="text-xs text-gray-400">Location</p>
// 								<p className="font-semibold text-gray-900">
// 									{project.location}
// 								</p>
// 							</div>
// 						</div>
// 						<hr className="border-gray-100" />
// 						<div className="flex items-start gap-3">
// 							<Tag size={18} className="text-brand-red mt-0.5" />
// 							<div>
// 								<p className="text-xs text-gray-400">Price</p>
// 								<p className="font-semibold text-gray-900">
// 									{formatNaira(project.startingPriceKobo)}
// 								</p>
// 							</div>
// 						</div>
// 						<hr className="border-gray-100" />
// 						<div className="flex items-start gap-3">
// 							<Award size={18} className="text-brand-red mt-0.5" />
// 							<div>
// 								<p className="text-xs text-gray-400">Title</p>
// 								<p className="font-semibold text-gray-900">
// 									{project.titleDocument ?? "—"}
// 								</p>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Similar Projects */}
// 			{similarProjects.length > 0 && (
// 				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// 					<h2 className="text-3xl font-extrabold text-brand-red mb-8">
// 						Similar Projects
// 					</h2>
// 					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
// 						{similarProjects.map((p) => (
// 							<ProjectCard key={p.id} project={p} />
// 						))}
// 					</div>
// 				</section>
// 			)}
// 		</>
// 	);
// }


// import Link from "next/link";
// import { projects } from "@/lib/data/mock-data";
// import {
// 	MapPin,
// 	MessageCircle,
// 	Phone,
// 	Download,
// 	ChevronRight,
// } from "lucide-react";

// interface ProjectDetailsPageProps {
// 	params: Promise<{ id: string }>;
// }

// export default async function ProjectDetailsPage({
// 	params,
// }: ProjectDetailsPageProps) {
// 	const { id } = await params;
// 	const project = projects.find((p) => p.id === id);

// 	if (!project) {
// 		return (
// 			<div className="min-h-screen flex items-center justify-center">
// 				<div className="text-center">
// 					<h1 className="text-3xl font-bold text-gray-900 mb-4">
// 						Project not found
// 					</h1>
// 					<Link href="/projects" className="text-red-600 hover:text-red-700">
// 						Back to projects
// 					</Link>
// 				</div>
// 			</div>
// 		);
// 	}

// 	const statusColor: Record<string, string> = {
// 		"Selling Now": "text-green-600",
// 		Active: "text-blue-600",
// 		"Pre-launch": "text-purple-600",
// 		Draft: "text-orange-600",
// 		"Sold Out": "text-red-600",
// 	};

// 	return (
// 		<div className="bg-white">
// 			{/* Hero Section with Image */}
// 			<section className="relative min-h-[500px] bg-gray-300 flex items-center">
// 				<div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
// 					<span className="text-gray-500 text-2xl">Project Hero Image</span>
// 				</div>

// 				{/* Overlay Content */}
// 				<div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
// 					<div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
// 						<div className="flex flex-wrap gap-2 mb-6">
// 							{project.categoryBadges.map((badge, idx) => (
// 								<span
// 									key={idx}
// 									className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded"
// 								>
// 									{badge}
// 								</span>
// 							))}
// 						</div>

// 						<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
// 							{project.name}
// 						</h1>

// 						<div className="flex items-center gap-2 text-white">
// 							<MapPin size={20} />
// 							<span className="text-lg">{project.location}</span>
// 						</div>
// 					</div>
// 				</div>
// 			</section>

// 			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
// 				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
// 					{/* Main Content */}
// 					<div className="lg:col-span-2 space-y-12">
// 						{/* Key Metrics */}
// 						<section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-gray-200">
// 							<div>
// 								<p className="text-gray-600 text-sm uppercase mb-1">
// 									Starting From
// 								</p>
// 								<p className="text-2xl font-bold text-gray-900">
// 									₦{(project.startingPrice / 1000000).toFixed(0)}M
// 								</p>
// 							</div>
// 							<div>
// 								<p className="text-gray-600 text-sm uppercase mb-1">Delivery</p>
// 								<p className="text-2xl font-bold text-gray-900">
// 									{project.deliveryDate}
// 								</p>
// 							</div>
// 							<div>
// 								<p className="text-gray-600 text-sm uppercase mb-1">
// 									Total Units
// 								</p>
// 								<p className="text-2xl font-bold text-gray-900">
// 									{project.totalUnits}
// 								</p>
// 							</div>
// 							<div>
// 								<p className="text-gray-600 text-sm uppercase mb-1">
// 									Available Units
// 								</p>
// 								<p className="text-2xl font-bold text-gray-900">
// 									{project.availableUnits}
// 								</p>
// 							</div>
// 						</section>

// 						{/* Project Overview */}
// 						<section>
// 							<h2 className="text-3xl font-bold text-gray-900 mb-6">
// 								Project Overview
// 							</h2>
// 							<p className="text-gray-700 text-lg leading-relaxed mb-4">
// 								{project.description}
// 							</p>
// 							<p className="text-gray-700 text-lg leading-relaxed">
// 								Premium Income Residence is a modern real estate development
// 								positioned in one of Lagos Mainland&apos;s strongest rental
// 								markets. The project combines premium living, hospitality-style
// 								amenities, and investment-focused apartment design to generate
// 								long-term value.
// 							</p>
// 						</section>

// 						{/* Features Grid */}
// 						<section>
// 							<h3 className="text-2xl font-bold text-gray-900 mb-6">
// 								Project Features
// 							</h3>
// 							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// 								{project.features.map((feature, idx) => (
// 									<div
// 										key={idx}
// 										className="bg-gray-50 p-4 rounded-lg border border-gray-200"
// 									>
// 										<p className="text-gray-600 text-sm mb-2">
// 											{feature.label}
// 										</p>
// 										<p className="font-semibold text-gray-900">
// 											{feature.value}
// 										</p>
// 									</div>
// 								))}
// 							</div>
// 						</section>

// 						{/* Investment Highlights */}
// 						<section>
// 							<h3 className="text-2xl font-bold text-gray-900 mb-6">
// 								Investment Highlights
// 							</h3>
// 							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 								{project.highlights.map((highlight, idx) => (
// 									<div key={idx} className="flex gap-4">
// 										<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
// 											<span className="text-red-600 text-xl">📍</span>
// 										</div>
// 										<div>
// 											<p className="text-gray-700 leading-relaxed">
// 												{highlight}
// 											</p>
// 										</div>
// 									</div>
// 								))}
// 							</div>
// 						</section>

// 						{/* Location Advantages */}
// 						<section>
// 							<h3 className="text-2xl font-bold text-gray-900 mb-6">
// 								Location Advantages
// 							</h3>
// 							<ul className="space-y-3">
// 								{project.locationAdvantages.map((advantage, idx) => (
// 									<li key={idx} className="flex gap-3 items-start">
// 										<div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm mt-1">
// 											✓
// 										</div>
// 										<span className="text-gray-700">{advantage}</span>
// 									</li>
// 								))}
// 							</ul>
// 						</section>

// 						{/* Features & Amenities */}
// 						<section>
// 							<h3 className="text-2xl font-bold text-gray-900 mb-6">
// 								Features & Amenities
// 							</h3>
// 							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// 								{project.amenities.map((amenity) => (
// 									<div
// 										key={amenity.id}
// 										className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center hover:border-red-600 transition-colors"
// 									>
// 										<div className="text-3xl mb-2">🏢</div>
// 										<p className="font-medium text-gray-900 text-sm">
// 											{amenity.name}
// 										</p>
// 									</div>
// 								))}
// 							</div>
// 						</section>

// 						{/* Project Gallery */}
// 						<section>
// 							<h3 className="text-2xl font-bold text-gray-900 mb-6">
// 								Project Gallery
// 							</h3>
// 							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 								{project.images.slice(0, 4).map((image, idx) => (
// 									<div
// 										key={idx}
// 										className="bg-gray-300 h-64 rounded-lg flex items-center justify-center"
// 									>
// 										<span className="text-gray-500">Image {idx + 1}</span>
// 									</div>
// 								))}
// 							</div>
// 							{project.images.length > 4 && (
// 								<button className="mt-4 text-center w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-900 transition-colors">
// 									+{project.images.length - 4} More Images
// 								</button>
// 							)}
// 						</section>

// 						{/* Register Interest CTA */}
// 						<section className="bg-gray-900 text-white p-12 rounded-lg">
// 							<h3 className="text-2xl font-bold mb-4">
// 								REGISTER YOUR INTEREST
// 							</h3>
// 							<p className="text-gray-300 mb-6">
// 								Secure your unit before the next price review. Speak with our
// 								project sales team to request the brochure, payment plan,
// 								construction updates, and investment details.
// 							</p>
// 							<div className="flex flex-wrap gap-4">
// 								<button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
// 									Register Interest <ChevronRight size={20} />
// 								</button>
// 								<button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
// 									Call Sales Team <Phone size={20} />
// 								</button>
// 							</div>
// 						</section>
// 					</div>

// 					{/* Sidebar */}
// 					<div className="lg:col-span-1 space-y-6">
// 						{/* Price Card */}
// 						<div className="bg-gray-50 p-8 rounded-lg border border-gray-200 sticky top-24">
// 							<p className="text-gray-600 text-sm uppercase mb-2">
// 								Starting Price
// 							</p>
// 							<p className="text-4xl font-bold text-gray-900 mb-6">
// 								₦{(project.startingPrice / 1000000).toFixed(0)}M
// 							</p>
// 							<p className="text-gray-600 text-sm mb-6">
// 								Flexible payment plan available for early investors and
// 								qualified buyers.
// 							</p>

// 							<div className="mb-8">
// 								<h4 className="font-semibold text-gray-900 mb-4">
// 									PAYMENT PLAN
// 								</h4>
// 								<div className="space-y-3">
// 									{project.paymentPlan.map((item, idx) => (
// 										<div
// 											key={idx}
// 											className="flex items-center justify-between"
// 										>
// 											<span className="text-gray-700 text-sm">
// 												{item.label}
// 											</span>
// 											<div className="flex items-center gap-2">
// 												<div className="w-16 h-8 bg-red-100 rounded-full flex items-center justify-center">
// 													<span className="text-red-600 font-semibold text-xs">
// 														{item.percentage}%
// 													</span>
// 												</div>
// 											</div>
// 										</div>
// 									))}
// 								</div>
// 							</div>

// 							{/* Action Buttons */}
// 							<div className="space-y-3">
// 								<button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
// 									<MessageCircle size={18} />
// 									Chat on WhatsApp
// 								</button>
// 								<button className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
// 									<Phone size={18} />
// 									Call Sales Team
// 								</button>
// 								<button className="w-full text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
// 									<Download size={18} />
// 									Download Brochure
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }



// app/(public)/projects/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEED_PROJECTS } from "@/lib/data/seed-projects";
import ProjectHero from "@/components/public/projects/ProjectHero";
import ProjectOverview from "@/components/public/projects/ProjectOverview";
import ProjectHighlights from "@/components/public/projects/ProjectHighlights";
import ProjectAmenities from "@/components/public/projects/ProjectAmenities";
import ProjectGallery from "@/components/public/projects/ProjectGallery";
import ProjectCTABar from "@/components/public/projects/ProjectCTABar";
import SimilarProjects from "@/components/public/projects/SimilarProjects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SEED_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = SEED_PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.name,
    description: project.heroSubtext,
    openGraph: {
      title: project.name,
      description: project.heroSubtext,
      images: [project.heroImageUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = SEED_PROJECTS.find((p) => p.slug === slug);

  if (!project) notFound();

  const similar = SEED_PROJECTS.filter(
    (p) => p.slug !== slug && p.type === project.type
  ).slice(0, 3);

  // Fill similar with other projects if not enough of same type
  const similarFilled =
    similar.length < 3
      ? [
          ...similar,
          ...SEED_PROJECTS.filter(
            (p) =>
              p.slug !== slug && !similar.find((s) => s.slug === p.slug)
          ).slice(0, 3 - similar.length),
        ]
      : similar;

  return (
    <>
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ProjectHighlights project={project} />
      <ProjectAmenities amenities={project.featuresAmenities} />
      <ProjectGallery gallery={project.gallery} projectName={project.name} />
      <ProjectCTABar project={project} />
      <SimilarProjects projects={similarFilled} />
    </>
  );
}