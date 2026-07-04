import { FileText, Upload } from "lucide-react";
import { EditorField, inputCls } from "@/components/admin/ui/EditorField";

export function BrochureTab() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 p-10 text-center">
				<span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
					<FileText className="h-6 w-6 text-stone-400" />
				</span>
				<div>
					<p className="text-sm font-semibold text-ink-950">
						Upload Project Brochure
					</p>
					<p className="mt-1 text-xs text-stone-500">
						PDF file, max 50MB. Stored in Cloudinary and gated behind the lead
						capture form.
					</p>
				</div>
				<button
					type="button"
					className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
				>
					<Upload className="h-4 w-4" />
					Upload PDF
					<span className="rounded bg-red-800 px-1.5 py-0.5 text-[10px] font-semibold text-red-200">
						TODO
					</span>
				</button>
			</div>

			<EditorField
				label="Brochure Title"
				hint="Shown to users before they download"
			>
				<input
					type="text"
					placeholder="e.g. Vatican Court Brochure"
					className={inputCls}
				/>
			</EditorField>

			<div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
				<p className="text-xs font-semibold text-amber-700">
					Integration Stage Note
				</p>
				<p className="mt-1 text-xs text-amber-600">
					PDF upload will use Cloudinary once the integration stage is complete.
					The file URL will be stored in the brochures table and auto-emailed
					via Resend/SendGrid when a visitor submits the brochure request form.
				</p>
			</div>
		</div>
	);
}
