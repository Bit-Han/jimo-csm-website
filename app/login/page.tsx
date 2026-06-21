"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/auth/client";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LayoutGrid } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Untouched ──────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Incorrect email or password."
            : error.message
        );
        return;
      }
      router.push(redirectTo);
      router.refresh();
    });
  }
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen">

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-10 bg-[#0d1b2a] overflow-hidden">

        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&auto=format&fit=crop&q=80')",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a]/50 via-transparent to-[#0d1b2a]/80" />

        {/* Content sits above the overlays */}
        <div className="relative z-10 flex flex-col justify-between h-full">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#c8a84b] rounded-xl flex items-center justify-center shrink-0">
              <LayoutGrid size={20} className="text-[#0d1b2a]" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-widest leading-none">
                JIMO
              </span>
              <span className="text-white/50 text-[10px] font-medium tracking-[0.18em] uppercase mt-0.5">
                Command Centre
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-5">
            <h1 className="text-[#c8a84b] font-extrabold leading-[1.1] tracking-tight text-4xl xl:text-5xl">
              Master Your Real<br />Estate Ecosystem.
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Welcome to the central intelligence hub for high-stakes property
              management. Monitor leads, oversee campaigns, and optimize asset
              performance with surgical precision.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-px bg-white/30" />
              <span className="text-white/40 text-[10px] font-semibold tracking-[0.18em] uppercase">
                Asset Management Excellence
              </span>
            </div>
            <p className="text-white/30 text-[11px]">
              ©2026 Jimo Property Development Limited. All rights reserved.
            </p>
          </div>

        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16 bg-white lg:w-1/2 lg:px-16">

        {/* Mobile-only logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-10 h-10 bg-[#c8a84b] rounded-xl flex items-center justify-center">
            <LayoutGrid size={18} className="text-[#0d1b2a]" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col">
            <span className="text-[#0d1b2a] font-bold text-base tracking-widest leading-none">
              JIMO
            </span>
            <span className="text-[#0d1b2a]/50 text-[10px] font-medium tracking-[0.18em] uppercase mt-0.5">
              Command Centre
            </span>
          </div>
        </div>

        <div className="w-full max-w-[420px]">

          {/* Heading */}
          <h2 className="text-[#0d1b2a] text-3xl font-bold tracking-tight mb-1.5">
            Sign In
          </h2>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">
            Enter your credentials to access the command centre.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
              >
                Work Email
              </label>
              <div className="relative flex items-center">
                <Mail
                  size={15}
                  className="absolute left-4 text-slate-400 pointer-events-none"
                  strokeWidth={1.8}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@jimo.com"
                  disabled={isPending}
                  className="w-full h-[52px] bg-slate-100 border border-transparent rounded-xl pl-11 pr-4 text-sm text-[#0d1b2a] placeholder:text-slate-400 outline-none transition-all focus:border-[#c8a84b] focus:bg-amber-50/40 focus:ring-0 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={15}
                  className="absolute left-4 text-slate-400 pointer-events-none"
                  strokeWidth={1.8}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={isPending}
                  className="w-full h-[52px] bg-slate-100 border border-transparent rounded-xl pl-11 pr-12 text-sm text-[#0d1b2a] placeholder:text-slate-400 outline-none transition-all focus:border-[#c8a84b] focus:bg-amber-50/40 focus:ring-0 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword
                    ? <EyeOff size={16} strokeWidth={1.8} />
                    : <Eye size={16} strokeWidth={1.8} />
                  }
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-[#c8a84b] cursor-pointer"
                />
                <span className="text-sm text-slate-500">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#0d1b2a] hover:text-[#c8a84b] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-[54px] bg-[#0d1b2a] hover:bg-[#1a2e45] text-white text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isPending ? "Signing in…" : "Sign In"}
              {!isPending && <ArrowRight size={16} strokeWidth={2} />}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Contact admin */}
          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="mailto:admin@jimo.ng"
              className="font-bold text-[#0d1b2a] hover:text-[#c8a84b] transition-colors"
            >
              Contact your administrator
            </Link>
          </p>

        </div>

        {/* Secure access badge */}
        <div className="absolute bottom-7 right-9 hidden lg:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#c8a84b]" />
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-300">
            Secure Access
          </span>
        </div>

      </div>
    </div>
  );
}