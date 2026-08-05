"use client";

import { useRef } from "react";
import Link from "next/link";
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	FileText,
	Globe2,
	Loader2,
	MessageCircle,
	Search,
	Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type {
	LeadFilterOptions,
	LeadFilters,
	LeadListRow,
	LeadSource,
	LeadStatus,
	PaginatedLeadsResult,
} from "@/lib/types/admin/lead";

// ─── Source display ────────────────────────────────────────────────────────

const SOURCE_CONFIG: Record<LeadSource, { icon: LucideIcon; label: string; colorClass: string }> = {
	website: { icon: Globe2, label: "Contact Form", colorClass: "text-blue-500" },
	brochure: {
		icon: BookOpen,
		label: "Brochure",
		colorClass: "text-orange-500",
	},
	landing_page: {
		icon: FileText,
		label: "Landing Page",
		colorClass: "text-violet-500",
	},
	whatsapp: {
		icon: MessageCircle,
		label: "WhatsApp",
		colorClass: "text-emerald-500",
	},
	instagram: { icon: Users, label: "Instagram", colorClass: "text-pink-500" },
	google: { icon: Search, label: "Google", colorClass: "text-amber-500" },
	referral: { icon: Users, label: "Referral", colorClass: "text-sky-500" },
};

// ─── Status badge ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<LeadStatus, string> = {
	new: "bg-blue-50 text-blue-700",
	contacted: "bg-amber-50 text-amber-700",
	qualified: "bg-emerald-50 text-emerald-700",
	inspection: "bg-violet-50 text-violet-700",
	negotiation: "bg-orange-50 text-orange-700",
	won: "bg-green-100 text-green-800",
	lost: "bg-stone-100 text-stone-500",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
	new: "New",
	contacted: "Contacted",
	qualified: "Qualified",
	inspection: "Inspection",
	negotiation: "Negotiation",
	won: "Won",
	lost: "Lost",
};

// ─── Filter bar ────────────────────────────────────────────────────────────

const SELECT_CN =
	"rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:opacity-60";

function LeadsFilterBar({
	filters,
	filterOptions,
	isLoading,
	onChange,
}: {
	filters: LeadFilters;
	filterOptions: LeadFilterOptions;
	isLoading: boolean;
	onChange: (patch: Partial<LeadFilters>) => void;
}) {
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	function handleSearch(value: string) {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => onChange({ search: value }), 400);
	}

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="relative">
				{isLoading ? (
					<Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-stone-400" />
				) : (
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
				)}
				<input
					type="text"
					placeholder="Search name, phone, email..."
					defaultValue={filters.search ?? ""}
					onChange={(e) => handleSearch(e.target.value)}
					className="rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
				/>
			</div>

			<select
				value={filters.status ?? "all"}
				onChange={(e) => onChange({ status: e.target.value })}
				disabled={isLoading}
				className={SELECT_CN}
			>
				<option value="all">Status — All</option>
				<option value="new">New</option>
				<option value="contacted">Contacted</option>
				<option value="qualified">Qualified</option>
				<option value="inspection">Inspection</option>
				<option value="negotiation">Negotiation</option>
				<option value="won">Won</option>
				<option value="lost">Lost</option>
			</select>

			<select
				value={filters.source ?? "all"}
				onChange={(e) => onChange({ source: e.target.value })}
				disabled={isLoading}
				className={SELECT_CN}
			>
				<option value="all">Source — All</option>
				<option value="website">Contact Form</option>
				<option value="brochure">Brochure</option>
				<option value="landing_page">Landing Page</option>
				<option value="whatsapp">WhatsApp</option>
				<option value="instagram">Instagram</option>
				<option value="google">Google</option>
				<option value="referral">Referral</option>
			</select>

			{filterOptions.projects.length > 0 ? (
				<select
					value={filters.projectSlug ?? "all"}
					onChange={(e) => onChange({ projectSlug: e.target.value })}
					disabled={isLoading}
					className={SELECT_CN}
				>
					<option value="all">Project — All</option>
					{filterOptions.projects.map((p) => (
						<option key={p.slug} value={p.slug}>
							{p.name}
						</option>
					))}
				</select>
			) : null}

			{filterOptions.landingPages.length > 0 ? (
				<select
					value={filters.landingPageSlug ?? "all"}
					onChange={(e) => onChange({ landingPageSlug: e.target.value })}
					disabled={isLoading}
					className={SELECT_CN}
				>
					<option value="all">Landing Page — All</option>
					{filterOptions.landingPages.map((p) => (
						<option key={p.slug} value={p.slug}>
							{p.name}
						</option>
					))}
				</select>
			) : null}

			<select
				value={filters.sort ?? "newest"}
				onChange={(e) =>
					onChange({ sort: e.target.value as "newest" | "oldest" })
				}
				disabled={isLoading}
				className={SELECT_CN}
			>
				<option value="newest">Date — Newest</option>
				<option value="oldest">Date — Oldest</option>
			</select>
		</div>
	);
}

// ─── Main component ────────────────────────────────────────────────────────

export interface LeadsExplorerProps {
	result: PaginatedLeadsResult;
	currentFilters: LeadFilters;
	filterOptions: LeadFilterOptions;
	isLoading: boolean;
	selectedIds: Set<string>;
	onSelectedIdsChange: (ids: Set<string>) => void;
	onFilterChange: (patch: Partial<LeadFilters>) => void;
	onPageChange: (page: number) => void;
}

export function LeadsExplorer({
	result,
	currentFilters,
	filterOptions,
	isLoading,
	selectedIds,
	onSelectedIdsChange,
	onFilterChange,
	onPageChange,
}: LeadsExplorerProps) {
	const { rows, page, totalPages, totalCount } = result;
	const allSelected =
		rows.length > 0 && rows.every((r) => selectedIds.has(r.id));

	function toggleAll() {
		if (allSelected) {
			onSelectedIdsChange(new Set());
		} else {
			onSelectedIdsChange(new Set(rows.map((r) => r.id)));
		}
	}

	function toggleRow(id: string) {
		const next = new Set(selectedIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		onSelectedIdsChange(next);
	}

	return (
		<div className="space-y-4">
			<LeadsFilterBar
				filters={currentFilters}
				filterOptions={filterOptions}
				isLoading={isLoading}
				onChange={onFilterChange}
			/>

			<div
				className={cn(
					"transition-opacity duration-150",
					isLoading && "pointer-events-none opacity-60",
				)}
			>
				{/* Desktop table */}
				<div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white sm:block">
					{rows.length === 0 ? (
						<div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
							<Users className="h-10 w-10 text-stone-300" />
							<p className="text-sm font-semibold text-stone-500">
								No leads yet
							</p>
							<p className="max-w-sm text-xs text-stone-400">
								Leads appear here as people fill in the contact form, request
								brochures, or submit landing page forms. Try adjusting your
								filters, or wait for the first enquiry to come in.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full min-w-[800px] text-left text-sm">
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
										{[
											"Name",
											"Contact",
											"Project / Page",
											"Source",
											"Status",
											"Assigned",
											"Date",
											"",
										].map((h) => (
											<th
												key={h}
												className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{rows.map((lead) => (
										<LeadTableRow
											key={lead.id}
											lead={lead}
											selected={selectedIds.has(lead.id)}
											onToggle={() => toggleRow(lead.id)}
										/>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{/* Mobile cards */}
				<div className="space-y-3 sm:hidden">
					{rows.length === 0 ? (
						<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-12 text-center">
							<Users className="h-8 w-8 text-stone-300" />
							<p className="text-sm text-stone-400">
								No leads match your current filters.
							</p>
						</div>
					) : (
						rows.map((lead) => (
							<LeadMobileCard
								key={lead.id}
								lead={lead}
								selected={selectedIds.has(lead.id)}
								onToggle={() => toggleRow(lead.id)}
							/>
						))
					)}
				</div>
			</div>

			{/* Pagination */}
			{totalPages > 1 || totalCount > 0 ? (
				<div className="flex items-center justify-between border-t border-stone-100 pt-3">
					<p className="text-xs text-stone-500">
						{totalCount.toLocaleString()} total lead
						{totalCount !== 1 ? "s" : ""}
					</p>
					{totalPages > 1 ? (
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => onPageChange(page - 1)}
								disabled={page <= 1 || isLoading}
								className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
							>
								<ChevronLeft className="h-3.5 w-3.5" /> Prev
							</button>
							<span className="text-xs font-medium text-stone-600">
								{page} / {totalPages}
							</span>
							<button
								type="button"
								onClick={() => onPageChange(page + 1)}
								disabled={page >= totalPages || isLoading}
								className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
							>
								Next <ChevronRight className="h-3.5 w-3.5" />
							</button>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
}

// ─── Table row ─────────────────────────────────────────────────────────────

function LeadTableRow({
	lead,
	selected,
	onToggle,
}: {
	lead: LeadListRow;
	selected: boolean;
	onToggle: () => void;
}) {
	const cfg = SOURCE_CONFIG[lead.source as LeadSource];
	const Icon = cfg?.icon ?? Globe2;

	return (
		<tr
			className={cn(
				"border-b border-stone-100 transition-colors last:border-none",
				selected ? "bg-red-50/40" : "hover:bg-stone-50",
			)}
		>
			<td className="px-4 py-4">
				<input
					type="checkbox"
					checked={selected}
					onChange={onToggle}
					className="h-4 w-4 rounded border-stone-300 text-red-600 focus:ring-red-600"
				/>
			</td>
			<td className="px-4 py-4 font-semibold text-ink-950">{lead.name}</td>
			<td className="px-4 py-4">
				<p className="font-mono text-xs text-stone-600">{lead.phone}</p>
			</td>
			<td className="px-4 py-4 text-stone-600">{lead.projectPage}</td>
			<td className="px-4 py-4">
				<span
					className={cn(
						"flex items-center gap-1.5 text-xs font-medium",
						cfg?.colorClass ?? "text-stone-500",
					)}
				>
					<Icon className="h-3.5 w-3.5 shrink-0" />
					{cfg?.label ?? lead.source}
				</span>
			</td>
			<td className="px-4 py-4">
				<span
					className={cn(
						"inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
						STATUS_STYLE[lead.status],
					)}
				>
					{STATUS_LABEL[lead.status]}
				</span>
			</td>
			<td className="px-4 py-4 text-stone-600">
				{lead.assignedTo ?? (
					<span className="text-stone-400">Unassigned</span>
				)}
			</td>
			<td className="px-4 py-4">
				<p className="text-xs text-stone-600">{lead.date}</p>
				<p className="text-[11px] text-stone-400">{lead.time}</p>
			</td>
			<td className="py-4 pr-4 text-right">
				<Link
					href={`/admin/leads/${lead.id}`}
					className="text-sm font-medium text-red-600 hover:text-red-700"
				>
					View
				</Link>
			</td>
		</tr>
	);
}

// ─── Mobile card ───────────────────────────────────────────────────────────

function LeadMobileCard({
	lead,
	selected,
	onToggle,
}: {
	lead: LeadListRow;
	selected: boolean;
	onToggle: () => void;
}) {
	const cfg = SOURCE_CONFIG[lead.source as LeadSource];
	const Icon = cfg?.icon ?? Globe2;

	return (
		<div
			className={cn(
				"rounded-2xl border bg-white p-4",
				selected ? "border-red-300 bg-red-50/40" : "border-stone-200",
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-start gap-3">
					<input
						type="checkbox"
						checked={selected}
						onChange={onToggle}
						className="mt-1 h-4 w-4 shrink-0 rounded border-stone-300 text-red-600"
					/>
					<div>
						<p className="font-semibold text-ink-950">{lead.name}</p>
						<p className="mt-0.5 font-mono text-xs text-stone-500">
							{lead.phone}
						</p>
					</div>
				</div>
				<span
					className={cn(
						"shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
						STATUS_STYLE[lead.status],
					)}
				>
					{STATUS_LABEL[lead.status]}
				</span>
			</div>

			<div className="mt-3 space-y-1 text-xs text-stone-600">
				<p>{lead.projectPage}</p>
				<p
					className={cn(
						"flex items-center gap-1.5",
						cfg?.colorClass ?? "text-stone-500",
					)}
				>
					<Icon className="h-3.5 w-3.5" />
					{cfg?.label ?? lead.source}
				</p>
				<p className="text-stone-400">
					{lead.date} · {lead.time}
				</p>
			</div>

			<Link
				href={`/admin/leads/${lead.id}`}
				className="mt-3 flex w-full items-center justify-center rounded-lg border border-stone-200 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
			>
				View Lead
			</Link>
		</div>
	);
}