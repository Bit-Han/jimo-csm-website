

// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { FormBuilderShell } from "@/components/admin/forms/builder/FormBuilderShell";
// import { getFormBuilderStateById } from "@/lib/db/queries/forms";
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

// 	const formState = await getFormBuilderStateById(id);
// 	if (!formState) notFound();

// 	return <FormBuilderShell initialState={formState} />;
// }

// app/admin/forms/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { getFormBuilderStateById } from "@/lib/db/queries/forms";
import { FormBuilderShell } from "@/components/admin/forms/builder/FormBuilderShell";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function EditFormPage({ params }: Props) {
	const { id } = await params;
	const state = await getFormBuilderStateById(id);
	if (!state) notFound();
	return <FormBuilderShell initialState={state} mode="edit" />;
}