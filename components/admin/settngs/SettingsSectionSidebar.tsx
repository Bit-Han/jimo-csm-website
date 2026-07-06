import { cn } from "@/lib/utils/helpers";
import type {
	SettingsSection,
	SettingsSectionMeta,
} from "@/lib/types/admin/settings";

interface SettingsSectionSidebarProps {
	sections: SettingsSectionMeta[];
	activeSection: SettingsSection;
	onSelect: (id: SettingsSection) => void;
}

export function SettingsSectionSidebar({
	sections,
	activeSection,
	onSelect,
}: SettingsSectionSidebarProps) {
	return (
		<aside className="w-full rounded-2xl border border-stone-200 bg-white p-4 lg:w-56 lg:shrink-0">
			<p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
				Settings
			</p>
			<nav className="space-y-0.5">
				{sections.map((section) => (
					<button
						key={section.id}
						type="button"
						onClick={() => onSelect(section.id)}
						className={cn(
							"flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left transition-colors",
							activeSection === section.id
								? "bg-amber-50 text-ink-950"
								: "text-stone-600 hover:bg-stone-50 hover:text-ink-950",
						)}
					>
						<span
							className={cn(
								"text-sm font-semibold",
								activeSection === section.id && "text-gold-500",
							)}
						>
							{section.label}
						</span>
						<span className="mt-0.5 text-[10px] text-stone-400">
							{section.description}
						</span>
					</button>
				))}
			</nav>
		</aside>
	);
}
