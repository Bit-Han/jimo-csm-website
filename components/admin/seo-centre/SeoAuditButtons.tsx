"use client";

import { useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { generateSitemap, runSeoAudit } from "@/lib/actions/admin/seo-centre";

export function SeoAuditButtons() {
	const [auditPending, startAudit] = useTransition();
	const [sitemapPending, startSitemap] = useTransition();

	function handleAudit() {
		startAudit(async () => {
			const result = await runSeoAudit();
			if (result.success) {
				alert(result.message);
			}
		});
	}

	function handleSitemap() {
		startSitemap(async () => {
			const result = await generateSitemap();
			if (result.success) {
				alert(result.message);
			}
		});
	}

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={handleSitemap}
				disabled={sitemapPending}
				className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
			>
				{sitemapPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<RefreshCw className="h-4 w-4" />
				)}
				Generate Sitemap
			</button>
			<button
				type="button"
				onClick={handleAudit}
				disabled={auditPending}
				className="flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-900 disabled:opacity-60"
			>
				{auditPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<RefreshCw className="h-4 w-4" />
				)}
				Run SEO Audit
			</button>
		</div>
	);
}
