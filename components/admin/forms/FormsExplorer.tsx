// "use client";

// import { useMemo, useState } from "react";
// import Link from "next/link";
// import { Search } from "lucide-react";
// import { AdminBadge } from "@/components/admin/ui/AdminBadge";
// import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
// import type {
// 	AdminFormListRow,
// 	AdminFormStatus,
// } from "@/lib/types/admin/form-builder";

// const STATUS_BADGE: Record<AdminFormStatus, AdminBadgeVariant> = {
// 	active: "active",
// 	review: "review",
// 	draft: "draft",
// };

// const STATUS_OPTIONS = [
// 	{ value: "all", label: "Status — All" },
// 	{ value: "active", label: "Active" },
// 	{ value: "review", label: "Review" },
// 	{ value: "draft", label: "Draft" },
// ];

// const TYPE_OPTIONS = [
// 	{ value: "all", label: "Type — All" },
// 	{ value: "Project", label: "Project" },
// 	{ value: "Brochure", label: "Brochure" },
// 	{ value: "Diaspora", label: "Diaspora" },
// ];

// const selectCn =
// 	"rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

// export function FormsExplorer({ forms }: { forms: AdminFormListRow[] }) {
// 	const [search, setSearch] = useState("");
// 	const [status, setStatus] = useState("all");
// 	const [type, setType] = useState("all");

// 	const filtered = useMemo(() => {
// 		return forms.filter((f) => {
// 			const matchSearch =
// 				!search || f.title.toLowerCase().includes(search.toLowerCase());
// 			const matchStatus = status === "all" || f.status === status;
// 			const matchType = type === "all" || f.type === type;
// 			return matchSearch && matchStatus && matchType;
// 		});
// 	}, [forms, search, status, type]);

// 	return (
// 		<div className="space-y-4">
// 			{/* Filter bar */}
// 			<div className="flex flex-wrap items-center gap-3">
// 				<div className="relative">
// 					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
// 					<input
// 						type="text"
// 						placeholder="Search..."
// 						value={search}
// 						onChange={(e) => setSearch(e.target.value)}
// 						className="rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
// 					/>
// 				</div>
// 				<select
// 					value={status}
// 					onChange={(e) => setStatus(e.target.value)}
// 					className={selectCn}
// 				>
// 					{STATUS_OPTIONS.map((opt) => (
// 						<option key={opt.value} value={opt.value}>
// 							{opt.label}
// 						</option>
// 					))}
// 				</select>
// 				<select
// 					value={type}
// 					onChange={(e) => setType(e.target.value)}
// 					className={selectCn}
// 				>
// 					{TYPE_OPTIONS.map((opt) => (
// 						<option key={opt.value} value={opt.value}>
// 							{opt.label}
// 						</option>
// 					))}
// 				</select>
// 				<select className={selectCn} defaultValue="newest">
// 					<option value="newest">Date — Newest</option>
// 					<option value="oldest">Date — Oldest</option>
// 				</select>
// 			</div>

// 			{/* Table */}
// 			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
// 				<div className="overflow-x-auto">
// 					<table className="w-full min-w-[640px] text-left text-sm">
// 						<thead>
// 							<tr className="border-b border-stone-100 bg-stone-50/60">
// 								{[
// 									"Title",
// 									"Type",
// 									"Related",
// 									"Status",
// 									"SEO / CRM",
// 									"Actions",
// 								].map((h) => (
// 									<th
// 										key={h}
// 										className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
// 									>
// 										{h}
// 									</th>
// 								))}
// 							</tr>
// 						</thead>
// 						<tbody>
// 							{filtered.length === 0 ? (
// 								<tr>
// 									<td
// 										colSpan={6}
// 										className="px-6 py-12 text-center text-sm text-stone-400"
// 									>
// 										No forms match your filters.
// 									</td>
// 								</tr>
// 							) : (
// 								filtered.map((form) => (
// 									<tr
// 										key={form.id}
// 										className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
// 									>
// 										<td className="px-6 py-4 font-semibold text-ink-950">
// 											{form.title}
// 										</td>
// 										<td className="px-6 py-4 text-stone-600">{form.type}</td>
// 										<td className="px-6 py-4 text-stone-600">
// 											{form.relatedLabel}
// 										</td>
// 										<td className="px-6 py-4">
// 											<AdminBadge variant={STATUS_BADGE[form.status]} />
// 										</td>
// 										<td className="px-6 py-4 text-stone-600">{form.crmTag}</td>
// 										<td className="px-6 py-4">
// 											<div className="flex items-center gap-3">
// 											<Link
// 												href={`/admin/forms/${form.id}/edit`}
// 												prefetch={false}
// 												className="text-sm font-medium text-stone-600 hover:text-ink-950"
// 											>
// 													Edit
// 												</Link>
// 											<Link
// 												href={`/admin/forms/${form.id}/edit`}
// 												prefetch={false}
// 												className="text-sm font-medium text-red-600 hover:text-red-700"
// 											>
// 													Builder
// 												</Link>
// 											</div>
// 										</td>
// 									</tr>
// 								))
// 							)}
// 						</tbody>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }


// components/admin/forms/FormsExplorer.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AlertTriangle, Search, Trash2 } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { deleteForm } from "@/lib/actions/forms";
import type { AdminFormListRow } from "@/lib/types/admin/form-builder";

export function FormsExplorer({ forms: initialForms }: { forms: AdminFormListRow[] }) {
	const [forms, setForms] = useState(initialForms);
	const [search, setSearch] = useState("");
	const [confirmDelete, setConfirmDelete] = useState<AdminFormListRow | null>(null);
	const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const filtered = useMemo(
		() => forms.filter((f) => f.title.toLowerCase().includes(search.toLowerCase())),
		[forms, search],
	);

	function handleConfirmDelete() {
		if (!confirmDelete) return;
		setBusyId(confirmDelete.id);
		startTransition(async () => {
			const result = await deleteForm(confirmDelete.id);
			if (result.success) {
				setForms((prev) => prev.filter((f) => f.id !== confirmDelete.id));
				setConfirmDelete(null);
			} else if (result.usage && result.usage.length > 0) {
				setConfirmDelete(null);
				setBlockedMessage(
					`"${confirmDelete.title}" is used on ${result.usage
						.map((u) => `"${u.title}" (${u.role} form)`)
						.join(", ")}. Unlink it there before deleting.`,
				);
			} else {
				setConfirmDelete(null);
				setBlockedMessage(result.message);
			}
			setBusyId(null);
		});
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<div className="relative w-full sm:w-64">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
					<input
						type="text"
						placeholder="Search forms..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
					/>
				</div>
				<Link
					href="/admin/forms/new"
					className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
				>
					+ New Form
				</Link>
			</div>

			{blockedMessage ? (
				<div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
					<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
					<p className="flex-1 text-xs font-medium text-stone-700">
						{blockedMessage}
					</p>
					<button
						type="button"
						onClick={() => setBlockedMessage(null)}
						className="text-xs font-medium text-stone-500 hover:text-stone-700"
					>
						Dismiss
					</button>
				</div>
			) : null}

			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
				<div className="overflow-x-auto">
					<table className="w-full min-w-180 text-left text-sm">
						<thead>
							<tr className="border-b border-stone-100 bg-stone-50/60">
								{[
									"Title",
									"Type",
									"Fields",
									"Status",
									"CRM Tag",
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
										No forms match your search.
									</td>
								</tr>
							) : (
								filtered.map((form) => (
									<tr
										key={form.id}
										className="border-b border-stone-100 last:border-none hover:bg-stone-50"
									>
										<td className="px-6 py-4 font-semibold text-ink-950">
											{form.title}
										</td>
										<td className="px-6 py-4 text-stone-600">{form.type}</td>
										<td className="px-6 py-4 text-stone-600">
											{form.relatedLabel}
										</td>
										<td className="px-6 py-4">
											<AdminBadge
												variant={
													form.status === "active" ? "published" : "draft"
												}
											/>
										</td>
										<td className="px-6 py-4 text-stone-500">{form.crmTag}</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-end gap-3">
												<Link
													href={`/admin/forms/${form.id}/edit`}
													className="text-sm font-medium text-red-600 hover:text-red-700"
												>
													Edit
												</Link>
												<button
													type="button"
													onClick={() => setConfirmDelete(form)}
													disabled={busyId === form.id && isPending}
													className="text-stone-400 hover:text-red-500 disabled:opacity-50"
													aria-label="Delete form"
												>
													<Trash2 className="h-4 w-4" />
												</button>
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
				description="This permanently deletes the form and its fields. This can't be undone."
				confirmLabel="Delete permanently"
				variant="danger"
				isLoading={isPending}
				onConfirm={handleConfirmDelete}
				onCancel={() => setConfirmDelete(null)}
			/>
		</div>
	);
}