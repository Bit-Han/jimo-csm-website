"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";

export default function AdminDashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[admin error boundary]", error);
	}, [error]);

	return (
		<div className="space-y-6">
			<div
				role="alert"
				className="fixed right-4 top-24 z-50 w-full max-w-md rounded-2xl border border-red-200 bg-white p-4 shadow-lg sm:right-6"
			>
				<div className="flex items-start gap-3">
					<span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
						<XCircle className="h-5 w-5" />
					</span>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-semibold text-ink-950">
							Could not load this admin screen
						</p>
						<p className="mt-1 text-sm text-stone-600">
							A data request failed while loading this page. Try again, or move to
							 another section and come back.
						</p>
						{error.digest ? (
							<p className="mt-2 text-xs text-stone-400">
								Reference: {error.digest}
							</p>
						) : null}
						<div className="mt-3 flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={() => reset()}
								className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
							>
								<RefreshCw className="h-4 w-4" />
								Retry
							</button>
							<Link
								href="/admin/dashboard"
								prefetch={false}
								className="inline-flex items-center rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-ink-950 hover:bg-stone-50"
							>
								Back to dashboard
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10">
				<div className="flex items-start gap-4">
					<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
						<AlertTriangle className="h-5 w-5" />
					</span>
					<div>
						<h1 className="text-lg font-bold text-ink-950">
							This section could not be loaded
						</h1>
						<p className="mt-1 text-sm text-stone-600">
							The admin shell is still running, but this page&apos;s data request
							 failed. Use retry to request the data again.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
