// // src/components/layout/Sidebar.tsx
// // DATA FLOW:
// //  1. Reads user.role from Zustand auth store
// //  2. Calls getNavItemsForRole(role) → only shows nav items the user has permission for
// //  3. Desktop: fixed left sidebar, collapses to 64px icon-only mode
// //  4. Mobile: hidden by default, slides in as an overlay when hamburger is tapped
// //  5. Active route highlighted via usePathname()
// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard, Building2, Layers, Users, FileText, ClipboardList,
//   Newspaper, Globe, ImageIcon, Search, BarChart2, UserCog, Settings,
//   Map, ChevronLeft, ChevronRight, LogOut, Menu, X,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useAuthStore } from "@/lib/stores/auth-store";
// import { getNavItemsForRole, ROLE_LABELS, type NavItem } from "@/lib/permissions";
// import { Avatar } from "@/components/ui/Avatar";
// import { getInitials } from "@/lib/utils";

// // Maps the icon string name stored in NAV_ITEMS to a Lucide component
// const ICON_MAP: Record<string, React.ElementType> = {
//   LayoutDashboard, Building2, Layers, Users, FileText,
//   ClipboardList, Newspaper, Globe, ImageIcon, Search,
//   BarChart2, UserCog, Settings, Map,
// };

// // ─── Single nav item ──────────────────────────────────────────────────────────
// function NavLink({
//   item,
//   collapsed,
//   onClick,
// }: {
//   item: NavItem;
//   collapsed: boolean;
//   onClick?: () => void;
// }) {
//   const pathname = usePathname();
//   // Mark as active if current path starts with the nav href
//   const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
//   const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;

//   return (
//     <Link
//       href={item.href}
//       onClick={onClick}
//       title={collapsed ? item.label : undefined}
//       className={cn(
//         "flex items-center gap-2.5 rounded-lg transition-all duration-150 text-[13.5px] font-medium",
//         collapsed ? "justify-center px-0 py-2.5 mx-1" : "px-3 py-2.5 mx-2",
//         isActive
//           ? "bg-[#c8a456]/15 text-[#c8a456] border border-[#c8a456]/25"
//           : "text-white/60 hover:text-white/90 hover:bg-white/[0.06]"
//       )}
//     >
//       <Icon className="h-[18px] w-[18px] shrink-0" />
//       {!collapsed && <span className="truncate leading-none">{item.label}</span>}
//     </Link>
//   );
// }

// // ─── Sidebar inner content (shared by desktop + mobile) ───────────────────────
// function SidebarInner({
//   collapsed,
//   onToggle,
//   onNavClick,
// }: {
//   collapsed: boolean;
//   onToggle?: () => void;
//   onNavClick?: () => void;
// }) {
//   const { user, logout } = useAuthStore();
//   // Role-filtered nav — non-admin users only see what their role permits
//   const navItems = user ? getNavItemsForRole(user.role) : [];

//   return (
//     <div className="flex h-full flex-col bg-jimo-navy overflow-hidden">
//       {/* Logo block */}
//       <div
//         className={cn(
//           "flex items-center shrink-0 border-b border-white/[0.07]",
//           collapsed ? "justify-center py-5 px-2" : "px-5 py-5"
//         )}
//       >
//         {collapsed ? (
//           <span className="text-xl font-black text-white">J</span>
//         ) : (
//           <div className="leading-none">
//             <div className="text-[22px] font-black tracking-tight text-white">JIMO</div>
//             <div className="text-[10px] font-medium tracking-[0.22em] text-[#c8a456] uppercase mt-0.5">
//               Command Centre
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Navigation — scrollable if needed */}
//       <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
//         {navItems.map((item) => (
//           <NavLink key={item.href} item={item} collapsed={collapsed} onClick={onNavClick} />
//         ))}
//       </nav>

//       {/* User info + logout footer */}
//       <div className={cn("shrink-0 border-t border-white/[0.07] p-3", collapsed && "flex justify-center")}>
//         {collapsed ? (
//           <button
//             onClick={logout}
//             title="Sign out"
//             className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
//           >
//             <LogOut className="h-[18px] w-[18px]" />
//           </button>
//         ) : (
//           <div className="flex items-center gap-2.5">
//             <Avatar name={user?.name ?? "U"} src={user?.avatarUrl} size="sm" />
//             <div className="flex-1 min-w-0">
//               <p className="text-[13px] font-semibold text-white truncate leading-none">{user?.name}</p>
//               <p className="text-[11px] text-white/45 mt-0.5 truncate">
//                 {user ? ROLE_LABELS[user.role] : ""}
//               </p>
//             </div>
//             <button
//               onClick={logout}
//               title="Sign out"
//               className="shrink-0 p-1.5 rounded-lg text-white/35 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
//             >
//               <LogOut className="h-4 w-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Collapse toggle button — positioned on the right edge (desktop only) */}
//       {onToggle && (
//         <button
//           onClick={onToggle}
//           className="absolute -right-3 top-[74px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-400 hover:text-gray-700 transition-colors"
//           title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {collapsed ? (
//             <ChevronRight className="h-3.5 w-3.5" />
//           ) : (
//             <ChevronLeft className="h-3.5 w-3.5" />
//           )}
//         </button>
//       )}
//     </div>
//   );
// }

// // ─── Desktop sidebar — sticky, collapsible ────────────────────────────────────
// export function DesktopSidebar() {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside
//       className={cn(
//         "hidden md:block relative shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out",
//         collapsed ? "w-16" : "w-[220px]"
//       )}
//     >
//       <SidebarInner
//         collapsed={collapsed}
//         onToggle={() => setCollapsed((c) => !c)}
//       />
//     </aside>
//   );
// }

// // ─── Mobile sidebar — full-screen overlay slide-in ───────────────────────────
// export function MobileSidebar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* Hamburger button — visible only on mobile */}
//       <button
//         onClick={() => setOpen(true)}
//         className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
//         aria-label="Open menu"
//       >
//         <Menu className="h-5 w-5" />
//       </button>

//       {/* Overlay */}
//       {open && (
//         <>
//           <div
//             className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
//             onClick={() => setOpen(false)}
//           />
//           <div className="fixed inset-y-0 left-0 z-50 w-[220px] animate-slide-in">
//             <SidebarInner
//               collapsed={false}
//               onNavClick={() => setOpen(false)}
//             />
//             <button
//               onClick={() => setOpen(false)}
//               className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         </>
//       )}
//     </>
//   );
// }




// components/dashboard/sidebar.tsx — full corrected file
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, FileText, Users, Download,
  ClipboardList, Newspaper, Globe, Search,
  TrendingUp, UserCog, Settings, Menu, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import type { Profile } from "@/lib/types";
import { can } from "@/lib/utils/permissions";

type NavItem = { label: string; href: string; icon: React.ElementType; permission: Parameters<typeof can>[1] };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",           href: "admin/dashboard",               icon: LayoutDashboard, permission: "view_dashboard"     },
  { label: "Projects",            href: "admin/projects",      icon: Building2,       permission: "view_projects"      },
  { label: "Landing Pages",       href: "admin/landing-pages", icon: Globe,           permission: "view_landing_pages" },
  { label: "Leads & Enquiries",   href: "admin/leads",         icon: Users,           permission: "view_leads"         },
  { label: "Brochures",           href: "admin/brochures",     icon: Download,        permission: "view_brochures"     },
  { label: "Forms",               href: "admin/forms",         icon: ClipboardList,   permission: "view_forms"         },
  { label: "News / Insights",     href: "admin/news",          icon: Newspaper,       permission: "view_articles"      },
  { label: "Company Pages",       href: "admin/company-pages", icon: FileText,        permission: "view_company_pages" },
  { label: "Media Library",       href: "admin/media",         icon: FileText,        permission: "view_media"         },
  { label: "SEO Centre",          href: "admin/seo",           icon: Search,          permission: "view_seo"           },
  { label: "Tracking & Analytics",href: "admin/tracking",      icon: TrendingUp,      permission: "view_tracking"      },
  { label: "Users & Roles",       href: "admin/users",         icon: UserCog,         permission: "view_users"         },
  { label: "Settings",            href: "admin/settings",      icon: Settings,        permission: "view_settings"      },
];

// ── Module-level components — defined ONCE, never recreated on render ────────
// This was the bug: these used to be declared inside Sidebar()'s function body.

type NavLinkProps = { item: NavItem; isActive: boolean; onNavigate: () => void };

function NavLink({ item, isActive, onNavigate }: NavLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive ? "bg-[#c8a84b]/15 text-[#c8a84b]" : "text-slate-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span>{item.label}</span>
      {isActive && <ChevronRight size={12} className="ml-auto opacity-60" />}
    </Link>
  );
}

type SidebarContentProps = { items: NavItem[]; pathname: string; onNavigate: () => void };

function SidebarContent({ items, pathname, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="w-8 h-8 bg-[#c8a84b] rounded-lg flex items-center justify-center">
            <span className="text-xs font-black text-[#0f1f35]">J</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">JIMO</p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">Command Centre</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center">
            <Building2 size={14} className="text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">Jimo Property</p>
            <p className="text-xs text-slate-400 truncate">Development Limited</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main exported component ───────────────────────────────────────────────────

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleItems = NAV_ITEMS.filter((item) => can(profile.role, item.permission));

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#0f1f35] h-screen sticky top-0 overflow-hidden">
        <SidebarContent items={visibleItems} pathname={pathname} onNavigate={() => {}} />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f1f35] rounded-lg text-white shadow-lg"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-[#0f1f35] h-full shadow-2xl flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
            <SidebarContent items={visibleItems} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}