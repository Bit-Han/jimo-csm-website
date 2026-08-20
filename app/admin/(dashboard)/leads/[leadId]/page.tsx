//@/admin/(dashboard)/leads/[leadId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadProfileHeader } from "@/components/admin/leads/lead-profile/LeadProfileHeader";
import { EnquiryDetailsPanel } from "@/components/admin/leads/lead-profile/EnquiryDetailsPanel";
import { SourceTrackingPanel } from "@/components/admin/leads/lead-profile/SourceTrackingPanel";
import { ActivityTimelinePanel } from "@/components/admin/leads/lead-profile/ActivityTimelinePanel";
import { SalesNotesPanel } from "@/components/admin/leads/lead-profile/SalesNotesPanel";
import {
	getAdjacentLeadIds,
	getAssignableAdmins,
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
	const lead = await getLeadDetail(leadId);
	return {
		title: lead
			? `${lead.name} | Jimo Command Centre`
			: "Lead Profile | Jimo Command Centre",
	};
}

export const dynamic = "force-dynamic";

export default async function AdminLeadProfilePage({
	params,
}: AdminLeadProfilePageProps) {
	const { leadId } = await params;

	const [lead, indexInfo, adjacent, admins] = await Promise.all([
		getLeadDetail(leadId),
		getLeadIndexInfo(leadId),
		getAdjacentLeadIds(leadId),
		getAssignableAdmins(),
	]);

	if (!lead) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<LeadProfileHeader
				lead={lead}
				position={indexInfo.position}
				total={indexInfo.total}
				prevId={adjacent.prevId}
				nextId={adjacent.nextId}
				admins={admins}
			/>

			<div className="grid gap-6 lg:grid-cols-3">
				<EnquiryDetailsPanel lead={lead} />
				<SourceTrackingPanel lead={lead} />
				<ActivityTimelinePanel lead={lead} />
			</div>

			<SalesNotesPanel leadId={lead.id} existingNotes={lead.notes} />
		</div>
	);
}