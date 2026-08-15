// components/admin/settngs/sections/WebsiteDefaultsSection.tsx
"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { saveWebsiteDefaults } from "@/lib/actions/admin/settings";
import { inputCls } from "@/components/admin/ui/EditorField";
import type { WebsiteDefaultsSettings } from "@/lib/types/admin/settings";

export function WebsiteDefaultsSection({
	initialData,
}: {
	initialData: WebsiteDefaultsSettings;
}) {
	const [data, setData] = useState<WebsiteDefaultsSettings>(initialData);
	const [saved, setSaved] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function set(key: keyof WebsiteDefaultsSettings, value: string) {
		setData((prev) => ({ ...prev, [key]: value }));
		setSaved(false);
		setErrorMessage(null);
	}

	function handleSave() {
		startTransition(async () => {
			const result = await saveWebsiteDefaults(data);
			if (result.success) {
				setSaved(true);
				setTimeout(() => setSaved(false), 3000);
			} else {
				setErrorMessage(result.message);
			}
		});
	}

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h2 className="text-base font-bold text-ink-950">Website Defaults</h2>
				<p className="mt-0.5 text-sm text-stone-500">
					Global copy used across the public site — the registered legal name
					and the response-time note shown near contact details.
				</p>

				<div className="mt-5 grid gap-4">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-ink-950">
							Legal Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={data.legalName}
							onChange={(e) => set("legalName", e.target.value)}
							placeholder="Jimo Property Development Limited"
							className={inputCls}
						/>
						<p className="mt-1 text-xs text-stone-400">
							The full registered company name, used in legal/footer copy.
						</p>
					</div>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-ink-950">
							Tagline <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={data.tagline}
							onChange={(e) => set("tagline", e.target.value)}
							placeholder="Property Development"
							className={inputCls}
						/>
						<p className="mt-1 text-xs text-stone-400">
							Short line shown next to the company name — nav, footer, browser
							tab title.
						</p>
					</div>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-ink-950">
							Site Description <span className="text-red-500">*</span>
						</label>
						<textarea
							rows={3}
							value={data.description}
							onChange={(e) => set("description", e.target.value)}
							placeholder="Premium residential, hospitality, and investment-led real estate developments..."
							className={inputCls}
						/>
						<p className="mt-1 text-xs text-stone-400">
							Used as the default meta description and social-share summary
							site-wide.
						</p>
					</div>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-ink-950">
							Response Time Note <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={data.responseTimeNote}
							onChange={(e) => set("responseTimeNote", e.target.value)}
							placeholder="We aim to respond within 24 hours."
							className={inputCls}
						/>
						<p className="mt-1 text-xs text-stone-400">
							Shown on the Contact page under Direct Contact.
						</p>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
				{errorMessage ? (
					<span className="text-xs font-medium text-red-500">
						{errorMessage}
					</span>
				) : saved ? (
					<span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
						<Check className="h-3.5 w-3.5" />
						Saved
					</span>
				) : null}
				<button
					type="button"
					onClick={handleSave}
					disabled={isPending}
					className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
				>
					{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
					Save Changes
				</button>
			</div>
		</div>
	);
}
