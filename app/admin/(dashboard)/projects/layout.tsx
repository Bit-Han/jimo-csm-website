// app/admin/projects/layout.tsx
import type { ReactNode } from "react";
import { requireModuleAccess } from "@/lib/auth/require-module-access";

export default async function ProjectsModuleLayout({
	children,
}: {
	children: ReactNode;
}) {
	await requireModuleAccess("projects");
	return <>{children}</>;
}
