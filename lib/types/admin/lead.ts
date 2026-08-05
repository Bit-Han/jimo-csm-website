// "X" removed — not in the Postgres leadSourceEnum.
// Add it with a migration (ALTER TYPE lead_source ADD VALUE 'x')
// if you need Twitter/X tracking later.
export type LeadSource =
	| "website"
	| "landing_page"
	| "whatsapp"
	| "instagram"
	| "google"
	| "referral"
	| "brochure";

export type LeadStatus =
	| "new"
	| "contacted"
	| "qualified"
	| "inspection"
	| "negotiation"
	| "won"
	| "lost";

export interface LeadListRow {
	id: string;
	name: string;
	phone: string;
	// Computed: "Project Name · Source", "Landing Page Name · Landing Page",
	// or "General Enquiry". Built in the mapper from joined data.
	projectPage: string;
	projectSlug: string;
	budget: string;
	source: LeadSource;
	status: LeadStatus;
	assignedTo: string | null;
	date: string;
	time: string;
}

export interface LeadActivityEvent {
	id: string;
	label: string;
	timestamp: string;
	isCurrent?: boolean;
}

export interface LeadDetail extends LeadListRow {
	initials: string;
	email: string;
	location: string;
	enquiredAt: string;
	unitInterest: string;
	buyingPurpose: string;
	preferredPlan: string;
	message: string;
	notes: string | null; // append-only log, displayed in SalesNotesPanel
	landingPageSlug: string | null;
	sourcePage: string;
	utmSource: string;
	utmMedium: string;
	utmCampaign: string;
	device: string;
	referrer: string;
	activityTimeline: LeadActivityEvent[];
}

export interface LeadSummaryStats {
	newLeadsCount: number;
	newLeadsNote: string;
	qualifiedLeadsCount: number;
	qualifiedLeadsChange: string;
	crmConnected: boolean;
	crmSyncNote: string;
	totalSynced: number;
	totalLeads: number;
}

export interface LeadFilters {
	page?: number;
	status?: string;
	source?: string;
	projectSlug?: string;
	landingPageSlug?: string;
	search?: string;
	sort?: "newest" | "oldest";
}

export interface PaginatedLeadsResult {
	rows: LeadListRow[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
}

export interface LeadFilterOptions {
	projects: { slug: string; name: string }[];
	landingPages: { slug: string; name: string }[];
}

export interface AssignableAdmin {
	id: string;
	fullName: string;
}
