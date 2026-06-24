// // // src/components/layout/TopBar.tsx
// // // DATA FLOW:
// // //  - Reads user from auth store for avatar + name display
// // //  - Search is client-side UI only (delegates to page-level handlers)
// // //  - Notifications badge reads from unread count in store (stubbed, extend as needed)
// // "use client";
// // import { useState } from "react";
// // import { Search, Bell, ChevronDown } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import { useAuthStore } from "@/lib/stores/auth-store";
// // import { Avatar } from "@/components/ui/Avatar";
// // import { MobileSidebar } from "@/components/admin/Sidebar";
// // import { ROLE_LABELS } from "@/lib/permissions";

// // interface TopBarProps {
// //   onSearch?: (query: string) => void;
// //   searchPlaceholder?: string;
// // }

// // export function TopBar({ onSearch, searchPlaceholder = "Search projects, content, leads..." }: TopBarProps) {
// //   const { user, logout } = useAuthStore();
// //   const [userMenuOpen, setUserMenuOpen] = useState(false);

// //   return (
// //     <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 md:px-6">
// //       {/* Left: mobile hamburger + search */}
// //       <div className="flex items-center gap-3 flex-1 min-w-0">
// //         {/* Mobile hamburger (inside TopBar on mobile) */}
// //         <MobileSidebar />

// //         {/* Search bar */}
// //         <div className="relative hidden sm:flex items-center max-w-xs w-full">
// //           <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
// //           <input
// //             type="search"
// //             placeholder={searchPlaceholder}
// //             onChange={(e) => onSearch?.(e.target.value)}
// //             className={cn(
// //               "w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-xs text-gray-700",
// //               "placeholder:text-gray-400",
// //               "focus:outline-none focus:border-jimo-gold focus:ring-1 focus:ring-jimo-gold/30 focus:bg-white",
// //               "transition-colors"
// //             )}
// //           />
// //           <kbd className="absolute right-2.5 text-[10px] text-gray-400 font-mono hidden lg:block">
// //             ⌘K
// //           </kbd>
// //         </div>
// //       </div>

// //       {/* Right: notifications + user menu */}
// //       <div className="flex items-center gap-2 shrink-0">
// //         {/* Notifications bell */}
// //         <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
// //           <Bell className="h-4 w-4" />
// //           {/* Unread badge */}
// //           <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-jimo-gold" />
// //         </button>

// //         {/* User menu */}
// //         <div className="relative">
// //           <button
// //             onClick={() => setUserMenuOpen((o) => !o)}
// //             className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
// //           >
// //             {/* Name + role (hidden on small screens) */}
// //             <div className="hidden sm:block text-right leading-none mr-1">
// //               <p className="text-[13px] font-semibold text-gray-900">{user?.name ?? "User"}</p>
// //               <p className="text-[11px] text-gray-500 mt-0.5">
// //                 {user ? ROLE_LABELS[user.role] : ""}
// //               </p>
// //             </div>
// //             <Avatar name={user?.name ?? "U"} src={user?.avatarUrl} size="sm" />
// //             <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
// //           </button>

// //           {/* User dropdown */}
// //           {userMenuOpen && (
// //             <>
// //               <div
// //                 className="fixed inset-0 z-10"
// //                 onClick={() => setUserMenuOpen(false)}
// //               />
// //               <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg animate-scale-in">
// //                 <div className="px-3 py-2 border-b border-gray-100">
// //                   <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
// //                   <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
// //                 </div>
// //                 <button
// //                   onClick={() => { setUserMenuOpen(false); logout(); }}
// //                   className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
// //                 >
// //                   Sign out
// //                 </button>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }




// // components/dashboard/topbar.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Bell, Search, ChevronDown, LogOut, User } from "lucide-react";
// import Link from "next/link";
// import { cn } from "@/lib/utils/helpers";
// import type { Profile } from "@/lib/types";
// import { supabase } from "@/lib/auth/client";
// import { useRouter } from "next/navigation";

// type TopProps = { profile: Profile };

// export function Topbar({ profile }: TopProps) {
//   const router = useRouter();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handler(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   async function handleSignOut() {
//     await supabase.auth.signOut();
//     router.push("/login");
//   }

//   const initials = profile.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 h-14 flex items-center gap-4">
//       {/* Search — offset on mobile for hamburger button */}
//       <div className="flex-1 max-w-md ml-10 lg:ml-0">
//         <div className="relative">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search projects, content, leads..."
//             className="w-full pl-9 pr-12 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#c8a84b]/30 focus:border-[#c8a84b] transition"
//           />
//           <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono hidden sm:block">
//             ⌘K
//           </kbd>
//         </div>
//       </div>

//       {/* Right side controls */}
//       <div className="flex items-center gap-3 ml-auto">
//         {/* Notifications */}
//         <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
//           <Bell size={16} className="text-gray-600" />
//           <span className="absolute top-1 right-1 w-4 h-4 bg-[#c8a84b] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
//             3
//           </span>
//         </button>

//         {/* User dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setDropdownOpen((v) => !v)}
//             className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
//           >
//             {/* Avatar */}
//             <div className="w-7 h-7 rounded-full bg-[#0f1f35] text-white text-xs font-bold flex items-center justify-center shrink-0">
//               {initials}
//             </div>
//             <div className="hidden sm:block text-left">
//               <p className="text-sm font-medium text-gray-800 leading-none">{profile.name}</p>
//               <p className="text-xs text-gray-500 capitalize leading-none mt-0.5">
//                 {profile.role.replace("_", " ")}
//               </p>
//             </div>
//             <ChevronDown size={13} className={cn("text-gray-500 transition-transform", dropdownOpen && "rotate-180")} />
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
//               <Link
//                 href="/dashboard/profile"
//                 onClick={() => setDropdownOpen(false)}
//                 className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
//               >
//                 <User size={14} />
//                 My Profile
//               </Link>
//               <hr className="my-1 border-gray-100" />
//               <button
//                 onClick={handleSignOut}
//                 className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
//               >
//                 <LogOut size={14} />
//                 Sign Out
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }