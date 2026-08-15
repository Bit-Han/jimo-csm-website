// components/admin/settngs/sections/NotificationsSection.tsx
"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { saveNotificationSettings } from "@/lib/actions/admin/settings";
import { inputCls } from "@/components/admin/ui/EditorField";
import { cn } from "@/lib/utils/helpers";
import type { NotificationSettings } from "@/lib/types/admin/settings";

export function NotificationsSection({
	initialData,
}: {
	initialData: NotificationSettings;
}) {
	const [data, setData] = useState<NotificationSettings>(initialData);
	const [saved, setSaved] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleSave() {
		startTransition(async () => {
			const result = await saveNotificationSettings(data);
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
				<h2 className="text-base font-bold text-ink-950">Notifications</h2>
				<p className="mt-0.5 text-sm text-stone-500">
					Choose whether your team is emailed when a new lead comes in from the
					contact form, brochure requests, or landing pages.
				</p>

				<div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-stone-200 p-4">
					<div>
						<p className="text-sm font-semibold text-ink-950">
							Email me on new leads
						</p>
						<p className="mt-0.5 text-xs text-stone-500">
							Sends a notification to the address below every time a new lead is
							captured anywhere on the site.
						</p>
					</div>
					<button
						type="button"
						role="switch"
						aria-checked={data.newLeadEmailEnabled}
						onClick={() => {
							setData((prev) => ({
								...prev,
								newLeadEmailEnabled: !prev.newLeadEmailEnabled,
							}));
							setSaved(false);
							setErrorMessage(null);
						}}
						className={cn(
							"relative h-6 w-11 shrink-0 rounded-full transition-colors",
							data.newLeadEmailEnabled ? "bg-red-600" : "bg-stone-200",
						)}
					>
						<span
							className={cn(
								"absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
								data.newLeadEmailEnabled
									? "translate-x-5.5"
									: "translate-x-0.5",
							)}
						/>
					</button>
				</div>

				<div className="mt-4">
					<label className="mb-1.5 block text-sm font-medium text-ink-950">
						Notification Email
					</label>
					<input
						type="email"
						value={data.newLeadNotificationEmail}
						onChange={(e) => {
							setData((prev) => ({
								...prev,
								newLeadNotificationEmail: e.target.value,
							}));
							setSaved(false);
							setErrorMessage(null);
						}}
						placeholder="sales@jimopropertydevelopment.com"
						disabled={!data.newLeadEmailEnabled}
						className={cn(inputCls, !data.newLeadEmailEnabled && "opacity-50")}
					/>
				</div>
			</div>

			<div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4">
				<p className="text-xs text-stone-500">
					This saves your notification preference only. Actually sending these
					emails requires the Resend integration, which is a separate step not
					yet wired up.
				</p>
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
