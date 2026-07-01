"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { adminNavItems } from "@/lib/data/admin/nav";
import { canAccessModule } from "@/lib/data/admin/roles";
import { cn } from "@/lib/utils/helpers";
import type { AdminRole } from "@/lib/types/admin/role";

export interface AdminSidebarProps {
	role: AdminRole;
	isCollapsed: boolean;
	isMobileOpen: boolean;
	onMobileClose: () => void;
}

export function AdminSidebar({
	role,
	isCollapsed,
	isMobileOpen,
	onMobileClose,
}: AdminSidebarProps) {
	const pathname = usePathname();
	const visibleItems = adminNavItems.filter((item) =>
		canAccessModule(role, item.module),
	);

	return (
		<>
			{isMobileOpen ? (
				<button
					type="button"
					aria-label="Close menu"
					onClick={onMobileClose}
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
				/>
			) : null}

			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-navy-800 bg-navy-950 transition-all duration-200 ease-out",
					"lg:translate-x-0",
					isCollapsed ? "lg:w-20" : "lg:w-64",
					isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
				)}
			>
				<div className="flex h-20 items-center justify-between px-5">
					<div className={cn("overflow-hidden", isCollapsed && "lg:hidden")}>
						<p className="text-xl font-bold tracking-tight text-gold-400">
							JIMO
						</p>
						<p className="text-xs text-white/40">Command Centre</p>
					</div>
					<button
						type="button"
						aria-label="Close menu"
						onClick={onMobileClose}
						className="text-white/60 hover:text-white lg:hidden"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
					{visibleItems.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`);
						const Icon = item.icon;

						return (
							<Link
								key={item.module}
								href={item.href}
								onClick={onMobileClose}
								className={cn(
									"flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
									isActive
										? "border-gold-400 bg-navy-900 text-white"
										: "border-transparent text-white/60 hover:bg-navy-900 hover:text-white",
								)}
							>
								<Icon className="h-4.5 w-4.5 shrink-0" />
								<span className={cn(isCollapsed && "lg:hidden")}>
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				<div
					className={cn(
						"flex items-center gap-3 border-t border-navy-800 px-5 py-5",
						isCollapsed && "lg:justify-center",
					)}
				>
					<span className="h-9 w-9 shrink-0 rounded-lg border border-gold-400/40" />
					<div className={cn(isCollapsed && "lg:hidden")}>
						<p className="text-sm font-semibold text-white">
							Jimo Property Development Limited
						</p>
						<p className="text-xs text-white/40">Building tomorrow, today.</p>
					</div>
				</div>
			</aside>
		</>
	);
}
