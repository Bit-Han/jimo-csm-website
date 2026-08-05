// //@component/admin/leads/LeadsHeaderActions.tsx
"use client";

import { useRef, useState, useTransition } from "react";
import {
	ChevronDown,
	Download,
	Loader2,
	RefreshCw,
	UserCheck,
	WifiOff,
	X,
} from "lucide-react";
import {
	assignLeads,
	exportLeadsCsv,
	pullLeadsFromBrevo,
	pushLeadsToBrevo,
} from "@/lib/actions/admin/leads";
import type { AssignableAdmin, LeadFilters } from "@/lib/types/admin/lead";

export interface LeadsHeaderActionsProps {
	selectedIds: Set<string>;
	admins: AssignableAdmin[];
	currentFilters: LeadFilters;
	onAssigned: () => void;
}

export function LeadsHeaderActions({
	selectedIds,
	admins,
	currentFilters,
	onAssigned,
}: LeadsHeaderActionsProps) {
	const [isPending, startTransition] = useTransition();
	const [assignOpen, setAssignOpen] = useState(false);
	const [brevoOpen, setBrevoOpen] = useState(false);
	const [brevoNotConfigured, setBrevoNotConfigured] = useState(false);
	const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
	const lockRef = useRef(false);

	function showToast(msg: string, ok = true) {
		setToast({ msg, ok });
		setTimeout(() => setToast(null), 5000);
	}

	// Ref-based lock prevents double-click from firing the same action twice
	// before React's isPending state has a chance to re-render the button.
	function withLock(fn: () => void) {
		if (lockRef.current) return;
		lockRef.current = true;
		fn();
		setTimeout(() => {
			lockRef.current = false;
		}, 800);
	}

	function handleExport() {
		withLock(() => {
			startTransition(async () => {
				const result = await exportLeadsCsv(currentFilters);
				if (!result.success || !result.csv) {
					showToast(result.message, false);
					return;
				}
				const blob = new Blob([result.csv], {
					type: "text/csv;charset=utf-8;",
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
				showToast(result.message);
			});
		});
	}

	function handleAssign(adminId: string) {
		if (selectedIds.size === 0) return;
		withLock(() => {
			setAssignOpen(false);
			startTransition(async () => {
				const result = await assignLeads(Array.from(selectedIds), adminId);
				showToast(result.message, result.success);
				if (result.success) onAssigned();
			});
		});
	}

	function handleBrevoAction(action: "push" | "pull") {
		withLock(() => {
			setBrevoOpen(false);
			startTransition(async () => {
				const result = await (action === "push"
					? pushLeadsToBrevo()
					: pullLeadsFromBrevo());
				if (!result.success && result.errorCode === "brevo_not_configured") {
					setBrevoNotConfigured(true);
					return;
				}
				showToast(result.message, result.success);
			});
		});
	}

	return (
		<>
			{/* Toast */}
			{toast ? (
				<div
					className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-5 py-4 shadow-xl ${
						toast.ok
							? "border-emerald-200 bg-emerald-50 text-emerald-700"
							: "border-red-200 bg-red-50 text-red-700"
					}`}
				>
					<p className="text-sm font-medium">{toast.msg}</p>
				</div>
			) : null}

			{/* Brevo not configured modal */}
			{brevoNotConfigured ? (
				<>
					<button
						type="button"
						onClick={() => setBrevoNotConfigured(false)}
						className="fixed inset-0 z-40 bg-black/50"
						aria-label="Close"
					/>
					<div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
						<div className="flex items-start justify-between">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
								<WifiOff className="h-5 w-5 text-amber-500" />
							</span>
							<button
								type="button"
								onClick={() => setBrevoNotConfigured(false)}
								className="text-stone-400 hover:text-ink-950"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<h3 className="mt-4 text-base font-bold text-ink-950">
							Brevo is not connected yet
						</h3>
						<p className="mt-2 text-sm leading-relaxed text-stone-500">
							To sync leads with Brevo for email campaigns, add your Brevo API
							key to your environment variables:
						</p>
						<code className="mt-3 block rounded-lg bg-stone-100 px-4 py-3 font-mono text-sm text-stone-700">
							BREVO_API_KEY=your_api_key_here
						</code>
						<p className="mt-3 text-xs text-stone-400">
							Get your API key from Settings → API Keys in your Brevo account
							dashboard, then redeploy to Vercel.
						</p>
						<button
							type="button"
							onClick={() => setBrevoNotConfigured(false)}
							className="mt-5 w-full rounded-xl border border-stone-200 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50"
						>
							Got it
						</button>
					</div>
				</>
			) : null}

			<div className="flex flex-wrap items-center justify-end gap-2">
				{/* Export CSV */}
				<button
					type="button"
					onClick={handleExport}
					disabled={isPending}
					className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
				>
					{isPending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Download className="h-4 w-4" />
					)}
					Export CSV
				</button>

				{/* Assign leads */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setAssignOpen((o) => !o)}
						disabled={selectedIds.size === 0 || isPending}
						className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<UserCheck className="h-4 w-4" />
						{selectedIds.size > 0
							? `Assign (${selectedIds.size})`
							: "Assign Leads"}
						<ChevronDown className="h-3.5 w-3.5" />
					</button>
					{assignOpen && selectedIds.size > 0 ? (
						<>
							<button
								type="button"
								onClick={() => setAssignOpen(false)}
								className="fixed inset-0 z-10"
								aria-label="Close"
							/>
							<div className="absolute right-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
								{admins.length === 0 ? (
									<p className="px-4 py-3 text-xs text-stone-400">
										No active admins found.
									</p>
								) : (
									admins.map((admin) => (
										<button
											key={admin.id}
											type="button"
											onClick={() => handleAssign(admin.id)}
											className="flex w-full px-4 py-2.5 text-left text-sm text-ink-950 hover:bg-stone-50"
										>
											{admin.fullName}
										</button>
									))
								)}
							</div>
						</>
					) : null}
				</div>

				{/* Brevo sync dropdown */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setBrevoOpen((o) => !o)}
						disabled={isPending}
						className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="h-4 w-4" />
						)}
						Brevo Sync
						<ChevronDown className="h-3.5 w-3.5" />
					</button>
					{brevoOpen ? (
						<>
							<button
								type="button"
								onClick={() => setBrevoOpen(false)}
								className="fixed inset-0 z-10"
								aria-label="Close"
							/>
							<div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
								<button
									type="button"
									onClick={() => handleBrevoAction("push")}
									className="flex w-full flex-col items-start px-4 py-3 hover:bg-stone-50"
								>
									<p className="text-sm font-semibold text-ink-950">
										Sync to Brevo
									</p>
									<p className="mt-0.5 text-xs text-stone-500">
										Push new leads to Brevo as contacts
									</p>
								</button>
								<button
									type="button"
									onClick={() => handleBrevoAction("pull")}
									className="flex w-full flex-col items-start border-t border-stone-100 px-4 py-3 hover:bg-stone-50"
								>
									<p className="text-sm font-semibold text-ink-950">
										Pull from Brevo
									</p>
									<p className="mt-0.5 text-xs text-stone-500">
										Import Brevo contacts as leads
									</p>
								</button>
							</div>
						</>
					) : null}
				</div>
			</div>
		</>
	);
}