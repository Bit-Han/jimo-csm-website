"use client";

import { useState, useTransition } from "react";
import { Loader2, Mail, X } from "lucide-react";
import { inviteUser } from "@/lib/actions/admin/users";
import { adminRoleDefinitions } from "@/lib/data/admin/roles";
import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
import type { AdminRole } from "@/lib/types/admin/role";
import type { InviteFormStatus } from "@/lib/types/admin/users-roles";

export function InviteUserModal({ onClose }: { onClose: () => void }) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<AdminRole>("sales-crm");
	const [status, setStatus] = useState<InviteFormStatus>("idle");
	const [message, setMessage] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleSubmit() {
		if (!email.trim()) return;
		setStatus("sending");
		startTransition(async () => {
			const result = await inviteUser({ email, role });
			setStatus(result.success ? "sent" : "error");
			setMessage(result.message);
		});
	}

	const rolesExceptSuperAdmin = adminRoleDefinitions.filter(
		(r) => r.id !== "super-admin",
	);

	return (
		<>
			<button
				type="button"
				onClick={onClose}
				aria-label="Close"
				className="fixed inset-0 z-40 bg-black/50"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Invite User"
				className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
			>
				<div className="flex items-start justify-between">
					<div>
						<h2 className="text-base font-bold text-ink-950">Invite User</h2>
						<p className="mt-0.5 text-xs text-stone-500">
							They will receive an email with a link to create their account.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-stone-400 hover:text-ink-950"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{status === "sent" ? (
					<div className="mt-5 flex flex-col items-center gap-3 rounded-xl bg-emerald-50 py-8 text-center">
						<Mail className="h-8 w-8 text-emerald-500" />
						<p className="text-sm font-semibold text-emerald-700">
							Invite sent!
						</p>
						<p className="max-w-xs text-xs text-emerald-600">{message}</p>
						<button
							type="button"
							onClick={onClose}
							className="mt-2 rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-900"
						>
							Done
						</button>
					</div>
				) : (
					<div className="mt-5 space-y-4">
						<div>
							<label className="mb-1.5 block text-sm font-medium text-ink-950">
								Email Address <span className="text-red-500">*</span>
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="colleague@jimo.ng"
								className={inputCls}
							/>
						</div>

						<div>
							<label className="mb-1.5 block text-sm font-medium text-ink-950">
								Role <span className="text-red-500">*</span>
							</label>
							<select
								value={role}
								onChange={(e) => setRole(e.target.value as AdminRole)}
								className={selectCls}
							>
								{rolesExceptSuperAdmin.map((r) => (
									<option key={r.id} value={r.id}>
										{r.label} — {r.description}
									</option>
								))}
							</select>
							<p className="mt-1.5 text-xs text-stone-500">
								Only Super Admins can invite other Super Admins. Roles can be
								changed after the user accepts the invite.
							</p>
						</div>

						<div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
							<p className="text-xs font-semibold text-blue-700">
								Integration Stage Note
							</p>
							<p className="mt-0.5 text-xs text-blue-600">
								The invite email and token-based signup flow will be fully wired
								in the auth integration stage. The{" "}
								<code className="rounded bg-blue-100 px-1">
									admin_invitations
								</code>{" "}
								table is already in the schema ready to receive this data.
							</p>
						</div>

						{status === "error" && message ? (
							<p className="text-sm font-medium text-red-500">{message}</p>
						) : null}

						<div className="flex justify-end gap-3 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isPending || !email.trim()}
								className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
							>
								{isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Mail className="h-4 w-4" />
								)}
								Send Invite
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

// "use client";

// import { useState, useTransition } from "react";
// import { Check, ClipboardCopy, Loader2, Mail, X } from "lucide-react";
// import { inviteUser } from "@/lib/actions/admin/users";
// import { adminRoleDefinitions } from "@/lib/data/admin/roles";
// import { inputCls, selectCls } from "@/components/admin/ui/EditorField";
// import type { AdminRole } from "@/lib/types/admin/role";
// import type { InviteFormStatus } from "@/lib/types/admin/users-roles";

// export function InviteUserModal({ onClose }: { onClose: () => void }) {
// 	const [email, setEmail] = useState("");
// 	const [role, setRole] = useState<AdminRole>("sales-crm");
// 	const [status, setStatus] = useState<InviteFormStatus>("idle");
// 	const [result, setResult] = useState<{
// 		message: string;
// 		inviteLink?: string;
// 	} | null>(null);
// 	const [copied, setCopied] = useState(false);
// 	const [isPending, startTransition] = useTransition();

// 	const rolesExceptSuperAdmin = adminRoleDefinitions.filter(
// 		(r) => r.id !== "super-admin",
// 	);

// 	function handleSubmit() {
// 		if (!email.trim()) return;
// 		setStatus("sending");
// 		startTransition(async () => {
// 			const res = await inviteUser({ email, role });
// 			setResult({ message: res.message, inviteLink: res.inviteLink });
// 			setStatus(res.success ? "sent" : "error");
// 		});
// 	}

// 	function handleCopyLink() {
// 		if (!result?.inviteLink) return;
// 		navigator.clipboard.writeText(result.inviteLink).then(() => {
// 			setCopied(true);
// 			setTimeout(() => setCopied(false), 2000);
// 		});
// 	}

// 	return (
// 		<>
// 			<button
// 				type="button"
// 				onClick={onClose}
// 				aria-label="Close"
// 				className="fixed inset-0 z-40 bg-black/50"
// 			/>
// 			<div
// 				role="dialog"
// 				aria-modal="true"
// 				aria-label="Invite User"
// 				className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
// 			>
// 				<div className="flex items-start justify-between">
// 					<div>
// 						<h2 className="text-base font-bold text-ink-950">Invite User</h2>
// 						<p className="mt-0.5 text-xs text-stone-500">
// 							They will receive an email with a link to create their account.
// 						</p>
// 					</div>
// 					<button
// 						type="button"
// 						onClick={onClose}
// 						className="text-stone-400 hover:text-ink-950"
// 					>
// 						<X className="h-5 w-5" />
// 					</button>
// 				</div>

// 				{status === "sent" && result ? (
// 					<div className="mt-5 space-y-4">
// 						<div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 py-6 text-center">
// 							<Mail className="h-7 w-7 text-emerald-500" />
// 							<p className="text-sm font-semibold text-emerald-700">
// 								Invite created!
// 							</p>
// 							<p className="max-w-xs text-xs text-emerald-600">
// 								{result.message}
// 							</p>
// 						</div>

// 						{result.inviteLink ? (
// 							<div>
// 								<p className="mb-1.5 text-xs font-semibold text-stone-500">
// 									Share this invite link manually until email is configured:
// 								</p>
// 								<div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
// 									<p className="flex-1 truncate font-mono text-[11px] text-stone-600">
// 										{result.inviteLink}
// 									</p>
// 									<button
// 										type="button"
// 										onClick={handleCopyLink}
// 										className="shrink-0 text-stone-500 hover:text-ink-950"
// 										aria-label="Copy invite link"
// 									>
// 										{copied ? (
// 											<Check className="h-4 w-4 text-emerald-500" />
// 										) : (
// 											<ClipboardCopy className="h-4 w-4" />
// 										)}
// 									</button>
// 								</div>
// 								<p className="mt-1.5 text-[10px] text-stone-400">
// 									This link expires in 7 days.
// 								</p>
// 							</div>
// 						) : null}

// 						<button
// 							type="button"
// 							onClick={onClose}
// 							className="w-full rounded-xl bg-ink-950 py-2.5 text-sm font-semibold text-white hover:bg-ink-900"
// 						>
// 							Done
// 						</button>
// 					</div>
// 				) : (
// 					<div className="mt-5 space-y-4">
// 						<div>
// 							<label className="mb-1.5 block text-sm font-medium text-ink-950">
// 								Email Address <span className="text-red-500">*</span>
// 							</label>
// 							<input
// 								type="email"
// 								value={email}
// 								onChange={(e) => setEmail(e.target.value)}
// 								placeholder="colleague@jimo.ng"
// 								className={inputCls}
// 							/>
// 						</div>

// 						<div>
// 							<label className="mb-1.5 block text-sm font-medium text-ink-950">
// 								Role <span className="text-red-500">*</span>
// 							</label>
// 							<select
// 								value={role}
// 								onChange={(e) => setRole(e.target.value as AdminRole)}
// 								className={selectCls}
// 							>
// 								{rolesExceptSuperAdmin.map((r) => (
// 									<option key={r.id} value={r.id}>
// 										{r.label} — {r.description}
// 									</option>
// 								))}
// 							</select>
// 							<p className="mt-1.5 text-xs text-stone-500">
// 								Only Super Admins can invite users. Roles can be changed later.
// 							</p>
// 						</div>

// 						{status === "error" && result ? (
// 							<p className="text-sm font-medium text-red-500">
// 								{result.message}
// 							</p>
// 						) : null}

// 						<div className="flex justify-end gap-3">
// 							<button
// 								type="button"
// 								onClick={onClose}
// 								className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
// 							>
// 								Cancel
// 							</button>
// 							<button
// 								type="button"
// 								onClick={handleSubmit}
// 								disabled={isPending || !email.trim()}
// 								className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
// 							>
// 								{isPending ? (
// 									<Loader2 className="h-4 w-4 animate-spin" />
// 								) : (
// 									<Mail className="h-4 w-4" />
// 								)}
// 								Create Invite
// 							</button>
// 						</div>
// 					</div>
// 				)}
// 			</div>
// 		</>
// 	);
// }