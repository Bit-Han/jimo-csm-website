

// // app/(dashboard)/layout.tsx
// import { redirect } from "next/navigation";
// import { getAuthUser } from "@/lib/auth/server";
// // import { ToastProvider } from "@/components/ui/Toast";
// import { Sidebar } from "@/components/admin/Sidebar";
// import { Topbar } from "@/components/admin/Topbar";

// export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
//   // Server-side auth guard — middleware also handles this, belt-and-suspenders
//   const auth = await getAuthUser();
//   if (!auth) redirect("/login");

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       <Sidebar profile={auth.profile} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Topbar profile={auth.profile} />
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

import React from 'react'

const layout = () => {
  return (
    <div>layout</div>
  )
}

export default layout