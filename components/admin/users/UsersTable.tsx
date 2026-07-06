"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
import {
	deactivateUser,
	reactivateUser,
	changeUserRole,
} from "@/lib/actions/admin/users";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import { cn } from "@/lib/utils/helpers";
import type { AdminRole } from "@/lib/types/admin/role";
import type { AdminUserListRow } from "@/lib/types/admin/users-roles";

const ROLE_BADGE_VARIANT: Record<AdminRole, AdminBadgeVariant> = {
	"super-admin": "qualified",
	"website-manager": "contacted",
	"content-seo": "new",
	"sales-crm": "inspection",
	"marketing-admin": "review",
};

const ROLE_TEXT_COLOR: Record<AdminRole, string> = {
	"super-admin": "text-violet-700",
	"website-manager": "text-blue-700",
	"content-seo": "text-emerald-700",
	"sales-crm": "text-amber-700",
	"marketing-admin": "text-pink-700",
};

export function UsersTable({ users }: { users: AdminUserListRow[] }) {
	const [rows, setRows] = useState(users);
	const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleToggleStatus(
		id: string,
		currentStatus: "active" | "inactive",
	) {
		startTransition(async () => {
			const action =
				currentStatus === "active" ? deactivateUser : reactivateUser;
			const result = await action(id);
			if (result.success) {
				setRows((prev) =>
					prev.map((u) =>
						u.id === id
							? {
									...u,
									status: currentStatus === "active" ? "inactive" : "active",
								}
							: u,
					),
				);
			}
		});
		setMenuOpenId(null);
	}

	function handleChangeRole(id: string, role: AdminRole) {
		startTransition(async () => {
			const found = adminRoleDefinitions.find((r) => r.id === role);
			const result = await changeUserRole(id, role);
			if (result.success) {
				setRows((prev) =>
					prev.map((u) =>
						u.id === id
							? { ...u, role, roleLabel: found?.label ?? u.roleLabel }
							: u,
					),
				);
			}
		});
		setMenuOpenId(null);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[760px] text-left text-sm">
					<thead>
						<tr className="border-b border-stone-100 bg-stone-50/60">
							{[
								"Name",
								"Email",
								"Role",
								"Status",
								"Permission Summary",
								"Last Active",
								"",
							].map((h) => (
								<th
									key={h}
									className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((user) => (
							<tr
								key={user.id}
								className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
							>
								<td className="px-6 py-4 font-semibold text-ink-950">
									{user.fullName}
								</td>
								<td className="px-6 py-4 text-stone-600">{user.email}</td>
								<td className="px-6 py-4">
									<span
										className={cn(
											"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
											"bg-stone-100",
											ROLE_TEXT_COLOR[user.role],
										)}
									>
										{user.roleLabel}
									</span>
								</td>
								<td className="px-6 py-4">
									<AdminBadge
										variant={user.status === "active" ? "active" : "draft"}
									/>
								</td>
								<td className="px-6 py-4 text-stone-600">
									{user.permissionSummary}
								</td>
								<td className="px-6 py-4 text-stone-500">{user.lastActive}</td>
								<td className="px-6 py-4">
									<div className="relative">
										<button
											type="button"
											onClick={() =>
												setMenuOpenId(menuOpenId === user.id ? null : user.id)
											}
											className="text-stone-400 hover:text-ink-950"
											aria-label="More options"
										>
											<MoreHorizontal className="h-4 w-4" />
										</button>

										{menuOpenId === user.id ? (
											<>
												<button
													type="button"
													className="fixed inset-0 z-10"
													onClick={() => setMenuOpenId(null)}
													aria-label="Close menu"
												/>
												<div className="absolute right-0 top-6 z-20 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
													<div className="border-b border-stone-100 px-4 py-2.5">
														<p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">
															Change Role
														</p>
													</div>
													{adminRoleDefinitions.map((roleDef) => (
														<button
															key={roleDef.id}
															type="button"
															onClick={() =>
																handleChangeRole(user.id, roleDef.id)
															}
															disabled={isPending || user.role === roleDef.id}
															className={cn(
																"flex w-full px-4 py-2 text-xs hover:bg-stone-50 disabled:opacity-50",
																user.role === roleDef.id
																	? "font-semibold text-ink-950"
																	: "text-stone-600",
															)}
														>
															{roleDef.label}
														</button>
													))}
													<div className="border-t border-stone-100">
														<button
															type="button"
															onClick={() =>
																handleToggleStatus(user.id, user.status)
															}
															disabled={isPending}
															className={cn(
																"flex w-full px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 disabled:opacity-50",
																user.status === "active"
																	? "text-red-600"
																	: "text-emerald-600",
															)}
														>
															{user.status === "active"
																? "Deactivate User"
																: "Reactivate User"}
														</button>
													</div>
												</div>
											</>
										) : null}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
