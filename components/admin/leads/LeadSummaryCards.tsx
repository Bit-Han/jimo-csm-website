// import { CheckCircle2, Users, Wifi, WifiOff } from "lucide-react";
// import type { LeadSummaryStats } from "@/lib/types/admin/lead";

// export function LeadSummaryCards({ stats }: { stats: LeadSummaryStats }) {
// 	return (
// 		<div className="grid gap-4 sm:grid-cols-3">
// 			<div className="rounded-2xl border border-stone-200 bg-white p-6">
// 				<div className="flex items-center gap-3">
// 					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
// 						<Users className="h-5 w-5 text-orange-500" />
// 					</span>
// 					<p className="text-sm font-medium text-stone-500">
// 						New Leads Needing Follow-up
// 					</p>
// 				</div>
// 				<p className="mt-3 text-3xl font-bold text-orange-500">
// 					{stats.newLeadsCount}
// 				</p>
// 				<p className="mt-1 text-xs text-stone-500">{stats.newLeadsNote}</p>
// 			</div>

// 			<div className="rounded-2xl border border-stone-200 bg-white p-6">
// 				<div className="flex items-center gap-3">
// 					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
// 						<CheckCircle2 className="h-5 w-5 text-emerald-500" />
// 					</span>
// 					<p className="text-sm font-medium text-stone-500">Qualified Leads</p>
// 				</div>
// 				<p className="mt-3 text-3xl font-bold text-emerald-600">
// 					{stats.qualifiedLeadsCount}
// 				</p>
// 				<p className="mt-1 text-xs text-stone-500">
// 					{stats.qualifiedLeadsChange}
// 				</p>
// 			</div>

// 			<div className="rounded-2xl border border-stone-200 bg-white p-6">
// 				<div className="flex items-center gap-3">
// 					<span
// 						className={`flex h-10 w-10 items-center justify-center rounded-xl ${stats.crmConnected ? "bg-emerald-50" : "bg-stone-100"}`}
// 					>
// 						{stats.crmConnected ? (
// 							<Wifi className="h-5 w-5 text-emerald-500" />
// 						) : (
// 							<WifiOff className="h-5 w-5 text-stone-400" />
// 						)}
// 					</span>
// 					<p className="text-sm font-medium text-stone-500">CRM Sync Status</p>
// 				</div>
// 				<p
// 					className={`mt-3 text-xl font-bold ${stats.crmConnected ? "text-emerald-600" : "text-stone-500"}`}
// 				>
// 					{stats.crmConnected ? "Connected" : "Not Connected"}
// 				</p>
// 				<p className="mt-1 text-xs text-stone-500">{stats.crmSyncNote}</p>
// 			</div>
// 		</div>
// 	);
// }

import { CheckCircle2, Users, Wifi, WifiOff } from "lucide-react";
import type { LeadSummaryStats } from "@/lib/types/admin/lead";

export function LeadSummaryCards({ stats }: { stats: LeadSummaryStats }) {
	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<div className="flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
						<Users className="h-5 w-5 text-orange-500" />
					</span>
					<p className="text-sm font-medium text-stone-500">
						New Leads Needing Follow-up
					</p>
				</div>
				<p className="mt-3 text-3xl font-bold text-orange-500">
					{stats.newLeadsCount}
				</p>
				<p className="mt-1 text-xs text-stone-500">{stats.newLeadsNote}</p>
			</div>

			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<div className="flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
						<CheckCircle2 className="h-5 w-5 text-emerald-500" />
					</span>
					<p className="text-sm font-medium text-stone-500">Qualified Leads</p>
				</div>
				<p className="mt-3 text-3xl font-bold text-emerald-600">
					{stats.qualifiedLeadsCount}
				</p>
				<p className="mt-1 text-xs text-stone-500">
					{stats.qualifiedLeadsChange}
				</p>
			</div>

			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<div className="flex items-center gap-3">
					<span
						className={`flex h-10 w-10 items-center justify-center rounded-xl ${stats.crmConnected ? "bg-emerald-50" : "bg-stone-100"}`}
					>
						{stats.crmConnected ? (
							<Wifi className="h-5 w-5 text-emerald-500" />
						) : (
							<WifiOff className="h-5 w-5 text-stone-400" />
						)}
					</span>
					<p className="text-sm font-medium text-stone-500">CRM Sync Status</p>
				</div>
				<p
					className={`mt-3 text-xl font-bold ${stats.crmConnected ? "text-emerald-600" : "text-stone-500"}`}
				>
					{stats.crmConnected ? "Connected" : "Not Connected"}
				</p>
				<p className="mt-1 text-xs text-stone-500">{stats.crmSyncNote}</p>
			</div>
		</div>
	);
}