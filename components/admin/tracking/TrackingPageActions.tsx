"use client";

import { useTransition } from "react";
import { Loader2, Zap } from "lucide-react";
import {
	testTrackingEvents,
	saveAllIntegrations,
} from "@/lib/actions/admin/tracking-analytics";

export function TrackingPageActions() {
	const [testPending, startTest] = useTransition();
	const [savePending, startSave] = useTransition();

	function handleTest() {
		startTest(async () => {
			const result = await testTrackingEvents();
			alert(result.message);
		});
	}

	function handleSave() {
		startSave(async () => {
			const result = await saveAllIntegrations({});
			alert(result.message);
		});
	}

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={handleTest}
				disabled={testPending}
				className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-stone-50 disabled:opacity-60"
			>
				{testPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Zap className="h-4 w-4" />
				)}
				Test Events
			</button>
			<button
				type="button"
				onClick={handleSave}
				disabled={savePending}
				className="flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-900 disabled:opacity-60"
			>
				{savePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				Save
			</button>
		</div>
	);
}
