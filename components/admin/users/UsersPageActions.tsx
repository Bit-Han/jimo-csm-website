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
