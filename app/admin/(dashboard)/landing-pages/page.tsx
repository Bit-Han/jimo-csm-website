
// app/admin/(dashboard)/landing-pages/page.tsx
import type { Metadata } from "next";
// import Link from "next/link";
// import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LandingPagesExplorer } from "@/components/admin/landing-pages/LandingPagesExplorer";
import { getAdminLandingPageRows } from "@/lib/db/queries/landing-pages";
import { NewLandingPageLink } from "@/components/admin/landing-pages/NewLandingPageLink";



export const metadata: Metadata = {
	title: "Landing Pages | Jimo Command Centre",
};
export const dynamic = "force-dynamic";

export default async function AdminLandingPagesPage() {
	const pages = await getAdminLandingPageRows();

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Landing Pages"
				description="Create and manage campaign-specific landing pages for investors, diaspora buyers, brochures and realtors."
				action={<NewLandingPageLink />}
			/>
			<LandingPagesExplorer pages={pages} />
		</div>
	);
}