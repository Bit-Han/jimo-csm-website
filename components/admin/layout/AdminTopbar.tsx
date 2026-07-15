// "use client";

// import {
// 	Bell,
// 	ChevronDown,
// 	Menu,
// 	PanelLeftClose,
// 	PanelLeftOpen,
// 	Search,
// } from "lucide-react";
// import { adminRoleDefinitions } from "@/lib/data/admin/roles";
// import type { AdminUser } from "@/lib/types/admin/role";

// export interface AdminTopbarProps {
// 	currentUser: AdminUser;
// 	isCollapsed: boolean;
// 	onToggleCollapse: () => void;
// 	onOpenMobileMenu: () => void;
// }

// export function AdminTopbar({
// 	currentUser,
// 	isCollapsed,
// 	onToggleCollapse,
// 	onOpenMobileMenu,
// }: AdminTopbarProps) {
// 	const roleLabel =
// 		adminRoleDefinitions.find((role) => role.id === currentUser.role)?.label ??
// 		currentUser.role;
// 	const initials = currentUser.fullName
// 		.split(" ")
// 		.map((part) => part[0])
// 		.join("")
// 		.slice(0, 2)
// 		.toUpperCase();

// 	return (
// 		<header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-stone-200 bg-white px-4 sm:px-6">
// 			<button
// 				type="button"
// 				aria-label="Open menu"
// 				onClick={onOpenMobileMenu}
// 				className="text-stone-500 hover:text-ink-950 lg:hidden"
// 			>
// 				<Menu className="h-5 w-5" />
// 			</button>

// 			<button
// 				type="button"
// 				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
// 				onClick={onToggleCollapse}
// 				className="hidden text-stone-400 hover:text-ink-950 lg:block"
// 			>
// 				{isCollapsed ? (
// 					<PanelLeftOpen className="h-5 w-5" />
// 				) : (
// 					<PanelLeftClose className="h-5 w-5" />
// 				)}
// 			</button>

// 			<div className="flex flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-cream-50 px-3 py-2 text-sm text-stone-400 sm:max-w-md">
// 				<Search className="h-4 w-4 shrink-0" />
// 				<span className="hidden truncate sm:inline">
// 					Search projects, content, leads...
// 				</span>
// 				<span className="ml-auto hidden shrink-0 rounded border border-stone-200 bg-white px-1.5 py-0.5 text-xs sm:inline">
// 					⌘K
// 				</span>
// 			</div>
// 			<div className="flex items-center gap-4 ml-auto">
// 				<button
// 					type="button"
// 					aria-label="Notifications"
// 					className="relative text-stone-500 hover:text-ink-950"
// 				>
// 					<Bell className="h-5 w-5" />
// 					<span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-white">
// 						3
// 					</span>
// 				</button>

// 				<button type="button" className="flex items-center gap-2">
// 					<span className="hidden text-right sm:block">
// 						<span className="block text-sm font-semibold text-ink-950">
// 							{currentUser.fullName}
// 						</span>
// 						<span className="block text-xs text-stone-500">{roleLabel}</span>
// 					</span>
// 					<span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
// 						{initials}
// 					</span>
// 					<ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
// 				</button>
// 			</div>
// 		</header>
// 	);
// }

"use client";

import { useTransition } from "react";
import {
	Bell,
	ChevronDown,
	LogOut,
	Menu,
	PanelLeftClose,
	PanelLeftOpen,
	Search,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/admin/auth";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import type { AuthenticatedAdminUser } from "@/lib/auth/get-admin-user";

export interface AdminTopbarProps {
	currentUser: AuthenticatedAdminUser;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	onOpenMobileMenu: () => void;
}

export function AdminTopbar({
	currentUser,
	isCollapsed,
	onToggleCollapse,
	onOpenMobileMenu,
}: AdminTopbarProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const roleLabel =
		adminRoleDefinitions.find((r) => r.id === currentUser.role)?.label ??
		currentUser.role;

	const initials = currentUser.fullName
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	function handleSignOut() {
		startTransition(async () => {
			await logoutAction();
		});
	}

	return (
		<header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-stone-200 bg-white px-4 sm:px-6">
			<button
				type="button"
				aria-label="Open menu"
				onClick={onOpenMobileMenu}
				className="text-stone-500 hover:text-ink-950 lg:hidden"
			>
				<Menu className="h-5 w-5" />
			</button>

			<button
				type="button"
				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
				onClick={onToggleCollapse}
				className="hidden text-stone-400 hover:text-ink-950 lg:block"
			>
				{isCollapsed ? (
					<PanelLeftOpen className="h-5 w-5" />
				) : (
					<PanelLeftClose className="h-5 w-5" />
				)}
			</button>

			<div className="flex flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-cream-50 px-3 py-2 text-sm text-stone-400 sm:max-w-md">
				<Search className="h-4 w-4 shrink-0" />
				<span className="hidden truncate sm:inline">
					Search projects, content, leads...
				</span>
				<span className="ml-auto hidden shrink-0 rounded border border-stone-200 bg-white px-1.5 py-0.5 text-xs sm:inline">
					⌘K
				</span>
			</div>
			<div className="flex items-center gap-4 ml-auto">
				<button
					type="button"
					aria-label="Notifications"
					className="relative text-stone-500 hover:text-ink-950"
				>
					<Bell className="h-5 w-5" />
					<span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-white">
						3
					</span>
				</button>

				{/* User menu */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setMenuOpen((o) => !o)}
						className="flex items-center gap-2"
					>
						<span className="hidden text-right sm:block">
							<span className="block text-sm font-semibold text-ink-950">
								{currentUser.fullName}
							</span>
							<span className="block text-xs text-stone-500">{roleLabel}</span>
						</span>
						<span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-700 text-sm font-semibold text-white">
							{initials}
						</span>
						<ChevronDown className="hidden h-4 w-4 text-stone-400 sm:block" />
					</button>

					{menuOpen ? (
						<>
							<button
								type="button"
								className="fixed inset-0 z-10"
								onClick={() => setMenuOpen(false)}
								aria-label="Close menu"
							/>
							<div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
								<div className="border-b border-stone-100 px-4 py-3">
									<p className="text-sm font-semibold text-ink-950">
										{currentUser.fullName}
									</p>
									<p className="text-xs text-stone-500">{currentUser.email}</p>
									<p className="mt-0.5 text-xs font-medium text-red-600">
										{roleLabel}
									</p>
								</div>
								<button
									type="button"
									onClick={handleSignOut}
									disabled={isPending}
									className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
								>
									<LogOut className="h-4 w-4" />
									Sign Out
								</button>
							</div>
						</>
					) : null}
				</div>
			</div>
		</header>
	);
}