import { Check, Minus, X } from "lucide-react";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import type {
	PermissionMatrixRow,
	PermissionValue,
} from "@/lib/types/admin/users-roles";

function PermissionIcon({ value }: { value: PermissionValue }) {
	if (value === "yes") {
		return <Check className="mx-auto h-4 w-4 text-emerald-500" />;
	}
	if (value === "partial") {
		return <Minus className="mx-auto h-4 w-4 text-stone-400" />;
	}
	return <X className="mx-auto h-4 w-4 text-red-400" />;
}

export function PermissionMatrixTable({
	matrix,
}: {
	matrix: PermissionMatrixRow[];
}) {
	return (
		<div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
			<div className="border-b border-stone-100 px-6 py-5">
				<h3 className="text-sm font-bold text-ink-950">
					Permission Matrix Preview
				</h3>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[640px] text-sm">
					<thead>
						<tr className="border-b border-stone-100 bg-stone-50/60">
							<th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
								Permission
							</th>
							{adminRoleDefinitions.map((role) => (
								<th
									key={role.id}
									className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-stone-500"
								>
									{role.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{matrix.map((row) => (
							<tr
								key={row.permission}
								className="border-b border-stone-100 last:border-none"
							>
								<td className="px-6 py-3.5 font-medium text-ink-950">
									{row.label}
								</td>
								{adminRoleDefinitions.map((role) => (
									<td key={role.id} className="px-4 py-3.5 text-center">
										<PermissionIcon value={row.values[role.id]} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
