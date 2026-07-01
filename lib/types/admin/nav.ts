import type { LucideIcon } from "lucide-react";
import type { AdminModule } from "@/lib/types/admin/role";

export interface AdminNavItem {
	module: AdminModule;
	label: string;
	href: string;
	icon: LucideIcon;
}
