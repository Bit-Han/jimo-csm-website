// hooks/use-auth.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/auth/client";
import type { User } from "@supabase/supabase-js";
import { apiFetch } from "./use-api-fetch";
import type { Profile } from "@/lib/types";

type AuthState = {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
};

/**
 * Returns the currently authenticated Supabase user + CMS profile.
 * Used in layout and any component that needs to know who is logged in.
 */
export function useAuth(): AuthState & {
	signOut: () => Promise<void>;
} {
	const [state, setState] = useState<AuthState>({
		user: null,
		profile: null,
		loading: true,
	});

	useEffect(() => {
		// Get initial session
		supabase.auth.getUser().then(async ({ data: { user } }) => {
			if (user) {
				const result = await apiFetch<Profile>(`/api/users/${user.id}`);
				setState({
					user,
					profile: result.success ? result.data : null,
					loading: false,
				});
			} else {
				setState({ user: null, profile: null, loading: false });
			}
		});

		// Listen for auth state changes (token refresh, sign out)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				const result = await apiFetch<Profile>(`/api/users/${session.user.id}`);
				setState({
					user: session.user,
					profile: result.success ? result.data : null,
					loading: false,
				});
			} else {
				setState({ user: null, profile: null, loading: false });
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = async () => {
		await supabase.auth.signOut();
		window.location.href = "/login";
	};

	return { ...state, signOut };
}
