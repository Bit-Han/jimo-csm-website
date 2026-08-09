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
// 	// Guards against React Strict Mode's double-invoke in development,
// 	// which would otherwise fire exchangeCodeForSession twice with the
// 	// same single-use code and produce a false "expired" error on the
// 	// very first real load.
// 	const hasRun = useRef(false);
// 	const [state, setState] = useState<FlowState>({ status: "verifying" });

// 	useEffect(() => {
// 		if (hasRun.current) return;
// 		hasRun.current = true;

// 		verifyInviteCode(code).then((result) => {
// 			if (result.success && result.email && result.roleLabel) {
// 				setState({
// 					status: "ready",
// 					email: result.email,
// 					roleLabel: result.roleLabel,
// 				});
// 			} else {
// 				setState({ status: "error" });
// 				router.replace(
// 					result.errorRedirect ?? "/admin/auth/login?error=invite_expired",
// 				);
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



// components/admin/auth/AcceptInviteFlow.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { verifyInviteCode } from "@/lib/actions/admin/invite-flow";
import { AcceptInviteForm } from "./AcceptInviteForm";

type FlowState =
	| { status: "verifying" }
	| { status: "ready"; email: string; roleLabel: string }
	| { status: "error" };

export function AcceptInviteFlow({ code }: { code: string }) {
	const router = useRouter();
	const hasRun = useRef(false);
	const [state, setState] = useState<FlowState>({ status: "verifying" });

	useEffect(() => {
		if (hasRun.current) return;
		hasRun.current = true;

		verifyInviteCode(code).then((result) => {
			if (result.success && result.email && result.roleLabel) {
				setState({ status: "ready", email: result.email, roleLabel: result.roleLabel });
			} else {
				setState({ status: "error" });
				router.replace(result.errorRedirect ?? "/admin/auth/login?error=invite_expired");
			}
		});
	}, [code, router]);

	if (state.status === "verifying") {
		return (
			<div className="flex flex-col items-center gap-3 py-8">
				<Loader2 className="h-5 w-5 animate-spin text-white/50" />
				<p className="text-xs text-white/50">Verifying your invite...</p>
			</div>
		);
	}

	if (state.status === "error") {
		return (
			<div className="py-8 text-center">
				<p className="text-xs text-white/50">Redirecting…</p>
			</div>
		);
	}

	return <AcceptInviteForm email={state.email} roleLabel={state.roleLabel} />;
}