// components/admin/landing-pages/LandingPagesExplorer.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MoreVertical, Search, Trash2 } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import {
	deleteLandingPage,
	unpublishLandingPage,
} from "@/lib/actions/admin/landing-pages";
import { cn } from "@/lib/utils/helpers";
import type {
	AdminLandingPageListRow,
	LandingPageFilterState,
	LandingPagePublishStatus,
} from "@/lib/types/admin/landing-page";

const PUBLISH_BADGE: Record<LandingPagePublishStatus, AdminBadgeVariant> = {
	published: "published",
	draft: "draft",
};

const selectCn =
	"rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

const MENU_WIDTH = 176;

// Same portal-based menu as InsightsExplorer — a table wrapper needing
// overflow-x-auto can't stay clip-free on the y-axis for an absolutely
// positioned dropdown, so this renders into document.body positioned by
// real screen coordinates instead. Built in from the start here rather
// than retrofitted.
function RowMenu({
	page,
	onUnpublish,
	onDelete,
	busy,
}: {
	page: AdminLandingPageListRow;
	onUnpublish: () => void;
	onDelete: () => void;
	busy: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [coords, setCoords] = useState<{ top: number; left: number } | null>(
		null,
	);
	const buttonRef = useRef<HTMLButtonElement>(null);

	function computeCoords() {
		const rect = buttonRef.current?.getBoundingClientRect();
		if (!rect) return;
		setCoords({
			top: rect.bottom + window.scrollY + 4,
			left: Math.max(8, rect.right + window.scrollX - MENU_WIDTH),
		});
	}

	function toggle() {
		if (open) {
			setOpen(false);
			return;
		}
		computeCoords();
		setOpen(true);
	}

	useEffect(() => {
		if (!open) return;
		function reposition() {
			computeCoords();
		}
		window.addEventListener("scroll", reposition, true);
		window.addEventListener("resize", reposition);
		return () => {
			window.removeEventListener("scroll", reposition, true);
			window.removeEventListener("resize", reposition);
		};
	}, [open]);

	return (
		<div className="relative">
			<button
				ref={buttonRef}
				type="button"
				onClick={toggle}
				disabled={busy}
				aria-label="More actions"
				aria-expanded={open}
				className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-ink-950 disabled:opacity-50"
			>
				{busy ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<MoreVertical className="h-4 w-4" />
				)}
			</button>

			{open && coords
				? createPortal(
						<>
							<button
								type="button"
								aria-label="Close menu"
								onClick={() => setOpen(false)}
								className="fixed inset-0 z-40"
							/>
							<div
								style={{
									position: "absolute",
									top: coords.top,
									left: coords.left,
									width: MENU_WIDTH,
								}}
								className="z-50 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
							>
								{page.publishStatus === "published" ? (
									<button
										type="button"
										onClick={() => {
											setOpen(false);
											onUnpublish();
										}}
										className="flex w-full px-3 py-2 text-left text-xs font-medium text-amber-600 hover:bg-amber-50"
									>
										Unpublish
									</button>
								) : null}
								<button
									type="button"
									onClick={() => {
										setOpen(false);
										onDelete();
									}}
									className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50"
								>
									<Trash2 className="h-3.5 w-3.5" />
									Delete
								</button>
							</div>
						</>,
						document.body,
					)
				: null}
		</div>
	);
}

export function LandingPagesExplorer({
	pages: initialPages,
}: {
	pages: AdminLandingPageListRow[];
}) {
	const router = useRouter();
	const [pages, setPages] = useState(initialPages);
	const [filters, setFilters] = useState<LandingPageFilterState>({
		search: "",
		status: "all",
		campaignType: "all",
		sort: "newest",
	});
	const [busyId, setBusyId] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] =
		useState<AdminLandingPageListRow | null>(null);
	const [isPending, startTransition] = useTransition();

	// Campaign types aren't a fixed lookup table — derive the filter's
	// options from whatever values actually exist, same reasoning as why
	// insight categories moved off a hardcoded enum.
	const campaignTypeOptions = useMemo(() => {
		const unique = Array.from(
			new Set(
				pages.map((p) => p.campaignType).filter((v): v is string => Boolean(v)),
			),
		);
		return [
			{ value: "all", label: "All" },
			...unique.map((v) => ({ value: v, label: v })),
		];
	}, [pages]);

	const filtered = useMemo(() => {
		let rows = pages.filter((p) => {
			const matchSearch =
				!filters.search ||
				p.title.toLowerCase().includes(filters.search.toLowerCase());
			const matchStatus =
				filters.status === "all" || p.publishStatus === filters.status;
			const matchType =
				filters.campaignType === "all" ||
				p.campaignType === filters.campaignType;
			return matchSearch && matchStatus && matchType;
		});
		if (filters.sort === "oldest") rows = [...rows].reverse();
		return rows;
	}, [pages, filters]);

	function set<K extends keyof LandingPageFilterState>(
		key: K,
		value: LandingPageFilterState[K],
	) {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}

	function handleUnpublish(page: AdminLandingPageListRow) {
		setBusyId(page.id);
		startTransition(async () => {
			const result = await unpublishLandingPage(page.slug);
			if (result.success) {
				setPages((prev) =>
					prev.map((p) =>
						p.id === page.id ? { ...p, publishStatus: "draft" } : p,
					),
				);
			}
			setBusyId(null);
		});
	}

	function handleConfirmDelete() {
		if (!confirmDelete) return;
		setBusyId(confirmDelete.id);
		startTransition(async () => {
			const result = await deleteLandingPage(confirmDelete.slug);
			if (result.success)
				setPages((prev) => prev.filter((p) => p.id !== confirmDelete.id));
			setConfirmDelete(null);
			setBusyId(null);
			router.refresh();
		});
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative w-full sm:w-auto">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
					<input
						type="text"
						placeholder="Search..."
						value={filters.search}
						onChange={(e) => set("search", e.target.value)}
						className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 sm:w-56"
					/>
				</div>
				<select
					value={filters.status}
					onChange={(e) => set("status", e.target.value)}
					className={selectCn}
				>
					<option value="all">Status — All</option>
					<option value="published">Published</option>
					<option value="draft">Draft</option>
				</select>
				<select
					value={filters.campaignType}
					onChange={(e) => set("campaignType", e.target.value)}
					className={selectCn}
				>
					{campaignTypeOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.value === "all" ? "Type — All" : opt.label}
						</option>
					))}
				</select>
				<select
					value={filters.sort}
					onChange={(e) =>
						set("sort", e.target.value as LandingPageFilterState["sort"])
					}
					className={selectCn}
				>
					<option value="newest">Date — Newest</option>
					<option value="oldest">Date — Oldest</option>
				</select>
			</div>

			{/* Mobile — stacked cards below md */}
			<div className="space-y-3 md:hidden">
				{filtered.length === 0 ? (
					<div className="rounded-2xl border border-stone-200 bg-white px-6 py-10 text-center text-sm text-stone-400">
						No landing pages match your filters.
					</div>
				) : (
					filtered.map((page) => (
						<div
							key={page.id}
							className="rounded-2xl border border-stone-200 bg-white p-4"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0 flex-1">
									<p className="truncate font-semibold text-ink-950">
										{page.title}
									</p>
									<p className="mt-0.5 text-xs text-stone-500">
										{page.campaignType ?? "—"}
									</p>
								</div>
								<AdminBadge variant={PUBLISH_BADGE[page.publishStatus]} />
							</div>

							<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
								{page.linkedProjectName ? (
									<span>
										Linked:{" "}
										<span className="text-stone-700">
											{page.linkedProjectName}
										</span>
									</span>
								) : null}
								<span>{page.updatedAt}</span>
							</div>

							<div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
								<Link
									href={`/admin/landing-pages/${page.slug}/edit`}
									className="text-sm font-medium text-red-600 hover:text-red-700"
								>
									Edit
								</Link>
								<RowMenu
									page={page}
									busy={busyId === page.id && isPending}
									onUnpublish={() => handleUnpublish(page)}
									onDelete={() => setConfirmDelete(page)}
								/>
							</div>
						</div>
					))
				)}
			</div>

			{/* Desktop — table from md up */}
			<div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white md:block">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[760px] text-left text-sm">
						<thead>
							<tr className="border-b border-stone-100 bg-stone-50/60">
								{[
									"Title",
									"Type",
									"Related",
									"Status",
									"Updated",
									"Actions",
								].map((h) => (
									<th
										key={h}
										className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-12 text-center text-sm text-stone-400"
									>
										No landing pages match your filters.
									</td>
								</tr>
							) : (
								filtered.map((page) => (
									<tr
										key={page.id}
										className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
									>
										<td className="px-6 py-4 font-semibold text-ink-950">
											{page.title}
										</td>
										<td className="px-6 py-4 text-stone-600">
											{page.campaignType ?? (
												<span className="text-stone-400">—</span>
											)}
										</td>
										<td className="px-6 py-4 text-stone-600">
											{page.linkedProjectName ?? (
												<span className="text-stone-400">—</span>
											)}
										</td>
										<td className="px-6 py-4">
											<AdminBadge variant={PUBLISH_BADGE[page.publishStatus]} />
										</td>
										<td className="px-6 py-4 text-stone-500">
											{page.updatedAt}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-end gap-3">
												<Link
													href={`/admin/landing-pages/${page.slug}/edit`}
													className="text-sm font-medium text-red-600 hover:text-red-700"
												>
													Edit
												</Link>
												<RowMenu
													page={page}
													busy={busyId === page.id && isPending}
													onUnpublish={() => handleUnpublish(page)}
													onDelete={() => setConfirmDelete(page)}
												/>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<ConfirmDialog
				open={confirmDelete !== null}
				title={confirmDelete ? `Delete "${confirmDelete.title}"?` : ""}
				description="This permanently deletes the landing page and its hero image from Cloudinary. This can't be undone. Any ads pointing at this URL will start showing a 404."
				confirmLabel="Delete permanently"
				variant="danger"
				isLoading={isPending}
				onConfirm={handleConfirmDelete}
				onCancel={() => setConfirmDelete(null)}
			/>
		</div>
	);
}
