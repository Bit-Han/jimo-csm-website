"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { forgotPasswordAction } from "@/lib/actions/admin/auth";
import { inputCls } from "@/components/admin/ui/EditorField";
import type { ForgotPasswordFormState } from "@/lib/types/admin/auth";

const initialState: ForgotPasswordFormState = { status: "idle", message: "" };

export function ForgotPasswordForm() {
	const [state, formAction, isPending] = useActionState(
		forgotPasswordAction,
		initialState,
	);

	if (state.status === "success") {
		return (
			<div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
				<p className="text-sm font-medium text-emerald-300">{state.message}</p>
			</div>
		);
	}

	return (
		<form action={formAction} className="space-y-5">
			<div>
				<label
					htmlFor="email"
					className="mb-1.5 block text-sm font-medium text-white/80"
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
				Send Reset Link
			</button>
		</form>
	);
}
