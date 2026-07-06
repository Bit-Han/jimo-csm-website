"use client";

import { useState, useTransition } from "react";
import { Check, CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { saveSeoGlobalSettings } from "@/lib/actions/admin/seo-centre";
import { inputCls } from "@/components/admin/ui/EditorField";
import type {
	SeoChecklistItem,
	SeoGlobalSettingsData,
	SitemapStats,
} from "@/lib/types/admin/seo-centre";

export interface SeoBottomCardsProps {
	settings: SeoGlobalSettingsData;
	checklist: SeoChecklistItem[];
	sitemap: SitemapStats;
}

export function SeoBottomCards({
	settings: initialSettings,
	checklist,
	sitemap,
}: SeoBottomCardsProps) {
	const [settings, setSettings] =
		useState<SeoGlobalSettingsData>(initialSettings);
	const [saved, setSaved] = useState(false);
	const [isPending, startTransition] = useTransition();

	function handleSave() {
		startTransition(async () => {
			const result = await saveSeoGlobalSettings(settings);
			if (result.success) {
				setSaved(true);
				setTimeout(() => setSaved(false), 3000);
			}
		});
	}

	return (
		<div className="grid gap-5 lg:grid-cols-3">
			{/* Global SEO Settings */}
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-bold text-ink-950">
						Global SEO Settings
					</h3>
					{saved ? (
						<span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
							<Check className="h-3 w-3" />
							Saved
						</span>
					) : null}
				</div>

				<div className="mt-4 space-y-3">
					<div>
						<label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-stone-500">
							Site Title
						</label>
						<input
							type="text"
							value={settings.siteTitle}
							onChange={(e) =>
								setSettings((p) => ({ ...p, siteTitle: e.target.value }))
							}
							className={inputCls}
						/>
					</div>
					<div>
						<label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-stone-500">
							Meta Description
						</label>
						<input
							type="text"
							value={settings.metaDescription}
							onChange={(e) =>
								setSettings((p) => ({
									...p,
									metaDescription: e.target.value,
								}))
							}
							className={inputCls}
						/>
					</div>
					<div>
						<label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-stone-500">
							Robots.txt
						</label>
						<input
							type="text"
							value={settings.robotsTxt}
							onChange={(e) =>
								setSettings((p) => ({ ...p, robotsTxt: e.target.value }))
							}
							className={inputCls}
						/>
					</div>
					<div>
						<label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-stone-500">
							Canonical Domain
						</label>
						<input
							type="text"
							value={settings.canonicalDomain}
							onChange={(e) =>
								setSettings((p) => ({
									...p,
									canonicalDomain: e.target.value,
								}))
							}
							className={inputCls}
						/>
					</div>
					<button
						type="button"
						onClick={handleSave}
						disabled={isPending}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 py-2.5 text-sm font-semibold text-white hover:bg-ink-900 disabled:opacity-60"
					>
						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
						Save Settings
					</button>
				</div>
			</div>

			{/* SEO Checklist */}
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<h3 className="text-sm font-bold text-ink-950">SEO Checklist</h3>
				<ul className="mt-4 space-y-3">
					{checklist.map((item) => (
						<li key={item.id} className="flex items-start gap-3">
							{item.checked ? (
								<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
							) : (
								<TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
							)}
							<span
								className={`text-sm ${
									item.checked ? "text-ink-950" : "text-stone-600"
								}`}
							>
								{item.label}
							</span>
						</li>
					))}
				</ul>
			</div>

			{/* Sitemap Overview */}
			<div className="rounded-2xl border border-stone-200 bg-white p-6">
				<h3 className="text-sm font-bold text-ink-950">Sitemap Overview</h3>
				<dl className="mt-4 space-y-3">
					<div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
						<dt className="text-sm text-stone-600">Total URLs</dt>
						<dd className="text-sm font-bold text-ink-950">
							{sitemap.totalUrls}
						</dd>
					</div>
					<div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
						<dt className="text-sm text-stone-600">Indexed</dt>
						<dd className="text-sm font-bold text-emerald-600">
							{sitemap.indexed}
						</dd>
					</div>
					<div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
						<dt className="text-sm text-stone-600">No-index</dt>
						<dd className="text-sm font-bold text-stone-600">
							{sitemap.noIndex}
						</dd>
					</div>
					<div className="flex items-center justify-between">
						<dt className="text-sm text-stone-600">Errors</dt>
						<dd className="text-sm font-bold text-red-500">{sitemap.errors}</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
