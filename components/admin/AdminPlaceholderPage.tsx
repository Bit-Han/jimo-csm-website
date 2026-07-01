import { Construction } from "lucide-react";
import { AdminPageHeader } from "./AdminPageHeader";

export interface AdminPlaceholderPageProps {
	title: string;
	description: string;
	stageNote: string;
}

export function AdminPlaceholderPage({
	title,
	description,
	stageNote,
}: AdminPlaceholderPageProps) {
	return (
		<div className="space-y-6">
			<AdminPageHeader title={title} description={description} />

			<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
				<span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-500">
					<Construction className="h-6 w-6" />
				</span>
				<p className="text-sm font-medium text-ink-950">
					This screen is wired into navigation but not built yet
				</p>
				<p className="max-w-sm text-sm text-stone-500">{stageNote}</p>
			</div>
		</div>
	);
}
