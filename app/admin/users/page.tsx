// // src/app/(cms)/users/page.tsx
// // DATA FLOW:
// //  1. Fetches GET /api/users → all users with role + status
// //  2. Role summary cards at top (count per role)
// //  3. User table: name, email, role badge, status, permissions summary, last active, actions
// //  4. "Invite User" modal → POST /api/users → sends email via Resend
// //  5. Role change → PATCH /api/users/[id] { role } — guarded by users.edit_roles
// //  6. Deactivate → PATCH /api/users/[id] { status: "inactive" } — guarded by users.deactivate
// //  7. Permission Matrix table at the bottom (read-only, always visible)
// //  8. All actions guarded by permissions — non-admin users see read-only view
// "use client";
// import { useEffect, useState, useCallback } from "react";
// import { Download, UserPlus, MoreVertical } from "lucide-react";
// import { PageHeader } from "@/components/shared/PageHeader";
// import { Badge } from "@/components/ui/Badge";
// import { Button } from "@/components/ui/Button";
// import { Modal, ModalBody, ModalFooter } from "@/components/ui/Modal";
// import { Dropdown } from "@/components/ui/Dropdown";
// import { Avatar } from "@/components/ui/Avatar";
// import { useAuthStore } from "@/lib/stores/auth-store";
// import { useToast } from "@/components/ui/Toast";
// import { formatRelativeTime } from "@/lib/utils";
// import {
// 	ROLE_LABELS,
// 	ROLE_DESCRIPTIONS,
// 	type UserRole,
// } from "@/lib/permissions";

// interface CMSUser {
// 	id: string;
// 	name: string;
// 	email: string;
// 	role: UserRole;
// 	status: string;
// 	avatarUrl: string | null;
// 	lastActiveAt: string | null;
// 	createdAt: string;
// }

// // Role counts derived from user list
// type RoleCounts = Partial<Record<UserRole, number>>;

// const ROLE_COLORS: Record<UserRole, string> = {
// 	super_admin: "text-purple-600 bg-purple-50 border-purple-200",
// 	website_manager: "text-blue-600 bg-blue-50 border-blue-200",
// 	content_seo: "text-green-600 bg-green-50 border-green-200",
// 	sales_crm: "text-orange-600 bg-orange-50 border-orange-200",
// 	marketing_admin: "text-pink-600 bg-pink-50 border-pink-200",
// };

// const ROLE_OPTIONS: UserRole[] = [
// 	"super_admin",
// 	"website_manager",
// 	"content_seo",
// 	"sales_crm",
// 	"marketing_admin",
// ];

// // Permission matrix data — matches screenshot 18 exactly
// const PERMISSIONS = [
// 	{
// 		label: "Edit Pricing",
// 		super_admin: true,
// 		website_manager: true,
// 		content_seo: false,
// 		sales_crm: null,
// 		marketing: false,
// 	},
// 	{
// 		label: "Publish Brochure",
// 		super_admin: true,
// 		website_manager: true,
// 		content_seo: true,
// 		sales_crm: true,
// 		marketing: true,
// 	},
// 	{
// 		label: "View Leads",
// 		super_admin: true,
// 		website_manager: true,
// 		content_seo: false,
// 		sales_crm: true,
// 		marketing: false,
// 	},
// 	{
// 		label: "Edit SEO",
// 		super_admin: true,
// 		website_manager: true,
// 		content_seo: true,
// 		sales_crm: false,
// 		marketing: null,
// 	},
// 	{
// 		label: "Change Integrations",
// 		super_admin: true,
// 		website_manager: null,
// 		content_seo: false,
// 		sales_crm: false,
// 		marketing: false,
// 	},
// ];

// function PermCell({ val }: { val: boolean | null }) {
// 	if (val === true)
// 		return <span className="text-green-600 font-bold text-sm">✓</span>;
// 	if (val === false) return <span className="text-red-400 text-sm">✗</span>;
// 	return <span className="text-gray-300 text-sm">–</span>;
// }

// export default function UsersPage() {
// 	const { can, user: currentUser } = useAuthStore();
// 	const toast = useToast();

// 	const [users, setUsers] = useState<CMSUser[]>([]);
// 	const [loading, setLoading] = useState(true);
// 	const [inviteOpen, setInviteOpen] = useState(false);
// 	const [inviting, setInviting] = useState(false);
// 	const [inviteForm, setInviteForm] = useState({
// 		name: "",
// 		email: "",
// 		role: "sales_crm" as UserRole,
// 	});
// 	const [inviteError, setInviteError] = useState("");

// 	const load = useCallback(async () => {
// 		setLoading(true);
// 		const res = await fetch("/api/users");
// 		const json = await res.json();
// 		setUsers(json.data ?? []);
// 		setLoading(false);
// 	}, []);

// 	useEffect(() => {
// 		load();
// 	}, [load]);

// 	// Derive role counts for summary cards
// 	const roleCounts = users.reduce<RoleCounts>((acc, u) => {
// 		acc[u.role] = (acc[u.role] ?? 0) + 1;
// 		return acc;
// 	}, {});

// 	async function handleInvite() {
// 		setInviteError("");
// 		if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
// 			setInviteError("Name and email are required.");
// 			return;
// 		}
// 		setInviting(true);
// 		const res = await fetch("/api/users", {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify(inviteForm),
// 		});
// 		const json = await res.json();
// 		setInviting(false);
// 		if (res.ok) {
// 			toast.success(
// 				"Invitation sent",
// 				`${inviteForm.name} will receive an email to set up their account.`,
// 			);
// 			setInviteOpen(false);
// 			setInviteForm({ name: "", email: "", role: "sales_crm" });
// 			load();
// 		} else {
// 			setInviteError(json.error ?? "Failed to invite user.");
// 		}
// 	}

// 	async function updateUserRole(userId: string, role: UserRole) {
// 		const res = await fetch(`/api/users/${userId}`, {
// 			method: "PATCH",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ role }),
// 		});
// 		if (res.ok) {
// 			toast.success("Role updated");
// 			load();
// 		} else toast.error("Failed to update role");
// 	}

// 	async function deactivateUser(userId: string) {
// 		const res = await fetch(`/api/users/${userId}`, {
// 			method: "PATCH",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ status: "inactive" }),
// 		});
// 		if (res.ok) {
// 			toast.success("User deactivated");
// 			load();
// 		} else toast.error("Failed to deactivate user");
// 	}

// 	return (
// 		<div className="min-h-full">
// 			<PageHeader
// 				title="Users & Roles"
// 				description="Invite users, assign roles, and control who can edit pricing, leads, SEO, and settings."
// 				actions={
// 					<div className="flex items-center gap-2">
// 						{can("users.view") && (
// 							<Button variant="secondary" size="sm">
// 								<Download className="h-4 w-4" />
// 								Export Users
// 							</Button>
// 						)}
// 						{can("users.invite") && (
// 							<Button size="sm" onClick={() => setInviteOpen(true)}>
// 								<UserPlus className="h-4 w-4" />
// 								Invite User
// 							</Button>
// 						)}
// 					</div>
// 				}
// 			/>

// 			<div className="p-6 space-y-6">
// 				{/* Role summary cards */}
// 				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
// 					{ROLE_OPTIONS.map((role) => (
// 						<div
// 							key={role}
// 							className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
// 						>
// 							<span
// 								className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[role]}`}
// 							>
// 								{ROLE_LABELS[role]}
// 							</span>
// 							<p className="mt-2 text-2xl font-bold text-gray-900">
// 								{roleCounts[role] ?? 0}
// 							</p>
// 							<p className="mt-0.5 text-xs text-gray-500">
// 								{ROLE_DESCRIPTIONS[role]}
// 							</p>
// 						</div>
// 					))}
// 				</div>

// 				{/* Users table */}
// 				<div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
// 					<table className="w-full border-collapse text-sm">
// 						<thead>
// 							<tr className="border-b border-gray-200 bg-gray-50/60">
// 								{[
// 									"Name",
// 									"Email",
// 									"Role",
// 									"Status",
// 									"Permissions",
// 									"Last Active",
// 									"Actions",
// 								].map((h) => (
// 									<th
// 										key={h}
// 										className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
// 									>
// 										{h}
// 									</th>
// 								))}
// 							</tr>
// 						</thead>
// 						<tbody>
// 							{loading ? (
// 								<tr>
// 									<td
// 										colSpan={7}
// 										className="py-12 text-center text-gray-400 text-sm"
// 									>
// 										Loading…
// 									</td>
// 								</tr>
// 							) : (
// 								users.map((u) => (
// 									<tr
// 										key={u.id}
// 										className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
// 									>
// 										{/* Name + avatar */}
// 										<td className="px-4 py-3.5">
// 											<div className="flex items-center gap-2.5">
// 												<Avatar name={u.name} src={u.avatarUrl} size="sm" />
// 												<span className="font-semibold text-gray-900">
// 													{u.name}
// 												</span>
// 											</div>
// 										</td>
// 										{/* Email */}
// 										<td className="px-4 py-3.5 text-gray-600 text-xs">
// 											{u.email}
// 										</td>
// 										{/* Role badge */}
// 										<td className="px-4 py-3.5">
// 											<span
// 												className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[u.role]}`}
// 											>
// 												{ROLE_LABELS[u.role]}
// 											</span>
// 										</td>
// 										{/* Status */}
// 										<td className="px-4 py-3.5">
// 											<Badge
// 												variant={u.status === "active" ? "active" : "archived"}
// 											>
// 												{u.status.charAt(0).toUpperCase() + u.status.slice(1)}
// 											</Badge>
// 										</td>
// 										{/* Permission summary */}
// 										<td className="px-4 py-3.5 text-gray-500 text-xs">
// 											{ROLE_DESCRIPTIONS[u.role]}
// 										</td>
// 										{/* Last active */}
// 										<td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
// 											{u.lastActiveAt
// 												? formatRelativeTime(u.lastActiveAt)
// 												: "Never"}
// 										</td>
// 										{/* Actions */}
// 										<td className="px-4 py-3.5">
// 											{can("users.edit_roles") && u.id !== currentUser?.id && (
// 												<Dropdown
// 													trigger={
// 														<button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
// 															<MoreVertical className="h-4 w-4" />
// 														</button>
// 													}
// 													items={[
// 														...ROLE_OPTIONS.filter((r) => r !== u.role).map(
// 															(r) => ({
// 																label: `Change to ${ROLE_LABELS[r]}`,
// 																onClick: () => updateUserRole(u.id, r),
// 															}),
// 														),
// 														...(can("users.deactivate") && u.status === "active"
// 															? [
// 																	{
// 																		label: "Deactivate user",
// 																		onClick: () => deactivateUser(u.id),
// 																		danger: true,
// 																	},
// 																]
// 															: []),
// 													]}
// 												/>
// 											)}
// 										</td>
// 									</tr>
// 								))
// 							)}
// 						</tbody>
// 					</table>
// 				</div>

// 				{/* Permission Matrix */}
// 				<div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
// 					<div className="border-b border-gray-100 px-5 py-4">
// 						<h2 className="text-sm font-semibold text-gray-900">
// 							Permission Matrix Preview
// 						</h2>
// 					</div>
// 					<div className="overflow-x-auto">
// 						<table className="w-full border-collapse text-sm">
// 							<thead>
// 								<tr className="border-b border-gray-200 bg-gray-50/60">
// 									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
// 										Permission
// 									</th>
// 									{[
// 										"Super Admin",
// 										"Website Manager",
// 										"Content / SEO",
// 										"Sales / CRM",
// 										"Marketing",
// 									].map((r) => (
// 										<th
// 											key={r}
// 											className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
// 										>
// 											{r}
// 										</th>
// 									))}
// 								</tr>
// 							</thead>
// 							<tbody>
// 								{PERMISSIONS.map((p, i) => (
// 									<tr key={i} className="border-b border-gray-100">
// 										<td className="px-4 py-3 text-sm text-gray-700 font-medium">
// 											{p.label}
// 										</td>
// 										<td className="px-4 py-3 text-center">
// 											<PermCell val={p.super_admin} />
// 										</td>
// 										<td className="px-4 py-3 text-center">
// 											<PermCell val={p.website_manager} />
// 										</td>
// 										<td className="px-4 py-3 text-center">
// 											<PermCell val={p.content_seo} />
// 										</td>
// 										<td className="px-4 py-3 text-center">
// 											<PermCell val={p.sales_crm} />
// 										</td>
// 										<td className="px-4 py-3 text-center">
// 											<PermCell val={p.marketing} />
// 										</td>
// 									</tr>
// 								))}
// 							</tbody>
// 						</table>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Invite User Modal */}
// 			<Modal
// 				isOpen={inviteOpen}
// 				onClose={() => setInviteOpen(false)}
// 				title="Invite User"
// 				description="Send an invitation email to add a new team member."
// 			>
// 				<ModalBody className="space-y-4">
// 					{inviteError && (
// 						<div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600">
// 							{inviteError}
// 						</div>
// 					)}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Full Name
// 						</label>
// 						<input
// 							type="text"
// 							value={inviteForm.name}
// 							onChange={(e) =>
// 								setInviteForm((f) => ({ ...f, name: e.target.value }))
// 							}
// 							placeholder="e.g. Amara Okafor"
// 							className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jimo-gold/40 focus:border-jimo-gold"
// 						/>
// 					</div>
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Email Address
// 						</label>
// 						<input
// 							type="email"
// 							value={inviteForm.email}
// 							onChange={(e) =>
// 								setInviteForm((f) => ({ ...f, email: e.target.value }))
// 							}
// 							placeholder="amara@jimo.ng"
// 							className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jimo-gold/40 focus:border-jimo-gold"
// 						/>
// 					</div>
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Role
// 						</label>
// 						<select
// 							value={inviteForm.role}
// 							onChange={(e) =>
// 								setInviteForm((f) => ({
// 									...f,
// 									role: e.target.value as UserRole,
// 								}))
// 							}
// 							className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jimo-gold/40 focus:border-jimo-gold appearance-none"
// 						>
// 							{ROLE_OPTIONS.map((r) => (
// 								<option key={r} value={r}>
// 									{ROLE_LABELS[r]}
// 								</option>
// 							))}
// 						</select>
// 						<p className="mt-1 text-xs text-gray-500">
// 							{ROLE_DESCRIPTIONS[inviteForm.role]}
// 						</p>
// 					</div>
// 				</ModalBody>
// 				<ModalFooter>
// 					<Button
// 						variant="secondary"
// 						size="sm"
// 						onClick={() => setInviteOpen(false)}
// 					>
// 						Cancel
// 					</Button>
// 					<Button size="sm" onClick={handleInvite} loading={inviting}>
// 						Send Invitation
// 					</Button>
// 				</ModalFooter>
// 			</Modal>
// 		</div>
// 	);
// }



// app/(dashboard)/users/page.tsx
"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/use-users";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelativeTime } from "@/lib/utils/helpers";
import { UserPlus, Mail, Shield, Trash2 } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  website_manager: "Website Manager",
  content_seo: "Content / SEO",
  sales_crm: "Sales / CRM",
  marketing_admin: "Marketing Admin",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  website_manager: "bg-blue-100 text-blue-700",
  content_seo: "bg-green-100 text-green-700",
  sales_crm: "bg-orange-100 text-orange-700",
  marketing_admin: "bg-pink-100 text-pink-700",
};

export default function UsersPage() {
  const { data, loading, error, inviteUser, updateUserRole, removeUser } = useUsers();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("sales_crm");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteError(null);
    const { success, error } = await inviteUser(inviteEmail, inviteRole);
    if (success) {
      setInviteSuccess(true);
      setInviteEmail("");
      setTimeout(() => { setInviteOpen(false); setInviteSuccess(false); }, 2000);
    } else {
      setInviteError(error ?? "Failed to send invite.");
    }
    setInviting(false);
  }

  if (loading) return <div className="text-sm text-gray-500 p-8">Loading users…</div>;
  if (error) return <div className="text-sm text-red-600 p-8">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Roles</h1>
          <p className="text-sm text-gray-500">Invite users, assign roles, and control access permissions.</p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 bg-[#c8a84b] hover:bg-[#b8962e] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <UserPlus size={15} /> Invite User
        </button>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {data.roleStats.map((stat) => (
          <div key={stat.role} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${ROLE_COLORS[stat.role] ?? "bg-gray-100 text-gray-600"}`}>
              {ROLE_LABELS[stat.role] ?? stat.role}
            </span>
            <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {stat.role === "super_admin" ? "Full access to all modules." : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "Email", "Role", "Status", "Permission Summary", "Last Active", ""].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {user.role === "super_admin" ? "All modules" :
                   user.role === "website_manager" ? "Projects, Pages, Media" :
                   user.role === "content_seo" ? "Content, SEO Centre" :
                   user.role === "sales_crm" ? "Leads, Enquiries" :
                   "Campaigns and assets."}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {user.lastActiveAt ? formatRelativeTime(user.lastActiveAt) : "Never"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => removeUser(user.id)}
                    className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                    title="Deactivate user"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Invite a team member</h2>
            <p className="text-sm text-gray-500 mb-4">They will receive an email to set up their account.</p>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@jimo.ng"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="relative">
                  <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#c8a84b]/30"
                  >
                    <option value="website_manager">Website Manager</option>
                    <option value="content_seo">Content / SEO</option>
                    <option value="sales_crm">Sales / CRM</option>
                    <option value="marketing_admin">Marketing Admin</option>
                  </select>
                </div>
              </div>

              {inviteError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{inviteError}</p>
              )}
              {inviteSuccess && (
                <p className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  Invitation sent successfully!
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setInviteOpen(false)}
                  className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={inviting || inviteSuccess}
                  className="flex-1 py-2.5 text-sm bg-[#c8a84b] text-white rounded-lg hover:bg-[#b8962e] transition font-semibold disabled:opacity-60">
                  {inviting ? "Sending…" : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}