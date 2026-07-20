//@components/admin/company-pages/home-sections/HomeSectionSaveButton.tsx

"use client";

import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

export function HomeSectionSaveButton({
	onSave,
}: {
	onSave: () => Promise<{ success: boolean; message: string }>;
}) {
	const [isPending, startTransition] = useTransition();
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	function handleSave() {
		startTransition(async () => {
			const res = await onSave();
			setResult(res);
			setTimeout(() => setResult(null), 3000);
		});
	}

	return (
		<div className="flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
			{result ? (
				<span
					className={`flex items-center gap-1 text-xs font-medium ${
						result.success ? "text-emerald-600" : "text-red-500"
					}`}
				>
					{result.success ? <Check className="h-3 w-3" /> : null}
					{result.message}
				</span>
			) : null}
			<button
				type="button"
				onClick={handleSave}
				disabled={isPending}
				className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
			>
				{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
				Save Section
			</button>
		</div>
	);
}
