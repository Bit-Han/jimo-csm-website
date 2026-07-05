"use client";

import { useTransition } from "react";
import { Download, Loader2, RefreshCw, UserCheck } from "lucide-react";
import { syncCrm } from "@/lib/actions/leads";

export function LeadsHeaderActions() {
	const [isPending, startTransition] = useTransition();

	function handleSyncCrm() {
		startTransition(async () => {
			const result = await syncCrm();
			if (!result.success) {
				alert(result.message);
			}
		});
	}

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50"
			>
				<Download className="h-4 w-4" />
				Export Leads
				<span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">
					TODO
				</span>
			</button>

			<button
				type="button"
				className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-stone-50"
			>
				<UserCheck className="h-4 w-4" />
				Assign Leads
				<span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">
					TODO
				</span>
			</button>

			<button
				type="button"
				onClick={handleSyncCrm}
				disabled={isPending}
				className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
			>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<RefreshCw className="h-4 w-4" />
				)}
				Sync CRM
			</button>
		</div>
	);
}
