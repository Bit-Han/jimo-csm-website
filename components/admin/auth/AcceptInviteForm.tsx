// "use client";

// import { useActionState, useState } from "react";
// import { Eye, EyeOff, Loader2 } from "lucide-react";
// import { acceptInviteAction } from "@/lib/actions/admin/auth";
// import { inputCls } from "@/components/admin/ui/EditorField";
// import type { AcceptInviteFormState } from "@/lib/types/admin/auth";

// const initialState: AcceptInviteFormState = { status: "idle", message: "" };

// export function AcceptInviteForm({
// 	token,
// 	email,
// 	roleLabel,
// }: {
// 	token: string;
// 	email: string;
// 	roleLabel: string;
// }) {
// 	const [state, formAction, isPending] = useActionState(
// 		acceptInviteAction,
// 		initialState,
// 	);
// 	const [showPassword, setShowPassword] = useState(false);
// 	const [showConfirm, setShowConfirm] = useState(false);

// 	return (
// 		<form action={formAction} className="space-y-5">
// 			<input type="hidden" name="token" value={token} />

// 			{/* Pre-filled email — read only */}
// 			<div>
// 				<label className="mb-1.5 block text-sm font-medium text-ink-950">
// 					Email Address
// 				</label>
// 				<input
// 					type="email"
// 					value={email}
// 					readOnly
// 					className={`${inputCls} cursor-not-allowed bg-stone-100 text-stone-500`}
// 				/>
// 				<p className="mt-1 text-xs text-stone-400">
// 					Your email cannot be changed — it was set by the invite.
// 				</p>
// 			</div>

// 			{/* Assigned role — informational */}
// 			<div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
// 				<span className="text-xs text-stone-500">Your role:</span>
// 				<span className="text-xs font-semibold text-ink-950">{roleLabel}</span>
// 			</div>

// 			<div>
// 				<label
// 					htmlFor="fullName"
// 					className="mb-1.5 block text-sm font-medium text-ink-950"
// 				>
// 					Full Name <span className="text-red-500">*</span>
// 				</label>
// 				<input
// 					id="fullName"
// 					type="text"
// 					name="fullName"
// 					placeholder="Your full name"
// 					autoComplete="name"
// 					required
// 					className={inputCls}
// 				/>
// 			</div>

// 			<div>
// 				<label
// 					htmlFor="password"
// 					className="mb-1.5 block text-sm font-medium text-ink-950"
// 				>
// 					Password <span className="text-red-500">*</span>
// 				</label>
// 				<div className="relative">
// 					<input
// 						id="password"
// 						type={showPassword ? "text" : "password"}
// 						name="password"
// 						placeholder="At least 8 characters"
// 						autoComplete="new-password"
// 						minLength={8}
// 						required
// 						className={`${inputCls} pr-10`}
// 					/>
// 					<button
// 						type="button"
// 						onClick={() => setShowPassword((p) => !p)}
// 						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
// 						aria-label="Toggle password visibility"
// 					>
// 						{showPassword ? (
// 							<EyeOff className="h-4 w-4" />
// 						) : (
// 							<Eye className="h-4 w-4" />
// 						)}
// 					</button>
// 				</div>
// 			</div>

// 			<div>
// 				<label
// 					htmlFor="confirmPassword"
// 					className="mb-1.5 block text-sm font-medium text-ink-950"
// 				>
// 					Confirm Password <span className="text-red-500">*</span>
// 				</label>
// 				<div className="relative">
// 					<input
// 						id="confirmPassword"
// 						type={showConfirm ? "text" : "password"}
// 						name="confirmPassword"
// 						placeholder="Repeat your password"
// 						autoComplete="new-password"
// 						required
// 						className={`${inputCls} pr-10`}
// 					/>
// 					<button
// 						type="button"
// 						onClick={() => setShowConfirm((p) => !p)}
// 						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
// 						aria-label="Toggle confirm password visibility"
// 					>
// 						{showConfirm ? (
// 							<EyeOff className="h-4 w-4" />
// 						) : (
// 							<Eye className="h-4 w-4" />
// 						)}
// 					</button>
// 				</div>
// 			</div>

// 			{state.status === "error" ? (
// 				<p role="alert" className="text-sm font-medium text-red-600">
// 					{state.message}
// 				</p>
// 			) : null}

// 			<button
// 				type="submit"
// 				disabled={isPending}
// 				className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:opacity-60"
// 			>
// 				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
// 				Create Account &amp; Sign In
// 			</button>
// 		</form>
// 	);
// }

"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { acceptInviteAction } from "@/lib/actions/admin/auth";
import { inputCls } from "@/components/admin/ui/EditorField";
import type { AcceptInviteFormState } from "@/lib/types/admin/auth";

const initialState: AcceptInviteFormState = { status: "idle", message: "" };

export function AcceptInviteForm({
	email,
	roleLabel,
}: {
	email: string;
	roleLabel: string;
}) {
	const [state, formAction, isPending] = useActionState(
		acceptInviteAction,
		initialState,
	);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	return (
		<form action={formAction} className="space-y-5">
			{/* Pre-filled, read-only email */}
			<div>
				<label className="mb-1.5 block text-sm font-medium text-white/80">
					Email Address
				</label>
				<input
					type="email"
					value={email}
					readOnly
					className={`${inputCls} cursor-not-allowed bg-white/10 text-white/60`}
				/>
				<p className="mt-1 text-xs text-white/30">
					Your email was set by the invite and cannot be changed.
				</p>
			</div>

			{/* Assigned role */}
			<div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
				<span className="text-xs text-white/50">Your role:</span>
				<span className="text-xs font-semibold text-gold-400">{roleLabel}</span>
			</div>

			{/* Full name */}
			<div>
				<label
					htmlFor="fullName"
					className="mb-1.5 block text-sm font-medium text-white/80"
				>
					Full Name <span className="text-red-400">*</span>
				</label>
				<input
					id="fullName"
					type="text"
					name="fullName"
					placeholder="Your full name"
					autoComplete="name"
					required
					className={inputCls}
				/>
			</div>

			{/* Password */}
			<div>
				<label
					htmlFor="password"
					className="mb-1.5 block text-sm font-medium text-white/80"
				>
					Password <span className="text-red-400">*</span>
				</label>
				<div className="relative">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="At least 8 characters"
						autoComplete="new-password"
						minLength={8}
						required
						className={`${inputCls} pr-10`}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((p) => !p)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink-950"
						aria-label="Toggle password visibility"
					>
						{showPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>

			{/* Confirm password */}
			<div>
				<label
					htmlFor="confirmPassword"
					className="mb-1.5 block text-sm font-medium text-white/80"
				>
					Confirm Password <span className="text-red-400">*</span>
				</label>
				<div className="relative">
					<input
						id="confirmPassword"
						type={showConfirm ? "text" : "password"}
						name="confirmPassword"
						placeholder="Repeat your password"
						autoComplete="new-password"
						required
						className={`${inputCls} pr-10`}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm((p) => !p)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink-950"
						aria-label="Toggle confirm password visibility"
					>
						{showConfirm ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
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
				Create Account &amp; Sign In
			</button>
		</form>
	);
}