// components/projects/project-editor-tabs.tsx
"use client";

import { cn } from "@/lib/utils/helpers";

export type TabKey =
	| "basic_info"
	| "hero"
	| "units_pricing"
	| "payment_plan"
	| "gallery"
	| "brochure"
	| "enquiry"
	| "seo";

const TABS: Array<{ key: TabKey; label: string }> = [
	{ key: "basic_info", label: "Basic Info" },
	{ key: "hero", label: "Hero" },
	{ key: "units_pricing", label: "Units & Pricing" },
	{ key: "payment_plan", label: "Payment Plan" },
	{ key: "gallery", label: "Gallery" },
	{ key: "brochure", label: "Brochure" },
	{ key: "enquiry", label: "Enquiry" },
	{ key: "seo", label: "SEO" },
];

type ProjectEditorTabsProps = {
	activeTab: TabKey;
	onChange: (tab: TabKey) => void;
};

export function ProjectEditorTabs({
	activeTab,
	onChange,
}: ProjectEditorTabsProps) {
	return (
		<div className="border-b border-gray-200 flex gap-6 overflow-x-auto">
			{TABS.map((tab) => (
				<button
					key={tab.key}
					onClick={() => onChange(tab.key)}
					className={cn(
						"pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
						activeTab === tab.key
							? "border-[#c8a84b] text-gray-900"
							: "border-transparent text-gray-500 hover:text-gray-700",
					)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}



