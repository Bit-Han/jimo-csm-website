// //@/components/admin/users/UsersTable.tsx

// "use client";

// import { useState, useTransition } from "react";
// import { MoreHorizontal } from "lucide-react";
// import { AdminBadge } from "@/components/admin/ui/AdminBadge";
// import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
// import {
// 	deactivateUser,
// 	reactivateUser,
// 	changeUserRole,
// } from "@/lib/actions/admin/users";
// import { adminRoleDefinitions } from "@/lib/data/admin/roles";
// import { cn } from "@/lib/utils/helpers";
// import type { AdminRole } from "@/lib/types/admin/role";
// import type { AdminUserListRow } from "@/lib/types/admin/users-roles";

// const ROLE_BADGE_VARIANT: Record<AdminRole, AdminBadgeVariant> = {
// 	"super-admin": "qualified",
// 	"website-manager": "contacted",
// 	"content-seo": "new",
// 	"sales-crm": "inspection",
// 	"marketing-admin": "review",
// };

// const ROLE_TEXT_COLOR: Record<AdminRole, string> = {
// 	"super-admin": "text-violet-700",
// 	"website-manager": "text-blue-700",
// 	"content-seo": "text-emerald-700",
// 	"sales-crm": "text-amber-700",
// 	"marketing-admin": "text-pink-700",
// };

// export function UsersTable({ users }: { users: AdminUserListRow[] }) {
// 	const [rows, setRows] = useState(users);
// 	const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
// 	const [isPending, startTransition] = useTransition();

// 	function handleToggleStatus(
// 		id: string,
// 		currentStatus: "active" | "inactive",
// 	) {
// 		startTransition(async () => {
// 			const action =
// 				currentStatus === "active" ? deactivateUser : reactivateUser;
// 			const result = await action(id);
// 			if (result.success) {
// 				setRows((prev) =>
// 					prev.map((u) =>
// 						u.id === id
// 							? {
// 									...u,
// 									status: currentStatus === "active" ? "inactive" : "active",
// 								}
// 							: u,
// 					),
// 				);
// 			}
// 		});
// 		setMenuOpenId(null);
// 	}

// 	function handleChangeRole(id: string, role: AdminRole) {
// 		startTransition(async () => {
// 			const found = adminRoleDefinitions.find((r) => r.id === role);
// 			const result = await changeUserRole(id, role);
// 			if (result.success) {
// 				setRows((prev) =>
// 					prev.map((u) =>
// 						u.id === id
// 							? { ...u, role, roleLabel: found?.label ?? u.roleLabel }
// 							: u,
// 					),
// 				);
// 			}
// 		});
// 		setMenuOpenId(null);
// 	}

// 	return (
// 		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
// 			<div className="overflow-x-auto">
// 				<table className="w-full min-w-[760px] text-left text-sm">
// 					<thead>
// 						<tr className="border-b border-stone-100 bg-stone-50/60">
// 							{[
// 								"Name",
// 								"Email",
// 								"Role",
// 								"Status",
// 								"Permission Summary",
// 								"Last Active",
// 								"",
// 							].map((h) => (
// 								<th
// 									key={h}
// 									className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
// 								>
// 									{h}
// 								</th>
// 							))}
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{rows.map((user) => (
// 							<tr
// 								key={user.id}
// 								className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
// 							>
// 								<td className="px-6 py-4 font-semibold text-ink-950">
// 									{user.fullName}
// 								</td>
// 								<td className="px-6 py-4 text-stone-600">{user.email}</td>
// 								<td className="px-6 py-4">
// 									<span
// 										className={cn(
// 											"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
// 											"bg-stone-100",
// 											ROLE_TEXT_COLOR[user.role],
// 										)}
// 									>
// 										{user.roleLabel}
// 									</span>
// 								</td>
// 								<td className="px-6 py-4">
// 									<AdminBadge
// 										variant={user.status === "active" ? "active" : "draft"}
// 									/>
// 								</td>
// 								<td className="px-6 py-4 text-stone-600">
// 									{user.permissionSummary}
// 								</td>
// 								<td className="px-6 py-4 text-stone-500">{user.lastActive}</td>
// 								<td className="px-6 py-4">
// 									<div className="relative">
// 										<button
// 											type="button"
// 											onClick={() =>
// 												setMenuOpenId(menuOpenId === user.id ? null : user.id)
// 											}
// 											className="text-stone-400 hover:text-ink-950"
// 											aria-label="More options"
// 										>
// 											<MoreHorizontal className="h-4 w-4" />
// 										</button>

// 										{menuOpenId === user.id ? (
// 											<>
// 												<button
// 													type="button"
// 													className="fixed inset-0 z-10"
// 													onClick={() => setMenuOpenId(null)}
// 													aria-label="Close menu"
// 												/>
// 												<div className="absolute right-0 top-6 z-20 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
// 													<div className="border-b border-stone-100 px-4 py-2.5">
// 														<p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">
// 															Change Role
// 														</p>
// 													</div>
// 													{adminRoleDefinitions.map((roleDef) => (
// 														<button
// 															key={roleDef.id}
// 															type="button"
// 															onClick={() =>
// 																handleChangeRole(user.id, roleDef.id)
// 															}
// 															disabled={isPending || user.role === roleDef.id}
// 															className={cn(
// 																"flex w-full px-4 py-2 text-xs hover:bg-stone-50 disabled:opacity-50",
// 																user.role === roleDef.id
// 																	? "font-semibold text-ink-950"
// 																	: "text-stone-600",
// 															)}
// 														>
// 															{roleDef.label}
// 														</button>
// 													))}
// 													<div className="border-t border-stone-100">
// 														<button
// 															type="button"
// 															onClick={() =>
// 																handleToggleStatus(user.id, user.status)
// 															}
// 															disabled={isPending}
// 															className={cn(
// 																"flex w-full px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 disabled:opacity-50",
// 																user.status === "active"
// 																	? "text-red-600"
// 																	: "text-emerald-600",
// 															)}
// 														>
// 															{user.status === "active"
// 																? "Deactivate User"
// 																: "Reactivate User"}
// 														</button>
// 													</div>
// 												</div>
// 											</>
// 										) : null}
// 									</div>
// 								</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</div>
// 		</div>
// 	);
// }

// // "use client";

// // import { useState, useTransition } from "react";
// // import { Check, Loader2, MoreHorizontal } from "lucide-react";
// // import { AdminBadge } from "@/components/admin/ui/AdminBadge";
// // import type { AdminBadgeVariant } from "@/components/admin/ui/AdminBadge";
// // import {
// // 	changeUserRole,
// // 	deactivateUser,
// // 	reactivateUser,
// // } from "@/lib/actions/admin/users";
// // import { adminRoleDefinitions } from "@/lib/data/admin/roles";
// // import { cn } from "@/lib/utils/helpers";
// // import type { AdminRole } from "@/lib/types/admin/role";
// // import type { AdminUserListRow } from "@/lib/types/admin/users-roles";

// // const ROLE_COLOR: Record<AdminRole, string> = {
// // 	"super-admin": "text-violet-700",
// // 	"website-manager": "text-blue-700",
// // 	"content-seo": "text-emerald-700",
// // 	"sales-crm": "text-amber-700",
// // 	"marketing-admin": "text-pink-700",
// // };

// // export function UsersTable({ users }: { users: AdminUserListRow[] }) {
// // 	const [rows, setRows] = useState(users);
// // 	const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
// // 	const [feedbackId, setFeedbackId] = useState<string | null>(null);
// // 	const [feedbackMsg, setFeedbackMsg] = useState<string>("");
// // 	const [isPending, startTransition] = useTransition();

// // 	function showFeedback(id: string, msg: string) {
// // 		setFeedbackId(id);
// // 		setFeedbackMsg(msg);
// // 		setTimeout(() => {
// // 			setFeedbackId(null);
// // 			setFeedbackMsg("");
// // 		}, 3000);
// // 	}

// // 	function handleToggleStatus(id: string, current: "active" | "inactive") {
// // 		setMenuOpenId(null);
// // 		startTransition(async () => {
// // 			const fn = current === "active" ? deactivateUser : reactivateUser;
// // 			const result = await fn(id);
// // 			if (result.success) {
// // 				setRows((prev) =>
// // 					prev.map((u) =>
// // 						u.id === id
// // 							? { ...u, status: current === "active" ? "inactive" : "active" }
// // 							: u,
// // 					),
// // 				);
// // 				showFeedback(id, result.message);
// // 			} else {
// // 				showFeedback(id, result.message);
// // 			}
// // 		});
// // 	}

// // 	function handleRoleChange(id: string, role: AdminRole) {
// // 		setMenuOpenId(null);
// // 		startTransition(async () => {
// // 			const result = await changeUserRole(id, role);
// // 			if (result.success) {
// // 				const label =
// // 					adminRoleDefinitions.find((r) => r.id === role)?.label ?? role;
// // 				setRows((prev) =>
// // 					prev.map((u) => (u.id === id ? { ...u, role, roleLabel: label } : u)),
// // 				);
// // 				showFeedback(id, result.message);
// // 			} else {
// // 				showFeedback(id, result.message);
// // 			}
// // 		});
// // 	}

// // 	return (
// // 		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
// // 			<div className="overflow-x-auto">
// // 				<table className="w-full min-w-[760px] text-left text-sm">
// // 					<thead>
// // 						<tr className="border-b border-stone-100 bg-stone-50/60">
// // 							{[
// // 								"Name",
// // 								"Email",
// // 								"Role",
// // 								"Status",
// // 								"Permission Summary",
// // 								"Last Active",
// // 								"",
// // 							].map((h) => (
// // 								<th
// // 									key={h}
// // 									className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-stone-500"
// // 								>
// // 									{h}
// // 								</th>
// // 							))}
// // 						</tr>
// // 					</thead>
// // 					<tbody>
// // 						{rows.map((user) => (
// // 							<tr
// // 								key={user.id}
// // 								className="border-b border-stone-100 transition-colors last:border-none hover:bg-stone-50"
// // 							>
// // 								<td className="px-6 py-4 font-semibold text-ink-950">
// // 									{user.fullName}
// // 									{feedbackId === user.id ? (
// // 										<span className="ml-2 flex items-center gap-1 text-xs font-normal text-emerald-600">
// // 											<Check className="h-3 w-3" />
// // 											{feedbackMsg}
// // 										</span>
// // 									) : null}
// // 								</td>
// // 								<td className="px-6 py-4 text-stone-600">{user.email}</td>
// // 								<td className="px-6 py-4">
// // 									<span
// // 										className={cn(
// // 											"inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold",
// // 											ROLE_COLOR[user.role],
// // 										)}
// // 									>
// // 										{user.roleLabel}
// // 									</span>
// // 								</td>
// // 								<td className="px-6 py-4">
// // 									<AdminBadge
// // 										variant={user.status === "active" ? "active" : "draft"}
// // 									/>
// // 								</td>
// // 								<td className="px-6 py-4 text-stone-600">
// // 									{user.permissionSummary}
// // 								</td>
// // 								<td className="px-6 py-4 text-stone-500">{user.lastActive}</td>
// // 								<td className="px-6 py-4">
// // 									<div className="relative">
// // 										<button
// // 											type="button"
// // 											onClick={() =>
// // 												setMenuOpenId(menuOpenId === user.id ? null : user.id)
// // 											}
// // 											disabled={isPending}
// // 											className="text-stone-400 hover:text-ink-950 disabled:opacity-40"
// // 											aria-label="More options"
// // 										>
// // 											{isPending && menuOpenId === user.id ? (
// // 												<Loader2 className="h-4 w-4 animate-spin" />
// // 											) : (
// // 												<MoreHorizontal className="h-4 w-4" />
// // 											)}
// // 										</button>

// // 										{menuOpenId === user.id ? (
// // 											<>
// // 												<button
// // 													type="button"
// // 													className="fixed inset-0 z-10"
// // 													onClick={() => setMenuOpenId(null)}
// // 													aria-label="Close menu"
// // 												/>
// // 												<div className="absolute right-0 top-6 z-20 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
// // 													<div className="border-b border-stone-100 px-4 py-2.5">
// // 														<p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">
// // 															Change Role
// // 														</p>
// // 													</div>
// // 													{adminRoleDefinitions.map((roleDef) => (
// // 														<button
// // 															key={roleDef.id}
// // 															type="button"
// // 															onClick={() =>
// // 																handleRoleChange(user.id, roleDef.id)
// // 															}
// // 															disabled={user.role === roleDef.id}
// // 															className={cn(
// // 																"flex w-full items-center justify-between px-4 py-2.5 text-xs hover:bg-stone-50 disabled:opacity-40",
// // 																user.role === roleDef.id
// // 																	? "font-semibold text-ink-950"
// // 																	: "text-stone-600",
// // 															)}
// // 														>
// // 															{roleDef.label}
// // 															{user.role === roleDef.id ? (
// // 																<Check className="h-3.5 w-3.5 text-emerald-500" />
// // 															) : null}
// // 														</button>
// // 													))}
// // 													<div className="border-t border-stone-100">
// // 														<button
// // 															type="button"
// // 															onClick={() =>
// // 																handleToggleStatus(user.id, user.status)
// // 															}
// // 															className={cn(
// // 																"flex w-full px-4 py-2.5 text-xs font-semibold hover:bg-stone-50",
// // 																user.status === "active"
// // 																	? "text-red-600"
// // 																	: "text-emerald-600",
// // 															)}
// // 														>
// // 															{user.status === "active"
// // 																? "Deactivate User"
// // 																: "Reactivate User"}
// // 														</button>
// // 													</div>
// // 												</div>
// // 											</>
// // 										) : null}
// // 									</div>
// // 								</td>
// // 							</tr>
// // 						))}
// // 					</tbody>
// // 				</table>
// // 			</div>
// // 		</div>
// // 	);
// // }

"use client";

import { useState, useTransition } from "react";
import { Loader2, MoreHorizontal } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import {
	deactivateUser,
	reactivateUser,
	changeUserRole,
} from "@/lib/actions/admin/users";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import { cn } from "@/lib/utils/helpers";
import type { AdminRole } from "@/lib/types/admin/role";
import type { AdminUserListRow } from "@/lib/types/admin/users-roles";

const ROLE_TEXT_COLOR: Record<AdminRole, string> = {
	"super-admin": "text-violet-700",
	"website-manager": "text-blue-700",
	"content-seo": "text-emerald-700",
	"sales-crm": "text-amber-700",
	"marketing-admin": "text-pink-700",
};

type PendingAction =
	| { type: "deactivate"; user: AdminUserListRow }
	| { type: "reactivate"; user: AdminUserListRow }
	| { type: "role"; user: AdminUserListRow; role: AdminRole };

export function UsersTable({ users }: { users: AdminUserListRow[] }) {
	const [rows, setRows] = useState(users);
	const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [pendingAction, setPendingAction] = useState<PendingAction | null>(
		null,
	);
	const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

	function showToast(msg: string, ok = true) {
		setToast({ msg, ok });
		setTimeout(() => setToast(null), 4000);
	}

	function handleConfirm() {
		if (!pendingAction) return;
		const action = pendingAction;
		setPendingAction(null);

		startTransition(async () => {
			const result =
				action.type === "deactivate"
					? await deactivateUser(action.user.id)
					: action.type === "reactivate"
						? await reactivateUser(action.user.id)
						: await changeUserRole(action.user.id, action.role);

			if (result.success) {
				setRows((prev) =>
					prev.map((u) => {
						if (u.id !== action.user.id) return u;
						if (action.type === "deactivate")
							return { ...u, status: "inactive" as const };
						if (action.type === "reactivate")
							return { ...u, status: "active" as const };
						const label =
							adminRoleDefinitions.find((r) => r.id === action.role)?.label ??
							u.roleLabel;
						return { ...u, role: action.role, roleLabel: label };
					}),
				);
			}
			showToast(result.message, result.success);
		});
	}

	function confirmCopy(action: PendingAction): {
		title: string;
		description: string;
	} {
		if (action.type === "deactivate") {
			return {
				title: `Deactivate ${action.user.fullName}?`,
				description:
					"They'll immediately lose access to the Command Centre. You can reactivate them at any time.",
			};
		}
		if (action.type === "reactivate") {
			return {
				title: `Reactivate ${action.user.fullName}?`,
				description:
					"They'll regain access to the Command Centre with their existing role.",
			};
		}
		const label =
			adminRoleDefinitions.find((r) => r.id === action.role)?.label ??
			action.role;
		return {
			title: `Change ${action.user.fullName}'s role to ${label}?`,
			description:
				"This changes which parts of the Command Centre they can see and edit, immediately.",
		};
	}

	return (
		<>
			{toast ? (
				<div
					className={cn(
						"fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-5 py-4 shadow-xl",
						toast.ok
							? "border-emerald-200 bg-emerald-50 text-emerald-700"
							: "border-red-200 bg-red-50 text-red-700",
					)}
				>
					<p className="text-sm font-medium">{toast.msg}</p>
				</div>
			) : null}

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
												"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-stone-100",
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
									<td className="px-6 py-4 text-stone-500">
										{user.lastActive}
									</td>
									<td className="px-6 py-4">
										<div className="relative">
											<button
												type="button"
												onClick={() =>
													setMenuOpenId(menuOpenId === user.id ? null : user.id)
												}
												disabled={isPending}
												className="text-stone-400 hover:text-ink-950 disabled:opacity-40"
												aria-label="More options"
											>
												{isPending ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<MoreHorizontal className="h-4 w-4" />
												)}
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
																onClick={() => {
																	setMenuOpenId(null);
																	setPendingAction({
																		type: "role",
																		user,
																		role: roleDef.id,
																	});
																}}
																disabled={user.role === roleDef.id}
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
																onClick={() => {
																	setMenuOpenId(null);
																	setPendingAction(
																		user.status === "active"
																			? { type: "deactivate", user }
																			: { type: "reactivate", user },
																	);
																}}
																className={cn(
																	"flex w-full px-4 py-2.5 text-xs font-semibold hover:bg-stone-50",
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

			<ConfirmDialog
				open={pendingAction !== null}
				title={pendingAction ? confirmCopy(pendingAction).title : ""}
				description={
					pendingAction ? confirmCopy(pendingAction).description : ""
				}
				confirmLabel="Confirm"
				variant={pendingAction?.type === "deactivate" ? "danger" : "default"}
				isLoading={isPending}
				onConfirm={handleConfirm}
				onCancel={() => setPendingAction(null)}
			/>
		</>
	);
}