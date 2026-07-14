// "use client";

// import { useTransition } from "react";
// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { saveLeadNote } from "@/lib/actions/leads";

// export function SalesNotesPanel({ leadId }: { leadId: string }) {
// 	const [note, setNote] = useState("");
// 	const [savedMessage, setSavedMessage] = useState<string | null>(null);
// 	const [isPending, startTransition] = useTransition();

// 	function handleSave() {
// 		if (!note.trim()) return;
// 		startTransition(async () => {
// 			const result = await saveLeadNote(leadId, note);
// 			if (result.success) {
// 				setSavedMessage("Note saved.");
// 				setNote("");
// 				setTimeout(() => setSavedMessage(null), 3000);
// 			}
// 		});
// 	}

// 	return (
// 		<div className="rounded-2xl border border-stone-200 bg-white p-6">
// 			<h2 className="text-base font-bold text-ink-950">Sales Notes</h2>
// 			<div className="mt-4">
// 				<textarea
// 					value={note}
// 					onChange={(e) => setNote(e.target.value)}
// 					rows={4}
// 					placeholder="Add a note about this lead. Use @ to mention your team..."
// 					className="w-full rounded-xl border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-ink-950 placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
// 				/>
// 				<div className="mt-3 flex items-center justify-between">
// 					{savedMessage ? (
// 						<p className="text-xs font-medium text-emerald-600">
// 							{savedMessage}
// 						</p>
// 					) : (
// 						<span />
// 					)}
// 					<button
// 						type="button"
// 						onClick={handleSave}
// 						disabled={isPending || !note.trim()}
// 						className="flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-900 disabled:opacity-50"
// 					>
// 						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
// 						Save Note
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useTransition, useState } from "react";
import { Loader2 } from "lucide-react";
import { saveLeadNote } from "@/lib/actions/admin/leads";
import { useRouter } from "next/navigation";

export function SalesNotesPanel({
	leadId,
	existingNotes,
}: {
	leadId: string;
	existingNotes: string | null;
}) {
	const router = useRouter();
	const [note, setNote] = useState("");
	const [savedMessage, setSavedMessage] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleSave() {
		if (!note.trim()) return;
		startTransition(async () => {
			const result = await saveLeadNote(leadId, note);
			if (result.success) {
				setNote("");
				setSavedMessage("Note saved.");
				setTimeout(() => setSavedMessage(null), 3000);
				router.refresh();
			}
		});
	}

	return (
		<div className="rounded-2xl border border-stone-200 bg-white p-6">
			<h2 className="text-base font-bold text-ink-950">Sales Notes</h2>

			{/* Existing notes history */}
			{existingNotes ? (
				<div className="mt-4 space-y-3 rounded-xl bg-stone-50 p-4">
					{existingNotes.split("\n\n").map((entry, i) => {
						const lines = entry.split("\n");
						const header = lines[0] ?? "";
						const body = lines.slice(1).join("\n");
						return (
							<div
								key={i}
								className="border-b border-stone-200 pb-3 last:border-none last:pb-0"
							>
								<p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
									{header.replace(/\[|\]/g, "")}
								</p>
								<p className="mt-1 text-sm leading-relaxed text-stone-700">
									{body}
								</p>
							</div>
						);
					})}
				</div>
			) : (
				<p className="mt-3 text-xs text-stone-400">No notes yet.</p>
			)}

			{/* New note input */}
			<div className="mt-4">
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					rows={4}
					placeholder="Add a note about this lead..."
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
						className="flex items-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-900 disabled:opacity-50"
					>
						{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
						Save Note
					</button>
				</div>
			</div>
		</div>
	);
}