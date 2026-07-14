"use client";

import { useState } from "react";
import { Download, UserPlus } from "lucide-react";
import { InviteUserModal } from "./InviteUserModal";

export function UsersPageActions() {
	const [inviteOpen, setInviteOpen] = useState(false);

	return (
		<>
			{inviteOpen ? (
				<InviteUserModal onClose={() => setInviteOpen(false)} />
			) : null}

			<div className="flex items-center gap-2">
				<button
					type="button"
					className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50"
				>
					<Download className="h-4 w-4" />
					Export Users
				</button>
				<button
					type="button"
					onClick={() => setInviteOpen(true)}
					className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
				>
					<UserPlus className="h-4 w-4" />
					Invite User
				</button>
			</div>
		</>
	);
}

// "use client";

// import { useState, useTransition } from "react";
// import { Download, Loader2, UserPlus } from "lucide-react";
// import { InviteUserModal } from "./InviteUserModal";
// import { exportUsersCsv } from "@/lib/actions/admin/users";

// export function UsersPageActions() {
// 	const [inviteOpen, setInviteOpen] = useState(false);
// 	const [exportPending, startExport] = useTransition();

// 	function handleExport() {
// 		startExport(async () => {
// 			const result = await exportUsersCsv();
// 			if (result.success && result.csv) {
// 				const blob = new Blob([result.csv], {
// 					type: "text/csv;charset=utf-8;",
// 				});
// 				const url = URL.createObjectURL(blob);
// 				const link = document.createElement("a");
// 				link.href = url;
// 				link.download = `jimo-admin-users-${new Date().toISOString().slice(0, 10)}.csv`;
// 				document.body.appendChild(link);
// 				link.click();
// 				document.body.removeChild(link);
// 				URL.revokeObjectURL(url);
// 			}
// 		});
// 	}

// 	return (
// 		<>
// 			{inviteOpen ? (
// 				<InviteUserModal onClose={() => setInviteOpen(false)} />
// 			) : null}

// 			<div className="flex items-center gap-2">
// 				<button
// 					type="button"
// 					onClick={handleExport}
// 					disabled={exportPending}
// 					className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
// 				>
// 					{exportPending ? (
// 						<Loader2 className="h-4 w-4 animate-spin" />
// 					) : (
// 						<Download className="h-4 w-4" />
// 					)}
// 					Export Users
// 				</button>
// 				<button
// 					type="button"
// 					onClick={() => setInviteOpen(true)}
// 					className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
// 				>
// 					<UserPlus className="h-4 w-4" />
// 					Invite User
// 				</button>
// 			</div>
// 		</>
// 	);
// }