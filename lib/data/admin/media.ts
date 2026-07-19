import type {
	MediaAsset,
	MediaFolder,
	MediaFolderItem,
} from "@/lib/types/admin/media";

// TODO (integration stage):
// db.query.mediaAssets.findMany({ orderBy: [desc(mediaAssets.createdAt)] })
// Counts per folder → aggregate queries
export const mockMediaFolders: MediaFolderItem[] = [
	{ id: "all", label: "All Media", count: 842 },
	{ id: "project-renders", label: "Project Renders", count: 192 },
	{ id: "interior-renders", label: "Interior Renders", count: 148 },
	{ id: "construction-updates", label: "Construction Updates", count: 231 },
	{ id: "brochures", label: "Brochures", count: 67 },
	{ id: "team-photos", label: "Team Photos", count: 58 },
	{ id: "logos-icons", label: "Logos & Icons", count: 34 },
	{ id: "documents", label: "Documents", count: 76 },
	{ id: "videos", label: "Videos", count: 36 },
];

const TAG_COLORS: Record<string, string> = {
	"Project Render": "bg-emerald-50 text-emerald-700",
	Interior: "bg-blue-50 text-blue-700",
	Construction: "bg-amber-50 text-amber-700",
	Brochure: "bg-violet-50 text-violet-700",
	Logo: "bg-sky-50 text-sky-700",
	Document: "bg-stone-100 text-stone-600",
	Video: "bg-red-50 text-red-600",
};

export const mockMediaAssets: MediaAsset[] = [
	{
		id: "ma-1",
		cloudinaryPublicId: "jimo-property/project-renders/yaba-exterior-01",
		url: "https://images.unsplash.com/photo-1760596413966-22e91dde4e4b?auto=format&fit=crop&w=400&q=70",
		name: "Yaba Residences – Exterior Render",
		projectName: "Yaba Residences",
		tagLabel: "Project Render",
		tagColorClass: TAG_COLORS["Project Render"]!,
		resourceType: "image",
		format: "JPG",
	},
	{
		id: "ma-2",
		cloudinaryPublicId: "jimo-property/interior-renders/vatican-living-01",
		url: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=400&q=70",
		name: "Vatican Court – Living Room",
		projectName: "Vatican Court",
		tagLabel: "Interior",
		tagColorClass: TAG_COLORS["Interior"]!,
		resourceType: "image",
		format: "JPG",
	},
	{
		id: "ma-3",
		cloudinaryPublicId: "jimo-property/construction-updates/yaba-hub-progress",
		url: "https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?auto=format&fit=crop&w=400&q=70",
		name: "Yaba Hospitality Hub – Progress",
		projectName: "Yaba Residences",
		tagLabel: "Construction",
		tagColorClass: TAG_COLORS["Construction"]!,
		resourceType: "image",
		format: "JPG",
	},
	{
		id: "ma-4",
		cloudinaryPublicId: "jimo-property/brochures/vatican-court-brochure-cover",
		url: "https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=400&q=70",
		name: "Vatican Court – Brochure",
		projectName: "Vatican Court",
		tagLabel: "Brochure",
		tagColorClass: TAG_COLORS["Brochure"]!,
		resourceType: "image",
		format: "JPG",
	},
	{
		id: "ma-5",
		cloudinaryPublicId: "jimo-property/team-photos/site-visit-jun25",
		url: "https://images.unsplash.com/photo-1758518729058-b158e71c5a9b?auto=format&fit=crop&w=400&q=70",
		name: "Jimo Team – Site Visit",
		projectName: "Yaba Residences",
		tagLabel: "Project Render",
		tagColorClass: TAG_COLORS["Project Render"]!,
		resourceType: "image",
		format: "JPG",
	},
	{
		id: "ma-6",
		cloudinaryPublicId: "jimo-property/logos-icons/jimo-primary-logo",
		url: "https://images.unsplash.com/photo-1758518729466-827cd8293992?auto=format&fit=crop&w=400&q=70",
		name: "Jimo Property – Primary Logo",
		projectName: "Vatican Court",
		tagLabel: "Interior",
		tagColorClass: TAG_COLORS["Interior"]!,
		resourceType: "image",
		format: "JPG",
	},
	{
		id: "ma-7",
		cloudinaryPublicId: "jimo-property/construction-updates/yaba-site-plan",
		url: "https://images.unsplash.com/photo-1749930206000-179d0b85aa7e?auto=format&fit=crop&w=400&q=70",
		name: "Yaba Residences – Site Plan",
		projectName: "Yaba Residences",
		tagLabel: "Construction",
		tagColorClass: TAG_COLORS["Construction"]!,
		resourceType: "image",
		format: "JPG",
	},
	{
		id: "ma-8",
		cloudinaryPublicId: "jimo-property/videos/drone-footage-may25",
		url: "https://images.unsplash.com/photo-1761535315385-219131cb53e6?auto=format&fit=crop&w=400&q=70",
		name: "Drone Footage – May 2025",
		projectName: "Vatican Court",
		tagLabel: "Brochure",
		tagColorClass: TAG_COLORS["Brochure"]!,
		resourceType: "video",
		format: "MP4",
	},
];

export function getMediaAssets(folder: MediaFolder): MediaAsset[] {
	if (folder === "all") return mockMediaAssets;

	const folderTagMap: Partial<Record<MediaFolder, string>> = {
		"project-renders": "Project Render",
		"interior-renders": "Interior",
		"construction-updates": "Construction",
		brochures: "Brochure",
		"team-photos": "Project Render",
		"logos-icons": "Interior",
		videos: "Video",
	};

	const tag = folderTagMap[folder];
	if (!tag) return mockMediaAssets;

	return mockMediaAssets.filter((a) => a.tagLabel === tag);
}

export function getStorageStats() {
	return {
		usedGb: 68.4,
		totalGb: 200,
		usedPercent: Math.round((68.4 / 200) * 100),
	};
}
