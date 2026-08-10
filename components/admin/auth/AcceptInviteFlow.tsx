// // // components/admin/auth/AcceptInviteFlow.tsx
// // "use client";

// // import { useEffect, useRef, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { Loader2 } from "lucide-react";
// // import { verifyInviteCode } from "@/lib/actions/admin/invite-flow";
// // import { AcceptInviteForm } from "./AcceptInviteForm";

// // type FlowState =
// // 	| { status: "verifying" }
// // 	| { status: "ready"; email: string; roleLabel: string }
// // 	| { status: "error" };

// // export function AcceptInviteFlow({ code }: { code: string }) {
// // 	const router = useRouter();
// // 	// Guards against React Strict Mode's double-invoke in development,
// // 	// which would otherwise fire exchangeCodeForSession twice with the
// // 	// same single-use code and produce a false "expired" error on the
// // 	// very first real load.
// // 	const hasRun = useRef(false);
// // 	const [state, setState] = useState<FlowState>({ status: "verifying" });

// // 	useEffect(() => {
// // 		if (hasRun.current) return;
// // 		hasRun.current = true;

// // 		verifyInviteCode(code).then((result) => {
// // 			if (result.success && result.email && result.roleLabel) {
// // 				setState({
// // 					status: "ready",
// // 					email: result.email,
// // 					roleLabel: result.roleLabel,
// // 				});
// // 			} else {
// // 				setState({ status: "error" });
// // 				router.replace(
// // 					result.errorRedirect ?? "/admin/auth/login?error=invite_expired",
// // 				);
// // 			}
// // 		});
// // 	}, [code, router]);

// // 	if (state.status === "verifying") {
// // 		return (
// // 			<div className="flex flex-col items-center gap-3 py-8">
// // 				<Loader2 className="h-5 w-5 animate-spin text-white/50" />
// // 				<p className="text-xs text-white/50">Verifying your invite...</p>
// // 			</div>
// // 		);
// // 	}

// // 	if (state.status === "error") {
// // 		return (
// // 			<div className="py-8 text-center">
// // 				<p className="text-xs text-white/50">Redirecting…</p>
// // 			</div>
// // 		);
// // 	}

// // 	return <AcceptInviteForm email={state.email} roleLabel={state.roleLabel} />;
// // }



// // components/admin/auth/AcceptInviteFlow.tsx
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import { verifyInviteCode } from "@/lib/actions/admin/invite-flow";
// import { AcceptInviteForm } from "./AcceptInviteForm";

// type FlowState =
// 	| { status: "verifying" }
// 	| { status: "ready"; email: string; roleLabel: string }
// 	| { status: "error" };

// export function AcceptInviteFlow({ code }: { code: string }) {
// 	const router = useRouter();
// 	const hasRun = useRef(false);
// 	const [state, setState] = useState<FlowState>({ status: "verifying" });

// 	useEffect(() => {
// 		if (hasRun.current) return;
// 		hasRun.current = true;

// 		verifyInviteCode(code).then((result) => {
// 			if (result.success && result.email && result.roleLabel) {
// 				setState({ status: "ready", email: result.email, roleLabel: result.roleLabel });
// 			} else {
// 				setState({ status: "error" });
// 				router.replace(result.errorRedirect ?? "/admin/auth/login?error=invite_expired");
// 			}
// 		});
// 	}, [code, router]);

// 	if (state.status === "verifying") {
// 		return (
// 			<div className="flex flex-col items-center gap-3 py-8">
// 				<Loader2 className="h-5 w-5 animate-spin text-white/50" />
// 				<p className="text-xs text-white/50">Verifying your invite...</p>
// 			</div>
// 		);
// 	}

// 	if (state.status === "error") {
// 		return (
// 			<div className="py-8 text-center">
// 				<p className="text-xs text-white/50">Redirecting…</p>
// 			</div>
// 		);
// 	}

// 	return <AcceptInviteForm email={state.email} roleLabel={state.roleLabel} />;
// }

// components/admin/auth/AcceptInviteForm.tsx
"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { acceptInviteAction } from "@/lib/actions/admin/auth";
import { inputCls } from "@/components/admin/ui/EditorField";
import { passwordRequirements } from "@/lib/utils/password";
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

	const [firstName, setFirstName] = useState("");
	const [surname, setSurname] = useState("");
	const fullName = `${firstName.trim()} ${surname.trim()}`.trim();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const confirmTouched = confirmPassword.length > 0;
	const passwordsMatch = password === confirmPassword;

	return (
		<form action={formAction} className="space-y-5">
			<input type="hidden" name="fullName" value={fullName} />

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

			<div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
				<span className="text-xs text-white/50">Your role:</span>
				<span className="text-xs font-semibold text-gold-400">{roleLabel}</span>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div>
					<label
						htmlFor="firstName"
						className="mb-1.5 block text-sm font-medium text-white/80"
					>
						First Name <span className="text-red-400">*</span>
					</label>
					<input
						id="firstName"
						type="text"
						placeholder="First name"
						autoComplete="given-name"
						required
						minLength={2}
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className={inputCls}
					/>
				</div>
				<div>
					<label
						htmlFor="surname"
						className="mb-1.5 block text-sm font-medium text-white/80"
					>
						Surname <span className="text-red-400">*</span>
					</label>
					<input
						id="surname"
						type="text"
						placeholder="Surname"
						autoComplete="family-name"
						required
						minLength={2}
						value={surname}
						onChange={(e) => setSurname(e.target.value)}
						className={inputCls}
					/>
				</div>
			</div>

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
								<li
									key={req.id}
									className={`flex items-center gap-1.5 text-xs ${
										met ? "text-emerald-400" : "text-white/40"
									}`}
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
					<p
						className={`mt-1 text-xs ${
							passwordsMatch ? "text-emerald-400" : "text-red-400"
						}`}
					>
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
				Create Account &amp; Sign In
			</button>
		</form>
	);
}