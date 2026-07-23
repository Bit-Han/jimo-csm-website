//@component/admin/leads/lead-profile/LeadProfileHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	MessageCircle,
	MoreHorizontal,
	Phone,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import { updateLeadStatus } from "@/lib/actions/leads";
import type { LeadDetail, LeadStatus } from "@/lib/types/admin/lead";
import { siteConfig } from "@/lib/data/site";

const STATUS_BADGE: Record<LeadStatus, AdminBadgeVariant> = {
	new: "new",
	contacted: "contacted",
	qualified: "qualified",
	inspection: "inspection",
	negotiation: "negotiation",
	won: "won",
	lost: "lost",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
	new: "New Lead",
	contacted: "Contacted",
	qualified: "Qualified",
	inspection: "Inspection",
	negotiation: "Negotiation",
	won: "Won",
	lost: "Lost",
};

const REPS = ["Deborah", "Kunle", "Tobi"];

export interface LeadProfileHeaderProps {
	lead: LeadDetail;
	position: number;
	total: number;
	prevId: string | null;
	nextId: string | null;
}

export function LeadProfileHeader({
	lead,
	position,
	total,
	prevId,
	nextId,
}: LeadProfileHeaderProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function handleStatusUpdate(status: LeadStatus) {
		startTransition(async () => {
			await updateLeadStatus(lead.id, status);
			router.refresh();
		});
	}

	return (
		<div className="space-y-5">
			{/* Top navigation row */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() => router.push("/admin/leads")}
					className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-ink-950"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Leads
				</button>

				<div className="flex items-center gap-2">
					<div className="relative">
						<button
							type="button"
							className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-stone-50"
						>
							More Actions
							<MoreHorizontal className="h-4 w-4" />
						</button>
					</div>

					<div className="flex items-center rounded-xl border border-stone-200 bg-white">
						<button
							type="button"
							disabled={!prevId}
							onClick={() => prevId && router.push(`/admin/leads/${prevId}`)}
							className="flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<span className="border-x border-stone-200 px-3 py-2 text-xs font-medium text-stone-600">
							{position} of {total}
						</span>
						<button
							type="button"
							disabled={!nextId}
							onClick={() => nextId && router.push(`/admin/leads/${nextId}`)}
							className="flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>

			{/* Lead header card */}
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex items-start gap-4">
						<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-stone-200 text-lg font-bold text-stone-600">
							{lead.initials}
						</span>
						<div>
							<div className="flex flex-wrap items-center gap-2">
								<h1 className="text-xl font-bold text-ink-950">{lead.name}</h1>
								<AdminBadge variant={STATUS_BADGE[lead.status]} />
								<span className="text-xs text-stone-400">
									{STATUS_LABEL[lead.status]}
								</span>
							</div>
							<div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
								<span>{lead.phone}</span>
								<span>{lead.email}</span>
								<span>{lead.location}</span>
							</div>
							<p className="mt-1 text-xs text-stone-400">
								Enquired on {lead.enquiredAt}
							</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Link
							href={`tel:${lead.phone}`}
							className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50"
						>
							<Phone className="h-4 w-4" />
							Call
						</Link>

						<Link
							href={siteConfig.whatsappHref}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-900"
						>
							<MessageCircle className="h-4 w-4" />
							WhatsApp
						</Link>

						{/* Assign Rep dropdown */}
						<div className="relative">
							<select
								defaultValue=""
								onChange={(e) => {
									if (!e.target.value) return;
									startTransition(async () => {
										const { assignLeads } = await import("@/lib/actions/leads");
										await assignLeads([lead.id], e.target.value);
									});
									e.target.value = "";
								}}
								disabled={isPending}
								className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 appearance-none"
							>
								<option value="">
									{lead.assignedTo
										? `Assigned: ${lead.assignedTo}`
										: "Assign Rep"}
								</option>
								{REPS.map((rep) => (
									<option key={rep} value={rep}>
										{rep}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
