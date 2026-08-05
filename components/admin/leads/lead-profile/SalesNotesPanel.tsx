//@component/admin/leads/lead-profile/SalesNotesPanel.tsx

"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { saveLeadNote } from "@/lib/actions/admin/leads";

export function SalesNotesPanel({
	leadId,
	existingNotes,
}: {
	leadId: string;
	existingNotes: string | null;
}) {
	const [currentNotes, setCurrentNotes] = useState(existingNotes);
	const [note, setNote] = useState("");
	const [feedback, setFeedback] = useState<{
		msg: string;
		ok: boolean;
	} | null>(null);
	const [isPending, startTransition] = useTransition();
	const lockRef = useRef(false);

	function handleSave() {
		const trimmed = note.trim();
		if (!trimmed || lockRef.current) return;
		lockRef.current = true;

		startTransition(async () => {
			const result = await saveLeadNote(leadId, trimmed);
			if (result.success) {
				// Optimistically append so the admin sees it immediately,
				// without needing a full page refresh.
				const ts = new Date().toLocaleString("en-GB", {
					day: "numeric",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				});
				const entry = `[${ts}]\n${trimmed}`;
				setCurrentNotes((prev) => (prev ? `${prev}\n\n${entry}` : entry));
				setNote("");
				setFeedback({ msg: "Note saved.", ok: true });
			} else {
				setFeedback({ msg: result.message, ok: false });
			}
			setTimeout(() => setFeedback(null), 3000);
			lockRef.current = false;
		});
	}

	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h2 className="text-base font-bold text-ink-950">Sales Notes</h2>

			{currentNotes ? (
				<div className="mt-4 max-h-72 overflow-y-auto rounded-xl bg-stone-50 p-4">
					<pre className="whitespace-pre-wrap text-xs leading-relaxed text-stone-600 font-sans">
						{currentNotes}
					</pre>
				</div>
			) : (
				<p className="mt-3 text-xs text-stone-400">
					No notes yet. Add the first note below.
				</p>
			)}

			<div className="mt-4">
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					rows={3}
					placeholder="Add a note about this lead..."
					className="w-full rounded-xl border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
				/>
				<div className="mt-3 flex items-center justify-between">
					{feedback ? (
						<p
							className={`text-xs font-medium ${
								feedback.ok ? "text-emerald-600" : "text-red-500"
							}`}
						>
							{feedback.msg}
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