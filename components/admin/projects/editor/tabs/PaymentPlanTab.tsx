
//@components/admin/projects/editor/tabs/PaymentPlanTab.tsx
import { Plus, Trash2 } from "lucide-react";
import { inputCls } from "@/components/admin/ui/EditorField";
import type {
	EditorChecklistItem,
	ProjectEditorState,
} from "@/lib/types/admin/project-editor";

interface PaymentPlanTabProps {
	state: ProjectEditorState;
	onChange: <K extends keyof ProjectEditorState>(
		key: K,
		value: ProjectEditorState[K],
	) => void;
}

function makeItem(label = ""): EditorChecklistItem {
	return {
		id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		label,
	};
}

export function PaymentPlanTab({ state, onChange }: PaymentPlanTabProps) {
	function updateItem(id: string, label: string) {
		onChange(
			"paymentPlan",
			state.paymentPlan.map((item) =>
				item.id === id ? { ...item, label } : item,
			),
		);
	}

	function addItem() {
		onChange("paymentPlan", [...state.paymentPlan, makeItem()]);
	}

	function removeItem(id: string) {
		onChange(
			"paymentPlan",
			state.paymentPlan.filter((item) => item.id !== id),
		);
	}

	return (
		<div className="space-y-5">
			<div>
				<div className="mb-3 flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold text-ink-950">
							Payment Plan Items
						</p>
						<p className="text-xs text-stone-500">
							Each item appears as a bullet point in the Payment Plan section.
						</p>
					</div>
					<button
						type="button"
						onClick={addItem}
						className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
					>
						<Plus className="h-3.5 w-3.5" />
						Add Item
					</button>
				</div>

				{state.paymentPlan.length === 0 ? (
					<div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 p-10 text-center">
						<p className="text-sm text-stone-500">No payment plan items yet.</p>
						<button
							type="button"
							onClick={addItem}
							className="text-sm font-medium text-red-600"
						>
							+ Add first item
						</button>
					</div>
				) : (
					<div className="space-y-2">
						{state.paymentPlan.map((item) => (
							<div key={item.id} className="flex items-center gap-2">
								<input
									type="text"
									value={item.label}
									onChange={(e) => updateItem(item.id, e.target.value)}
									placeholder="e.g. Outright purchase available"
									className={inputCls}
								/>
								<button
									type="button"
									onClick={() => removeItem(item.id)}
									className="shrink-0 rounded-lg border border-stone-200 p-2.5 text-stone-400 hover:border-red-200 hover:text-red-500"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
				<p className="text-xs font-semibold text-blue-700">Note</p>
				<p className="mt-1 text-xs text-blue-600">
					Investment Highlights are managed in the Basic Info tab. Payment Plan
					items appear specifically in the Payment Plan section on the public
					project page.
				</p>
			</div>
		</div>
	);
}
