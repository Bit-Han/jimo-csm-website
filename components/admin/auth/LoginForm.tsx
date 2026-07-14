"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { loginAction } from "@/lib/actions/admin/auth";
import { inputCls } from "@/components/admin/ui/EditorField";
import type { LoginFormState } from "@/lib/types/admin/auth";

const initialState: LoginFormState = { status: "idle", message: "" };

export function LoginForm({
	redirectTo,
	justCreated,
}: {
	redirectTo: string;
	justCreated: boolean;
}) {
	const [state, formAction, isPending] = useActionState(
		loginAction,
		initialState,
	);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<form action={formAction} className="space-y-5">
			<input type="hidden" name="redirectTo" value={redirectTo} />

			{justCreated ? (
				<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
					<p className="text-sm font-medium text-emerald-700">
						Account created! Sign in with your new credentials.
					</p>
				</div>
			) : null}

			<div>
				<label
					htmlFor="email"
					className="mb-1.5 block text-sm font-medium text-ink-950"
				>
					Email Address
				</label>
				<input
					id="email"
					type="email"
					name="email"
					placeholder="you@jimo.ng"
					autoComplete="email"
					required
					className={inputCls}
				/>
			</div>

			<div>
				<label
					htmlFor="password"
					className="mb-1.5 block text-sm font-medium text-ink-950"
				>
					Password
				</label>
				<div className="relative">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Your password"
						autoComplete="current-password"
						required
						className={`${inputCls} pr-10`}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((p) => !p)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink-950"
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>

			{state.status === "error" ? (
				<p role="alert" className="text-sm font-medium text-red-600">
					{state.message}
				</p>
			) : null}

			<button
				type="submit"
				disabled={isPending}
				className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:opacity-60"
			>
				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				Sign In
			</button>
		</form>
	);
}
