import type { ReactNode } from "react";
import { requireModuleAccess } from "@/lib/auth/require-module-access";

export default async function LeadsModuleLayout({
	children,
}: {
	children: ReactNode;
}) {
	await requireModuleAccess("leads");
	return <>{children}</>;
}
