// //@components/projects/editor/ProjectEditorShell.tsx
// "use client";

// import { useState, useTransition, useCallback } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { AlertCircle, Check, ChevronDown, ExternalLink, Loader2 } from "lucide-react";
// import { BasicInfoTab } from "./tabs/BasicInfoTab";
// import { HeroTab } from "./tabs/HeroTab";
// import { UnitsAndPricingTab } from "./tabs/UnitsAndPricingTab";
// import { PaymentPlanTab } from "./tabs/PaymentPlanTab";
// import { GalleryTab } from "./tabs/GalleryTab";
// import { BrochureTab } from "./tabs/BrochureTab";
// import { EnquiryTab } from "./tabs/EnquiryTab";
// import { SeoTab } from "./tabs/SeoTab";
// import { LivePreviewPanel } from "./LivePreviewPanel";
// import { saveDraftProject, publishProject } from "@/lib/actions/admin/project";
// import { cn } from "@/lib/utils/helpers";
// import {
//   DEFAULT_EDITOR_STATE,
//   EDITOR_TABS,
//   type ProjectEditorState,
//   type ProjectEditorTab,
//   type SaveStatus,
// } from "@/lib/types/admin/project-editor";
// import type { ProjectDetail } from "@/lib/types/project-detail";

// interface ProjectEditorShellProps {
//   project: ProjectDetail | null;
//   mode: "edit" | "new";
// }

// function initFromProject(project: ProjectDetail): ProjectEditorState {
//   return {
//     name: project.name,
//     location: project.location,
//     status: project.status,
//     categories: project.category,
//     statusLabel: project.statusLabel,
//     categoryLabel: project.categoryLabel,
//     developerLabel: project.developerLabel,
//     typeLabel: project.typeLabel,
//     description: project.description,
//     overview: project.overview.length > 0 ? project.overview : [""],
//     facts: project.facts.map((f, i) => ({
//       id: `fact-${i}`,
//       label: f.label,
//       value: f.value,
//     })),
//     // ← FIXED: amenities now included from DB
//     amenities: project.amenities.map((a) => ({
//       id: a.id,
//       label: a.label,
//       icon: a.icon,
//     })),
//     coverImageSrc: project.coverImage.src,
//     coverImageAlt: project.coverImage.alt,
//     unitsSectionEyebrow: "FLEXIBLE LIVING SPACE",
//     unitsSectionHeading: "Choose Your Ideal Home",
//     unitsSectionDescription:
//       "Thoughtfully designed units to match your lifestyle and investment goals.",
//     units: project.units.map((u) => ({
//       id: u.id,
//       name: u.name,
//       icon: u.icon,
//       priceLabel: u.priceLabel,
//       availabilityLabel: u.availabilityLabel,
//       ctaLabel: `Enquire About ${u.name.split(" ")[0] ?? "Unit"}`,
//       ctaHref: `/contact?project=${project.slug}&unit=${u.id}`,
//     })),
//     investmentHighlights: project.investmentHighlights,
//     paymentPlan: project.paymentPlan,
//     media: project.media.map((m) => ({
//       id: m.id,
//       type: m.type,
//       src: m.src,
//       alt: m.alt,
//       poster: m.poster,
//     })),
//     contactCtaTitle: project.contactCtaTitle,
//     contactCtaDescription: project.contactCtaDescription,
//     seoTitle: `${project.name} | Jimo Property Development`,
//     seoDescription: project.description.substring(0, 160),
//     focusKeyword: "",
//     noIndex: false,
//   };

// // In handleSaveDraft and handlePublish, change the calls to:

// // same pattern for publishProject(currentSlug, state, pendingImageDeletions)

// // In the render, pass the new prop to Hero:

// function ProjectEditorShell({ project, mode }: ProjectEditorShellProps) {
//   const router = useRouter();
//   const [state, setState] = useState<ProjectEditorState>(
//     project ? initFromProject(project) : DEFAULT_EDITOR_STATE,
//   );
//   const [activeTab, setActiveTab] = useState<ProjectEditorTab>("basic-info");
//   const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
//   const [saveMessage, setSaveMessage] = useState<string>("");
//   const [publishOpen, setPublishOpen] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   // currentSlug tracks the live slug — starts from the DB project slug,
//   // updates when a new project is created (so subsequent saves update, not create)
//   const [currentSlug, setCurrentSlug] = useState<string | null>(
//     project?.slug ?? null,
//   );
// const [pendingImageDeletions, setPendingImageDeletions] = useState<string[]>(
// 	[],
// );
// const queueImageDeletion = useCallback((url: string) => {
//   setPendingImageDeletions((prev) => (prev.includes(url) ? prev : [...prev, url]));
// }, []);

//   const lastEditedNote =
//     mode === "edit" && project
//       ? `${project.name} · Last edited by ${project.developerLabel}`
//       : "New project — unsaved";

//   function updateField<K extends keyof ProjectEditorState>(
//     key: K,
//     value: ProjectEditorState[K],
//   ) {
//     setState((prev) => ({ ...prev, [key]: value }));
//     setSaveStatus("idle");
//     setSaveMessage("");
//   }

//   function handleSaveDraft() {
//     setSaveStatus("saving");
//     setSaveMessage("");
//     startTransition(async () => {
//       try {
//         const result = await saveDraftProject(currentSlug, state, pendingImageDeletions);
// // ...and on success:
// setPendingImageDeletions([]);
//         if (result.success) {
//           setSaveStatus("saved");
//           setSaveMessage(result.message ?? "Draft saved.");
//           // ← FIXED: if this was a new project, update slug so next save is an update
//           if (!currentSlug && result.slug) {
//             setCurrentSlug(result.slug);
//             // Redirect to the proper edit URL so the URL reflects the real slug
//             router.replace(`/admin/projects/${result.slug}/edit`);
//           }
//         } else {
//           setSaveStatus("error");
//           setSaveMessage(result.message ?? "Save failed.");
//         }
//       } catch (error) {
//         const msg = error instanceof Error ? error.message : "Unexpected error.";
//         setSaveStatus("error");
//         setSaveMessage(msg);
//       }
//     });
//   }

//   function handlePublish() {
//     setPublishOpen(false);
//     setSaveStatus("saving");
//     setSaveMessage("");
//     startTransition(async () => {
//       try {
//         const result = await saveDraftProject(currentSlug, state, pendingImageDeletions);
// // ...and on success:
// setPendingImageDeletions([]);
//         if (result.success) {
//           setSaveStatus("saved");
//           setSaveMessage(result.message ?? "Published.");
//           // ← FIXED: redirect to edit URL for new projects after publish
//           if (!currentSlug && result.slug) {
//             setCurrentSlug(result.slug);
//             router.replace(`/admin/projects/${result.slug}/edit`);
//           } else {
//             // Refresh the current page so the editor re-reads the newly saved DB data
//             router.refresh();
//           }
//         } else {
//           setSaveStatus("error");
//           setSaveMessage(result.message ?? "Publish failed.");
//         }
//       } catch (error) {
//         const msg = error instanceof Error ? error.message : "Unexpected error.";
//         setSaveStatus("error");
//         setSaveMessage(msg);
//       }
//     });
//   }

//   return (
//     <div className="flex flex-col gap-0">
//       {/* ── Top bar ── */}
//       <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-ink-950">
//             {mode === "new" ? "New Project" : "Edit Project"}
//           </h1>
//           <p className="mt-0.5 text-sm text-stone-500">{lastEditedNote}</p>
//         </div>

//         <div className="flex items-center gap-2.5">
//           {/* Status feedback */}
//           {saveStatus === "saved" && saveMessage ? (
//             <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
//               <Check className="h-3.5 w-3.5" />
//               {saveMessage}
//             </span>
//           ) : saveStatus === "error" && saveMessage ? (
//             <span className="flex max-w-xs items-center gap-1 text-xs font-medium text-red-500">
//               <AlertCircle className="h-3.5 w-3.5 shrink-0" />
//               {saveMessage}
//             </span>
//           ) : null}

//           <button
//             type="button"
//             onClick={handleSaveDraft}
//             disabled={isPending}
//             className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50 disabled:opacity-60"
//           >
//             {isPending ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               "Save Draft"
//             )}
//           </button>

//           {currentSlug ? (
//             <Link
//               href={`/projects/${currentSlug}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50"
//             >
//               <span className="flex items-center gap-1.5">
//                 Preview
//                 <ExternalLink className="h-3.5 w-3.5" />
//               </span>
//             </Link>
//           ) : null}

//           <div className="relative">
//             <div className="flex overflow-hidden rounded-xl">
//               <button
//                 type="button"
//                 onClick={handlePublish}
//                 disabled={isPending}
//                 className="bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
//               >
//                 Publish
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPublishOpen((o) => !o)}
//                 className="border-l border-red-700 bg-red-600 px-2 py-2.5 text-white hover:bg-red-700"
//                 aria-label="Publish options"
//               >
//                 <ChevronDown className="h-4 w-4" />
//               </button>
//             </div>

//             {publishOpen ? (
//               <div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
//                 <button
//                   type="button"
//                   onClick={handlePublish}
//                   className="flex w-full px-4 py-3 text-sm text-ink-950 hover:bg-stone-50"
//                 >
//                   Publish to Website
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setPublishOpen(false);
//                     handleSaveDraft();
//                   }}
//                   className="flex w-full px-4 py-3 text-sm text-stone-600 hover:bg-stone-50"
//                 >
//                   Save as Draft
//                 </button>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>

//       {/* ── Tab bar ── */}
//       <div className="overflow-x-auto border-b border-stone-200">
//         <div className="flex min-w-max">
//           {EDITOR_TABS.map((tab) => (
//             <button
//               key={tab.id}
//               type="button"
//               onClick={() => setActiveTab(tab.id)}
//               className={cn(
//                 "border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
//                 activeTab === tab.id
//                   ? "border-red-600 text-red-600"
//                   : "border-transparent text-stone-500 hover:text-ink-950",
//               )}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Main content ── */}
//       <div className="mt-6 grid h-full gap-6 lg:grid-cols-[1fr_340px]">
//         <div className="min-h-0 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6">
//           {activeTab === "basic-info" && (
//             <BasicInfoTab state={state} onChange={updateField} />
//           )}
//           {activeTab === "hero" && (
//   <HeroTab state={state} onChange={updateField} onQueueImageDeletion={queueImageDeletion} />
// )}
//           {activeTab === "units-pricing" && (
//             <UnitsAndPricingTab state={state} onChange={updateField} />
//           )}
//           {activeTab === "payment-plan" && (
//             <PaymentPlanTab state={state} onChange={updateField} />
//           )}
//           {activeTab === "gallery" && (
//             <GalleryTab state={state} onChange={updateField} />
//           )}
//           {activeTab === "brochure" && <BrochureTab />}
//           {activeTab === "enquiry" && (
//             <EnquiryTab state={state} onChange={updateField} />
//           )}
//           {activeTab === "seo" && (
//             <SeoTab state={state} onChange={updateField} />
//           )}
//         </div>

//         <div className="hidden lg:block">
//           <LivePreviewPanel
//             state={state}
//             activeTab={activeTab}
//             projectSlug={currentSlug}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useCallback, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	AlertCircle,
	Check,
	ChevronDown,
	ExternalLink,
	Loader2,
} from "lucide-react";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { HeroTab } from "./tabs/HeroTab";
import { UnitsAndPricingTab } from "./tabs/UnitsAndPricingTab";
import { PaymentPlanTab } from "./tabs/PaymentPlanTab";
import { GalleryTab } from "./tabs/GalleryTab";
import { BrochureTab } from "./tabs/BrochureTab";
import { EnquiryTab } from "./tabs/EnquiryTab";
import { SeoTab } from "./tabs/SeoTab";
import { LivePreviewPanel } from "./LivePreviewPanel";
import { saveDraftProject, publishProject } from "@/lib/actions/admin/project";
import { cn } from "@/lib/utils/helpers";
import {
	DEFAULT_EDITOR_STATE,
	EDITOR_TABS,
	type ProjectEditorState,
	type ProjectEditorTab,
	type SaveStatus,
} from "@/lib/types/admin/project-editor";
import type { ProjectDetail } from "@/lib/types/project-detail";
import type { AdminBrochureListRow } from "@/lib/types/admin/brochure";
import type { ProjectFieldSuggestions } from "@/lib/db/queries/project-field-suggestions";

interface ProjectEditorShellProps {
	project: ProjectDetail | null;
	mode: "edit" | "new";
	suggestions: ProjectFieldSuggestions;
	initialBrochure: AdminBrochureListRow | null; // NEW
}

function initFromProject(project: ProjectDetail): ProjectEditorState {
	return {
		name: project.name,
		location: project.location,
		status: project.status,
		categories: project.category,
		statusLabel: project.statusLabel,
		categoryLabel: project.categoryLabel,
		developerLabel: project.developerLabel,
		typeLabel: project.typeLabel,
		description: project.description,
		overview: project.overview.length > 0 ? project.overview : [""],
		facts: project.facts.map((f, i) => ({
			id: `fact-${i}`,
			label: f.label,
			value: f.value,
		})),
		amenities: project.amenities.map((a) => ({
			id: a.id,
			label: a.label,
			icon: a.icon,
		})),
		coverImageSrc: project.coverImage.src,
		coverImageAlt: project.coverImage.alt,
		unitsSectionEyebrow: "FLEXIBLE LIVING SPACE",
		unitsSectionHeading: "Choose Your Ideal Home",
		unitsSectionDescription:
			"Thoughtfully designed units to match your lifestyle and investment goals.",
		units: project.units.map((u) => ({
			id: u.id,
			name: u.name,
			icon: u.icon,
			priceLabel: u.priceLabel,
			availabilityLabel: u.availabilityLabel,
			ctaLabel: `Enquire About ${u.name.split(" ")[0] ?? "Unit"}`,
			ctaHref: `/contact?project=${project.slug}&unit=${u.id}`,
		})),
		investmentHighlights: project.investmentHighlights,
		paymentPlan: project.paymentPlan,
		media: project.media.map((m) => ({
			id: m.id,
			type: m.type,
			src: m.src,
			alt: m.alt,
			poster: m.poster,
		})),
		contactCtaTitle: project.contactCtaTitle,
		contactCtaDescription: project.contactCtaDescription,
		seoTitle: `${project.name} | Jimo Property Development`,
		seoDescription: project.description.substring(0, 160),
		focusKeyword: "",
		noIndex: false,
	};
}

export function ProjectEditorShell({
	project,
	mode,
	suggestions,
	initialBrochure,
}: ProjectEditorShellProps) {
	const router = useRouter();
	const [state, setState] = useState<ProjectEditorState>(
		project ? initFromProject(project) : DEFAULT_EDITOR_STATE,
	);
	const [activeTab, setActiveTab] = useState<ProjectEditorTab>("basic-info");
	const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
	const [saveMessage, setSaveMessage] = useState<string>("");
	const [publishOpen, setPublishOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const [currentSlug, setCurrentSlug] = useState<string | null>(
		project?.slug ?? null,
	);

	// Images (currently just the Hero cover image) queued for Cloudinary
	// deletion once the user confirms a replace — nothing is actually
	// deleted from Cloudinary until the save that references the new image
	// succeeds, so an abandoned edit never destroys a live asset.
	const [pendingImageDeletions, setPendingImageDeletions] = useState<string[]>(
		[],
	);

	const queueImageDeletion = useCallback((url: string) => {
		setPendingImageDeletions((prev) =>
			prev.includes(url) ? prev : [...prev, url],
		);
	}, []);

	const lastEditedNote =
		mode === "edit" && project
			? `${project.name} · Last edited by ${project.developerLabel}`
			: "New project — unsaved";

	function updateField<K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) {
		setState((prev) => ({ ...prev, [key]: value }));
		setSaveStatus("idle");
		setSaveMessage("");
	}

	function handleSaveDraft() {
		setSaveStatus("saving");
		setSaveMessage("");
		startTransition(async () => {
			try {
				const result = await saveDraftProject(
					currentSlug,
					state,
					pendingImageDeletions,
				);
				if (result.success) {
					setSaveStatus("saved");
					setSaveMessage(result.message ?? "Draft saved.");
					setPendingImageDeletions([]);
					if (!currentSlug && result.slug) {
						setCurrentSlug(result.slug);
						router.replace(`/admin/projects/${result.slug}/edit`);
					}
				} else {
					setSaveStatus("error");
					setSaveMessage(result.message ?? "Save failed.");
				}
			} catch (error) {
				const msg =
					error instanceof Error ? error.message : "Unexpected error.";
				setSaveStatus("error");
				setSaveMessage(msg);
			}
		});
	}

	function handlePublish() {
		setPublishOpen(false);
		setSaveStatus("saving");
		setSaveMessage("");
		startTransition(async () => {
			try {
				const result = await publishProject(
					currentSlug,
					state,
					pendingImageDeletions,
				);
				if (result.success) {
					setSaveStatus("saved");
					setSaveMessage(result.message ?? "Published.");
					setPendingImageDeletions([]);
					if (!currentSlug && result.slug) {
						setCurrentSlug(result.slug);
						router.replace(`/admin/projects/${result.slug}/edit`);
					} else {
						router.refresh();
					}
				} else {
					setSaveStatus("error");
					setSaveMessage(result.message ?? "Publish failed.");
				}
			} catch (error) {
				const msg =
					error instanceof Error ? error.message : "Unexpected error.";
				setSaveStatus("error");
				setSaveMessage(msg);
			}
		});
	}

	return (
		<div className="flex flex-col gap-0">
			{/* ── Top bar ── */}
			<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-ink-950">
						{mode === "new" ? "New Project" : "Edit Project"}
					</h1>
					<p className="mt-0.5 text-sm text-stone-500">{lastEditedNote}</p>
				</div>

				<div className="flex items-center gap-2.5">
					{saveStatus === "saved" && saveMessage ? (
						<span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
							<Check className="h-3.5 w-3.5" />
							{saveMessage}
						</span>
					) : saveStatus === "error" && saveMessage ? (
						<span className="flex max-w-xs items-center gap-1 text-xs font-medium text-red-500">
							<AlertCircle className="h-3.5 w-3.5 shrink-0" />
							{saveMessage}
						</span>
					) : null}

					<button
						type="button"
						onClick={handleSaveDraft}
						disabled={isPending}
						className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50 disabled:opacity-60"
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Save Draft"
						)}
					</button>

					{currentSlug ? (
						<Link
							href={`/projects/${currentSlug}`}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50"
						>
							<span className="flex items-center gap-1.5">
								Preview
								<ExternalLink className="h-3.5 w-3.5" />
							</span>
						</Link>
					) : null}

					<div className="relative">
						<div className="flex overflow-hidden rounded-xl">
							<button
								type="button"
								onClick={handlePublish}
								disabled={isPending}
								className="bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
							>
								Publish
							</button>
							<button
								type="button"
								onClick={() => setPublishOpen((o) => !o)}
								className="border-l border-red-700 bg-red-600 px-2 py-2.5 text-white hover:bg-red-700"
								aria-label="Publish options"
							>
								<ChevronDown className="h-4 w-4" />
							</button>
						</div>

						{publishOpen ? (
							<div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
								<button
									type="button"
									onClick={handlePublish}
									className="flex w-full px-4 py-3 text-sm text-ink-950 hover:bg-stone-50"
								>
									Publish to Website
								</button>
								<button
									type="button"
									onClick={() => {
										setPublishOpen(false);
										handleSaveDraft();
									}}
									className="flex w-full px-4 py-3 text-sm text-stone-600 hover:bg-stone-50"
								>
									Save as Draft
								</button>
							</div>
						) : null}
					</div>
				</div>
			</div>

			{/* ── Tab bar ── */}
			<div className="overflow-x-auto border-b border-stone-200">
				<div className="flex min-w-max">
					{EDITOR_TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"border-b-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
								activeTab === tab.id
									? "border-red-600 text-red-600"
									: "border-transparent text-stone-500 hover:text-ink-950",
							)}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* ── Main content ── */}
			<div className="mt-6 grid h-full gap-6 lg:grid-cols-[1fr_340px]">
				<div className="min-h-0 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6">
					{activeTab === "basic-info" && (
						<BasicInfoTab
							state={state}
							onChange={updateField}
							suggestions={suggestions}
						/>
					)}
					{activeTab === "hero" && (
						<HeroTab
							state={state}
							onChange={updateField}
							onQueueImageDeletion={queueImageDeletion}
						/>
					)}
					{activeTab === "units-pricing" && (
						<UnitsAndPricingTab state={state} onChange={updateField} />
					)}
					{activeTab === "payment-plan" && (
						<PaymentPlanTab state={state} onChange={updateField} />
					)}
					{activeTab === "gallery" && (
						<GalleryTab state={state} onChange={updateField} />
					)}
					{activeTab === "brochure" && (
						<BrochureTab
							projectSlug={currentSlug ?? ""}
							projectName={state.name}
							initialBrochure={initialBrochure}
						/>
					)}
					{activeTab === "enquiry" && (
						<EnquiryTab state={state} onChange={updateField} />
					)}
					{activeTab === "seo" && (
						<SeoTab state={state} onChange={updateField} />
					)}
				</div>

				<div className="hidden lg:block">
					<LivePreviewPanel
						state={state}
						activeTab={activeTab}
						projectSlug={currentSlug}
					/>
				</div>
			</div>
		</div>
	);
}