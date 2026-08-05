import type {
	LeadDetail,
	LeadListRow,
	LeadSource,
	LeadStatus,
} from "@/lib/types/admin/lead";

export const SOURCE_LABELS: Record<string, string> = {
	website: "Contact Form",
	brochure: "Brochure Request",
	landing_page: "Landing Page",
	whatsapp: "WhatsApp",
	instagram: "Instagram",
	google: "Google",
	referral: "Referral",
};

// Shape that the queries return — flat because we use explicit LEFT JOINs,
// not Drizzle relational queries, to avoid depending on what's in relations.ts.
export interface MappableLeadRow {
	id: string;
	fullName: string;
	email: string | null;
	phoneNumber: string | null;
	projectSlug: string | null;
	landingPageSlug: string | null;
	budgetRange: string | null;
	source: string;
	status: string;
	enquiryType: string | null;
	message: string | null;
	notes: string | null;
	utmSource: string | null;
	utmMedium: string | null;
	utmCampaign: string | null;
	createdAt: Date;
	updatedAt: Date;
	// From LEFT JOINs — null when the related row was deleted or never existed
	projectName: string | null;
	assignedToFullName: string | null;
	landingPageTitle: string | null;
}

function buildProjectPage(row: MappableLeadRow): string {
	if (row.source === "landing_page") {
		// Prefer the joined title; fall back to the denormalized slug
		const name = row.landingPageTitle ?? row.landingPageSlug ?? "Landing Page";
		return `${name} · Landing Page`;
	}
	if (row.projectName) {
		return `${row.projectName} · ${SOURCE_LABELS[row.source] ?? row.source}`;
	}
	if (row.projectSlug) {
		// Project was deleted after the lead was created — slug still intact
		return `${row.projectSlug} · ${SOURCE_LABELS[row.source] ?? row.source}`;
	}
	return "General Enquiry";
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
	return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

function formatDate(date: Date): { date: string; time: string; full: string } {
	const d = date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
	const t = date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
	return { date: d, time: t, full: `${d}, ${t}` };
}

export function mapLeadRowToListRow(row: MappableLeadRow): LeadListRow {
	const { date, time } = formatDate(row.createdAt);
	return {
		id: row.id,
		name: row.fullName,
		phone: row.phoneNumber ?? "—",
		projectPage: buildProjectPage(row),
		projectSlug: row.projectSlug ?? "",
		budget: row.budgetRange ?? "Not specified",
		source: row.source as LeadSource,
		status: row.status as LeadStatus,
		assignedTo: row.assignedToFullName ?? null,
		date,
		time,
	};
}

export function mapLeadRowToDetail(row: MappableLeadRow): LeadDetail {
	const summary = mapLeadRowToListRow(row);
	const { full: enquiredAt } = formatDate(row.createdAt);
	const sourceLabel = SOURCE_LABELS[row.source] ?? row.source;

	return {
		...summary,
		initials: getInitials(row.fullName),
		email: row.email ?? "—",
		location: "Not tracked yet",
		enquiredAt,
		unitInterest: "Not tracked yet",
		buyingPurpose: row.enquiryType ?? "Not specified",
		preferredPlan: "Not tracked yet",
		message: row.message ?? "",
		notes: row.notes,
		landingPageSlug: row.landingPageSlug,
		sourcePage: sourceLabel,
		utmSource: row.utmSource ?? "",
		utmMedium: row.utmMedium ?? "",
		utmCampaign: row.utmCampaign ?? "",
		device: "Not tracked yet",
		referrer: "Not tracked yet",
		activityTimeline: [
			{
				id: `${row.id}-received`,
				label: `Enquiry received via ${sourceLabel}`,
				timestamp: enquiredAt,
			},
			{
				id: `${row.id}-status`,
				label: `Current status: ${row.status}`,
				timestamp: formatDate(row.updatedAt).full,
				isCurrent: true,
			},
		],
	};
}
