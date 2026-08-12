"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/admin/auth";
import { inputCls } from "@/components/admin/ui/EditorField";
import { passwordRequirements } from "@/lib/utils/password";
import type { ResetPasswordFormState } from "@/lib/types/admin/auth";

const initialState: ResetPasswordFormState = { status: "idle", message: "" };

export function ResetPasswordForm() {
	const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const confirmTouched = confirmPassword.length > 0;
	const passwordsMatch = password === confirmPassword;

	return (
		<form action={formAction} className="space-y-5">
			<div>
				<label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
					New Password <span className="text-red-400">*</span>
				</label>
				<div className="relative">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						name="password"
						autoComplete="new-password"
						maxLength={72}
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={`${inputCls} pr-10`}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((p) => !p)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink-950"
						aria-label="Toggle password visibility"
					>
						{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				{password.length > 0 ? (
					<ul className="mt-2 space-y-1">
						{passwordRequirements.map((req) => {
							const met = req.test(password);
							return (
								<li key={req.id} className={`flex items-center gap-1.5 text-xs ${met ? "text-emerald-400" : "text-white/40"}`}>
									{met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
									{req.label}
								</li>
							);
						})}
					</ul>
				) : null}
			</div>

			<div>
				<label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-white/80">
					Confirm New Password <span className="text-red-400">*</span>
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
						aria-label="Toggle confirm password visibility"
					>
						{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				{confirmTouched ? (
					<p className={`mt-1 text-xs ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
						{passwordsMatch ? "Passwords match" : "Passwords do not match"}
					</p>
				) : null}
			</div>

			{state.status === "error" ? (
				<p role="alert" className="text-sm font-medium text-red-400">
					{state.message}
				</p>
			) : null}

			<button
				type="submit"
				disabled={isPending}
				className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:opacity-60"
			>
				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				Set New Password
			</button>
		</form>
	);
}