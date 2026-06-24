import { CheckCircle2 } from "lucide-react";
import type { ProjectChecklistItem } from "@/lib/types/project-detail";

export interface ChecklistProps {
	items: ProjectChecklistItem[];
}

export function Checklist({ items }: ChecklistProps) {
	return (
		<ul className="space-y-3">
			{items.map((item) => (
				<li
					key={item.id}
					className="flex items-start gap-3 text-sm text-stone-600"
				>
					<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
					<span>{item.label}</span>
				</li>
			))}
		</ul>
	);
}
