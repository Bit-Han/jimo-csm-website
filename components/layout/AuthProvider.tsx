// src/components/layout/auth-provider.tsx
// DATA FLOW:
// 1. On mount, calls GET /api/auth/me
// 2. Populates Zustand auth store with user + permissions
// 3. All child components use useAuthStore() to read permissions
// 4. The can() helper gates UI elements based on role
// 

// src/components/layout/AuthProvider.tsx
// DATA FLOW:
//  1. Runs once on CMS mount (client-side)
//  2. Calls GET /api/auth/me → returns user + permissions array
//  3. Stores result in Zustand auth store
//  4. All pages/components call useAuthStore() to read user and can()
//  5. The can() helper is the single source of truth for UI gating
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const { data } = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, [setUser]);

  return <>{children}</>;
}