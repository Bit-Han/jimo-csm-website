
//admin/(protected)/brochures/page.tsx
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BrochuresExplorer } from "@/components/admin/brochures/BrochuresExplorer";
import { UploadBrochureButton } from "@/components/admin/brochures/UploadBrochureButton";
import { getAdminBrochureListRows } from "@/lib/db/queries/brochures";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export const metadata: Metadata = {
	title: "Brochures | Jimo Command Centre",
};

export const dynamic = 'force-dynamic';

export default async function AdminBrochuresPage() {
	// Run in parallel — brochure list and project selector options
	const [brochureRows, projectOptions] = await Promise.all([
		getAdminBrochureListRows(),
		// Only need id, name, slug for the upload modal selector
		db
			.select({
				id: projects.id,
				name: projects.name,
				slug: projects.slug,
			})
			.from(projects)
			.where(eq(projects.publishStatus, "published"))
			.orderBy(projects.name),
	]);

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Brochures"
				description="Upload PDF brochures to Cloudinary. URLs are stored in the database and delivered via email when requested from the public site."
				action={<UploadBrochureButton projects={projectOptions} />}
			/>
			<BrochuresExplorer brochures={brochureRows} />
		</div>
	);
}