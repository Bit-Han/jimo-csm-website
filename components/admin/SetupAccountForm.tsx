"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth/client";

interface Props {
	inviteCode: string;
}

type SetupStatus = "exchanging" | "ready" | "error";

export function SetupAccountForm({ inviteCode }: Props) {
	const router = useRouter();
	const hasExchanged = useRef(false);

	const [status, setStatus] = useState<SetupStatus>("exchanging");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Runs exactly once on mount. The ref guard is the critical piece —
	// it prevents the double-call that burns the one-time token even if
	// React remounts the component in Strict Mode during development.
	useEffect(() => {
		if (hasExchanged.current) return;
		hasExchanged.current = true;

		supabase.auth
			.exchangeCodeForSession(inviteCode)
			.then(({ error: exchangeError }: { error: Error | null }) => {
				if (exchangeError) {
					setError(
						"This invite link has expired or has already been used. Please request a new one.",
					);
					setStatus("error");
				} else {
					// Strip the code from the URL immediately so it never sits in
					// browser history, server logs, or referrer headers.
					window.history.replaceState({}, "", "/setup-account");
					setStatus("ready");
				}
			});
	}, []);
	// Empty dependency array is intentional. inviteCode is stable — it comes
	// from a server component prop and never changes. The ref handles the
	// Strict Mode double-invocation concern.

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		const trimmedName = name.trim();

		if (!trimmedName) {
			setError("Please enter your full name.");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}

		setIsLoading(true);

		try {
			// Step 1: Update the Supabase auth user — password and display metadata.
			// updateUser returns the updated user directly, so we do not need a
			// second getUser() call. That was an unnecessary round trip.
			const { data: updateData, error: updateError } =
				await supabase.auth.updateUser({
					password,
					data: { name: trimmedName },
				});

			if (updateError) {
				setError(updateError.message);
				return;
			}

			const userId = updateData.user?.id;

			if (!userId) {
				setError("Session error. Please refresh and try again.");
				return;
			}

			// Step 2: Write to your profiles table via your API route.
			// This is kept separate from the auth update because your profiles
			// table may have additional columns or RLS policies that are separate
			// from Supabase auth metadata.
			const profileRes = await fetch(`/api/users/${userId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: trimmedName }),
			});

			if (!profileRes.ok) {
				// Auth password is already set at this point, so the account exists.
				// We surface a specific message so the user knows what to fix.
				setError(
					"Your password was saved, but we could not save your name. Please update it in your profile settings.",
				);
				return;
			}

			// Step 3: Redirect. Replace instead of push so the user cannot
			// hit the browser back button and land on the setup page again.
			router.replace("/admin");
		} catch {
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	// Loading state while the invite code is being exchanged
	if (status === "exchanging") {
		return (
			<div className="bg-white rounded-xl shadow-xl p-8 text-center">
				<div className="w-6 h-6 border-2 border-[#c8a84b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
				<p className="text-sm text-gray-500">Verifying your invite link…</p>
			</div>
		);
	}

	// Hard error state — invite link is invalid or already used
	if (status === "error") {
		return (
			<div className="bg-white rounded-xl shadow-xl p-8 text-center">
				<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
					{error}
				</p>
				<p className="mt-4 text-sm text-gray-500">
					Contact your administrator to request a new invitation.
				</p>
			</div>
		);
	}

	// Ready state — session established, show the setup form
	return (
		<div className="bg-white rounded-xl shadow-xl p-8">
			<h1 className="text-xl font-semibold text-gray-900 mb-1">
				Set up your account
			</h1>
			<p className="text-sm text-gray-500 mb-6">
				Enter your name and choose a password to get started.
			</p>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Your full name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						placeholder="Emeka Chidi"
						disabled={isLoading}
						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b] focus:border-[#c8a84b] transition disabled:opacity-60"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Choose a password
					</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={8}
						placeholder="Min. 8 characters"
						disabled={isLoading}
						className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b] focus:border-[#c8a84b] transition disabled:opacity-60"
					/>
				</div>

				{error && (
					<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
						{error}
					</p>
				)}

				<button
					type="submit"
					disabled={isLoading}
					className="w-full bg-[#c8a84b] hover:bg-[#b8962e] text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
				>
					{isLoading ? "Setting up…" : "Complete Setup & Sign In"}
				</button>
			</form>
		</div>
	);
}
