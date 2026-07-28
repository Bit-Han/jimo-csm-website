import type { ReactNode } from "react";
import { requireModuleAccess } from "@/lib/auth/require-module-access";

export default async function RouteMapModuleLayout({
	children,
}: {
	children: ReactNode;
}) {
	await requireModuleAccess("route-map");
	return <>{children}</>;
}
