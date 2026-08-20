// //@component/admin/leads/lead-profile/LeadProfileHeader.tsx
"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Loader2,
	MessageCircle,
	Phone,
} from "lucide-react";
import { assignLeads, updateLeadStatus } from "@/lib/actions/admin/leads";
import { cn } from "@/lib/utils/helpers";
import type {
	AssignableAdmin,
	LeadDetail,
	LeadStatus,
} from "@/lib/types/admin/lead";
import { siteConfig } from "@/lib/data/site";

const STATUS_OPTIONS: { value: LeadStatus; label: string; badgeCn: string }[] =
	[
		{ value: "new", label: "New Lead", badgeCn: "bg-blue-50 text-blue-700" },
		{
			value: "contacted",
			label: "Contacted",
			badgeCn: "bg-amber-50 text-amber-700",
		},
		{
			value: "qualified",
			label: "Qualified",
			badgeCn: "bg-emerald-50 text-emerald-700",
		},
		{
			value: "inspection",
			label: "Inspection",
			badgeCn: "bg-violet-50 text-violet-700",
		},
		{
			value: "negotiation",
			label: "Negotiation",
			badgeCn: "bg-orange-50 text-orange-700",
		},
		{ value: "won", label: "Won", badgeCn: "bg-green-100 text-green-800" },
		{ value: "lost", label: "Lost", badgeCn: "bg-stone-100 text-stone-500" },
	];

export function LeadProfileHeader({
	lead,
	position,
	total,
	prevId,
	nextId,
	admins,
}: {
	lead: LeadDetail;
	position: number;
	total: number;
	prevId: string | null;
	nextId: string | null;
	admins: AssignableAdmin[];
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const lockRef = useRef(false);

	const currentBadge = STATUS_OPTIONS.find((s) => s.value === lead.status);

	function withLock(fn: () => void) {
		if (lockRef.current) return;
		lockRef.current = true;
		fn();
		setTimeout(() => {
			lockRef.current = false;
		}, 500);
	}

	function handleStatusChange(status: LeadStatus) {
		if (status === lead.status) return;
		withLock(() => {
			startTransition(async () => {
				await updateLeadStatus(lead.id, status);
				router.refresh();
			});
		});
	}

	function handleAssign(adminId: string) {
		if (!adminId) return;
		withLock(() => {
			startTransition(async () => {
				await assignLeads([lead.id], adminId);
				router.refresh();
			});
		});
	}

	return (
		<div className="space-y-4">
			{/* Top navigation bar */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() => router.push("/admin/leads")}
					className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-ink-950"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Leads
				</button>

				<div className="flex items-center overflow-hidden rounded-xl border border-stone-200 bg-white">
					<button
						type="button"
						disabled={!prevId || isPending}
						onClick={() => prevId && router.push(`/admin/leads/${prevId}`)}
						className="flex items-center px-3 py-2 text-stone-500 hover:bg-stone-50 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>
					<span className="border-x border-stone-200 px-3 py-2 text-xs font-medium text-stone-600">
						{position} of {total}
					</span>
					<button
						type="button"
						disabled={!nextId || isPending}
						onClick={() => nextId && router.push(`/admin/leads/${nextId}`)}
						className="flex items-center px-3 py-2 text-stone-500 hover:bg-stone-50 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Profile card */}
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
					{/* Identity */}
					<div className="flex items-start gap-4">
						<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-700">
							{lead.initials}
						</span>
						<div>
							<div className="flex flex-wrap items-center gap-2">
								<h1 className="text-xl font-bold text-ink-950">{lead.name}</h1>
								<span
									className={cn(
										"rounded-full px-2.5 py-0.5 text-xs font-semibold",
										currentBadge?.badgeCn ?? "bg-stone-100 text-stone-600",
									)}
								>
									{currentBadge?.label ?? lead.status}
								</span>
								{isPending ? (
									<Loader2 className="h-4 w-4 animate-spin text-stone-400" />
								) : null}
							</div>
							<div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
								{lead.phone !== "—" ? <span>{lead.phone}</span> : null}
								{lead.email !== "—" ? <span>{lead.email}</span> : null}
							</div>
							<p className="mt-1 text-xs text-stone-400">
								Enquired {lead.enquiredAt}
							</p>
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex flex-wrap items-center gap-2">
						{lead.phone !== "—" ? (
							<Link
								href={`tel:${lead.phone}`}
								className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50"
							>
								<Phone className="h-4 w-4" />
								Call
							</Link>
						) : null}

						<Link
							href={lead.phone !== "—" ? `https://wa.me/${lead.phone}` : siteConfig.whatsappHref}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
						>
							<MessageCircle className="h-4 w-4" />
							WhatsApp
						</Link>

						{/* Status change */}
						<select
							value={lead.status}
							onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
							disabled={isPending}
							className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-semibold text-ink-950 focus:border-red-600 focus:outline-none disabled:opacity-60"
						>
							{STATUS_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>

						{/* Assign rep */}
						<select
							defaultValue=""
							onChange={(e) => {
								if (e.target.value) {
									handleAssign(e.target.value);
									// Reset to placeholder after selecting
									e.target.value = "";
								}
							}}
							disabled={isPending}
							className="cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none disabled:opacity-60"
						>
							<option value="">
								{lead.assignedTo
									? `Assigned: ${lead.assignedTo}`
									: "Assign Rep"}
							</option>
							{admins.map((admin) => (
								<option key={admin.id} value={admin.id}>
									{admin.fullName}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}