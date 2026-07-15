import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadProfileHeader } from "@/components/admin/leads/lead-profile/LeadProfileHeader";
import { EnquiryDetailsPanel } from "@/components/admin/leads/lead-profile/EnquiryDetailsPanel";
import { SourceTrackingPanel } from "@/components/admin/leads/lead-profile/SourceTrackingPanel";
import { ActivityTimelinePanel } from "@/components/admin/leads/lead-profile/ActivityTimelinePanel";
import { SalesNotesPanel } from "@/components/admin/leads/lead-profile/SalesNotesPanel";
import {
	getAdjacentLeadIds,
	getLeadDetail,
	getLeadIndexInfo,
} from "@/lib/data/admin/leads";

interface AdminLeadProfilePageProps {
	params: Promise<{ leadId: string }>;
}

export async function generateMetadata({
	params,
}: AdminLeadProfilePageProps): Promise<Metadata> {
	const { leadId } = await params;
	const lead = getLeadDetail(leadId);
	return {
		title: lead
			? `${lead.name} | Jimo Command Centre`
			: "Lead Profile | Jimo Command Centre",
	};
}

export default async function AdminLeadProfilePage({
	params,
}: AdminLeadProfilePageProps) {
	const { leadId } = await params;
	const lead = getLeadDetail(leadId);

	if (!lead) {
		notFound();
	}

	const { position, total } = getLeadIndexInfo(leadId);
	const { prevId, nextId } = getAdjacentLeadIds(leadId);

	return (
		<div className="space-y-6">
			<LeadProfileHeader
				lead={lead}
				position={position}
				total={total}
				prevId={prevId}
				nextId={nextId}
			/>

			<div className="grid gap-6 lg:grid-cols-3">
				<EnquiryDetailsPanel lead={lead} />
				<SourceTrackingPanel lead={lead} />
				<ActivityTimelinePanel lead={lead} />
			</div>

			<SalesNotesPanel leadId={lead.id} />
		</div>
	);
}
