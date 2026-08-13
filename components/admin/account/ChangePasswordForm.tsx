"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import {
	changePasswordAction,
	type ChangePasswordFormState,
} from "@/lib/actions/admin/account";
import { inputCls } from "@/components/admin/ui/EditorField";
import { passwordRequirements } from "@/lib/utils/password";

const initialState: ChangePasswordFormState = { status: "idle", message: "" };

export function ChangePasswordForm() {
	const [state, formAction, isPending] = useActionState(
		changePasswordAction,
		initialState,
	);
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const confirmTouched = confirmPassword.length > 0;
	const passwordsMatch = newPassword === confirmPassword;

	return (
		<form action={formAction} className="space-y-5">
			<div>
				<label
					htmlFor="currentPassword"
					className="mb-1.5 block text-sm font-medium text-ink-950"
				>
					Current Password <span className="text-red-500">*</span>
				</label>
				<div className="relative">
					<input
						id="currentPassword"
						type={showCurrent ? "text" : "password"}
						name="currentPassword"
						autoComplete="current-password"
						required
						className={`${inputCls} pr-10`}
					/>
					<button
						type="button"
						onClick={() => setShowCurrent((p) => !p)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink-950"
						aria-label="Toggle password visibility"
					>
						{showCurrent ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>

			<div>
				<label
					htmlFor="newPassword"
					className="mb-1.5 block text-sm font-medium text-ink-950"
				>
					New Password <span className="text-red-500">*</span>
				</label>
				<div className="relative">
					<input
						id="newPassword"
						type={showNew ? "text" : "password"}
						name="newPassword"
						autoComplete="new-password"
						maxLength={72}
						required
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className={`${inputCls} pr-10`}
					/>
					<button
						type="button"
						onClick={() => setShowNew((p) => !p)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink-950"
						aria-label="Toggle password visibility"
					>
						{showNew ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{newPassword.length > 0 ? (
					<ul className="mt-2 space-y-1">
						{passwordRequirements.map((req) => {
							const met = req.test(newPassword);
							return (
								<li
									key={req.id}
									className={`flex items-center gap-1.5 text-xs ${met ? "text-emerald-600" : "text-stone-400"}`}
								>
									{met ? (
										<Check className="h-3 w-3" />
									) : (
										<X className="h-3 w-3" />
									)}
									{req.label}
								</li>
							);
						})}
					</ul>
				) : null}
			</div>

			<div>
				<label
					htmlFor="confirmPassword"
					className="mb-1.5 block text-sm font-medium text-ink-950"
				>
					Confirm New Password <span className="text-red-500">*</span>
				</label>
				<div className="relative">
					<input
						id="confirmPassword"
						type={showConfirm ? "text" : "password"}
						name="confirmPassword"
						autoComplete="new-password"
						maxLength={72}
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className={`${inputCls} pr-10`}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm((p) => !p)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink-950"
						aria-label="Toggle password visibility"
					>
						{showConfirm ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{confirmTouched ? (
					<p
						className={`mt-1 text-xs ${passwordsMatch ? "text-emerald-600" : "text-red-500"}`}
					>
						{passwordsMatch ? "Passwords match" : "Passwords do not match"}
					</p>
				) : null}
			</div>

			{state.status === "error" ? (
				<p role="alert" className="text-sm font-medium text-red-500">
					{state.message}
				</p>
			) : null}

			<button
				type="submit"
				disabled={isPending}
				className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 py-3 text-sm font-semibold text-white hover:bg-ink-900 disabled:opacity-60"
			>
				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				Update Password
			</button>
		</form>
	);
}
