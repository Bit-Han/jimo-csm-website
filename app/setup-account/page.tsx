// // src/app/(auth)/accept-invite/page.tsx
// "use client";

// import { useState, useTransition } from "react";
// import { completeProfile } from "@/actions/auth";
// import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

// export default function AcceptInvitePage() {
// 	const [showPassword, setShowPassword] = useState(false);
// 	const [errors, setErrors] = useState<Record<string, string[]>>({});
// 	const [isPending, startTransition] = useTransition();

// 	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
// 		e.preventDefault();
// 		setErrors({});
// 		const formData = new FormData(e.currentTarget);

// 		startTransition(async () => {
// 			const result = await completeProfile(formData);
// 			if (result?.error) setErrors(result.error);
// 		});
// 	}

// 	return (
// 		<div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4">
// 			<div className="w-full max-w-md">
// 				{/* Logo */}
// 				<div className="text-center mb-8">
// 					<div className="inline-flex items-center gap-2 mb-2">
// 						<div className="w-10 h-10 bg-[#C9922A] rounded-sm flex items-center justify-center">
// 							<span className="text-white font-bold text-xl">J</span>
// 						</div>
// 						<div className="text-left">
// 							<p className="text-[#C9922A] font-bold text-xl leading-none">
// 								JIMO
// 							</p>
// 							<p className="text-white text-xs leading-none">Command Centre</p>
// 						</div>
// 					</div>
// 				</div>

// 				<div className="bg-[#152236] rounded-xl p-8 border border-slate-700/50 shadow-2xl">
// 					{/* Header */}
// 					<div className="mb-6">
// 						<h1 className="text-white font-semibold text-xl">
// 							Complete your profile
// 						</h1>
// 						<p className="text-slate-400 text-sm mt-1">
// 							You have been invited to the Jimo Command Centre. Set up your
// 							account to get started.
// 						</p>
// 					</div>

// 					<form onSubmit={handleSubmit} className="space-y-5">
// 						{/* General error */}
// 						{errors.general && (
// 							<div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
// 								{errors.general[0]}
// 							</div>
// 						)}

// 						{/* Full name */}
// 						<div className="space-y-1.5">
// 							<label className="text-sm font-medium text-slate-300">
// 								Full name
// 							</label>
// 							<input
// 								name="fullName"
// 								type="text"
// 								required
// 								placeholder="Tolu Adebayo"
// 								className="w-full bg-[#0D1B2A] border border-slate-700 text-white placeholder:text-slate-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9922A]/50 focus:border-[#C9922A] transition-colors"
// 							/>
// 							{errors.fullName && (
// 								<p className="text-red-400 text-xs">{errors.fullName[0]}</p>
// 							)}
// 						</div>

// 						{/* Phone */}
// 						<div className="space-y-1.5">
// 							<label className="text-sm font-medium text-slate-300">
// 								Phone number
// 							</label>
// 							<input
// 								name="phone"
// 								type="tel"
// 								required
// 								placeholder="+234 803 123 4567"
// 								className="w-full bg-[#0D1B2A] border border-slate-700 text-white placeholder:text-slate-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9922A]/50 focus:border-[#C9922A] transition-colors"
// 							/>
// 							{errors.phone && (
// 								<p className="text-red-400 text-xs">{errors.phone[0]}</p>
// 							)}
// 						</div>

// 						{/* Password */}
// 						<div className="space-y-1.5">
// 							<label className="text-sm font-medium text-slate-300">
// 								Set your password
// 							</label>
// 							<div className="relative">
// 								<input
// 									name="password"
// 									type={showPassword ? "text" : "password"}
// 									required
// 									placeholder="Minimum 8 characters"
// 									className="w-full bg-[#0D1B2A] border border-slate-700 text-white placeholder:text-slate-600 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9922A]/50 focus:border-[#C9922A] transition-colors"
// 								/>
// 								<button
// 									type="button"
// 									onClick={() => setShowPassword((v) => !v)}
// 									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
// 									tabIndex={-1}
// 								>
// 									{showPassword ? (
// 										<EyeOff className="w-4 h-4" />
// 									) : (
// 										<Eye className="w-4 h-4" />
// 									)}
// 								</button>
// 							</div>
// 							{errors.password && (
// 								<p className="text-red-400 text-xs">{errors.password[0]}</p>
// 							)}
// 						</div>

// 						<button
// 							type="submit"
// 							disabled={isPending}
// 							className="w-full bg-[#C9922A] hover:bg-[#b5811f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors flex items-center justify-center gap-2 mt-2"
// 						>
// 							{isPending && <Loader2 className="w-4 h-4 animate-spin" />}
// 							{isPending ? "Setting up your account..." : "Complete setup"}
// 						</button>
// 					</form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }


// app/(auth)/setup-account/page.tsx
// Handles the invite link flow: exchange code → set name + password → go to dashboard
// "use client";

// import { useState, useEffect, useTransition } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { supabase } from "@/lib/auth/client";

// export default function SetupAccountPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [sessionReady, setSessionReady] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   // Exchange the invite code for a session as soon as the page loads
//   useEffect(() => {
//     const code = searchParams.get("code");
//     if (!code) {
//       setError("Invalid invite link. Please request a new invitation.");
//       return;
//     }
//     supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
//       if (error) setError("This invite link has expired. Please request a new one.");
//       else setSessionReady(true);
//     });
//   }, [searchParams]);

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (password.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }
//     startTransition(async () => {
//       const { error } = await supabase.auth.updateUser({
//         password,
//         data: { name },
//       });
//       if (error) { setError(error.message); return; }
//       // Update profile name via API
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         await fetch(`/api/users/${user.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name }),
//         });
//       }
//       router.push("/dashboard");
//     });
//   }

//   if (!sessionReady && !error) {
//     return (
//       <div className="bg-white rounded-xl shadow-xl p-8 text-center">
//         <div className="w-6 h-6 border-2 border-[#c8a84b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//         <p className="text-sm text-gray-500">Verifying your invite link…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-xl p-8">
//       <h1 className="text-xl font-semibold text-gray-900 mb-1">Set up your account</h1>
//       <p className="text-sm text-gray-500 mb-6">Enter your name and choose a password to get started.</p>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Your full name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             placeholder="Emeka Chidi"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b] focus:border-[#c8a84b] transition"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Choose a password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             minLength={8}
//             placeholder="Min. 8 characters"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#c8a84b] focus:border-[#c8a84b] transition"
//           />
//         </div>

//         {error && (
//           <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
//         )}

//         <button
//           type="submit"
//           disabled={isPending || !sessionReady}
//           className="w-full bg-[#c8a84b] hover:bg-[#b8962e] text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
//         >
//           {isPending ? "Setting up…" : "Complete Setup & Sign In"}
//         </button>
//       </form>
//     </div>
//   );
// }


import { SetupAccountForm } from "@/components/admin/SetupAccountForm";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { code?: string };
}

export default function SetupAccountPage({ searchParams }: PageProps) {
  const code = searchParams.code?.trim() ?? null;

  if (!code) {
    redirect("/login?error=invalid-invite");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <SetupAccountForm inviteCode={code} />
      </div>
    </main>
  );
}