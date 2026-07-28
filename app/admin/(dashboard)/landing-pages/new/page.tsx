// app/admin/(dashboard)/landing-pages/new/page.tsx
import type { Metadata } from "next";
import { LandingPageEditorShell } from "@/components/admin/landing-pages/editor/LandingPageEditorShell";
import { DEFAULT_LANDING_PAGE_STATE } from "@/lib/types/admin/landing-page";
import {
	getFormOptionsForPicker,
	getProjectOptionsForPicker,
} from "@/lib/db/queries/landing-pages";
import { timed } from "@/lib/utils/timed";

export const metadata: Metadata = { title: "New Landing Page | Jimo Command Centre" };
export const dynamic = "force-dynamic";

export default async function AdminNewLandingPagePage() {
	const [forms, projects] = await Promise.all([
		timed("getFormOptionsForPicker", getFormOptionsForPicker()),
		timed("getProjectOptionsForPicker", getProjectOptionsForPicker()),
	]);

	return (
		<LandingPageEditorShell
			initialState={DEFAULT_LANDING_PAGE_STATE}
			mode="new"
			forms={forms}
			projects={projects}
		/>
	);
}