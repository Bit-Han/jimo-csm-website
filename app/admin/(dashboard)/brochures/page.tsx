// import type { Metadata } from "next";
// import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
// import { BrochuresExplorer } from "@/components/admin/brochures/BrochuresExplorer";
// import { getAdminBrochures } from "@/lib/data/admin/brochures";
// import { UploadBrochureButton } from "@/components/admin/brochures/UploadBrochureButton";

// export const metadata: Metadata = {
// 	title: "Brochures | Jimo Command Centre",
// };

// export default function AdminBrochuresPage() {
// 	const brochures = getAdminBrochures();

// 	return (
// 		<div className="space-y-6">
// 			<AdminPageHeader
// 				title="Brochures"
// 				description="Upload, version, gate and attach project brochures to landing pages and project pages."
// 				action={<UploadBrochureButton />}
// 			/>
// 			<BrochuresExplorer brochures={brochures} />
// 		</div>
// 	);
// }

import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BrochuresExplorer } from "@/components/admin/brochures/BrochuresExplorer";
import { UploadBrochureButton } from "@/components/admin/brochures/UploadBrochureButton";
import { getAdminBrochureListRows } from "@/lib/db/queries/brochures";

export const metadata: Metadata = { title: "Brochures | Jimo Command Centre" };
export const dynamic = "force-dynamic";

export default async function AdminBrochuresPage() {
	const brochures = await getAdminBrochureListRows();

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Brochures"
				description="Upload, version, gate and attach project brochures to landing pages and project pages."
				action={<UploadBrochureButton />}
			/>
			<BrochuresExplorer brochures={brochures} />
		</div>
	);
}