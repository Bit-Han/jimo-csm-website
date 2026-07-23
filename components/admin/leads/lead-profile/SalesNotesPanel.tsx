
//@component/admin/leads/lead-profile/SalesNotesPanel.tsx
"use client";

import { useTransition } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { saveLeadNote } from "@/lib/actions/leads";

export function SalesNotesPanel({ leadId }: { leadId: string }) {
	const [note, setNote] = useState("");
	const [savedMessage, setSavedMessage] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleSave() {
		if (!note.trim()) return;
		startTransition(async () => {
			const result = await saveLeadNote(leadId, note);
			if (result.success) {
				setSavedMessage("Note saved.");
				setNote("");
				setTimeout(() => setSavedMessage(null), 3000);
			}
		});
	}

	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h2 className="text-base font-bold text-ink-950">Sales Notes</h2>
			<div className="mt-4">
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					rows={4}
					placeholder="Add a note about this lead. Use @ to mention your team..."
					className="w-full rounded-xl border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
				/>
				<div className="mt-3 flex items-center justify-between">
					{savedMessage ? (
						<p className="text-xs font-medium text-emerald-600">
							{savedMessage}
						</p>
					) : (
						<span />
					)}
					<button
						type="button"
						onClick={handleSave}
						disabled={isPending || !note.trim()}
						className="flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-900 disabled:opacity-50"
					>
						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
						Save Note
					</button>
				</div>
			</div>
		</div>
	);
}
