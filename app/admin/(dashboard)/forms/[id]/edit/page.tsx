// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { FormBuilderShell } from "@/components/admin/forms/builder/FormBuilderShell";
// import { getFormBuilderState } from "@/lib/data/admin/forms";
// import { DEFAULT_NEW_FORM_STATE } from "@/lib/data/admin/forms";

// interface AdminFormEditPageProps {
// 	params: Promise<{ id: string }>;
// }

// export async function generateMetadata({
// 	params,
// }: AdminFormEditPageProps): Promise<Metadata> {
// 	const { id } = await params;
// 	return {
// 		title:
// 			id === "new"
// 				? "New Form | Jimo Command Centre"
// 				: "Form Builder | Jimo Command Centre",
// 	};
// }

// export default async function AdminFormEditPage({
// 	params,
// }: AdminFormEditPageProps) {
// 	const { id } = await params;

// 	if (id === "new") {
// 		return <FormBuilderShell initialState={DEFAULT_NEW_FORM_STATE} />;
// 	}

// 	const formState = getFormBuilderState(id);

// 	if (!formState) {
// 		notFound();
// 	}

// 	return <FormBuilderShell initialState={formState} />;
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormBuilderShell } from "@/components/admin/forms/builder/FormBuilderShell";
import { getFormBuilderStateById } from "@/lib/db/queries/forms";
import { DEFAULT_NEW_FORM_STATE } from "@/lib/data/admin/forms";

interface AdminFormEditPageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: AdminFormEditPageProps): Promise<Metadata> {
	const { id } = await params;
	return {
		title:
			id === "new"
				? "New Form | Jimo Command Centre"
				: "Form Builder | Jimo Command Centre",
	};
}

export default async function AdminFormEditPage({
	params,
}: AdminFormEditPageProps) {
	const { id } = await params;

	if (id === "new") {
		return <FormBuilderShell initialState={DEFAULT_NEW_FORM_STATE} />;
	}

	const formState = await getFormBuilderStateById(id);
	if (!formState) notFound();

	return <FormBuilderShell initialState={formState} />;
}