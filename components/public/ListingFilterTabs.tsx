// components/public/listing-filter-tabs.tsx
import Link from "next/link";
import { cn } from "@/lib/utils/helpers";

const TABS: Array<{ label: string; value: string | undefined }> = [
	{ label: "All", value: undefined },
	{ label: "For rent", value: "for_rent" },
	{ label: "For sale", value: "for_sale" },
];

export function ListingFilterTabs({ active }: { active?: string }) {
	return (
		<div className="flex items-center gap-2">
			{TABS.map((tab) => (
				<Link
					key={tab.label}
					href={tab.value ? `/projects?listing=${tab.value}` : "/projects"}
					className={cn(
						"px-4 py-2 rounded-lg text-sm font-medium transition",
						active === tab.value
							? "bg-gray-200 text-gray-900"
							: "text-gray-400 hover:text-gray-600",
					)}
				>
					{tab.label}
				</Link>
			))}
		</div>
	);
}
