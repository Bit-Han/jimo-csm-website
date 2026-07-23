//@component/admin/leads/LeadsExplorer.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
	AtSign,
	BookOpen,
	ChevronDown,
	Columns,
	FileText,
	Globe2,
	MessageCircle,
  X,
	Search,
	SortDesc,
	Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { cn } from "@/lib/utils/helpers";
import type {
	LeadColumnKey,
	LeadFilterState,
	LeadListRow,
	LeadSource,
	LeadStatus,
} from "@/lib/types/admin/lead";

const SOURCE_CONFIG: Record<
	LeadSource,
	{ icon: LucideIcon; label: string; iconClass: string }
> = {
	website: { icon: Globe2, label: "Website", iconClass: "text-blue-500" },
	landing_page: {
		icon: FileText,
		label: "Landing Page",
		iconClass: "text-violet-500",
	},
	whatsapp: {
		icon: MessageCircle,
		label: "WhatsApp",
		iconClass: "text-emerald-500",
	},
	X: {
		icon: X,
		label: "X",
		iconClass: "text-gray-700",
	},
	instagram: { icon: AtSign, label: "Instagram", iconClass: "text-pink-500" },
	google: { icon: Search, label: "Google", iconClass: "text-amber-500" },
	referral: { icon: Users, label: "Referral", iconClass: "text-sky-500" },
	brochure: { icon: BookOpen, label: "Brochure", iconClass: "text-orange-500" },
};

const STATUS_BADGE: Record<LeadStatus, AdminBadgeVariant> = {
	new: "new",
	contacted: "contacted",
	qualified: "qualified",
	inspection: "inspection",
	negotiation: "negotiation",
	won: "won",
	lost: "lost",
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
	{ value: "all", label: "Status — All" },
	{ value: "new", label: "New" },
	{ value: "contacted", label: "Contacted" },
	{ value: "qualified", label: "Qualified" },
	{ value: "inspection", label: "Inspection" },
	{ value: "negotiation", label: "Negotiation" },
	{ value: "won", label: "Won" },
	{ value: "lost", label: "Lost" },
];

const BUDGET_OPTIONS: { value: string; label: string }[] = [
	{ value: "all", label: "Budget — All" },
	{ value: "under-50m", label: "Under ₦50M" },
	{ value: "50m-100m", label: "₦50M–₦100M" },
	{ value: "100m-200m", label: "₦100M–₦200M" },
	{ value: "200m-plus", label: "₦200M+" },
];

const ALL_COLUMNS: { key: LeadColumnKey; label: string }[] = [
	{ key: "phone", label: "Phone" },
	{ key: "projectPage", label: "Project / Page" },
	{ key: "budget", label: "Budget" },
	{ key: "source", label: "Source" },
	{ key: "assignedTo", label: "Assigned" },
	{ key: "date", label: "Date" },
];

const selectCn =
	"rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

function matchesBudget(budget: string, filter: string): boolean {
	if (filter === "all") return true;
	const raw = budget.replace(/₦|M|\+|–/g, "").trim();
	const nums = raw
		.split(" ")
		.map((n) => parseInt(n, 10))
		.filter(Boolean);
	const low = nums[0] ?? 0;
	if (filter === "under-50m") return low < 50;
	if (filter === "50m-100m") return low >= 50 && low < 100;
	if (filter === "100m-200m") return low >= 100 && low < 200;
	if (filter === "200m-plus") return budget.includes("200M+") || low >= 200;
	return true;
}

export interface LeadsExplorerProps {
	leads: LeadListRow[];
}

export function LeadsExplorer({ leads }: LeadsExplorerProps) {
	const [filters, setFilters] = useState<LeadFilterState>({
		project: "all",
		budget: "all",
		status: "all",
		search: "",
		sort: "newest",
	});

	const [visibleColumns, setVisibleColumns] = useState<Set<LeadColumnKey>>(
		new Set<LeadColumnKey>([
			"phone",
			"projectPage",
			"budget",
			"source",
			"assignedTo",
			"date",
		]),
	);

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [columnsOpen, setColumnsOpen] = useState(false);
	const [sortOpen, setSortOpen] = useState(false);

	const uniqueProjects = useMemo(
		() =>
			Array.from(
				new Set(leads.map((l) => l.projectPage.split(" · ")[0] ?? "")),
			).sort(),
		[leads],
	);

	const filtered = useMemo(() => {
		let rows = leads.filter((l) => {
			const matchSearch =
				!filters.search ||
				l.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				l.phone.includes(filters.search);
			const matchProject =
				filters.project === "all" || l.projectPage.startsWith(filters.project);
			const matchBudget = matchesBudget(l.budget, filters.budget);
			const matchStatus =
				filters.status === "all" || l.status === filters.status;
			return matchSearch && matchProject && matchBudget && matchStatus;
		});

		if (filters.sort === "oldest") {
			rows = [...rows].reverse();
		}

		return rows;
	}, [leads, filters]);

	const allSelected =
		filtered.length > 0 && filtered.every((l) => selectedIds.has(l.id));

	function toggleAll() {
		if (allSelected) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(filtered.map((l) => l.id)));
		}
	}

	function toggleRow(id: string) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	function toggleColumn(key: LeadColumnKey) {
		setVisibleColumns((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	}

	function set<K extends keyof LeadFilterState>(
		key: K,
		value: LeadFilterState[K],
	) {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}

	return (
		<div className="space-y-4">
			{/* Filter bar */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
					<input
						type="text"
						placeholder="Search leads..."
						value={filters.search}
						onChange={(e) => set("search", e.target.value)}
						className="rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
					/>
				</div>

				<select
					value={filters.project}
					onChange={(e) => set("project", e.target.value)}
					className={selectCn}
				>
					<option value="all">Project — All</option>
					{uniqueProjects.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</select>

				<select
					value={filters.budget}
					onChange={(e) => set("budget", e.target.value)}
					className={selectCn}
				>
					{BUDGET_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				<select
					value={filters.status}
					onChange={(e) => set("status", e.target.value)}
					className={selectCn}
				>
					{STATUS_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* Count row + column/sort controls */}
			<div className="flex items-center justify-between">
				<p className="text-sm font-medium text-stone-600">
					{filtered.length} lead{filtered.length !== 1 ? "s" : ""} found
				</p>

				<div className="flex items-center gap-2">
					{/* Columns toggle */}
					<div className="relative">
						<button
							type="button"
							onClick={() => {
								setColumnsOpen((o) => !o);
								setSortOpen(false);
							}}
							className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
						>
							<Columns className="h-4 w-4" />
							Columns
						</button>
						{columnsOpen ? (
							<div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
								{ALL_COLUMNS.map(({ key, label }) => (
									<label
										key={key}
										className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm hover:bg-stone-50"
									>
										<input
											type="checkbox"
											checked={visibleColumns.has(key)}
											onChange={() => toggleColumn(key)}
											className="h-4 w-4 rounded border-stone-300 text-red-600"
										/>
										{label}
									</label>
								))}
							</div>
						) : null}
					</div>

					{/* Sort */}
					<div className="relative">
						<button
							type="button"
							onClick={() => {
								setSortOpen((o) => !o);
								setColumnsOpen(false);
							}}
							className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
						>
							<SortDesc className="h-4 w-4" />
							{filters.sort === "newest" ? "Newest" : "Oldest"}
							<ChevronDown className="h-3.5 w-3.5" />
						</button>
						{sortOpen ? (
							<div className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
								{(["newest", "oldest"] as const).map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => {
											set("sort", s);
											setSortOpen(false);
										}}
										className={cn(
											"flex w-full px-4 py-2.5 text-sm capitalize",
											filters.sort === s
												? "bg-red-50 font-semibold text-red-600"
												: "text-stone-600 hover:bg-stone-50",
										)}
									>
										{s}
									</button>
								))}
							</div>
						) : null}
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[700px] text-left text-sm">
						<thead>
							<tr className="border-b border-stone-100 bg-stone-50/60">
								<th className="w-10 px-4 py-3.5">
									<input
										type="checkbox"
										checked={allSelected}
										onChange={toggleAll}
										className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
									/>
								</th>
								<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
									Name
								</th>
								{visibleColumns.has("phone") ? (
									<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
										Phone
									</th>
								) : null}
								{visibleColumns.has("projectPage") ? (
									<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
										Project / Page
									</th>
								) : null}
								{visibleColumns.has("budget") ? (
									<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
										Budget
									</th>
								) : null}
								{visibleColumns.has("source") ? (
									<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
										Source
									</th>
								) : null}
								<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
									Status
								</th>
								{visibleColumns.has("assignedTo") ? (
									<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
										Assigned
									</th>
								) : null}
								{visibleColumns.has("date") ? (
									<th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
										Date
									</th>
								) : null}
								<th className="px-4 py-3.5" />
							</tr>
						</thead>

						<tbody>
							{filtered.length === 0 ? (
								<tr>
									<td
										colSpan={10}
										className="px-4 py-12 text-center text-sm text-stone-400"
									>
										No leads match your current filters.
									</td>
								</tr>
							) : (
								filtered.map((lead) => {
									const {
										icon: Icon,
										label: sourceLabel,
										iconClass,
									} = SOURCE_CONFIG[lead.source];
									return (
										<tr
											key={lead.id}
											className={cn(
												"border-b border-stone-100 transition-colors last:border-none",
												selectedIds.has(lead.id)
													? "bg-red-50/40"
													: "hover:bg-stone-50",
											)}
										>
											<td className="px-4 py-4">
												<input
													type="checkbox"
													checked={selectedIds.has(lead.id)}
													onChange={() => toggleRow(lead.id)}
													className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
												/>
											</td>
											<td className="px-4 py-4 font-semibold text-ink-950">
												{lead.name}
											</td>
											{visibleColumns.has("phone") ? (
												<td className="px-4 py-4 font-mono text-xs text-stone-600">
													{lead.phone}
												</td>
											) : null}
											{visibleColumns.has("projectPage") ? (
												<td className="px-4 py-4 text-stone-600">
													{lead.projectPage}
												</td>
											) : null}
											{visibleColumns.has("budget") ? (
												<td className="px-4 py-4 text-stone-600">
													{lead.budget}
												</td>
											) : null}
											{visibleColumns.has("source") ? (
												<td className="px-4 py-4">
													<span className="flex items-center gap-1.5">
														<Icon className={cn("h-3.5 w-3.5", iconClass)} />
														<span className="text-stone-600">
															{sourceLabel}
														</span>
													</span>
												</td>
											) : null}
											<td className="px-4 py-4">
												<AdminBadge variant={STATUS_BADGE[lead.status]} />
											</td>
											{visibleColumns.has("assignedTo") ? (
												<td className="px-4 py-4 text-stone-600">
													{lead.assignedTo ?? (
														<span className="text-stone-400">Unassigned</span>
													)}
												</td>
											) : null}
											{visibleColumns.has("date") ? (
												<td className="px-4 py-4">
													<p className="text-stone-600">{lead.date}</p>
													<p className="mt-0.5 text-xs text-stone-400">
														{lead.time}
													</p>
												</td>
											) : null}
											<td className="pr-4 py-4 text-right">
												<Link
													href={`/admin/leads/${lead.id}`}
													className="text-sm font-medium text-red-600 hover:text-red-700"
												>
													View
												</Link>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
