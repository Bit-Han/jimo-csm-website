
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import { ActivityTracker } from "@/components/admin/layout/ActivityTracker";
import { cn } from "@/lib/utils/helpers";
import type { AuthenticatedAdminUser } from "@/lib/auth/get-admin-user";

const COLLAPSE_STORAGE_KEY = "jimo-admin-sidebar-collapsed";

export interface AdminShellProps {
	children: ReactNode;
	currentUser: AuthenticatedAdminUser;
}

export function AdminShell({ children, currentUser }: AdminShellProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	// Restore collapse preference after mount to avoid hydration mismatch
	useEffect(() => {
		const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
		if (stored === "true") setIsCollapsed(true);
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
			{/* Inactivity tracker — renders nothing, just sets up event listeners */}
			<ActivityTracker />

			<AdminSidebar
				role={currentUser.role}
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
					currentUser={currentUser}
					isCollapsed={isCollapsed}
					onToggleCollapse={toggleCollapse}
					onOpenMobileMenu={() => setIsMobileOpen(true)}
				/>
				<main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
			</div>
		</div>
	);
}