import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

export default function AdminCompanyPagesPage() {
	return (
		<AdminPlaceholderPage
			title="Company Pages"
			description="Edit home, about, services, corporate statement, contact and legal pages."
			stageNote="This becomes the static-page list — Home, About Us, Services, Corporate Statement — once we wire it to home.ts and company.ts."
		/>
	);
}
