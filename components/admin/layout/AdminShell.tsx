"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import { currentAdminUser } from "@/lib/data/admin/current-user";
import { cn } from "@/lib/utils/helpers";

const COLLAPSE_STORAGE_KEY = "jimo-admin-sidebar-collapsed";

export interface AdminShellProps {
	children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	useEffect(() => {
		const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
		if (stored === "true") {
			setIsCollapsed(true);
		}
	}, []);

	function toggleCollapse() {
		setIsCollapsed((current) => {
			const next = !current;
			window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
			return next;
		});
	}

	return (
		<div className="min-h-screen bg-cream-50">
			<AdminSidebar
				role={currentAdminUser.role}
				isCollapsed={isCollapsed}
				isMobileOpen={isMobileOpen}
				onMobileClose={() => setIsMobileOpen(false)}
			/>

			<div
				className={cn(
					"flex min-h-screen flex-col transition-all duration-200 ease-out",
					isCollapsed ? "lg:pl-20" : "lg:pl-64",
				)}
			>
				<AdminTopbar
					currentUser={currentAdminUser}
					isCollapsed={isCollapsed}
					onToggleCollapse={toggleCollapse}
					onOpenMobileMenu={() => setIsMobileOpen(true)}
				/>
				<main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
			</div>
		</div>
	);
}
