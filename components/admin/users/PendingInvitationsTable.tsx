"use client";

import { useState, useTransition } from "react";
import { Clock, Loader2, X } from "lucide-react";
import { revokePendingInvite } from "@/lib/actions/admin/users";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import type { AdminRole } from "@/lib/types/admin/role";

export interface PendingInvitation {
	id: string;
	email: string;
	role: AdminRole;
	invitedByName: string | null;
	expiresAt: string;
	createdAt: string;
}

export function PendingInvitationsTable({
	invitations,
}: {
	invitations: PendingInvitation[];
}) {
	const [rows, setRows] = useState(invitations);
	const [isPending, startTransition] = useTransition();

	if (rows.length === 0) return null;

	function handleRevoke(id: string) {
		startTransition(async () => {
			const result = await revokePendingInvite(id);
			if (result.success) {
				setRows((prev) => prev.filter((r) => r.id !== id));
			}
		});
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-amber-200 bg-white">
			<div className="flex items-center gap-3 border-b border-amber-100 bg-amber-50 px-6 py-4">
				<Clock className="h-4 w-4 text-amber-500" />
				<h3 className="text-sm font-bold text-amber-800">
					Pending Invitations ({rows.length})
				</h3>
				<p className="text-xs text-amber-600">
					These invites have been sent but not yet accepted.
				</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[580px] text-left text-sm">
					<thead>
						<tr className="border-b border-stone-100 bg-stone-50/60">
							{["Email", "Role", "Invited By", "Expires", ""].map((h) => (
								<th
									key={h}
									className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((inv) => {
							const roleLabel =
								adminRoleDefinitions.find((r) => r.id === inv.role)?.label ??
								inv.role;
							return (
								<tr
									key={inv.id}
									className="border-b border-stone-100 last:border-none"
								>
									<td className="px-6 py-3.5 text-stone-700">{inv.email}</td>
									<td className="px-6 py-3.5 text-stone-600">{roleLabel}</td>
									<td className="px-6 py-3.5 text-stone-500">
										{inv.invitedByName ?? "—"}
									</td>
									<td className="px-6 py-3.5 text-stone-500">
										{inv.expiresAt}
									</td>
									<td className="px-6 py-3.5">
										<button
											type="button"
											onClick={() => handleRevoke(inv.id)}
											disabled={isPending}
											className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
										>
											{isPending ? (
												<Loader2 className="h-3.5 w-3.5 animate-spin" />
											) : (
												<X className="h-3.5 w-3.5" />
											)}
											Revoke
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
