

import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FormsExplorer } from "@/components/admin/forms/FormsExplorer";
import { getAdminFormListRows } from "@/lib/db/queries/forms";

export const metadata: Metadata = { title: "Forms | Jimo Command Centre" };


export default async function AdminFormsPage() {
	const forms = await getAdminFormListRows();

	return (
		<div className="space-y-6">
			<AdminPageHeader
				title="Forms"
				description="Create and manage reusable forms, fields, conditional logic and CRM mappings."
				action={
					<Link
						href="/admin/forms/new"
						className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
					>
						<Plus className="h-4 w-4" />
						Create Form
					</Link>
				}
			/>
			<FormsExplorer forms={forms} />
		</div>
	);
}