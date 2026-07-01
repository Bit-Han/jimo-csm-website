import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

interface AdminLeadProfilePageProps {
	params: Promise<{ leadId: string }>;
}

export default async function AdminLeadProfilePage({
	params,
}: AdminLeadProfilePageProps) {
	const { leadId } = await params;

	return (
		<AdminPlaceholderPage
			title="Lead Profile"
			description={`Viewing lead "${leadId}".`}
			stageNote="Enquiry details, source tracking, activity timeline, and sales notes land here once Leads is built."
		/>
	);
}
