import type {
	LeadActivityEvent,
	LeadDetail,
	LeadListRow,
	LeadSource,
	LeadStatus,
} from "@/lib/types/admin/lead";

// ─── Raw row shape from the joined select query ───────────────────────────
export interface LeadQueryRow {
	id: string;
	fullName: string;
	phoneNumber: string | null;
	email: string | null;
	projectSlug: string | null;
	projectName: string | null;
	budgetRange: string | null;
	source: string;
	status: string;
	assigneeFullName: string | null;
	assigneeId: string | null;
	createdAt: Date;
	enquiryType: string | null;
	message: string | null;
	notes: string | null;
	utmSource: string | null;
	utmMedium: string | null;
	utmCampaign: string | null;
}

function formatDate(date: Date): string {
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	});
}

function formatTime(date: Date): string {
	return date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatFullDateTime(date: Date): string {
	return date.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getInitials(fullName: string): string {
	return fullName
		.split(" ")
		.map((part) => part[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function buildProjectPage(
	projectName: string | null,
	projectSlug: string | null,
): string {
	if (projectName) return projectName;
	if (projectSlug) {
		return projectSlug
			.split("-")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}
	return "General Enquiry";
}

function buildActivityTimeline(
	status: string,
	source: string,
	assigneeFullName: string | null,
	createdAt: Date,
): LeadActivityEvent[] {
	const timeStr = formatFullDateTime(createdAt);
	const events: LeadActivityEvent[] = [];

	events.push({
		id: "evt-submit",
		label: source === "brochure" ? "Brochure downloaded" : "Form submitted",
		timestamp: timeStr,
	});

	events.push({
		id: "evt-response",
		label: "Auto-response sent",
		timestamp: timeStr,
	});

	if (assigneeFullName) {
		events.push({
			id: "evt-assigned",
			label: `Assigned to ${assigneeFullName}`,
			timestamp: timeStr,
		});
	}

	const currentLabels: Record<string, string> = {
		new: "Awaiting contact",
		contacted: "Lead contacted",
		qualified: "Lead qualified",
		inspection: "Inspection scheduled",
		negotiation: "Negotiation in progress",
		won: "Deal closed",
		lost: "Lead marked as lost",
	};

	events.push({
		id: "evt-current",
		label: currentLabels[status] ?? "Status updated",
		timestamp: status === "new" && !assigneeFullName ? "Now" : timeStr,
		isCurrent: true,
	});

	return events;
}

// ─── Mappers ──────────────────────────────────────────────────────────────

export function mapLeadRowToListRow(row: LeadQueryRow): LeadListRow {
	return {
		id: row.id,
		name: row.fullName,
		phone: row.phoneNumber ?? "—",
		projectPage: buildProjectPage(row.projectName, row.projectSlug),
		projectSlug: row.projectSlug ?? "",
		budget: row.budgetRange ?? "—",
		source: row.source as LeadSource,
		status: row.status as LeadStatus,
		assignedTo: row.assigneeFullName,
		assignedToId: row.assigneeId,
		date: formatDate(row.createdAt),
		time: formatTime(row.createdAt),
	};
}

export function mapLeadRowToDetail(row: LeadQueryRow): LeadDetail {
	const listRow = mapLeadRowToListRow(row);

	return {
		...listRow,
		initials: getInitials(row.fullName),
		email: row.email ?? "—",
		enquiredAt: formatFullDateTime(row.createdAt),
		enquiryType: row.enquiryType ?? "—",
		message: row.message ?? "",
		notes: row.notes,
		sourcePage: row.projectSlug ? `/projects/${row.projectSlug}` : "/contact",
		utmSource: row.utmSource ?? "",
		utmMedium: row.utmMedium ?? "",
		utmCampaign: row.utmCampaign ?? "",
		activityTimeline: buildActivityTimeline(
			row.status,
			row.source,
			row.assigneeFullName,
			row.createdAt,
		),
	};
}
