//components/admin/layout/AdminShell.tsx
"use client";

import {useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import { ActivityTracker } from "@/components/admin/layout/ActivityTracker";
import { cn } from "@/lib/utils/helpers";
import type { AuthenticatedAdminUser } from "@/lib/auth/get-admin-user";

const COLLAPSE_STORAGE_KEY = "jimo-admin-sidebar-collapsed";


const subscribe = (callback: () => void) => {
	window.addEventListener("storage", callback);
	return () => window.removeEventListener("storage", callback);
};

// 2. Client-side reader
const getSnapshot = () =>
	window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";

// 3. Server-side default fallback
const getServerSnapshot = () => false;

export interface AdminShellProps {
	children: ReactNode;
	currentUser: AuthenticatedAdminUser;
}

export function AdminShell({ children, currentUser }: AdminShellProps) {
	const isCollapsed = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);

	const [isMobileOpen, setIsMobileOpen] = useState(false);

	function toggleCollapse() {
		const next = !isCollapsed;
		window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
		// Trigger a local storage event so the store updates immediately on the current page
		window.dispatchEvent(new Event("storage"));
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