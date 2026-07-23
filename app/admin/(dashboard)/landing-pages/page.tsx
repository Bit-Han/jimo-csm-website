// import { AdminPlaceholderPage } from "@/components/admin/AdminPlaceholderPage";

// export default function AdminLandingPagesPage() {
// 	return (
// 		<AdminPlaceholderPage
// 			title="Landing Pages"
// 			description="Create and manage campaign-specific landing pages for investors, diaspora buyers, brochures and realtors."
// 			stageNote="This becomes the landing pages table and builder once we get to this stage."
// 		/>
// 	);
// }


// app/admin/(dashboard)/landing-pages/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LandingPagesExplorer } from "@/components/admin/landing-pages/LandingPagesExplorer";
import { getAdminLandingPageRows } from "@/lib/db/queries/landing-pages";

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
				action={
					<Link
						href="/admin/landing-pages/new"
						className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
					>
						<Plus className="h-4 w-4" />
						Create Landing Page
					</Link>
				}
			/>
			<LandingPagesExplorer pages={pages} />
		</div>
	);
}