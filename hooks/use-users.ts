// // hooks/use-users.ts
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { apiFetch } from "./use-api-fetch";
// import type { Profile } from "@/lib/types";

// type UsersData = {
// 	users: Profile[];
// 	roleStats: Array<{ role: string; count: number }>;
// 	pendingInvites: Array<{
// 		id: string;
// 		email: string;
// 		role: string;
// 		createdAt: string;
// 		inviter?: { name: string };
// 	}>;
// };

// export function useUsers() {
// 	const [data, setData] = useState<UsersData | null>(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	const fetchUsers = useCallback(async () => {
// 		setLoading(true);
// 		const result = await apiFetch<UsersData>("/api/users");
// 		if (result.success) {
// 			setData(result.data);
// 			setError(null);
// 		} else setError(result.error);
// 		setLoading(false);
// 	}, []);

// 	useEffect(() => {
// 		fetchUsers();
// 	}, [fetchUsers]);

// 	const inviteUser = useCallback(
// 		async (
// 			email: string,
// 			role: string,
// 		): Promise<{ success: boolean; error?: string }> => {
// 			const result = await apiFetch("/api/users/invite", {
// 				method: "POST",
// 				body: JSON.stringify({ email, role }),
// 			});
// 			if (result.success) await fetchUsers();
// 			return result.success
// 				? { success: true }
// 				: {
// 						success: false,
// 						error: (result as { success: false; error: string }).error,
// 					};
// 		},
// 		[fetchUsers],
// 	);

// 	const updateUserRole = useCallback(
// 		async (id: string, role: string) => {
// 			const result = await apiFetch(`/api/users/${id}`, {
// 				method: "PUT",
// 				body: JSON.stringify({ role }),
// 			});
// 			if (result.success) await fetchUsers();
// 			return result.success;
// 		},
// 		[fetchUsers],
// 	);

// 	const removeUser = useCallback(
// 		async (id: string) => {
// 			const result = await apiFetch(`/api/users/${id}`, { method: "DELETE" });
// 			if (result.success) await fetchUsers();
// 			return result.success;
// 		},
// 		[fetchUsers],
// 	);

// 	return {
// 		data,
// 		loading,
// 		error,
// 		refetch: fetchUsers,
// 		inviteUser,
// 		updateUserRole,
// 		removeUser,
// 	};
// }



// hooks/use-users.ts — uses useFetch since /api/users returns a composite object
"use client";

import { useCallback } from "react";
import { useFetch } from "./core/use-fetch";
import { apiFetch } from "./use-api-fetch";
import type { Profile } from "@/lib/types";

type UsersData = {
  users: Profile[];
  roleStats: Array<{ role: string; count: number }>;
  pendingInvites: Array<{ id: string; email: string; role: string; createdAt: string; inviter?: { name: string } }>;
};

export function useUsers() {
  const { data, loading, error, refetch } = useFetch<UsersData>("/api/users");

  const inviteUser = useCallback(
    async (email: string, role: string) => {
      const result = await apiFetch("/api/users/invite", { method: "POST", body: JSON.stringify({ email, role }) });
      if (result.success) await refetch();
      return result.success ? { success: true } : { success: false, error: (result as { success: false; error: string }).error };
    },
    [refetch]
  );

  const updateUserRole = useCallback(
    async (id: string, role: string) => {
      const result = await apiFetch(`/api/users/${id}`, { method: "PUT", body: JSON.stringify({ role }) });
      if (result.success) await refetch();
      return result.success;
    },
    [refetch]
  );

  const removeUser = useCallback(
    async (id: string) => {
      const result = await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      if (result.success) await refetch();
      return result.success;
    },
    [refetch]
  );

  return { data, loading, error, refetch, inviteUser, updateUserRole, removeUser };
}