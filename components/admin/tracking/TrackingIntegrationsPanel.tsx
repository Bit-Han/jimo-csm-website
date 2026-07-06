"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { saveIntegrationConfig } from "@/lib/actions/admin/tracking-analytics";
import { inputCls } from "@/components/admin/ui/EditorField";
import { cn } from "@/lib/utils/helpers";
import type { AdminTrackingIntegration } from "@/lib/types/admin/tracking-analytics";

export function TrackingIntegrationsPanel({
	integrations: initialIntegrations,
}: {
	integrations: AdminTrackingIntegration[];
}) {
	const [integrations, setIntegrations] = useState(initialIntegrations);
	const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
	const [savedPlatform, setSavedPlatform] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function updateValue(platform: string, value: string) {
		setIntegrations((prev) =>
			prev.map((i) =>
				i.platform === platform ? { ...i, currentValue: value } : i,
			),
		);
	}

	function handleSave(integration: AdminTrackingIntegration) {
		startTransition(async () => {
			const result = await saveIntegrationConfig(
				integration.platform,
				integration.currentValue,
			);
			if (result.success) {
				setIntegrations((prev) =>
					prev.map((i) =>
						i.platform === integration.platform
							? {
									...i,
									isConnected: integration.currentValue.trim().length > 0,
								}
							: i,
					),
				);
				setSavedPlatform(integration.platform);
				setTimeout(() => setSavedPlatform(null), 2000);
				setExpandedPlatform(null);
			}
		});
	}

	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h3 className="text-sm font-bold text-ink-950">Tracking Integrations</h3>

			<div className="mt-4 space-y-2">
				{integrations.map((integration) => {
					const isExpanded = expandedPlatform === integration.platform;

					return (
						<div
							key={integration.platform}
							className="overflow-hidden rounded-xl border border-stone-200"
						>
							<button
								type="button"
								onClick={() =>
									setExpandedPlatform(isExpanded ? null : integration.platform)
								}
								className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-stone-50"
							>
								<span className="text-sm font-medium text-ink-950">
									{integration.label}
								</span>
								<div className="flex items-center gap-2">
									{savedPlatform === integration.platform ? (
										<Check className="h-3.5 w-3.5 text-emerald-500" />
									) : null}
									<span
										className={cn(
											"text-xs font-semibold",
											integration.isConnected
												? "text-emerald-600"
												: "text-stone-400",
										)}
									>
										{integration.isConnected ? "Connected" : "Not Connected"}
									</span>
									{isExpanded ? (
										<ChevronDown className="h-4 w-4 text-stone-400" />
									) : (
										<ChevronRight className="h-4 w-4 text-stone-400" />
									)}
								</div>
							</button>

							{isExpanded ? (
								<div className="border-t border-stone-100 bg-stone-50 px-4 py-3">
									<label className="mb-1.5 block text-xs font-medium text-stone-500">
										{integration.configLabel}
									</label>
									<div className="flex gap-2">
										<input
											type="text"
											value={integration.currentValue}
											onChange={(e) =>
												updateValue(integration.platform, e.target.value)
											}
											placeholder={integration.configPlaceholder}
											className={`${inputCls} flex-1`}
										/>
										<button
											type="button"
											onClick={() => handleSave(integration)}
											disabled={isPending}
											className="flex shrink-0 items-center gap-1.5 rounded-lg bg-ink-950 px-3 py-2 text-xs font-semibold text-white hover:bg-ink-900 disabled:opacity-60"
										>
											{isPending ? (
												<Loader2 className="h-3 w-3 animate-spin" />
											) : null}
											Save
										</button>
									</div>
								</div>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
}
