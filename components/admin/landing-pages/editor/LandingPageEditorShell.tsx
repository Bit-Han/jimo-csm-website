// components/admin/landing-pages/editor/LandingPageEditorShell.tsx
"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, ChevronDown, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { HeroFieldsPanel } from "./HeroFieldsPanel";
import { LandingPageSettingsPanel } from "./LandingPageSettingsPanel";
import { HeroThemeRenderer } from "@/components/public/landing/HeroThemeRenderer";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import {
	deleteLandingPage,
	publishLandingPage,
	saveDraftLandingPage,
} from "@/lib/actions/admin/landing-pages";
import type {
	LandingPageEditorState,
	LandingPageSaveStatus,
	FormPickerOption,
	ProjectPickerOption,
} from "@/lib/types/admin/landing-page";

export interface LandingPageEditorShellProps {
	initialState: LandingPageEditorState;
	mode: "new" | "edit";
	forms: FormPickerOption[];
	projects: ProjectPickerOption[];
}

function computeMissingForPublish(state: LandingPageEditorState): string[] {
	const missing: string[] = [];
	if (!state.title.trim()) missing.push("an internal title");
	if (!state.slug.trim()) missing.push("a URL slug");
	if (!state.hero.headline.trim()) missing.push("a headline");
	if (!state.hero.primaryCta.label.trim()) missing.push("a primary CTA label");
	if (!state.hero.primaryCta.formId.trim()) missing.push("a form for the primary CTA");
	return missing;
}

function joinWithAnd(items: string[]): string {
	if (items.length === 0) return "";
	if (items.length === 1) return items[0]!;
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function LandingPageEditorShell({
	initialState,
	mode,
	forms,
	projects,
}: LandingPageEditorShellProps) {
	const router = useRouter();
	const [state, setState] = useState<LandingPageEditorState>(initialState);
	const [currentSlug, setCurrentSlug] = useState<string>(initialState.slug);
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");
	const [saveStatus, setSaveStatus] = useState<LandingPageSaveStatus>("idle");
	const [saveMessage, setSaveMessage] = useState("");
	const [publishOpen, setPublishOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [pendingImageDeletions, setPendingImageDeletions] = useState<string[]>([]);

	const queueImageDeletion = useCallback((url: string) => {
		setPendingImageDeletions((prev) => (prev.includes(url) ? prev : [...prev, url]));
	}, []);

	const missingForPublish = useMemo(() => computeMissingForPublish(state), [state]);
	const canPublish = missingForPublish.length === 0;

	function updateField<K extends keyof LandingPageEditorState>(
		key: K,
		value: LandingPageEditorState[K],
	) {
		setState((prev) => ({ ...prev, [key]: value }));
		setSaveStatus("idle");
		setSaveMessage("");
	}

	function handleSaveDraft() {
		setSaveStatus("saving");
		setSaveMessage("");
		startTransition(async () => {
			const result = await saveDraftLandingPage(state);
			if (result.success) {
				setSaveStatus("saved");
				setSaveMessage(result.message);
				setPendingImageDeletions([]);
				if (mode === "new" && result.slug) {
					router.replace(`/admin/landing-pages/${result.slug}/edit`);
				}
			} else {
				setSaveStatus("error");
				setSaveMessage(result.message);
			}
		});
	}

	function handlePublish() {
		if (!canPublish) return;
		setPublishOpen(false);
		setSaveStatus("saving");
		setSaveMessage("");
		startTransition(async () => {
			const result = await publishLandingPage(state);
			if (result.success) {
				setSaveStatus("saved");
				setSaveMessage(result.message);
				setPendingImageDeletions([]);
				if (mode === "new" && result.slug) {
					router.replace(`/admin/landing-pages/${result.slug}/edit`);
				} else {
					router.refresh();
				}
			} else {
				setSaveStatus("error");
				setSaveMessage(result.message);
			}
		});
	}

	function handleDelete() {
		if (!currentSlug) return;
		startTransition(async () => {
			const result = await deleteLandingPage(currentSlug);
			setDeleteOpen(false);
			if (result.success) {
				router.push("/admin/landing-pages");
			} else {
				setSaveStatus("error");
				setSaveMessage(result.message);
			}
		});
	}

	const subtitle =
		mode === "edit" && currentSlug
			? `/lp/${currentSlug} · Create and customise high-converting landing pages.`
			: "New landing page — unsaved";

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-ink-950">
						Landing Page Builder
					</h1>
					<p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>
				</div>

				<div className="flex items-center gap-2.5">
					{saveStatus === "saved" && saveMessage ? (
						<span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
							<Check className="h-3.5 w-3.5" />
							{saveMessage}
						</span>
					) : saveStatus === "error" && saveMessage ? (
						<span className="flex items-center gap-1 text-xs font-medium text-red-500">
							<AlertCircle className="h-3.5 w-3.5 shrink-0" />
							{saveMessage}
						</span>
					) : null}

					{mode === "edit" && currentSlug ? (
						<button
							type="button"
							onClick={() => setDeleteOpen(true)}
							disabled={isPending}
							aria-label="Delete landing page"
							className="rounded-xl border border-stone-200 bg-white p-2.5 text-red-500 hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
						>
							<Trash2 className="h-4 w-4" />
						</button>
					) : null}

					<button
						type="button"
						onClick={handleSaveDraft}
						disabled={isPending}
						className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
					>
						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Draft"}
					</button>

					{currentSlug ? (
						<Link
							href={`/lp/${currentSlug}`}
							target="_blank"
							rel="noopener noreferrer"
							prefetch={false}
							className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
						>
							Preview
							<ExternalLink className="h-3.5 w-3.5" />
						</Link>
					) : null}

					<div className="relative">
						<div className="flex overflow-hidden rounded-xl">
							<button
								type="button"
								onClick={handlePublish}
								disabled={isPending || !canPublish}
								title={!canPublish ? `Missing ${joinWithAnd(missingForPublish)}` : undefined}
								className="bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
									disabled={!canPublish}
									className="flex w-full px-4 py-3 text-sm text-ink-950 hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-300"
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

			{state.publishStatus === "draft" && !canPublish ? (
				<div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
					<div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
					<p className="text-xs font-medium text-stone-700">
						Before this can be published, add {joinWithAnd(missingForPublish)}.
					</p>
				</div>
			) : null}

			<div className="grid gap-6 lg:grid-cols-[1fr_380px]">
				<div className="flex flex-col gap-6">
					<HeroFieldsPanel
						hero={state.hero}
						onChange={(hero) => updateField("hero", hero)}
						forms={forms}
						onQueueImageDeletion={queueImageDeletion}
					/>
					<LandingPageSettingsPanel
						state={state}
						onChange={updateField}
						projects={projects}
						slugManuallyEdited={slugManuallyEdited}
						onSlugManualEdit={() => setSlugManuallyEdited(true)}
					/>
				</div>

				{/* Live preview — the real hero component, not a mockup. The
				    "Register Your Interest" card stays visible by default here
				    so the admin can see it while editing, even though on the
				    public page it only appears after a CTA click. */}
				<div className="lg:sticky lg:top-6 lg:self-start">
					<div className="mb-2 flex items-center justify-between">
						<p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
							Live Preview
						</p>
					</div>
					<div className="overflow-hidden rounded-2xl border border-stone-200">
						<HeroThemeRenderer
							hero={state.hero}
							formOverlay={
								<div className="rounded-2xl bg-white p-5 shadow-xl">
									<p className="text-sm font-bold text-ink-950">Register Your Interest</p>
									<div className="mt-3 space-y-2">
										{["Full Name", "Email Address", "Phone Number"].map((ph) => (
											<div
												key={ph}
												className="rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-400"
											>
												{ph}
											</div>
										))}
									</div>
									<div className="mt-3 rounded-lg bg-amber-500 px-3 py-2 text-center text-xs font-semibold text-white">
										Submit Enquiry
									</div>
								</div>
							}
						/>
					</div>
				</div>
			</div>

			<ConfirmDialog
				open={deleteOpen}
				title="Delete this landing page?"
				description="This permanently deletes the page and its hero image from Cloudinary. Any ads pointing at this URL will start showing a 404. This can't be undone."
				confirmLabel="Delete permanently"
				variant="danger"
				isLoading={isPending}
				onConfirm={handleDelete}
				onCancel={() => setDeleteOpen(false)}
			/>
		</div>
	);
}