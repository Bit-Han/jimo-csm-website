// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { LeadProfileHeader } from "@/components/admin/leads/lead-profile/LeadProfileHeader";
// import { EnquiryDetailsPanel } from "@/components/admin/leads/lead-profile/EnquiryDetailsPanel";
// import { SourceTrackingPanel } from "@/components/admin/leads/lead-profile/SourceTrackingPanel";
// import { ActivityTimelinePanel } from "@/components/admin/leads/lead-profile/ActivityTimelinePanel";
// import { SalesNotesPanel } from "@/components/admin/leads/lead-profile/SalesNotesPanel";
// import {
// 	getAdjacentLeadIds,
// 	getLeadDetail,
// 	getLeadIndexInfo,
// } from "@/lib/data/admin/leads";

// interface AdminLeadProfilePageProps {
// 	params: Promise<{ leadId: string }>;
// }

// export async function generateMetadata({
// 	params,
// }: AdminLeadProfilePageProps): Promise<Metadata> {
// 	const { leadId } = await params;
// 	const lead = getLeadDetail(leadId);
// 	return {
// 		title: lead
// 			? `${lead.name} | Jimo Command Centre`
// 			: "Lead Profile | Jimo Command Centre",
// 	};
// }

// export default async function AdminLeadProfilePage({
// 	params,
// }: AdminLeadProfilePageProps) {
// 	const { leadId } = await params;
// 	const lead = getLeadDetail(leadId);

// 	if (!lead) {
// 		notFound();
// 	}

// 	const { position, total } = getLeadIndexInfo(leadId);
// 	const { prevId, nextId } = getAdjacentLeadIds(leadId);

// 	return (
// 		<div className="space-y-6">
// 			<LeadProfileHeader
// 				lead={lead}
// 				position={position}
// 				total={total}
// 				prevId={prevId}
// 				nextId={nextId}
// 			/>

// 			<div className="grid gap-6 lg:grid-cols-3">
// 				<EnquiryDetailsPanel lead={lead} />
// 				<SourceTrackingPanel lead={lead} />
// 				<ActivityTimelinePanel lead={lead} />
// 			</div>

// 			<SalesNotesPanel leadId={lead.id} />
// 		</div>
// 	);
// }

// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { LeadProfileHeader } from "@/components/admin/leads/lead-profile/LeadProfileHeader";
// import { EnquiryDetailsPanel } from "@/components/admin/leads/lead-profile/EnquiryDetailsPanel";
// import { SourceTrackingPanel } from "@/components/admin/leads/lead-profile/SourceTrackingPanel";
// import { ActivityTimelinePanel } from "@/components/admin/leads/lead-profile/ActivityTimelinePanel";
// import { SalesNotesPanel } from "@/components/admin/leads/lead-profile/SalesNotesPanel";
// import {
// 	getAdminLeadDetail,
// 	getAssignableUsers,
// 	getLeadNavigation,
// } from "@/lib/db/queries/leads";

// export const dynamic = "force-dynamic";

// interface AdminLeadProfilePageProps {
// 	params: Promise<{ leadId: string }>;
// }

// export async function generateMetadata({
// 	params,
// }: AdminLeadProfilePageProps): Promise<Metadata> {
// 	const { leadId } = await params;
// 	const lead = await getAdminLeadDetail(leadId);
// 	return {
// 		title: lead
// 			? `${lead.name} | Jimo Command Centre`
// 			: "Lead Profile | Jimo Command Centre",
// 	};
// }

// export default async function AdminLeadProfilePage({
// 	params,
// }: AdminLeadProfilePageProps) {
// 	const { leadId } = await params;

// 	// All three queries run in parallel
// 	const [lead, nav, assignableUsers] = await Promise.all([
// 		getAdminLeadDetail(leadId),
// 		getLeadNavigation(leadId),
// 		getAssignableUsers(),
// 	]);

// 	if (!lead) {
// 		notFound();
// 	}

// 	return (
// 		<div className="space-y-6">
// 			<LeadProfileHeader
// 				lead={lead}
// 				position={nav.position}
// 				total={nav.total}
// 				prevId={nav.prevId}
// 				nextId={nav.nextId}
// 				assignableUsers={assignableUsers}
// 			/>

// 			<div className="grid gap-6 lg:grid-cols-3">
// 				<EnquiryDetailsPanel lead={lead} />
// 				<SourceTrackingPanel lead={lead} />
// 				<ActivityTimelinePanel lead={lead} />
// 			</div>

// 			<SalesNotesPanel leadId={lead.id} existingNotes={lead.notes} />
// 		</div>
// 	);
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadProfileHeader } from "@/components/admin/leads/lead-profile/LeadProfileHeader";
import { EnquiryDetailsPanel } from "@/components/admin/leads/lead-profile/EnquiryDetailsPanel";
import { SourceTrackingPanel } from "@/components/admin/leads/lead-profile/SourceTrackingPanel";
import { ActivityTimelinePanel } from "@/components/admin/leads/lead-profile/ActivityTimelinePanel";
import { SalesNotesPanel } from "@/components/admin/leads/lead-profile/SalesNotesPanel";
import { HubSpotSyncPanel } from "@/components/admin/leads/lead-profile/HubSpotSyncPanel";
import {
	getAdminLeadDetail,
	getAssignableUsers,
	getLeadNavigation,
} from "@/lib/db/queries/leads";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminLeadProfilePageProps {
	params: Promise<{ leadId: string }>;
}

export async function generateMetadata({
	params,
}: AdminLeadProfilePageProps): Promise<Metadata> {
	const { leadId } = await params;
	const lead = await getAdminLeadDetail(leadId);
	return {
		title: lead
			? `${lead.name} | Leads | Jimo Command Centre`
			: "Lead Profile | Jimo Command Centre",
	};
}

export default async function AdminLeadProfilePage({
	params,
}: AdminLeadProfilePageProps) {
	const { leadId } = await params;

	const [lead, nav, assignableUsers] = await Promise.all([
		getAdminLeadDetail(leadId),
		getLeadNavigation(leadId),
		getAssignableUsers(),
	]);

	if (!lead) notFound();

	return (
		<div className="space-y-6">
			<LeadProfileHeader
				lead={lead}
				position={nav.position}
				total={nav.total}
				prevId={nav.prevId}
				nextId={nav.nextId}
				assignableUsers={assignableUsers}
			/>

			<div className="grid gap-6 lg:grid-cols-3">
				<EnquiryDetailsPanel lead={lead} />
				<SourceTrackingPanel lead={lead} />
				<ActivityTimelinePanel lead={lead} />
			</div>

			{/* HubSpot sync — stub, wired when HubSpot is connected in Settings */}
			<HubSpotSyncPanel lead={lead} />

			<SalesNotesPanel leadId={lead.id} existingNotes={lead.notes} />
		</div>
	);
}