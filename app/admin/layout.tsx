// src/app/(cms)/layout.tsx
// DATA FLOW:
//  1. Server component — verifies session server-side via requireAuth()
//  2. If no session → middleware already redirected to /login
//  3. Wraps all CMS pages with: ToastProvider → AuthProvider → Sidebar + main content area
//  4. Desktop: sidebar on left, main content on right (flex row)
//  5. Mobile: sidebar hidden, TopBar shows hamburger to open mobile drawer
// import { requireAuth } from "@/lib/auth";
// import { Inter } from "next/font/google";
// import { AuthProvider } from "@/components/layout/AuthProvider";
// import { DesktopSidebar } from "@/components/admin/Sidebar";
// import { TopBar } from "@/components/admin/TopBar";
// import { ToastProvider } from "@/components/ui/Toast";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// export default async function CMSLayout({ children }: { children: React.ReactNode }) {
//   // Server-side auth check — redirects to /login if not authenticated
//   await requireAuth();

//   return (
//     <div className={`${inter.variable} font-sans`}>
//       <ToastProvider>
//         <AuthProvider>
//           <div className="flex min-h-screen bg-gray-50">
//             {/* Desktop sidebar — sticky, always visible on md+ */}
//             <DesktopSidebar />

//             {/* Main content area */}
//             <div className="flex flex-1 flex-col min-w-0">
//               {/* Top bar with mobile hamburger, search, notifications, user */}
//               <TopBar />

//               {/* Page content */}
//               <main className="flex-1 overflow-auto">
//                 {children}
//               </main>
//             </div>
//           </div>
//         </AuthProvider>
//       </ToastProvider>
//     </div>
//   );
// }


// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/server";
// import { ToastProvider } from "@/components/ui/Toast";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth guard — middleware also handles this, belt-and-suspenders
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar profile={auth.profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar profile={auth.profile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}